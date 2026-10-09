import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadNumericRegistry } from "@/admin-import/audit/numeric";

/**
 * Stage 10.17A — six live regulatory statements are registered after their provenance was verified in the project's own evidence (owner-approved safety blocks and
 * their recorded official sources). Each entry covers ONE exact sentence in ONE market in ONE resource. They are sourced claims, not exemptions.
 * The statements that could not be supported (OG-10 NZ; the OG-20 'Consents or permits needed' and 'Permits or approvals needed' labels) are NOT registered and sit in the
 * live copy correction queue (admin-import/STAGE_10.17A_REGISTRY_AND_CORRECTIONS.md).
 */
const registry = loadNumericRegistry(path.join(process.cwd(), "admin-import/config/numeric-claims.json"));
const NEW = [
  ["au-electrical-fixed-work-pump-licensed-electrician-esv", "AU", "OG-10", "licensed electrician"],
  ["au-electrical-solar-battery-licensed-electrician-diy-illegal-esv", "AU", "OG-19", "licensed electrician"],
  ["nz-generator-permanent-connection-table-licensed-worker-worksafe", "NZ", "OG-20", "licensed electrical worker"],
  ["nz-generator-connection-flow-licensed-worker-worksafe", "NZ", "OG-20", "licensed electrical worker"],
  ["au-generator-permanent-connection-table-licensed-electrician-esv", "AU", "OG-20", "licensed electrician"],
  ["au-generator-connection-flow-licensed-electrician-esv", "AU", "OG-20", "licensed electrician"],
] as const;

describe("the six Stage 10.17A registry entries", () => {
  for (const [id, market, resource, label] of NEW) {
    const e = registry.claims.find((c) => c.id === id);
    it(`${id}: exact market, one resource, one phrase, a source, an authority and an explicit not-an-exemption note`, () => {
      expect(e).toBeTruthy();
      expect(e!.market).toBe(market);
      expect(e!.owningResources).toEqual([resource]);
      expect(e!.owningBlock).toBeUndefined();
      expect(e!.match).toHaveLength(1);
      expect(e!.requiresLabel).toBe(label);
      expect(e!.source).toMatch(/^https:\/\//);
      expect(e!.authority.length).toBeGreaterThan(40);
      expect(e!.sourceDate).toMatch(/2026|2023/);
      expect(e!.status).toMatch(/VERIFIED/);
      expect(e!.status).toMatch(/Stage 10\.17A/);
      expect(e!.limitations.join(" ")).toMatch(/not an exemption/i);
    });
  }
  it("no entry is broad: none is market-wide, resource-wide or profession-wide, and none matches a bare keyword", () => {
    for (const [id] of NEW) {
      const e = registry.claims.find((c) => c.id === id)!;
      expect(e.owningResources.length).toBe(1);
      expect(e.match[0].length).toBeGreaterThan(40);
      expect(e.match[0]).not.toMatch(/^\.\*|\.\*$/);
    }
  });
  it("the unsupported statements are not registered", () => {
    const all = JSON.stringify(registry.claims);
    expect(all).not.toContain("appropriately licensed electrical worker");
    expect(all).not.toContain("Consents or permits needed");
    expect(all).not.toContain("Permits or approvals needed");
  });
  it("the two Stage 10.12A entries are unchanged", () => {
    const a = registry.claims.find((c) => c.id === "nz-rainwater-plumbing-consent-backflow-mbie")!, b = registry.claims.find((c) => c.id === "au-qld-interconnected-photoelectric-alarms-law-qfd")!;
    expect(a.owningResources).toEqual(["OG-10"]); expect(a.market).toBe("NZ"); expect(a.match).toHaveLength(1); expect(a.requiresLabel).toBe("backflow prevention device");
    expect(b.owningResources).toEqual(["OG-13"]); expect(b.market).toBe("AU"); expect(b.match).toHaveLength(1); expect(b.requiresLabel).toBe("Queensland");
  });
});
