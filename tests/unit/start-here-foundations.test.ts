import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { inCollection, scorecardPointerHref } from "@/lib/content/collection-rules";

/**
 * Stage 9.87 — (1) the protected Start Here lists protected resources only; (2) the Five Foundations page points to the Home
 * Resilience Scorecard in the protected preview only; (3) nothing else moved: the demo placeholders, res-0004, programme day 3,
 * the route policy and OG-01 are as they were. The public/demo build is proved unchanged separately, by a before/after build.
 */
const root = process.cwd();
const json = <T,>(p: string) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8")) as T;
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

describe("Stage 9.87 · protected Start Here lists protected resources only", () => {
  const real = { collections: ["start-here"], isPlaceholder: false };
  const demo = { collections: ["start-here"], isPlaceholder: true };

  it("hides a demo placeholder in the private preview and lists a real member, never a non-member", () => {
    expect(inCollection(real, "start-here", { hidePlaceholders: true, privatePreview: true })).toBe(true);
    expect(inCollection(demo, "start-here", { hidePlaceholders: true, privatePreview: true })).toBe(false);
    expect(inCollection({ collections: ["planning-tools"], isPlaceholder: false }, "start-here", { hidePlaceholders: true, privatePreview: true })).toBe(false);
  });

  it("lists the demo placeholders exactly as before in the public demo build", () => {
    expect(inCollection(demo, "start-here", { hidePlaceholders: true, privatePreview: false })).toBe(true);
    expect(inCollection(real, "start-here", { hidePlaceholders: true, privatePreview: false })).toBe(true);
  });

  it("the page applies the rule, and keeps its footer and ordering", () => {
    const page = read("app/start-here/page.tsx");
    expect(page).toMatch(/inCollection\(r, "start-here", \{ hidePlaceholders: true, privatePreview \}\)/);
    expect(page).toContain("sort((a, b) => a.order - b.order)");
    expect(page).toContain("the Five Foundations");
  });

  it("the six demo placeholders keep their collections and their data, so nothing is deleted and the demo build still lists them", () => {
    const six: [string, string, string][] = [
      ["welcome-to-offgrid056", "res-0001", "Welcome to OffGrid056"],
      ["how-to-use-the-resource-library", "res-0002", "How to Use the Resource Library"],
      ["household-resilience-guide", "res-0003", "Household Resilience Guide"],
      ["five-foundations-overview", "res-0004", "Five Foundations Overview"],
      ["household-resilience-assessment", "res-0005", "Household Resilience Assessment"],
      ["build-your-first-30-day-action-plan", "res-0006", "Build Your First 30-Day Action Plan"],
    ];
    for (const [slug, id, title] of six) {
      const f = `data/resources/${slug}.json`;
      expect(fs.existsSync(path.join(root, f)), f).toBe(true);
      expect(json<Record<string, unknown>>(f), id).toMatchObject({ id, title, isPlaceholder: true, collections: expect.arrayContaining(["start-here"]) });
    }
  });

  it("the protected resources that belong on Start Here are exactly OG-01 and OG-02, when the private records are present", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string; title: string; collections?: string[] });
    expect(recs.filter((r) => r.collections?.includes("start-here")).map((r) => `${r.legacyCode} ${r.id} ${r.title}`).sort()).toEqual(["OG-01 res-1001 Home Resilience Scorecard", "OG-02 res-1002 Household Risk Identifier"]);
  });
});

describe("Stage 9.87 · the Five Foundations pointer (Option B), protected preview only", () => {
  const scorecard = { slug: "home-resilience-scorecard", isPlaceholder: false };

  it("points to the real scorecard's own route in the private preview", () => {
    expect(scorecardPointerHref({ privatePreview: true }, scorecard)).toBe("/resources/home-resilience-scorecard/");
  });

  it("is absent from the public/demo build: not the private preview, no scorecard in the build, or only a placeholder", () => {
    expect(scorecardPointerHref({ privatePreview: false }, scorecard)).toBeNull();
    expect(scorecardPointerHref({ privatePreview: true }, undefined)).toBeNull();
    expect(scorecardPointerHref({ privatePreview: false }, undefined)).toBeNull();
    expect(scorecardPointerHref({ privatePreview: true }, { slug: "home-resilience-scorecard", isPlaceholder: true })).toBeNull();
  });

  it("never links the demo route", () => {
    expect(scorecardPointerHref({ privatePreview: true }, scorecard)).not.toMatch(/demo-/);
  });

  it("the page carries the owner's wording, links the protected scorecard res-1001, and adds no ranking interaction", () => {
    const page = read("app/foundations/page.tsx");
    expect(page).toContain('const SCORECARD_ID = "res-1001"');
    expect(page).toContain("scorecardPointerHref({ privatePreview: isPrivatePreview() }, getResourceById(SCORECARD_ID))");
    expect(page).toContain("Not sure which foundation to start with?");
    expect(page).toContain("The Home Resilience Scorecard");
    expect(page).toContain("helps you identify your three priority foundations.");
    expect(page).not.toMatch(/use client|useState|localStorage|rank/i);
    expect(read("lib/member/store.ts")).not.toMatch(/foundationRank|priorityFoundations/i);
  });
});

describe("Stage 9.87 · nothing else moved", () => {
  it("res-0004 is still the Five Foundations Overview demo placeholder, with no protected counterpart and no route-policy entry", () => {
    expect(json<Record<string, unknown>>("data/resources/five-foundations-overview.json")).toMatchObject({ id: "res-0004", slug: "five-foundations-overview", title: "Five Foundations Overview", isPlaceholder: true, status: "published", collections: ["start-here"], relatedResources: [] });
    const policy = json<{ separateDemo?: Record<string, string>; supersedes?: Record<string, string> }>("lib/content/route-policy.json");
    expect(JSON.stringify(policy)).not.toMatch(/res-0004|five-foundations/);
    expect(policy.supersedes ?? {}).toEqual({});
  });

  it("programme day 3 is unchanged: demo content pointing at res-0004", () => {
    expect(json<Record<string, unknown>>("data/programme/days/day-03.json")).toMatchObject({ day: 3, week: 1, isPlaceholder: true, resourceIds: ["res-0004"], worksheet: { label: "Placeholder worksheet", resourceId: "res-0004" } });
  });

  it("the route policy still separates exactly the four demo placeholders it did, and nothing more", () => {
    const policy = json<{ separateDemo: Record<string, string> }>("lib/content/route-policy.json");
    expect(policy.separateDemo).toEqual({ "res-0007": "res-1001", "res-0015": "res-1008", "res-0016": "res-1010", "res-0013": "res-1013" });
  });

  it("OG-01 is unchanged: its related list and collection (when the private records are present)", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    expect(json<{ id: string; collections: string[]; relatedResources: string[] }>("private-assets/data-resources/home-resilience-scorecard.private.json")).toMatchObject({ id: "res-1001", collections: ["start-here"], relatedResources: ["res-1013", "res-1008", "res-1015", "res-1011", "res-1019", "res-1002"] });
  });
});
