import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findContentFlags, fuelSafetyFindings, memberFacingText, requiredGasBlocks, GAS_BLOCK_SET } from "@/admin-import/pilot/prep";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";
import { priceFindings } from "@/admin-import/audit/price";

/**
 * Stage 9.63 — OG-B09 (Insulation & Heating Upgrade Checklist) claims-first preparation.
 *
 * Nothing here migrates OG-B09. These tests fix the rules it must meet BEFORE anything is rendered, so a rebuild cannot
 * quietly reintroduce an unsupported figure, the wrong market's gas wording, or a gas block it does not need.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const page = (rows: string) => `<!DOCTYPE html><html><head><title>t</title></head><body><div class="content"><h2>Heating Options Comparison</h2><table><tr><th>Heating Type</th><th>Upfront Cost</th><th>Efficiency</th><th>Best For</th></tr>${rows}</table></div></body></html>`;
const row = (...cells: string[]) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
const scan = (html: string, market: string) => scanNumericClaims(html, { resource: "OG-B09", market, registry, treatment });
const bucketCs = (html: string, market: string) => scan(html, market).filter((c) => c.bucket === "C_NEEDS_SOURCE");

describe("Stage 9.63 · OG-B09 gas requirement", () => {
  it("a heating comparison that names 'Flued gas' needs gas-and-lpg-general — and ONLY that gas block", () => {
    // the rebuilt row: label kept, price and efficiency figures gone
    const html = page(row("Flued gas", "Quote needed", "Check the rating label", "Quick heat"));
    const fuel = fuelSafetyFindings(html).some((f) => f.startsWith("GAS_SAFETY_REQUIRED"));
    expect(fuel, "the label alone still raises the gas fuel check").toBe(true);
    const topics = safetyExposureFor(memberFacingText(html));
    expect(requiredGasBlocks(topics.filter((t) => t in GAS_BLOCK_SET), fuel)).toEqual(["gas-and-lpg-general"]);
    for (const not of ["unflued-gas-heating", "gas-cylinder-safety", "gas-leak-response", "gas-installation-and-servicing"]) {
      expect(topics, `${not} is not required`).not.toContain(not);
    }
  });

  it("the legacy table row (price + efficiency beside 'Flued gas') is gas teaching, via figures", () => {
    const html = page(row("Flued gas", "$1,500–$4,000", "80–90%", "Quick heat"));
    expect(fuelSafetyFindings(html).some((f) => f.startsWith("GAS_SAFETY_REQUIRED"))).toBe(true);
  });

  it("a comparison that names no gas appliance requires no gas block at all", () => {
    const html = page(row("Heat pump", "Quote needed", "Check the rating label", "Primary heating"));
    expect(fuelSafetyFindings(html).filter((f) => f.startsWith("GAS_"))).toEqual([]);
    expect(requiredGasBlocks(safetyExposureFor(memberFacingText(html)).filter((t) => t in GAS_BLOCK_SET), false)).toEqual([]);
  });
});

describe("Stage 9.63 · OG-B09 unsupported figures fail", () => {
  it("prices with no recorded disposition fail the price gate", () => {
    const html = page(row("Heat pump", "$1,500–$3,500", "Low", "Primary heating"));
    const found = priceFindings(html, { market: "NZ", records: [], legacyHtml: html });
    expect(found.problems.join(" ")).toMatch(/UNDISPOSED_PRICE/);
  });

  it("efficiency percentages are flagged as needing a source", () => {
    const flags = findContentFlags(page(row("Heat pump", "Quote needed", "300–400%", "Primary heating")), "OG-B09");
    expect(flags.some((f) => f.kind === "figure-needs-source" && f.text.includes("300–400%"))).toBe(true);
  });

  it("insulation R-values are now a detected numeric claim, in both markets, and fail unless registered", () => {
    const html = `<div class="content"><p>Ceiling: R-2.9 minimum (R-3.3+ recommended) | Walls: R-1.9 minimum | Floor: R-1.3 minimum</p></div>`;
    for (const market of ["NZ", "AU"]) {
      const c = bucketCs(html, market).filter((x) => x.category === "insulation").map((x) => x.figure);
      expect(c, market).toEqual(expect.arrayContaining(["R-2.9", "R-3.3+", "R-1.9", "R-1.3"]));
    }
    expect(registry.claims.filter((c) => c.category === ("insulation" as never)), "nothing is registered automatically").toEqual([]);
  });

  it("R-value-shaped text that is not a figure is not caught", () => {
    expect(bucketCs(`<div class="content"><p>Ask the installer for the R-value of each product.</p></div>`, "NZ").filter((c) => c.category === "insulation")).toEqual([]);
  });
});

describe("Stage 9.63 · OG-B09 market separation", () => {
  it("an NZ gas figure in an Australian file fails (the NZ intervals are NZ-only)", () => {
    const au = `<div class="content"><p>WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.</p></div>`;
    expect(bucketCs(au, "AU").map((c) => c.bucket)).toContain("C_NEEDS_SOURCE");
  });

  it("AU gas topics with no served body stay fail-closed", () => {
    const blocks = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/safety-blocks.json"), "utf8")).blocks as Record<string, { marketBody?: Record<string, string> }>;
    expect(blocks["unflued-gas-heating"].marketBody?.AU).toBeUndefined();
    expect(blocks["gas-leak-response"].marketBody?.AU).toBeUndefined();
    expect(blocks["gas-and-lpg-general"].marketBody?.AU, "the general block does serve AU").toBeTruthy();
  });

  it("a block-owned NZ figure still does not validate the resource's own sentence", () => {
    const own = `<div class="content"><p>WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually.</p></div>`;
    expect(bucketCs(own, "NZ").length).toBeGreaterThan(0);
  });
});

describe("Stage 9.63 · the legacy OG-B09 source, when the working copy has it", () => {
  const candidates = path.join(root, "workspace/candidates.json");
  it("still carries the figures this migration must remove or source", () => {
    if (!fs.existsSync(candidates)) return;
    const list = JSON.parse(fs.readFileSync(candidates, "utf8")) as { source: { path: string; filename: string; extension: string } }[];
    const f = list.find((c) => c.source.filename.startsWith("OG-B09_") && /\.html?$/i.test(c.source.extension));
    if (!f) return;
    const html = fs.readFileSync(f.source.path, "utf8");
    for (const market of ["NZ", "AU"]) {
      const c = bucketCs(html, market);
      expect(c.filter((x) => x.category === "insulation").length, `${market} R-values`).toBe(6);
      expect(c.filter((x) => x.category === "currency").length, `${market} prices`).toBe(6);
      expect(c.filter((x) => x.category === "percentage").length, `${market} efficiency percentages`).toBe(3);
    }
  });
});
