import path from "node:path";
import { describe, expect, it } from "vitest";
import { assuranceClaims, loadNumericRegistry, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, scanNumericClaims, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 10.12 — the payback-duration, warranty-duration, payment-norm and regulatory-assertion rules. General wording rules: no resource is named.
 * Each flags a statement that prescribes, predicts or presents a norm, and stays quiet for questions, blanks, instructions to ask or record, hedged
 * wording, titles and a figure that is clearly the supplier's own. No exemptions.
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const scan = (html: string, market = "NZ") => scanNumericClaims(`<div class="content">${html}</div>`, { resource: "OG-99", market, registry, treatment });
const p = (s: string) => `<p>${s}</p>`;
const bucketC = (s: string, market = "NZ") => scan(p(s), market).filter((c) => c.bucket === "C_NEEDS_SOURCE");
const owned = (s: string, prefix: string, market = "NZ") => scan(p(s), market).filter((c) => c.why.startsWith(prefix));

const PAYBACK_POS = [
  "Payback is 6–10 years.",
  "Typical payback is seven years.",
  "This usually pays for itself within five years.",
  "Expect a 6-year payback.",
  "Most systems pay back in 8 years.",
  "Payback is usually around 18 months.",
  "The system will break even after about ten years.",
  "Payback is typically 4-6 years.",
  "Panels like these pay for themselves in 9 years.",
];
const PAYBACK_NEG = [
  "What payback period did the supplier give you?",
  "Supplier-stated payback: ______",
  "My estimate: ______",
  "Ask how they calculated their payback estimate.",
  "The supplier says payback is 7 years.",
  "Write down the payback period they quoted.",
  "Payback may be 6 years or more.",
  "Compare the payback each supplier gives you.",
  "10-Year Payback Guide",
  "The warranty is 5 years.",
  "Payback target (years):",
];
const WARRANTY_POS = [
  "A good warranty is 5 years.",
  "Look for at least 10 years.",
  "Typical warranty: 2–5 years.",
  "A battery should have a 10-year warranty.",
  "Minimum warranty is five years.",
  "Most manufacturers offer a standard warranty of 10 years.",
  "Warranties should be at least two years on major systems.",
  "A warranty of 5–10 years is usually reasonable.",
  "Expect a warranty of around three years.",
];
const WARRANTY_NEG = [
  "Warranty offered: ______",
  "What warranty does the supplier provide?",
  "Write down the warranty period they gave you.",
  "The supplier says the warranty is 5 years.",
  "10-Year Warranty Guide",
  "Warranty (years): ______",
  "Ask what the warranty covers and how long it lasts.",
  "Compare the warranty terms each supplier offers.",
  "Warranty period they gave: 5 years.",
  "Keep your warranty documents in one place.",
];
const PAYMENT_POS = [
  "Never pay 100% upfront.",
  "50/50 is fair.",
  "Only pay 20% as a deposit.",
  "A 30% deposit is standard.",
  "Do not pay more than half before installation.",
  "Always hold back 10%.",
  "Never pay in full before the work starts.",
  "Do not pay all upfront.",
  "A deposit of 25% is reasonable.",
  "You should only pay half upfront.",
  "60/40 is normal.",
  "Never hand over the full amount in advance.",
];
const PAYMENT_NEG = [
  "What payment stages does the supplier propose?",
  "Deposit requested: ______",
  "Write down the payment schedule.",
  "Compare the payment terms offered.",
  "Is a deposit required?",
  "The supplier asked for a 30% deposit.",
  "Payment terms they gave: ______",
  "Ask whether payment is staged.",
  "Staged payments are common.",
  "Record any deposit percentage the supplier asks for.",
  "Payment: 50% on order, 50% on completion (the supplier's terms).",
  "Pay attention to the payment schedule in the quote.",
];
const REGULATORY_POS = [
  "This label is mandatory in NZ.",
  "CodeMark proves compliance with the NZ Building Code.",
  "This certification is legally required.",
  "The product must be approved under the Building Code.",
  "This standard guarantees compliance.",
  "Installers are required by law to be licensed.",
  "The system must comply with the electrical regulations.",
  "This product is certified compliant.",
  "The panels are government approved.",
  "This approval is mandatory in Australia.",
  "It meets the Building Code.",
  "A permit is required in New Zealand.",
];
const REGULATORY_NEG = [
  "Ask the supplier what approvals apply.",
  "Check what requirements apply to your property.",
  "Supplier says it meets: ______",
  "What certification does the supplier provide?",
  "Is the product certified?",
  "Write down any approvals the supplier mentions.",
  "Ask a qualified professional which standards apply.",
  "If a permit is required, ask the council.",
  "Some products may need to be approved.",
  "Mandatory fields are marked with a star.",
  "The supplier says the product is approved under the Building Code.",
  "Confirm with the relevant authority whether consent is required.",
  "Compare the approvals each supplier lists.",
];

describe("payback-duration norm rule", () => {
  for (const s of PAYBACK_POS) it(`flags "${s}"`, () => expect(paybackNorms(s).length, s).toBeGreaterThan(0));
  for (const s of PAYBACK_NEG) it(`does not flag "${s}"`, () => { expect(paybackNorms(s), "function").toEqual([]); expect(owned(s, "a payback-duration norm"), "scan").toEqual([]); });
  for (const market of ["NZ", "AU"]) for (const s of ["Payback is 6–10 years.", "This usually pays for itself within five years.", "Expect a 6-year payback."]) it(`${market}: "${s}" is one Bucket C payback candidate`, () => {
    const c = bucketC(s, market);
    expect(c.length, JSON.stringify(c.map((x) => [x.figure, x.why]))).toBe(1);
    expect(c[0].why.startsWith("a payback-duration norm")).toBe(true);
  });
});

describe("warranty-duration norm rule", () => {
  for (const s of WARRANTY_POS) it(`flags "${s}"`, () => expect(warrantyNorms(s).length, s).toBeGreaterThan(0));
  for (const s of WARRANTY_NEG) it(`does not flag "${s}"`, () => { expect(warrantyNorms(s), "function").toEqual([]); expect(owned(s, "a warranty-duration norm"), "scan").toEqual([]); });
  for (const market of ["NZ", "AU"]) for (const s of ["Typical warranty: 2–5 years.", "A battery should have a 10-year warranty.", "Minimum warranty is five years.", "Look for at least 10 years."]) it(`${market}: "${s}" is one Bucket C warranty candidate`, () => {
    const c = bucketC(s, market);
    expect(c.length, JSON.stringify(c.map((x) => [x.figure, x.why]))).toBe(1);
    expect(c[0].why.startsWith("a warranty-duration norm")).toBe(true);
  });
});

describe("payment-norm rule", () => {
  for (const s of PAYMENT_POS) it(`flags "${s}"`, () => expect(paymentNorms(s).length, s).toBeGreaterThan(0));
  for (const s of PAYMENT_NEG) it(`does not flag "${s}"`, () => { expect(paymentNorms(s), "function").toEqual([]); expect(owned(s, "a payment norm"), "scan").toEqual([]); });
  for (const market of ["NZ", "AU"]) for (const s of ["Never pay 100% upfront.", "50/50 is fair.", "Only pay 20% as a deposit.", "Do not pay more than half before installation.", "Always hold back 10%."]) it(`${market}: "${s}" is one Bucket C payment candidate`, () => {
    const c = bucketC(s, market);
    expect(c.length, JSON.stringify(c.map((x) => [x.figure, x.why]))).toBe(1);
    expect(c[0].why.startsWith("a payment norm")).toBe(true);
  });
});

describe("regulatory-assertion rule", () => {
  for (const s of REGULATORY_POS) it(`flags "${s}"`, () => expect(regulatoryAssertions(s).length, s).toBeGreaterThan(0));
  for (const s of REGULATORY_NEG) it(`does not flag "${s}"`, () => { expect(regulatoryAssertions(s), "function").toEqual([]); expect(owned(s, "a regulatory assertion"), "scan").toEqual([]); });
  for (const market of ["NZ", "AU"]) for (const s of ["This label is mandatory in NZ.", "CodeMark proves compliance with the NZ Building Code.", "This certification is legally required.", "The product must be approved under the Building Code.", "This standard guarantees compliance."]) it(`${market}: "${s}" is one Bucket C regulatory candidate`, () => {
    const c = bucketC(s, market);
    expect(c.length, JSON.stringify(c.map((x) => [x.figure, x.why]))).toBe(1);
    expect(c[0].why.startsWith("a regulatory assertion")).toBe(true);
  });
});

describe("precedence: one statement, one owner, no duplicate Bucket C finding", () => {
  it("each flagged example raises exactly one Bucket C candidate", () => {
    for (const s of [...PAYBACK_POS, ...WARRANTY_POS, ...PAYMENT_POS, ...REGULATORY_POS]) {
      const c = bucketC(s);
      const families = new Set(c.map((x) => x.why.split(":")[0]));
      expect(families.size, `${s} -> ${JSON.stringify(c.map((x) => [x.figure, x.why.slice(0, 40)]))}`).toBeLessThanOrEqual(1);
    }
  });
  it("existing families keep their statements", () => {
    expect(supplyTargets("Maintain 7 days of water").length).toBeGreaterThan(0);
    expect(owned("Maintain 7 days of water", "a payback-duration norm")).toEqual([]);
    expect(storageDurationClaims("Goal: a shelf life of 2 years").length).toBeGreaterThan(0);
    expect(owned("Goal: a shelf life of 2 years", "a warranty-duration norm")).toEqual([]);
    expect(targetLabelDurations("Target: 30 days").length).toBeGreaterThan(0);
    expect(outcomeClaims("This guarantees freshness and your household is prepared.").length).toBeGreaterThan(0);
    expect(assuranceClaims("You have secured your water supply.").length).toBeGreaterThan(0);
    expect(owned("You have secured your water supply.", "a regulatory assertion")).toEqual([]);
  });
  it("a payment sentence with a percentage is owned through the percentage, with no second figure-free candidate", () => {
    const c = scan(p("Never pay 100% upfront.")).filter((x) => x.bucket === "C_NEEDS_SOURCE");
    expect(c.map((x) => x.figure)).toEqual(["100%"]);
  });
});

describe("a standard designation does not turn an assertion into a structural label", () => {
  for (const market of ["NZ", "AU"]) it(`${market}: "Must comply with AS/NZS 4777.2 standards." is a regulatory assertion, not structural`, () => {
    const c = scan(p("Must comply with AS/NZS 4777.2 standards."), market);
    expect(c.filter((x) => x.bucket === "C_NEEDS_SOURCE").map((x) => x.why.split(":")[0])).toEqual(["a regulatory assertion"]);
    expect(c.filter((x) => x.bucket === "B_STRUCTURAL")).toEqual([]);
  });
});

describe("question and rationale table rows are read together", () => {
  const table = (rows: [string, string][]) => `<table><thead><tr><th>#</th><th>Question</th><th>Why It Matters</th><th>Score</th></tr></thead><tbody>${rows.map(([q, w], i) => `<tr><td>${i + 1}</td><td>${q}</td><td>${w}</td><td>&nbsp;</td></tr>`).join("")}</tbody></table>`;
  for (const market of ["NZ", "AU"]) {
    it(`${market}: a warranty rationale is owned with its question, once, and the bare cell is not judged a second time`, () => {
      const c = scan(table([["What warranties do you offer on products and workmanship?", "Should be 2-5 years minimum on major systems."]]), market);
      expect(c.filter((x) => x.bucket === "C_NEEDS_SOURCE").map((x) => [x.figure, x.why.split(":")[0]])).toEqual([["2-5 years", "a warranty-duration norm"]]);
      expect(c.filter((x) => x.bucket === "D_NOT_A_CLAIM")).toEqual([]);
    });
    it(`${market}: a payback rationale is owned with its question`, () => {
      const c = scan(table([["What is the expected payback period based on current power prices?", "Reality check. Should be 6-10 years for residential."]]), market);
      expect(c.filter((x) => x.bucket === "C_NEEDS_SOURCE").map((x) => [x.figure, x.why.split(":")[0]])).toEqual([["6-10 years", "a payback-duration norm"]]);
    });
  }
  it("a neutral question and rationale raise nothing", () => {
    const c = scan(table([["What warranty does the supplier provide?", "Compare what each supplier gives you."]]));
    expect(c.filter((x) => x.bucket === "C_NEEDS_SOURCE")).toEqual([]);
  });
  it("a table without question and rationale headers is unchanged", () => {
    const html = `<table><thead><tr><th>Item</th><th>Note</th></tr></thead><tbody><tr><td>Warranty</td><td>Should be 2-5 years minimum.</td></tr></tbody></table>`;
    expect(scan(html).filter((x) => x.why.startsWith("a warranty-duration norm"))).toEqual([]);
  });
});
