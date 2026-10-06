import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { safetyExposureFor, safetyTopicMentions } from "@/admin-import/audit/group-a";
import { fuelSafetyFindings, memberFacingText } from "@/admin-import/pilot/prep";
import { reskinHtml } from "@/admin-import/reskin/reskin";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.67 — OG-01 Home Resilience Scorecard: claims-first audit facts.
 *
 * Nothing here migrates OG-01. These pin what the audit found in the legacy source (when the private working copy has
 * it), so a later rebuild can be compared with them, and so a detector gap found during the audit is recorded rather
 * than forgotten.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const candidates = path.join(root, "workspace/candidates.json");

function legacy(): string | null {
  if (!fs.existsSync(candidates)) return null;
  const list = JSON.parse(fs.readFileSync(candidates, "utf8")) as { source: { path: string; filename: string; extension: string } }[];
  const f = list.find((c) => c.source.filename.startsWith("OG-01_") && /\.html?$/i.test(c.source.extension));
  return f ? fs.readFileSync(f.source.path, "utf8") : null;
}
const scan = (html: string, market: string) => scanNumericClaims(html, { resource: "OG-01", market, registry, treatment });

describe("Stage 9.67 · numeric detector: 'N+ unit' quantities are now seen", () => {
  it("reads '7+ days' and 'R-3.3+' as figures instead of ignoring the plus", () => {
    const html = `<div class="content"><p>7+ days of non-perishable food stored and accessible</p></div>`;
    expect(scan(html, "NZ").map((c) => c.figure)).toContain("7+ days");
  });

  it("RECORDED GAP (not fixed here): a bare stored-quantity phrase is still classed 'a duration in passing'", () => {
    // "7+ days of food stored" asserts how much to hold, but carries no interval verb the gate knows, so it is bucket D.
    // A rule that always treats "<N> days of food/water/fuel" as a claim would catch it, and would also flag live OG-11's
    // reassurance "You do not need to buy 30 days of food in one shop." — an owner decision, so the rule is NOT applied.
    const html = `<div class="content"><p>7+ days of non-perishable food stored and accessible</p></div>`;
    expect(scan(html, "NZ").find((c) => c.figure === "7+ days")?.bucket).toBe("D_NOT_A_CLAIM");
    const og11 = `<div class="content"><p>You do not need to buy 30 days of food in one shop.</p></div>`;
    expect(scan(og11, "NZ").find((c) => c.figure === "30 days")?.bucket).toBe("D_NOT_A_CLAIM");
  });
});

describe("Stage 9.67 · the legacy OG-01 source, when the working copy has it", () => {
  const html = legacy();

  it("is a ten-question, two-per-foundation scorecard marked out of 100", () => {
    if (!html) return;
    const text = memberFacingText(html);
    for (const pillar of ["AIR", "WATER", "SHELTER", "FOOD", "ENERGY"]) expect(text, pillar).toContain(pillar);
    expect((text.match(/\b(?:[1-9]|10)\. [A-Z0-9]/g) ?? []).length).toBe(10);
    expect(text).toMatch(/Total possible score: 100 points/);
  });

  it("carries TWO different band systems that do not line up (per-question and total)", () => {
    if (!html) return;
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(text).toMatch(/1[–-]3[\s\S]*Critical Gap/);
    expect(text).toMatch(/0[–-]30 = Critical \| 31[–-]50 = Vulnerable \| 51[–-]70 = Developing \| 71[–-]85 = Capable \| 86[–-]100 = Resilient/);
  });

  it("requires exactly the electrical and fire topics from its source text — and no others", () => {
    if (!html) return;
    const cands = JSON.parse(fs.readFileSync(candidates, "utf8")) as { candidateId: string; source: { filename: string } }[];
    const store = JSON.parse(fs.readFileSync(path.join(root, "workspace/text/extracted.json"), "utf8")) as Record<string, unknown>;
    const texts = ("texts" in store ? (store as { texts: Record<string, string> }).texts : store) as Record<string, string>;
    const extracted = cands.filter((c) => c.source.filename.startsWith("OG-01_")).map((c) => texts[c.candidateId] ?? "").join("\n");
    expect(safetyExposureFor(extracted).sort()).toEqual(["batteries-and-electrical", "fire-and-emergency"]);
    expect(fuelSafetyFindings(html), "no gas content").toEqual([]);
  });

  it("the exact triggers: solar + battery (electrical) and 'smoke alarm' + the heading 'Quick-Fire' (fire)", () => {
    if (!html) return;
    const text = memberFacingText(reskinHtml(html, { strapline: "x" }).html);
    expect(safetyTopicMentions(text, "batteries-and-electrical").map((m) => m.toLowerCase())).toEqual(expect.arrayContaining(["solar", "battery"]));
    const fire = safetyTopicMentions(text, "fire-and-emergency").map((m) => m.toLowerCase());
    expect(fire).toContain("smoke alarm");
    // "Quick-Fire Household Facts" is a heading, not fire safety — a false positive the migration should not rely on.
    expect(fire).toContain("fire");
    expect(safetyTopicMentions(text, "carbon-monoxide"), "carbon monoxide has no topic detector").toEqual([]);
  });

  it("has exactly one registry-blocked figure pair: the water baseline (10L per person per day, 3 days) — no prices, no percentages", () => {
    if (!html) return;
    for (const m of ["NZ", "AU"]) {
      const all = scan(html, m);
      const c = all.filter((x) => x.bucket === "C_NEEDS_SOURCE").map((x) => x.figure).sort();
      expect(c, m).toEqual(["10L", "3 days"]);
      expect(all.some((x) => x.category === "currency" || x.category === "percentage"), `${m}: no money or percentages`).toBe(false);
    }
  });
});
