/**
 * The import engine (Stage 9.4).
 *
 * This is the only part of the importer that writes into the member library, so it is built to be reversible
 * and boring:
 *
 *  - **planning is separate from doing.** A plan can be read, printed and argued with before anything is written;
 *  - **nothing is written without `commit: true`.** A dry run is the default everywhere;
 *  - **every file that will be overwritten is backed up first**, and a failed batch is rolled back;
 *  - **every resource enters as a draft** (owner decision D9-7), whatever the editor said;
 *  - **source files are never read from except to copy, and never written to.**
 *
 * The gate conditions from Stage 9.3 are re-checked here rather than trusted. A candidate marked
 * READY_TO_IMPORT in the workspace still has to prove it at the moment of import.
 */
import fs from "node:fs";
import path from "node:path";
import { canTransition, toResourceRecord, validateDraft, draftFromCandidate, type Decision, type DraftRecord } from "../review/workflow";
import type { Candidate } from "../types";

export type ImportAction = "create" | "replace" | "skip" | "reject";

export interface PlanItem {
  candidateId: string;
  filename: string;
  slug: string;
  action: ImportAction;
  /** where the record will be written, relative to the library root */
  targetFile: string;
  /** the download members would receive, copied beside the record */
  sourceFile: string | null;
  downloadFile: string | null;
  /** the source file's checksum at planning time: what "already imported" is judged against */
  sourceChecksum: string;
  record: Record<string, unknown> | null;
  /** why it was rejected or skipped */
  reasons: string[];
}

export interface ImportPlan {
  createdAt: string;
  items: PlanItem[];
  counts: Record<ImportAction, number>;
}

export interface ImportTarget {
  /** the member library root (where data/ and public/ live) */
  libraryRoot: string;
  /** the importer workspace, for backups and the ledger */
  workspace: string;
}

export interface ImportOptions {
  /** nothing is written unless this is true */
  commit: boolean;
  /** who is importing, for the audit log */
  by?: string;
  now?: () => Date;
}

export interface ImportedEntry {
  candidateId: string;
  slug: string;
  targetFile: string;
  sourceChecksum: string;
  action: Exclude<ImportAction, "skip" | "reject">;
  importedAt: string;
  backup: string | null;
}

export interface ImportResult {
  committed: boolean;
  imported: ImportedEntry[];
  rejected: { candidateId: string; reasons: string[] }[];
  skipped: { candidateId: string; reasons: string[] }[];
  backupDir: string | null;
  rolledBack: boolean;
  error: string | null;
}

const resourceDir = (root: string) => path.join(root, "data", "resources");
const downloadDir = (root: string) => path.join(root, "public", "resources");

/** Everything the importer writes goes through here, so no write can miss the atomic-rename treatment. */
function writeAtomic(file: string, contents: string | Buffer): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.importing`;
  fs.writeFileSync(temp, contents);
  fs.renameSync(temp, file);
}

function readLedger(workspace: string): Record<string, ImportedEntry> {
  try {
    return JSON.parse(fs.readFileSync(path.join(workspace, "imported.json"), "utf8")) as Record<string, ImportedEntry>;
  } catch {
    return {};
  }
}

function audit(workspace: string, event: string, detail: Record<string, unknown>): void {
  fs.mkdirSync(path.join(workspace, "logs"), { recursive: true });
  fs.appendFileSync(path.join(workspace, "logs", "audit.jsonl"), JSON.stringify({ at: new Date().toISOString(), event, ...detail }) + "\n", "utf8");
}

/**
 * Work out what would happen, without touching anything.
 *
 * A candidate has to be marked READY_TO_IMPORT *and* still satisfy every gate condition. Being marked ready
 * yesterday is not a reason to import something invalid today.
 */
export function planImport(candidates: Candidate[], decisions: Record<string, Decision>, target: ImportTarget): ImportPlan {
  const ledger = readLedger(target.workspace);
  const items: PlanItem[] = [];

  for (const candidate of candidates) {
    const decision = decisions[candidate.candidateId];
    if (!decision || decision.status !== "READY_TO_IMPORT") continue;

    const draft = { ...draftFromCandidate(candidate), ...decision.draft } as DraftRecord;
    const reasons: string[] = [];

    // Re-check the gate at the moment of import, rather than trusting the stored status. The gate already
    // includes validation, so the two lists are merged and de-duplicated rather than reported twice.
    const gate = canTransition(candidate, { ...decision, status: "CURRENT" }, "READY_TO_IMPORT");
    reasons.push(
      ...new Set([...(gate.ok ? [] : gate.blockers), ...validateDraft(decision.draft, candidate).map((i) => `${i.field}: ${i.message}`)]),
    );

    const slug = draft.slug;
    const targetFile = path.join(resourceDir(target.libraryRoot), `${slug}.json`);

    if (reasons.length) {
      items.push({ candidateId: candidate.candidateId, filename: candidate.source.filename, slug, action: "reject", targetFile, sourceFile: null, downloadFile: null, sourceChecksum: candidate.source.checksum, record: null, reasons });
      continue;
    }

    // Already imported from the very same bytes: nothing to do.
    const previous = ledger[candidate.candidateId];
    if (previous && previous.sourceChecksum === candidate.source.checksum && fs.existsSync(targetFile)) {
      items.push({
        candidateId: candidate.candidateId,
        filename: candidate.source.filename,
        slug,
        action: "skip",
        targetFile,
        sourceFile: null,
        downloadFile: null,
        sourceChecksum: candidate.source.checksum,
        record: null,
        reasons: [`already imported on ${previous.importedAt.slice(0, 10)} from an identical file`],
      });
      continue;
    }

    // Owner decision D9-7: everything enters as a draft, whatever the editor said.
    const record: Record<string, unknown> = { ...toResourceRecord(draft, candidate), status: "draft" };
    const downloadFile = record.fileUrl ? path.join(downloadDir(target.libraryRoot), path.basename(String(record.fileUrl))) : null;

    items.push({
      candidateId: candidate.candidateId,
      filename: candidate.source.filename,
      slug,
      action: fs.existsSync(targetFile) ? "replace" : "create",
      targetFile,
      sourceFile: candidate.source.path,
      downloadFile,
      sourceChecksum: candidate.source.checksum,
      record,
      reasons: [],
    });
  }

  const counts: Record<ImportAction, number> = { create: 0, replace: 0, skip: 0, reject: 0 };
  for (const i of items) counts[i.action]++;
  return { createdAt: new Date().toISOString(), items, counts };
}

/**
 * Carry out a plan.
 *
 * Writes happen only with `commit: true`. Anything that is going to be overwritten is copied into a timestamped
 * backup folder first, and if any single write fails the whole batch is put back as it was.
 */
export function runImport(plan: ImportPlan, target: ImportTarget, options: ImportOptions): ImportResult {
  const now = options.now ?? (() => new Date());
  const stamp = now().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(target.workspace, "backups", stamp);

  const result: ImportResult = {
    committed: options.commit,
    imported: [],
    rejected: plan.items.filter((i) => i.action === "reject").map((i) => ({ candidateId: i.candidateId, reasons: i.reasons })),
    skipped: plan.items.filter((i) => i.action === "skip").map((i) => ({ candidateId: i.candidateId, reasons: i.reasons })),
    backupDir: null,
    rolledBack: false,
    error: null,
  };

  const todo = plan.items.filter((i) => i.action === "create" || i.action === "replace");
  if (!options.commit) {
    audit(target.workspace, "import.dry-run", { items: todo.length, rejected: result.rejected.length, skipped: result.skipped.length });
    return result;
  }

  /** files written during this batch, so a failure can be undone exactly */
  const written: { file: string; backup: string | null }[] = [];

  try {
    for (const item of todo) {
      // 1. Back up anything that is about to be overwritten, before writing a single byte.
      let backup: string | null = null;
      if (fs.existsSync(item.targetFile)) {
        backup = path.join(backupDir, "data", "resources", path.basename(item.targetFile));
        fs.mkdirSync(path.dirname(backup), { recursive: true });
        fs.copyFileSync(item.targetFile, backup);
      }

      // 2. The download the member receives, copied from the source. The source itself is only ever read.
      if (item.downloadFile && item.sourceFile) {
        if (fs.existsSync(item.downloadFile)) {
          const downloadBackup = path.join(backupDir, "public", "resources", path.basename(item.downloadFile));
          fs.mkdirSync(path.dirname(downloadBackup), { recursive: true });
          fs.copyFileSync(item.downloadFile, downloadBackup);
          written.push({ file: item.downloadFile, backup: downloadBackup });
        } else {
          written.push({ file: item.downloadFile, backup: null });
        }
        fs.mkdirSync(path.dirname(item.downloadFile), { recursive: true });
        fs.copyFileSync(item.sourceFile, item.downloadFile);
      }

      // 3. The record itself.
      writeAtomic(item.targetFile, JSON.stringify(item.record, null, 2) + "\n");
      written.push({ file: item.targetFile, backup });

      const entry: ImportedEntry = {
        candidateId: item.candidateId,
        slug: item.slug,
        targetFile: path.relative(target.libraryRoot, item.targetFile),
        sourceChecksum: item.sourceChecksum,
        action: item.action as "create" | "replace",
        importedAt: now().toISOString(),
        backup: backup ? path.relative(target.workspace, backup) : null,
      };
      result.imported.push(entry);
      audit(target.workspace, "import.write", { candidateId: item.candidateId, slug: item.slug, action: item.action, backup: entry.backup, by: options.by ?? "admin" });
    }
  } catch (e) {
    // Put everything back exactly as it was: restore what was overwritten, remove what was created.
    result.error = (e as Error).message;
    result.rolledBack = true;
    for (const w of written.reverse()) {
      try {
        if (w.backup) fs.copyFileSync(w.backup, w.file);
        else if (fs.existsSync(w.file)) fs.rmSync(w.file);
      } catch {
        /* a failed rollback step must not hide the original error */
      }
    }
    result.imported = [];
    audit(target.workspace, "import.rolled-back", { error: result.error, files: written.length });
    return result;
  }

  result.backupDir = written.some((w) => w.backup) ? backupDir : null;
  return result;
}

/** Record what was imported, so the same file is not imported twice and so Stage 9.6 can audit it. */
export function updateLedger(target: ImportTarget, entries: ImportedEntry[]): Record<string, ImportedEntry> {
  const ledger = readLedger(target.workspace);
  for (const e of entries) ledger[e.candidateId] = e;
  writeAtomic(path.join(target.workspace, "imported.json"), JSON.stringify(ledger, null, 1) + "\n");
  return ledger;
}
