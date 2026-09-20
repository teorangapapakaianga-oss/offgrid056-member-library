/**
 * Review workflow: what an admin may change, and what has to be true before anything is marked ready.
 *
 * This is the safety layer of the importer. It is deliberately strict and deliberately boring:
 *
 *  - nothing reaches READY_TO_IMPORT without valid metadata, a schema pass and an explicit human approval;
 *  - internal files, artwork and packages cannot become resources at all without a written override;
 *  - every LOW-confidence guess must be looked at by a person before it can go anywhere.
 *
 * None of this touches source files. Decisions live in `workspace/decisions.json`.
 */
import { ResourceSchema } from "@/lib/content/schemas";
import { COLLECTION_IDS, DIFFICULTIES, FOUNDATION_IDS, RESOURCE_TYPE_IDS } from "@/lib/content/constants";
import { getFoundation } from "@/lib/content/taxonomy";
import type { Candidate, CandidateStatus, Disposition, MaterialKind } from "../types";

export const EDITABLE_FIELDS = [
  "id", "title", "slug", "description", "foundation", "category", "resourceType", "difficulty",
  "estimatedTime", "tags", "learningObjectives", "collections", "legacyCode", "thumbnailCandidateId",
  "downloadFile", "status",
] as const;

export type EditableField = (typeof EDITABLE_FIELDS)[number];

/** The proposed library record: what the admin edits, before it becomes a real resource in Stage 9.4. */
export interface DraftRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  foundation: string;
  category: string;
  resourceType: string;
  difficulty: string;
  estimatedTime: number;
  tags: string[];
  learningObjectives: string[];
  collections: string[];
  legacyCode: string;
  /** candidateId of the artwork to use as the cover (owner decision 5) */
  thumbnailCandidateId: string | null;
  /** the file members would download: normally the candidate's own file */
  downloadFile: string;
  status: "draft" | "published" | "archived";
}

/** One admin's decisions about one candidate. Stored per candidate in the workspace. */
export interface Decision {
  candidateId: string;
  status: CandidateStatus;
  disposition: Disposition | null;
  draft: Partial<DraftRecord>;
  /** inferred fields the admin has actually looked at — LOW-confidence ones must appear here */
  reviewedFields: string[];
  approved: boolean;
  /** a written reason is required to treat internal material, artwork or a package as a resource */
  override: { reason: string; by: string; at: string } | null;
  notes: string;
  updatedAt: string;
}

/** Statuses an admin may move a candidate to, from where. */
export const ALLOWED_TRANSITIONS: Record<CandidateStatus, CandidateStatus[]> = {
  DISCOVERED: ["CLASSIFIED", "NEEDS_REVIEW", "REJECTED"],
  CLASSIFIED: ["CURRENT", "LEGACY", "DUPLICATE", "NEEDS_REVIEW", "REJECTED"],
  CURRENT: ["READY_TO_IMPORT", "NEEDS_REVIEW", "LEGACY", "DUPLICATE", "REJECTED"],
  LEGACY: ["READY_TO_IMPORT", "NEEDS_REVIEW", "CURRENT", "DUPLICATE", "REJECTED"],
  DUPLICATE: ["CURRENT", "LEGACY", "NEEDS_REVIEW", "REJECTED"],
  NEEDS_REVIEW: ["CURRENT", "LEGACY", "DUPLICATE", "REJECTED", "READY_TO_IMPORT"],
  REJECTED: ["NEEDS_REVIEW"],
  // Stage 9.4 performs the import itself; the UI cannot mark something imported.
  READY_TO_IMPORT: ["CURRENT", "LEGACY", "NEEDS_REVIEW", "REJECTED"],
  IMPORTED: ["NEEDS_REVIEW"],
};

const slugOf = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** The starting point for the editor: the classifier's best guesses, clearly marked as guesses. */
export function draftFromCandidate(c: Candidate): DraftRecord {
  const title = c.inferred.title.value ?? c.source.filename.replace(/\.[^.]+$/, "");
  const foundation = c.inferred.foundation.value ?? "general";
  return {
    id: "",
    title,
    slug: slugOf(title),
    description: "",
    foundation,
    category: c.inferred.category.value ?? "",
    resourceType: c.inferred.resourceType.value ?? "",
    difficulty: c.inferred.difficulty.value ?? "beginner",
    estimatedTime: c.inferred.estimatedTime.value ?? 0,
    tags: c.inferred.tags,
    learningObjectives: [],
    collections: [],
    legacyCode: c.inferred.legacyCode.value ?? "",
    thumbnailCandidateId: null,
    downloadFile: c.source.filename,
    status: "draft",
  };
}

export interface ValidationIssue {
  field: string;
  message: string;
}

/**
 * Validate a draft against the real library schema, so nothing can be marked ready that the member site would
 * then refuse to build. Fields the admin has not filled in yet are reported as missing rather than guessed.
 */
export function validateDraft(draft: Partial<DraftRecord>, candidate: Candidate): ValidationIssue[] {
  const d = { ...draftFromCandidate(candidate), ...draft };
  const issues: ValidationIssue[] = [];

  if (!d.id) issues.push({ field: "id", message: 'an id is required, in the form "res-0001"' });
  if (!d.description) issues.push({ field: "description", message: "a description is required: members see this on the card" });
  if (!d.resourceType) issues.push({ field: "resourceType", message: "a resource type is required" });
  if (!d.category) issues.push({ field: "category", message: "a category is required" });
  if (!d.estimatedTime) issues.push({ field: "estimatedTime", message: "an estimated time in minutes is required" });

  if (d.foundation && !FOUNDATION_IDS.includes(d.foundation as never)) issues.push({ field: "foundation", message: `not a foundation: ${d.foundation}` });
  if (d.resourceType && !RESOURCE_TYPE_IDS.includes(d.resourceType as never)) issues.push({ field: "resourceType", message: `not a resource type: ${d.resourceType}` });
  if (d.difficulty && !DIFFICULTIES.includes(d.difficulty as never)) issues.push({ field: "difficulty", message: `not a difficulty: ${d.difficulty}` });
  for (const col of d.collections) {
    if (!COLLECTION_IDS.includes(col as never)) issues.push({ field: "collections", message: `not a collection: ${col}` });
  }
  // The category must belong to the chosen foundation, or the resource lands in a section that cannot show it.
  if (d.foundation && d.category && FOUNDATION_IDS.includes(d.foundation as never)) {
    const valid = getFoundation(d.foundation as never).categories.map((c) => c.slug);
    if (!valid.includes(d.category)) {
      issues.push({ field: "category", message: `"${d.category}" is not a category of ${d.foundation} (${valid.join(", ")})` });
    }
  }

  // Everything above is about the admin's own input. This last step checks the record the member site would
  // actually receive, so the two can never drift apart.
  if (!issues.length) {
    const result = ResourceSchema.safeParse(toResourceRecord(d, candidate));
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({ field: issue.path.join(".") || "record", message: issue.message });
      }
    }
  }
  return issues;
}

const FORMAT_BY_TYPE: Record<string, string> = { pdf: "PDF", xlsx: "XLSX", docx: "DOCX", zip: "ZIP", image: "PNG" };

/** The full library record, with the fields Stage 9.4 will fill in given sensible, conservative defaults. */
export function toResourceRecord(d: DraftRecord, c: Candidate): Record<string, unknown> {
  const format = FORMAT_BY_TYPE[c.source.fileType];
  const downloadable = Boolean(format);
  return {
    id: d.id,
    slug: d.slug,
    ...(d.legacyCode ? { legacyCode: d.legacyCode } : {}),
    title: d.title,
    description: d.description,
    learningObjectives: d.learningObjectives,
    foundation: d.foundation,
    category: d.category,
    resourceType: d.resourceType,
    difficulty: d.difficulty,
    estimatedTime: d.estimatedTime,
    tags: d.tags,
    ...(d.collections.length ? { collections: d.collections } : {}),
    featured: false,
    premium: false,
    isPlaceholder: false,
    status: d.status,
    ...(downloadable
      ? { fileUrl: `/resources/${d.slug}.${c.source.extension.replace(/^\./, "")}`, fileFormat: format, fileSizeBytes: c.source.sizeBytes }
      : {}),
    downloadable,
    publishedDate: new Date().toISOString().slice(0, 10),
    relatedResources: [],
    completionAvailable: true,
  };
}

/** Inferred fields that a person must confirm before the candidate can go anywhere. */
export function lowConfidenceFields(c: Candidate): string[] {
  const out: string[] = [];
  const check: [string, { confidence: string; value: unknown }][] = [
    ["title", c.inferred.title],
    ["resourceType", c.inferred.resourceType],
    ["foundation", c.inferred.foundation],
    ["category", c.inferred.category],
    ["difficulty", c.inferred.difficulty],
    ["estimatedTime", c.inferred.estimatedTime],
  ];
  for (const [field, inf] of check) if (inf.confidence === "LOW") out.push(field);
  return out;
}

const KIND_REASON: Record<Exclude<MaterialKind, "resource">, string> = {
  internal: "this is internal or source material (README, brand plan, manifest, build or index file), not a member resource",
  asset: "this is a cover or supporting image: attach it to a resource instead of importing it on its own",
  package: "this is a source or support package (ZIP), not a separate library item",
};

export interface TransitionCheck {
  ok: boolean;
  blockers: string[];
}

/**
 * May this candidate move to this status?
 *
 * Everything except READY_TO_IMPORT is a working state an admin can move between freely. READY_TO_IMPORT is the
 * gate, and it is the only one that can put something in front of a member, so it carries all of the conditions.
 */
export function canTransition(candidate: Candidate, decision: Decision, to: CandidateStatus): TransitionCheck {
  const blockers: string[] = [];
  const from = decision.status ?? candidate.status;

  if (from === to) return { ok: true, blockers: [] };
  if (!ALLOWED_TRANSITIONS[from]?.includes(to)) {
    blockers.push(`${from} → ${to} is not an allowed change`);
    return { ok: false, blockers };
  }

  if (to === "READY_TO_IMPORT") {
    if (candidate.materialKind !== "resource" && !decision.override?.reason) {
      blockers.push(`${KIND_REASON[candidate.materialKind as Exclude<MaterialKind, "resource">]} — a written override is required`);
    }
    if (!decision.approved) blockers.push("an admin must tick the approval box");

    const issues = validateDraft(decision.draft, candidate);
    for (const i of issues) blockers.push(`${i.field}: ${i.message}`);

    const unreviewed = lowConfidenceFields(candidate).filter((f) => !decision.reviewedFields.includes(f));
    if (unreviewed.length) blockers.push(`these were guessed with low confidence and still need a person to confirm them: ${unreviewed.join(", ")}`);

    if (candidate.contentMismatch) blockers.push("this PDF and its HTML twin do not match (CONTENT_MISMATCH): resolve that first");
    for (const flag of candidate.reviewFlags) blockers.push(`${flag} is still open`);
  }

  return { ok: blockers.length === 0, blockers };
}

export function emptyDecision(candidateId: string, status: CandidateStatus): Decision {
  return {
    candidateId,
    status,
    disposition: null,
    draft: {},
    reviewedFields: [],
    approved: false,
    override: null,
    notes: "",
    updatedAt: new Date().toISOString(),
  };
}
