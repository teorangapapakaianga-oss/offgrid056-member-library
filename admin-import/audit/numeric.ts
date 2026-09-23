/**
 * Numeric claim discovery (Stage 9.48) — REPORT ONLY.
 *
 * The treatment gates proved the shape: a figure passes only when an owner-approved entry for that market matches the
 * sentence it appears in. This module extends that idea past treatment, to every number a member could act on — a
 * tank capacity, a clearance, a stand height, a load, an interval.
 *
 * It runs in **report mode** first, on purpose. Switching a fail-closed gate on across nineteen live resources
 * without first knowing what is in them would either block everything or tempt someone to approve figures in bulk to
 * make a build go green. So this pass classifies what exists; blocking is a separate, owner-approved step.
 *
 * Three rules shape the matching, and they are the reason a plain "number + unit" regex is not enough:
 *
 * 1. **Treatment first.** A bleach ratio or a boil time belongs to `treatment-sources.json`. This module defers to
 *    it rather than holding a second copy of the truth.
 * 2. **Context, not coincidence.** "1 mm" approved for an insect screen does not approve "1 mm" of structural
 *    clearance. A claim carries the words that must surround it.
 * 3. **Ownership.** A figure verified for one resource does not silently legitimise the same figure in another.
 */
import fs from "node:fs";
import { treatmentSentences, type TreatmentRegistry } from "./treatment";

export type NumericCategory =
  | "capacity"
  | "distance"
  | "height"
  | "weight"
  | "pressure"
  | "interval"
  | "temperature"
  | "percentage"
  | "area"
  | "flow"
  | "power"
  | "currency";

export type Bucket =
  | "A_ALREADY_SOURCED"
  | "B_STRUCTURAL"
  | "C_NEEDS_SOURCE"
  | "D_NOT_A_CLAIM"
  | "E_TREATMENT_OWNED";

export interface NumericClaim {
  id: string;
  market: string;
  jurisdiction: string;
  /** the resources this figure is approved for; [] means any resource in that market (used sparingly) */
  owningResources: string[];
  category: NumericCategory;
  claimType: "value" | "range" | "threshold" | "conversion" | "interval" | "example";
  unit: string;
  value: { exact?: number; min?: number; max?: number; text?: string };
  allowedWording: string;
  /** regular expressions the sentence must satisfy — this is where the context lives */
  match: string[];
  /** wording that must appear in the same sentence (an attribution), or null */
  requiresLabel: string | null;
  source: string;
  authority: string;
  sourceDate: string;
  limitations: string[];
  status: string;
}

export interface NumericRegistry {
  claims: NumericClaim[];
}

export interface NumericCandidate {
  resource: string;
  market: string;
  sentence: string;
  figure: string;
  value: number | null;
  unit: string;
  category: NumericCategory;
  bucket: Bucket;
  /** the registry or treatment claim that explains it, when one does */
  claimId?: string;
  why: string;
}

/** Units, and the category each one implies before context is considered. */
const UNITS: { pattern: string; unit: string; category: NumericCategory }[] = [
  { pattern: "(?:kL|kilolitres?)", unit: "kL", category: "capacity" },
  { pattern: "(?:L|litres?)", unit: "L", category: "capacity" },
  { pattern: "(?:mL|millilitres?)", unit: "mL", category: "capacity" },
  { pattern: "(?:mm|millimetres?)", unit: "mm", category: "distance" },
  { pattern: "(?:cm|centimetres?)", unit: "cm", category: "distance" },
  { pattern: "(?:m²|m2|square metres?|sqm)", unit: "m²", category: "area" },
  { pattern: "(?:m|metres?)", unit: "m", category: "distance" },
  { pattern: "(?:kg|kilograms?)", unit: "kg", category: "weight" },
  { pattern: "(?:t|tonnes?)", unit: "t", category: "weight" },
  { pattern: "(?:kPa|bar|psi)", unit: "kPa", category: "pressure" },
  { pattern: "(?:kWh|kW|W|V|Ah|A)", unit: "kW", category: "power" },
  { pattern: "(?:°C|degrees C)", unit: "°C", category: "temperature" },
  { pattern: "%", unit: "%", category: "percentage" },
  { pattern: "(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)", unit: "time", category: "interval" },
];

const NUMBER = "(?:\\d[\\d,]*(?:\\.\\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|twelve|half)";
const WORD_INTERVAL = /\b(annually|yearly|monthly|weekly|daily|fortnightly|twice a year|every (?:six|three|twelve) months)\b/gi;
const CURRENCY = /(?:NZ\$|AU\$|\$)\s?\d[\d,]*(?:\.\d+)?(?:\s?[–-]\s?(?:NZ\$|AU\$|\$)?\d[\d,]*)?/g;
const FLOW = /\b\d[\d,]*\s?(?:L|litres?)\s?\/\s?(?:h|hr|hour|min|minute|day)\b/gi;

/** Things that are numbers on the page but never claims. */
const STRUCTURAL: { pattern: RegExp; why: string }[] = [
  { pattern: /^--\s*\d+\s*of\s*\d+\s*--/, why: "PDF page marker from the text extractor" },
  { pattern: /\b(?:res-\d{4}|OG-B?\d{2})\b/, why: "resource or legacy code" },
  // Guarded so "1,000mm" and "150,000 litres" are not read as the emergency number 000.
  { pattern: /(?<![\d,.])(?:111|000|112|0800[\s\d]*|13\s?11\s?26)(?![\d])/, why: "emergency or helpline number, checked by the market and safety rules" },
  { pattern: /\b(?:20\d\d)\b/, why: "a year — a document or source date" },
  { pattern: /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/, why: "a date" },
  { pattern: /\bStep\s*\d+\b/i, why: "step numbering" },
  { pattern: /\bPage\s*\d+\b/i, why: "page numbering" },
  { pattern: /\bAS\/NZS\s*\d+|ANSI\/NSF\s*\d+|AS\s?\d{4}\b/, why: "a standard's number" },
];

/** Worksheet furniture: a blank for the member to fill in, or a formula's variable. */
const NOT_A_CLAIM: { pattern: RegExp; why: string }[] = [
  { pattern: /^[_\s.·—–-]*$/, why: "an empty worksheet line" },
  { pattern: /\b(?:your|my|own)\s+(?:figure|number|total|answer)\b/i, why: "the member's own figure" },
  { pattern: /=\s*[A-Za-z][A-Za-z ()]*\s*[×x*]\s*[A-Za-z]/, why: "a formula written in variables, not fixed numbers" },
];

/**
 * A planning horizon the member picks — "14-Day Supply", "3-day / 7-day / 14-day / 30-day" — is a choice offered,
 * not a figure asserted. The baseline behind it (three days) is a claim and is registered; the menu is not.
 */
const PLANNING_HORIZON = [
  { pattern: /\b\d+[-\s](?:day|week|month|hour)\b[^.]{0,40}(?:supply|target|plan|goal|horizon|roadmap|programme|challenge|test|trial|run)/i, why: "a planning horizon or self-set test the member chooses" },
  { pattern: /\b\d+[-\s]day\b\s*(?:\/|,|or)\s*\d+[-\s]day/i, why: "a menu of planning horizons" },
  { pattern: /\bday \d+\b[^.]{0,20}(?:to|–|-)\s*day \d+/i, why: "a plan's own day range" },
  // "Weekly check-in day (when will you…)", "UPDATE WEEKLY | REVIEW AT EACH CHECKPOINT": how to use the sheet.
  { pattern: /\b(?:weekly|monthly|daily|fortnightly)\b[^.]{0,60}(?:check-?in|update|review|prompt|reminder|when will you|cadence)/i, why: "how often to use the worksheet — the member's own rhythm" },
  { pattern: /\b(?:update|review)\s+(?:weekly|monthly|daily)\b/i, why: "an instruction about using the sheet, not a factual claim" },
];

/**
 * An interval is a claim when something is being recommended — check, replace, inspect, test, service, every… A
 * duration that is simply part of a sentence ("for three days", "in 30 days") is judged by its subject instead.
 */
const INTERVAL_CLAIM = /\b(check|checked|replace|replaced|inspect|inspected|test|tested|service|serviced|clean|cleaned|desludg\w+|maintain\w*|review\w*|every|at least|rotate|refresh)\b/i;

/** Arithmetic being explained, not a figure being asserted. */
const ARITHMETIC = /\b(?:gap|surplus|difference|total|subtotal|result)\b[^.]{0,40}\b(?:is|=)\b/i;

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Category refined by what the sentence is actually about. */
function refine(category: NumericCategory, sentence: string): NumericCategory {
  if (category === "distance" && /\b(high|height|tall|stand|elevated|above the ground|raised)\b/i.test(sentence)) return "height";
  if (category === "capacity" && /\b(per hour|per minute|flow|litres? an hour)\b/i.test(sentence)) return "flow";
  return category;
}

/** Does the treatment architecture own this sentence? */
function treatmentOwns(sentence: string, treatment: TreatmentRegistry, market: string): string | null {
  const claim = treatment.claims
    .filter((c) => c.market === market)
    .find((c) => c.match.some((p) => new RegExp(p, "i").test(sentence)));
  if (claim) return claim.id;
  // A treatment subject with a figure, but no registry entry, is still treatment's problem — the treatment gates
  // report it, and this module must not offer a second opinion.
  return /\b(bleach|chlorin\w*|hypochlorite|disinfect\w*|boil\w*|filter\w*|filtration|micron|µm|UV|ultraviolet|purif\w*)\b/i.test(sentence)
    ? "treatment-context"
    : null;
}

function numericMatches(sentence: string): { figure: string; value: number | null; unit: string; category: NumericCategory }[] {
  const found: { figure: string; value: number | null; unit: string; category: NumericCategory }[] = [];
  for (const { pattern, unit, category } of UNITS) {
    // Digits may run straight into the unit ("30cm", "5L"); a spelled-out number may not, or "ten" + "t" would
    // read "tent" as ten tonnes. Spelled-out numbers therefore need a space or hyphen before the unit.
    const re = new RegExp(
      `\\b(?:\\d[\\d,]*(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d[\\d,]*(?:\\.\\d+)?)?\\s?-?\\s?${pattern}|${NUMBER}[\\s-]+${pattern})\\b`,
      "gi",
    );
    for (const m of sentence.matchAll(re)) {
      const figure = clean(m[0]);
      if (found.some((f) => f.figure === figure)) continue;
      const digits = figure.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
      found.push({ figure, value: digits ? Number(digits[0]) : null, unit, category: refine(category, sentence) });
    }
  }
  for (const m of sentence.matchAll(FLOW)) {
    const figure = clean(m[0]);
    if (!found.some((f) => f.figure === figure)) found.push({ figure, value: null, unit: "L/time", category: "flow" });
  }
  for (const m of sentence.matchAll(CURRENCY)) found.push({ figure: clean(m[0]), value: null, unit: "$", category: "currency" });
  for (const m of sentence.matchAll(WORD_INTERVAL)) found.push({ figure: clean(m[0]), value: null, unit: "time", category: "interval" });
  return found;
}

/**
 * Every numeric candidate in a market's finished file, classified.
 *
 * Report only: nothing here blocks a build. `blocking` exists so the same code can be switched on later — with an
 * empty registry it approves nothing, which is the behaviour the owner asked to be able to prove.
 */
export function scanNumericClaims(
  html: string,
  options: { resource: string; market: string; registry: NumericRegistry; treatment: TreatmentRegistry },
): NumericCandidate[] {
  const { resource, market, registry, treatment } = options;
  const out: NumericCandidate[] = [];
  const seen = new Set<string>();

  // An injected safety block is owner-approved wording whose sources are recorded, per market, in
  // safety-blocks.json. A figure inside one is already sourced by that block — the interesting question is what the
  // resource's OWN text asserts, so block sentences are separated out rather than mixed in.
  const blockSentences = new Map<string, string>();
  for (const block of html.match(/<div class="og-safety[\s\S]*?<\/div>\s*<\/div>/gi) ?? []) {
    const id = block.match(/data-block="([^"]+)"/)?.[1] ?? "safety-block";
    for (const s of treatmentSentences(block)) blockSentences.set(clean(s), id);
  }

  for (const raw of treatmentSentences(html)) {
    const sentence = clean(raw);
    for (const hit of numericMatches(sentence)) {
      const key = `${market}|${sentence}|${hit.figure}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const structural = STRUCTURAL.find((s) => s.pattern.test(sentence));
      const notAClaim = NOT_A_CLAIM.find((s) => s.pattern.test(sentence));
      const owned = treatmentOwns(sentence, treatment, market);
      const approved = registry.claims.find(
        (c) =>
          c.market === market &&
          (c.owningResources.length === 0 || c.owningResources.includes(resource)) &&
          c.match.some((p) => new RegExp(p, "i").test(sentence)) &&
          (!c.requiresLabel || sentence.includes(c.requiresLabel)),
      );

      const horizon = PLANNING_HORIZON.find((h) => h.pattern.test(sentence));
      const fromBlock = blockSentences.get(sentence);
      const base = { resource, market, sentence, ...hit };
      if (owned) out.push({ ...base, bucket: "E_TREATMENT_OWNED", claimId: owned, why: "governed by treatment-sources.json" });
      else if (approved) out.push({ ...base, bucket: "A_ALREADY_SOURCED", claimId: approved.id, why: approved.authority });
      else if (fromBlock)
        out.push({
          ...base,
          bucket: "A_ALREADY_SOURCED",
          claimId: `block:${fromBlock}`,
          why: `owner-approved safety block wording, sources recorded per market in safety-blocks.json`,
        });
      else if (structural) out.push({ ...base, bucket: "B_STRUCTURAL", why: structural.why });
      else if (notAClaim) out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: notAClaim.why });
      else if (hit.category === "interval" && horizon) out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: horizon.why });
      else if (hit.category === "interval" && !INTERVAL_CLAIM.test(sentence))
        out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: "a duration in passing, with nothing recommended" });
      else if (hit.value === 0 || ARITHMETIC.test(sentence))
        out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: "arithmetic being explained, not a figure asserted" });
      else out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a member-facing figure with no approved entry for this market and resource" });
    }
  }
  return out;
}

/** In blocking mode (not enabled yet), these are the candidates that would stop a build. */
export const blockingFindings = (candidates: NumericCandidate[]): NumericCandidate[] =>
  candidates.filter((c) => c.bucket === "C_NEEDS_SOURCE");

export function loadNumericRegistry(file: string): NumericRegistry {
  if (!fs.existsSync(file)) return { claims: [] };
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as NumericRegistry;
  return { claims: parsed.claims ?? [] };
}
