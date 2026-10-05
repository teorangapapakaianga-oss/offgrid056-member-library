import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareResource, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import { overrideServable, type MarketProfile, type SafetyBlock, type StateOverride } from "@/admin-import/markets/resolve";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { loadNumericRegistry, numericBlockingFindings, scanNumericClaims } from "@/admin-import/audit/numeric";
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
    expect(AU_SERVED.length).toBe(4);
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
    for (const id of ["gas-installation-and-servicing", "unflued-gas-heating", "gas-and-lpg-general"]) {
      expect(body(id, "AU")!, id).not.toMatch(/every two years|at least every|twice a year/i);
    }
    expect(body("gas-installation-and-servicing", "AU")).toMatch(/some set an interval and some do not/);
  });
});

describe("Stage 9.62 · New Zealand figures are registered, scoped and never validate Australia", () => {
  const NZ_ANNUAL = "WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually.";
  const NZ_TWO = "WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.";

  it("1. an NZ gas rule is sourced in NZ and is NOT sourced in AU", () => {
    expect(buckets(NZ_ANNUAL, "NZ")).toContain("A_ALREADY_SOURCED");
    expect(buckets(NZ_ANNUAL, "AU")).toContain("C_NEEDS_SOURCE");
    expect(buckets(NZ_TWO, "NZ")).toContain("A_ALREADY_SOURCED");
    expect(buckets(NZ_TWO, "AU")).toContain("C_NEEDS_SOURCE");
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
    const blind = [
      "Have your gas heater serviced once a year.",
      "Have your gas heater serviced every year.",
      "An LPG cylinder is valid for fifteen years from its test date.",
      "Replace the LPG hose after twenty years.",
    ];
    for (const text of blind) expect(buckets(text, "AU"), `currently invisible: ${text}`).not.toContain("C_NEEDS_SOURCE");
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
    expect(sentence(fileOf(r, "AU"), "Never tamper with safety valves or fittings, and never try to repair"), "AU trims too").toBe(false);
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

describe("Stage 9.62 · the fuel check is released only by an APPROVED gas block", () => {
  const GAS_OWN = `<!DOCTYPE html><html><head></head><body><div class="cover-page"><div class="cover-label">OffGrid056</div><h1 class="cover-title">Heating Checklist</h1><p class="cover-subtitle">A checklist.</p></div><div class="content"><h2>Plan</h2><p>Compare a flued gas heater with a heat pump before you decide.</p></div></body></html>`;
  const findings = (r: ReturnType<typeof prep>) => r.terminology.otherFindings.filter((f) => f.startsWith("GAS_SAFETY_REQUIRED"));

  it("still holds a gas resource that carries no gas block", () => {
    expect(findings(prep({ sourceHtml: GAS_OWN })).length).toBeGreaterThan(0);
  });

  it("still holds it while the block is only a PROPOSAL", () => {
    // proposedBlockIds is what the CLI derives for any block not in the resource's approvedSafetyBlocks.
    const r = prep({ sourceHtml: GAS_OWN, extraSafetyBlocks: ["gas-and-lpg-general"], proposedBlockIds: ["gas-and-lpg-general"] });
    expect(findings(r).length, "an unapproved block releases nothing").toBeGreaterThan(0);
    expect(r.importReadiness).not.toBe("READY_AFTER_FINAL_VALIDATION");
  });

  it("releases it once the owner has approved the block for that resource", () => {
    const r = prep({ sourceHtml: GAS_OWN, extraSafetyBlocks: ["gas-and-lpg-general"], proposedBlockIds: [] });
    expect(findings(r)).toEqual([]);
  });

  it("never releases the DIESEL check, whatever gas block is carried", () => {
    const diesel = GAS_OWN.replace("a flued gas heater", "a diesel heater");
    const r = prep({ sourceHtml: diesel, extraSafetyBlocks: ["gas-and-lpg-general"], proposedBlockIds: [] });
    expect(r.terminology.otherFindings.some((f) => f.startsWith("FUEL_GUIDANCE_REQUIRED"))).toBe(true);
  });

  it("does not release an unflued-heater requirement merely because the general block is approved", () => {
    const unflued = GAS_OWN.replace("a flued gas heater", "an unflued gas heater and teach how to use the LPG cabinet heater safely");
    const r = prep({ sourceHtml: unflued, extraSafetyBlocks: ["gas-and-lpg-general"], proposedBlockIds: [] });
    expect(r.safety.outputTopics).toContain("unflued-gas-heating");
    expect(r.safety.missingRequired, "the specialised block is still required").toContain("unflued-gas-heating");
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
