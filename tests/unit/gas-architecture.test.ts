import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GAS_BLOCK_SET, fuelSafetyFindings, gasBlockAvailability, memberFacingText, prepareResource, requiredGasBlocks, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import { COMMON_CORE_MIN_JURISDICTIONS, classifyCommonClaim, overrideServable, type CommonCoreClaim, type MarketProfile, type SafetyBlock, type StateOverride } from "@/admin-import/markets/resolve";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { SPELLED_NUMBER_LIMITS, loadNumericRegistry, numericBlockingFindings, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";
import { scanPrices } from "@/admin-import/audit/price";

/**
 * Stage 9.62 — the Gas/LPG safety architecture.
 *
 * Three rules shape every test here, and each is a Stage 9.56 ruling that must not erode:
 *   1. Australia has NO national gas servicing interval, cylinder interval or leak instruction. Its blocks are a
 *      non-numeric core; every state-specific claim is stored as an override that is never served.
 *   2. New Zealand is one jurisdiction, so its bodies are specific — and its figures never validate an Australian file.
 *   3. If evidence is incomplete the block fails closed. gas-leak-response does exactly that in AU.
 */
const root = process.cwd();
const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));

const GENERAL_ID = "gas-and-lpg-general";
const GAS_BLOCKS = ["gas-and-lpg-general", "unflued-gas-heating", "gas-cylinder-safety", "gas-leak-response", "gas-installation-and-servicing"] as const;
const body = (id: string, market: "NZ" | "AU") => blocks[id].marketBody?.[market];
const overrides = (id: string) => (blocks[id].stateOverrides ?? []) as StateOverride[];
const allOverrides = () => GAS_BLOCKS.flatMap((id) => overrides(id).map((o) => ({ block: id, ...o })));

const DOC = `<!DOCTYPE html><html><head></head><body>
<div class="cover-page"><div class="cover-label">OffGrid056</div><h1 class="cover-title">Heating Checklist</h1><p class="cover-subtitle">A checklist.</p></div>
<div class="content"><h2>Plan</h2><p>Work through the questions below.</p></div></body></html>`;

function prep(extra: Partial<PrepInputs> = {}) {
  return prepareResource({
    item: {
      legacyCode: "OG-99", proposedResourceId: "res-1099", title: "Heating Checklist",
      foundation: { value: "shelter", confidence: "HIGH", evidence: [] },
      resourceType: { value: "checklist", confidence: "HIGH", evidence: [] },
      legacyIssues: [], legacyTerminology: [], safetyNotes: [],
    } as unknown as PrepInputs["item"],
    sourceHtml: DOC, blocks, markets, launchMarkets: ["NZ", "AU"],
    outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-gas-")),
    description: "A checklist.", foundation: "shelter", resourceType: "checklist", category: "heating",
    difficulty: "intermediate", estimatedTime: 20, proposedBlockIds: [],
    treatmentRegistry: treatment, numericRegistry: registry,
    ...extra,
  });
}
const fileOf = (r: ReturnType<typeof prep>, m: string) => fs.readFileSync(r.files.find((f) => f.endsWith(`.${m}.html`))!, "utf8");
const scan = (text: string, market: string, resource = "OG-B09") =>
  scanNumericClaims(`<div class="content"><p>${text}</p></div>`, { resource, market, registry, treatment });
const buckets = (text: string, market: string) => scan(text, market).map((c) => c.bucket);
/** A sentence as it appears INSIDE an injected safety block (the only place a block-owned numeric claim applies). */
const inBlock = (id: string, text: string) => `<div class="og-safety standard" data-block="${id}"><h3>Block</h3><p style="margin:0">${text}</p></div>`;
const bucketsHtml = (html: string, market: string, resource = "OG-B09") =>
  scanNumericClaims(html, { resource, market, registry, treatment }).map((c) => c.bucket);
const requires = (t: string) => safetyExposureFor(t);
// Emergency numbers are structural, not claims: AU bodies may name 000 and nothing else numeric.
const withoutEmergency = (s: string) => s.replace(/\b000\b|\b111\b|\b112\b/g, "");

describe("Stage 9.62 · the architecture exists, and is complete", () => {
  it("builds the five approved blocks, each with sources, verification, triggers and a change rule", () => {
    for (const id of GAS_BLOCKS) {
      const b = blocks[id] as unknown as Record<string, unknown>;
      expect(b, id).toBeDefined();
      for (const field of ["sources", "verification", "triggers", "changeRule", "sharedOrVaries", "sentenceSources"]) {
        expect(b[field], `${id}.${field}`).toBeTruthy();
      }
      expect(JSON.stringify((b.verification as Record<string, string>).NZ), id).toMatch(/PENDING OWNER APPROVAL/);
    }
    expect(blocks["gas-and-lpg-general"].answers, "it answers the detector's gas-and-lpg requirement").toContain("gas-and-lpg");
  });

  it("leaves the twelve previously approved blocks untouched", () => {
    const original = ["batteries-and-electrical", "carbon-monoxide", "indoor-combustion", "solid-fuel-heating", "working-at-height", "stored-drinking-water", "food-safety-power-cut", "generator-safety", "water-treatment", "fire-and-smoke-alarms", "mould-and-dampness", "home-ventilation"];
    for (const id of original) expect(topicBlocks.blocks[id as keyof typeof topicBlocks.blocks], id).toBeDefined();
    // The Stage 9.56 correction must still hold: no AU servicing interval in the CO or indoor-combustion blocks.
    for (const id of ["carbon-monoxide", "indoor-combustion"]) expect(body(id, "AU"), id).not.toMatch(/at least every two years/i);
  });
});

describe("Stage 9.62 · Australia is a non-numeric core", () => {
  const AU_SERVED = GAS_BLOCKS.filter((id) => body(id, "AU") !== undefined);

  it("4. contains no national numeric servicing interval — or any figure at all", () => {
    // Stage 9.62A: three blocks keep a common core under the tightened Category-A rule; unflued heating and leak response fail closed.\n    expect(AU_SERVED.sort()).toEqual(["gas-and-lpg-general", "gas-cylinder-safety", "gas-installation-and-servicing"]);
    for (const id of AU_SERVED) {
      const text = withoutEmergency(body(id, "AU")!);
      expect(text, `${id}: a digit`).not.toMatch(/\d/);
      expect(text, `${id}: a spelled-out interval`).not.toMatch(/\b(?:every|at least)\s+(?:one|two|three|five|six|ten|twelve|fifteen)\s+(?:year|month|week|day)/i);
      expect(text, `${id}: annually`).not.toMatch(/\b(annually|yearly|annual)\b/i);
      expect(text, `${id}: a distance`).not.toMatch(/\b(?:one|two|three|five|ten|twenty)\s+(?:metre|meter|kilogram|kg)s?\b/i);
    }
  });

  it("names no Australian state or agency in a way that would make it read as that state's rule", () => {
    for (const id of AU_SERVED) {
      expect(body(id, "AU")!, id).not.toMatch(/\b(NSW|Victoria\w*|Queensland|Tasmania\w*|South Australia\w*|Western Australia\w*|ACT|Northern Territory)\b/);
    }
  });

  it("keeps New Zealand wording out of Australia and Australian wording out of New Zealand", () => {
    for (const id of GAS_BLOCKS) {
      if (body(id, "NZ")) expect(body(id, "NZ")!, `${id} NZ`).not.toMatch(/Australia|NSW|Queensland|Victoria|Triple Zero|\b000\b/);
      if (body(id, "AU")) expect(body(id, "AU")!, `${id} AU`).not.toMatch(/New Zealand|WorkSafe New Zealand|Health New Zealand|\b111\b|gas retailer/);
    }
  });

  it("restores neither the Victorian interval nor any other single Australian interval", () => {
    for (const id of ["gas-installation-and-servicing", "gas-and-lpg-general"]) {
      expect(body(id, "AU")!, id).not.toMatch(/every two years|at least every|twice a year/i);
    }
    expect(body("gas-installation-and-servicing", "AU")).toMatch(/some set an interval and some do not/);
  });
});

describe("Stage 9.62 · New Zealand figures are registered, scoped and never validate Australia", () => {
  const NZ_ANNUAL = "WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually.";
  const NZ_TWO = "WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.";

  it("1. an NZ gas rule is sourced in NZ and is NOT sourced in AU", () => {
    const annual = inBlock("gas-installation-and-servicing", NZ_ANNUAL);
    const two = inBlock("gas-installation-and-servicing", NZ_TWO);
    expect(bucketsHtml(annual, "NZ")).toContain("A_ALREADY_SOURCED");
    expect(buckets(NZ_ANNUAL, "AU"), "the same sentence in an Australian file is not sourced").toContain("C_NEEDS_SOURCE");
    expect(bucketsHtml(two, "NZ")).toContain("A_ALREADY_SOURCED");
    expect(buckets(NZ_TWO, "AU")).toContain("C_NEEDS_SOURCE");
  });

  it("11. a block-owned claim validates ONLY its own block's sentence, never a resource's own wording or another block's", () => {
    // Stage 9.62A: owningResources is [] for these claims, which used to mean "any resource". They are scoped to the block.
    const oneMetre = "Keep an unflued heater at least one metre from anything that could catch fire.";
    expect(bucketsHtml(inBlock("unflued-gas-heating", oneMetre), "NZ")).toContain("A_ALREADY_SOURCED");
    expect(bucketsHtml(`<div class="content"><p>${oneMetre}</p></div>`, "NZ"), "the resource's OWN sentence is not validated").toContain("C_NEEDS_SOURCE");
    expect(bucketsHtml(`<div class="content"><p>${NZ_ANNUAL}</p></div>`, "NZ"), "an own-text annual interval is not validated").toContain("C_NEEDS_SOURCE");
    expect(bucketsHtml(`<div class="content"><p>${NZ_TWO}</p></div>`, "NZ"), "an own-text two-year interval is not validated").toContain("C_NEEDS_SOURCE");
    for (const claim of registry.claims.filter((c) => c.owningBlock)) {
      expect(claim.market, claim.id).toBe("NZ");
      expect(claim.limitations.join(" "), `${claim.id} states its scope`).toMatch(/NZ only|SCOPED/);
    }
  });

  it("2. the Victorian interval does not validate NSW — or anything else", () => {
    // Written exactly as an Australian file might repeat it, with and without an attribution.
    for (const text of ["Energy Safe Victoria recommends that gas heaters are serviced every two years.", "Gas heaters should be serviced every two years."]) {
      expect(buckets(text, "AU"), text).toContain("C_NEEDS_SOURCE");
      expect(buckets(text, "NZ"), `${text} (NZ)`).toContain("C_NEEDS_SOURCE");
    }
    const vic = overrides("gas-installation-and-servicing").find((o) => o.id === "vic-service-interval")!;
    const nsw = overrides("gas-installation-and-servicing").find((o) => o.id === "nsw-wh-service-interval")!;
    expect(vic.jurisdiction).toBe("VIC");
    expect(nsw.jurisdiction).toBe("NSW");
    expect(vic.conflictsWith, "VIC and NSW conflict and must never be merged").toContain("nsw-wh-service-interval");
    expect(vic.figure).not.toEqual(nsw.figure);
    // Two NSW-labelled entries exist (a pantry figure and an insect-screen figure). Neither is gas; what matters is
    // that no gas servicing, cylinder, hose or leak figure is registered for ANY state.
    const stateGas = registry.claims.filter(
      (c) => /\b(VIC|NSW|QLD|SA|WA|TAS|ACT|NT|Victoria)\b/.test(c.jurisdiction) && /\b(gas|LPG|cylinder|gasfitter|appliance|hose)\b/i.test(`${c.id} ${c.allowedWording}`),
    );
    expect(stateGas.map((c) => c.id), "no state gas figure is in the numeric registry").toEqual([]);
  });

  it("3. NSW's water-heater interval does not become general gas-heater guidance", () => {
    const nsw = overrides("gas-installation-and-servicing").find((o) => o.id === "nsw-wh-service-interval")!;
    expect(nsw.appliance, "scoped to water heaters").toMatch(/water heater/i);
    expect(nsw.appliance, "and says so").toMatch(/ONLY/);
    expect(nsw.claim).toMatch(/no space-heater interval/i);
    expect(nsw.servedWhen).toBe("state-routing");
    for (const text of ["NSW advises gas heaters should be serviced annually.", "Have your gas space heater serviced every 12 months."]) {
      expect(buckets(text, "AU"), text).toContain("C_NEEDS_SOURCE");
    }
  });

  it("3b. records a numeric-gate blind spot found while testing this, so it is not forgotten", () => {
    // NOT a statement that this is acceptable. Stage 9.62 found that the numeric detector does not see these
    // phrasings, and the detector is on the locked list, so it was reported rather than changed. If a later stage
    // closes the gap, THIS TEST SHOULD FAIL — and be rewritten to assert the opposite, as Stage 9.59's price test was.
    // Stage 9.62A CLOSED the gap this test used to record: annual phrasing and spelled numbers above twelve are seen.
    const seen = [
      "Have your gas heater serviced once a year.",
      "Have your gas heater serviced every year.",
      "The gas heater is checked each year.",
      "Have your gas heater serviced annually.",
      "Have your gas heater serviced yearly.",
      "An LPG cylinder is valid for fifteen years from its test date.",
      "Replace the LPG hose after twenty years.",
    ];
    for (const text of seen) expect(buckets(text, "AU"), `now seen: ${text}`).toContain("C_NEEDS_SOURCE");
    // The AU gas bodies themselves are clean of every one of these shapes, which is what actually protects members.
    for (const id of GAS_BLOCKS) {
      const au = body(id, "AU");
      if (au) expect(au, id).not.toMatch(/\b(once|twice) a year\b|\bevery year\b|\beach year\b|\bper year\b|\bvalid for\b/i);
    }
  });

  it("7. an unsupported gas numeric claim fails the numeric gate", () => {
    for (const [text, market] of [
      ["Replace the LPG hose every 5 years.", "NZ"],
      ["Have an LPG cylinder tested every 15 years.", "AU"],
      ["Keep the cylinder at least 20 metres from the house.", "NZ"],
      ["Service a gas water heater every 3 years.", "AU"],
      ["Service the gas heater annually.", "AU"],
    ] as const) {
      const findings = numericBlockingFindings(`<div class="content"><p>${text}</p></div>`, { resource: "OG-B09", market, registry, treatment });
      expect(findings.join(" "), `${market}: ${text}`).toContain("UNSOURCED_NUMERIC_CLAIM");
    }
  });

  it("registers only the three figures the new bodies actually use, with the required metadata", () => {
    const gas = registry.claims.filter((c) => /gas-|lpg-/.test(c.id));
    expect(gas.map((c) => c.id).sort()).toEqual([
      "nz-gas-heater-clearance-one-metre-worksafe",
      "nz-gas-other-heater-service-two-years-worksafe",
      "nz-lpg-cabinet-heater-service-12-months-worksafe",
    ]);
    for (const c of gas) {
      expect(c.market, c.id).toBe("NZ");
      for (const field of ["jurisdiction", "category", "claimType", "unit", "source", "authority", "sourceDate", "status"] as const) expect(c[field], `${c.id}.${field}`).toBeTruthy();
      expect(c.limitations.length, `${c.id} limitations`).toBeGreaterThan(0);
      expect(c.owningBlock, `${c.id} owning block`).toBeTruthy();
    }
    // Each registered figure really is used: it matches a sentence in a served NZ body.
    const nzText = GAS_BLOCKS.map((id) => body(id, "NZ") ?? "").join(" ");
    for (const c of gas) expect(c.match.some((p) => new RegExp(p, "i").test(nzText)), `${c.id} is unused`).toBe(true);
  });

  it("every figure in a rendered NZ gas file is explained, and the AU file has none to explain", () => {
    const r = prep({ extraSafetyBlocks: [...GAS_BLOCKS] });
    const nz = scanNumericClaims(fileOf(r, "NZ"), { resource: "OG-99", market: "NZ", registry, treatment });
    expect(nz.filter((c) => c.bucket === "C_NEEDS_SOURCE"), "NZ Bucket C").toEqual([]);
    expect(nz.some((c) => c.claimId?.startsWith("nz-")), "the registered NZ figures are matched").toBe(true);
    const au = scanNumericClaims(fileOf(r, "AU"), { resource: "OG-99", market: "AU", registry, treatment });
    expect(au.filter((c) => c.bucket === "C_NEEDS_SOURCE"), "AU Bucket C").toEqual([]);
  });
});

describe("Stage 9.62 · gas leak response fails closed in Australia", () => {
  it("5. serves New Zealand's procedure and NO Australian body", () => {
    expect(body("gas-leak-response", "NZ")).toMatch(/Never operate any electrical switch/);
    expect(body("gas-leak-response", "AU"), "AU is deliberately absent").toBeUndefined();
    const r = prep({ extraSafetyBlocks: ["gas-leak-response"] });
    const au = r.markets.find((m) => m.code === "AU")!;
    expect(au.publishable, "an AU file carrying the block cannot be published").toBe(false);
    expect(au.problems.join(" ")).toContain("safety.notVerifiedForMarket");
    expect(r.markets.find((m) => m.code === "NZ")!.publishable, "NZ is unaffected").toBe(true);
  });

  it("5b. conflicting leak instructions are kept apart, never merged", () => {
    const leak = overrides("gas-leak-response");
    const byId = new Map(leak.map((o) => [o.id, o]));
    for (const o of leak.filter((x) => x.conflictsWith?.length)) {
      for (const other of o.conflictsWith!) {
        expect(byId.has(other), `${o.id} names a conflict that does not exist: ${other}`).toBe(true);
        expect(byId.get(other)!.jurisdiction, `${o.id} vs ${other}`).not.toBe(o.jurisdiction);
      }
    }
    // The headline conflict, by jurisdiction: three different answers to "what about the power?".
    const claim = (id: string) => byId.get(id)!.claim;
    expect(claim("sa-leak")).toMatch(/TURN OFF THE GAS AND ELECTRICITY/);
    expect(claim("wa-leak")).toMatch(/LEAVE THEM ON/);
    expect(claim("qld-leak")).toMatch(/DON'T TURN ANY ELECTRICAL DEVICES/);
    expect(claim("tas-leak")).toMatch(/ISOLATE POWER/);
    // Seven jurisdictions give a procedure; the ACT gives none and is recorded as such, not guessed.
    expect(leak.map((o) => o.jurisdiction).sort()).toEqual(["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]);
    expect(byId.get("act-leak-absent")!.claim).toMatch(/NOT RELIED UPON/);
  });

  it("5c. the drafted AU wording instructs nothing about electrical switches or power — and says it does not", () => {
    const draft = (blocks["gas-leak-response"].draftedNotServed ?? {}).AU!;
    expect(draft).toBeTruthy();
    // The first paragraph is the instruction; the second is the sentence that declines to give one. The first must
    // say nothing at all about electricity, switches or power.
    const [instruction, disclaimer] = draft.split("\n");
    expect(instruction, "the instruction paragraph").not.toMatch(/electric|switch|power|torch|\bfans?\b|phone|isolate|appliance/i);
    expect(disclaimer, "the declining paragraph").toMatch(/gives no instruction about it/);
    expect(disclaimer).toMatch(/differs between states and territories/);
    expect(draft, "unserved wording must not leak into a served body").not.toBe(body("gas-leak-response", "AU"));
  });

  it("no override's wording reaches any served body in either market", () => {
    const served = GAS_BLOCKS.flatMap((id) => [body(id, "NZ") ?? "", body(id, "AU") ?? "", ...Object.values(blocks[id].marketBodyWhen ?? {}).flatMap((v) => Object.values(v ?? {}))]).join("\n");
    for (const o of allOverrides()) {
      const sentence = o.claim.split(/[.;]/)[0].trim();
      expect(served, `override ${o.id} leaked into a served body`).not.toContain(sentence);
    }
  });
});

describe("Stage 9.62 · state overrides carry a label, and are served only when the state is known", () => {
  it("6. every override has a state, a label, a category and the serving rule that goes with it", () => {
    const states = new Set(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]);
    expect(allOverrides().length).toBeGreaterThan(20);
    for (const o of allOverrides()) {
      expect(states.has(o.jurisdiction), `${o.id}: ${o.jurisdiction}`).toBe(true);
      expect(o.label, `${o.id} label`).toBeTruthy();
      expect(["B", "C"], `${o.id}: A belongs in the served core, not in an override`).toContain(o.category);
      expect(o.servedWhen, o.id).toBe(o.category === "B" ? "state-label" : "state-routing");
      for (const field of ["claim", "source", "authority", "sourceDate"] as const) expect(o[field], `${o.id}.${field}`).toBeTruthy();
    }
    // No override has a national-sounding jurisdiction.
    expect(allOverrides().some((o) => /national|australia\b/i.test(o.jurisdiction))).toBe(false);
  });

  it("6b. category C is never servable without a known, matching state; B needs its label", () => {
    const c = allOverrides().find((o) => o.id === "vic-service-interval")!;
    expect(overrideServable(c, {}), "unknown state").toBe(false);
    expect(overrideServable(c, { state: null }), "null state").toBe(false);
    expect(overrideServable(c, { state: "NSW" }), "another state's member").toBe(false);
    expect(overrideServable(c, { state: "vic" }), "the matching state").toBe(true);
    const b = allOverrides().find((o) => o.id === "wa-adaptor-ban")!;
    expect(overrideServable(b, {}), "B with no label").toBe(false);
    expect(overrideServable(b, { renderedWith: "Building and Energy (WA) says…" }), "B with its label").toBe(true);
    expect(overrideServable({ ...b, label: "" }, { renderedWith: "anything" }), "no label is never servable").toBe(false);
    expect(overrideServable({ ...b, jurisdiction: "" }, { renderedWith: "Building and Energy (WA)" }), "no state is never servable").toBe(false);
  });

  it("classifies every numeric override as category C", () => {
    for (const o of allOverrides().filter((x) => x.figure)) expect(o.category, `${o.id} carries a figure`).toBe("C");
  });
});

describe("Stage 9.62 · detection: what triggers which block", () => {
  it("8. outdoor-appliance teaching triggers", () => {
    const text = "Never bring a patio heater indoors. Use the camping stove outside and store the propane cylinder upright. A barbecue is for outdoor use only.";
    const needed = requires(text);
    expect(needed).toContain("gas-and-lpg");
    expect(needed).toContain("unflued-gas-heating");
    expect(needed).toContain("gas-cylinder-safety");
  });

  it("9. cylinder teaching triggers", () => {
    expect(requires("Store the LPG cylinder upright. Check the LPG cylinder valve before you connect it.")).toContain("gas-cylinder-safety");
    expect(requires("Never refill a gas bottle yourself. Check the gas bottle for damage.")).toContain("gas-cylinder-safety");
  });

  it("10. gasfitter and servicing teaching triggers", () => {
    expect(requires("Have the gas heater serviced by a licensed gasfitter every year.")).toContain("gas-installation-and-servicing");
    expect(requires("A gasfitter must install the gas cooktop. Ask the gasfitter for a certificate.")).toContain("gas-installation-and-servicing");
  });

  it("gas leak teaching triggers", () => {
    expect(requires("If you smell gas, turn off the gas appliance and open the windows. Treat any gas leak as an emergency.")).toContain("gas-leak-response");
  });

  it("11. table-shaped teaching triggers, and a FLUED gas row does not pull in the unflued block", () => {
    const table =
      "<table><tr><td>Flued gas</td><td>$1,500-$4,000</td><td>Moderate</td><td>80-90%</td><td>No (gas supply)</td></tr></table>";
    const text = `${table} ${table}`.replace(/<[^>]+>/g, " ");
    const needed = requires(text);
    expect(needed, "OG-B09's table is gas teaching").toContain("gas-and-lpg");
    expect(needed, "a FLUED heater is not an unflued heater").not.toContain("unflued-gas-heating");
  });

  it("12. OG-17's narrative gas references trigger none of the five", () => {
    const narrative =
      "Plan your solid fuel system for when the power goes out and the gas stops flowing. When the grid fails in winter, electric heaters stop. Gas supplies can be disrupted. Gas supply may fail.";
    expect(requires(narrative).filter((t) => t === "gas-and-lpg" || GAS_BLOCKS.includes(t as never))).toEqual([]);
    expect(requires(`${narrative} ${narrative} ${narrative}`).filter((t) => t === "gas-and-lpg")).toEqual([]);
  });

  it("12b. a fuel listed among options, and a fireplace row, trigger none", () => {
    expect(requires("Fuel: firewood, LPG, or diesel. Storage: lithium battery bank, generator fuel reserve (diesel/petrol/LPG).").filter((t) => t.startsWith("gas"))).toEqual([]);
    expect(requires("Backup heating exists (fireplace, wood burner, gas heater, portable). Emergency heating (gas heater / thermal blankets).").filter((t) => t.startsWith("gas") || t.startsWith("unflued"))).toEqual([]);
  });

  it("documents each block's triggers and never relies on the bare word", () => {
    for (const id of GAS_BLOCKS) {
      const t = (blocks[id] as unknown as { triggers: { notTriggeredBy: string[]; teachingSignals: string } }).triggers;
      expect(t.teachingSignals, id).toMatch(/GAS_TEACHING|AND/);
    }
    expect(requires("gas gas gas gas gas gas gas gas")).toEqual([]);
  });
});

describe("Stage 9.62 · overlap and deduplication with the existing blocks", () => {
  const sentence = (text: string | undefined, fragment: string) => (text ?? "").includes(fragment);

  it("states each point once when the existing blocks are carried alongside", () => {
    const alone = prep({ extraSafetyBlocks: ["gas-and-lpg-general"] });
    const withAll = prep({ extraSafetyBlocks: ["gas-and-lpg-general", "carbon-monoxide", "indoor-combustion"] });
    const OUTDOOR_NZ = "Outdoor gas appliances — patio heaters, barbecues and camping cookers — must never be used indoors";
    const SIGNS_NZ = "Signs that a gas appliance is not working properly";
    expect(sentence(fileOf(alone, "NZ"), OUTDOOR_NZ), "alone: it says it").toBe(true);
    expect(sentence(fileOf(alone, "NZ"), SIGNS_NZ), "alone: it says it").toBe(true);
    const nz = fileOf(withAll, "NZ");
    expect(sentence(nz, OUTDOOR_NZ), "beside indoor-combustion the outdoor paragraph is dropped").toBe(false);
    expect(sentence(nz, SIGNS_NZ), "beside carbon-monoxide the flame-signs paragraph is dropped").toBe(false);
    expect(sentence(nz, "Gas and LPG appliances are safe when"), "the block itself still appears").toBe(true);
    // Indoor-combustion and carbon-monoxide still say them, so the member still gets the safety wording.
    expect(nz).toContain("Never use a barbecue, patio heater, camping cooker or generator inside");
    expect(nz).toContain("yellow rather than blue flame");
  });

  it("the unflued block drops everything indoor-combustion already says, and keeps what is new", () => {
    const r = prep({ extraSafetyBlocks: ["unflued-gas-heating", "indoor-combustion"] });
    const nz = fileOf(r, "NZ");
    expect(nz, "the duplicated bedroom/bathroom paragraph is dropped").not.toContain("Do not use an unflued gas heater in a bedroom, a bathroom");
    expect(nz, "indoor-combustion still says it").toContain("never use it in a bedroom, bathroom, caravan or tent");
    expect(nz, "what is new survives: the mould link").toContain("water vapour that can feed mould and dust mites");
    expect(nz, "and the one-metre rule").toContain("Heater Metre Rule");
  });

  it("deduplicates in the right market when the NZ and AU variants are keyed by different blocks", () => {
    // gas-and-lpg-general has an AU paragraph that is dropped beside the installation block and no NZ equivalent.
    // A key that exists only for AU must not out-rank, and so discard, a valid NZ key.
    const r = prep({ extraSafetyBlocks: ["gas-and-lpg-general", "carbon-monoxide", "gas-installation-and-servicing"] });
    expect(sentence(fileOf(r, "NZ"), "Signs that a gas appliance is not working properly"), "NZ still trims beside carbon-monoxide").toBe(false);
    // The AU limitation is already said by the carbon-monoxide block, so the general block drops it: AU trims too.\n    expect(sentence(fileOf(r, "AU"), "Gas safety rules — including how often an appliance must be serviced — differ"), "AU trims too").toBe(false);\n    expect(sentence(fileOf(r, "AU"), "servicing intervals differ between states and territories"), "and the member still gets the point, once").toBe(true);
  });

  it("never loses the licensed-gasfitter routing, however the blocks are combined", () => {
    for (const set of [["gas-installation-and-servicing"], ["gas-installation-and-servicing", "carbon-monoxide"], ["gas-installation-and-servicing", "carbon-monoxide", "indoor-combustion"]]) {
      const r = prep({ extraSafetyBlocks: set });
      expect(fileOf(r, "NZ"), set.join("+")).toMatch(/licensed gasfitter or certifying gasfitter/);
      expect(fileOf(r, "AU"), set.join("+")).toMatch(/licensed gasfitter/);
    }
  });

  it("carries no price, and passes the price-presence gate, in every body and variant", () => {
    for (const id of GAS_BLOCKS) {
      const texts = [body(id, "NZ") ?? "", body(id, "AU") ?? "", ...Object.values(blocks[id].marketBodyWhen ?? {}).flatMap((v) => Object.values(v ?? {}))];
      for (const text of texts) {
        const found = scanPrices(`<div class="content"><p>${text.replace(/\n/g, "</p><p>")}</p></div>`).filter((c) => c.kind === "PRICE");
        expect(found, id).toEqual([]);
      }
    }
  });
});

describe("Stage 9.62A · detected gas topic → required block SET → every block available and approved", () => {
  const BASE = (p: string) =>
    `<!DOCTYPE html><html><head></head><body><div class="cover-page"><div class="cover-label">OffGrid056</div><h1 class="cover-title">Heating Checklist</h1><p class="cover-subtitle">A checklist.</p></div><div class="content"><h2>Plan</h2><p>${p}</p></div></body></html>`;
  const GENERIC = "Compare a flued gas heater with a heat pump before you decide.";
  const TEACH = {
    cylinder: "Check the LPG cylinder test date and keep the LPG cylinder upright.",
    unflued: "Use an unflued gas heater only in a ventilated room and keep the room's vents clear.",
    leak: "If you smell gas, turn off the gas at the meter and leave the building.",
    install: "Have a licensed gasfitter install the gas heater.",
  };
  const GENERAL = "gas-and-lpg-general";
  /** The blocks as the owner would have them once approved (the real file marks every gas block pending). */
  const approve = (ids: readonly string[]) =>
    Object.fromEntries(Object.entries(blocks).map(([k, b]) => [k, ids.includes(k) ? ({ ...b, pendingOwnerApproval: undefined } as SafetyBlock) : b])) as Record<string, SafetyBlock>;
  const run = (text: string, carried: string[], approved: readonly string[], extra: Partial<PrepInputs> = {}) =>
    prep({ sourceHtml: BASE(text), blocks: approve(approved), extraSafetyBlocks: carried, ...extra });
  const gas = (r: ReturnType<typeof prep>, m: string) => r.safety.gas.find((g) => g.market === m)!;
  const unavailableIds = (r: ReturnType<typeof prep>, m: string) => gas(r, m).unavailable.map((u) => u.id);
  const publishable = (r: ReturnType<typeof prep>, m: string) => r.markets.find((x) => x.code === m)!.publishable;
  const gasFindings = (r: ReturnType<typeof prep>) => r.terminology.otherFindings.filter((f) => /^GAS_/.test(f));

  it("maps each detected gas topic to the general block PLUS its own", () => {
    expect(GAS_BLOCK_SET).toEqual({
      "gas-and-lpg": [GENERAL],
      "unflued-gas-heating": [GENERAL, "unflued-gas-heating"],
      "gas-cylinder-safety": [GENERAL, "gas-cylinder-safety"],
      "gas-leak-response": [GENERAL, "gas-leak-response"],
      "gas-installation-and-servicing": [GENERAL, "gas-installation-and-servicing"],
    });
    expect(requiredGasBlocks(["gas-cylinder-safety", "gas-leak-response"], false).sort()).toEqual([GENERAL, "gas-cylinder-safety", "gas-leak-response"]);
    expect(requiredGasBlocks([], true), "a gas FUEL finding with no detected topic is generic gas teaching").toEqual([GENERAL]);
    expect(requiredGasBlocks([], false), "nothing detected, nothing required").toEqual([]);
  });

  it("detects the specific topic from the member-facing text, before any block is considered", () => {
    expect(requires(TEACH.cylinder)).toContain("gas-cylinder-safety");
    expect(requires(TEACH.unflued)).toContain("unflued-gas-heating");
    expect(requires(TEACH.leak)).toContain("gas-leak-response");
    expect(requires(TEACH.install)).toContain("gas-installation-and-servicing");
  });

  it("the general block does NOT satisfy cylinder teaching", () => {
    const r = run(TEACH.cylinder, [GENERAL], [GENERAL]);
    expect(gas(r, "NZ").required).toEqual(expect.arrayContaining([GENERAL, "gas-cylinder-safety"]));
    expect(unavailableIds(r, "NZ")).toEqual(["gas-cylinder-safety"]);
    expect(publishable(r, "NZ")).toBe(false);
    expect(r.safety.missingRequired).toContain("gas-cylinder-safety");
  });

  it("the general block does NOT satisfy unflued-heater teaching", () => {
    const r = run(TEACH.unflued, [GENERAL], [GENERAL]);
    expect(gas(r, "NZ").required).toEqual(expect.arrayContaining([GENERAL, "unflued-gas-heating"]));
    expect(unavailableIds(r, "NZ")).toEqual(["unflued-gas-heating"]);
    expect(publishable(r, "NZ")).toBe(false);
  });

  it("the general block does NOT satisfy leak-response teaching", () => {
    const r = run(TEACH.leak, [GENERAL], [GENERAL]);
    expect(gas(r, "NZ").required).toEqual(expect.arrayContaining([GENERAL, "gas-leak-response"]));
    expect(unavailableIds(r, "NZ")).toEqual(["gas-leak-response"]);
    expect(publishable(r, "NZ")).toBe(false);
  });

  it("installation teaching requires the installation/servicing block as well as the general block", () => {
    const only = run(TEACH.install, [GENERAL], [GENERAL]);
    expect(unavailableIds(only, "NZ")).toEqual(["gas-installation-and-servicing"]);
    expect(publishable(only, "NZ")).toBe(false);
    const both = run(TEACH.install, [GENERAL, "gas-installation-and-servicing"], [GENERAL, "gas-installation-and-servicing"]);
    expect(unavailableIds(both, "NZ")).toEqual([]);
    expect(unavailableIds(both, "AU")).toEqual([]);
    expect(gasFindings(both)).toEqual([]);
  });

  it("a missing CRITICAL block fails closed in every market", () => {
    // unflued heating and leak response are CRITICAL; neither is carried.
    for (const text of [TEACH.unflued, TEACH.leak]) {
      const r = run(text, [GENERAL], [GENERAL]);
      expect(publishable(r, "NZ"), text).toBe(false);
      expect(publishable(r, "AU"), text).toBe(false);
      expect(r.importReadiness, text).not.toBe("READY_AFTER_FINAL_VALIDATION");
    }
  });

  it("a block that is carried but PENDING OWNER APPROVAL satisfies nothing", () => {
    // the real blocks: NZ wording of all five is still pending (Stage 9.62D)
    const r = prep({ sourceHtml: BASE(TEACH.install), extraSafetyBlocks: [GENERAL, "gas-installation-and-servicing"] });
    expect(unavailableIds(r, "NZ").sort()).toEqual([GENERAL, "gas-installation-and-servicing"].sort());
    expect(gas(r, "NZ").unavailable.every((u) => /PENDING OWNER APPROVAL/.test(u.reason))).toBe(true);
    expect(publishable(r, "NZ")).toBe(false);
  });

  it("Stage 9.62D approval state: AU wording approved for three blocks, AU unflued and AU leak fail closed, NZ pending for all five", () => {
    const pending = (id: string) => (blocks[id].pendingOwnerApproval ?? []) as string[];
    for (const id of ["gas-and-lpg-general", "gas-cylinder-safety", "gas-installation-and-servicing"]) {
      expect(pending(id), `${id}: AU approved, NZ not`).toEqual(["NZ"]);
      expect(body(id, "AU"), id).toBeTruthy();
      expect(JSON.stringify((blocks[id] as unknown as { verification: Record<string, string> }).verification.AU), id).toMatch(/OWNER-APPROVED 2026-10-06/);
    }
    for (const id of ["unflued-gas-heating", "gas-leak-response"]) {
      expect(body(id, "AU"), `${id}: no served AU body`).toBeUndefined();
      expect(pending(id), id).toEqual(["NZ", "AU"]);
      expect(JSON.stringify((blocks[id] as unknown as { verification: Record<string, string> }).verification.AU), id).toMatch(/FAIL/);
    }
    expect(JSON.stringify((blocks["gas-leak-response"] as unknown as { verification: Record<string, string> }).verification.AU)).toMatch(/NOT approved as AU common-core wording/);
    // AU approval never releases NZ, and NZ stays unavailable until its own approval
    const r = prep({ sourceHtml: BASE(GENERIC), extraSafetyBlocks: [GENERAL] });
    expect(unavailableIds(r, "AU")).toEqual([]);
    expect(unavailableIds(r, "NZ")).toEqual([GENERAL]);
    // and the AU leak / unflued blocks stay unavailable in AU even though they are carried
    const leak = prep({ sourceHtml: BASE(TEACH.leak), extraSafetyBlocks: [GENERAL, "gas-leak-response"] });
    expect(unavailableIds(leak, "AU")).toEqual(["gas-leak-response"]);
  });

  it("a block that is only a PROPOSAL for this resource satisfies nothing", () => {
    const r = run(GENERIC, [GENERAL], [GENERAL], { proposedBlockIds: [GENERAL] });
    expect(unavailableIds(r, "NZ")).toEqual([GENERAL]);
    expect(gasFindings(r).length).toBeGreaterThan(0);
    expect(r.importReadiness).not.toBe("READY_AFTER_FINAL_VALIDATION");
  });

  it("AU leak response remains unavailable even when the block is carried and approved", () => {
    const r = run(TEACH.leak, [GENERAL, "gas-leak-response"], [GENERAL, "gas-leak-response"]);
    expect(unavailableIds(r, "NZ"), "NZ has verified wording, so it is satisfied").toEqual([]);
    expect(unavailableIds(r, "AU")).toEqual(["gas-leak-response"]);
    expect(gas(r, "AU").unavailable[0].reason).toMatch(/FAILS CLOSED in AU/);
    expect(publishable(r, "AU")).toBe(false);
  });

  it("AU unflued-heater teaching also fails closed: no claim reaches the common core", () => {
    const r = run(TEACH.unflued, [GENERAL, "unflued-gas-heating"], [GENERAL, "unflued-gas-heating"]);
    expect(unavailableIds(r, "NZ")).toEqual([]);
    expect(unavailableIds(r, "AU")).toEqual(["unflued-gas-heating"]);
    expect(publishable(r, "AU")).toBe(false);
  });

  it("generic gas teaching is released by the general block alone, once it is approved", () => {
    const r = run(GENERIC, [GENERAL], [GENERAL]);
    expect(unavailableIds(r, "NZ")).toEqual([]);
    expect(unavailableIds(r, "AU")).toEqual([]);
    expect(gasFindings(r)).toEqual([]);
  });

  it("still holds a gas resource that carries no gas block", () => {
    const r = run(GENERIC, [], []);
    expect(unavailableIds(r, "NZ")).toEqual([GENERAL]);
    expect(gasFindings(r).length).toBeGreaterThan(0);
  });

  it("never releases the DIESEL check, whatever gas block is carried", () => {
    const r = run("Compare a diesel heater with a heat pump before you decide.", [GENERAL], [GENERAL]);
    expect(r.terminology.otherFindings.some((f) => f.startsWith("FUEL_GUIDANCE_REQUIRED"))).toBe(true);
  });
});
describe("Stage 9.62A · the tightened Category-A rule", () => {
  it("two jurisdictions alone never create Category A, however clean they are", () => {
    expect(classifyCommonClaim({ jurisdictions: ["VIC", "TAS"] }).category).toBe("B");
    expect(classifyCommonClaim({ jurisdictions: ["VIC", "QLD", "WA"] }).category, "three is still not enough").toBe("B");
    expect(classifyCommonClaim({ jurisdictions: ["VIC", "vic", "TAS", "WA"] }).category, "the same jurisdiction twice counts once").toBe("B");
    expect(classifyCommonClaim({ jurisdictions: [] }).category, "no recorded evidence is not evidence").toBe("B");
  });

  it("enters Category A only with a national source or four or more independent jurisdictions", () => {
    expect(COMMON_CORE_MIN_JURISDICTIONS).toBe(4);
    expect(classifyCommonClaim({ jurisdictions: ["VIC", "TAS", "WA", "ACT"] }).category).toBe("A");
    expect(classifyCommonClaim({ jurisdictions: ["VIC"], nationalSource: true }).category).toBe("A");
  });

  it("is never Category A when the claim is numeric, contradicted or state-limited", () => {
    const four = ["VIC", "TAS", "WA", "ACT"];
    expect(classifyCommonClaim({ jurisdictions: four, numeric: true }).category).toBe("C");
    expect(classifyCommonClaim({ jurisdictions: four, contradictedBy: ["NSW"] }).category).toBe("C");
    expect(classifyCommonClaim({ jurisdictions: four, jurisdictionSpecificLimitation: true }).category).toBe("C");
    expect(classifyCommonClaim({ jurisdictions: four, nationalSource: true, numeric: true }).category, "a national source does not make a number common").toBe("C");
  });

  it("every served AU line traces to a Category-A claim with enough recorded evidence", () => {
    for (const id of GAS_BLOCKS) {
      const claims = (blocks[id].commonCoreClaims ?? []) as CommonCoreClaim[];
      const au = body(id, "AU");
      if (!au) {
        // fails closed: nothing is served, so nothing may be marked served
        expect(claims.filter((c) => c.served), `${id} serves nothing`).toEqual([]);
        continue;
      }
      const served = claims.filter((c) => c.served);
      expect(served.length, id).toBeGreaterThan(0);
      for (const c of served) {
        expect(c.category, `${id}/${c.id}`).toBe("A");
        expect(new Set(c.evidence.jurisdictions).size, `${id}/${c.id} evidence`).toBeGreaterThanOrEqual(COMMON_CORE_MIN_JURISDICTIONS);
        expect(classifyCommonClaim(c.evidence).category, `${id}/${c.id} recomputed`).toBe(c.category);
      }
      for (const line of au.split("\n")) expect(served.map((c) => c.text), `${id}: an AU line with no Category-A claim behind it`).toContain(line);
      // and no claim that was NOT served leaks in
      for (const c of claims.filter((x) => !x.served)) expect(au, `${id}/${c.id} leaked`).not.toContain(c.text);
    }
    expect(blocks["unflued-gas-heating"].marketBody?.AU, "no unflued claim reaches the common core, so there is no AU body").toBeUndefined();
  });

  it("keeps every demoted claim as a labelled category-B record, per jurisdiction, not served", () => {
    const demoted = GAS_BLOCKS.flatMap((id) => ((blocks[id].commonCoreClaims ?? []) as CommonCoreClaim[]).filter((c) => !c.served).map((c) => ({ id, c })));
    expect(demoted.length).toBeGreaterThan(10);
    for (const { id, c } of demoted) {
      const records = overrides(id).filter((o) => o.id.startsWith(`${c.id}-`));
      expect(records.map((r) => r.jurisdiction).sort(), `${id}/${c.id}`).toEqual([...new Set(c.evidence.jurisdictions)].sort());
      for (const r of records) {
        expect(r.category, r.id).toBe("B");
        expect(r.servedWhen, r.id).toBe("state-label");
        expect(r.label, r.id).toBeTruthy();
        expect(overrideServable(r, { renderedWith: undefined }), `${r.id} is not servable unlabelled`).toBe(false);
      }
    }
  });
});

describe("Stage 9.62B · provenance is complete", () => {
  it("every jurisdiction a claim cites appears in its own block's AU source list", () => {
    for (const id of GAS_BLOCKS) {
      const list = ((blocks[id].sources as unknown) as { AU?: string[] }).AU ?? [];
      for (const c of (blocks[id].commonCoreClaims ?? []) as CommonCoreClaim[]) {
        for (const j of new Set(c.evidence.jurisdictions)) {
          expect(list.some((s) => s.includes(`(${j};`)), `${id}/${c.id} cites ${j} but the block lists no ${j} source`).toBe(true);
        }
      }
    }
  });
});

describe("Stage 9.62A · recurring intervals and spelled numbers are detected, and fail unless registered", () => {
  it("reads annual wording as an interval claim, with no digit and no unit-with-number", () => {
    for (const text of ["Have the heater serviced once a year.", "Have the heater serviced annually.", "Have the heater serviced yearly.", "The cylinder is checked each year.", "Check the hose every year.", "Replace the regulator every other year.", "Service it two or three times a year."]) {
      expect(buckets(text, "NZ"), text).toContain("C_NEEDS_SOURCE");
      expect(buckets(text, "AU"), text).toContain("C_NEEDS_SOURCE");
    }
  });

  it("'every year' cannot bypass interval checking by omitting a verb the gate knows", () => {
    // "flushed" and "topped up" are not in the interval-verb list; the recurrence itself makes it a claim.
    for (const text of ["The tank is flushed every year.", "The unit is topped up once a year.", "It is replaced each year."]) expect(buckets(text, "AU"), text).toContain("C_NEEDS_SOURCE");
  });

  it("an unregistered recurrence still FAILS the blocking gate; nothing is registered automatically", () => {
    const findings = numericBlockingFindings(`<div class="content"><p>Have the gas heater serviced once a year.</p></div>`, { resource: "OG-B09", market: "NZ", registry, treatment });
    expect(findings.join(" ")).toContain("UNSOURCED_NUMERIC_CLAIM");
    expect(registry.claims.filter((c) => /once-a-year|every-year|each-year|yearly/.test(c.id))).toEqual([]);
  });

  it("does not read 'yearly' as an interval when it is only an adjective on a noun", () => {
    expect(buckets("Compare the estimated yearly generation and savings.", "NZ")).not.toContain("C_NEEDS_SOURCE");
  });

  it("reads spelled numbers above twelve beside a unit", () => {
    for (const text of ["A cylinder is valid for twenty years.", "Keep the cylinder fifteen metres from the house.", "Test the alarm every fourteen days.", "Stay twenty-five metres away."]) {
      expect(buckets(text, "AU"), text).toContain("C_NEEDS_SOURCE");
    }
  });

  it("documents what the spelled-number reader does NOT see, instead of pretending to cover it", () => {
    expect(SPELLED_NUMBER_LIMITS).toMatch(/couple of|dozen|several/);
    expect(buckets("Replace it after a couple of years.", "AU"), "recorded limitation: vague quantities are not read").not.toContain("C_NEEDS_SOURCE");
  });

  it("the NZ gas intervals are still approved ONLY inside their own blocks", () => {
    const annual = inBlock("gas-installation-and-servicing", "WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually.");
    expect(bucketsHtml(annual, "NZ")).toContain("A_ALREADY_SOURCED");
  });
});

/** Real legacy sources, when the working copy has them (they are private and git-ignored). */
describe("Stage 9.62A · OG-B09, OG-24 and OG-17 against the required-block mechanism", () => {
  const candidatesFile = path.join(root, "workspace/candidates.json");
  const have = fs.existsSync(candidatesFile);
  const htmlOf = (code: string) => {
    const cands = JSON.parse(fs.readFileSync(candidatesFile, "utf8")) as { source: { path: string; filename: string; extension: string } }[];
    const f = cands.find((c) => c.source.filename.startsWith(`${code}_`) && /\.html?$/i.test(c.source.extension));
    return f ? fs.readFileSync(f.source.path, "utf8") : null;
  };
  const textOf = (code: string) => {
    const cands = JSON.parse(fs.readFileSync(candidatesFile, "utf8")) as { candidateId: string; source: { filename: string } }[];
    const store = JSON.parse(fs.readFileSync(path.join(root, "workspace/text/extracted.json"), "utf8")) as Record<string, unknown>;
    const texts = ("texts" in store ? (store as { texts: Record<string, string> }).texts : store) as Record<string, string>;
    return cands.filter((c) => c.source.filename.startsWith(`${code}_`)).map((c) => texts[c.candidateId] ?? "").join("\n");
  };
  const GASSET = (t: string, fuel: boolean) => requiredGasBlocks(safetyExposureFor(t).filter((x) => x in GAS_BLOCK_SET), fuel);

  it("OG-B09: the heating table row is gas teaching, and the required set is the general block ALONE", () => {
    if (!have) return;
    const html = htmlOf("OG-B09");
    if (!html) return;
    const fuel = fuelSafetyFindings(html).some((f) => f.startsWith("GAS_SAFETY_REQUIRED"));
    expect(fuel, "the own-text fuel check fires on 'Flued gas'").toBe(true);
    expect(safetyExposureFor(textOf("OG-B09")), "the source teaches gas through table figures").toContain("gas-and-lpg");
    expect(GASSET(memberFacingText(html), fuel)).toEqual([GENERAL_ID]);
    for (const not of ["unflued-gas-heating", "gas-cylinder-safety", "gas-leak-response", "gas-installation-and-servicing"]) {
      expect(safetyExposureFor(textOf("OG-B09")), `OG-B09 does not require ${not}`).not.toContain(not);
    }
    // today it could not be released: the block is PENDING OWNER APPROVAL
    expect(gasBlockAvailability(GENERAL_ID, "NZ", blocks, [GENERAL_ID], []).available).toBe(false);
  });

  it("OG-24: 'Certifying Plumber / Gasfitter' and 'gas appliance install' are licensing routing, and need general + installation", () => {
    if (!have) return;
    const html = htmlOf("OG-24");
    if (!html) return;
    const set = GASSET(memberFacingText(html), true);
    expect(set.sort()).toEqual([GENERAL_ID, "gas-installation-and-servicing"].sort());
    expect(safetyExposureFor(textOf("OG-24"))).toEqual(expect.arrayContaining(["gas-and-lpg", "gas-installation-and-servicing"]));
    expect(safetyExposureFor(textOf("OG-24")), "OG-24 teaches no leak, cylinder or unflued content").not.toEqual(expect.arrayContaining(["gas-leak-response"]));
  });

  it("OG-17 remains a negative control: no gas block required, no fuel finding", () => {
    if (!have) return;
    const html = htmlOf("OG-17");
    if (!html) return;
    expect(GASSET(memberFacingText(html), false)).toEqual([]);
    expect(fuelSafetyFindings(html).filter((f) => f.startsWith("GAS_"))).toEqual([]);
  });
});
describe("Stage 9.62 · the live library is unchanged", () => {
  it("14. no existing resource carries or requires a Gas/LPG block, and every one is still ready", () => {
    const report = path.join(root, "workspace/prep/prep-report.json");
    if (!fs.existsSync(report)) return; // prep output is a working artefact, not committed
    const results = JSON.parse(fs.readFileSync(report, "utf8")) as {
      legacyCode: string; importReadiness: string;
      safety: { blocks: string[]; sourceTopics: string[]; outputTopics: string[]; missingRequired: string[]; removedTopics: { accounted: boolean }[] };
      terminology: { otherFindings: string[] };
      markets: { publishable: boolean }[];
    }[];
    const live = results.filter((r) => r.legacyCode !== "OG-B09");
    expect(live.length).toBeGreaterThanOrEqual(21);
    for (const r of live) {
      expect(r.importReadiness, r.legacyCode).toBe("READY_AFTER_FINAL_VALIDATION");
      expect(r.markets.every((m) => m.publishable), r.legacyCode).toBe(true);
      for (const id of [...GAS_BLOCKS, "gas-and-lpg"]) {
        expect(r.safety.blocks, `${r.legacyCode} carries ${id}`).not.toContain(id);
        expect(r.safety.outputTopics, `${r.legacyCode} output requires ${id}`).not.toContain(id);
        expect(r.safety.sourceTopics, `${r.legacyCode} source requires ${id}`).not.toContain(id);
      }
      expect(r.safety.removedTopics.every((t) => t.accounted), r.legacyCode).toBe(true);
      expect(r.terminology.otherFindings.filter((f) => /GAS_|PRICE/.test(f)), r.legacyCode).toEqual([]);
    }
  });
});
