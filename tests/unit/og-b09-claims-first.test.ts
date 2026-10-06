import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { applyCopyChanges, findContentFlags, fuelSafetyFindings, memberFacingText, requiredGasBlocks, GAS_BLOCK_SET } from "@/admin-import/pilot/prep";
import { reskinHtml } from "@/admin-import/reskin/reskin";
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

interface Change { where: string; from: string; to: string; expectedMatches: number; markets?: string[]; approvedBy: string; approvedOn: string; reason: string }
const approvedCopy = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-B09"] ?? [];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-B09"];
const newCopy = (market: string) => approvedCopy.filter((c) => !c.markets || c.markets.includes(market)).map((c) => c.to).join("\n");

describe("Stage 9.64 · OG-B09 owner rulings are recorded exactly", () => {
  it("carries gas-and-lpg-general and solid-fuel-heating (plus the detector-required electrical block), and nothing that suppresses a trigger", () => {
    // Stage 9.64A: the resilience wording (solar, battery, inverter) makes batteries-and-electrical detector-required.
    expect(meta.safetyBlocks).toEqual(["gas-and-lpg-general", "solid-fuel-heating", "batteries-and-electrical"]);
    expect(meta.approvedSafetyBlocks).toEqual(["gas-and-lpg-general", "solid-fuel-heating", "batteries-and-electrical"]);
    const gasBlocksCarried = (meta.safetyBlocks as string[]).filter((b) => /gas|lpg|unflued|cylinder|leak/.test(b));
    expect(gasBlocksCarried, "exactly one gas block").toEqual(["gas-and-lpg-general"]);
    for (const key of ["safetyExemptions", "safetyTopicDispositions", "fuelExemptions", "priceDispositions", "safetyBlockTrims"]) {
      expect(meta[key], `${key}: no exemption, disposition or trim may suppress a trigger`).toBeUndefined();
    }
  });

  it("records the approved metadata", () => {
    expect(meta).toMatchObject({
      title: "Resilient Heating & Insulation Upgrade Checklist",
      resourceType: "checklist",
      foundation: "shelter",
      category: "insulation",
      difficulty: "beginner",
      estimatedTime: 30,
      description: "Check each room's insulation, then compare heating options against your household's energy, fuel and outage needs, and your own quotes, before you decide what to upgrade.",
      relatedResources: ["res-1015", "res-1017", "res-1019", "res-1021"],
      tags: [],
      recordStatus: "draft",
      difficultyBasis: "OWNER-APPROVED / INFERRED",
      timeBasis: "OWNER-APPROVED / INFERRED",
    });
  });

  it("every copy change is owner-approved, dated and reasoned", () => {
    expect(approvedCopy.length).toBeGreaterThan(8);
    for (const c of approvedCopy) {
      expect(c.approvedBy, c.where).toBe("owner");
      expect(c.approvedOn, c.where).toMatch(/^2026-10-06$/);
      expect(c.reason.length, c.where).toBeGreaterThan(20);
    }
  });

  it("introduces no price, percentage, R-value or construction-year figure", () => {
    for (const market of ["NZ", "AU"]) {
      const text = newCopy(market).replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
      expect(text, `${market}: a price`).not.toMatch(/[$]\s?\d/);
      expect(text, `${market}: a percentage`).not.toMatch(/\d\s?%/);
      expect(text, `${market}: an R-value`).not.toMatch(/\bR[-\s]?\d/);
      expect(text, `${market}: the 2008 rule`).not.toMatch(/\b2008\b|built before/i);
      expect(text, `${market}: a universal ranking`).not.toMatch(/most efficient|cheapest|ultimate|\bluxury\b|know exactly/i);
    }
  });

  it("AU terminology: first reference 'reverse-cycle air conditioner (heat pump)'; NZ keeps 'heat pump'; no global replacement", () => {
    const au = newCopy("AU");
    const nz = newCopy("NZ");
    expect(au).toContain("Reverse-cycle air conditioner (heat pump)");
    expect(au.match(/heat pump/gi)).toHaveLength(1);
    expect(nz).toContain("<td>Heat pump</td>");
    expect(nz).not.toMatch(/reverse[- ]cycle/i);
    // the terminology change is market-scoped, never shared
    for (const c of approvedCopy.filter((x) => /reverse-cycle/i.test(x.to))) expect(c.markets, c.where).toEqual(["AU"]);
  });

  it("the Flued gas row says nothing that pulls in another gas block", () => {
    const row = (newCopy("NZ").match(/<tr><td>Flued gas<\/td>[\s\S]*?<\/tr>/) ?? [""])[0];
    expect(row).toContain("Flued gas");
    expect(row).not.toMatch(/gasfitter|gas fitter|licensed|servic|install|carbon monoxide|\bCO\b|cylinder|leak|unflued|ventilat|maintenance/i);
    expect(row).toBe(((newCopy("AU").match(/<tr><td>Flued gas<\/td>[\s\S]*?<\/tr>/) ?? [""])[0]));
  });

  it("the wood-burner row carries no safety wording of its own (the solid-fuel block does)", () => {
    const row = (newCopy("NZ").match(/<tr><td>Wood burner<\/td>[\s\S]*?<\/tr>/) ?? [""])[0];
    expect(row).toContain("Wood burner");
    expect(row).not.toMatch(/chimney|flue|clearance|metre|ash|fire\b|carbon monoxide|\bCO\b|sweep|smoke|safe/i);
  });
});

describe("Stage 9.64A · OffGrid056 positioning: a resilience checklist, not a home-heating buyer guide", () => {
  const nz = newCopy("NZ");
  const rowOf = (name: string) => (nz.match(new RegExp(`<tr[^>]*><td>${name}</td>[\\s\\S]*?</tr>`)) ?? [""])[0].replace(/<input[^>]*>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  it("uses the resilience title", () => {
    expect(meta.title).toBe("Resilient Heating & Insulation Upgrade Checklist");
    expect(newCopy("NZ") + newCopy("AU")).toContain("Resilient Heating & Insulation");
  });

  it("compares every option through the OffGrid056 lens, with the eight approved columns", () => {
    const head = (nz.match(/<thead>[\s\S]*?<\/thead>/) ?? [""])[0].replace(/<[^>]+>/g, "|").replace(/\s+/g, " ").replace(/(\| ?)+/g, "|");
    expect(head).toBe("|Heating Type|Energy / Fuel Source|Electricity Dependency|Resilience / Outage Consideration|Household Considerations|Your Quote|Your Estimated Running Cost|Your Notes|");
    for (const type of ["Heat pump", "Wood burner", "Flued gas", "Panel / convection", "Underfloor electric", "Central ducted"]) expect(rowOf(type), type).toBeTruthy();
  });

  it("no conventional-home or sales-ranking framing survives", () => {
    const all = nz + newCopy("AU");
    expect(all).not.toMatch(/Backup heat and atmosphere|Quick heat|Heating the whole house|Heating tiled floors|Main heating for living areas|Extra heat in small rooms|most efficient|\bbest\b|cheapest|default heating|off-grid default/i);
  });

  it("heat pump: a valid option that needs electricity, and is not automatically outage heating", () => {
    const r = rowOf("Heat pump");
    expect(r).toMatch(/needs electricity/i);
    expect(r).toMatch(/generation, inverter and battery/i);
    expect(r).toMatch(/do not assume it works as outage heating/i);
    expect(r).not.toMatch(/\d/);
  });

  it("wood burner: independent heating framed through fuel, installation and local requirements, with no safety teaching", () => {
    const r = rowOf("Wood burner");
    expect(r).toContain("Independent space heating where suitable fuel, installation and local requirements are addressed. Can remain useful when household electricity is unavailable.");
  });

  it("electric options are framed as household electrical load, with no figures", () => {
    for (const t of ["Panel / convection", "Underfloor electric"]) {
      const r = rowOf(t);
      expect(r, t).toMatch(/electricity-dependent/i);
      expect(r, t).toMatch(/electrical (load|demand)/i);
      expect(r, t).toMatch(/household energy system|generation, inverter and battery/i);
      expect(r, t).not.toMatch(/\d/);
    }
  });

  it("central ducted is framed around the system, its electricity and its distribution", () => {
    const r = rowOf("Central ducted");
    expect(r).toMatch(/distribution system/);
    expect(r).toMatch(/Check the actual requirements of the system/);
    expect(r).not.toMatch(/\d/);
  });

  it("carries the OffGrid056 decision questions and the approved closing", () => {
    const all = newCopy("NZ");
    for (const q of [
      "What energy or fuel does this option depend on?",
      "Will it still operate if household electricity is unavailable?",
      "Can my solar, battery and inverter system support it?",
      "Can I store or reliably obtain the fuel it requires?",
      "Does it give me an independent backup heating option?",
      "What ongoing maintenance or professional servicing does it require?",
      "What will it add to my household energy demand?",
      "What is my supplier's written installed quote?",
    ]) expect(all, q).toContain(q);
    expect(all).toContain("There is no single heating system that suits every resilient or off-grid household. Compare insulation first, then consider your available energy, fuel storage, household power system, outage needs, maintenance and budget before choosing an upgrade.");
  });

  it("proposes related resources only where they genuinely support a next step", () => {
    expect(meta.relatedResources).toEqual(["res-1015", "res-1017", "res-1019", "res-1021"]);
    expect(meta.relatedResources).not.toContain("res-1018");
    expect(meta.relatedResources).not.toContain("res-1020");
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const ids = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => (JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string }).id);
    for (const id of meta.relatedResources as string[]) expect(ids, `${id} exists in the library`).toContain(id);
  });
});

describe("Stage 9.64 · the migrated OG-B09 draft, built from the legacy source when the working copy has it", () => {
  const list = path.join(root, "workspace/candidates.json");
  const build = (market: string): string | null => {
    if (!fs.existsSync(list)) return null;
    const cands = JSON.parse(fs.readFileSync(list, "utf8")) as { source: { path: string; filename: string; extension: string } }[];
    const f = cands.find((c) => c.source.filename.startsWith("OG-B09_") && /\.html?$/i.test(c.source.extension));
    if (!f) return null;
    const skinned = reskinHtml(fs.readFileSync(f.source.path, "utf8"), { strapline: "Prepare • Adapt • Thrive" }).html;
    const shared = applyCopyChanges(skinned, approvedCopy.filter((c) => !c.markets?.length));
    const own = applyCopyChanges(shared.html, approvedCopy.filter((c) => c.markets?.includes(market)));
    for (const r of [...shared.results, ...own.results]) expect(r.applied, `${market}: ${r.where}`).toBe(true);
    return own.html;
  };

  it("every approved copy change applies exactly once, in both markets", () => {
    for (const m of ["NZ", "AU"]) build(m);
  });

  it("has 0 unsupported R-values, 0 prices, 0 efficiency percentages and 0 numeric Bucket C", () => {
    for (const m of ["NZ", "AU"]) {
      const html = build(m);
      if (!html) return;
      const text = html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
      expect(text.match(/[$]\s?\d/g) ?? [], `${m} prices`).toEqual([]);
      expect(text.match(/\d\s?%/g) ?? [], `${m} percentages`).toEqual([]);
      expect(text.match(/\bR[-\s]?\d/g) ?? [], `${m} R-values`).toEqual([]);
      expect(bucketCs(html, m), `${m} Bucket C`).toEqual([]);
      expect(priceFindings(html, { market: m, records: [], legacyHtml: html }).problems, `${m} prices gate`).toEqual([]);
      expect(findContentFlags(html, "OG-B09").filter((f) => f.kind === "figure-needs-source"), `${m} efficiency flags`).toEqual([]);
    }
  });

  it("requires gas-and-lpg-general only, and no unintended gas block, in both markets", () => {
    for (const m of ["NZ", "AU"]) {
      const html = build(m);
      if (!html) return;
      const fuel = fuelSafetyFindings(html).some((f) => f.startsWith("GAS_SAFETY_REQUIRED"));
      const topics = safetyExposureFor(memberFacingText(html));
      expect(fuel, `${m}: the Flued gas label raises the gas check`).toBe(true);
      expect(requiredGasBlocks(topics.filter((t) => t in GAS_BLOCK_SET), fuel), m).toEqual(["gas-and-lpg-general"]);
      for (const not of ["unflued-gas-heating", "gas-cylinder-safety", "gas-leak-response", "gas-installation-and-servicing"]) expect(topics, `${m}: ${not}`).not.toContain(not);
    }
  });

  it("the generation / inverter / battery wording makes the electrical block detector-required (and is not weakened)", () => {
    for (const m of ["NZ", "AU"]) {
      const html = build(m);
      if (!html) return;
      const topics = safetyExposureFor(memberFacingText(html));
      expect(topics, `${m}: the electrical topic is required by the member-facing text`).toContain("batteries-and-electrical");
      expect(meta.safetyBlocks as string[], `${m}: and it is carried`).toContain("batteries-and-electrical");
      const text = html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
      expect(text, `${m}: the resilience wording is kept`).toMatch(/generation, inverter and battery system/);
      expect(text, `${m}: and the questions`).toMatch(/Can my solar, battery and inverter system support it\?/);
    }
  });

  it("keeps the two markets apart", () => {
    const nz = build("NZ");
    const au = build("AU");
    if (!nz || !au) return;
    const strip = (h: string) => h.replace(/<style[\s\S]*?<\/style>/g, "");
    expect(strip(au)).not.toMatch(/New Zealand|Building Code|\b111\b/);
    expect(strip(nz)).not.toMatch(/Australia|National Construction Code|state or territory|reverse[- ]cycle|\b000\b/i);
    expect(strip(nz)).toContain("your council");
    expect(strip(au)).toContain("your state or territory building authority");
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
