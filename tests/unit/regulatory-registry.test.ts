import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 10.12A — the two already-live, owner-approved, sourced regulatory statements are registered (owner Option A). Each entry covers ONE exact sentence in ONE
 * market in ONE resource. They are sourced claims, not exemptions: the regulatory-assertion rule stays strict everywhere else.
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const scan = (s: string, resource: string, market: string) => scanNumericClaims(`<div class="content"><p>${s}</p></div>`, { resource, market, registry, treatment });
const OG10 = "Connecting rainwater to the plumbing of a house that also has mains water needs a building consent, and the law requires the mains supply to be isolated by a backflow prevention device installed by a qualified plumber.";
const OG13 = "In Queensland, interconnected photoelectric alarms are required by law — check what applies where you live.";
const regulatory = (c: ReturnType<typeof scan>) => c.filter((x) => x.unit === "regulatory");
const OG10_ID = "nz-rainwater-plumbing-consent-backflow-mbie", OG13_ID = "au-qld-interconnected-photoelectric-alarms-law-qfd";

describe("the two registered regulatory claims", () => {
  const e10 = registry.claims.find((c) => c.id === OG10_ID)!, e13 = registry.claims.find((c) => c.id === OG13_ID)!;
  it("exist, with exact market and resource scope, a source, an authority, a source date and a status that records the prior approval", () => {
    expect(e10).toMatchObject({ market: "NZ", owningResources: ["OG-10"], requiresLabel: "backflow prevention device" });
    expect(e13).toMatchObject({ market: "AU", owningResources: ["OG-13"], requiresLabel: "Queensland" });
    for (const e of [e10, e13]) {
      expect(e.source).toMatch(/^https:\/\//);
      expect(e.authority.length).toBeGreaterThan(10);
      expect(e.sourceDate).toMatch(/2026/);
      expect(e.status).toMatch(/OWNER-APPROVED/);
      expect(e.status).toMatch(/Stage 10\.12A/);
      expect(e.match).toHaveLength(1);
      expect(e.limitations.join(" ")).toMatch(/not an exemption/i);
    }
    expect(e10.status).toMatch(/2026-09-23/);
    expect(e13.status).toMatch(/2026-10-05/);
    expect(e10.source).toBe("https://www.building.govt.nz/getting-started/smarter-homes-guides/water-and-waste/collecting-and-using-rainwater");
    expect(e13.source).toBe("https://www.fire.qld.gov.au/about-us/corporate-knowledge-centre/qfdlegislation/smoke-alarm-reforms");
  });

  it("the OG-10 sentence resolves through its registry entry in OG-10 / NZ", () => {
    const c = regulatory(scan(OG10, "OG-10", "NZ"));
    expect(c.map((x) => [x.bucket, x.claimId])).toEqual([["A_ALREADY_SOURCED", OG10_ID]]);
  });
  it("the OG-13 sentence resolves through its registry entry in OG-13 / AU", () => {
    const c = regulatory(scan(OG13, "OG-13", "AU"));
    expect(c.map((x) => [x.bucket, x.claimId])).toEqual([["A_ALREADY_SOURCED", OG13_ID]]);
  });

  it("the same sentences stay unresolved in any other resource, in the other market, or with changed wording", () => {
    expect(regulatory(scan(OG10, "OG-99", "NZ")).map((x) => x.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(regulatory(scan(OG10, "OG-10", "AU")).map((x) => x.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(regulatory(scan(OG10.replace("a qualified plumber", "a licensed electrician"), "OG-10", "NZ")).map((x) => x.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(regulatory(scan(OG13, "OG-99", "AU")).map((x) => x.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(regulatory(scan(OG13, "OG-13", "NZ")).map((x) => x.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(regulatory(scan(OG13.replace("Queensland", "Victoria"), "OG-13", "AU")).map((x) => x.bucket)).toEqual(["C_NEEDS_SOURCE"]);
  });

  it("neither entry is a category: other required-by-law and mandatory statements in the same resources and markets still fail", () => {
    for (const [s, r, m] of [
      ["Smoke alarms are required by law.", "OG-13", "AU"],
      ["In Queensland, carbon monoxide alarms are required by law.", "OG-13", "AU"],
      ["A tank on a stand is legally required to have a consent.", "OG-10", "NZ"],
      ["This label is mandatory in NZ.", "OG-10", "NZ"],
      ["The pump must comply with the electrical regulations.", "OG-10", "NZ"],
    ] as const) expect(regulatory(scan(s, r, m)).map((x) => x.bucket), s).toEqual(["C_NEEDS_SOURCE"]);
  });

  it("neither entry adds an exemption or a safety carve-out anywhere in the registry", () => {
    expect(JSON.stringify(e10) + JSON.stringify(e13)).not.toMatch(/"exemption|"exempt"|exemptFrom/i);
    expect(registry.claims.filter((c) => c.id === OG10_ID || c.id === OG13_ID)).toHaveLength(2);
    expect(new Set(registry.claims.map((c) => c.id)).size).toBe(registry.claims.length);
  });
});
