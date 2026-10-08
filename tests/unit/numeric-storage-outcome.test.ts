import path from "node:path";
import { describe, expect, it } from "vitest";
import { comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, loadNumericRegistry, multiplierClaims, outcomeClaims, scanNumericClaims, storageDurationClaims, storageTableRows, supplyTargets } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 10.02 — the storage-duration rule (shelf life and storage life, including bare durations in table cells whose column header names the
 * storage life) and the absolute outcome-claim rule. General wording rules: no resource is named. Context controls the classification.
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const scan = (html: string, market = "NZ") => scanNumericClaims(`<div class="content">${html}</div>`, { resource: "OG-99", market, registry, treatment });
const p = (s: string) => `<p>${s}</p>`;
const table = (header: string, rows: [string, string][]) => `<table><thead><tr><th>Food Type</th><th>${header}</th><th>Signs</th></tr></thead><tbody>${rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td><td>Off smell</td></tr>`).join("")}</tbody></table>`;
const storage = (html: string, market = "NZ") => scan(html, market).filter((c) => c.why.startsWith("a storage-duration claim"));
const outcome = (html: string, market = "NZ") => scan(html, market).filter((c) => c.unit === "outcome");
const bucketC = (html: string, market = "NZ") => scan(html, market).filter((c) => c.bucket === "C_NEEDS_SOURCE");

describe("storage-duration rule: tables", () => {
  for (const market of ["NZ", "AU"]) {
    it(`${market}: a bare duration in a Shelf Life column is a Bucket C storage claim (the cell is judged once, as its row)`, () => {
      const c = scan(table("Pantry Shelf Life", [["Rice (white)", "4–5 years"], ["Flour", "6–12 months"], ["Pasta", "2 years"], ["Oats", "1–2 years"]]), market);
      const s = c.filter((x) => x.why.startsWith("a storage-duration claim"));
      expect(s.map((x) => x.figure)).toEqual(["4–5 years", "6–12 months", "2 years", "1–2 years"]);
      expect(s.every((x) => x.bucket === "C_NEEDS_SOURCE" && x.market === market)).toBe(true);
      expect(c.filter((x) => x.bucket === "D_NOT_A_CLAIM"), "no second, incidental candidate for the same cell").toEqual([]);
      expect(s[0].sentence).toBe("Rice (white) — Pantry Shelf Life: 4–5 years");
    });
  }
  it("flags 'Indefinite' and spelled-out durations in a storage-life column", () => {
    expect(storage(table("Pantry Shelf Life", [["Honey", "Indefinite"]])).map((x) => x.figure)).toEqual(["Indefinite"]);
    expect(storage(table("Storage life", [["Rice", "two years"]])).map((x) => x.figure)).toEqual(["two years"]);
    expect(storage(table("Shelf life", [["Nuts", "up to 12 months"]])).map((x) => x.figure.toLowerCase())).toEqual(["12 months"]);
  });
  it("reads other storage headers: keeps for, use within, freezer life, best quality", () => {
    for (const h of ["Keeps for", "Use within", "Freezer life", "Refrigerator life", "Best quality for", "Storage duration"]) expect(storage(table(h, [["Item", "6 months"]])).length, h).toBe(1);
  });
  it("uses the heading before a table as context when the header row does not name it", () => {
    const html = `<h2>Shelf Life Guide</h2><table><thead><tr><th>Food</th><th>Time</th></tr></thead><tbody><tr><td>Rice</td><td>4–5 years</td></tr></tbody></table>`;
    expect(storage(html).map((x) => x.figure)).toEqual(["4–5 years"]);
  });
  it("storageTableRows pairs a cell with its column header", () => {
    expect(storageTableRows(table("Pantry Shelf Life", [["Rice", "4 years"]]))).toEqual([{ sentence: "Rice — Pantry Shelf Life: 4 years", cell: "4 years" }]);
  });
  it("stays quiet for a member's own date columns, blanks and a tracker table", () => {
    const tracker = `<table><thead><tr><th>Item</th><th>Added / Bought</th><th>Date Label (as shown)</th><th>Use Next / Notes</th></tr></thead><tbody><tr><td>Rice</td><td>bought 2 months ago</td><td>Best before March</td><td>use next</td></tr><tr><td><input placeholder="..."></td><td></td><td></td><td></td></tr></tbody></table>`;
    expect(storage(tracker)).toEqual([]);
    expect(bucketC(tracker)).toEqual([]);
  });
  it("stays quiet for a table of durations whose column is not a storage life", () => {
    expect(storage(table("Cooking time", [["Rice", "20 minutes"], ["Lentils", "2 hours"]]))).toEqual([]);
    expect(storage(table("Date bought", [["Rice", "2 months ago"]]))).toEqual([]);
  });
});

const STORAGE_POSITIVES: [string, string][] = [
  ["Dried beans have a shelf life of 2–3 years.", "2–3 years"],
  ["Rice keeps for 4 years in a cool cupboard.", "4 years"],
  ["Use within 12 months of opening.", "12 months"],
  ["Brown rice has a pantry life of about 6 months.", "6 months"],
  ["Frozen bread has a freezer life of up to three months.", "three months"],
  ["Oil lasts for two years.", "two years"],
  ["Honey has an indefinite shelf life.", "indefinite"],
  ["Flour stays fresh for 6–12 months.", "6–12 months"],
  ["Salt keeps indefinitely.", "indefinitely"],
];
const STORAGE_NEGATIVES = [
  "Do a monthly pantry check.",
  "Review this next month.",
  "Bought 2 months ago",
  "30-Day Pantry Builder",
  "Week 2",
  "Day 12",
  "Write the date you bought it: ______",
  "Use this tracker whenever you check your pantry. If a monthly check suits your household, use the same tracker each month.",
  "Choose how long you want to keep each item for.",
  "How long does rice keep for?",
  "Do not assume food keeps for 2 years.",
  "Allow about 20 minutes.",
  "Check the packaging and the date label shown on the item.",
  "Plan your shopping for the next 2 weeks.",
];
describe("storage-duration rule: sentences", () => {
  for (const [s, fig] of STORAGE_POSITIVES) {
    for (const market of ["NZ", "AU"]) {
      it(`${market}: flags "${s}"`, () => {
        expect(storageDurationClaims(s).map((x) => x.toLowerCase())).toContain(fig.toLowerCase());
        const c = storage(p(s), market);
        expect(c.length).toBe(1);
        expect(c[0]).toMatchObject({ bucket: "C_NEEDS_SOURCE", market });
      });
    }
  }
  for (const s of STORAGE_NEGATIVES) {
    it(`stays quiet for "${s}"`, () => {
      expect(storageDurationClaims(s)).toEqual([]);
      expect(storage(p(s))).toEqual([]);
      expect(storage(p(s), "AU")).toEqual([]);
    });
  }
});

const OUTCOME_POSITIVES: [string, string][] = [
  ["This one habit eliminates expired food.", "eliminates expired food"],
  ["This tracker prevents all food waste.", "prevents all food waste"],
  ["It keeps your pantry perpetually fresh.", "perpetually fresh"],
  ["Your supplies stay fresh indefinitely.", "fresh indefinitely"],
  ["This method guarantees freshness.", "guarantees freshness"],
  ["It guarantees savings.", "guarantees savings"],
  ["This tracker saves money.", "saves money"],
  ["You will never run out of food.", "never run out of"],
  ["This system always prevents waste.", "always prevents"],
  ["No more waste.", "No more waste"],
  ["This tracker stops waste.", "stops waste"],
];
const OUTCOME_NEGATIVES = [
  "This may help reduce waste.",
  "Write down ways you could save money.",
  "What would help you waste less food?",
  "My goal is to save money on food.",
  "Is this tracker going to save money?",
  "For example, a goal such as 'waste less food'.",
  "This does not guarantee savings.",
  "It cannot prevent all waste.",
  "Note what you want to use next.",
  "Tick the items you want to use first.",
  "Many households find a list helpful.",
  "Using older items first can help you reduce waste.",
  "Compare your options and decide what suits you.",
];
describe("absolute outcome-claim rule", () => {
  for (const [s, text] of OUTCOME_POSITIVES) {
    for (const market of ["NZ", "AU"]) {
      it(`${market}: flags "${s}"`, () => {
        expect(outcomeClaims(s).map((x) => x.toLowerCase()).some((x) => x.includes(text.toLowerCase()))).toBe(true);
        const c = outcome(p(s), market);
        expect(c.length).toBe(1);
        expect(c[0]).toMatchObject({ bucket: "C_NEEDS_SOURCE", category: "performance", unit: "outcome", market });
      });
    }
  }
  for (const s of OUTCOME_NEGATIVES) {
    it(`stays quiet for "${s}"`, () => {
      expect(outcomeClaims(s)).toEqual([]);
      expect(outcome(p(s))).toEqual([]);
      expect(outcome(p(s), "AU")).toEqual([]);
    });
  }
});

describe("one statement, one owner (precedence)", () => {
  it("a storage sentence raises no outcome, multiplier or comparative candidate; the storage family reports it once", () => {
    const s = "This system always keeps rice fresh for 2 years and is twice as effective.";
    expect(storageDurationClaims(s).length).toBeGreaterThan(0);
    const c = scan(p(s));
    expect(c.filter((x) => x.category === "performance")).toEqual([]);
    expect(c.filter((x) => x.bucket === "C_NEEDS_SOURCE")).toHaveLength(1);
  });
  it("a sentence owned by the survival, supply or emergency-period rule raises no storage candidate of its own and no outcome candidate", () => {
    const s = "Keep 3 days of food and water, and your pantry always prevents waste.";
    expect(supplyTargets(s).length).toBeGreaterThan(0);
    expect(outcome(p(s))).toEqual([]);
    expect(isSurvivalClaimSentence("x")).toBe(false);
    expect(emergencyPeriodTargets("x")).toEqual([]);
  });
  it("a multiplier owns the sentence before an outcome claim", () => {
    const s = "This tracker is twice as effective and saves money.";
    expect(multiplierClaims(s).length).toBeGreaterThan(0);
    expect(outcome(p(s))).toEqual([]);
    expect(scan(p(s)).filter((x) => x.category === "performance")).toHaveLength(1);
  });
  it("a comparative owns the sentence before an outcome claim", () => {
    const s = "It gets better results than most people and saves money.";
    expect(comparativePerformanceClaims(s).length).toBeGreaterThan(0);
    expect(outcome(p(s))).toEqual([]);
  });
  it("an empty registry still reports both families as Bucket C", () => {
    expect(bucketC(p("This tracker saves money."))).toHaveLength(1);
    expect(bucketC(p("Rice has a shelf life of 2 years."))).toHaveLength(1);
  });
});

describe("the legacy OG-12 statements, as general wording", () => {
  it("flags the shelf-life table, the outcome sentences and nothing in the neutral tracker wording, in both markets", () => {
    for (const market of ["NZ", "AU"]) {
      expect(storage(table("Pantry Shelf Life", [["Canned vegetables", "2–5 years"], ["Brown rice", "6–12 months"], ["Honey", "Indefinite"], ["Salt / Sugar", "Indefinite"]]), market)).toHaveLength(4);
      expect(outcome(p("This one habit eliminates expired food, reduces waste, and keeps your pantry perpetually fresh without thinking."), market)).toHaveLength(2);
      expect(outcome(p("This tracker stops waste, saves money, and keeps your pantry supply fresh and reliable."), market).length).toBeGreaterThanOrEqual(1);
      expect(bucketC(p("Use this tracker whenever you check your pantry. Note which items you want to use next."), market)).toEqual([]);
    }
  });
});
