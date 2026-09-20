/**
 * Back up and restore member progress (owner decision D3).
 *
 * V1 progress lives in one browser. A backup file lets a member move it to another device or keep it safe, and it
 * is the same shape the future account migration will read.
 */
import { BACKUP_FORMAT, BackupFileSchema, MemberStateSchema, PROGRAMME_DAYS, type BackupFile, type MemberState } from "./types";

export const BACKUP_FILE_PREFIX = "og056-progress-";

export function createBackup(state: MemberState, now = new Date()): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: 1,
    app: "OffGrid056 Member Resource Library",
    exportedAt: now.toISOString(),
    state: MemberStateSchema.parse(state),
  };
}

export function backupFileName(now = new Date()): string {
  return `${BACKUP_FILE_PREFIX}${now.toISOString().slice(0, 10)}.json`;
}

export interface BackupSummary {
  exportedAt: string;
  saved: number;
  completed: number;
  recent: number;
  programmeDays: number;
  notes: number;
}

export type ParseResult = { ok: true; backup: BackupFile; summary: BackupSummary } | { ok: false; error: string };

/**
 * Restore validation. A file is accepted only when it is a genuine backup of this app at a version we understand,
 * and every field passes the schema. Anything else fails with a plain-language reason and changes nothing.
 */
export function parseBackup(text: string): ParseResult {
  if (text.length > 5_000_000) return { ok: false, error: "That file is too large to be a progress backup." };

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't readable. A progress backup is a .json file created by this library." };
  }

  const shape = raw as { format?: unknown; version?: unknown };
  if (!shape || typeof shape !== "object" || shape.format !== BACKUP_FORMAT) {
    return { ok: false, error: "That file isn't an OffGrid056 progress backup." };
  }
  if (shape.version !== 1) {
    return { ok: false, error: `That backup was made by a newer version of the library (version ${String(shape.version)}). Update the library first.` };
  }

  const result = BackupFileSchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const where = first?.path.join(".") || "the file";
    return { ok: false, error: `That backup is damaged and was not imported (problem in ${where}). Your current progress has not changed.` };
  }

  const state = result.data.state;
  const days = Object.values(state.programme.days);
  if (Object.keys(state.programme.days).some((d) => Number(d) < 1 || Number(d) > PROGRAMME_DAYS)) {
    return { ok: false, error: "That backup lists programme days outside 1–30, so it was not imported." };
  }

  return {
    ok: true,
    backup: result.data,
    summary: {
      exportedAt: result.data.exportedAt,
      saved: Object.keys(state.saved).length,
      completed: Object.keys(state.completed).length,
      recent: state.recent.length,
      programmeDays: days.filter((d) => d.completed).length,
      notes: days.filter((d) => d.notes).length,
    },
  };
}
