/**
 * Stage 9.5 — 30-Day Programme audit.
 *
 * AUDIT ONLY. This module reads the scan workspace and produces findings. It imports nothing, changes nothing,
 * re-skins nothing and writes only into `workspace/reports/`.
 *
 * It is written as code rather than prose so the whole audit can be re-run after any change to the source
 * material, and so every number in the report can be traced to a rule rather than to someone's reading.
 */
import type { Candidate, DuplicateGroup } from "../types";

export type ReskinGroup = "A" | "B" | "C" | "none";
export type Readiness =
  | "READY_AFTER_RESKIN"
  | "READY_AFTER_METADATA"
  | "NEEDS_CONTENT_REVIEW"
  | "NEEDS_OWNER_DECISION"
  | "ARCHIVE_CANDIDATE";

export interface TerminologyFinding {
  term: string;
  hits: number;
  files: number;
  proposal: string;
  /** false when a person must judge each instance rather than accept a global replacement */
  safeToReplace: boolean;
  why: string;
}

export interface ProgrammeItem {
  legacyCode: string;
  kind: "core" | "bonus";
  day: number | null;
  title: string;
  proposedResourceId: string;
  proposedSlug: string;

  pdf: FileFacts | null;
  html: FileFacts | null;
  pairStatus: "pair" | "pdf only" | "html only" | "none";
  contentMismatch: boolean;
  textSimilarity: number | null;
  duplicateGroup: string | null;

  foundation: { value: string | null; confidence: string; evidence: string[] };
  resourceType: { value: string | null; confidence: string; evidence: string[] };
  tags: string[];

  legacyIssues: { issue: string; evidence: string }[];
  legacyTerminology: string[];
  marketSpecific: string[];
  safetyNotes: string[];

  reskinGroup: ReskinGroup;
  readiness: Readiness;
  reasons: string[];
}

export interface FileFacts {
  candidateId: string;
  filename: string;
  folder: string;
  sourceLabel: string;
  sizeBytes: number;
  modified: string;
  checksum: string;
  textLength: number;
}

export interface ProgrammeAudit {
  generatedAt: string;
  totals: {
    programmeFiles: number;
    core: number;
    bonus: number;
    pairs: number;
    pdfOnly: number;
    htmlOnly: number;
    contentMismatches: number;
    supportFiles: number;
    internalFiles: number;
    visualAssets: number;
  };
  items: ProgrammeItem[];
  support: FileFacts[];
  internal: FileFacts[];
  assets: FileFacts[];
  duplicateGroups: {
    groupId: string;
    kind: string;
    autoResolved: boolean;
    members: string[];
    reason: string;
    recommendation: "KEEP" | "ARCHIVE" | "REVIEW";
    why: string;
  }[];
  terminology: TerminologyFinding[];
  legacyTotals: Record<string, number>;
  reskin: Record<ReskinGroup, string[]>;
  readiness: Record<Readiness, string[]>;
  dayGaps: number[];
  /** content gaps found while auditing: things absent that ought to be present */
  contentGaps: { gap: string; detail: string; affects: string[] }[];
}

const facts = (c: Candidate): FileFacts => ({
  candidateId: c.candidateId,
  filename: c.source.filename,
  folder: c.source.folder,
  sourceLabel: c.source.sourceLabel,
  sizeBytes: c.source.sizeBytes,
  modified: c.source.modified,
  checksum: c.source.checksum,
  textLength: c.textLength,
});

/**
 * Proposed library ids. OG-xx is kept as `legacyCode`, never as the id: the library's own format is
 * `res-0000`, and tying permanent ids to the programme's numbering would make them impossible to renumber.
 *
 * Core days take res-1001…res-1030 and bonus resources res-1501…res-1515, so the ranges stay readable and
 * leave room between them.
 */
export function proposedResourceId(code: string): string {
  const bonus = /^OG-B/i.test(code);
  const n = Number(code.replace(/^OG-B?/i, ""));
  return `res-${bonus ? 1500 + n : 1000 + n}`;
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** The day a resource belongs to: the document says so, or the core numbering does. */
function dayFor(code: string, kind: "core" | "bonus", text: string): number | null {
  const stated = text.match(/Asset\s+OG-B?\d+\s*\|\s*Day\s+(\d{1,2})\b/i);
  if (stated) return Number(stated[1]);
  if (kind === "core") return Number(code.replace(/^OG-/, ""));
  return null;
}

/**
 * Terminology that must not be swapped automatically.
 *
 * "Pillar" is the obvious one — in shelter and structural content it can mean an actual pillar holding up an
 * actual building, and turning that into "foundation" would be nonsense. Country-specific references are the
 * other: the library serves NZ, AU, US and CA, so an NZ agency or emergency number is not a terminology
 * problem to be fixed but a market variant to be written.
 */
const STRUCTURAL_CONTEXT = /\b(pile|bearer|joist|post|foundation wall|subfloor|structural|load bearing|veranda|deck)\b/i;

const MARKET_TERMS: { pattern: RegExp; label: string; note: string }[] = [
  { pattern: /\bEECA\b/g, label: "EECA", note: "New Zealand government agency: needs an equivalent for AU, US and CA, not a global rename" },
  { pattern: /\bHealthy Homes?\b/gi, label: "Healthy Homes", note: "New Zealand rental standard: meaningless in other markets" },
  { pattern: /\b(MBIE|WINZ|ACC|Kāinga Ora|Energywise)\b/g, label: "NZ agencies", note: "New Zealand bodies: need per-market equivalents" },
  // Emergency numbers only count when the text is actually talking about ringing one. Matching the bare digits
  // turns every "1,000 litres" and "$2,000" into a false alarm — and an inflated count here would send someone
  // looking for a safety problem that is not there.
  { pattern: /\b(call|dial|phone|ring|emergency services?)\b[^.]{0,40}\b(111|999|911|000)\b/gi, label: "emergency number in context", note: "NZ dials 111, AU 000, US and CA 911. Getting this wrong in a resilience guide is dangerous, not merely inaccurate: it needs a per-market variant" },
  { pattern: /\bcivil defence\b/gi, label: "Civil Defence", note: "New Zealand term: AU says SES, the US and Canada say emergency management" },
  { pattern: /\bR-?value|\bR\d\.\d\b/gi, label: "R-values", note: "insulation ratings differ by market and climate zone" },
  { pattern: /\b(litres?|litre)\b/gi, label: "litres", note: "US uses gallons: unit conversion needed for that market" },
];

/**
 * Safety topics, and the warning each one needs.
 *
 * A document only counts as *covering* a topic when it returns to it — a scorecard with the single word
 * "generator" in a checklist line is not teaching anyone to run one. Without that threshold the audit reports
 * a safety gap in nearly every file, which would bury the handful that genuinely teach a risky task.
 */
const SAFETY_MENTIONS_REQUIRED = 3;

const SAFETY_TOPICS: { pattern: RegExp; label: string; needs: string }[] = [
  { pattern: /\bgenerator/gi, label: "generators", needs: "carbon monoxide and outdoor-use warning" },
  { pattern: /\b(solid fuel|wood burner|chimney|flue)/gi, label: "solid fuel heating", needs: "flue maintenance and clearance warning" },
  { pattern: /\bgas\b/gi, label: "gas appliances", needs: "ventilation and certified-installer warning" },
  { pattern: /\b(batter(y|ies)|inverter)\b/gi, label: "batteries and inverters", needs: "licensed electrician warning for fixed wiring" },
  { pattern: /\b(water storage|water tank|rainwater)\b/gi, label: "stored drinking water", needs: "potability and treatment warning" },
];

export function auditProgramme(
  candidates: Candidate[],
  texts: Record<string, string>,
  groups: DuplicateGroup[],
): ProgrammeAudit {
  const programme = candidates.filter((c) => c.source.sourceLabel === "30-Day Programme");
  const coded = programme.filter((c) => c.inferred.legacyCode.value);
  const byCode = new Map<string, Candidate[]>();
  for (const c of coded) {
    const code = c.inferred.legacyCode.value!;
    byCode.set(code, [...(byCode.get(code) ?? []), c]);
  }

  const items: ProgrammeItem[] = [];
  for (const [code, files] of [...byCode.entries()].sort(compareCodes)) {
    const pdf = files.find((f) => f.source.fileType === "pdf") ?? null;
    const html = files.find((f) => f.source.fileType === "html") ?? null;
    // The PDF is the member-facing artefact, so it is the one that decides the metadata (decision D9-10).
    const lead = pdf ?? html ?? files[0];
    const text = [pdf, html].map((f) => (f ? texts[f.candidateId] ?? "" : "")).join("\n");
    const kind: "core" | "bonus" = /^OG-B/i.test(code) ? "bonus" : "core";
    const title = lead.inferred.title.value ?? lead.source.filename;

    const group = groups.find((g) => g.members.includes(lead.candidateId));
    const pairStatus = pdf && html ? "pair" : pdf ? "pdf only" : html ? "html only" : "none";

    // --- legacy branding and terminology -----------------------------------------------------------------
    const legacyIssues = [...(pdf?.legacyIssues ?? []), ...(html?.legacyIssues ?? [])];
    const seen = new Set<string>();
    const uniqueLegacy = legacyIssues.filter((i) => (seen.has(i.issue) ? false : (seen.add(i.issue), true)));

    const legacyTerminology: string[] = [];
    const pillars = (text.match(/\b(5|five)\s+pillars?\b/gi) ?? []).length;
    const barePillar = (text.match(/\bpillars?\b/gi) ?? []).length - pillars;
    if (pillars) legacyTerminology.push(`"5 Pillars" ×${pillars} → Five Foundations`);
    if (barePillar > 0) {
      legacyTerminology.push(
        STRUCTURAL_CONTEXT.test(text)
          ? `"pillar" ×${barePillar} → check each: this document also discusses building structure`
          : `"pillar" ×${barePillar} → foundation`,
      );
    }

    const marketSpecific: string[] = [];
    for (const m of MARKET_TERMS) {
      const hits = (text.match(m.pattern) ?? []).length;
      if (hits) marketSpecific.push(`${m.label} ×${hits} — ${m.note}`);
    }

    const safetyNotes: string[] = [];
    const mentionsCO = /\bcarbon monoxide\b/i.test(text);
    for (const s of SAFETY_TOPICS) {
      const mentions = (text.match(s.pattern) ?? []).length;
      if (mentions < SAFETY_MENTIONS_REQUIRED) continue;
      const hasWarning = s.label === "generators" ? mentionsCO : /\b(warning|caution|never|do not|must not|licensed|certified|qualified)\b/i.test(text);
      if (!hasWarning) safetyNotes.push(`covers ${s.label} (${mentions} mentions) with no ${s.needs}`);
    }

    // --- re-skin group ------------------------------------------------------------------------------------
    let reskinGroup: ReskinGroup = "none";
    const reasons: string[] = [];
    if (pairStatus !== "pair") {
      reskinGroup = "C";
      reasons.push(pairStatus === "pdf only" ? "no HTML source to re-skin from: the PDF would have to be rebuilt" : "no PDF: the member-facing artefact does not exist yet");
    } else if (lead.contentMismatch) {
      reskinGroup = "C";
      reasons.push("the PDF and HTML do not say the same thing: which is correct is an owner decision");
    } else if (legacyTerminology.length || safetyNotes.length || marketSpecific.length) {
      reskinGroup = "B";
      if (legacyTerminology.length) reasons.push("legacy framework wording in the copy");
      if (safetyNotes.length) reasons.push("safety wording needs writing");
      if (marketSpecific.length) reasons.push("market-specific content needs variants");
    } else if (uniqueLegacy.length) {
      reskinGroup = "A";
      reasons.push("legacy colours, typography or logo only");
    }

    // --- import readiness ---------------------------------------------------------------------------------
    let readiness: Readiness;
    if (lead.contentMismatch || pairStatus === "html only") {
      readiness = "NEEDS_OWNER_DECISION";
    } else if (reskinGroup === "C" || reskinGroup === "B") {
      readiness = "NEEDS_CONTENT_REVIEW";
    } else if (reskinGroup === "A") {
      readiness = "READY_AFTER_RESKIN";
    } else {
      readiness = "READY_AFTER_METADATA";
    }
    if (!lead.inferred.resourceType.value || !lead.inferred.foundation.value) {
      readiness = readiness === "READY_AFTER_METADATA" ? "READY_AFTER_METADATA" : readiness;
      reasons.push("type or foundation still unresolved: must be set during review");
    }

    items.push({
      legacyCode: code,
      kind,
      day: dayFor(code, kind, text),
      title,
      proposedResourceId: proposedResourceId(code),
      proposedSlug: slugify(title),
      pdf: pdf ? facts(pdf) : null,
      html: html ? facts(html) : null,
      pairStatus,
      contentMismatch: lead.contentMismatch,
      textSimilarity: group?.textSimilarity ?? null,
      duplicateGroup: lead.duplicateGroup,
      foundation: { value: lead.inferred.foundation.value, confidence: lead.inferred.foundation.confidence, evidence: lead.inferred.foundation.evidence },
      resourceType: { value: lead.inferred.resourceType.value, confidence: lead.inferred.resourceType.confidence, evidence: lead.inferred.resourceType.evidence },
      tags: lead.inferred.tags,
      legacyIssues: uniqueLegacy,
      legacyTerminology,
      marketSpecific,
      safetyNotes,
      reskinGroup,
      readiness,
      reasons,
    });
  }

  // --- everything in the programme folders that is not a coded resource -----------------------------------
  const uncoded = programme.filter((c) => !c.inferred.legacyCode.value);
  const assets = uncoded.filter((c) => c.materialKind === "asset").map(facts);
  const internal = uncoded.filter((c) => c.materialKind === "internal").map(facts);
  const support = uncoded.filter((c) => c.materialKind === "resource" || c.materialKind === "package").map(facts);

  // --- duplicate groups within the programme ---------------------------------------------------------------
  const programmeIds = new Set(programme.map((c) => c.candidateId));
  const duplicateGroups = groups
    .filter((g) => g.members.some((m) => programmeIds.has(m)))
    .map((g) => {
      const members = g.members.map((m) => {
        const c = candidates.find((x) => x.candidateId === m)!;
        return `${c.source.filename} (${c.source.fileType}, ${Math.round(c.source.sizeBytes / 1024)} KB)`;
      });
      let recommendation: "KEEP" | "ARCHIVE" | "REVIEW" = "REVIEW";
      let why = "two versions of the same material: a person decides";
      if (g.autoResolved) {
        recommendation = "KEEP";
        why = "clean PDF/HTML pair: keep both, PDF for members and HTML to re-skin from (owner ruling 5)";
      } else if (g.kind === "EXACT") {
        recommendation = "ARCHIVE";
        why = "byte-identical copies: keep one, archive the rest — nothing is deleted";
      } else if (g.contentMismatch) {
        recommendation = "REVIEW";
        why = "the two versions disagree: CONTENT_MISMATCH";
      }
      return { groupId: g.groupId, kind: g.kind, autoResolved: Boolean(g.autoResolved), members, reason: g.reason, recommendation, why };
    });

  // --- terminology, across the whole programme --------------------------------------------------------------
  const allText = items.map((i) => [i.pdf, i.html].map((f) => (f ? texts[f.candidateId] ?? "" : "")).join("\n"));
  const countAcross = (pattern: RegExp) => {
    let hits = 0;
    let files = 0;
    for (const t of allText) {
      const n = (t.match(pattern) ?? []).length;
      if (n) {
        files++;
        hits += n;
      }
    }
    return { hits, files };
  };

  const pillarsPhrase = countAcross(/\b(5|five)\s+pillars?\b/gi);
  const pillarWord = countAcross(/\bpillars?\b/gi);
  const structural = allText.filter((t) => /\bpillars?\b/i.test(t) && STRUCTURAL_CONTEXT.test(t)).length;

  const terminology: TerminologyFinding[] = [
    {
      term: '"5 Pillars" / "Five Pillars"',
      hits: pillarsPhrase.hits,
      files: pillarsPhrase.files,
      proposal: '"Five Foundations"',
      safeToReplace: true,
      why: "names the framework directly: always the old name for the current model",
    },
    {
      term: '"pillar" / "pillars" on its own',
      hits: pillarWord.hits - pillarsPhrase.hits,
      files: pillarWord.files,
      proposal: '"foundation" / "foundations"',
      safeToReplace: false,
      why: `${structural} of these documents also discuss building structure, where a pillar is a real pillar. Each instance needs reading`,
    },
  ];
  for (const m of MARKET_TERMS) {
    const { hits, files } = countAcross(m.pattern);
    if (!hits) continue;
    terminology.push({
      term: m.label,
      hits,
      files,
      proposal: "per-market variants (NZ / AU / US / CA)",
      safeToReplace: false,
      why: m.note,
    });
  }

  const legacyTotals: Record<string, number> = {};
  for (const item of items) {
    for (const issue of item.legacyIssues) legacyTotals[issue.issue] = (legacyTotals[issue.issue] ?? 0) + 1;
  }

  const reskin: Record<ReskinGroup, string[]> = { A: [], B: [], C: [], none: [] };
  const readiness: Record<Readiness, string[]> = {
    READY_AFTER_RESKIN: [],
    READY_AFTER_METADATA: [],
    NEEDS_CONTENT_REVIEW: [],
    NEEDS_OWNER_DECISION: [],
    ARCHIVE_CANDIDATE: [],
  };
  for (const i of items) {
    reskin[i.reskinGroup].push(i.legacyCode);
    readiness[i.readiness].push(i.legacyCode);
  }

  const coreDays = new Set(items.filter((i) => i.kind === "core" && i.day).map((i) => i.day!));
  const dayGaps: number[] = [];
  for (let d = 1; d <= 30; d++) if (!coreDays.has(d)) dayGaps.push(d);

  // --- content gaps: things that ought to be there and are not --------------------------------------------
  const contentGaps: ProgrammeAudit["contentGaps"] = [];
  const emergencyGuidance = allText.filter((t) => /\b(call|dial|phone|ring)\b[^.]{0,40}\b(111|999|911|000)\b/i.test(t)).length;
  if (!emergencyGuidance) {
    contentGaps.push({
      gap: "No emergency number anywhere in the programme",
      detail:
        "Not one of the programme files tells a member which number to ring, including the 72-hour emergency checklist. " +
        "For a household resilience programme this is a content gap rather than a branding one, and it needs a per-market answer: NZ 111, AU 000, US and CA 911.",
      affects: items.filter((i) => /emergency|72.?hour|evacuation|plan/i.test(i.title)).map((i) => i.legacyCode),
    });
  }
  const withSafetyGaps = items.filter((i) => i.safetyNotes.length);
  if (withSafetyGaps.length) {
    const topics = new Map<string, string[]>();
    for (const i of withSafetyGaps) {
      // Group by topic, not by the exact sentence, so the mention counts do not split one gap into many.
      for (const note of i.safetyNotes) {
        const topic = note.replace(/^covers /, "").replace(/\s*\(\d+ mentions\)/, "");
        topics.set(topic, [...(topics.get(topic) ?? []), i.legacyCode]);
      }
    }
    for (const [topic, codes] of topics) {
      contentGaps.push({ gap: `Safety wording missing: ${topic}`, detail: "the topic is taught without the warning a reader would need.", affects: codes });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      programmeFiles: programme.length,
      core: items.filter((i) => i.kind === "core").length,
      bonus: items.filter((i) => i.kind === "bonus").length,
      pairs: items.filter((i) => i.pairStatus === "pair").length,
      pdfOnly: items.filter((i) => i.pairStatus === "pdf only").length,
      htmlOnly: items.filter((i) => i.pairStatus === "html only").length,
      contentMismatches: items.filter((i) => i.contentMismatch).length,
      supportFiles: support.length,
      internalFiles: internal.length,
      visualAssets: assets.length,
    },
    items,
    support,
    internal,
    assets,
    duplicateGroups,
    terminology,
    legacyTotals,
    reskin,
    readiness,
    dayGaps,
    contentGaps,
  };
}

function compareCodes(a: [string, Candidate[]], b: [string, Candidate[]]): number {
  const rank = (code: string) => (/^OG-B/i.test(code) ? 1000 : 0) + Number(code.replace(/^OG-B?/i, ""));
  return rank(a[0]) - rank(b[0]);
}
