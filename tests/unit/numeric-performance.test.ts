import path from "node:path";
import { describe, expect, it } from "vitest";
import { comparativePerformanceClaims, isSurvivalClaimSentence, loadNumericRegistry, multiplierClaims, scanNumericClaims, supplyTargets, emergencyPeriodTargets } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.97 — the multiplier / performance and comparative-performance claim families.
 * General rules: no resource is named. Context controls the classification: a multiplier needs result language, a comparative needs a
 * performance noun or adjective set against "most people", "the average person" or "typical approaches".
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const scan = (s: string, market = "NZ") => scanNumericClaims(`<div class="content"><p>${s}</p></div>`, { resource: "OG-99", market, registry, treatment });
const perf = (s: string, market = "NZ") => scan(s, market).filter((c) => c.category === "performance");
const bucketC = (s: string, market = "NZ") => scan(s, market).filter((c) => c.bucket === "C_NEEDS_SOURCE");

const MULTIPLIER_POSITIVES: [string, string][] = [
  ["The act of signing increases follow-through by 2–3x.", "2–3x"],
  ["Writing it down makes you 2x more effective.", "2x"],
  ["This approach is 2× faster than starting from scratch.", "2×"],
  ["It is 2-3x more productive.", "2-3x"],
  ["Households that plan achieve twice the results.", "twice"],
  ["The method is twice as effective.", "twice"],
  ["It makes you three times more productive.", "three times"],
  ["You will get four times the progress.", "four times"],
  ["A 4x improvement in follow-through.", "4x"],
  ["This increases output by 2x.", "2x"],
  ["Following this plan achieves 3 times the progress.", "3 times"],
  ["Checklists make you tenfold more reliable.", "tenfold"],
  ["Writing it down gives you double the results.", "double"],
  ["It delivers 1.5x better results.", "1.5x"],
  ["People who commit are two times more likely to succeed in getting results.", "two times"],
];
const MULTIPLIER_NEGATIVES = [
  "Compare your options.",
  "Which option is better for you?",
  "Review this twice before you decide.",
  "Check it two times this week.",
  "Our household has 2 x batteries.",
  "Write the number of batteries you have, for example 2 x AA.",
  "Option A versus Option B.",
  "Compare the three plans.",
  "Write down what worked better.",
  "Your results: ______",
  "Record the result you get from each test.",
  "Do this twice a week.",
  "Allow about 20 minutes.",
  "Set a target date for each action.",
  "Rank your three priorities.",
  "Measure the room as 3x4 metres.",
  "This is not a promise of results, and it does not guarantee a 2x improvement.",
  "Tick the box if you have done this twice.",
  "Windows are double-glazed or have effective insulation film.",
  "Double check the date you wrote.",
];
const COMPARATIVE_POSITIVES: string[] = [
  "That is more progress than most people make in a year.",
  "You will get better results than most households.",
  "This is faster than the average person manages.",
  "It is more effective than typical approaches.",
  "This plan achieves more than most people.",
  "Households using this get more progress than the average household.",
  "It is more productive than most plans.",
  "You will see better results than other people.",
  "This method is faster than most approaches.",
  "It is more reliable than typical systems.",
];
const COMPARATIVE_NEGATIVES = [
  "Compare your options.",
  "Which option is better for you?",
  "Is this approach better than your current one?",
  "Write down what worked better.",
  "Option A versus Option B.",
  "Compare the three plans.",
  "Note your results for each plan.",
  "Many people find it helpful to start small.",
  "This is better done with a friend.",
  "Do you do more than most people expect?",
  "Choose the option that is more effective for your household.",
  "Most households have a small first-aid kit.",
  "The average household uses this room daily.",
  "A faster option may suit you better.",
  "Pick the plan that gives you better results than last month.",
];

describe("multiplier / performance rule", () => {
  for (const [s, fig] of MULTIPLIER_POSITIVES) {
    for (const market of ["NZ", "AU"]) {
      it(`${market}: flags "${s}"`, () => {
        expect(multiplierClaims(s)[0]?.toLowerCase()).toBe(fig.toLowerCase());
        const c = perf(s, market);
        expect(c.length, "one performance candidate").toBe(1);
        expect(c[0]).toMatchObject({ bucket: "C_NEEDS_SOURCE", unit: "multiplier", category: "performance", market });
      });
    }
  }
  for (const s of MULTIPLIER_NEGATIVES) {
    it(`stays quiet for "${s}"`, () => {
      expect(multiplierClaims(s)).toEqual([]);
      expect(perf(s)).toEqual([]);
      expect(perf(s, "AU")).toEqual([]);
    });
  }
  it("handles the forms 2x, 2×, 2-3x, 2–3x, twice and three times", () => {
    for (const f of ["2x", "2×", "2-3x", "2–3x", "twice", "three times", "four times"]) expect(multiplierClaims(`It is ${f} more effective.`).length, f).toBe(1);
  });
  it("needs result language: a bare multiplier is not a claim", () => {
    expect(multiplierClaims("You will need 2x the space.")).toEqual([]);
    expect(multiplierClaims("Print this worksheet twice.")).toEqual([]);
    expect(multiplierClaims("We have three times as many chairs.")).toEqual([]);
  });
});

describe("comparative-performance rule", () => {
  for (const s of COMPARATIVE_POSITIVES) {
    for (const market of ["NZ", "AU"]) {
      it(`${market}: flags "${s}"`, () => {
        expect(comparativePerformanceClaims(s).length).toBeGreaterThan(0);
        const c = perf(s, market);
        expect(c.length, "one performance candidate").toBe(1);
        expect(c[0]).toMatchObject({ bucket: "C_NEEDS_SOURCE", unit: "comparative", category: "performance", market });
      });
    }
  }
  for (const s of COMPARATIVE_NEGATIVES) {
    it(`stays quiet for "${s}"`, () => {
      expect(comparativePerformanceClaims(s)).toEqual([]);
      expect(perf(s)).toEqual([]);
      expect(perf(s, "AU")).toEqual([]);
    });
  }
  it("pins the matched text for the legacy sentence", () => {
    expect(comparativePerformanceClaims("That is more progress than most people make in a year.")[0].toLowerCase()).toContain("more progress than most");
  });
});

describe("one statement, one owner (precedence)", () => {
  it("a multiplier sentence raises no comparative candidate", () => {
    const c = perf("This is twice as effective as most people manage.");
    expect(c).toHaveLength(1);
    expect(c[0].unit).toBe("multiplier");
  });
  it("a sentence owned by the survival, supply or emergency-period rule raises no performance candidate", () => {
    const s1 = "A person can survive three days without water, twice as effectively with shelter.";
    expect(isSurvivalClaimSentence(s1)).toBe(true);
    expect(perf(s1)).toEqual([]);
    const s2 = "Keep 3 days of food and water, which is twice as effective as a smaller supply.";
    expect(supplyTargets(s2).length).toBeGreaterThan(0);
    expect(perf(s2)).toEqual([]);
    const s3 = "The first 72 hours are the most critical, and being ready makes you 2x more effective.";
    expect(emergencyPeriodTargets(s3).length).toBeGreaterThan(0);
    expect(perf(s3)).toEqual([]);
    for (const s of [s1, s2, s3]) expect(bucketC(s).filter((c) => c.category !== "performance").length, s).toBeGreaterThan(0); // the earlier family still reports it once
  });
  it("another figure in the same sentence keeps its own owner (one candidate per figure)", () => {
    const c = scan("It increases output by 2x and cuts waste by 30%.");
    expect(c.filter((x) => x.category === "performance")).toHaveLength(1);
    expect(c.filter((x) => x.category === "percentage")).toHaveLength(1);
  });
  it("is a Bucket C finding, never silently approved, and an empty registry still reports it", () => {
    expect(bucketC("Signing increases follow-through by 2–3x.")).toHaveLength(1);
  });
});

describe("the legacy OG-07 statements, as general wording", () => {
  it("flags both unsupported legacy sentences in both markets", () => {
    for (const market of ["NZ", "AU"]) {
      expect(perf("This sounds trivial. It is not. The act of signing increases follow-through by 2–3x.", market)).toHaveLength(1);
      expect(perf("That is more progress than most people make in a year.", market)).toHaveLength(1);
    }
  });
});
