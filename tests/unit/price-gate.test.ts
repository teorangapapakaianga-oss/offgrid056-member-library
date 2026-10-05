import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { priceFindings, scanPrices, type PriceRecord } from "@/admin-import/audit/price";

/**
 * Stage 9.61 — the price presence gate.
 *
 * It answers one question: does the member-facing text contain a price nobody has signed off? It is not a
 * freshness system and does not judge whether a price is right. It exists because `currency` is excluded from
 * numeric blocking and the `figure-needs-source` flag matches only `%` and `°C` — so until now a price passed
 * every gate in the pipeline, and 55 of them were removed across seven migrations by a person reading the file.
 */
const html = (body: string) => `<div class="content">${body}</div>`;
const kinds = (body: string) => scanPrices(html(body)).map((c) => `${c.kind}:${c.figure}`);
const prices = (body: string) => scanPrices(html(body)).filter((c) => c.kind === "PRICE").map((c) => c.figure);
const blocks = (body: string, records: PriceRecord[] = [], market = "NZ") =>
  priceFindings(html(body), { market, records }).problems;

describe("Stage 9.61 · true positives — these are prices", () => {
  const cases: [string, string][] = [
    ["a bare amount", "<p>A smoke alarm costs $50.</p>"],
    ["a qualified amount", "<p>Budget from $50 for a basic unit.</p>"],
    ["an amount under a cap", "<p>Everything here is under $100.</p>"],
    ["an amount over a floor", "<p>Expect over $500 installed.</p>"],
    ["an approximate amount", "<p>Approximately $200 per unit.</p>"],
    ["a range", "<p>A modern wood burner is $1,500–$4,000 installed.</p>"],
    ["an Australian code", "<p>The installed cost is AUD 250.</p>"],
    ["a New Zealand code", "<p>The installed cost is NZD 100.</p>"],
    ["a market-prefixed symbol", "<p>About NZ$120 a cylinder.</p>"],
    ["a per-period amount", "<p>Monitoring is $25/month.</p>"],
    ["a per-year amount", "<p>Servicing runs about $180/year.</p>"],
    ["a per-unit amount", "<p>Firewood is $120 per cubic metre.</p>"],
    ["an amount in words", "<p>Expect to spend 2,000 dollars.</p>"],
    ["a thousands shorthand", "<p>A full system is about $1.5k.</p>"],
  ];

  for (const [label, body] of cases) {
    it(`detects ${label}`, () => {
      expect(prices(body).length, `${label}: ${kinds(body).join(", ")}`).toBeGreaterThan(0);
      expect(blocks(body)).not.toEqual([]);
    });
  }

  it("detects a price in a table cost column", () => {
    const table =
      "<table><thead><tr><th>System</th><th>Setup Cost</th><th>Best for</th></tr></thead>" +
      "<tbody><tr><td>Wood burner</td><td>$2,000–$5,000</td><td>Primary heating</td></tr></tbody></table>";
    expect(prices(table).length).toBeGreaterThan(0);
    expect(scanPrices(html(table)).some((c) => c.via === "table")).toBe(true);
  });

  it("detects a bare number in a cost column, with no currency symbol at all", () => {
    const table =
      "<table><thead><tr><th>Fuel</th><th>Cost per unit</th></tr></thead>" +
      "<tbody><tr><td>Firewood</td><td>120</td></tr></tbody></table>";
    expect(scanPrices(html(table)).some((c) => c.kind === "PRICE" && c.via === "table")).toBe(true);
  });

  it("blocks a third-party market price that has no disposition", () => {
    const found = blocks("<p>A pellet burner is $3,000–$6,000 from most suppliers.</p>");
    expect(found.join(" ")).toContain("UNDISPOSED_PRICE");
  });
});

describe("Stage 9.61 · false positives — these are not prices", () => {
  it("OG-26's budget placeholders ($ $ $) do not trigger", () => {
    const body = "<table><thead><tr><th>Category</th><th>Tier 1</th><th>Tier 2</th><th>Tier 3</th></tr></thead><tbody><tr><td>Heat</td><td>$</td><td>$</td><td>$</td></tr></tbody></table>";
    expect(prices(body)).toEqual([]);
    expect(blocks(body)).toEqual([]);
  });

  it("OG-17's empty worksheet cost line does not trigger", () => {
    const body = '<div class="worksheet-field"><div class="worksheet-label">Estimated setup cost (including flue, hearth, consent)</div><div class="worksheet-line"></div></div>';
    expect(prices(body)).toEqual([]);
    expect(blocks(body)).toEqual([]);
  });

  it("OG-22's member-entered cost column does not trigger", () => {
    const body =
      "<table><thead><tr><th>#</th><th>Item</th><th>Est. Cost ($NZD)</th></tr></thead>" +
      "<tbody><tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>";
    expect(prices(body)).toEqual([]);
    expect(blocks(body)).toEqual([]);
  });

  it("OG-22's GRAND TOTAL row does not misread '% of Budget' as a cost", () => {
    // The row is three cells wide against a four-column header. Indexing it blindly read the percentage as money.
    const body =
      "<table><thead><tr><th>Category</th><th>Items</th><th>Total Est. Cost</th><th>% of Budget</th></tr></thead>" +
      "<tbody><tr><td>MUST Have</td><td>&nbsp;</td><td>$&nbsp;</td><td>&nbsp;</td></tr>" +
      "<tr><td>GRAND TOTAL</td><td>$&nbsp;</td><td>100%</td></tr></tbody></table>";
    expect(prices(body)).toEqual([]);
    expect(blocks(body)).toEqual([]);
  });

  it("Queensland's 'from 1 January 2027' does not trigger", () => {
    const body = "<p>This applies to all remaining domestic dwellings from 1 January 2027.</p>";
    expect(prices(body)).toEqual([]);
    expect(blocks(body)).toEqual([]);
  });

  it("a standard's number does not trigger", () => {
    for (const standard of ["AS/NZS 5601", "AS/NZS 4348", "UL2034", "EN50291", "ANSI/NSF 53"]) {
      const body = `<p>Look for a unit certified to ${standard} before you buy it.</p>`;
      expect(prices(body), standard).toEqual([]);
    }
  });

  it("resource ids, route ids and helpline numbers do not trigger", () => {
    for (const body of [
      "<p>See OG-13 for the air audit, and res-1017 for heating.</p>",
      "<p>Call the Poisons Information Centre on 13 11 26.</p>",
      "<p>In NSW call 1300 066 055 to talk to your local Public Health Unit.</p>",
      "<p>Call Healthline on 0800 611 116.</p>",
      "<p>Tas Gas Networks emergency number is 1802 111.</p>",
    ]) {
      expect(prices(body), body).toEqual([]);
    }
  });

  it("a Cost heading with no amount in the cell does not trigger", () => {
    const body = "<table><thead><tr><th>Item</th><th>Cost</th></tr></thead><tbody><tr><td>Flue kit</td><td>To be quoted</td></tr></tbody></table>";
    expect(prices(body)).toEqual([]);
  });

  it("a formula with no asserted amount does not trigger", () => {
    const body = "<p>Total = Items × Unit cost. Write your own figure in.</p>";
    expect(prices(body)).toEqual([]);
  });
});

describe("Stage 9.61 · dispositions", () => {
  const body = "<p>A modern wood burner is $2,000 installed.</p>";

  it("fails closed: with no records at all, a price blocks", () => {
    expect(blocks(body, []).join(" ")).toContain("UNDISPOSED_PRICE");
    // "the config was not there" is never a pass condition
    expect(priceFindings(html(body), { market: "NZ" }).problems.length).toBeGreaterThan(0);
  });

  it("REMOVE fails while the price is still in the output", () => {
    const found = blocks(body, [{ price: "$2,000", disposition: "REMOVE", reason: "vendor figure" }]);
    expect(found.join(" ")).toContain("PRICE_MARKED_REMOVED_BUT_PRESENT");
  });

  it("CURRENT-SOURCE-REQUIRED needs the whole record, or it fails", () => {
    const incomplete: PriceRecord = { price: "$2,000", disposition: "CURRENT-SOURCE-REQUIRED", reason: "live price", source: "https://example.govt.nz" };
    expect(blocks(body, [incomplete]).join(" ")).toContain("INCOMPLETE_PRICE_SOURCE");
    const complete: PriceRecord = {
      ...incomplete,
      authority: "An authority",
      dateChecked: "2026-10-06",
      scope: "a specific product",
      limitations: ["changes often"],
      freshness: "re-check every quarter",
    };
    expect(blocks(body, [complete])).toEqual([]);
  });

  it("OWNER-APPROVED-LIVE-PRICE needs owner, date and the owning product", () => {
    const incomplete: PriceRecord = { price: "$2,000", disposition: "OWNER-APPROVED-LIVE-PRICE", reason: "our own price", approvedBy: "owner" };
    expect(blocks(body, [incomplete]).join(" ")).toContain("INCOMPLETE_OWNER_PRICE");
    const complete: PriceRecord = { ...incomplete, approvedOn: "2026-10-06", owningProduct: "OffGrid056 membership" };
    expect(blocks(body, [complete])).toEqual([]);
  });

  it("a New Zealand approval does not validate an Australian file", () => {
    const nzOnly: PriceRecord[] = [
      { price: "$2,000", disposition: "OWNER-APPROVED-LIVE-PRICE", reason: "our own price", markets: ["NZ"], approvedBy: "owner", approvedOn: "2026-10-06", owningProduct: "OffGrid056 membership" },
    ];
    expect(blocks(body, nzOnly, "NZ")).toEqual([]);
    expect(blocks(body, nzOnly, "AU").join(" ")).toContain("UNDISPOSED_PRICE");
  });

  it("no currency is converted and no equivalence is inferred", () => {
    const nz: PriceRecord[] = [
      { price: "NZ$120", disposition: "OWNER-APPROVED-LIVE-PRICE", reason: "ours", markets: ["NZ"], approvedBy: "owner", approvedOn: "2026-10-06", owningProduct: "OffGrid056 membership" },
    ];
    expect(blocks("<p>It is AU$120.</p>", nz, "AU").join(" ")).toContain("UNDISPOSED_PRICE");
  });
});

describe("Stage 9.61 · legacy versus migrated", () => {
  it("a legacy price the migration removed is evidence, not a blocker", () => {
    const legacy = html("<p>A modern wood burner is $2,000–$5,000 installed.</p>");
    const migrated = html("<p>Get written quotes for a modern wood burner.</p>");
    const found = priceFindings(migrated, { market: "NZ", records: [], legacyHtml: legacy });
    expect(found.problems, "nothing in the member-facing text, so nothing blocks").toEqual([]);
    expect(found.legacyOnly.length, "but the legacy price is recorded as evidence").toBeGreaterThan(0);
    expect(found.output).toEqual([]);
  });

  it("a legacy price that survived migration still blocks", () => {
    const legacy = html("<p>A modern wood burner is $2,000 installed.</p>");
    const found = priceFindings(legacy, { market: "NZ", records: [], legacyHtml: legacy });
    expect(found.problems.join(" ")).toContain("UNDISPOSED_PRICE");
    expect(found.legacyOnly, "it is not legacy-only — it is still there").toEqual([]);
  });
});

describe("Stage 9.61 · the live library", () => {
  it("has zero blocking price findings, and records what migration removed", () => {
    const report = path.join(process.cwd(), "workspace/prep/prep-report.json");
    if (!fs.existsSync(report)) return; // prep output is a working artefact, not committed
    const results = JSON.parse(fs.readFileSync(report, "utf8")) as {
      legacyCode: string;
      terminology: { otherFindings: string[] };
      prices: { inOutput: unknown[]; legacyOnly: unknown[] };
    }[];
    expect(results.length).toBeGreaterThan(0);
    let legacy = 0;
    for (const r of results) {
      expect(r.terminology.otherFindings.filter((f) => f.includes("PRICE")), r.legacyCode).toEqual([]);
      expect(r.prices.inOutput, `${r.legacyCode}: a price survived into the member-facing text`).toEqual([]);
      legacy += r.prices.legacyOnly.length;
    }
    expect(legacy, "the legacy evidence is the reason this gate exists").toBeGreaterThan(0);
  });
});
