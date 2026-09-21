/**
 * Member state: the shape of everything the library remembers about a member (docs/ARCHITECTURE.md §8).
 *
 * Rules that must not change without a migration:
 *  - Everything is keyed by the PERMANENT resource id (`res-0001`), never by slug or title.
 *  - Values carry an ISO timestamp, not just a boolean, so history, ordering and merges work.
 *  - `schemaVersion` gates every read: unknown or damaged data is recovered, never trusted.
 *
 * These are plain types and constants on purpose: this module is loaded by the browser, so it must not pull in a
 * validation library. The runtime checks live in `validate.ts` (see the note there).
 */
import type { MarketChoice } from "./market";

export const MEMBER_STORAGE_KEY = "og056.member.v1";
export const MEMBER_CORRUPT_KEY = "og056.member.v1.corrupt";
export const MEMBER_SCHEMA_VERSION = 1;
export const RECENT_LIMIT = 20;
export const NOTES_MAX = 2000;
export const PROGRAMME_DAYS = 30;

export interface ProgrammeDayState {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  notesAt?: string;
}

export interface LastLocationValue {
  kind: "resource" | "programme-day";
  id: string;
  at: string;
}

export interface MemberState {
  schemaVersion: typeof MEMBER_SCHEMA_VERSION;
  /**
   * The market the member chose, or null if they have not chosen yet.
   *
   * Optional on purpose: a V1 state saved before markets existed has no such key, and must keep working
   * untouched. It is read as "not chosen yet", which is exactly what it means. The schema version therefore
   * does **not** change — bumping it would make every existing member's state "unknown version" and reset
   * their progress, which is a far worse outcome than one absent field.
   */
  market?: MarketChoice | null;
  /** resource id → when it was saved */
  saved: Record<string, string>;
  /** resource id → when it was completed */
  completed: Record<string, string>;
  /** newest first, capped at RECENT_LIMIT */
  recent: { id: string; at: string }[];
  lastLocation: LastLocationValue | null;
  programme: { days: Record<string, ProgrammeDayState> };
  /** Reserved for scored assessments (Stage 6+). Assessment status is derived from completion in V1. */
  assessments: Record<string, { status: string; at: string; score?: number }>;
  updatedAt: string;
}

export type LastLocation = MemberState["lastLocation"];

export const BACKUP_FORMAT = "og056.member.backup";

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: 1;
  app: string;
  exportedAt: string;
  state: MemberState;
}

export function emptyState(now = new Date()): MemberState {
  return {
    schemaVersion: MEMBER_SCHEMA_VERSION,
    market: null,
    saved: {},
    completed: {},
    recent: [],
    lastLocation: null,
    programme: { days: {} },
    assessments: {},
    updatedAt: now.toISOString(),
  };
}

/** How the member's state is being kept right now. */
export type StorageMode = "local" | "memory";

export interface MemberView {
  /** false during the static render and the first paint: panels show skeletons until the store has loaded */
  ready: boolean;
  state: MemberState;
  savedIds: ReadonlySet<string>;
  completedIds: ReadonlySet<string>;
  /** "memory": this browser blocks storage (private mode), so progress lasts only for this visit */
  storage: StorageMode;
  /** true when damaged data was found and reset on load; the UI tells the member once */
  recovered: boolean;
}
