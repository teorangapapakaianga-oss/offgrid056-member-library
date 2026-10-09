import path from "node:path";
import { describe, expect, it } from "vitest";
import { legalityAssertions, licensingAssertions, loadNumericRegistry, regulatoryAssertions, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 10.17 — licensing, registration and legality assertions join the regulatory-assertion family. General wording rules, no resource named, no exemption: a
 * statement in the resource's own voice that someone MUST or ALWAYS or ONLY may do work, that a licence or registration IS REQUIRED, or that something is ILLEGAL
 * or UNLAWFUL is unsupported unless the registry approves that exact sentence. Questions, blanks, verification prompts, attributed wording and hedged wording are quiet.
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const scan = (s: string, resource = "OG-99", market = "NZ") => scanNumericClaims(`<div class="content"><p>${s}</p></div>`, { resource, market, registry, treatment });
const owned = (s: string) => scan(s).filter((c) => c.bucket === "C_NEEDS_SOURCE" && c.unit === "regulatory");

const LICENSING_POS = [
  "Always use a licensed electrician.",
  "A valid licence is required.",
  "A valid license is required for this work.",
  "You must use a registered professional.",
  "Only a certified installer may do this.",
  "This must be carried out by a qualified tradesperson.",
  "Always licensed.",
  "Accredited installers are required.",
  "Registration is mandatory for this kind of work.",
  "The work requires an authorised technician.",
  "The work requires an authorized technician.",
  "Building consent and certified flue work required.",
  "Always hire a certified professional.",
  "In Australia, a licence is required for this work.",
  "In New Zealand you must use a registered practitioner.",
  "Only an approved contractor can carry out the work.",
];
const LICENSING_NEG = [
  "What licence or registration applies?",
  "Ask what qualifications they hold.",
  "Check what registration is required for your project.",
  "What evidence of licensing can they provide?",
  "Professional / trade: ______",
  "Registration number they gave me: ______",
  "Check with the relevant authority what requirements apply.",
  "The installer says a licence is required.",
  "A licence may be required, depending on the work.",
  "If a licence is required, ask to see it.",
  "Write down the registration or licence number they give you.",
  "Ask whether the professional is licensed.",
  "Are you registered for this kind of work?",
  "Licensed or registered? ______",
  "The tradesperson told me a registration is needed.",
  "Which qualifications and registrations do you hold?",
  "Some work can need a registered professional.",
  "Confirm who is responsible for approvals or inspections.",
];
const LEGALITY_POS = [
  "Illegal and dangerous otherwise.",
  "It is unlawful to do this yourself.",
  "This work is against the law.",
  "Doing everything yourself is not always legal.",
  "That is a legal requirement.",
  "Working without approval is not legally allowed.",
  "Doing this without a permit breaks the law.",
  "This is illegal in Australia.",
  "This is unlawful in New Zealand without the right approval.",
  "It is legally prohibited.",
];
const LEGALITY_NEG = [
  "Is this work legal where I live?",
  "Ask what is legally required for this work.",
  "Check whether it is illegal to do it yourself.",
  "The professional said it was illegal.",
  "What laws apply to my project?",
  "Record anything they say about legal requirements: ______",
  "It may be illegal to start without approval.",
  "If it is unlawful, ask for the reason.",
  "Ask who is responsible for approvals or inspections.",
  "Legal requirements: ______",
  "Check with the relevant authority what is prohibited.",
  "The contractor says it is against the law.",
  "It is not legal, building or professional advice.",
];

describe("licensing and registration assertions", () => {
  for (const s of LICENSING_POS) it(`flags "${s}"`, () => {
    expect(regulatoryAssertions(s).length, "family").toBeGreaterThan(0);
    expect(licensingAssertions(s).length + legalityAssertions(s).length, "rule").toBeGreaterThan(0);
    expect(owned(s).length, "owned by the regulatory family as Bucket C").toBe(1);
  });
  for (const s of LICENSING_NEG) it(`does not flag "${s}"`, () => {
    expect(regulatoryAssertions(s), "family").toEqual([]);
    expect(owned(s), "scan").toEqual([]);
  });
  it("has at least twelve of each", () => { expect(LICENSING_POS.length).toBeGreaterThanOrEqual(12); expect(LICENSING_NEG.length).toBeGreaterThanOrEqual(12); });
});

describe("legality assertions", () => {
  for (const s of LEGALITY_POS) it(`flags "${s}"`, () => {
    expect(legalityAssertions(s).length + licensingAssertions(s).length, "rule").toBeGreaterThan(0);
    expect(regulatoryAssertions(s).length, "family").toBeGreaterThan(0);
    expect(owned(s).length, "owned once").toBe(1);
  });
  for (const s of LEGALITY_NEG) it(`does not flag "${s}"`, () => {
    expect(regulatoryAssertions(s), "family").toEqual([]);
    expect(owned(s), "scan").toEqual([]);
  });
  it("has at least ten of each", () => { expect(LEGALITY_POS.length).toBeGreaterThanOrEqual(10); expect(LEGALITY_NEG.length).toBeGreaterThanOrEqual(10); });
});

describe("one owner per statement and the existing rules", () => {
  it("a statement is raised once, whichever rules it matches (no duplicate Bucket C)", () => {
    const s = "Illegal and dangerous otherwise, and always licensed.";
    const c = scan(s).filter((x) => x.bucket === "C_NEEDS_SOURCE");
    expect(c.length).toBeGreaterThan(0);
    expect(c.every((x) => x.unit === "regulatory"), "one owning family").toBe(true);
    expect(new Set(c.map((x) => x.figure)).size, "no repeated span").toBe(c.length);
    const t = "A valid licence is required for work over $5,000.";
    expect(scan(t).filter((c) => c.bucket === "C_NEEDS_SOURCE").map((c) => c.sentence).length).toBeLessThanOrEqual(2);
  });
  it("the two registered sourced claims still resolve for their exact resource and market only", () => {
    const og13 = "In Queensland, interconnected photoelectric alarms are required by law — check what applies where you live.";
    expect(scan(og13, "OG-13", "AU").filter((c) => c.unit === "regulatory").map((c) => c.bucket)).toEqual(["A_ALREADY_SOURCED"]);
    expect(scan(og13, "OG-99", "AU").filter((c) => c.unit === "regulatory").map((c) => c.bucket)).toEqual(["C_NEEDS_SOURCE"]);
  });
  it("a standing-block style disclaimer is not judged by the resource rule when it is a registered block (unchanged behaviour)", () => {
    expect(regulatoryAssertions("Where this material names a standard, agency or programme, check it still applies to you before relying on it.")).toEqual([]);
  });
  it("the earlier regulatory rules still fire", () => {
    for (const s of ["This label is mandatory in NZ.", "CodeMark proves compliance with the NZ Building Code.", "In Queensland, alarms are required by law."]) expect(regulatoryAssertions(s).length, s).toBeGreaterThan(0);
  });
  it("the legacy OG-24 wording that was missed at Stage 10.16 is now owned", () => {
    for (const s of ["Illegal and dangerous otherwise.", "Always licensed.", "valid licence and category match required.", "Public health and environmental regulations apply."]) expect(regulatoryAssertions(s).length, s).toBeGreaterThan(0);
  });
});
