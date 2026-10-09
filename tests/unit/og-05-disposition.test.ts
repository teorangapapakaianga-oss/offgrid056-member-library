import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Stage 9.86 — OG-05 (legacy "5 Pillars Quick Reference") is MERGED CONCEPTUALLY: no standalone protected resource.
 * The decision, the content that is NOT CARRIED and the unmodified destinations are recorded and pinned here.
 */
const root = process.cwd();
const json = <T,>(p: string) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8")) as T;
const tasks = json<{ tasks: Record<string, unknown>[] }>("admin-import/config/future-tasks.json").tasks;
const decision = tasks.find((t) => t.id === "og-05-merged-conceptually") as { status: string; notCarried: string[]; uniqueKernel: string; registerTreatment: string };
const followUp = tasks.find((t) => t.id === "five-foundations-page-pointer") as { status: string; options: Record<string, string>; notDone: string };

describe("Stage 9.86 · OG-05 disposition", () => {
  it("is recorded as merged conceptually, with no resource, PDF, staging or deployment", () => {
    expect(decision.status).toMatch(/^DECIDED — MERGED CONCEPTUALLY \/ NO STANDALONE RESOURCE/);
    expect(decision.status).toMatch(/No protected res-ID, no NZ or AU PDF, not staged, not deployed/);
  });

  it("creates no OG-05 resource anywhere: no review config entry, no approved copy, no component decision, no demo data file", () => {
    expect(json<{ resources: Record<string, unknown> }>("admin-import/config/metadata-review.json").resources["OG-05"]).toBeUndefined();
    expect(json<{ changes: Record<string, unknown> }>("admin-import/config/approved-copy.json").changes["OG-05"]).toBeUndefined();
    expect(json<{ classificationsDecided: Record<string, string> }>("admin-import/config/program-components.json").classificationsDecided["OG-05"]).toBeUndefined();
    for (const slug of ["five-foundations-quick-reference", "5-pillars-quick-reference", "five-pillars-quick-reference"]) expect(fs.existsSync(path.join(root, `data/resources/${slug}.json`)), slug).toBe(false);
  });

  it("has no private record, no staged PDF and no res-ID for it (when the private assets are present)", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; slug: string });
    expect(recs.some((r) => r.legacyCode === "OG-05")).toBe(false);
    expect(recs).toHaveLength(30); // all 30 live (Stage 10.15)
    const pdfs = fs.readdirSync(path.join(root, "private-assets/resources"));
    expect(pdfs.filter((f) => /quick-reference|pillars/i.test(f))).toEqual([]);
  });

  it("records every item the owner named as NOT CARRIED", () => {
    const all = decision.notCarried.join(" | ");
    for (const needle of ["Rule of 3s", "survival thresholds", "fastest killers", "3 days without water", "3 weeks without food", "3–4 minutes", "3 litres", "10 litres", "10L", "30–50%", "7-day", "30-day", "rotation", "greywater", "canning", "Week", "Day 5 Complete", "Next: OG-06", "smoke-alarm", "carbon-monoxide", "Pillars"]) {
      expect(all, needle).toContain(needle);
    }
    expect(all).toMatch(/NOT CARRIED/);
  });

  it("preserves only the ranking concept, and names the Five Foundations, not the Pillars", () => {
    expect(decision.uniqueKernel).toMatch(/Rank the Five Foundations/);
    expect(decision.uniqueKernel).toMatch(/no checklist is migrated and no PDF/);
    expect(decision.uniqueKernel).not.toMatch(/\bPillars?\b/);
  });

  it("records the owner's register-only state (Stage 9.87): OG-05 is in the Merged section, never in Not started", () => {
    expect(decision.registerTreatment).toMatch(/REGISTER-ONLY state, 'MERGED \/ NO STANDALONE RESOURCE'/);
    expect(decision.registerTreatment).toMatch(/not a protected-resource status value/);
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr.split("## Merged / No standalone resource")[1].split("## Not started")[0]).toMatch(/\| OG-05 \| 5 Pillars Quick Reference \| \*\*MERGED \/ NO STANDALONE RESOURCE\*\*/);
    expect(rr.split("## Not started (13)")[1].split("## Route clashes")[0]).not.toMatch(/\| OG-05 \|/);
  });

  it("closes the follow-ups: the page pointer is done and DEPLOYED (Stage 9.88), and the supply-duration detector is implemented", () => {
    expect(followUp.status).toMatch(/^DONE in Stage 9\.87 — Option B, protected preview only/);
    expect(followUp.status).toMatch(/DEPLOYED in Stage 9\.88/);
    expect(followUp.notDone).toMatch(/No ranking interaction was created/);
    const supply = tasks.find((t) => t.id === "context-aware-duration-of-supply-claim-type") as { status: string; implementedIn: string };
    expect(supply.status).toMatch(/^DONE — implemented in Stage 9\.87/);
    expect(supply.implementedIn).toMatch(/numeric-supply\.test\.ts/);
  });

  it("leaves OG-01, res-0004 and programme day 3 untouched, and adds no ranking interaction to the Five Foundations page", () => {
    const demo = json<Record<string, unknown>>("data/resources/five-foundations-overview.json");
    expect(demo).toMatchObject({ id: "res-0004", slug: "five-foundations-overview", title: "Five Foundations Overview", isPlaceholder: true, status: "published", collections: ["start-here"], relatedResources: [] });
    expect(json<{ resourceIds: string[]; worksheet: { resourceId: string } }>("data/programme/days/day-03.json")).toMatchObject({ resourceIds: ["res-0004"], worksheet: { resourceId: "res-0004" } });
    const page = fs.readFileSync(path.join(root, "app/foundations/page.tsx"), "utf8");
    expect(page).not.toMatch(/Rank Your Foundations|use client|useState|localStorage/);
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const og01 = json<{ id: string; relatedResources: string[]; collections: string[] }>("private-assets/data-resources/home-resilience-scorecard.private.json");
      expect(og01).toMatchObject({ id: "res-1001", collections: ["start-here"] });
      expect(og01.relatedResources).toEqual(["res-1013", "res-1008", "res-1015", "res-1011", "res-1019", "res-1002"]);
    }
  });
});
