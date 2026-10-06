/**
 * Stage 9.7B — Group-A migration readiness.
 *
 * Analysis only: reads the audit, the legacy source and the re-skin log, and reports what each Group-A
 * resource will need. Nothing is imported, re-skinned or modified here.
 *
 * The point is a migration *order*: do the resources that teach the pipeline something first, and leave the
 * ones with real safety exposure until the safety wording is signed off.
 */
import fs from "node:fs";
import path from "node:path";
import type { ProgrammeAudit } from "./programme";

export type Risk = "LOW" | "MEDIUM" | "HIGH";

export interface GroupAReport {
  legacyCode: string;
  title: string;
  foundation: string | null;
  resourceType: string | null;
  proposedResourceId: string;

  /** safety blocks this resource will need, from the topics it actually teaches */
  safetyExposure: string[];
  /** how much of that is still unverified for the launch markets */
  blockedBy: string[];

  terminology: { frameworkPhrase: number; barePillar: number };
  marketTokens: string[];

  layout: {
    sizeKb: number;
    tables: number;
    formFields: number;
    images: number;
    pageBreaks: number;
    componentClasses: number;
    complexity: Risk;
  };

  risk: Risk;
  reasons: string[];
  order: number;
}

/**
 * Gas, in three parts (Stage 9.57).
 *
 * The old rule was `\bgas\b` three times. It could not tell a wood-burner planner saying "the gas stops flowing"
 * from a document explaining how to service an LPG heater, and it demanded a safety block from the first. These
 * three pieces replace the word count with a reading of what the document actually does.
 *
 * `GAS_SUBJECT` — the things a document must NAME. Deliberately absent: **"gas supply"**. A sentence about mains
 * gas failing in an outage is a narrative premise, not gas teaching, and it is the exact phrase that trapped
 * OG-17. A bare "cylinder", "bottle" or "regulator" is absent for the same reason in reverse: the library is full
 * of water tanks and electrical regulators.
 */
const GAS_APPLIANCE =
  "(?:gas[- ]?(?:heater|heating|cooker|cooktop|hob|stove|oven|fire|fireplace|bottle|cylinder|water heater|hot water|" +
  "barbecue|bbq|lamp|lantern|burner|ring|fridge|refrigerator|appliance|meter|line|leak|fitting)s?|" +
  "(?:un)?flued gas|cabinet heater|patio heater|camping (?:stove|cooker)s?|gas ?fitters?|unflued|dual[- ]fuel)";

/**
 * Fuels. Held to a stricter test than appliances, because a fuel NAME is how every planning document lists its
 * options — OG-B12 writes "generator fuel reserve (diesel/petrol/LPG)" and "Firewood, LPG, or diesel", and OG-15
 * and OG-26 do the same with gas heaters. Naming a fuel among alternatives is not teaching gas, so a fuel only
 * counts when it appears beside gas EQUIPMENT or a gas-specific action.
 */
const GAS_FUEL = "(?:LPG|LP gas|natural gas|mains gas|reticulated gas|biogas|propane|butane)";
const GAS_FUEL_CONTEXT =
  "(?:cylinder|bottle|regulator|hose|valve|fitting|appliance|heater|cook(?:er|top)|refill\\w*|connect\\w*|" +
  "disconnect\\w*|leak\\w*|ventilat\\w*|servic\\w+|install\\w*)";

/** Doing something with it: the verbs that turn a name into an instruction. */
const GAS_ACTION =
  "(?:use|using|operat\\w+|install\\w*|connect\\w*|disconnect\\w*|servic\\w+|inspect\\w*|repair\\w*|ventilat\\w*|" +
  "stor(?:e|ed|ing|age)|plac(?:e|ed|ing|ement)|shut off|turn(?:ing|ed)? off|leak\\w*|test\\w*|replac\\w*|" +
  "maintain\\w*|maintenance|check\\w*|clean\\w*|refill\\w*|transport\\w*|handl\\w*|secure|vent\\w*)";

/**
 * A figure beside the name — what a comparison table does without ever writing a verb.
 *
 * Stage 9.56 identified table-shaped teaching as the likely false negative, and OG-B09 is the live example:
 * "Flued gas | $1,500–$4,000 | Moderate | 80–90% | No (gas supply)". There is no instruction in that row, but
 * naming an appliance beside a price and an efficiency band is comparing it, and comparing is teaching.
 *
 * A bare number is NOT a figure here, on purpose: OG-15's scorecard row ends in a score and OG-26's budget row in
 * empty "$ $ $" placeholders, and neither is a specification.
 */
const GAS_FIGURE =
  "(?:\\$\\s?\\d|\\d+\\s?%|\\d+\\s?(?:kW|MJ|kPa|kg|mm|cm|metres?|litres?)\\b|" +
  "every\\s+(?:\\d+|one|two|three|six|ten|twelve)[\\s-]*(?:year|month|week|day))";

/** Routing a member to a professional is itself gas guidance. */
const GAS_LICENSING = "(?:(?:licensed|certifying|qualified|registered)[^.\\n]{0,20}gas\\s?(?:fitter|worker))";

/**
 * A document teaches gas when it names a gas subject AND does something with it — acts on it, or puts a figure
 * beside it — or when it tells the member who may legally touch it. Proximity in either direction, because
 * "service your gas heater" and "the gas heater should be serviced" are the same instruction.
 *
 * **Proximity stays inside one sentence or line** (`[^.\n]`, never `[\s\S]`). The audit reads text extracted from
 * PDFs, where a table flattens into long runs and unrelated rows end up adjacent; an unbounded window made a
 * checklist's "Replace…" on one row teach the "gas heater" on the next. A line is the honest unit here.
 */
const GAS_SUBJECT = `(?:${GAS_APPLIANCE}|${GAS_FUEL})`;
/**
 * Every part is word-anchored. Without it, `plac(e|ing)` matched inside **fire**place**, so a checklist row
 * reading "Fireplace, wood burner, gas heater" looked like an instruction about a gas heater — in OG-15, which is
 * live. The mention count happened to save it; a word boundary is the thing that should.
 */
const w = (s: string) => `\\b${s}\\b`;
const GAS_TEACHING = new RegExp(
  [
    `${w(GAS_APPLIANCE)}[^.\\n]{0,80}?${w(GAS_ACTION)}`,
    `${w(GAS_ACTION)}[^.\\n]{0,80}?${w(GAS_APPLIANCE)}`,
    `${w(GAS_APPLIANCE)}[^.\\n]{0,60}?${GAS_FIGURE}`,
    `${GAS_FIGURE}[^.\\n]{0,60}?${w(GAS_APPLIANCE)}`,
    `${w(GAS_FUEL)}[^.\\n]{0,60}?${w(GAS_FUEL_CONTEXT)}`,
    `${w(GAS_FUEL_CONTEXT)}[^.\\n]{0,60}?${w(GAS_FUEL)}`,
    GAS_LICENSING,
  ].join("|"),
  "i",
);

/**
 * Leak-response teaching (Stage 9.62A). "If you smell gas, turn off the gas at the meter and leave the building" names
 * no appliance, so GAS_TEACHING never saw it: the most natural leak instruction was invisible to the detector built to
 * catch it. A leak phrase beside a leak-response ACTION (turn off, leave, ventilate, call, flames, switches…) is teaching,
 * in either order and inside one sentence or line. A heading that merely names the topic still is not.
 */
const GAS_LEAK_PHRASE = "(?:smell(?:s|ed|ing)? (?:of )?(?:gas|LPG)|gas leaks?|leaking (?:gas|LPG)|suspected (?:gas )?leak)";
const GAS_LEAK_ACTION =
  "(?:turn(?:ing)? off|shut off|evacuat\\w+|leave|exit|open (?:the )?(?:doors?|windows?)|ventilat\\w+|call|ring|phone|contact|report|" +
  "switch\\w*|flames?|ignit\\w+|sparks?|smok\\w+|meter|isolat\\w+|avoid|do not|don't|never|outside)";
const GAS_LEAK_TEACHING = new RegExp(
  `\\b${GAS_LEAK_PHRASE}\\b[^.\\n]{0,100}?\\b${GAS_LEAK_ACTION}\\b|\\b${GAS_LEAK_ACTION}\\b[^.\\n]{0,100}?\\b${GAS_LEAK_PHRASE}\\b|${GAS_TEACHING.source}`,
  "i",
);
/**
 * Topics that pull in a safety block, and the block each one needs.
 *
 * `needs` is how many mentions count as teaching the topic. `teaching` is an extra condition for topics where the
 * words alone are not enough: a budget line listing "water filter" is not treatment teaching, while a document that
 * compares what methods remove, or gives a dose, a boil time or a rating, is. Without that second condition the
 * water-treatment block would be demanded of every resource that mentions filtration in a shopping list.
 */
const SAFETY_TOPICS: { pattern: RegExp; block: string; needs: number; teaching?: RegExp }[] = [
  { pattern: /\bgenerator/gi, block: "generator-safety", needs: 3 },
  { pattern: /\b(solid fuel|wood burner|chimney|flue)/gi, block: "solid-fuel-heating", needs: 3 },
  {
    // Fuels, appliances and fittings as well as the bare word, so a document that teaches entirely in compounds
    // ("refill the LPG cylinder, check the regulator") reaches the threshold. Stage 9.57.
    pattern: new RegExp(`\\b(?:gas|${GAS_SUBJECT})\\b`, "gi"),
    block: "gas-and-lpg",
    needs: 3,
    // The word alone is not enough. OG-17 is a solid-fuel planner that says "the gas stops flowing" and "Gas
    // supplies can be disrupted" — mains gas as an example of something that fails in an outage. Four bare
    // mentions used to demand a gas safety block from a document that names no appliance and gives no
    // instruction. See GAS_TEACHING for what does count.
    teaching: GAS_TEACHING,
  },
  // The four specialised gas blocks (Stage 9.62). Each is a narrow subject that a document can teach on its own, so
  // each needs only ONE mention — but every one still sits behind GAS_TEACHING, so none of them can be reached by a
  // bare word, a narrative supply reference or a fuel listed among options. `gas supply` is in none of them.
  {
    // Unflued, cabinet, patio and portable LPG heaters. A FLUED heater is deliberately not here: the block is about
    // what an unflued heater does to the room, and OG-B09's "Flued gas" row must not demand it.
    pattern: /\b(?:unflued|cabinet heaters?|patio heaters?|portable (?:gas|LPG) heaters?|LPG heaters?)\b/gi,
    block: "unflued-gas-heating",
    needs: 1,
    teaching: GAS_TEACHING,
  },
  {
    pattern: /\b(?:(?:LPG|LP gas|gas|propane|butane) (?:cylinders?|bottles?)|cylinders? of (?:LPG|gas)|LCC27|POL valves?|butane cartridges?|camping (?:stoves?|cookers?))\b/gi,
    block: "gas-cylinder-safety",
    needs: 1,
    teaching: GAS_TEACHING,
  },
  {
    pattern: /\b(?:gas leaks?|(?:smell|smells|smelling) (?:of )?(?:gas|LPG)|leaking (?:gas|LPG)|suspected (?:gas )?leak)\b/gi,
    block: "gas-leak-response",
    needs: 1,
    teaching: GAS_LEAK_TEACHING,
  },
  {
    pattern:
      /\b(?:gas ?fitters?|licensed gas workers?|certifying gasfitters?|gas fitting|(?:servic\w+|install\w*)[^.\n]{0,40}\bgas (?:heaters?|cookers?|cooktops?|appliances?|water heaters?))\b/gi,
    block: "gas-installation-and-servicing",
    needs: 1,
    teaching: GAS_TEACHING,
  },
  { pattern: /\b(batter(y|ies)|inverter|solar)\b/gi, block: "batteries-and-electrical", needs: 3 },
  { pattern: /\b(water storage|water tank|rainwater|drinking water)\b/gi, block: "stored-drinking-water", needs: 3 },
  { pattern: /\b(fridge|freezer|pantry|perishable)\b/gi, block: "food-safety-power-cut", needs: 3 },
  // "bushfire" and "wildfire" carry no word boundary before "fire", so they were invisible to the plain \bfire
  // pattern. A resource that recommends a tank for bushfire zones is making a fire-safety claim (Stage 9.46).
  { pattern: /\b(fire|smoke alarm|evacuat)|bushfire|wildfire/gi, block: "fire-and-emergency", needs: 3 },
  {
    pattern:
      /\b(water filters?|filtration|purif(?:y|ier|iers|ication)|disinfect\w*|chlorinat\w*|bleach|boil(?:ing|ed)? (?:the |your )?water|treat(?:ing|ed|ment)s? (?:the |your )?water|ultraviolet|UV (?:steril\w*|purif\w*|treatment|lamp|light))\b/gi,
    block: "water-treatment",
    needs: 3,
    // It teaches treatment, rather than naming it: an efficacy claim, a dose, a boil time, a rating, or a
    // method-versus-method comparison.
    teaching:
      /\b(removes?\s+(?:bacteria|viruses|virus|chemicals|sediment|protozoa)|kills?\s+(?:bacteria|viruses|germs)|drops? per litre|drops of (?:household )?bleach|per litre of water|boil(?:ing)? (?:the |your )?water for|rolling boil|micron|µm|mg\/L|comparison matrix|which (?:filter|method|treatment)|right (?:filter|method) for)\b/i,
  },
];

/** Market fields a resource will need resolved, inferred from what it talks about. */
const MARKET_TOKENS: { pattern: RegExp; token: string }[] = [
  { pattern: /\b(emergency|evacuat|72.?hour|civil defence|ses)\b/i, token: "emergency.number" },
  { pattern: /\b(litres?|gallons?|water storage|drinking water)\b/i, token: "figure.waterPerPersonPerDay" },
  { pattern: /\b(fridge|freezer|perishable|pantry)\b/i, token: "figure.fridgeWithoutPower" },
  { pattern: /\bgas\b/i, token: "term.gasfitter" },
  { pattern: /\b(electric|wiring|inverter|switchboard)\b/i, token: "term.electrician" },
  { pattern: /\b(eeca|healthy homes|insulation|r-?value)\b/i, token: "agency.energy" },
  { pattern: /\b(generator)\b/i, token: "figure.generatorDistance" },
];

/**
 * Market fields still unverified for the launch markets. A resource needing one of these cannot be published
 * in that market, so it is sequenced last (owner ruling: the US generator distance must not be borrowed).
 */
const UNVERIFIED_FIELDS = new Set(["figure.generatorDistance"]);

/**
 * The safety blocks a resource's topics require. Exported so any resource can be checked, not only Group A:
 * computing this only inside the Group-A analysis meant a Group-B resource reached prep with no required blocks
 * at all — a gate that silently passes.
 */
export function safetyExposureFor(text: string): string[] {
  return SAFETY_TOPICS.filter(
    (t) => (text.match(t.pattern) ?? []).length >= t.needs && (!t.teaching || t.teaching.test(text)),
  ).map((t) => t.block);
}

/**
 * Signals that a document *teaches* water treatment rather than naming it: an efficacy claim, a dose, a boil time, a
 * rating, or a method-versus-method comparison. Exported so an exemption from the treatment block can be held to the
 * same test the detector uses — a resource that starts teaching treatment loses the exemption automatically.
 */
/**
 * Signals that a document *teaches* gas or LPG rather than mentioning it (Stage 9.57).
 *
 * Exported for the same reason `treatmentTeachingSignals` is: any future exemption from the gas block can be held
 * to the test the detector itself uses, so a resource that starts instructing loses the exemption automatically
 * rather than by someone noticing.
 */
export function fuelTeachingSignals(text: string): string[] {
  const all = new RegExp(GAS_TEACHING.source, "gi");
  return [...new Set((text.match(all) ?? []).map((s) => s.replace(/\s+/g, " ").trim().toLowerCase()))];
}

export function treatmentTeachingSignals(text: string): string[] {
  const topic = SAFETY_TOPICS.find((t) => t.block === "water-treatment");
  if (!topic?.teaching) return [];
  const all = new RegExp(topic.teaching.source, `${topic.teaching.flags.replace("g", "")}g`);
  return [...new Set((text.match(all) ?? []).map((s) => s.toLowerCase()))];
}

/**
 * Signals that a document *teaches* fire safety rather than listing fire as a hazard (Stage 9.47).
 *
 * A risk identifier that offers "Fire in the home" and "Bushfire risk area" as things to tick is naming hazards. One
 * that says "install smoke alarms" or "plan two exits" is giving fire instructions, and no fire guidance is approved
 * for either market — so an exemption from the fire block has to lapse on wording like this, including wording that
 * never uses the word "fire".
 */
export function fireTeachingSignals(text: string, context = text): string[] {
  // Unambiguous: these are fire instructions whatever else the document says.
  const always =
    /\b(extinguishers?|fire blankets?|fire suppression|sprinklers?|defensible space|smoke alarms?|fire drills?|fire plans?|fire response|fire safety|firebreaks?|prepare for (?:bush|wild)?fires?|(?:bush|wild)fire (?:preparation|plan|planning|season|ready))\b/gi;
  // Ambiguous on their own. "Not blocking escape routes or access for emergency services" is an access instruction
  // about where a tank goes; the same words in a document that talks about fire are fire-escape teaching. So these
  // count only when the document has fire wording somewhere.
  const inFireContext = /\b(escape plans?|escape routes?|two exits|egress|shelter in place|sheltering|embers?|evacuation (?:plan|route)s?)\b/gi;
  const hasFireContext = /\b(fire|smoke|evacuat)\w*|bushfire|wildfire/i.test(context);
  const found = [...(text.match(always) ?? [])];
  if (hasFireContext) found.push(...(text.match(inFireContext) ?? []));
  return [...new Set(found.map((s) => s.toLowerCase()))];
}

/** Every mention of the topic that pulls in `block` (none if the block has no topic). */
export function safetyTopicMentions(text: string, block: string): string[] {
  const topic = SAFETY_TOPICS.find((t) => t.block === block);
  return topic ? (text.match(new RegExp(topic.pattern.source, topic.pattern.flags)) ?? []) : [];
}

function complexityOf(layout: Omit<GroupAReport["layout"], "complexity">): Risk {
  const score =
    layout.tables * 2 + layout.formFields * 0.2 + layout.componentClasses * 0.5 + layout.pageBreaks + layout.sizeKb / 10;
  if (score >= 22) return "HIGH";
  if (score >= 12) return "MEDIUM";
  return "LOW";
}

export function analyseGroupA(audit: ProgrammeAudit, texts: Record<string, string>): GroupAReport[] {
  const items = audit.items.filter((i) => i.reskinGroup === "A");
  const reports: GroupAReport[] = [];

  for (const item of items) {
    const html = item.html ? safeRead(path.join(item.html.folder, item.html.filename)) : "";
    const text = [item.pdf, item.html].map((f) => (f ? texts[f.candidateId] ?? "" : "")).join("\n");

    // --- safety exposure -------------------------------------------------------------------------------
    const safetyExposure = safetyExposureFor(text);

    // --- terminology -----------------------------------------------------------------------------------
    const frameworkPhrase = (html.match(/\b(5|five)\s+pillars?\b/gi) ?? []).length;
    const barePillar = (html.match(/\bpillars?\b/gi) ?? []).length - frameworkPhrase - (html.match(/cover-pillar/g) ?? []).length;

    // --- market tokens ---------------------------------------------------------------------------------
    const marketTokens = MARKET_TOKENS.filter((m) => m.pattern.test(text)).map((m) => m.token);

    // --- layout ----------------------------------------------------------------------------------------
    const base = {
      sizeKb: Math.round((item.html?.sizeBytes ?? 0) / 1024),
      tables: (html.match(/<table/gi) ?? []).length,
      formFields: (html.match(/<input|<textarea|<select/gi) ?? []).length,
      images: (html.match(/<img/gi) ?? []).length,
      pageBreaks: (html.match(/page-break-|break-after|break-before/gi) ?? []).length,
      componentClasses: new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/))).size,
    };
    const layout = { ...base, complexity: complexityOf(base) };

    // --- risk ------------------------------------------------------------------------------------------
    const reasons: string[] = [];
    const blockedBy = marketTokens.filter((t) => UNVERIFIED_FIELDS.has(t));
    let risk: Risk = "LOW";

    if (blockedBy.length) {
      risk = "HIGH";
      reasons.push(`needs ${blockedBy.join(", ")}, still unverified for NZ and AU`);
    }
    if (safetyExposure.length >= 3) {
      risk = risk === "HIGH" ? "HIGH" : "MEDIUM";
      reasons.push(`teaches ${safetyExposure.length} topics that need safety blocks`);
    } else if (safetyExposure.length) {
      reasons.push(`needs ${safetyExposure.length} safety block(s)`);
    }
    if (layout.complexity === "HIGH") {
      risk = risk === "HIGH" ? "HIGH" : "MEDIUM";
      reasons.push(`complex layout (${layout.tables} tables, ${layout.formFields} fields)`);
    }
    if (!item.resourceType.value) {
      risk = risk === "LOW" ? "MEDIUM" : risk;
      reasons.push("resource type still unresolved: owner decision needed before import");
    }
    if (barePillar > 0) reasons.push(`${barePillar} bare "pillar" use(s) need reading in context`);
    if (!reasons.length) reasons.push("presentation only: no safety exposure, no unresolved fields");

    reports.push({
      legacyCode: item.legacyCode,
      title: item.title,
      foundation: item.foundation.value,
      resourceType: item.resourceType.value,
      proposedResourceId: item.proposedResourceId,
      safetyExposure,
      blockedBy,
      terminology: { frameworkPhrase, barePillar },
      marketTokens,
      layout,
      risk,
      reasons,
      order: 0,
    });
  }

  return order(reports);
}

/**
 * Migration order: safest and simplest first.
 *
 * The pilot has already proven the pipeline on OG-02. The rest should follow in increasing difficulty, so that
 * anything that breaks does so on a resource where the cause is obvious — and so nothing blocked on unverified
 * safety figures is attempted before those figures exist.
 */
function order(reports: GroupAReport[]): GroupAReport[] {
  const weight = (r: GroupAReport) =>
    (r.blockedBy.length ? 1000 : 0) +
    ({ LOW: 0, MEDIUM: 100, HIGH: 200 }[r.risk] ?? 0) +
    r.safetyExposure.length * 10 +
    ({ LOW: 0, MEDIUM: 5, HIGH: 15 }[r.layout.complexity] ?? 0) +
    (r.resourceType ? 0 : 8);

  const sorted = [...reports].sort((a, b) => weight(a) - weight(b) || a.legacyCode.localeCompare(b.legacyCode));
  // OG-02 is already done: it leads the order as the proven reference.
  const pilotFirst = [...sorted.filter((r) => r.legacyCode === "OG-02"), ...sorted.filter((r) => r.legacyCode !== "OG-02")];
  return pilotFirst.map((r, i) => ({ ...r, order: i + 1 }));
}

function safeRead(file: string): string {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}
