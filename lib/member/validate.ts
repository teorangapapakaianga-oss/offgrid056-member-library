/**
 * Validation for member state and backup files.
 *
 * This deliberately does NOT use the schema library: it would add about 390 KB of JavaScript to every page, and
 * the shapes here are small and fixed. The rules mirror the Stage 4 schema exactly, and the Stage 4 tests (stored
 * state, damaged data, unknown versions, invalid backups, merge rules) are what prove the behaviour is unchanged.
 *
 * Content validation still uses the schema library, because that runs only at build time.
 */
import { isMarketCode } from "./market";
import { MEMBER_SCHEMA_VERSION, NOTES_MAX, PROGRAMME_DAYS, type MemberState, type ProgrammeDayState } from "./types";

export type Check<T> = { ok: true; value: T } | { ok: false; path: string };

const fail = (path: string): Check<never> => ({ ok: false, path });

const RESOURCE_ID = /^res-\d{4}$/;
const ISO = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isIsoDate = (v: unknown): v is string => typeof v === "string" && ISO.test(v) && !Number.isNaN(Date.parse(v));

/** Only the keys listed are allowed, exactly as the strict schema required. */
function onlyKeys(o: Record<string, unknown>, allowed: string[], path: string): string | null {
  const extra = Object.keys(o).find((k) => !allowed.includes(k));
  return extra ? `${path}.${extra}` : null;
}

function checkDateMap(v: unknown, path: string): Check<Record<string, string>> {
  if (!isObject(v)) return fail(path);
  for (const [id, at] of Object.entries(v)) {
    if (!RESOURCE_ID.test(id)) return fail(`${path}.${id}`);
    if (!isIsoDate(at)) return fail(`${path}.${id}`);
  }
  return { ok: true, value: v as Record<string, string> };
}

function checkDay(v: unknown, path: string): Check<ProgrammeDayState> {
  if (!isObject(v)) return fail(path);
  const extra = onlyKeys(v, ["completed", "completedAt", "notes", "notesAt"], path);
  if (extra) return fail(extra);
  if (typeof v.completed !== "boolean") return fail(`${path}.completed`);
  if (v.completedAt !== undefined && !isIsoDate(v.completedAt)) return fail(`${path}.completedAt`);
  if (v.notes !== undefined && (typeof v.notes !== "string" || v.notes.length > NOTES_MAX)) return fail(`${path}.notes`);
  if (v.notesAt !== undefined && !isIsoDate(v.notesAt)) return fail(`${path}.notesAt`);
  return { ok: true, value: v as unknown as ProgrammeDayState };
}

/** Full check of a stored or imported member-state document. */
export function checkMemberState(v: unknown, path = "state"): Check<MemberState> {
  if (!isObject(v)) return fail(path);
  const extra = onlyKeys(v, ["schemaVersion", "market", "saved", "completed", "recent", "lastLocation", "programme", "assessments", "updatedAt"], path);
  if (extra) return fail(extra);

  if (v.schemaVersion !== MEMBER_SCHEMA_VERSION) return fail(`${path}.schemaVersion`);

  // `market` is optional: state written before markets existed simply has no such key, and that is read as
  // "not chosen yet" rather than as damage. Present but wrong is a different matter and is rejected — a
  // nonsense market code must never reach the code that decides which emergency number to show.
  if (v.market !== undefined && v.market !== null) {
    if (!isObject(v.market)) return fail(`${path}.market`);
    const badMarket = onlyKeys(v.market, ["code", "at"], `${path}.market`);
    if (badMarket) return fail(badMarket);
    if (!isMarketCode(v.market.code)) return fail(`${path}.market.code`);
    if (!isIsoDate(v.market.at)) return fail(`${path}.market.at`);
  }

  const saved = checkDateMap(v.saved, `${path}.saved`);
  if (!saved.ok) return saved;
  const completed = checkDateMap(v.completed, `${path}.completed`);
  if (!completed.ok) return completed;

  if (!Array.isArray(v.recent) || v.recent.length > 200) return fail(`${path}.recent`);
  for (const [i, entry] of v.recent.entries()) {
    if (!isObject(entry)) return fail(`${path}.recent.${i}`);
    const bad = onlyKeys(entry, ["id", "at"], `${path}.recent.${i}`);
    if (bad) return fail(bad);
    if (typeof entry.id !== "string" || !RESOURCE_ID.test(entry.id)) return fail(`${path}.recent.${i}.id`);
    if (!isIsoDate(entry.at)) return fail(`${path}.recent.${i}.at`);
  }

  if (v.lastLocation !== null) {
    if (!isObject(v.lastLocation)) return fail(`${path}.lastLocation`);
    const bad = onlyKeys(v.lastLocation, ["kind", "id", "at"], `${path}.lastLocation`);
    if (bad) return fail(bad);
    if (v.lastLocation.kind !== "resource" && v.lastLocation.kind !== "programme-day") return fail(`${path}.lastLocation.kind`);
    if (typeof v.lastLocation.id !== "string" || v.lastLocation.id.length > 40) return fail(`${path}.lastLocation.id`);
    if (!isIsoDate(v.lastLocation.at)) return fail(`${path}.lastLocation.at`);
  }

  if (!isObject(v.programme)) return fail(`${path}.programme`);
  const badProgramme = onlyKeys(v.programme, ["days"], `${path}.programme`);
  if (badProgramme) return fail(badProgramme);
  if (!isObject(v.programme.days)) return fail(`${path}.programme.days`);
  for (const [key, day] of Object.entries(v.programme.days)) {
    const n = Number(key);
    if (!/^\d+$/.test(key) || n < 1 || n > PROGRAMME_DAYS) return fail(`${path}.programme.days.${key}`);
    const checked = checkDay(day, `${path}.programme.days.${key}`);
    if (!checked.ok) return checked;
  }

  if (!isObject(v.assessments)) return fail(`${path}.assessments`);
  for (const [key, a] of Object.entries(v.assessments)) {
    const at = `${path}.assessments.${key}`;
    if (key.length > 40 || !isObject(a)) return fail(at);
    const bad = onlyKeys(a, ["status", "at", "score"], at);
    if (bad) return fail(bad);
    if (typeof a.status !== "string" || a.status.length > 20) return fail(`${at}.status`);
    if (!isIsoDate(a.at)) return fail(`${at}.at`);
    if (a.score !== undefined && typeof a.score !== "number") return fail(`${at}.score`);
  }

  if (!isIsoDate(v.updatedAt)) return fail(`${path}.updatedAt`);

  return { ok: true, value: v as unknown as MemberState };
}
