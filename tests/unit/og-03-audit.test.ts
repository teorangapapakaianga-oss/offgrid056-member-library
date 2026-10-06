import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { scanPrices } from "@/admin-import/audit/price";
import { findContentFlags, memberFacingText } from "@/admin-import/pilot/prep";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.75 — OG-03 Budget Pathway Selector: claims-first audit facts.
 *
 * Nothing here migrates OG-03. These pin what the audit found in the legacy source (when the private working copy has it),
 * so a later rebuild can be compared with them.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const candidates = path.join(root, "workspace/candidates.json");

function legacy(): string | null {
  if (!fs.existsSync(candidates)) return null;
  const list = JSON.parse(fs.readFileSync(candidates, "utf8")) as { source: { path: string; filename: string; extension: string } }[];
  const f = list.find((c) => c.source.filename.startsWith("OG-03_") && /\.html?$/i.test(c.source.extension));
  return f && fs.existsSync(f.source.path) ? fs.readFileSync(f.source.path, "utf8") : null;
}
const scan = (html: string, market: string) => scanNumericClaims(html, { resource: "OG-03", market, registry, treatment });

describe("Stage 9.75 · the legacy OG-03 source, when the working copy has it", () => {
  const html = legacy();

  it("is a commercial tier matcher: six OffGrid056 product tiers, each with a price and an income / savings band", () => {
    if (!html) return;
    const text = memberFacingText(html);
    for (const tier of ["DIY Starter", "Community Plan", "Action Plan Plus", "Professional Review", "Property Assessment", "Project Support"]) expect(text, tier).toContain(tier);
    expect(text).toMatch(/Declare Your Tier/);
  });

  it("price detector: 29 prices and 1 placeholder, all in the tier table, the tier choice list or the New Zealand subsidy note", () => {
    if (!html) return;
    const prices = scanPrices(html);
    expect(prices.filter((p) => p.kind === "PRICE")).toHaveLength(29);
    expect(prices.filter((p) => p.kind === "PLACEHOLDER")).toHaveLength(1);
    expect(prices.filter((p) => p.kind === "NOT_A_PRICE")).toHaveLength(0);
  });

  it("numeric detector: 26 Bucket C claims in BOTH markets (the same set), none registered, none owner-defined", () => {
    if (!html) return;
    for (const market of ["NZ", "AU"]) {
      const all = scan(html, market);
      expect(all.filter((c) => c.bucket === "C_NEEDS_SOURCE"), market).toHaveLength(26);
      expect(all.filter((c) => c.bucket === "C_NEEDS_SOURCE" && c.category === "percentage").map((c) => c.figure), market).toEqual(["50–90%"]);
    }
  });

  it("carries a New Zealand-only subsidy claim in a document with no Australian counterpart", () => {
    if (!html) return;
    const text = memberFacingText(html);
    expect(text).toMatch(/New Zealand Specific/);
    expect(text).toMatch(/Warmer Kiwi Homes covers 50–90%/);
    expect(text).toMatch(/EECA lists average insulation retrofit at ~\$4,300/);
    expect(text).not.toMatch(/Australia|energy\.gov\.au/);
  });

  it("raises no safety topic: the incidental words (food, power, storage, insulation) are budget categories, not teaching", () => {
    if (!html) return;
    expect(safetyExposureFor(memberFacingText(html))).toEqual([]);
  });

  it("content flags: programme sequencing, a day-complete banner, a next-resource link, a product name and an unsourced figure", () => {
    if (!html) return;
    const kinds = new Set(findContentFlags(html, "OG-03").map((f) => f.kind));
    for (const k of ["day-complete", "next-link", "programme-sequencing", "figure-needs-source", "product-name"]) expect(kinds.has(k as never), k).toBe(true);
  });

  it("carries old programme labels that must not survive a migration", () => {
    if (!html) return;
    const text = memberFacingText(html);
    for (const label of ["Week 1", "Day 3", "30-Day Programme", "Asset OG-03", "OG-04 Property Profile Matrix", "Skool"]) expect(text, label).toContain(label);
    expect(text).toMatch(/\bpillars?\b/i);
  });
});
