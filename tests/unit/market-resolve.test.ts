import { describe, expect, it } from "vitest";
import profilesFile from "@/admin-import/markets/profiles.json";
import sample from "@/admin-import/markets/sample-og-08.json";
import {
  publishable,
  resolveAll,
  resolveForMarket,
  resolveTokens,
  type CoreResource,
  type MarketProfile,
  type SafetyBlock,
} from "@/admin-import/markets/resolve";

/**
 * Stage 9.6B — the market layer's job is to let one document serve four markets without either duplicating it
 * or quietly publishing a blank where an official figure should be. These tests are mostly about the second.
 */
const markets = profilesFile.markets as unknown as MarketProfile[];
const market = (code: string) => markets.find((m) => m.code === code)!;
const resource = sample.resource as unknown as CoreResource;
const blocks = sample.safetyBlocks as unknown as Record<string, SafetyBlock>;

describe("token resolution", () => {
  it("resolves the emergency number per market", () => {
    const text = "Call {{emergency.number}} now.";
    expect(resolveTokens(text, market("NZ")).text).toBe("Call 111 now.");
    expect(resolveTokens(text, market("AU")).text).toBe("Call 000 now.");
    expect(resolveTokens(text, market("US")).text).toBe("Call 911 now.");
    expect(resolveTokens(text, market("CA")).text).toBe("Call 911 now.");
  });

  it("resolves agencies, terms, figures and links", () => {
    const nz = market("NZ");
    expect(resolveTokens("{{agency.emergencyManagement}}", nz).text).toBe("Civil Defence (NEMA)");
    expect(resolveTokens("{{term.electrician}}", nz).text).toBe("licensed electrical worker");
    expect(resolveTokens("{{figure.waterPerPersonPerDay}}", nz).text).toBe("3 litres");
    expect(resolveTokens("{{link.storingWater}}", nz).text).toContain("getready.govt.nz");
  });

  it("keeps an unknown token visible instead of blanking it", () => {
    const { text, unresolved } = resolveTokens("Call {{emergency.nonsense}} now.", market("NZ"));
    expect(text).toBe("Call {{emergency.nonsense}} now."); // still obvious on the page
    expect(unresolved).toEqual(["emergency.nonsense"]);
  });

  it("never turns a missing official figure into an empty string", () => {
    // AU has no verified water figure yet: it must not render as "store  of water per person".
    const { text, unresolved } = resolveTokens("Store {{figure.waterThreeDays}} of water.", market("AU"));
    expect(text).toContain("{{figure.waterThreeDays}}");
    expect(text).not.toBe("Store  of water.");
    expect(unresolved).toContain("figure.waterThreeDays");
  });
});

describe("resolving a real resource", () => {
  it("serves four markets from one core document", () => {
    const all = resolveAll(resource, markets, blocks);
    expect(all).toHaveLength(4);
    expect(new Set(all.map((r) => r.id)).size).toBe(1); // one resource, not four
    expect(all.map((r) => r.market).sort()).toEqual(["AU", "CA", "NZ", "US"]);
  });

  it("gives New Zealand its own figures, agency and emergency wording", () => {
    const nz = resolveForMarket(resource, market("NZ"), blocks);
    expect(nz.body).toContain("3 litres");
    expect(nz.body).toContain("Civil Defence (NEMA)");
    expect(nz.safety.find((s) => s.id === "emergency-contact")!.body).toContain("111");
    expect(nz.safety.find((s) => s.id === "emergency-contact")!.body).toContain("no credit");
    expect(nz.unresolvedTokens).toEqual([]);
  });

  it("gives the United States gallons and its own framing, from one override", () => {
    const us = resolveForMarket(resource, market("US"), blocks);
    expect(us.body).toContain("one gallon");
    expect(us.body).not.toContain("litres");
    expect(us.body).toContain("Ready.gov");
    expect(us.safety.find((s) => s.id === "emergency-contact")!.body).toContain("911");
    expect(us.unresolvedTokens).toEqual([]);
  });

  it("uses Australia's own emergency wording, including the 112 alternative", () => {
    const au = resolveForMarket(resource, market("AU"), blocks);
    const emergency = au.safety.find((s) => s.id === "emergency-contact")!;
    expect(emergency.body).toContain("000");
    expect(emergency.body).toContain("112");
  });

  it("keeps NZ-specific references valid rather than deleting them (owner ruling 2)", () => {
    const nz = market("NZ");
    expect(nz.agencies.energy!.name).toBe("EECA");
    expect(nz.agencies.housingStandard!.name).toBe("Healthy Homes Standards");
    expect(nz.terms.emergencyManagement).toBe("Civil Defence");
    // …and they are absent from the US profile rather than translated into nonsense.
    expect(market("US").agencies.housingStandard).toBeUndefined();
  });
});

describe("the publish gate", () => {
  it("clears a market where every figure is verified", () => {
    const nz = resolveForMarket(resource, market("NZ"), blocks);
    expect(publishable(nz, ["emergency-contact"]).ok).toBe(true);
  });

  it("refuses a market whose official figures have not been verified yet", () => {
    const au = resolveForMarket(resource, market("AU"), blocks);
    const check = publishable(au, ["emergency-contact"]);
    expect(check.ok).toBe(false);
    expect(check.problems.join(" ")).toMatch(/waterPerPersonPerDay|waterThreeDays/);
  });

  it("refuses a resource that is missing a required critical safety block", () => {
    const stripped: CoreResource = { ...resource, safetyBlocks: ["stored-drinking-water"] };
    const nz = resolveForMarket(stripped, market("NZ"), blocks);
    const check = publishable(nz, ["emergency-contact"]);
    expect(check.ok).toBe(false);
    expect(check.problems.join(" ")).toMatch(/emergency-contact.*required/);
  });

  it("notices a safety block that is referenced but does not exist", () => {
    const broken: CoreResource = { ...resource, safetyBlocks: ["does-not-exist"] };
    const nz = resolveForMarket(broken, market("NZ"), blocks);
    expect(nz.unresolvedTokens).toContain("safetyBlock:does-not-exist");
    expect(publishable(nz).ok).toBe(false);
  });
});

describe("the shape of the solution", () => {
  it("keeps 45 resources as 45 documents, not 180", () => {
    // One core document carries at most a handful of overrides, and only where a market genuinely differs.
    const overriddenMarkets = Object.keys(resource.overrides ?? {});
    expect(overriddenMarkets).toEqual(["US"]);
    expect(overriddenMarkets.length).toBeLessThan(markets.length);
  });

  it("shares safety wording by reference, so approved wording is written once", () => {
    const nz = resolveForMarket(resource, market("NZ"), blocks);
    const us = resolveForMarket(resource, market("US"), blocks);
    const water = (r: typeof nz) => r.safety.find((s) => s.id === "stored-drinking-water")!.body;
    // The same approved block, resolved into each market's agency name.
    expect(water(nz)).toContain("Civil Defence");
    expect(water(us)).toContain("Ready.gov");
    expect(water(nz).replace("Civil Defence (NEMA)", "X")).toBe(water(us).replace("FEMA / Ready.gov", "X"));
  });
});
