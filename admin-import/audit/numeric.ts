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
  | "insulation"
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
  /** the safety block that owns this figure, where it belongs to a block rather than to a resource (Stage 9.62) */
  owningBlock?: string;
  /** the resources this figure is approved for; [] means any resource in that market (used sparingly) */
  owningResources: string[];
  category: NumericCategory;
  /**
   * "ratio" is the unitless case (Stage 9.52): "four parts vinegar to one part water", "half and half". It is a
   * claim *type*, not a category — the candidate is still measured in parts of volume, so it is classified as a
   * capacity claim and blocks under the capacity activation rather than needing a new blocking category.
   */
  claimType: "value" | "range" | "threshold" | "conversion" | "interval" | "example" | "ratio";
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
  /**
   * "report-only" records findings without stopping anything; "blocking" makes an unexplained figure fail the
   * market, as the treatment gates do. The config states which it is, so the file cannot disagree with the code.
   */
  mode?: "report-only" | "blocking";
  /**
   * Categories held out of the first activation (Stage 9.50): percentages, because no live claim has ever exercised
   * that path, and currency, because prices need a freshness system rather than a safety gate. They are still
   * detected and reported — they simply do not block.
   */
  blockingExcludes?: NumericCategory[];
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

/**
 * Spelled-out numbers (Stage 9.62A). Digits were always read; words stopped at "twelve", so "twenty years",
 * "fifteen metres" and "fourteen days" passed unseen. The list is closed on purpose — 1–19, the tens, a tens+units
 * compound ("twenty-five"), "hundred", "thousand" and "half" — and is NOT a general natural-language-number parser:
 * "a couple of", "a dozen", "several" and "a few" are deliberately not read (see SPELLED_NUMBER_LIMITS). Every word
 * still needs a unit beside it before it counts, which is what keeps the false-positive rate down.
 */
const SPELLED_UNITS = "one|two|three|four|five|six|seven|eight|nine";
const SPELLED_TENS = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety";
const SPELLED_SINGLE = `eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|ten|hundred|thousand|half|${SPELLED_UNITS}`;
const NUMBER = `(?:\\d[\\d,]*(?:\\.\\d+)?|(?:${SPELLED_TENS})[-\\s](?:${SPELLED_UNITS})|(?:${SPELLED_TENS})|(?:${SPELLED_SINGLE}))`;
/** What the spelled-number reader does NOT see — recorded so the gap is a decision, not an accident. */
export const SPELLED_NUMBER_LIMITS =
  "Vague quantities ('a couple of years', 'a dozen', 'several', 'a few', 'a decade') and numbers written across words that are not adjacent to a unit are not read. A member-facing claim written that way is not caught by this gate.";
/**
 * Recurring-interval phrases that carry no digit and no unit-with-number (Stage 9.62A). "Serviced once a year",
 * "check it every year", "inspect each year" and "annually" are interval claims exactly as "every 12 months" is, and
 * the digit+unit scanner cannot see any of them. RECURRING_SAFETY is the subset that is ALWAYS a claim wherever it
 * appears (unlike "weekly" or "daily", which stay judged by their sentence). "yearly" counts only as an adverb ("replace\n * it yearly", not "estimated yearly generation"): a yearly cadence is a servicing, test or
 * replacement claim. Nothing is registered by this: an unregistered recurrence still fails as C_NEEDS_SOURCE.
 */
const RECURRING_SAFETY = /\b(?:annually|yearly(?=\s*(?:[.,;:)!?]|$)|\s+(?:by|and|or|before|at|for|with|in|to|from|on|when|if|after|unless|but)\b)|(?:once|twice) (?:a|per|every) year|(?:once )?(?:every|each) (?:other )?year|(?:once or twice|twice or three times) a year)\b/i;
const WORD_INTERVAL = new RegExp(
  `\\b(annual(?:ly)?|yearly|monthly|weekly|daily|fortnightly|twice a year|(?:once|twice) (?:a|per|every) (?:year|month)|(?:once )?(?:every|each) (?:other )?year|(?:once or twice|twice or three times) a year|${NUMBER} times (?:a|per|each) (?:year|month|week)|every (?:six|three|twelve) months)\\b`,
  "gi",
);
const R_VALUE = /\bR[-\s]?\d+(?:\.\d+)?\+?(?![A-Za-z0-9])/g;
const CURRENCY = /(?:NZ\$|AU\$|\$)\s?\d[\d,]*(?:\.\d+)?(?:\s?[–-]\s?(?:NZ\$|AU\$|\$)?\d[\d,]*)?/g;
const FLOW = /\b\d[\d,]*\s?(?:L|litres?)\s?\/\s?(?:h|hr|hour|min|minute|day)\b/gi;

/**
 * Mixing and dilution ratios — "four parts vinegar to one part water", "one part bleach to three parts water",
 * "half and half", "1:3".
 *
 * They carry no unit, so the unit scanner above cannot see them: Stage 9.51 found that a cleaning dilution would
 * have reached a member with nothing checking it. A ratio is recorded as a **capacity** claim measured in parts,
 * with `claimType: "ratio"` on the registry entry that explains it — a claim type rather than a new blocking
 * category, because a ratio of volumes is still a volume claim.
 *
 * Two guards keep it narrow, and they matter more than the patterns do:
 *
 * - the sentence must be about **mixing or diluting** something, so a bare "1:3" in prose is not chemistry; and
 * - it must not be a **scoring instrument**. OG-13's audit scores each room 1–5 and bands the total ("10–20 =
 *   Critical"); OG-02 and OG-18 score the same way. None of that is a dilution, and reading it as one would put
 *   a chemical gate in front of a worksheet.
 */
const RATIO_MIXING = /\b(dilut\w*|mix(?:es|ed|ing|ture)?s?|solution)\b/i;
const RATIO_NOT_CHEMISTRY = /\b(scor\w+|scale|rating|ranked?|ranking|points?|out of \d|priorit\w+|tier|weighting)\b/i;
const RATIO_PATTERNS: RegExp[] = [
  new RegExp(`\\b${NUMBER}\\s+parts?\\s+[a-z][a-z ]{0,24}?\\s+to\\s+${NUMBER}\\s+parts?\\s+[a-z]+`, "gi"),
  /\bhalf and half\b/gi,
  /\b\d{1,3}\s?:\s?\d{1,3}\b/g,
];

function ratioMatches(sentence: string): { figure: string; value: number | null; unit: string; category: NumericCategory }[] {
  if (!RATIO_MIXING.test(sentence) || RATIO_NOT_CHEMISTRY.test(sentence)) return [];
  const found: { figure: string; value: number | null; unit: string; category: NumericCategory }[] = [];
  for (const re of RATIO_PATTERNS) {
    for (const m of sentence.matchAll(re)) {
      const figure = clean(m[0]);
      if (!found.some((f) => f.figure === figure)) found.push({ figure, value: null, unit: "parts", category: "capacity" });
    }
  }
  return found;
}

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
  // The TOTAL row of a table the member fills in: their own percentages add to 100. Prep's figure flag has always
  // treated a bare "100%" this way; the numeric classifier agrees rather than contradicting it.
  { pattern: /^\s*100\s?%\s*$/, why: "a column total — the member's own percentages add to 100%" },
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
const INTERVAL_CLAIM = /\b(check|checked|replace|replaced|inspect|inspected|test|tested|service|serviced|clean|cleaned|desludg\w+|maintain\w*|review\w*|every|at least|rotate|refresh|valid|validity|expir\w+)\b/i;

/**
 * A duration is also a claim when the sentence *asserts* it — "the official baseline is three days", "Get Ready
 * Queensland advises three days". Stage 9.49: without this, an unattributed baseline sentence read as a duration in
 * passing and was filed as harmless, which is exactly the wording the stage existed to catch.
 */
const CLAIM_ASSERTION = /\b(baseline|advises|advise|recommends?|recommended|guidance|official|requires?|required|must|should store|store at least|supply for)\b/i;
/** …unless the sentence is denying it ("not an official Australian daily allowance", "not official NZ requirements"). */
const CLAIM_DENIAL = /\b(?:not|no|never|rather than)\s+(?:an?\s+|the\s+)?(?:official|national|required|recommended)\b/i;

/**
 * Survival and deprivation outcomes (Stage 9.86). "3 days without water", "3 weeks without food", "3–4 minutes without clean
 * air" and "3–4 hours without shelter or heat" state how long a person can withstand a deprivation. They are factual health
 * claims, but a duration "in passing" was filed as harmless (D_NOT_A_CLAIM) because nothing was being recommended — Stage
 * 9.85 found the whole of a legacy "Rule of 3s" read that way. The rule describes the claim PATTERN, not any document: a
 * duration in a sentence that either names going without something the body needs (air, oxygen, water, food, shelter,
 * heat, warmth, sleep) or states a survival outcome (survive, die, fatal, hypothermia, dehydration …).
 *
 * It is deliberately narrow so scheduling language stays what it was: "90-Day Implementation Roadmap", "30-Day Programme",
 * "complete this in 10 minutes" and "without water damage for 5 years" name no deprivation outcome. The lookaheads keep
 * "without water damage", "without food waste", "without heat loss" and similar from reading as deprivation.
 */
const DEPRIVATION =
  /\bwithout\s+(?:(?:any|clean|safe|fresh|drinking|breathable|adequate|enough|proper|a)\s+)*(?:air|oxygen|water(?!\s*(?:damage|leak\w*|ingress|tank\w*|heater\w*|filter\w*|bottle\w*|pressure|meter\w*|bill\w*|restrictions?|treatment))|food(?!\s*(?:waste|safety|allergens?|prep\w*|storage|poisoning))|shelter|heat(?!\s*(?:pump\w*|loss|recovery|source))|heating|warmth|sleep)\b/i;
/** Outcomes that are about the body whatever the subject: "can cause hypothermia within 3 hours". */
const BODILY_OUTCOME = /\b(?:die[sd]?|death|fatal\w*|lethal\w*|life[- ]threatening|hypothermi\w+|dehydrat\w+|starv\w+|unconscious\w*|suffocat\w+)\b/i;
/**
 * "Survive" is only a claim about what a PERSON can withstand ("a person can survive three days…"). A household readiness
 * question — "Can the household survive 72 hours off-grid with only what is on-site?" — is a scenario the member plans for, not
 * a threshold the body has, so it needs both a bodily subject and a statement rather than a question.
 */
const SURVIVE_VERB = /\bsurviv\w+/i;
const BODILY_SUBJECT = /\b(?:person|people|persons|human\w*|body|bodies|adults?|child(?:ren)?|infants?|someone|anyone|patients?|victims?|casualt\w+)\b/i;
/** Exposure to the elements for a duration is the same claim as going without shelter: "3–4 hours in extreme cold". */
const EXPOSURE = /\b(?:in|to|under)\s+(?:the\s+)?(?:extreme|freezing|severe|intense|sub-?zero)\s+(?:cold|heat|temperatures?|weather|conditions)\b|\bexposed\s+to\s+(?:the\s+)?(?:cold|heat|elements)\b/i;
export const isSurvivalClaimSentence = (sentence: string): boolean =>
  DEPRIVATION.test(sentence) ||
  BODILY_OUTCOME.test(sentence) ||
  EXPOSURE.test(sentence) ||
  (SURVIVE_VERB.test(sentence) && BODILY_SUBJECT.test(sentence) && !/\?\s*$/.test(sentence.trim()));

/**
 * Supply-duration targets (Stage 9.87, the task deferred at Stage 9.68). "A 7-day non-perishable supply", "30 days of water",
 * "enough food for 14 days" and "a supply lasting 3 days" assert HOW MUCH to hold, but they carry no interval verb the gate
 * knows, so they were filed as "a duration in passing". They are factual preparedness targets and now read as claim candidates.
 *
 * The rule describes the wording, never a document, and it is context-aware, because a duration beside a supply word is not
 * always a target. It reads as a TARGET only when the duration is bound to a supply noun, and it stays an ordinary sentence when:
 *  - it is NEGATED or reassuring ("You do not need to buy 30 days of food in one shop" — live OG-11, which must stay as it is);
 *  - it is a QUESTION, an EXAMPLE ("for example…") or a member's own choice or blank ("choose…", "write…", "____");
 *  - it is a bare LABEL such as the title "30-Day Pantry Builder" or a menu entry "14-Day Supply" (the compact "N-day supply"
 *    form needs an asserting word beside it — minimum, at least, enough, should, keep, store, disruption …).
 * Titles, programme names ("30-Day Programme", "90-Day Implementation Roadmap"), schedules ("complete this in 7 days", "Day 7",
 * "Week 3") and task deadlines never name a supply noun, so they are untouched.
 */
const SUPPLY_FIG = `(?:\\d[\\d,]*(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d[\\d,]*)?\\+?|${NUMBER})`;
const SUPPLY_UNIT = "(?:day|week|month)s?\\+?";
const SUPPLY_MOD = "(?:emergency|non-?perishable|drinking|household|food|water|fuel|gas|LPG|firewood|wood|medical|stored|essential|spare|extra|backup|back-up|canned|dry|pantry|survival)";
const SUPPLY_THING = "(?:food|water|fuel|supplies|firewood|LPG|gas|rations?|provisions|medication|medicine|batteries)";
const SUPPLY_COMPACT = new RegExp(`${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}\\s+(?:${SUPPLY_MOD}\\s+){0,3}(?:supply|supplies|stockpile|stock|rations?|reserves?)\\b`, "gi");
const SUPPLY_OF = new RegExp(`${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}\\s+(?:of|worth of)\\s+(?:${SUPPLY_MOD}\\s+){0,3}${SUPPLY_THING}\\b`, "gi");
const SUPPLY_ENOUGH = new RegExp(`\\b(?:enough|sufficient)\\s+(?:${SUPPLY_MOD}\\s+){0,2}${SUPPLY_THING}\\s+(?:for|to last)\\s+(?:at least\\s+|up to\\s+|about\\s+)?${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}`, "gi");
const SUPPLY_LASTING = new RegExp(`\\b(?:supply|supplies|stock|stockpile)\\s+(?:lasting|that lasts?|to last|covering)\\s+(?:at least\\s+|up to\\s+|about\\s+)?${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}`, "gi");
const SUPPLY_NOT_A_TARGET = /\b(?:do not|don'?t|does not|doesn'?t|need not|no need|not need|never|not necessary|unnecessary|isn'?t|aren'?t|not required|rather than|instead of)\b|\?\s*$|\b(?:for example|for instance|such as|e\.g\.|imagine|suppose)\b|[_…]{3,}|\b(?:choose|select|pick|decide|circle|tick|fill in|write|your own)\b/i;
const SUPPLY_ASSERTS = /\b(?:minimum|at least|least|enough|sufficient|should|must|need|needs|needed|recommend\w*|advis\w+|aim|keep|kept|store|stored|storing|hold|held|maintain\w*|have|has|stock\w*|accessible|available|ready|extended|disruption|emergenc\w+|outage|in case|per person|baseline|essential|on hand)\b/i;
const supplyMatches = (re: RegExp, s: string) => [...s.matchAll(new RegExp(re.source, re.flags))].map((m) => m[0]);
/** The text of every supply-duration target in a sentence, or [] when the sentence is not asserting one. */
export function supplyTargets(sentence: string): string[] {
  if (SUPPLY_NOT_A_TARGET.test(sentence)) return [];
  const compact = SUPPLY_ASSERTS.test(sentence) ? supplyMatches(SUPPLY_COMPACT, sentence) : [];
  return [...compact, ...supplyMatches(SUPPLY_OF, sentence), ...supplyMatches(SUPPLY_ENOUGH, sentence), ...supplyMatches(SUPPLY_LASTING, sentence)];
}
const isSupplyTargetFigure = (sentence: string, figure: string): boolean => supplyTargets(sentence).some((t) => t.toLowerCase().includes(figure.toLowerCase()));

/**
 * A restatement of a figure the document has already sourced — a row label ("3-Day Official Baseline"), or a
 * pointer back to it ("any gap in your 3-day official baseline"). It asserts nothing new, so it is judged once,
 * where the figure is actually made.
 */
const BACK_REFERENCE = /\bbaseline\b/i;

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
    // The unit ends the match, so the boundary is "not followed by another letter or digit" rather than \b — a
    // trailing \b after "%" would never fire, which is how "90%" went undetected.
    const re = new RegExp(
      `\\b(?:\\d[\\d,]*(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d[\\d,]*(?:\\.\\d+)?)?\\+?\\s?-?\\s?${pattern}|${NUMBER}[\\s-]+${pattern})(?![A-Za-z0-9])`,
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
  // Insulation R-values (Stage 9.63): "R-2.9", "R3.6+", "R 1.3". They carry no unit the scanner knew, so a building-code
  // insulation target passed the numeric gate unseen. A bare R-number is a fixed figure like any other.
  for (const m of sentence.matchAll(R_VALUE)) found.push({ figure: clean(m[0]), value: Number(m[0].replace(/[^\d.]/g, "")) || null, unit: "R-value", category: "insulation" });
  for (const m of sentence.matchAll(CURRENCY)) found.push({ figure: clean(m[0]), value: null, unit: "$", category: "currency" });
  for (const m of sentence.matchAll(WORD_INTERVAL)) found.push({ figure: clean(m[0]), value: null, unit: "time", category: "interval" });
  for (const r of ratioMatches(sentence)) if (!found.some((f) => f.figure === r.figure)) found.push(r);
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

  // EXACT BLOCK OWNERSHIP (Stage 9.62B). An injected safety block is owner-approved wording whose sources are recorded,
  // per market, in safety-blocks.json. A sentence is credited to a block ONLY if it occurs inside that block's own
  // rendered content: `<div class="og-safety …" data-block="id">…</div>` (one block, one closing div). Everything
  // outside every block is the resource's own text and is credited to NO block — even if it sits after a block, in the
  // same container, or happens to repeat a block's sentence word for word.
  //
  // The earlier pattern wanted two closing divs in a row, so it ran from the first block to the end of its container
  // and credited all that followed (other blocks, and the resource's own text) to the FIRST block's id.
  const BLOCK = /<div class="og-safety[^"]*"[^>]*data-block="[^"]+"[^>]*>[\s\S]*?<\/div>/gi;
  const segments: { html: string; owner: string | null }[] = [{ html: html.replace(BLOCK, " "), owner: null }];
  for (const block of html.match(BLOCK) ?? []) {
    segments.push({ html: block, owner: block.match(/data-block="([^"]+)"/)?.[1] ?? "safety-block" });
  }

  for (const { html: segmentHtml, owner: fromBlock } of segments)
  for (const raw of treatmentSentences(segmentHtml)) {    const sentence = clean(raw);
    for (const hit of numericMatches(sentence)) {
      const key = `${market}|${fromBlock ?? "-"}|${sentence}|${hit.figure}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const structural = STRUCTURAL.find((s) => s.pattern.test(sentence));
      const notAClaim = NOT_A_CLAIM.find((s) => s.pattern.test(sentence));
      const owned = treatmentOwns(sentence, treatment, market);
      const approved = registry.claims.find(
        (c) =>
          c.market === market &&
          // A block-owned claim (Stage 9.62A) validates ONLY the sentence that comes from its own block, in the market
          // it was written for. It can never approve a resource's own, separate sentence that merely says the same thing.
          (c.owningBlock
            ? c.owningBlock.split(";").some((b) => b.trim() === fromBlock)
            : c.owningResources.length === 0 || c.owningResources.includes(resource)) &&
          c.match.some((p) => new RegExp(p, "i").test(sentence)) &&
          (!c.requiresLabel || sentence.includes(c.requiresLabel)),
      );

      const horizon = PLANNING_HORIZON.find((h) => h.pattern.test(sentence));
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
      else if (hit.category === "interval" && isSurvivalClaimSentence(sentence))
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a survival or deprivation-outcome duration: a factual claim about what a person can withstand, with no approved entry" });
      else if (hit.category === "interval" && isSupplyTargetFigure(sentence, hit.figure))
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a supply-duration target: a factual statement of how much to hold, with no approved entry" });
      else if (notAClaim) out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: notAClaim.why });
      else if (hit.category === "interval" && horizon) out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: horizon.why });
      else if (
        hit.category === "interval" &&
        !RECURRING_SAFETY.test(sentence) &&
        !INTERVAL_CLAIM.test(sentence) &&
        !(CLAIM_ASSERTION.test(sentence) && !CLAIM_DENIAL.test(sentence))
      )
        out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: "a duration in passing: nothing recommended, and nothing asserted" });
      else if (hit.value === 0 || ARITHMETIC.test(sentence))
        out.push({ ...base, bucket: "D_NOT_A_CLAIM", why: "arithmetic being explained, not a figure asserted" });
      else out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a member-facing figure with no approved entry for this market and resource" });
    }
  }

  // Second pass: a back-reference to a baseline this document has already sourced is not a second claim. It is only
  // downgraded when the document really does carry a sourced figure of the same kind — otherwise it stays a finding.
  const hasSourcedInterval = out.some((c) => c.bucket === "A_ALREADY_SOURCED" && c.category === "interval");
  return out.map((c) =>
    c.bucket === "C_NEEDS_SOURCE" && c.category === "interval" && BACK_REFERENCE.test(c.sentence) && hasSourcedInterval
      ? { ...c, bucket: "D_NOT_A_CLAIM" as Bucket, why: "restates a baseline this document sources elsewhere" }
      : c,
  );
}

/**
 * The candidates that stop a build: only `C_NEEDS_SOURCE`, and only in categories this activation covers.
 *
 * Structure, member inputs and treatment-owned figures never block — a page number is not a claim, a member's own
 * total is not a claim, and a bleach ratio is the treatment gates' business.
 */
export const blockingFindings = (candidates: NumericCandidate[], excludes: NumericCategory[] = []): NumericCandidate[] =>
  candidates.filter((c) => c.bucket === "C_NEEDS_SOURCE" && !excludes.includes(c.category));

/**
 * Numeric findings that must fail this market's file, as strings in the same shape as the fuel and treatment checks.
 *
 * Fail-closed: with no registry, or an empty one, nothing is approved and every unexplained figure fails. "The
 * registry was missing" is not a pass condition (Stage 9.50 ruling 4).
 */
export function numericBlockingFindings(
  html: string,
  options: { resource: string; market: string; registry: NumericRegistry; treatment: TreatmentRegistry },
): string[] {
  const { registry, market } = options;
  if (registry.mode !== "blocking") return [];
  const found = blockingFindings(scanNumericClaims(html, options), registry.blockingExcludes ?? []);
  return found.map((c) => {
    const short = c.sentence.length > 160 ? `${c.sentence.slice(0, 157)}…` : c.sentence;
    return `UNSOURCED_NUMERIC_CLAIM (${market}): "${c.figure}" in "${short}" — a ${c.category} figure with no approved entry for this market and resource. Add a verified entry to config/numeric-claims.json, or remove the figure.`;
  });
}

export function loadNumericRegistry(file: string): NumericRegistry {
  if (!fs.existsSync(file)) return { claims: [] };
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as NumericRegistry;
  return { claims: parsed.claims ?? [], mode: parsed.mode ?? "report-only", blockingExcludes: parsed.blockingExcludes ?? [] };
}
