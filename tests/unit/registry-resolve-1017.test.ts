import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/** HELD with the Stage 10.17 hardened detector: the six new entries resolve their exact sentence in their exact resource and market, and nowhere else. */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const reg = (s: string, resource: string, market: string) => scanNumericClaims(`<div class="content"><p>${s}</p></div>`, { resource, market, registry, treatment }).filter((c) => c.unit === "regulatory");
const CASES: [string, string, string, string][] = [
  ["Fixed electrical work and the pump connection must be handled by a licensed electrician.", "OG-10", "AU", "NZ"],
  ["Solar and battery systems must be installed by a licensed electrician — DIY electrical work is illegal", "OG-19", "AU", "NZ"],
  ["Permanently connected: must be installed by a licensed electrical worker", "OG-20", "NZ", "AU"],
  ["Its connection must be installed by a licensed electrical worker.", "OG-20", "NZ", "AU"],
  ["Permanently connected: must be installed by a licensed electrician", "OG-20", "AU", "NZ"],
  ["Its connection must be installed by a licensed electrician.", "OG-20", "AU", "NZ"],
];
describe("registered Stage 10.17A statements resolve narrowly", () => {
  for (const [s, resource, market, other] of CASES) {
    it(`resolves in ${resource} ${market}, not in another resource or market: ${s.slice(0, 50)}`, () => {
      const here = reg(s, resource, market);
      expect(here.length).toBeGreaterThan(0);
      expect(here.every((c) => c.bucket === "A_ALREADY_SOURCED")).toBe(true);
      expect(reg(s, "OG-99", market).some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
      expect(reg(s, resource, other).some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
    });
  }
  it("the unsupported live statements stay unresolved", () => {
    expect(reg("Fixed electrical work and the pump connection must be handled by an appropriately licensed electrical worker.", "OG-10", "NZ").some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
    expect(reg("Consents or permits needed", "OG-20", "NZ").some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
    expect(reg("Permits or approvals needed", "OG-20", "AU").some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
  });
  it("the three corrected statements make no regulatory assertion and match no registry entry (Stage 10.17B)", () => {
    expect(reg("Check which electrical work on the pump connection needs a licensed person where you live, and use a suitably qualified professional where it does.", "OG-10", "NZ")).toEqual([]);
    expect(reg("Consents or permits to check", "OG-20", "NZ")).toEqual([]);
    expect(reg("Permits or approvals to check", "OG-20", "AU")).toEqual([]);
  });
  it("broader licensing, permit and legality statements still fail in OG-20 and OG-10", () => {
    for (const [s, r, m] of [["Consents or permits are required for this work.", "OG-20", "NZ"], ["Permits or approvals are needed before you install it.", "OG-20", "AU"], ["Only a licensed electrician may connect the pump.", "OG-10", "NZ"], ["Connecting the pump yourself is illegal.", "OG-10", "AU"]] as const)
      expect(reg(s, r, m).some((c) => c.bucket === "C_NEEDS_SOURCE"), s).toBe(true);
  });  it("a broader or different sentence is not approved by a similar entry", () => {
    expect(reg("All electrical work must be done by a licensed electrician.", "OG-20", "AU").some((c) => c.bucket === "C_NEEDS_SOURCE")).toBe(true);
  });
});
