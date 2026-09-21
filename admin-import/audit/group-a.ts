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
import type { ProgrammeAudit, ProgrammeItem } from "./programme";

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

/** Topics that pull in a safety block, and the block each one needs. */
const SAFETY_TOPICS: { pattern: RegExp; block: string; needs: number }[] = [
  { pattern: /\bgenerator/gi, block: "generator-safety", needs: 3 },
  { pattern: /\b(solid fuel|wood burner|chimney|flue)/gi, block: "solid-fuel-heating", needs: 3 },
  { pattern: /\bgas\b/gi, block: "gas-and-lpg", needs: 3 },
  { pattern: /\b(batter(y|ies)|inverter|solar)\b/gi, block: "batteries-and-electrical", needs: 3 },
  { pattern: /\b(water storage|water tank|rainwater|drinking water)\b/gi, block: "stored-drinking-water", needs: 3 },
  { pattern: /\b(fridge|freezer|pantry|perishable)\b/gi, block: "food-safety-power-cut", needs: 3 },
  { pattern: /\b(fire|smoke alarm|evacuat)/gi, block: "fire-and-emergency", needs: 3 },
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

/** Blocks whose wording is not yet signed off, and fields still unverified for the launch markets. */
const UNAPPROVED_BLOCKS = new Set<string>(); // all blocks are drafted; approval is the owner's, tracked below
const UNVERIFIED_FIELDS = new Set(["figure.generatorDistance"]);

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
    const safetyExposure: string[] = [];
    for (const t of SAFETY_TOPICS) {
      if ((text.match(t.pattern) ?? []).length >= t.needs) safetyExposure.push(t.block);
    }

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
