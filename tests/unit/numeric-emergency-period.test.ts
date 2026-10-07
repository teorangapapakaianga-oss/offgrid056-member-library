import path from "node:path";
import { describe, expect, it } from "vitest";
import { emergencyPeriodTargets, loadNumericRegistry, scanNumericClaims, supplyTargets, type NumericCandidate } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.91 — emergency-period claims, the third family beside survival-duration (9.86) and supply-duration (9.87).
 *
 * Stage 9.90 found that "the first 72 hours are the most critical", "help may not reach you for 3 days", "survive the worst 3 days" and
 * "3 days of meals" / "a 3-day supply of formula" passed the numeric scanner as durations in passing. The rule reads wording, not a document,
 * so these tests use many numbers, units, word orders and both markets, and prove that titles, programme names, schedules, completion times,
 * deadlines, plans, member blanks and roadmap names are left alone.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const scan = (text: string, market = "NZ", resource = "OG-99"): NumericCandidate[] =>
  scanNumericClaims(`<div class="content"><p>${text}</p></div>`, { resource, market, registry, treatment });
const FAMILIES = /survival or deprivation-outcome|supply-duration target|emergency-period claim/;
const claimed = (text: string, market = "NZ") => scan(text, market).filter((c) => c.category === "interval" && FAMILIES.test(c.why));

describe("an emergency-period claim is a candidate that needs a source (positive)", () => {
  const targets: [string, string][] = [
    ["the first N hours are critical", "The first {n} hours are the most critical."],
    ["the first N days are critical", "The first {n} days are crucial."],
    ["help may not arrive for N days", "Help may not arrive for {n} days."],
    ["help may not reach you for N days", "Help may not reach you for {n} days."],
    ["emergency services may take N days", "Emergency services may take up to {n} days to reach you."],
    ["prepare to manage for N days", "Prepare to manage for {n} days."],
    ["survive for N days", "You may need to survive for {n} days."],
    ["survive the worst N days", "This ensures you can survive and communicate through the worst {n} days without outside help."],
    ["be self-sufficient for N days", "Be self-sufficient for {n} days."],
    ["without outside help for N days", "Plan to cope without outside help for {n} days."],
    ["the N-hour window is the critical period", "The {n}-hour window is the critical self-sufficiency period."],
    ["prepare for N days", "Prepare for {n} days."],
    ["N days of meals", "Keep {n} days of meals that need no refrigeration."],
    ["N-day supply of formula", "Infant diet: {n}-day supply of formula, or special items."],
    ["N-day supply of pet food", "Pet needs: a {n}-day supply of pet food."],
    ["N days of emergency supplies", "Keep {n} days of emergency supplies."],
    ["enough supplies for N days", "Keep enough supplies for {n} days."],
    ["an emergency kit for N days", "Keep an emergency kit for {n} days."],
  ];
  for (const [name, template] of targets) {
    it(`flags: ${name}`, () => {
      for (const n of ["2", "3", "7", "14", "72"]) for (const market of ["NZ", "AU"]) {
        const text = template.replace("{n}", n);
        const found = claimed(text, market);
        expect(found.length, `${market}: ${text}`).toBeGreaterThan(0);
        expect(found.every((c) => c.bucket === "C_NEEDS_SOURCE"), `${market}: ${text}`).toBe(true);
      }
    });
  }

  it("reads singular and plural hours, days and weeks, and a plus or a range", () => {
    for (const t of ["The first 1 hour is critical.", "The first 24 hours are critical.", "Help may not reach you for 1 day.", "Help may not reach you for 2 weeks.", "Prepare for 3–5 days.", "Prepare for 7+ days.", "Keep a 1-day supply of formula."]) {
      expect(claimed(t).length, t).toBeGreaterThan(0);
    }
  });

  it("reads spelled-out numbers where the scanner supports them", () => {
    for (const t of ["The first seventy-two hours are the most critical.", "Help may not reach you for three days.", "Survive the worst three days.", "Keep seven days of meals.", "Keep a three-day supply of pet food.", "Prepare to manage for ten days.", "Keep an emergency kit for two weeks."]) {
      expect(claimed(t).length, t).toBeGreaterThan(0);
    }
  });

  it("pins the exact text read as the claim, so the rule describes wording and not a document", () => {
    expect(emergencyPeriodTargets("The first 72 hours are the most critical.")).toEqual(["The first 72 hours are the most critical"]);
    expect(emergencyPeriodTargets("Help may not reach you for 3 days.")).toEqual(["Help may not reach you for 3 days"]);
    expect(emergencyPeriodTargets("Survive the worst 3 days.")).toEqual(["Survive the worst 3 days"]);
    expect(supplyTargets("A 3-day supply of formula.")).toEqual(["3-day supply of formula"]);
    expect(supplyTargets("3 days of meals that need no refrigeration or cooking")).toEqual(["3 days of meals"]);
  });

  it("is not tied to any resource or to the legacy wording in the detector code", async () => {
    const src = (await import("node:fs")).readFileSync(path.join(root, "admin-import/audit/numeric.ts"), "utf8");
    const block = src.slice(src.indexOf("const EP_FIG"), src.indexOf("export function emergencyPeriodTargets"));
    expect(block).not.toMatch(/OG-0?6|72[- ]hour checklist|Asset OG|Day 6|OffGrid056/i);
  });
});

describe("ordinary wording is left alone (negative)", () => {
  const titles = ["72-Hour Emergency Checklist", "Emergency Readiness Checklist", "72-Hour Emergency Action Checklist", "30-Day Pantry Builder", "90-Day Implementation Roadmap", "OffGrid056 30-Day Programme", "My 72-Hour Kit Location", "Water — 72 Hour Checklist"];
  const schedules = ["Day 6", "Week 1", "Day 6 Complete", "Week 1 Priority Lock Worksheet"];
  const completion = ["Complete this in 20 minutes.", "This takes about 20 minutes.", "Review this in 3 days.", "Allow 3 days for delivery.", "We will review the list in 7 days."];
  const plans = ["Write your 7-day plan.", "Your 7-day plan starts on Monday.", "Plan 7 days of meals.", "Set a 14-day goal for the roadmap."];
  const blanks = ["Days we could manage on our own: ____", "How many days could your household manage?", "Write the number of days: ____"];
  const reassurance = ["You do not need to prepare for 14 days to start.", "Help is rarely this slow.", "There is no need to keep a 30-day supply of formula."];
  const steps = ["The first 3 steps are the most important.", "The first 10 minutes cover the key points."];
  for (const [label, group] of Object.entries({ "titles and programme names": titles, "schedule labels": schedules, "completion times and deadlines": completion, plans, "member input and questions": blanks, "negated or reassuring": reassurance, "ordinal steps": steps })) {
    for (const t of group) {
      it(`does not flag (${label}): ${t}`, () => {
        expect(emergencyPeriodTargets(t), t).toEqual([]);
        expect(claimed(t), t).toEqual([]);
      });
    }
  }

  it("keeps the legacy title and programme labels as non-claims, exactly as before", () => {
    for (const t of ["72-Hour Emergency Checklist", "30-Day Pantry Builder", "OffGrid056 30-Day Programme", "Complete this in 20 minutes."]) {
      expect(scan(t).every((c) => c.bucket !== "C_NEEDS_SOURCE"), t).toBe(true);
    }
  });

  it("does not disturb the sourced baselines or the earlier families", () => {
    const nz = scanNumericClaims(`<div class="content"><p>Store at least 3 litres of drinking water per person per day, for at least three days.</p></div>`, { resource: "OG-08", market: "NZ", registry, treatment });
    expect(nz.map((c) => c.bucket)).toContain("A_ALREADY_SOURCED");
    expect(nz.some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(false);
    expect(claimed("A person can last 3 days without water.").some((c) => /survival or deprivation-outcome/.test(c.why))).toBe(true);
    expect(claimed("Keep a 30-day food supply.").some((c) => /supply-duration target/.test(c.why))).toBe(true);
    expect(scan("You do not need to buy 30 days of food in one shop.").find((c) => c.figure === "30 days")?.bucket).toBe("D_NOT_A_CLAIM");
    expect(scan("Plan 7 days of meals.").every((c) => c.bucket !== "C_NEEDS_SOURCE")).toBe(true);
  });

  it("still passes the live households' readiness question: 'Can the household survive 72 hours off-grid…?' is a question", () => {
    expect(claimed("Can the household survive 72 hours off-grid with only what is on-site?")).toEqual([]);
  });
});

describe("one statement, one owner: the three families do not double up", () => {
  it("survival is tried first, then supply, then emergency-period; each statement yields one candidate per figure", () => {
    const survival = claimed("Help may not reach you for 3 days without water.");
    expect(survival).toHaveLength(1);
    expect(survival[0].why).toMatch(/survival or deprivation-outcome/);

    const supply = claimed("Keep enough food for 7 days.");
    expect(supply).toHaveLength(1);
    expect(supply[0].why).toMatch(/supply-duration target/);

    const emergency = claimed("Help may not reach you for 3 days.");
    expect(emergency).toHaveLength(1);
    expect(emergency[0].why).toMatch(/emergency-period claim/);
  });

  it("a sentence that two rules could read is still ONE failure for that figure", () => {
    const all = scan("Prepare to manage for 7 days with enough food for 7 days.").filter((c) => c.category === "interval");
    expect(all.filter((c) => c.figure === "7 days")).toHaveLength(1);
    expect(all.every((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
  });

  it("two different figures in one sentence are two candidates, each with one owner", () => {
    const all = claimed("The first 24 hours are critical and help may not reach you for 3 days.");
    expect(all.map((c) => c.figure).sort()).toEqual(["24 hours", "3 days"]);
  });

  it("blocks only through C_NEEDS_SOURCE, the same way the other families do (no new bucket)", () => {
    const found = claimed("Help may not reach you for 3 days.");
    expect(found.map((c) => c.bucket)).toEqual(["C_NEEDS_SOURCE"]);
  });
});
