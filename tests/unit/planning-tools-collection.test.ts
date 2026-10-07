import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { inCollection } from "@/lib/content/collection-rules";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 9.78B — the Planning Tools collection lists the real planning resources, and the protected preview does not present
 * demonstration placeholders as normal member resources there. A listing correction only: no new collection, no component change.
 */
const root = process.cwd();

describe("Stage 9.78B · the collection listing rule", () => {
  const real = { collections: ["planning-tools"], isPlaceholder: false };
  const demo = { collections: ["planning-tools"], isPlaceholder: true };
  const other = { collections: ["start-here"], isPlaceholder: false };

  it("lists a real member of the collection, and never a non-member", () => {
    for (const privatePreview of [true, false]) {
      expect(inCollection(real, "planning-tools", { hidePlaceholders: true, privatePreview })).toBe(true);
      expect(inCollection(other, "planning-tools", { hidePlaceholders: true, privatePreview })).toBe(false);
      expect(inCollection({ isPlaceholder: false }, "planning-tools", { hidePlaceholders: true, privatePreview })).toBe(false);
    }
  });

  it("hides a demo placeholder from the protected preview listing", () => {
    expect(inCollection(demo, "planning-tools", { hidePlaceholders: true, privatePreview: true })).toBe(false);
  });

  it("still lists the demo placeholder in the public demo build, and wherever hiding is not asked for", () => {
    expect(inCollection(demo, "planning-tools", { hidePlaceholders: true, privatePreview: false })).toBe(true);
    expect(inCollection(demo, "planning-tools", { privatePreview: true })).toBe(true);
    expect(inCollection(demo, "start-here", { hidePlaceholders: true, privatePreview: true })).toBe(false); // not a member of that collection
  });

  it("only the Planning Tools page asks for hiding; Start Here is untouched", () => {
    expect(fs.readFileSync(path.join(root, "app/planning-tools/page.tsx"), "utf8")).toMatch(/inCollection\(r, "planning-tools", \{ hidePlaceholders: true/);
    expect(fs.readFileSync(path.join(root, "app/start-here/page.tsx"), "utf8")).not.toMatch(/inCollection|hidePlaceholders/);
  });

  it("introduces no new collection and no new programme component", () => {
    expect([...COLLECTION_IDS]).toEqual(["start-here", "planning-tools"]);
    expect([...PROGRAM_COMPONENTS]).toEqual(["off-grid-living", "resilience-planning", "resilience-emergency", "planning-implementation", "advanced-future"]);
  });
});

describe("Stage 9.78B · the demo data is not edited", () => {
  const dir = path.join(root, "data/resources");
  const demo = (slug: string) => JSON.parse(fs.readFileSync(path.join(dir, `${slug}.json`), "utf8")) as { id: string; collections: string[]; isPlaceholder: boolean };

  it("the four placeholders keep their collections, so the public demo build still shows them", () => {
    expect(demo("household-resilience-assessment")).toMatchObject({ id: "res-0005", isPlaceholder: true, collections: ["start-here", "planning-tools"] });
    expect(demo("build-your-first-30-day-action-plan")).toMatchObject({ id: "res-0006", isPlaceholder: true, collections: ["start-here", "planning-tools"] });
    expect(demo("30-day-action-planner")).toMatchObject({ id: "res-0008", isPlaceholder: true, collections: ["planning-tools"] });
    expect(demo("household-contacts-template")).toMatchObject({ id: "res-0009", isPlaceholder: true, collections: ["planning-tools"] });
  });
});

const recDir = path.join(root, "private-assets/data-resources");
describe.skipIf(!fs.existsSync(recDir))("Stage 9.78B · the protected records", () => {
  const recs = fs.readdirSync(recDir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(recDir, f), "utf8")) as { id: string; legacyCode: string; title: string; collections: string[]; programComponent: string; relatedResources: string[] });
  const by = (code: string) => recs.find((r) => r.legacyCode === code)!;

  it("exactly seven protected resources are in Planning Tools, with these ids and titles", () => {
    const members = recs.filter((r) => r.collections?.includes("planning-tools")).map((r) => `${r.legacyCode} ${r.id} ${r.title}`).sort();
    expect(members).toEqual([
      "OG-22 res-1022 Resilience Product Wishlist",
      "OG-25 res-1025 Project Support Brief Template",
      "OG-26 res-1026 3-Tier Budget Planner",
      "OG-27 res-1027 90-Day Implementation Roadmap",
      "OG-03 res-1003 Household Spending Capacity Check",
      "OG-B04 res-1504 Monthly Planning Challenge Template",
      "OG-B10 res-1510 90-Day Implementation Roadmap (Advanced)",
    ].sort());
  });

  it("the other protected resources are not in Planning Tools, and Start Here is unchanged (OG-01 and OG-02 only)", () => {
    for (const r of recs) if (!["OG-03", "OG-22", "OG-25", "OG-26", "OG-27", "OG-B04", "OG-B10"].includes(r.legacyCode)) expect(r.collections ?? [], r.legacyCode).not.toContain("planning-tools");
    expect(recs.filter((r) => r.collections?.includes("start-here")).map((r) => r.legacyCode).sort()).toEqual(["OG-01", "OG-02"]);
  });

  it("the seven records carry no collection other than planning-tools", () => {
    for (const code of ["OG-03", "OG-22", "OG-25", "OG-26", "OG-27", "OG-B04", "OG-B10"]) expect(by(code).collections, code).toEqual(["planning-tools"]);
  });

  it("Program Components are unchanged — OG-22 stays resilience-planning", () => {
    expect(by("OG-22").programComponent).toBe("resilience-planning");
    for (const code of ["OG-03", "OG-25", "OG-26", "OG-27", "OG-B04", "OG-B10"]) expect(by(code).programComponent, code).toBe("planning-implementation");
    expect(by("OG-B12").programComponent).toBe("advanced-future");
    expect(by("OG-01").programComponent).toBe("resilience-planning");
    expect(by("OG-02").programComponent).toBe("resilience-planning");
  });

  it("OG-03's six related links are unchanged and the Advanced roadmap is not one of them", () => {
    expect(by("OG-03").relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1026", "res-1027", "res-1025"]);
  });
});
