import path from "node:path";
import { describe, expect, it } from "vitest";
import { assuranceClaims, loadNumericRegistry, outcomeClaims, scanNumericClaims, storageDurationClaims, supplyTargets, targetLabelDurations } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 10.07 — the target-label duration rule and the assurance / completion claim rule. General wording rules: no resource is named. Context controls the
 * classification, and one statement has one owner.
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const scan = (html: string, market = "NZ") => scanNumericClaims(`<div class="content">${html}</div>`, { resource: "OG-99", market, registry, treatment });
const p = (s: string) => `<p>${s}</p>`;
const bucketC = (s: string, market = "NZ") => scan(p(s), market).filter((c) => c.bucket === "C_NEEDS_SOURCE");
const target = (s: string, market = "NZ") => scan(p(s), market).filter((c) => c.why.startsWith("a target-label duration"));
const assurance = (s: string, market = "NZ") => scan(p(s), market).filter((c) => c.unit === "assurance");

describe("target-label duration rule: positive cases (the function)", () => {
  const cases: [string, string][] = [
    ["Target: 30 days", "30 days"],
    ["Goal: 14 days of food", "14 days"],
    ["Maintain 7 days of water", "7 days"],
    ["Minimum 3-day supply", "3-day"],
    ["Build to a 30-day pantry", "30-day"],
    ["Keep at least two weeks of fuel", "two weeks"],
    ["Aim for four weeks of food", "four weeks"],
    ["Target: thirty days", "thirty days"],
    ["Minimum: 72 hours", "72 hours"],
    ["Required: 2 months", "2 months"],
    ["Goal: three months of stored food", "three months"],
  ];
  for (const [s, fig] of cases) it(`flags "${s}"`, () => expect(targetLabelDurations(s).map((x) => x.toLowerCase())).toContain(fig.toLowerCase()));
});

describe("target-label duration rule: Bucket C in both markets, one owner", () => {
  for (const market of ["NZ", "AU"]) {
    for (const s of ["Target: 30 days", "Goal: 14 days of food", "Maintain 7 days of water", "Minimum 3-day supply", "Build to a 30-day pantry", "Keep at least two weeks of fuel", "Target: thirty days"]) {
      it(`${market}: "${s}" is one Bucket C candidate`, () => {
        const c = bucketC(s, market);
        expect(c.length, JSON.stringify(c.map((x) => [x.figure, x.why]))).toBe(1);
        expect(c[0].market).toBe(market);
      });
    }
  }
  it("the bare label form is owned by the target-label rule (the supply rule has no noun to bind)", () => {
    expect(supplyTargets("Target: 30 days")).toEqual([]);
    expect(target("Target: 30 days").map((x) => x.figure)).toEqual(["30 days"]);
    expect(target("Build to a 30-day pantry").map((x) => x.figure)).toEqual(["30-day"]);
  });
  it("precedence: a sentence the supply rule owns is not also a target-label candidate", () => {
    expect(supplyTargets("Maintain 7 days of water").length).toBeGreaterThan(0);
    expect(target("Maintain 7 days of water")).toEqual([]);
    expect(bucketC("Maintain 7 days of water").length).toBe(1);
  });
  it("precedence: a storage-duration claim keeps its own owner", () => {
    expect(storageDurationClaims("Goal: a shelf life of 2 years").length).toBeGreaterThan(0);
    expect(target("Goal: a shelf life of 2 years")).toEqual([]);
  });
});

describe("target-label duration rule: negative cases", () => {
  const quiet = [
    "Target date: ______",
    "Goal: organise pantry shelves",
    "My target date is next Friday",
    "30-Day Pantry Builder",
    "90-Day Implementation Roadmap",
    "Target: ______ days",
    "Goal: finish the 30-Day Pantry Builder",
    "Project deadline: 14 days from now",
    "Target: finish the form within 2 weeks",
    "Complete this worksheet in 20 minutes",
    "Goal: 3 days of the month for review before the meeting",
    "Set a goal for yourself.",
    "What is your target?",
    "You do not need to maintain 30 days of food.",
    "Maintain a regular routine each week",
    "Goal: walk 3 days a week",
  ];
  for (const s of quiet) it(`does not flag "${s}"`, () => {
    expect(targetLabelDurations(s), "function").toEqual([]);
    expect(scan(p(s)).filter((c) => c.why.startsWith("a target-label duration")), "scan").toEqual([]);
  });
  it("a member blank beside a label is not a claim, in both markets", () => {
    for (const market of ["NZ", "AU"]) expect(bucketC("Target: ________", market)).toEqual([]);
  });
});

describe("assurance / completion claim rule: positive cases", () => {
  const cases = [
    "You have secured your water supply.",
    "You've secured the three areas.",
    "Your household is now prepared.",
    "Your household is prepared.",
    "You are fully ready for an outage.",
    "Your food resilience is secured.",
    "You now have everything you need.",
    "This guarantees your household is prepared.",
    "Completing this ensures you are ready.",
    "Guaranteed preparedness for every home.",
    "Water supply secured.",
    "Your supplies are now covered.",
  ];
  for (const s of cases) it(`flags "${s}"`, () => expect(assuranceClaims(s).length, s).toBeGreaterThan(0));
  for (const market of ["NZ", "AU"]) {
    for (const s of ["You have secured your water supply.", "Your household is now prepared.", "You are fully ready for an outage.", "Your food resilience is secured.", "You now have everything you need.", "This guarantees your household is prepared."]) {
      it(`${market}: "${s}" is one Bucket C assurance candidate`, () => {
        const c = assurance(s, market);
        expect(c.length, JSON.stringify(c)).toBe(1);
        expect(c[0].bucket).toBe("C_NEEDS_SOURCE");
        expect(c[0].market).toBe(market);
        expect(bucketC(s, market).length).toBe(1);
      });
    }
  }
  it("precedence: an absolute outcome claim keeps its own owner and raises no assurance candidate", () => {
    const s = "This guarantees freshness and your household is prepared.";
    expect(outcomeClaims(s).length).toBeGreaterThan(0);
    expect(scan(p(s)).filter((c) => c.unit === "assurance")).toEqual([]);
  });
});

describe("assurance / completion claim rule: negative cases", () => {
  const quiet = [
    "Write down what you have secured.",
    "What still needs to be secured?",
    "You may have already organised some of these.",
    "This worksheet can help you see what is in place.",
    "Is your household prepared?",
    "If your household is prepared, move on.",
    "Once you have secured your supplies, review them.",
    "Your household may be prepared for some situations.",
    "You are ready to begin.",
    "You are ready for the next section.",
    "Secure heavy shelves to the wall.",
    "Water supply secured: ______",
    "Record how secure you feel about each area.",
    "Check whether each area is covered.",
    "A snapshot of what your household has in place.",
    "Everyone in the household should know where the supplies are kept.",
    "This guide does not guarantee preparedness.",
  ];
  for (const s of quiet) it(`does not flag "${s}"`, () => {
    expect(assuranceClaims(s), "function").toEqual([]);
    expect(scan(p(s)).filter((c) => c.unit === "assurance"), "scan").toEqual([]);
  });
});
