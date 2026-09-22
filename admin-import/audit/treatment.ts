/**
 * Water-treatment claim gates (Stage 9.43, owner rulings 4-11).
 *
 * A treatment claim — a bleach ratio, a boil time, a filter or UV efficacy claim, a testing interval — may appear in
 * a member-facing file only when an owner-approved entry in `config/treatment-sources.json` matches it **in that
 * file's own market**. There is no keyword allow-list and no phrase exemption: a sentence that trips a gate is a
 * blocker unless a registry claim for that market matches the sentence itself.
 *
 * That is what keeps the markets apart. New Zealand's "5 drops per litre" has no Australian registry entry, so it
 * fails in an AU file; NSW's "2 drops per litre" has no New Zealand entry, so it fails in an NZ file. Neither needs
 * a rule of its own.
 *
 * The contamination gate works the other way round: a sentence that offers treatment for a contaminated source is a
 * blocker *unless* the document also carries one of that market's approved limitation statements. Silence fails.
 */
import fs from "node:fs";

export interface TreatmentClaim {
  id: string;
  market: string;
  jurisdiction: string;
  method: string;
  claimType: string;
  allowedWording: string;
  numericValue: string | null;
  /** regular expressions (case-insensitive) that a sentence must match for this claim to allow it */
  match: string[];
  /** the gates this claim can answer */
  gates: string[];
  source: string;
  authority: string;
  sourceDate: string;
  householdApplicability: string;
  limitations: string[];
  contaminationExclusions: string[];
  status: string;
}

export interface TreatmentRegistry {
  claims: TreatmentClaim[];
  unavailableSources?: { id: string; title: string; status: string; note?: string }[];
}

/** Words that make a sentence a chlorination context. */
const CHLORINE_CONTEXT = /\b(bleach|chlorine|chlorinat\w*|hypochlorite|disinfect\w*|purification tablets?)\b/i;
/** A dose: a quantity and a unit. "half a teaspoon", "5 drops", "125 mL", "0.5 mg/L". */
const DOSE =
  /\b(?:\d+(?:[.,]\d+)?|one|two|three|four|five|six|ten|half|quarter|a half|¼|½)\s*(?:of\s+a\s+)?(?:drops?|teaspoons?|tsp|tablespoons?|cups?|millilitres?|ml|litres?|grams?|g|mg\/l|ppm)\b/i;

const BOIL = /\bboil\w*\b/i;
const NUMBER = "(?:\\d+(?:[.,]\\d+)?|one|two|three|four|five|six|ten|fifteen|twenty)";
const UNIT = "(?:seconds?|secs?|minutes?|mins?|hours?)";
/**
 * A duration that belongs to the boiling itself — "boil for one minute", "a one minute rolling boil" — and not one
 * that happens to share the sentence. "Leave it to stand for 30 minutes" is a chlorination contact time, and "best
 * used within 24 hours" is storage: neither is a boil time, and neither should be reported as one.
 */
const BOIL_DURATION = new RegExp(
  `\\bboil\\w*\\b[^.;]{0,25}?\\bfor\\s+(?:at least\\s+|about\\s+|around\\s+)?${NUMBER}\\s*${UNIT}\\b` +
    `|\\b${NUMBER}\\s*${UNIT}\\s+(?:of\\s+)?(?:rolling\\s+|vigorous\\s+|hard\\s+)?boil`,
  "i",
);
/** No NZ or AU source publishes an altitude adjustment, so any altitude wording near boiling fails. */
const ALTITUDE = /\b(?:altitude|elevation|above sea level|sea level|high country|metres above)\b/i;

const FILTER_NOUN =
  /\b(filters?|filtered|filtering|filtration|cartridges?|ceramic|carbon block|activated carbon|membranes?|micron|µm|reverse osmosis|\bRO\b|purifiers?|gravity filter)\b/i;
/** A claim about what a filter does — not a device name. "UV sterilisation" in a component list is not a claim. */
const EFFICACY =
  /\b(removes?|removal|removing|kills?|killing|destroys?|eliminat\w+|purifies|disinfects|sterilises|filters out|makes? [^.]{0,24}safe|safe to drink|potable|pathogens?|bacteri\w+|virus(?:es)?|protozoa\w*|giardia|cryptosporidium|crypto\b|micron|µm|\d+\s?%)\b/i;

const UV = /\b(uv|ultraviolet)\b/i;
// Dose units are matched without a trailing word boundary: "mJ/cm2" ends in a digit, not a break.
const UV_CLAIM =
  /(mj\/cm|µw\/cm|uw\/cm|mw\/cm|\d+\s?%)|\b(kills?|eliminat\w+|destroys?|removes?|purifies|disinfects|sterilises|works against|effective against|makes? [^.]{0,24}safe|safe to drink)\b/i;

const TESTING = /\b(test|tests|tested|testing|sample|sampling|laborator\w+|inspect\w*)\b/i;
const INTERVAL =
  /\b(annual(?:ly)?|yearly|monthly|weekly|daily|fortnightly|twice a year|every \d+\s*(?:days?|weeks?|months?|years?)|every (?:six|three|twelve) months)\b/i;

const CONTAMINATION =
  /\b(sewage|septic|floods?|floodwater|flood water|flooded|flooding|chemical\w*|pesticides?|herbicides?|spray drift|agricultural (?:spray|runoff|run-off)|fuel|petrol|diesel|dead animal\w*|carcass\w*|algae|algal|blue.?green|cyanobacteri\w*|saltwater|sea water|salt water|heavy metals?|\blead\b|arsenic|toxins?|contaminated|contamination)\b/i;
const TREATMENT_VERB =
  /\b(boil\w*|filter\w*|treat\w*|chlorinat\w*|disinfect\w*|purif\w*|uv|ultraviolet|safe to drink|drinkable|makes? [^.]{0,24}safe)\b/i;

interface Gate {
  code: string;
  what: string;
  /** does this sentence make a claim this gate governs? */
  triggers(sentence: string): boolean;
}

const GATES: Gate[] = [
  {
    code: "UNSOURCED_BLEACH_RATIO",
    what: "a chlorination dose",
    triggers: (s) => CHLORINE_CONTEXT.test(s) && DOSE.test(s),
  },
  {
    code: "UNSOURCED_BOIL_TIME",
    what: "a boiling time",
    triggers: (s) => BOIL_DURATION.test(s) || (BOIL.test(s) && ALTITUDE.test(s)),
  },
  {
    code: "UNSOURCED_FILTER_CLAIM",
    what: "a filter performance claim",
    triggers: (s) => FILTER_NOUN.test(s) && EFFICACY.test(s),
  },
  {
    code: "UNSOURCED_UV_CLAIM",
    what: "a UV performance claim",
    triggers: (s) => UV.test(s) && UV_CLAIM.test(s),
  },
  {
    code: "UNSOURCED_TESTING_INTERVAL",
    what: "a testing or inspection interval",
    triggers: (s) => TESTING.test(s) && INTERVAL.test(s),
  },
];

const stripTags = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Claims a comparison table makes without ever writing a sentence.
 *
 * A matrix whose header row says "Removes Bacteria" and whose cell says "Yes" is an efficacy claim, but nothing in
 * the prose says so, and a sentence-by-sentence check would pass it. Each body row of such a table is turned back
 * into the claim it makes — "Ceramic Filter — Removes Viruses: Partial" — so the gates see it.
 */
function tableClaims(html: string): string[] {
  const claims: string[] = [];
  for (const table of html.match(/<table[\s\S]*?<\/table>/gi) ?? []) {
    const headers = [...table.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => stripTags(m[1]));
    if (!headers.some((h) => EFFICACY.test(h))) continue;
    for (const row of table.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => stripTags(m[1]));
      if (cells.length < 2) continue;
      const [subject, ...rest] = cells;
      rest.forEach((cell, i) => {
        const header = headers[i + 1];
        if (subject && header && cell) claims.push(`${subject} — ${header}: ${cell}`);
      });
    }
  }
  return claims;
}

/** The text a member sees, as sentences: block elements end a sentence, and so do full stops. */
export function treatmentSentences(html: string): string[] {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<title[\s\S]*?<\/title>/gi, " ")
    .replace(/<(br|\/p|\/div|\/h\d|\/li|\/tr|\/td|\/th|\/table)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&deg;/g, "°")
    .replace(/&sup2;/g, "²");
  return [
    ...text
      .split(/\n+|(?<=[.!?])\s+/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean),
    ...tableClaims(html),
  ];
}

const compiled = new WeakMap<TreatmentClaim, RegExp[]>();
const patternsOf = (claim: TreatmentClaim): RegExp[] => {
  let list = compiled.get(claim);
  if (!list) {
    list = claim.match.map((p) => new RegExp(p, "i"));
    compiled.set(claim, list);
  }
  return list;
};

const claimsFor = (registry: TreatmentRegistry, market: string, gate: string) =>
  registry.claims.filter((c) => c.market === market && c.gates.includes(gate));

/**
 * Treatment claims in this market's file that no approved source supports.
 *
 * Returns one finding per unsupported sentence, in the same shape as the fuel checks: a code, the sentence, and why
 * it was stopped. An empty list means every treatment claim in the file matched an approved entry for this market.
 */
export function treatmentFindings(html: string, market: string, registry: TreatmentRegistry): string[] {
  const sentences = treatmentSentences(html);
  const findings: string[] = [];
  const seen = new Set<string>();
  const add = (code: string, sentence: string, why: string) => {
    const short = sentence.length > 160 ? `${sentence.slice(0, 157)}…` : sentence;
    const finding = `${code} (${market}): "${short}" — ${why}`;
    if (!seen.has(finding)) {
      seen.add(finding);
      findings.push(finding);
    }
  };

  for (const sentence of sentences) {
    // Altitude is not a claim that can be sourced: neither market publishes an elevation adjustment for boiling, so
    // there is nothing for a registry entry to match and the sentence fails whatever else it says.
    if (BOIL.test(sentence) && ALTITUDE.test(sentence)) {
      add(
        "UNSOURCED_BOIL_TIME",
        sentence,
        "an altitude or elevation adjustment for boiling. No New Zealand or Australian source read publishes one, so none may be written.",
      );
    }
    for (const gate of GATES) {
      if (!gate.triggers(sentence)) continue;
      const allowed = claimsFor(registry, market, gate.code).some((claim) =>
        patternsOf(claim).some((p) => p.test(sentence)),
      );
      if (!allowed) {
        add(
          gate.code,
          sentence,
          `${gate.what} with no approved ${market} source. Add a verified entry to config/treatment-sources.json, or remove the claim — a figure approved for the other market does not carry over.`,
        );
      }
    }
  }

  // The contamination gate is about what the document does NOT say: treatment offered for a contaminated source,
  // with no approved statement of where household treatment stops, fails closed.
  const limitationClaims = claimsFor(registry, market, "UNSAFE_CONTAMINATED_SOURCE_GUIDANCE");
  const hasLimitation = limitationClaims.some((claim) => patternsOf(claim).some((p) => sentences.some((s) => p.test(s))));
  if (!hasLimitation) {
    for (const sentence of sentences) {
      if (CONTAMINATION.test(sentence) && TREATMENT_VERB.test(sentence)) {
        add(
          "UNSAFE_CONTAMINATED_SOURCE_GUIDANCE",
          sentence,
          `contaminated-source guidance with no approved ${market} limitation anywhere in the document. Say plainly where household treatment is not enough and where to get official advice.`,
        );
      }
    }
  }

  return findings;
}

/**
 * Whether a line of text is an approved treatment claim for this market.
 *
 * The figure flag ("this number needs a source") exists to stop unsourced numbers reaching a member. A figure that
 * matches an approved registry entry for the file's own market already has its source, recorded with its authority
 * and date, so flagging it again asks the owner to re-approve what they approved. Nothing else is exempted: a figure
 * with no entry, or an entry belonging to the other market, is still flagged.
 */
export function isRegisteredClaim(text: string, market: string, registry: TreatmentRegistry): boolean {
  return registry.claims
    .filter((c) => c.market === market)
    .some((claim) => patternsOf(claim).some((p) => p.test(text)));
}

/** Load the registry from config. Kept here so prep, the CLI and the tests all read the same file. */
export function loadTreatmentRegistry(file: string): TreatmentRegistry {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as TreatmentRegistry;
  return { claims: parsed.claims ?? [], unavailableSources: parsed.unavailableSources ?? [] };
}
