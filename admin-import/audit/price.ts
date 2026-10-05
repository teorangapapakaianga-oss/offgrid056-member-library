/**
 * Price and currency PRESENCE gate (Stage 9.61).
 *
 * The question this answers is narrow, and keeping it narrow is the point:
 *
 *   **Does the member-facing text contain a price nobody has signed off?**
 *
 * It does not ask whether a price is correct, current or fair. There is no freshness system here, no currency
 * conversion and no registry of approved amounts — those are a separate decision, and this gate exists partly so
 * that decision can be made with evidence instead of guesswork.
 *
 * Why it exists at all: `currency` is held out of numeric blocking by the Stage 9.50 activation, and prep's
 * `figure-needs-source` content flag matches only `%` and `°C`. Between them, a price passed every gate in the
 * pipeline. Fifteen prices across OG-13 and OG-17 were caught by a person reading the document. That is not a
 * control, and the sixteenth would eventually have been missed.
 *
 * Two rules shape the detection, and both come from live resources that would otherwise break:
 *
 * 1. **A currency marker needs digits after it.** OG-26's budget table is literally `$ $ $` for a member to fill
 *    in, and OG-17's worksheet has an empty "Estimated setup cost" line. A bare `$` is furniture, not a claim.
 * 2. **A number near the word "cost" is not automatically a price.** A `Cost` column with no numeric value, a
 *    date, a standard's number, a phone number and a resource id are all numbers in the neighbourhood of money
 *    without being money.
 */
import fs from "node:fs";
// `treatmentSentences` rather than prep's `visibleText`: prep imports this module, and audit modules must not
// import back into the pipeline. It splits on block ends, which is exactly the granularity a price needs.
import { treatmentSentences } from "./treatment";

export type PriceDisposition = "REMOVE" | "CURRENT-SOURCE-REQUIRED" | "OWNER-APPROVED-LIVE-PRICE";

export interface PriceRecord {
  /** the exact price text this record covers, as it appears in the member-facing file */
  price: string;
  disposition: PriceDisposition;
  reason: string;
  /** markets this disposition covers. A New Zealand approval never validates an Australian file. */
  markets?: string[];
  // CURRENT-SOURCE-REQUIRED
  source?: string;
  authority?: string;
  dateChecked?: string;
  scope?: string;
  limitations?: string[];
  freshness?: string;
  // OWNER-APPROVED-LIVE-PRICE
  approvedBy?: string;
  approvedOn?: string;
  owningProduct?: string;
}

export type PriceKind = "PRICE" | "PLACEHOLDER" | "NOT_A_PRICE";

export interface PriceCandidate {
  /** the matched text */
  figure: string;
  /** the sentence or cell it was found in */
  context: string;
  kind: PriceKind;
  /** why it was classified that way */
  why: string;
  /** where it came from: the resource's own text, or a table cost column */
  via: "text" | "table";
}

/** A currency marker with digits after it. The digits are what make it a claim. */
const CURRENCY_SYMBOL = String.raw`(?:(?:NZ|AU|US|CA)\s?\$|\$)`;
const AMOUNT = String.raw`\d[\d,]*(?:\.\d+)?\s?k?`;
const PRICE_PATTERNS: { pattern: RegExp; why: string }[] = [
  { pattern: new RegExp(`${CURRENCY_SYMBOL}\\s?${AMOUNT}(?:\\s?[–—-]\\s?${CURRENCY_SYMBOL}?\\s?${AMOUNT})?`, "gi"), why: "a currency symbol with an amount" },
  { pattern: new RegExp(`\\b(?:NZD|AUD|USD|CAD)\\s?${AMOUNT}`, "gi"), why: "a currency code with an amount" },
  { pattern: new RegExp(`\\b${AMOUNT}\\s?dollars\\b`, "gi"), why: "an amount written in words" },
];

/**
 * A currency marker with NO amount after it: a blank for the member to fill in.
 *
 * OG-26's three-tier budget table and OG-17's worksheet both do this, and both are live. A gate that fires here
 * blocks two deployed resources on its first run.
 */
const PLACEHOLDER = /(?:(?:NZ|AU|US|CA)\s?)?\$(?:\s*[$_.·—–-]|\s*$|\s+(?!\d))/gim;

/** Things that contain digits near money words but are not prices. */
const NOT_A_PRICE: { pattern: RegExp; why: string }[] = [
  { pattern: /\bAS\/NZS\s*\d+|\bANSI\/NSF\s*\d+|\bAS\s?\d{4}\b|\bUL\s?\d{4}\b|\bEN\s?\d{5}\b/i, why: "a standard's number" },
  { pattern: /\bOG-B?\d{2}\b|\bres-\d{4}\b/i, why: "a resource or legacy code" },
  { pattern: /\b(?:from|since|until|by|on|after|before)\s+\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)/i, why: "a date" },
  { pattern: /(?<![\d,.])(?:111|000|112|0800[\s\d]*|13\s?11\s?26|1300[\s\d]*|1800[\s\d]*|1802[\s\d]*|13\s?27\s?00)(?![\d])/, why: "an emergency or helpline number" },
];

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Table cells under a cost-like header, which is how a comparison table carries its prices. */
const COST_HEADER = /\b(cost|price|pricing|budget|fee|per unit|\$)\b/i;

function tablePriceCandidates(html: string): PriceCandidate[] {
  const out: PriceCandidate[] = [];
  for (const table of html.match(/<table[\s\S]*?<\/table>/gi) ?? []) {
    const headers = [...table.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => clean(m[1].replace(/<[^>]+>/g, " ")));
    const costColumns = headers.map((h, i) => (COST_HEADER.test(h) ? i : -1)).filter((i) => i >= 0);
    if (!costColumns.length) continue;
    for (const row of table.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
        clean(m[1].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")),
      );
      // A row with a different number of cells than the header has a colspan somewhere, and the column index no
      // longer means what it says. OG-22's GRAND TOTAL row is three cells wide against a four-column header, and
      // indexing it blindly read the "% of Budget" value as a cost. Skip rather than guess.
      if (!cells.length || cells.length !== headers.length) continue;
      for (const column of costColumns) {
        const cell = cells[column];
        if (!cell) continue;
        const context = `${headers[column]}: ${cell}`;
        if (!/\d/.test(cell)) {
          // "$ $ $", "—", an empty line: a column heading called Cost with nothing asserted in it.
          out.push({ figure: cell || "(empty)", context, kind: "PLACEHOLDER", why: "a cost column with no amount in the cell", via: "table" });
          continue;
        }
        const notPrice = NOT_A_PRICE.find((n) => n.pattern.test(cell));
        if (notPrice) {
          out.push({ figure: cell, context, kind: "NOT_A_PRICE", why: notPrice.why, via: "table" });
          continue;
        }
        // A percentage in a cost column is a share of a budget, not an amount of money.
        if (/%/.test(cell) && !new RegExp(CURRENCY_SYMBOL).test(cell)) {
          out.push({ figure: cell, context, kind: "NOT_A_PRICE", why: "a percentage, not an amount", via: "table" });
          continue;
        }
        out.push({ figure: cell, context, kind: "PRICE", why: "an amount in a cost column", via: "table" });
      }
    }
  }
  return out;
}

/**
 * Every price-shaped thing in a piece of member-facing HTML, classified.
 *
 * `html` must be the resource's OWN text, before safety blocks are injected (Stage 9.58). No approved block
 * carries a price today; if one ever does, it owns that price and the resource should not be asked to dispose of
 * it.
 */
export function scanPrices(html: string): PriceCandidate[] {
  const out: PriceCandidate[] = [];
  const seen = new Set<string>();
  const add = (c: PriceCandidate) => {
    const key = `${c.kind}|${c.figure}|${c.context.slice(0, 60)}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(c);
    }
  };

  for (const candidate of tablePriceCandidates(html)) add(candidate);

  for (const line of treatmentSentences(html)) {
    const context = clean(line);
    if (!context) continue;
    for (const { pattern, why } of PRICE_PATTERNS) {
      for (const m of context.matchAll(new RegExp(pattern.source, pattern.flags))) {
        const figure = clean(m[0]);
        const notPrice = NOT_A_PRICE.find((n) => n.pattern.test(context));
        add(
          notPrice
            ? { figure, context, kind: "NOT_A_PRICE", why: notPrice.why, via: "text" }
            : { figure, context, kind: "PRICE", why, via: "text" },
        );
      }
    }
    for (const m of context.matchAll(new RegExp(PLACEHOLDER.source, "gim"))) {
      add({ figure: clean(m[0]), context, kind: "PLACEHOLDER", why: "a currency symbol with no amount — a blank for the member", via: "text" });
    }
  }
  return out;
}

/** A disposition covers a price when it names it and applies to that market. */
function dispositionFor(price: string, market: string, records: PriceRecord[]): PriceRecord | undefined {
  const normalise = (s: string) => s.replace(/[\s,]/g, "").toLowerCase();
  return records.find(
    (r) =>
      (normalise(r.price) === normalise(price) || normalise(price).includes(normalise(r.price))) &&
      // A New Zealand approval never validates an Australian file, and vice versa. No market list means both.
      (!r.markets?.length || r.markets.includes(market)),
  );
}

/** A CURRENT-SOURCE-REQUIRED record is only complete when it carries everything that makes it checkable. */
const REQUIRED_SOURCE_FIELDS = ["source", "authority", "dateChecked", "scope", "freshness"] as const;

export interface PriceFindings {
  /** prices in the member-facing output, and what accounts for each */
  output: { candidate: PriceCandidate; record?: PriceRecord }[];
  /** prices the LEGACY source carried — migration evidence only, never blocking */
  legacyOnly: PriceCandidate[];
  /** the strings that fail this market */
  problems: string[];
}

/**
 * The gate.
 *
 * Fail-closed in the way that matters: a price with no disposition fails. "The config was not there" is not a pass
 * condition — an empty or missing disposition list means nothing is approved, so every price blocks.
 */
export function priceFindings(
  ownHtml: string,
  options: { market: string; records?: PriceRecord[]; legacyHtml?: string },
): PriceFindings {
  const records = options.records ?? [];
  const candidates = scanPrices(ownHtml);
  const prices = candidates.filter((c) => c.kind === "PRICE");
  const problems: string[] = [];
  const output: PriceFindings["output"] = [];

  for (const candidate of prices) {
    const record = dispositionFor(candidate.figure, options.market, records);
    output.push({ candidate, record });
    if (!record) {
      problems.push(
        `UNDISPOSED_PRICE (${options.market}): "${candidate.figure}" in "${candidate.context.slice(0, 120)}" — a member-facing price with no recorded disposition. Record REMOVE, CURRENT-SOURCE-REQUIRED or OWNER-APPROVED-LIVE-PRICE in config/metadata-review.json, or take the price out.`,
      );
      continue;
    }
    if (record.disposition === "REMOVE") {
      problems.push(
        `PRICE_MARKED_REMOVED_BUT_PRESENT (${options.market}): "${candidate.figure}" is recorded as REMOVE but still appears in the member-facing text: "${candidate.context.slice(0, 120)}".`,
      );
    }
    if (record.disposition === "CURRENT-SOURCE-REQUIRED") {
      const missing = REQUIRED_SOURCE_FIELDS.filter((f) => !record[f]);
      if (missing.length) {
        problems.push(
          `INCOMPLETE_PRICE_SOURCE (${options.market}): "${candidate.figure}" is CURRENT-SOURCE-REQUIRED but the record is missing ${missing.join(", ")}. A live price that cannot be kept current should be REMOVE instead.`,
        );
      }
    }
    if (record.disposition === "OWNER-APPROVED-LIVE-PRICE") {
      const missing = (["approvedBy", "approvedOn", "owningProduct"] as const).filter((f) => !record[f]);
      if (missing.length) {
        problems.push(
          `INCOMPLETE_OWNER_PRICE (${options.market}): "${candidate.figure}" is OWNER-APPROVED-LIVE-PRICE but the record is missing ${missing.join(", ")}. This disposition is only for a price OffGrid056 itself controls.`,
        );
      }
    }
  }

  // Legacy evidence. A price the source carried and the migrated text does not is recorded, never blocking.
  const legacyOnly = options.legacyHtml
    ? scanPrices(options.legacyHtml)
        .filter((c) => c.kind === "PRICE")
        .filter((c) => !prices.some((p) => p.figure === c.figure))
    : [];

  return { output, legacyOnly, problems };
}

export function loadPriceRecords(file: string, code: string): PriceRecord[] {
  if (!fs.existsSync(file)) return [];
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as { resources?: Record<string, { priceDispositions?: PriceRecord[] }> };
  return parsed.resources?.[code]?.priceDispositions ?? [];
}
