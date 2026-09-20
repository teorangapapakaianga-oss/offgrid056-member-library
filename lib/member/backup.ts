/**
 * Back up and restore member progress (owner decision D3).
 *
 * V1 progress lives in one browser. A backup file lets a member move it to another device or keep it safe, and it
 * is the same shape the future account migration will read.
 */
import { BACKUP_FORMAT, PROGRAMME_DAYS, type BackupFile, type MemberState } from "./types";
import { checkMemberState } from "./validate";

export const BACKUP_FILE_PREFIX = "og056-progress-";

export function createBackup(state: MemberState, now = new Date()): BackupFile {
  const checked = checkMemberState(state);
  if (!checked.ok) throw new Error(`Cannot back up damaged progress (problem in ${checked.path})`);
  return {
    format: BACKUP_FORMAT,
    version: 1,
    app: "OffGrid056 Member Resource Library",
    exportedAt: now.toISOString(),
    state: checked.value,
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

  // The envelope, then the state itself. Any failure names where the problem is and changes nothing.
  const envelope = raw as { app?: unknown; exportedAt?: unknown; state?: unknown };
  const badEnvelope =
    typeof envelope.app !== "string"
      ? "app"
      : typeof envelope.exportedAt !== "string" || Number.isNaN(Date.parse(envelope.exportedAt))
        ? "exportedAt"
        : Object.keys(envelope).some((k) => !["format", "version", "app", "exportedAt", "state"].includes(k))
          ? "the file"
          : null;
  const checked = badEnvelope ? null : checkMemberState(envelope.state);
  if (badEnvelope || !checked?.ok) {
    const where = badEnvelope ?? (checked && !checked.ok ? checked.path : "the file");
    return { ok: false, error: `That backup is damaged and was not imported (problem in ${where}). Your current progress has not changed.` };
  }

  const state = checked.value;
  const days = Object.values(state.programme.days);
  if (Object.keys(state.programme.days).some((d) => Number(d) < 1 || Number(d) > PROGRAMME_DAYS)) {
    return { ok: false, error: "That backup lists programme days outside 1–30, so it was not imported." };
  }

  const backup: BackupFile = { format: BACKUP_FORMAT, version: 1, app: envelope.app as string, exportedAt: envelope.exportedAt as string, state };

  return {
    ok: true,
    backup,
    summary: {
      exportedAt: backup.exportedAt,
      saved: Object.keys(state.saved).length,
      completed: Object.keys(state.completed).length,
      recent: state.recent.length,
      programmeDays: days.filter((d) => d.completed).length,
      notes: days.filter((d) => d.notes).length,
    },
  };
}
