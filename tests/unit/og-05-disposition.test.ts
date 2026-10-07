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
    expect(recs).toHaveLength(25);
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

  it("does not invent a register status: the register's own states are unchanged and the proposal is only recorded", () => {
    expect(decision.registerTreatment).toMatch(/no 'merged' value/);
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr).toMatch(/\| OG-05 \| 5 Pillars Quick Reference \|/); // still in Not started, as before
    expect(rr).not.toMatch(/MERGED CONCEPTUALLY/);
  });

  it("leaves the Five Foundations page, OG-01, res-0004 and programme day 3 untouched; the page pointer is only an open follow-up", () => {
    expect(followUp.status).toMatch(/^NOT STARTED/);
    expect(followUp.notDone).toMatch(/unchanged/);
    const demo = json<Record<string, unknown>>("data/resources/five-foundations-overview.json");
    expect(demo).toMatchObject({ id: "res-0004", slug: "five-foundations-overview", title: "Five Foundations Overview", isPlaceholder: true, status: "published", collections: ["start-here"], relatedResources: [] });
    expect(json<{ resourceIds: string[]; worksheet: { resourceId: string } }>("data/programme/days/day-03.json")).toMatchObject({ resourceIds: ["res-0004"], worksheet: { resourceId: "res-0004" } });
    const page = fs.readFileSync(path.join(root, "app/foundations/page.tsx"), "utf8");
    expect(page).not.toMatch(/Scorecard|Rank Your Foundations|isPrivatePreview/);
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const og01 = json<{ id: string; relatedResources: string[]; collections: string[] }>("private-assets/data-resources/home-resilience-scorecard.private.json");
      expect(og01).toMatchObject({ id: "res-1001", collections: ["start-here"] });
      expect(og01.relatedResources).toEqual(["res-1013", "res-1008", "res-1015", "res-1011", "res-1019", "res-1002"]);
    }
  });
});
