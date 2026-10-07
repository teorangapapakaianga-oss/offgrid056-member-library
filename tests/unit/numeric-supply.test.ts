import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadNumericRegistry, scanNumericClaims, supplyTargets, type NumericCandidate } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.87 — the context-aware supply-duration claim (the task deferred at Stage 9.68).
 *
 * A duration bound to a supply noun ("a 7-day non-perishable supply", "30 days of water", "enough food for 14 days") is a factual
 * preparedness target. The rule has to tell it from ordinary sentences: a title, a programme name, a schedule, a deadline, a
 * member's blank, a question, an example and a reassurance ("You do not need to buy 30 days of food in one shop", live OG-11).
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const scan = (text: string, market = "NZ", resource = "OG-99"): NumericCandidate[] =>
  scanNumericClaims(`<div class="content"><p>${text}</p></div>`, { resource, market, registry, treatment });
const supplyFindings = (text: string, market = "NZ") => scan(text, market).filter((c) => c.category === "interval" && /supply-duration target/.test(c.why));

describe("a supply-duration target is a claim candidate (positive)", () => {
  const targets: [string, string][] = [
    ["N-day food supply", "Keep a {n}-day food supply."],
    ["N-day non-perishable supply minimum", "{n}-day non-perishable supply minimum"],
    ["N-day water supply", "Store a {n}-day drinking water supply."],
    ["N-day household water supply", "You should hold a {n}-day household water supply."],
    ["N-day fuel supply", "Keep a {n}-day fuel supply for the generator."],
    ["N-week food supply", "Aim for a {n}-week food supply."],
    ["N days of food", "Keep {n} days of non-perishable food stored and accessible."],
    ["N days of drinking water", "Store at least {n} days of drinking water."],
    ["N days of firewood", "Keep {n} days of firewood on hand."],
    ["N days of emergency supplies", "Keep {n} days of emergency supplies at home."],
    ["supply lasting N days", "Keep a supply lasting {n} days."],
    ["enough food for N days", "Keep enough food for {n} days."],
    ["enough drinking water for N days", "Store enough drinking water for {n} days."],
    ["enough fuel to last N weeks", "Hold enough fuel to last {n} weeks."],
  ];
  for (const [name, template] of targets) {
    it(`flags: ${name}`, () => {
      for (const n of ["2", "7", "14", "30"]) for (const market of ["NZ", "AU"]) {
        const text = template.replace("{n}", n);
        const found = supplyFindings(text, market);
        expect(found.length, `${market}: ${text}`).toBeGreaterThan(0);
        expect(found.every((c) => c.bucket === "C_NEEDS_SOURCE"), `${market}: ${text}`).toBe(true);
      }
    });
  }

  it("reads the singular and the plural of day, week and month, and a plus sign", () => {
    for (const t of ["Keep a 1-day food supply.", "Keep 1 day of water stored.", "Keep a 2-week food supply.", "Keep 3 weeks of food stored.", "Keep a 1-month food supply.", "Keep 7+ days of non-perishable food stored and accessible."]) {
      expect(supplyFindings(t).length, t).toBeGreaterThan(0);
    }
  });

  it("reads spelled-out numbers where the scanner supports them", () => {
    for (const t of ["Keep a seven-day food supply.", "Store three days of drinking water.", "Keep enough food for fourteen days.", "Keep a supply lasting two weeks.", "Hold a thirty-day fuel supply."]) {
      expect(supplyFindings(t).length, t).toBeGreaterThan(0);
    }
  });

  it("pins what is read as the target, so the rule describes wording and not a document", () => {
    expect(supplyTargets("Keep a 30-day food supply.")).toEqual(["30-day food supply"]);
    expect(supplyTargets("Keep 7 days of firewood on hand.")).toEqual(["7 days of firewood"]);
    expect(supplyTargets("Keep enough fuel to last 3 weeks.")).toEqual(["enough fuel to last 3 weeks"]);
    expect(supplyTargets("Keep a supply lasting 5 days.")).toEqual(["supply lasting 5 days"]);
  });

  it("closes the recorded gap: '7+ days of non-perishable food stored and accessible' is a candidate that needs a source", () => {
    const found = scan("7+ days of non-perishable food stored and accessible").find((c) => c.figure === "7+ days");
    expect(found?.bucket).toBe("C_NEEDS_SOURCE");
    expect(found?.why).toMatch(/supply-duration target/);
  });
});

describe("ordinary sentences are left alone (negative)", () => {
  const titles = ["30-Day Pantry Builder", "90-Day Implementation Roadmap", "30-Day Programme", "OffGrid056 30-Day Programme", "The 30-Day Pantry Builder helps you plan."];
  const schedules = ["This is a 10-minute worksheet.", "Complete this in 7 days.", "Day 7", "Week 3", "Review your plan in 2 weeks.", "Allow 14 days for delivery of your fuel supply.", "Order your firewood by Friday, within 7 days."];
  const planning = ["Plan 7 days of meals.", "Your 30-day plan starts on Monday.", "Set a 14-day goal for the roadmap.", "Complete the 90-Day Implementation Roadmap."];
  const labels = ["14-Day Supply", "3-day / 7-day / 14-day / 30-day"];
  const reassurance = ["You do not need to buy 30 days of food in one shop.", "You don't need a 14-day food supply to start.", "There is no need to store 30 days of water at once."];
  const questions = ["Do you have a 7-day food supply?", "How many days of food supply do you have?", "Could you keep enough food for 14 days?"];
  const examples = ["For example, a 3-day supply is a common starting point.", "Such as a 7-day food supply."];
  const memberInput = ["My target food supply (7 days, 14 days, 30 days): ____", "Write your own supply target in days: ____", "Choose your supply: 3 days or 7 days or 14 days."];
  for (const [label, group] of Object.entries({ titles, schedules, planning, labels, reassurance, questions, examples, "member-entered blanks": memberInput })) {
    for (const t of group) {
      it(`does not flag (${label}): ${t}`, () => {
        expect(supplyTargets(t), t).toEqual([]);
        expect(supplyFindings(t), t).toEqual([]);
      });
    }
  }

  it("keeps the live OG-11 reassurance exactly as it was: a duration in passing", () => {
    expect(scan("You do not need to buy 30 days of food in one shop.").find((c) => c.figure === "30 days")?.bucket).toBe("D_NOT_A_CLAIM");
  });

  it("keeps ordinary titles and durations as non-claims, as before", () => {
    for (const t of ["30-Day Pantry Builder", "90-Day Implementation Roadmap", "OffGrid056 30-Day Programme", "Complete this in 7 days."]) {
      expect(scan(t).every((c) => c.bucket !== "C_NEEDS_SOURCE"), t).toBe(true);
    }
  });

  it("does not weaken the sourced baseline: New Zealand's approved three-litre wording still reads as sourced for OG-08", () => {
    const found = scanNumericClaims(`<div class="content"><p>Store at least 3 litres of drinking water per person per day, for at least three days.</p></div>`, { resource: "OG-08", market: "NZ", registry, treatment });
    expect(found.map((c) => c.bucket)).toContain("A_ALREADY_SOURCED");
    expect(found.some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(false);
  });

  it("does not disturb the survival-duration rule from Stage 9.86", () => {
    expect(scan("A person can last 3 days without water.").some((c) => /survival or deprivation-outcome/.test(c.why))).toBe(true);
  });
});
