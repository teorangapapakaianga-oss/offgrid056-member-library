import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareResource, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import metadataReview from "@/admin-import/config/metadata-review.json";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";
import { loadNumericRegistry, scanNumericClaims, numericBlockingFindings } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";
import { safetyExposureFor } from "@/admin-import/audit/group-a";

/**
 * Stage 9.52 — the three Air safety blocks, and the ratio claim type they needed.
 *
 * Stage 9.51 found a hole: a cleaning dilution carries no unit, so "one part bleach to three parts water" was
 * invisible to the numeric gate and would have reached a member unregistered. These tests hold that hole shut, and
 * hold the blocks to the three rules that decide whether the wording is safe — nothing crosses markets, nothing
 * instructs a member to reach for bleach while vinegar is on the page, and nothing in a block is unsourced.
 */
const root = process.cwd();
const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));

const AIR_BLOCKS = ["fire-and-smoke-alarms", "mould-and-dampness", "home-ventilation"] as const;

const DOC = `<!DOCTYPE html><html><head></head><body>
<div class="cover-page">
  <div class="cover-label">OffGrid056</div>
  <h1 class="cover-title">Healthy Home Air Audit</h1>
  <p class="cover-subtitle">Score the things that decide the air you breathe</p>
</div>
<div class="content"><h2>Audit</h2><p>Walk through each room and note what you find.</p></div></body></html>`;

function prep(extra: Partial<PrepInputs> = {}) {
  return prepareResource({
    item: {
      legacyCode: "OG-13",
      proposedResourceId: "res-1013",
      title: "Healthy Home Air Audit",
      foundation: { value: "air", confidence: "MEDIUM", evidence: [] },
      resourceType: { value: "assessment", confidence: "MEDIUM", evidence: [] },
      legacyIssues: [],
      legacyTerminology: [],
      safetyNotes: [],
    } as unknown as PrepInputs["item"],
    sourceHtml: DOC,
    blocks,
    markets,
    launchMarkets: ["NZ", "AU"],
    outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-air-")),
    treatmentRegistry: treatment,
    numericRegistry: registry,
    ...extra,
  });
}

const bodyOf = (id: string, market: "NZ" | "AU") =>
  (topicBlocks.blocks as Record<string, { marketBody: Record<string, string> }>)[id].marketBody[market];

const scan = (text: string, market: string, resource: string) =>
  scanNumericClaims(`<div class="content"><p>${text}</p></div>`, { resource, market, registry, treatment });
const bucketsFor = (text: string, market: string, resource: string) => scan(text, market, resource).map((c) => c.bucket);
const figuresFor = (text: string, market: string, resource: string) => scan(text, market, resource).map((c) => c.figure);

describe("Stage 9.52 · the ratio claim type", () => {
  it("1. sees a unitless dilution ratio that the unit scanner cannot see", () => {
    const found = figuresFor("Mix a cleaning solution of four parts vinegar to one part water.", "AU", "OG-13");
    expect(found.some((f) => /four parts vinegar to one part water/i.test(f))).toBe(true);
  });

  it("2. fails closed on an unregistered ratio, and blocks the market", () => {
    const sentence = "Dilute the cleaner two parts product to five parts water.";
    expect(bucketsFor(sentence, "AU", "OG-13")).toContain("C_NEEDS_SOURCE");
    const findings = numericBlockingFindings(`<div class="content"><p>${sentence}</p></div>`, {
      resource: "OG-13",
      market: "AU",
      registry,
      treatment,
    });
    expect(findings.join(" ")).toContain("UNSOURCED_NUMERIC_CLAIM");
  });

  it("3. accepts a registered ratio in its own market, with its attribution", () => {
    const nsw = "For routine clean-up of mouldy surfaces, NSW Health advises mild detergent, or vinegar diluted in water at four parts vinegar to one part water.";
    expect(bucketsFor(nsw, "AU", "OG-13")).toContain("A_ALREADY_SOURCED");
    const nz = "Tenancy Services says to dilute the vinegar with water, half and half, on painted surfaces.";
    expect(bucketsFor(nz, "NZ", "OG-13")).toContain("A_ALREADY_SOURCED");
  });

  it("4. does not let a ratio travel between markets", () => {
    const nsw = "NSW Health advises vinegar diluted in water at four parts vinegar to one part water.";
    const nz = "Tenancy Services says to dilute the vinegar with water, half and half, on painted surfaces.";
    expect(bucketsFor(nsw, "NZ", "OG-13")).toContain("C_NEEDS_SOURCE");
    expect(bucketsFor(nz, "AU", "OG-13")).toContain("C_NEEDS_SOURCE");
  });

  it("5. does not mistake a scoring instrument for a ratio", () => {
    // OG-13's own audit scores each room 1-5 and bands the total; OG-02 and OG-18 score the same way.
    for (const sentence of [
      "Score each room 1:5, then mix the scores into a single total.",
      "Scoring scale: 10-20 = Critical, 45-50 = Excellent.",
      "Rate each answer out of 5 and add them up.",
    ]) {
      expect(figuresFor(sentence, "NZ", "OG-13").join(" ")).not.toMatch(/\d\s?:\s?\d|parts?\b/);
    }
  });

  it("6. leaves a bleach ratio to the treatment architecture rather than judging it here", () => {
    const found = scan("Mix one part bleach to three parts water in a bucket.", "NZ", "OG-13");
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((c) => c.bucket === "E_TREATMENT_OWNED")).toBe(true);
  });
});

describe("Stage 9.52 · the three Air blocks", () => {
  it("7. answers the fire detector's requirement only for a resource that carries the block", () => {
    // The detector asks for "fire-and-emergency"; the approved wording is `fire-and-smoke-alarms`.
    const teaches = "Install a smoke alarm in every bedroom. Test the fire alarm monthly. Plan an escape route in case of fire.";
    expect(safetyExposureFor(teaches)).toContain("fire-and-emergency");
    const withBlock = prep({ requiredSafety: ["fire-and-emergency"], extraSafetyBlocks: ["fire-and-smoke-alarms"] });
    expect(withBlock.safety.missingRequired).toEqual([]);
    const without = prep({ requiredSafety: ["fire-and-emergency"] });
    expect(without.safety.missingRequired).toEqual(["fire-and-emergency"]);
    expect(without.markets.every((m) => !m.publishable)).toBe(true);
  });

  it("8. changes nothing for the two resources that hold a reviewed fire exemption", () => {
    const resources = metadataReview.resources as Record<string, { safetyExemptions?: { block: string }[]; safetyBlocks?: string[] }>;
    for (const code of ["OG-02", "OG-B08"]) {
      const exemptions = resources[code]?.safetyExemptions ?? [];
      expect(exemptions.some((e) => e.block === "fire-and-emergency"), code).toBe(true);
      // They carry none of the new blocks, so nothing about them moved this stage.
      for (const id of AIR_BLOCKS) expect(resources[code]?.safetyBlocks ?? [], code).not.toContain(id);
    }
  });

  it("9. leaves no unsourced figure in any of the three blocks, in either market", () => {
    const r = prep({
      requiredSafety: ["fire-and-emergency"],
      extraSafetyBlocks: [...AIR_BLOCKS],
    });
    for (const m of r.markets) {
      expect(m.problems.join(" "), m.code).not.toContain("UNSOURCED_NUMERIC_CLAIM");
      expect(m.problems.join(" "), m.code).not.toContain("UNSOURCED_");
      expect(m.publishable, m.code).toBe(true);
    }
  });

  it("10. keeps every market-specific figure and dilution on its own side", () => {
    expect(bodyOf("mould-and-dampness", "NZ")).toContain("half and half");
    expect(bodyOf("mould-and-dampness", "NZ")).not.toMatch(/four parts vinegar|NSW/);
    expect(bodyOf("mould-and-dampness", "AU")).toContain("four parts vinegar to one part water");
    expect(bodyOf("mould-and-dampness", "AU")).not.toContain("half and half");
    // Ventilation: New Zealand carries MBIE's figures, Australia carries none and says so.
    expect(bodyOf("home-ventilation", "NZ")).toMatch(/18–22°C/);
    expect(bodyOf("home-ventilation", "AU")).not.toMatch(/\d+\s?°C|\d+\s?%|\d+ minutes|\d+ litres/);
    expect(bodyOf("home-ventilation", "AU")).toContain("No Australian source read");
    // Alarms: no national Australian rule, and each Australian sentence names its state.
    expect(bodyOf("fire-and-smoke-alarms", "AU")).toContain("There is no single national household smoke alarm rule");
    expect(bodyOf("fire-and-smoke-alarms", "AU")).toMatch(/Fire and Rescue NSW/);
    expect(bodyOf("fire-and-smoke-alarms", "AU")).toMatch(/Queensland Fire Department/);
    expect(bodyOf("fire-and-smoke-alarms", "NZ")).not.toMatch(/NSW|Queensland/);
  });

  it("11. instructs no bleach cleaning method while the owner ruling is outstanding", () => {
    for (const market of ["NZ", "AU"] as const) {
      const body = bodyOf("mould-and-dampness", market);
      // The only permitted mention of bleach anywhere is the Victorian never-mix caution, which instructs nobody
      // to use it. No dilution, no "use bleach", and nothing that could read as vinegar-then-bleach.
      expect(body, market).not.toMatch(/use (?:diluted )?(?:household )?bleach|bleach solution|parts? bleach|mL of bleach/i);
    }
    expect(bodyOf("mould-and-dampness", "AU")).toContain("Do not mix bleach with ammonia, acids or other cleaners");
    expect(bodyOf("mould-and-dampness", "NZ")).not.toMatch(/bleach/i);
  });

  it("12. writes no carbon monoxide alarm lifespan anywhere, in either market", () => {
    for (const id of AIR_BLOCKS) {
      for (const market of ["NZ", "AU"] as const) {
        expect(bodyOf(id, market), `${id} ${market}`).not.toMatch(/carbon monoxide|CO (?:alarm|detector)/i);
      }
    }
    const co = (topicBlocks.blocks as Record<string, { marketBody: Record<string, string> }>)["carbon-monoxide"];
    for (const market of ["NZ", "AU"] as const) {
      expect(co.marketBody[market], market).not.toMatch(/under (?:five|5) years old|\b(?:five|5)[- ]year (?:life|lifespan)/i);
    }
  });
});
