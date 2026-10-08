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
  | "currency"
  | "performance";

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
const SUPPLY_MOD = "(?:emergency|non-?perishable|drinking|household|food|water|fuel|gas|LPG|firewood|wood|medical|stored|essential|spare|extra|backup|back-up|canned|dry|pantry|survival|infant|baby|pet)";
// Stage 9.91 added meals, formula, pet food, baby food and snacks: "3 days of meals" and "a 3-day supply of formula" are supply targets too.
const SUPPLY_THING = "(?:food|water|fuel|supplies|firewood|LPG|gas|rations?|provisions|medication|medicine|batteries|meals?|formula|pet food|baby food|snacks)";
const SUPPLY_COMPACT = new RegExp(`${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}\\s+(?:${SUPPLY_MOD}\\s+){0,3}(?:supply|supplies|stockpile|stock|rations?|reserves?)\\b`, "gi");
const SUPPLY_OF = new RegExp(`${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}\\s+(?:of|worth of)\\s+(?:${SUPPLY_MOD}\\s+){0,3}${SUPPLY_THING}\\b`, "gi");
const SUPPLY_ENOUGH = new RegExp(`\\b(?:enough|sufficient)\\s+(?:${SUPPLY_MOD}\\s+){0,2}${SUPPLY_THING}\\s+(?:for|to last)\\s+(?:at least\\s+|up to\\s+|about\\s+)?${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}`, "gi");
const SUPPLY_LASTING = new RegExp(`\\b(?:supply|supplies|stock|stockpile)\\s+(?:lasting|that lasts?|to last|covering)\\s+(?:at least\\s+|up to\\s+|about\\s+)?${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}`, "gi");
const SUPPLY_NOT_A_TARGET = /\b(?:do not|don'?t|does not|doesn'?t|need not|no need|not need|never|not necessary|unnecessary|isn'?t|aren'?t|not required|rather than|instead of)\b|\?\s*$|\b(?:for example|for instance|such as|e\.g\.|imagine|suppose)\b|[_…]{3,}|\b(?:choose|select|pick|decide|circle|tick|fill in|write|your own)\b/i;
const SUPPLY_ASSERTS = /\b(?:minimum|at least|least|enough|sufficient|should|must|need|needs|needed|recommend\w*|advis\w+|aim|keep|kept|store|stored|storing|hold|held|maintain\w*|have|has|stock\w*|accessible|available|ready|extended|disruption|emergenc\w+|outage|in case|per person|baseline|essential|on hand)\b/i;
const supplyMatches = (re: RegExp, s: string) => [...s.matchAll(new RegExp(re.source, re.flags))].map((m) => m[0]);
/** The text of every supply-duration target in a sentence, or [] when the sentence is not asserting one. */
// Stage 9.91: "a 3-day supply of formula" names the thing, so it needs no asserting word beside it (the bare label "14-Day Supply" still does),
// and "an emergency kit for 3 days" binds a kit to a period.
const SUPPLY_COMPACT_OF = new RegExp(`${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}\\s+(?:${SUPPLY_MOD}\\s+){0,3}(?:supply|supplies|stockpile|stock|rations?|reserves?)\\s+of\\s+(?:${SUPPLY_MOD}\\s+){0,3}${SUPPLY_THING}\\b`, "gi");
const SUPPLY_KIT = new RegExp(`\\b(?:(?:emergency|survival|grab|go|first[- ]aid|disaster)\\s+)?(?:kit|bag|pack|stockpile)\\s+(?:for|to last|lasting|covering)\\s+(?:at least\\s+|up to\\s+|about\\s+)?${SUPPLY_FIG}[-\\s]*${SUPPLY_UNIT}`, "gi");
/** "Plan 7 days of meals" is menu planning, not a supply target; the planning verbs keep a "days of meals" phrase ordinary. */
const SUPPLY_PLANNING = /\b(?:plan|planning|planned|menu|menus|recipes?|batch[- ]cook\w*)\b/i;
function supplyTargetsRaw(sentence: string): string[] {
  if (SUPPLY_NOT_A_TARGET.test(sentence)) return [];
  const compact = SUPPLY_ASSERTS.test(sentence) ? supplyMatches(SUPPLY_COMPACT, sentence) : [];
  const all = [...compact, ...supplyMatches(SUPPLY_COMPACT_OF, sentence), ...supplyMatches(SUPPLY_OF, sentence), ...supplyMatches(SUPPLY_ENOUGH, sentence), ...supplyMatches(SUPPLY_LASTING, sentence), ...supplyMatches(SUPPLY_KIT, sentence)];
  return SUPPLY_PLANNING.test(sentence) ? all.filter((t) => !/\bmeals?$/i.test(t)) : all;
}
const isSupplyTargetFigure = (sentence: string, figure: string): boolean => supplyTargets(sentence).some((t) => t.toLowerCase().includes(figure.toLowerCase()));

/**
 * Emergency-period claims (Stage 9.91). Stage 9.90 found that "the first 72 hours are the most critical", "help may not reach you for 3 days" and
 * "survive … the worst 3 days without outside help" slipped past both the survival rule (no deprivation word, no bodily subject) and the supply rule
 * (no supply noun). They assert HOW LONG an emergency, a delay in help, or household self-sufficiency lasts. They are factual statements about an
 * emergency period and need a source, in the same way a survival interval or a supply target does.
 *
 * Like the other two families it reads wording, never a document, and it complements them: the classification chain tries survival, then supply,
 * then this rule, and stops at the first, so one statement is one candidate with one owner, never two failures. It stays quiet for titles
 * ("72-Hour Emergency Checklist"), programme names, schedules ("Day 6", "Week 1"), completion times, deadlines, plans ("your 7-day plan"),
 * negated or reassuring sentences, questions, examples and a member's own blanks, because each of those names no asserted period.
 */
const EP_FIG = SUPPLY_FIG;
const EP_UNIT = "(?:minute|hour|day|week)s?";
const EP_CRITICAL = "(?:critical|crucial|vital|most important|most dangerous)";
const EP_PATTERNS: RegExp[] = [
  // "the first 72 hours are the most critical"
  new RegExp(`\\b(?:the\\s+)?(?:first|initial|next|opening)\\s+${EP_FIG}[-\\s]*${EP_UNIT}\\b[^.?]{0,60}\\b${EP_CRITICAL}\\b`, "gi"),
  new RegExp(`\\b${EP_CRITICAL}\\b[^.?]{0,40}\\b(?:first|initial)\\s+${EP_FIG}[-\\s]*${EP_UNIT}\\b`, "gi"),
  // "help may not reach you for 3 days", "emergency services may take up to 3 days to reach you"
  new RegExp(`\\b(?:help|rescue|assistance|aid|relief|emergency services|responders?)\\b[^.?]{0,50}\\b(?:may|might|could|can|will)\\s+(?:not|take|be)\\b[^.?]{0,60}\\b${EP_FIG}[-\\s]*${EP_UNIT}\\b`, "gi"),
  // "survive and communicate through the worst 3 days", "get through the first 3 days"
  new RegExp(`\\b(?:survive|get through|make it through|cope|manage|get by|fend for yourself|be self[- ]sufficient|be self[- ]reliant)\\b[^.?]{0,60}?\\b(?:the\\s+)?(?:worst|first|next|initial)\\s+${EP_FIG}[-\\s]*${EP_UNIT}\\b`, "gi"),
  // "prepare to manage for 7 days", "be self-sufficient for 3 days", "get by for 3 days"
  new RegExp(`\\b(?:survive|get through|make it through|cope|get by|fend for yourself|be self[- ]sufficient|be self[- ]reliant|manage on your own|prepare to manage)\\b[^.?]{0,40}?\\b(?:for|through|over|during)\\s+${EP_FIG}[-\\s]*${EP_UNIT}\\b`, "gi"),
  // "without outside help for 3 days", "3 days without outside help"
  new RegExp(`\\bwithout\\s+(?:any\\s+|outside\\s+|external\\s+)?(?:help|assistance|support|rescue)\\b[^.?]{0,30}\\b(?:for|through)\\s+${EP_FIG}[-\\s]*${EP_UNIT}\\b`, "gi"),
  new RegExp(`\\b${EP_FIG}[-\\s]*${EP_UNIT}\\b[^.?]{0,40}\\bwithout\\s+(?:any\\s+|outside\\s+|external\\s+)?(?:help|assistance|support|rescue)\\b`, "gi"),
  // "the 72-hour window as the critical self-sufficiency period" (a named period asserted to be critical or to measure self-sufficiency)
  new RegExp(`\\b${EP_FIG}[-\\s]*${EP_UNIT}\\s+(?:window|period|standard|rule|mark)\\b[^.?]{0,60}\\b(?:critical|crucial|vital|self[- ]sufficien\\w*|survival)\\b`, "gi"),
  new RegExp(`\\b(?:critical|crucial|vital|self[- ]sufficien\\w*|survival)\\b[^.?]{0,40}\\b${EP_FIG}[-\\s]*${EP_UNIT}\\s+(?:window|period|standard|rule|mark)\\b`, "gi"),
  // "prepare for 3 days", "be ready for up to 7 days"
  new RegExp(`\\b(?:prepare|prepared|be ready|get ready)\\s+for\\s+(?:at least\\s+|up to\\s+)?${EP_FIG}[-\\s]*${EP_UNIT}\\b`, "gi"),
];
/** The text of every emergency-period claim in a sentence, or [] when the sentence asserts none. */
function emergencyPeriodTargetsRaw(sentence: string): string[] {
  if (SUPPLY_NOT_A_TARGET.test(sentence)) return [];
  return EP_PATTERNS.flatMap((re) => supplyMatches(re, sentence));
}
const isEmergencyPeriodFigure = (sentence: string, figure: string): boolean => emergencyPeriodTargets(sentence).some((t) => t.toLowerCase().includes(figure.toLowerCase()));

/**
 * Performance and efficacy claims (Stage 9.97). Two further families, general (they name no resource) and, like the three above, they read the
 * wording of a sentence, never a document.
 *
 *  - MULTIPLIER: "2x", "2×", "2–3x", "twice", "three times", "tenfold" attached to result language (effective, faster, productive, results,
 *    progress, improvement, savings, follow-through, output …): "increases follow-through by 2–3x", "twice as effective", "achieves 3 times the progress".
 *  - COMPARATIVE PERFORMANCE: a better/faster/more-effective/more-progress statement set against "most people", "the average person", "typical
 *    approaches", "most households": "more progress than most people make in a year".
 *
 * A bare "x" is not a claim: a multiplier needs result language in the same sentence, so "2 x batteries" (a member's quantity), "review this twice",
 * "two times this week" (a schedule) and "which option is better for you?" stay quiet. Questions, examples, negations, a member's own blanks and a
 * sentence that opens with an instruction ("Compare the three plans", "Write down what worked better") also assert nothing.
 *
 * OWNERSHIP. One statement has one primary owner. The order is: treatment-owned → registry-approved → safety block → structural label → survival-duration
 * → supply-duration → emergency-period → multiplier → comparative performance → not-a-claim and the ordinary figure rules. Ownership is per figure:
 * a sentence already claimed by survival, supply or emergency-period raises no multiplier or comparative candidate (no second failure for one
 * statement), and a sentence with a multiplier raises no comparative candidate. A different figure in the same sentence ("by 30%") is still its own
 * candidate under the ordinary rules.
 */
const PERF_WORD =
  "(?:effective(?:ness)?|efficien\\w+|faster|quicker|speed\\w*|productiv\\w+|results?|progress|improv\\w+|better|outcomes?|output|savings?|gains?|success\\w*|follow[- ]?through|performance|achiev\\w+|accomplish\\w*|reliab\\w+|likely|succeed\\w*|stronger|longer|boost\\w*|increas\\w+|enhanc\\w+|growth|returns?|impact|powerful)";
const MULT_FIG = "(?:\\d+(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d+(?:\\.\\d+)?)?\\s?(?:x|×)(?![A-Za-z0-9])|(?:twice|thrice)(?![A-Za-z])|(?:double|triple|quadruple)(?=\\s+(?:the|as|your|their|its|that)\\b)|(?:(?:one and a half|two|three|four|five|six|seven|eight|nine|ten|\\d+(?:\\.\\d+)?)\\s+times)(?![A-Za-z])|(?:two|three|four|five|six|seven|eight|nine|ten)-?fold)";
const MULT_PATTERNS: RegExp[] = [
  // "2–3x more effective", "twice as effective", "three times faster"
  new RegExp(`\\b${MULT_FIG}(?:\\s+(?:as|more|the|your|their|its))?[^.?!]{0,25}?\\b${PERF_WORD}\\b`, "gi"),
  // "increases output by 2x", "achieves 3 times the progress", "improves results by a factor of two" (verb + result word before the multiplier)
  new RegExp(`\\b${PERF_WORD}\\b[^.?!]{0,40}?\\b(?:by\\s+(?:a\\s+factor\\s+of\\s+)?|up to\\s+|to\\s+)?${MULT_FIG}`, "gi"),
];
const PERF_NOT_A_CLAIM = /\b(?:do not|don'?t|does not|doesn'?t|never|not\s+(?:a|an|the|about)|no\s+(?:guarantee|promise))\b|\?\s*$|\b(?:for example|for instance|such as|e\.g\.|imagine|suppose|if you|whether)\b|[_…]{3,}|^\s*(?:please\s+)?(?:choose|select|pick|decide|circle|tick|fill in|write|record|enter|note|compare|review|check|list|rank|ask|consider|think|look)\b/i;
/** The text of every multiplier claim in a sentence, or [] when the sentence asserts none. */
function multiplierClaimsRaw(sentence: string): string[] {
  if (PERF_NOT_A_CLAIM.test(sentence)) return [];
  const found: string[] = [];
  for (const re of MULT_PATTERNS) for (const m of sentence.matchAll(re)) {
    const fig = m[0].match(new RegExp(MULT_FIG, "i"));
    if (fig && !found.includes(fig[0].trim())) found.push(fig[0].trim());
  }
  return found;
}
const COMP_BASE = "(?:most|many|the average|an average|average|typical|the typical|nearly all|almost all|the majority of|the vast majority of|other)";
const COMP_GROUP = "(?:people|persons?|households?|homes?|homeowners|families|folks|approaches|methods|plans|options|systems|programmes?|programs?)";
const COMP_PATTERNS: RegExp[] = [
  // "more progress than most people make in a year", "better results than most households"
  new RegExp(`\\b(?:more|greater|better|faster|bigger|stronger)\\s+(?:\\w+\\s+){0,2}?(?:progress|results?|success|gains?|improvements?|output|productivity|impact)\\s+than\\s+${COMP_BASE}\\b`, "gi"),
  // "faster than the average person", "more effective than typical approaches", "better than most households"
  new RegExp(`\\b(?:faster|quicker|better|stronger|more\\s+(?:effective|efficient|productive|successful|reliable|powerful))\\b[^.?!]{0,30}?\\bthan\\s+(?:${COMP_BASE}\\s+)(?:\\w+\\s+){0,1}?${COMP_GROUP}\\b`, "gi"),
  // "achieves more than most people", "gets better results than the average person"
  new RegExp(`\\b(?:achiev\\w+|accomplish\\w*|get|gets|make|makes|do|does|see|sees|gain\\w*)\\s+(?:far\\s+|much\\s+)?(?:more|better)\\b[^.?!]{0,40}?\\bthan\\s+${COMP_BASE}\\b`, "gi"),
];
/** The text of every comparative-performance claim in a sentence, or [] when the sentence asserts none. */
function comparativePerformanceClaimsRaw(sentence: string): string[] {
  if (PERF_NOT_A_CLAIM.test(sentence)) return [];
  // overlapping matches of the three patterns describe one statement: keep the earliest, longest span only
  const spans = COMP_PATTERNS.flatMap((re) => [...sentence.matchAll(re)].map((m) => ({ start: m.index ?? 0, end: (m.index ?? 0) + m[0].length, text: clean(m[0]) }))).sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: typeof spans = [];
  for (const s of spans) if (!kept.some((k) => s.start < k.end && s.end > k.start)) kept.push(s);
  return kept.map((k) => k.text);
}
/**
 * Storage-duration claims (Stage 10.02). A duration that says how long food or stores keep: "shelf life of 2 years", "keeps for 6 months", "use within 12
 * months", "pantry life: 4–5 years", and the same facts set out in a table, where the figure sits in a cell and the claim is in the column header
 * ("Pantry Shelf Life" over "4–5 years"). Wording only, general (no resource is named). Table context is supplied by `storageTableRows`, which turns each
 * body row back into the claim it makes ("Rice (white) — Pantry Shelf Life: 4–5 years") exactly as the treatment gates do for efficacy tables, so
 * the same sentence rules read it and the bare cell ("4–5 years") is not judged a second time.
 *
 * Quiet for what is not a claim: "monthly pantry check", "review this next month", a member's own "Bought 2 months ago" field (its header names no
 * storage life), programme titles ("30-Day Pantry Builder"), schedules ("Week 2", "Day 12"), blank templates, questions, examples, negations and
 * instructions ("Choose how long…", "Write the date…").
 */
const ST_UNIT = "(?:day|week|month|year)s?";
const ST_LIFE = "(?:shelf|storage|pantry|freezer|fridge|refrigerator|cupboard) life";
const ST_DUR = `(?:(?:up to|about|around|at least)\\s+)?(${SUPPLY_FIG}[-\\s]*${ST_UNIT})`;
const ST_COLON = "\\s*:?\\s*";
const ST_FOREVER = "(indefinite(?:ly)?|forever|unlimited|no expiry|never expires?)";
const ST_PATTERNS: RegExp[] = [
  new RegExp(`\\b${ST_LIFE}\\b[^.?!]{0,50}?${ST_DUR}`, "gi"),
  new RegExp(`\\b${ST_DUR}\\s+(?:of\\s+)?${ST_LIFE}\\b`, "gi"),
  new RegExp(`\\b(?:keeps?|lasts?|stays?\\s+(?:fresh|good|safe|edible|usable)|stor(?:e|es|ed|ing)|good|best quality)\\b[^.?!]{0,25}?\\b(?:for|up to|about|around|over)${ST_COLON}${ST_DUR}`, "gi"),
  new RegExp(`\\b(?:use|used|consume|consumed|eat|eaten)\\s+within${ST_COLON}${ST_DUR}`, "gi"),
  new RegExp(`\\bstorage (?:time|duration|period)\\b[^.?!]{0,30}?${ST_DUR}`, "gi"),
  new RegExp(`\\b${ST_FOREVER}\\s+${ST_LIFE}\\b`, "gi"),
  new RegExp(`\\b${ST_LIFE}\\b[^.?!]{0,30}?${ST_FOREVER}`, "gi"),
  new RegExp(`\\b(?:keeps?|lasts?|stores?)\\s+${ST_FOREVER}`, "gi"),
];
const ST_NOT_A_CLAIM = /\b(?:do not|don'?t|does not|doesn'?t|not guarantee|no guarantee)\b|\?\s*$|\b(?:for example|for instance|such as|e\.g\.|imagine|suppose|whether)\b|[_…]{3,}|^\s*(?:please\s+)?(?:choose|select|pick|decide|circle|tick|fill in|write|record|enter|note|list|add|compare|review|check|ask)\b/i;
/** The figure text of every storage-duration claim in a sentence, or [] when it asserts none. */
function storageDurationClaimsRaw(sentence: string): string[] {
  if (ST_NOT_A_CLAIM.test(sentence)) return [];
  const found: string[] = [];
  for (const re of ST_PATTERNS) for (const m of sentence.matchAll(re)) {
    const fig = clean(m[1] ?? "");
    if (fig && !found.includes(fig)) found.push(fig);
  }
  return found;
}
const isStorageDurationFigure = (sentence: string, figure: string): boolean => storageDurationClaims(sentence).some((t) => t.toLowerCase().includes(figure.toLowerCase()) || figure.toLowerCase().includes(t.toLowerCase()));
const ST_HEADER = new RegExp(`${ST_LIFE}|\\bkeeps? for\\b|\\blasts? for\\b|\\bstore for\\b|\\buse within\\b|\\bconsume within\\b|\\bbest quality\\b|\\bstorage (?:time|duration|period)\\b|\\bhow long (?:it )?(?:keeps|lasts|stores)\\b`, "i");
const ST_HEADING = new RegExp(ST_LIFE, "i");
const stripCell = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&ndash;/g, "\u2013").replace(/&mdash;/g, "\u2014").replace(/\s+/g, " ").trim();
/** Each body row of a table whose column header (or preceding heading) names a storage life, as the claim the row makes; `cell` is the bare cell it came from. */
export function storageTableRows(html: string): { sentence: string; cell: string }[] {
  const out: { sentence: string; cell: string }[] = [];
  for (const m of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const table = m[0];
    const headers = [...table.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((h) => stripCell(h[1]));
    const before = html.slice(Math.max(0, (m.index ?? 0) - 400), m.index ?? 0);
    const heading = [...before.matchAll(/<h\d[^>]*>([\s\S]*?)<\/h\d>/gi)].map((h) => stripCell(h[1])).pop() ?? "";
    const headingIsStorage = ST_HEADING.test(heading);
    if (!headers.some((h) => ST_HEADER.test(h)) && !headingIsStorage) continue;
    for (const row of table.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => stripCell(c[1]));
      if (cells.length < 2) continue;
      cells.forEach((cell, i) => {
        if (i === 0 || !cell) return;
        const header = headers[i] ?? "";
        if (ST_HEADER.test(header)) out.push({ sentence: `${cells[0]} \u2014 ${header}: ${cell}`, cell });
        else if (headingIsStorage && new RegExp(`${SUPPLY_FIG}[-\\s]*${ST_UNIT}|${ST_FOREVER}`, "i").test(cell)) out.push({ sentence: `${cells[0]} \u2014 Shelf life${header ? ` (${header})` : ""}: ${cell}`, cell });
      });
    }
  }
  return out;
}

/**
 * Absolute or promised outcome claims (Stage 10.02): a statement that something eliminates, prevents, guarantees or always achieves a result.
 * "eliminates expired food", "prevents all food waste", "stops waste", "perpetually fresh", "fresh indefinitely", "guarantees freshness", "saves money",
 * "never run out of food", "always prevents waste", "no more waste". General wording rules. Hedged or member-facing wording stays quiet: "may help
 * reduce waste", "can help you save money", "write down ways you could save money", "what would help you waste less food?", goals, questions,
 * examples, negations ("does not guarantee savings") and an instruction opener.
 *
 * Because a figure-free sentence raises no ordinary candidate, this rule supplies its own hit (category "performance", unit "outcome").
 * OWNERSHIP (full order): treatment-owned → registry-approved → safety block → structural label → survival-duration → supply-duration → emergency-period →
 * storage-duration → multiplier → comparative performance → absolute outcome → not-a-claim and the ordinary figure rules. A sentence owned by an earlier
 * family raises none of the later performance candidates, and a multiplier or comparative owns the sentence before an outcome claim.
 */
const OUT_PATTERNS: RegExp[] = [
  /\b(?:eliminat\w+|prevent\w*|stops?|ends?|removes?|abolish\w*)\s+(?:all\s+|every\s+|any\s+|your\s+)?(?:expired(?:\s+(?:food|cans?|items?))?|food\s+waste|wasted\s+food|waste|spoilage|spoiled\s+food)\b/gi,
  /\b(?:perpetually|permanently|indefinitely|forever|always)\s+(?:fresh|safe|good|in[- ]date|usable)\b|\b(?:fresh|safe|good)\s+(?:perpetually|permanently|indefinitely|forever)\b/gi,
  /\bguarantee[sd]?\s+(?:you\s+)?(?:freshness|savings?|results?|safety|success|no waste|waste[- ]free)\b/gi,
  /\b(?:saves|will save)\s+(?:you\s+)?(?:money|cash|thousands)\b/gi,
  /\b(?:never|will never|won'?t ever)\s+(?:run out of|run short of|go without|go hungry|throw away|throw out|waste)\b/gi,
  /\balways\s+(?:prevents?|keeps?|saves?|stops?|eliminates?)\b/gi,
  /\bno more\s+(?:waste|wasted|expired|spoil\w+|throwing)\b/gi,
];
const OUT_NOT_A_CLAIM = /\b(?:do not|don'?t|does not|doesn'?t|cannot|can'?t|can not|won'?t|not guarantee|no guarantee)\b|\?\s*$|\b(?:for example|for instance|such as|e\.g\.|imagine|suppose|if you|whether)\b|[_…]{3,}|^\s*(?:please\s+)?(?:choose|select|pick|decide|circle|tick|fill in|write|record|enter|note|compare|review|check|list|rank|ask|consider|think|look)\b/i;
const OUT_HEDGE = /\b(?:may|might|could|can|should|would|aims? to|tries? to|helps?|help you|hope to)\b[^.?!]{0,30}$/i;
/** The text of every absolute outcome claim in a sentence, or [] when it asserts none. */
function outcomeClaimsRaw(sentence: string): string[] {
  if (OUT_NOT_A_CLAIM.test(sentence)) return [];
  const found: string[] = [];
  // overlapping matches describe one statement ("always prevents waste"): keep the earliest, longest span only
  const spans = OUT_PATTERNS.flatMap((re) => [...sentence.matchAll(re)].map((m) => ({ start: m.index ?? 0, end: (m.index ?? 0) + m[0].length, text: clean(m[0]) }))).filter((s) => !OUT_HEDGE.test(sentence.slice(Math.max(0, s.start - 40), s.start))).sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: typeof spans = [];
  for (const s of spans) if (!kept.some((k) => s.start < k.end && s.end > k.start)) kept.push(s);
  return kept.map((k) => k.text);
}

/** The claim families are pure functions of one sentence, and the scan asks about the same sentence several times (ownership, hit generation, classification): answer each once. */
function memoByText<T>(fn: (s: string) => T): (s: string) => T {
  const cache = new Map<string, T>();
  return (s) => {
    let v = cache.get(s);
    if (v === undefined) { v = fn(s); if (cache.size > 50000) cache.clear(); cache.set(s, v); }
    return v;
  };
}
export const supplyTargets = memoByText(supplyTargetsRaw);
export const emergencyPeriodTargets = memoByText(emergencyPeriodTargetsRaw);
export const multiplierClaims = memoByText(multiplierClaimsRaw);
export const comparativePerformanceClaims = memoByText(comparativePerformanceClaimsRaw);
export const storageDurationClaims = memoByText(storageDurationClaimsRaw);
export const outcomeClaims = memoByText(outcomeClaimsRaw);
/** True when an earlier family already owns the sentence, so no performance candidate is raised for it. */
const ownedByEarlierFamily = (sentence: string): boolean => isSurvivalClaimSentence(sentence) || supplyTargets(sentence).length > 0 || emergencyPeriodTargets(sentence).length > 0 || storageDurationClaims(sentence).length > 0;

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
  // Performance and efficacy claims (Stage 9.97): only when no earlier family owns the sentence; a multiplier owns the sentence before a comparative.
  if (!ownedByEarlierFamily(sentence)) {
    const mult = multiplierClaims(sentence);
    for (const fig of mult) if (!found.some((f) => f.figure === fig)) found.push({ figure: fig, value: Number(fig.match(/\d+(?:\.\d+)?/)?.[0]) || null, unit: "multiplier", category: "performance" });
    if (!mult.length) for (const t of comparativePerformanceClaims(sentence)) if (!found.some((f) => f.figure === t)) found.push({ figure: t, value: null, unit: "comparative", category: "performance" });
    if (!mult.length && !comparativePerformanceClaims(sentence).length) for (const t of outcomeClaims(sentence)) if (!found.some((f) => f.figure === t)) found.push({ figure: t, value: null, unit: "outcome", category: "performance" });
  }
  // Storage-duration claims (Stage 10.02): the figure itself, or a "forever" word that carries no unit ("Indefinite").
  for (const fig of storageDurationClaims(sentence)) if (!found.some((f) => fig.toLowerCase().includes(f.figure.toLowerCase()) || f.figure.toLowerCase().includes(fig.toLowerCase()))) found.push({ figure: fig, value: Number(fig.match(/\d+(?:\.\d+)?/)?.[0]) || null, unit: "storage", category: "interval" });
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

  for (const { html: segmentHtml, owner: fromBlock } of segments) {
  // Storage-life tables (Stage 10.02): each body row is read as the claim it makes, and the bare cell it came from is not judged a second time.
  const storageRows = storageTableRows(segmentHtml);
  const ownedCells = new Set(storageRows.map((r) => clean(r.cell)));
  for (const raw of [...treatmentSentences(segmentHtml).filter((s) => !ownedCells.has(clean(s))), ...storageRows.map((r) => r.sentence)]) {    const sentence = clean(raw);
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
      else if (hit.category === "interval" && isEmergencyPeriodFigure(sentence, hit.figure))
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "an emergency-period claim: a factual statement about how long an emergency, a delay in help or household self-sufficiency lasts, with no approved entry" });
      else if (hit.category === "interval" && isStorageDurationFigure(sentence, hit.figure))
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a storage-duration claim: a factual statement of how long food or stores keep, or must be used within, with no approved entry" });
      else if (hit.category === "performance" && hit.unit === "outcome")
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "an absolute outcome claim: an unsupported statement that something eliminates, prevents, guarantees or always achieves a result, with no approved entry" });
      else if (hit.category === "performance" && hit.unit === "multiplier")
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a multiplier claim: an unsupported statement of how much more effective, faster or productive something is, with no approved entry" });
      else if (hit.category === "performance")
        out.push({ ...base, bucket: "C_NEEDS_SOURCE", why: "a comparative-performance claim: an unsupported statement that something outperforms what most people or typical approaches achieve, with no approved entry" });
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
