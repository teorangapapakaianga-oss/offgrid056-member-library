import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isSurvivalClaimSentence, loadNumericRegistry, scanNumericClaims, type NumericCandidate } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.86 — survival and deprivation durations are factual claim candidates.
 *
 * Stage 9.85 found that "3 days without water" and "3 weeks without food" were filed as D_NOT_A_CLAIM ("a duration in passing"),
 * so a legacy "Rule of 3s" passed the numeric scanner unseen. The rule describes the claim PATTERN, so these tests use many
 * numbers, units, markets and word orders rather than the one document, and prove that ordinary scheduling language is left alone.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const scan = (text: string, market = "NZ", resource = "OG-99"): NumericCandidate[] =>
  scanNumericClaims(`<div class="content"><p>${text}</p></div>`, { resource, market, registry, treatment });
const buckets = (text: string, market = "NZ") => scan(text, market).map((c) => c.bucket);

describe("a survival or deprivation duration is a claim candidate (positive)", () => {
  const patterns: [string, string][] = [
    ["N days without water", "A person can last {n} days without water."],
    ["N days without food", "Most people can go {n} days without food."],
    ["N weeks without food", "{n} weeks without food (survival mode)"],
    ["N minutes without air", "{n} minutes without clean air"],
    ["N minutes without oxygen", "Brain damage can follow {n} minutes without oxygen."],
    ["N hours without shelter", "{n} hours without shelter in extreme cold."],
    ["N hours without heat", "Within {n} hours without heat the body loses warmth."],
    ["N hours without warmth", "After {n} hours without warmth, take action."],
    ["a survival statement about a person", "A person cannot survive beyond {n} days in these conditions."],
    ["exposure to extreme cold or heat", "{n} hours in extreme cold or heat is the limit."],
    ["a question about the body", "Can a person survive {n} days without water?"],
    ["an outcome word with a duration", "Hypothermia can set in within {n} hours."],
    ["dehydration", "Dehydration becomes serious after {n} days."],
  ];
  for (const [name, template] of patterns) {
    it(`flags: ${name}`, () => {
      for (const n of ["2", "3", "3–4", "10", "36"]) for (const market of ["NZ", "AU"]) {
        const text = template.replace("{n}", n);
        const found = scan(text, market).filter((c) => c.category === "interval");
        expect(found.length, `${market}: ${text}`).toBeGreaterThan(0);
        expect(found.every((c) => c.bucket === "C_NEEDS_SOURCE"), `${market}: ${text}`).toBe(true);
        expect(found[0].why).toMatch(/survival or deprivation-outcome/);
      }
    });
  }

  it("flags spelled-out numbers and every unit the scanner reads", () => {
    for (const t of ["Three days without water is the limit.", "A person can go three weeks without food.", "Four minutes without air is dangerous.", "Six hours without shelter is risky.", "She had gone 2 days without drinking water."]) {
      expect(buckets(t), t).toContain("C_NEEDS_SOURCE");
    }
  });

  it("flags each interval of a 'Rule of 3s' style line separately", () => {
    const found = scan("3 minutes without air — 3 hours without shelter — 3 days without water — 3 weeks without food.").filter((c) => c.category === "interval");
    expect(found.map((c) => c.figure).sort()).toEqual(["3 days", "3 hours", "3 minutes", "3 weeks"]);
    expect(found.every((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
  });

  it("flags the table row wording the legacy source used, without depending on its exact phrases", () => {
    for (const t of ["3–4 minutes without clean air", "3–4 hours in extreme cold/heat without shelter", "3 days without water", "3 weeks without food (survival mode)"]) {
      expect(buckets(t, "AU"), t).toContain("C_NEEDS_SOURCE");
    }
  });
});

describe("ordinary scheduling and planning language is left alone (negative)", () => {
  const harmless = [
    "90-Day Implementation Roadmap",
    "Keep the 90-Day Implementation Roadmap beside your plan.",
    "OffGrid056 30-Day Programme",
    "Complete this in 10 minutes.",
    "This worksheet takes about 15 minutes.",
    "Plan your next 30 days.",
    "Set aside a Saturday and finish the worksheet in 2 hours.",
    "The upgrade will not leave you without water damage for 5 years.",
    "Plan 14 days of meals without food waste.",
    "The system runs for 12 hours without heat loss.",
    // a readiness scenario the member plans for (in a live resource), not a claim about what the body withstands
    "Can the household survive 72 hours off-grid with only what is on-site?",
    "Can your household survive 3 days off-grid on what you store?",
    "Plan for 72 hours of cooking without the grid.",
  ];
  for (const t of harmless) {
    it(`does not flag as survival: ${t}`, () => {
      expect(isSurvivalClaimSentence(t), t).toBe(false);
      const found = scan(t).filter((c) => c.category === "interval");
      expect(found.some((c) => /survival or deprivation-outcome/.test(c.why)), t).toBe(false);
    });
  }

  it("keeps these as 'a duration in passing' or a planning horizon exactly as before", () => {
    expect(buckets("Complete this in 10 minutes.")).toEqual(["D_NOT_A_CLAIM"]);
    expect(buckets("OffGrid056 30-Day Programme")).toEqual(["D_NOT_A_CLAIM"]);
  });

  it("does not change an approved, sourced baseline: New Zealand's three-litre figure still reads as sourced for OG-08", () => {
    const found = scanNumericClaims(`<div class="content"><p>Store at least 3 litres of drinking water per person per day, for at least three days.</p></div>`, { resource: "OG-08", market: "NZ", registry, treatment });
    expect(found.map((c) => c.bucket)).toContain("A_ALREADY_SOURCED");
    expect(found.some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(false);
  });

  it("does not turn safety-block wording or treatment-owned figures into survival findings", () => {
    const found = scanNumericClaims(`<div class="content"><p>Boil the water for seven minutes before drinking, or the water may cause dehydration.</p></div>`, { resource: "OG-09", market: "NZ", registry, treatment });
    expect(found.every((c) => c.bucket === "E_TREATMENT_OWNED")).toBe(true);
  });
});

describe("the rule reads the claim, not the document", () => {
  it("the detector code names no resource and none of the legacy wording", () => {
    const src = fs.readFileSync(path.join(root, "admin-import/audit/numeric.ts"), "utf8");
    const block = src.slice(src.indexOf("const DEPRIVATION"), src.indexOf("export const isSurvivalClaimSentence"));
    expect(block).not.toMatch(/OG-0?5|Pillar|Rule of 3|fastest killers/i);
  });
});
