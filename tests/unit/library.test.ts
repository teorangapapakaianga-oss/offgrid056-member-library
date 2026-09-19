import { describe, expect, it } from "vitest";
import { getSummaries } from "@/lib/content/repository";
import { getFoundation, inCategory } from "@/lib/content/taxonomy";
import { applyFilters, facetCounts, parseFilters, serializeFilters, EMPTY_FILTERS } from "@/lib/filters";
import { formatMinutes, isNewResource } from "@/lib/format";
import { foundationProgress, nextRecommended } from "@/lib/progress";
import { createSearch, expandQuery } from "@/lib/search";

const items = getSummaries();
const ctx = { now: new Date("2026-09-20T12:00:00Z"), completed: new Set<string>() };

describe("filters", () => {
  it("round-trips through the URL and drops unknown values", () => {
    const f = parseFilters(new URLSearchParams("q=tank&foundation=water,bogus&type=checklist&time=10-30"));
    expect(f).toEqual({ ...EMPTY_FILTERS, q: "tank", foundation: ["water"], type: ["checklist"], time: ["10-30"] });
    expect(parseFilters(new URLSearchParams(serializeFilters(f)))).toEqual(f);
  });

  it("ORs within a group and ANDs across groups", () => {
    const f = { ...EMPTY_FILTERS, foundation: ["water", "air"], type: ["checklist"] };
    const out = applyFilters(items, f, ctx);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((r) => ["water", "air"].includes(r.foundation) && r.resourceType === "checklist")).toBe(true);
  });

  it("uses the time bands from the brief", () => {
    const f = { ...EMPTY_FILTERS, time: ["under-10"] };
    expect(applyFilters(items, f, ctx).every((r) => r.estimatedTime < 10)).toBe(true);
  });

  it("treats Completed / Not completed from member state", () => {
    const done = { ...ctx, completed: new Set(["res-0001"]) };
    expect(applyFilters(items, { ...EMPTY_FILTERS, status: ["completed"] }, done).map((r) => r.id)).toEqual(["res-0001"]);
    expect(applyFilters(items, { ...EMPTY_FILTERS, status: ["not-completed"] }, done).some((r) => r.id === "res-0001")).toBe(false);
  });

  it("never marks anything New without a browser clock", () => {
    expect(applyFilters(items, { ...EMPTY_FILTERS, status: ["new"] }, { ...ctx, now: null })).toHaveLength(0);
  });

  it("facet counts ignore their own group", () => {
    const counts = facetCounts(items, { ...EMPTY_FILTERS, foundation: ["water"] }, ctx);
    expect(counts.foundation.air).toBeGreaterThan(0);
  });
});

describe("search", () => {
  const search = createSearch(items);
  const titles = (q: string) => (search(q) ?? []).map((id) => items.find((r) => r.id === id)!.title);

  it("finds by prefix and ranks title matches first", () => {
    expect(titles("rainw")[0]).toBe("Rainwater Harvesting Planner");
  });
  it("maps market spellings both ways", () => {
    expect(expandQuery("mold")).toContain("mould");
    expect(titles("mold")).toContain("Dampness & Moisture Check");
    expect(titles("flashlight")).toContain("Household Lighting Checklist");
    expect(titles("power cut")).toContain("Energy Backup Guide");
  });
  it("tolerates small typos", () => {
    expect(titles("pantri")).toContain("Pantry Rotation Worksheet");
  });
  it("returns null for an empty query", () => {
    expect(search("   ")).toBeNull();
  });
});

describe("taxonomy and progress", () => {
  it("fills type-based categories automatically", () => {
    const water = getFoundation("water");
    const worksheets = water.categories.find((c) => c.slug === "water-worksheets")!;
    expect(items.filter((r) => inCategory(r, "water", worksheets)).map((r) => r.slug)).toContain("water-storage-calculator");
  });
  it("recommends the next learning-path step first", () => {
    const water = items.filter((r) => r.foundation === "water");
    const path = ["res-0015", "res-0014"];
    expect(nextRecommended(water, new Set(), path)?.id).toBe("res-0015");
    expect(nextRecommended(water, new Set(["res-0015"]), path)?.id).toBe("res-0014");
  });
  it("computes foundation progress", () => {
    const p = foundationProgress(items, "water", new Set(["res-0014"]));
    expect(p.completed).toBe(1);
    expect(p.percent).toBe(Math.round((1 / p.total) * 100));
  });
  it("formats time and New correctly", () => {
    expect(formatMinutes(90)).toBe("1 h 30 min");
    expect(isNewResource({ newOverride: null, publishedDate: "2026-09-01" }, ctx.now)).toBe(true);
    expect(isNewResource({ newOverride: null, publishedDate: "2026-07-01" }, ctx.now)).toBe(false);
    expect(isNewResource({ newOverride: true, publishedDate: "2020-01-01" }, ctx.now)).toBe(true);
  });
});
