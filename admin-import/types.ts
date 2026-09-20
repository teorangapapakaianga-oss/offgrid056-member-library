/**
 * Importer types (Stage 9.1 §4). One record per source file.
 *
 * The importer is a LOCAL, ADMIN-ONLY tool. Nothing here is imported by the member app, and no source path ever
 * reaches the member build.
 */
import type { Difficulty, FoundationId, ResourceTypeId } from "@/lib/content/constants";

export type Confidence = "HIGH" | "MEDIUM" | "LOW";

/** Every inference carries its value, how sure we are, and what that was based on. */
export interface Inference<T> {
  value: T | null;
  confidence: Confidence;
  evidence: string[];
}

export type CandidateStatus =
  | "DISCOVERED"
  | "CLASSIFIED"
  | "CURRENT"
  | "LEGACY"
  | "DUPLICATE"
  | "NEEDS_REVIEW"
  | "REJECTED"
  | "READY_TO_IMPORT"
  | "IMPORTED";

export type Disposition = "KEEP" | "ARCHIVE" | "REVIEW" | "IMPORT" | "IGNORE";
export type DuplicateKind = "EXACT" | "LIKELY" | "VERSION_CANDIDATE" | null;

export type DetectedFileType =
  | "pdf" | "html" | "markdown" | "text" | "docx" | "xlsx" | "zip" | "image" | "video" | "unknown";

/** What the scanner records about a file. The file itself is never modified. */
export interface InventoryEntry {
  candidateId: string;
  source: {
    path: string;
    folder: string;
    sourceLabel: string;
    filename: string;
    extension: string;
    sizeBytes: number;
    modified: string;
    checksum: string;
    fileType: DetectedFileType;
    /** OneDrive placeholder: present in the listing but not downloaded. Content is not read. */
    onlineOnly: boolean;
    /** OffGrid056 material sitting in another project's folder (owner decision D9-2) */
    misplacedSource: boolean;
  };
  /** Only for video: provenance for later hosting (owner decision D9-1) */
  video?: {
    durationSeconds: number | null;
    hostingUrl: string | null;
  };
  /** Only for images */
  image?: { width: number | null; height: number | null };
  /** Only for archives */
  archive?: { entries: number; sample: string[] };
  /** Text actually extracted (kept in the workspace, never committed) */
  textLength: number;
  textError: string | null;
}

export interface LegacyFinding {
  issue: string;
  evidence: string;
}

/** A candidate is an inventory entry plus everything the import needs. */
export interface Candidate extends InventoryEntry {
  status: CandidateStatus;
  inferred: {
    title: Inference<string>;
    resourceType: Inference<ResourceTypeId>;
    foundation: Inference<FoundationId>;
    secondaryFoundations: FoundationId[];
    category: Inference<string>;
    legacyCode: Inference<string>;
    estimatedTime: Inference<number>;
    difficulty: Inference<Difficulty>;
    tags: string[];
  };
  legacyBranding: boolean;
  legacyIssues: LegacyFinding[];
  migrationActions: string[];
  duplicateGroup: string | null;
  duplicateKind: DuplicateKind;
  duplicateOf: string[];
  pairedWith: string | null;
  contentMismatch: boolean;
  disposition: Disposition | null;
  importNotes: string;
  importApproved: boolean;
  importedAt: string | null;
}

export interface DuplicateGroup {
  groupId: string;
  kind: NonNullable<DuplicateKind>;
  members: string[];
  reason: string;
  /** PDF/HTML pairs of the same document (owner decision D9-10) */
  pdfHtmlPair?: boolean;
  contentMismatch?: boolean;
}

export interface ScanSummary {
  scannedAt: string;
  sources: { label: string; path: string; files: number; bytes: number }[];
  files: number;
  bytes: number;
  byFileType: Record<string, number>;
  onlineOnly: number;
  misplaced: number;
  unreadable: number;
  durationMs: number;
}
