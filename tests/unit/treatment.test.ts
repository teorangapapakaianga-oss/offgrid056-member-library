import path from "node:path";
import { describe, expect, it } from "vitest";
import { isRegisteredClaim, loadTreatmentRegistry, treatmentFindings, treatmentSentences } from "@/admin-import/audit/treatment";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import { safetyExposureFor } from "@/admin-import/audit/group-a";

/**
 * Stage 9.43 — the water-treatment claim gates (owner rulings 4–11).
 *
 * The rule the whole file exists to prove: a treatment claim passes only when an owner-approved entry for THAT
 * MARKET matches it. A figure verified for New Zealand is not evidence for Australia, and silence about the limits
 * of household treatment is a failure, not a pass.
 */
const registry = loadTreatmentRegistry(path.join(process.cwd(), "admin-import/config/treatment-sources.json"));
const blocks = topicBlocks.blocks as Record<string, { marketBody: Record<string, string> }>;
const treatment = blocks["water-treatment"].marketBody;
const storage = blocks["stored-drinking-water"].marketBody;

const codes = (findings: string[]) => findings.map((f) => f.split(" ")[0]);

describe("the approved blocks pass their own gates", () => {
  it("clears the NZ water-treatment block in NZ, and the AU block in AU", () => {
    expect(treatmentFindings(treatment.NZ, "NZ", registry)).toEqual([]);
    expect(treatmentFindings(treatment.AU, "AU", registry)).toEqual([]);
  });

  it("clears the approved storage block, whose bleach method is registered separately", () => {
    expect(treatmentFindings(storage.NZ, "NZ", registry)).toEqual([]);
    expect(treatmentFindings(storage.AU, "AU", registry)).toEqual([]);
  });
});

describe("no figure crosses a market", () => {
  it("blocks the NZ block's bleach ratio, boil time and filter wording in an AU file", () => {
    const findings = treatmentFindings(treatment.NZ, "AU", registry);
    expect(codes(findings)).toContain("UNSOURCED_BLEACH_RATIO");
    expect(codes(findings)).toContain("UNSOURCED_BOIL_TIME");
    expect(codes(findings)).toContain("UNSOURCED_FILTER_CLAIM");
  });

  it("blocks the AU block's state ratios and UV detail in an NZ file", () => {
    const findings = treatmentFindings(treatment.AU, "NZ", registry);
    expect(codes(findings)).toContain("UNSOURCED_BLEACH_RATIO");
    expect(codes(findings)).toContain("UNSOURCED_UV_CLAIM");
    expect(findings.some((f) => f.includes("2 drops"))).toBe(true);
  });

  it("blocks NSW's ratio in an NZ file even though it is verified in Australia", () => {
    const nsw = "NSW Health advises 2 drops of unscented 4–5% bleach per litre, left to stand 30 minutes.";
    expect(treatmentFindings(nsw, "AU", registry)).toEqual([]);
    expect(codes(treatmentFindings(nsw, "NZ", registry))).toEqual(["UNSOURCED_BLEACH_RATIO"]);
  });
});

describe("each gate", () => {
  it("UNSOURCED_BLEACH_RATIO: an invented ratio fails in both markets", () => {
    const invented = "Add 8 drops of bleach per litre of water and wait 10 minutes.";
    expect(codes(treatmentFindings(invented, "NZ", registry))).toContain("UNSOURCED_BLEACH_RATIO");
    expect(codes(treatmentFindings(invented, "AU", registry))).toContain("UNSOURCED_BLEACH_RATIO");
  });

  it("UNSOURCED_BOIL_TIME: three minutes fails, one minute passes in NZ", () => {
    expect(codes(treatmentFindings("Boil the water for three minutes.", "NZ", registry))).toEqual(["UNSOURCED_BOIL_TIME"]);
    expect(treatmentFindings("Boil the water for one minute.", "NZ", registry)).toEqual([]);
  });

  it("UNSOURCED_BOIL_TIME: an altitude adjustment fails everywhere, because no source publishes one", () => {
    const altitude = "Boil the water for one minute, or longer above 1,000 metres of altitude.";
    expect(codes(treatmentFindings(altitude, "NZ", registry))).toContain("UNSOURCED_BOIL_TIME");
    expect(codes(treatmentFindings(altitude, "AU", registry))).toContain("UNSOURCED_BOIL_TIME");
  });

  it("UNSOURCED_BOIL_TIME: a standing time or a storage life is not read as a boil time", () => {
    expect(treatmentFindings("Boiled water is best used within 24 hours.", "NZ", registry)).toEqual([]);
  });

  it("UNSOURCED_FILTER_CLAIM: a filter cannot be said to make unsafe water safe", () => {
    const claim = "A ceramic filter makes creek water safe to drink.";
    expect(codes(treatmentFindings(claim, "NZ", registry))).toContain("UNSOURCED_FILTER_CLAIM");
    expect(codes(treatmentFindings(claim, "AU", registry))).toContain("UNSOURCED_FILTER_CLAIM");
  });

  it("UNSOURCED_FILTER_CLAIM: micron ratings are AU-only, and only with their NSW attribution", () => {
    const withNsw = "NSW Health: micro and ultrafiltration membranes (0.1–0.01 micron) remove sediment and bacteria.";
    expect(treatmentFindings(withNsw, "AU", registry)).toEqual([]);
    expect(codes(treatmentFindings(withNsw, "NZ", registry))).toContain("UNSOURCED_FILTER_CLAIM");
    const unattributed = "Use a 0.2 micron filter, which removes bacteria.";
    expect(codes(treatmentFindings(unattributed, "AU", registry))).toContain("UNSOURCED_FILTER_CLAIM");
  });

  it("UNSOURCED_UV_CLAIM: an invented dose fails, and NZ may not carry UV performance claims at all", () => {
    expect(codes(treatmentFindings("The UV unit delivers 30 mJ/cm2 at full flow.", "AU", registry))).toContain("UNSOURCED_UV_CLAIM");
    expect(codes(treatmentFindings("UV kills all bacteria and viruses.", "NZ", registry))).toContain("UNSOURCED_UV_CLAIM");
    // Naming UV as an option is all New Zealand publishes, and that still passes.
    expect(treatmentFindings("MBIE lists ultraviolet light treatment as one option.", "NZ", registry)).toEqual([]);
  });

  it("UNSOURCED_TESTING_INTERVAL: NZ annual testing passes; a made-up frequency does not", () => {
    expect(treatmentFindings("Have drinking water tested annually.", "NZ", registry)).toEqual([]);
    expect(codes(treatmentFindings("Test your tank water every three months.", "NZ", registry))).toContain("UNSOURCED_TESTING_INTERVAL");
    expect(codes(treatmentFindings("Test your water monthly.", "AU", registry))).toContain("UNSOURCED_TESTING_INTERVAL");
  });

  it("UNSAFE_CONTAMINATED_SOURCE_GUIDANCE: contaminated-source guidance without a limitation fails closed", () => {
    const bare = "If the creek is downstream of a flood, filter and boil the water before drinking it.";
    expect(codes(treatmentFindings(bare, "NZ", registry))).toContain("UNSAFE_CONTAMINATED_SOURCE_GUIDANCE");
    const withLimit = `${bare} If harmful chemicals or toxins could be in the water, boiling will not make it safe.`;
    expect(codes(treatmentFindings(withLimit, "NZ", registry))).not.toContain("UNSAFE_CONTAMINATED_SOURCE_GUIDANCE");
  });
});

describe("a comparison table makes claims too", () => {
  const matrix = `<table><thead><tr><th>Method</th><th>Removes Bacteria</th><th>Removes Viruses</th></tr></thead>
    <tbody><tr><td>Ceramic Filter</td><td>Yes</td><td>Partial</td></tr></tbody></table>`;

  it("turns each row of an efficacy matrix back into the claim it makes", () => {
    expect(treatmentSentences(matrix)).toContain("Ceramic Filter — Removes Viruses: Partial");
  });

  it("fails the legacy matrix in both markets", () => {
    expect(codes(treatmentFindings(matrix, "NZ", registry))).toContain("UNSOURCED_FILTER_CLAIM");
    expect(codes(treatmentFindings(matrix, "AU", registry))).toContain("UNSOURCED_FILTER_CLAIM");
  });

  it("leaves an ordinary table alone", () => {
    const plain = `<table><thead><tr><th>Component</th><th>Cost</th></tr></thead><tbody><tr><td>Ceramic filter</td><td>$0</td></tr></tbody></table>`;
    expect(treatmentSentences(plain).some((s) => s.includes("—"))).toBe(false);
    expect(treatmentFindings(plain, "NZ", registry)).toEqual([]);
  });
});

describe("the registry", () => {
  it("has no claim that serves both markets, so nothing can be reused across them", () => {
    const ids = new Map<string, string[]>();
    for (const claim of registry.claims) ids.set(claim.id, [...(ids.get(claim.id) ?? []), claim.market]);
    expect([...ids.values()].every((markets) => markets.length === 1)).toBe(true);
  });

  it("records every claim's source, authority, household applicability and limits", () => {
    for (const claim of registry.claims) {
      expect(claim.source, claim.id).toMatch(/^https?:\/\//);
      expect(claim.authority.length, claim.id).toBeGreaterThan(0);
      expect(claim.householdApplicability.length, claim.id).toBeGreaterThan(0);
      expect(claim.status, claim.id).toMatch(/OWNER-APPROVED/);
      expect(["NZ", "AU"]).toContain(claim.market);
    }
  });

  it("keeps the unreadable enHealth guidance out of the evidence", () => {
    const enhealth = registry.unavailableSources?.find((s) => s.id === "enhealth-rainwater-tanks");
    expect(enhealth?.status).toBe("SOURCE_UNAVAILABLE / NOT RELIED UPON");
    expect(registry.claims.some((c) => /enhealth/i.test(`${c.source} ${c.authority}`))).toBe(false);
    expect(`${treatment.AU} ${treatment.NZ}`).not.toMatch(/enhealth/i);
  });

  it("marks a registered figure as sourced, and an unregistered one as not", () => {
    expect(isRegisteredClaim("add 5 drops of bleach per litre of water", "NZ", registry)).toBe(true);
    expect(isRegisteredClaim("add 5 drops of bleach per litre of water", "AU", registry)).toBe(false);
    expect(isRegisteredClaim("add 9 drops of bleach per litre of water", "NZ", registry)).toBe(false);
  });
});

describe("the block requirement", () => {
  it("is raised by a document that teaches treatment", () => {
    const teaching = `Which filter is right for your water? Boiling the water for one minute kills germs.
      Add 5 drops per litre of bleach. A ceramic filter removes bacteria but not viruses. Water filters vary.`;
    expect(safetyExposureFor(teaching)).toContain("water-treatment");
  });

  it("is not raised by a shopping list that merely names filtration", () => {
    const list = "Tier 1: water filter. Tier 2: filtration system. Tier 3: UV treatment for the tank.";
    expect(safetyExposureFor(list)).not.toContain("water-treatment");
  });
});
