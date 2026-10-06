import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.62B — exact safety-block ownership in the numeric scan.
 *
 * A numeric figure is credited to a safety block ONLY when it occurs inside that block's own rendered content. The
 * earlier scan credited everything from the first block to the end of its container (other blocks, and the resource's
 * own text after them) to the FIRST block, so a figure in the resource's own words could pass as "block-sourced".
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));

/** A block exactly as `injectSafety` renders it: one div, one closing div. */
const block = (id: string, text: string) => `<div class="og-safety standard" data-block="${id}"><h3>Block</h3><p style="margin:0">${text}</p></div>`;
const own = (text: string) => `<div class="content"><p>${text}</p></div>`;
const scan = (html: string, market = "NZ", resource = "OG-99") => scanNumericClaims(html, { resource, market, registry, treatment });
const find = (html: string, figure: string, market = "NZ") => scan(html, market).filter((c) => c.figure === figure);

const ONE_METRE = "Keep an unflued heater at least one metre from anything that could catch fire.";
const ANNUAL = "WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually.";
const FIFTEEN = "Check the test date and replace the hose after 15 years.";

describe("Stage 9.62B · safety-block ownership of numeric figures", () => {
  it("text INSIDE block A may use block A-owned claims", () => {
    const hits = find(block("unflued-gas-heating", ONE_METRE), "one metre");
    expect(hits.map((h) => h.bucket)).toEqual(["A_ALREADY_SOURCED"]);
    expect(hits[0].claimId).toBe("nz-gas-heater-clearance-one-metre-worksafe");
    const annual = find(block("gas-installation-and-servicing", ANNUAL), "annually");
    expect(annual[0].claimId).toBe("nz-lpg-cabinet-heater-service-12-months-worksafe");
  });

  it("text AFTER block A is not automatically owned by block A", () => {
    const html = block("unflued-gas-heating", "Use it for as short a time as you can.") + own(ONE_METRE);
    expect(find(html, "one metre").map((h) => h.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    // …even when it sits after the block INSIDE the same container, which is where the old pattern over-reached
    const nested = `<div class="content">${block("unflued-gas-heating", "Use it for as short a time as you can.")}<p>${FIFTEEN}</p></div>`;
    expect(find(nested, "15 years", "AU").map((h) => h.bucket)).toEqual(["C_NEEDS_SOURCE"]);
  });

  it("block B wording is not credited to block A", () => {
    const html = block("carbon-monoxide", "Fit an alarm.") + block("fire-and-smoke-alarms", "Test the alarm every 6 months.");
    const hit = find(html, "6 months")[0];
    expect(hit.claimId, "credited to the block it is actually in").toBe("block:fire-and-smoke-alarms");
    expect(hit.claimId).not.toBe("block:carbon-monoxide");
  });

  it("a block-owned claim does not validate the same wording inside a DIFFERENT block", () => {
    const hit = find(block("carbon-monoxide", ONE_METRE), "one metre")[0];
    expect(hit.claimId, "not the unflued block's registry claim").not.toBe("nz-gas-heater-clearance-one-metre-worksafe");
  });

  it("resource body text is not credited to any safety block, even when it repeats a block's sentence", () => {
    const sentence = "Test the alarm every 6 months.";
    const html = block("fire-and-smoke-alarms", sentence) + own(sentence);
    const hits = find(html, "6 months");
    expect(hits.map((h) => h.bucket).sort(), "one inside the block (sourced), one outside (not)").toEqual(["A_ALREADY_SOURCED", "C_NEEDS_SOURCE"]);
    expect(hits.find((h) => h.bucket === "C_NEEDS_SOURCE")!.claimId).toBeUndefined();
  });

  it("the same numeric figure OUTSIDE its owning block fails", () => {
    expect(find(own(ONE_METRE), "one metre").map((h) => h.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(find(own(ANNUAL), "annually").map((h) => h.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    expect(find(own(ANNUAL), "annually", "AU").map((h) => h.bucket)).toEqual(["C_NEEDS_SOURCE"]);
  });

  it("treatment precedence still works, inside and outside a block", () => {
    const text = "Add two drops of bleach to a litre of water.";
    for (const html of [own(text), block("water-treatment", text)]) {
      expect(scan(html).filter((c) => /bleach|drops|litre/i.test(c.sentence)).every((c) => c.bucket === "E_TREATMENT_OWNED")).toBe(true);
    }
  });

  it("a figure in a registered resource-owned claim is still approved for that resource only", () => {
    const resourceOwned = registry.claims.find((c) => !c.owningBlock && c.owningResources.length > 0 && c.market === "NZ");
    expect(resourceOwned, "the registry has resource-owned claims").toBeDefined();
    const sentence = resourceOwned!.allowedWording;
    const mine = scan(own(sentence), "NZ", resourceOwned!.owningResources[0]).filter((c) => c.claimId === resourceOwned!.id);
    const other = scan(own(sentence), "NZ", "OG-99").filter((c) => c.claimId === resourceOwned!.id);
    expect(mine.length).toBeGreaterThan(0);
    expect(other).toEqual([]);
  });

  it("the OG-27 owner-defined schedule approves that exact sentence for OG-27 ONLY", () => {
    const sentence = "15 minutes every Sunday reviewing what is done, what is next, what is blocked.";
    for (const market of ["NZ", "AU"]) {
      const mine = scan(own(sentence), market, "OG-27").filter((c) => c.figure === "15 minutes");
      expect(mine.map((c) => c.bucket), `${market}: OG-27`).toEqual(["A_ALREADY_SOURCED"]);
      expect(mine[0].claimId).toMatch(/og27-weekly-review-15-minutes-owner-defined/);
      for (const other of ["OG-26", "OG-99", "OG-B09"]) {
        expect(scan(own(sentence), market, other).filter((c) => c.figure === "15 minutes").map((c) => c.bucket), `${market}: ${other}`).toEqual(["C_NEEDS_SOURCE"]);
      }
      // a reworded or different cadence is not approved even for OG-27
      expect(scan(own("30 minutes every Sunday reviewing what is done."), market, "OG-27").filter((c) => c.figure === "30 minutes").map((c) => c.bucket)).toEqual(["C_NEEDS_SOURCE"]);
    }
    const claims = registry.claims.filter((c) => /og27-weekly-review/.test(c.id));
    expect(claims.map((c) => c.market).sort()).toEqual(["AU", "NZ"]);
    for (const c of claims) {
      expect(c.owningResources, c.id).toEqual(["OG-27"]);
      expect(c.jurisdiction, "owner-defined, not government or source-backed").toBe("owner-defined");
      expect(c.limitations.join(" ")).toMatch(/NOT safety guidance[\s\S]*NOT an official/);
    }
  });

  it("a block's own sentence keeps its block credit only in its own block", () => {
    // the generic block credit (no registry claim) is also exact now
    const html = own("Plan a 14-day rotation.") + block("generator-safety", "Run it for 20 minutes outdoors.");
    const inside = find(html, "20 minutes")[0];
    expect(inside.claimId).toBe("block:generator-safety");
  });
});
