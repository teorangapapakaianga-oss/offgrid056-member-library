/**
 * Member state: the shape of everything the library remembers about a member (docs/ARCHITECTURE.md §8).
 *
 * Rules that must not change without a migration:
 *  - Everything is keyed by the PERMANENT resource id (`res-0001`), never by slug or title.
 *  - Values carry an ISO timestamp, not just a boolean, so history, ordering and merges work.
 *  - `schemaVersion` gates every read: unknown or damaged data is recovered, never trusted.
 */
import { z } from "zod";

export const MEMBER_STORAGE_KEY = "og056.member.v1";
export const MEMBER_CORRUPT_KEY = "og056.member.v1.corrupt";
export const MEMBER_SCHEMA_VERSION = 1;
export const RECENT_LIMIT = 20;
export const NOTES_MAX = 2000;
export const PROGRAMME_DAYS = 30;

const isoDate = z.iso.datetime({ offset: true }).or(z.iso.datetime());
const resourceId = z.string().regex(/^res-\d{4}$/);
const dayKey = z.string().regex(/^([1-9]|[12]\d|30)$/);

export const ProgrammeDayStateSchema = z
  .object({
    completed: z.boolean(),
    completedAt: isoDate.optional(),
    notes: z.string().max(NOTES_MAX).optional(),
    notesAt: isoDate.optional(),
  })
  .strict();

export const MemberStateSchema = z
  .object({
    schemaVersion: z.literal(MEMBER_SCHEMA_VERSION),
    saved: z.record(resourceId, isoDate),
    completed: z.record(resourceId, isoDate),
    recent: z.array(z.object({ id: resourceId, at: isoDate }).strict()).max(200),
    lastLocation: z
      .object({ kind: z.enum(["resource", "programme-day"]), id: z.string().max(40), at: isoDate })
      .strict()
      .nullable(),
    programme: z.object({ days: z.record(dayKey, ProgrammeDayStateSchema) }).strict(),
    /** Reserved for scored assessments (Stage 6+). Assessment status is derived from completion in V1. */
    assessments: z.record(z.string().max(40), z.object({ status: z.string().max(20), at: isoDate, score: z.number().optional() }).strict()),
    updatedAt: isoDate,
  })
  .strict();

export type ProgrammeDayState = z.infer<typeof ProgrammeDayStateSchema>;
export type MemberState = z.infer<typeof MemberStateSchema>;
export type LastLocation = MemberState["lastLocation"];

export const BACKUP_FORMAT = "og056.member.backup";

export const BackupFileSchema = z
  .object({
    format: z.literal(BACKUP_FORMAT),
    version: z.literal(1),
    app: z.string(),
    exportedAt: isoDate,
    state: MemberStateSchema,
  })
  .strict();

export type BackupFile = z.infer<typeof BackupFileSchema>;

export function emptyState(now = new Date()): MemberState {
  return {
    schemaVersion: MEMBER_SCHEMA_VERSION,
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
