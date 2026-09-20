/**
 * The member store: the ONLY code that touches storage (docs/ARCHITECTURE.md §7).
 *
 * V1 keeps everything in one versioned localStorage entry. Every method is async, and the interface is written
 * so a server-backed store (accounts, progress syncing) can replace `LocalMemberStore` later without changing a
 * single component. If storage is unavailable or damaged, the library keeps working in memory and says so.
 */
import {
  MEMBER_CORRUPT_KEY,
  MEMBER_SCHEMA_VERSION,
  MEMBER_STORAGE_KEY,
  MemberStateSchema,
  NOTES_MAX,
  RECENT_LIMIT,
  emptyState,
  type LastLocation,
  type MemberState,
  type MemberView,
  type StorageMode,
} from "./types";

export interface MemberStore {
  load(): Promise<MemberView>;
  setSaved(resourceId: string, saved: boolean): Promise<void>;
  setCompleted(resourceId: string, completed: boolean): Promise<void>;
  recordView(resourceId: string): Promise<void>;
  setLastLocation(loc: NonNullable<LastLocation>): Promise<void>;
  setDayCompleted(day: number, completed: boolean): Promise<void>;
  setDayNotes(day: number, notes: string): Promise<void>;
  subscribe(listener: () => void): () => void;
  getSnapshot(): MemberView;
  exportState(): Promise<MemberState>;
  /** "merge" keeps existing progress and folds the backup in; "replace" discards it (the member must confirm). */
  importState(state: MemberState, mode: "merge" | "replace"): Promise<void>;
}

const EMPTY_SET: ReadonlySet<string> = new Set();

/** The snapshot used during the static render and before the store loads. Must be a stable reference. */
export const INITIAL_VIEW: MemberView = Object.freeze({
  ready: false,
  state: Object.freeze(emptyState(new Date(0))) as MemberState,
  savedIds: EMPTY_SET,
  completedIds: EMPTY_SET,
  storage: "local" as StorageMode,
  recovered: false,
});

function storageAvailable(): boolean {
  try {
    const probe = "og056.probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Reads and validates the stored document. Damaged data is set aside and reported, never thrown away silently. */
function readState(): { state: MemberState; recovered: boolean } {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(MEMBER_STORAGE_KEY);
  } catch {
    return { state: emptyState(), recovered: false };
  }
  if (!raw) return { state: emptyState(), recovered: false };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { state: quarantine(raw), recovered: true };
  }
  const migrated = migrate(parsed);
  const result = MemberStateSchema.safeParse(migrated);
  if (!result.success) return { state: quarantine(raw), recovered: true };
  return { state: result.data, recovered: false };
}

/** Keeps a copy of unreadable data under a separate key so nothing is lost, then starts clean. */
function quarantine(raw: string): MemberState {
  try {
    window.localStorage.setItem(MEMBER_CORRUPT_KEY, raw.slice(0, 200_000));
    window.localStorage.removeItem(MEMBER_STORAGE_KEY);
  } catch {
    /* storage may be full or blocked: recovery still proceeds in memory */
  }
  return emptyState();
}

/**
 * Migrations. Version 1 is the first schema, so there is nothing to upgrade yet; later versions add a step here
 * and the member keeps their progress.
 */
function migrate(doc: unknown): unknown {
  if (!doc || typeof doc !== "object") return doc;
  const v = (doc as { schemaVersion?: unknown }).schemaVersion;
  if (v === MEMBER_SCHEMA_VERSION) return doc;
  return null; // unknown version: treated as damaged, recovered rather than guessed at
}

function view(state: MemberState, storage: StorageMode, recovered: boolean): MemberView {
  return {
    ready: true,
    state,
    savedIds: new Set(Object.keys(state.saved)),
    completedIds: new Set(Object.keys(state.completed)),
    storage,
    recovered,
  };
}

export class LocalMemberStore implements MemberStore {
  private snapshot: MemberView = INITIAL_VIEW;
  private listeners = new Set<() => void>();
  private storage: StorageMode = "local";
  private loading: Promise<MemberView> | null = null;

  getSnapshot(): MemberView {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    void this.ensureLoaded();
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Loads once. Every write waits for this first: otherwise an early action (such as recording a page view on
   * mount) could save an empty document over the member's real progress.
   */
  private ensureLoaded(): Promise<MemberView> {
    this.loading ??= this.doLoad();
    return this.loading;
  }

  load(): Promise<MemberView> {
    return this.ensureLoaded();
  }

  private async doLoad(): Promise<MemberView> {
    if (typeof window === "undefined") return this.snapshot;
    this.storage = storageAvailable() ? "local" : "memory";
    const { state, recovered } = this.storage === "local" ? readState() : { state: emptyState(), recovered: false };
    this.snapshot = view(state, this.storage, recovered);
    this.emit();
    window.addEventListener("storage", this.onExternalChange);
    return this.snapshot;
  }

  /** Another tab changed the member's progress: pick it up so both tabs agree. */
  private onExternalChange = (e: StorageEvent) => {
    if (e.key !== MEMBER_STORAGE_KEY || this.storage !== "local") return;
    const { state, recovered } = readState();
    this.snapshot = view(state, this.storage, recovered || this.snapshot.recovered);
    this.emit();
  };

  private emit() {
    for (const l of this.listeners) l();
  }

  /** Updates state, shows it immediately, then persists. A storage failure never breaks the interface. */
  private async update(fn: (s: MemberState) => MemberState): Promise<void> {
    await this.ensureLoaded(); // never write on top of the not-yet-loaded empty state
    const next = { ...fn(this.snapshot.state), updatedAt: new Date().toISOString() };
    this.snapshot = view(next, this.storage, this.snapshot.recovered);
    this.emit();
    if (this.storage !== "local") return;
    try {
      window.localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(next));
    } catch {
      this.storage = "memory"; // quota or permissions: carry on in memory and tell the member
      this.snapshot = view(next, this.storage, this.snapshot.recovered);
      this.emit();
    }
  }

  async setSaved(resourceId: string, saved: boolean): Promise<void> {
    await this.update((s) => {
      const next = { ...s.saved };
      if (saved) next[resourceId] = new Date().toISOString();
      else delete next[resourceId];
      return { ...s, saved: next };
    });
  }

  async setCompleted(resourceId: string, completed: boolean): Promise<void> {
    await this.update((s) => {
      const next = { ...s.completed };
      if (completed) next[resourceId] = new Date().toISOString();
      else delete next[resourceId];
      return { ...s, completed: next };
    });
  }

  async recordView(resourceId: string): Promise<void> {
    await this.update((s) => {
      const at = new Date().toISOString();
      const recent = [{ id: resourceId, at }, ...s.recent.filter((r) => r.id !== resourceId)].slice(0, RECENT_LIMIT);
      return { ...s, recent, lastLocation: { kind: "resource", id: resourceId, at } };
    });
  }

  async setLastLocation(loc: NonNullable<LastLocation>): Promise<void> {
    await this.update((s) => ({ ...s, lastLocation: loc }));
  }

  async setDayCompleted(day: number, completed: boolean): Promise<void> {
    await this.update((s) => {
      const key = String(day);
      const prev = s.programme.days[key] ?? { completed: false };
      const days = { ...s.programme.days, [key]: { ...prev, completed, completedAt: completed ? new Date().toISOString() : undefined } };
      if (!completed && !days[key].notes) delete days[key];
      return { ...s, programme: { days } };
    });
  }

  async setDayNotes(day: number, notes: string): Promise<void> {
    await this.update((s) => {
      const key = String(day);
      const prev = s.programme.days[key] ?? { completed: false };
      const trimmed = notes.slice(0, NOTES_MAX);
      const days = { ...s.programme.days, [key]: { ...prev, notes: trimmed || undefined, notesAt: trimmed ? new Date().toISOString() : undefined } };
      if (!days[key].completed && !days[key].notes) delete days[key];
      return { ...s, programme: { days } };
    });
  }

  async exportState(): Promise<MemberState> {
    return this.snapshot.state;
  }

  async importState(state: MemberState, mode: "merge" | "replace"): Promise<void> {
    await this.update((current) => (mode === "replace" ? state : mergeStates(current, state)));
  }
}

/**
 * Merge rules for restoring a backup (and, later, for a member's first sign-in):
 *  - saved / completed: union, keeping the EARLIEST date, so a member never loses credit for finishing something
 *  - recent: newest entry per resource wins, capped
 *  - programme: a day counts as done if it is done on either side; the newer notes win
 *  - nothing is deleted by a merge
 */
export function mergeStates(a: MemberState, b: MemberState): MemberState {
  const earliest = (x: Record<string, string>, y: Record<string, string>) => {
    const out: Record<string, string> = { ...x };
    for (const [id, at] of Object.entries(y)) out[id] = out[id] && out[id] < at ? out[id] : at;
    return out;
  };

  const recentById = new Map<string, string>();
  for (const { id, at } of [...a.recent, ...b.recent]) {
    const prev = recentById.get(id);
    if (!prev || prev < at) recentById.set(id, at);
  }
  const recent = [...recentById.entries()]
    .map(([id, at]) => ({ id, at }))
    .sort((x, y) => y.at.localeCompare(x.at))
    .slice(0, RECENT_LIMIT);

  const days: MemberState["programme"]["days"] = { ...a.programme.days };
  for (const [key, incoming] of Object.entries(b.programme.days)) {
    const mine = days[key];
    if (!mine) {
      days[key] = incoming;
      continue;
    }
    const completed = mine.completed || incoming.completed;
    const completedAt = [mine.completedAt, incoming.completedAt].filter(Boolean).sort()[0];
    const newerNotes = (incoming.notesAt ?? "") > (mine.notesAt ?? "") ? incoming : mine;
    days[key] = {
      completed,
      ...(completed && completedAt ? { completedAt } : {}),
      ...(newerNotes.notes ? { notes: newerNotes.notes, notesAt: newerNotes.notesAt } : {}),
    };
  }

  const assessments = { ...a.assessments };
  for (const [k, v] of Object.entries(b.assessments)) if (!assessments[k] || assessments[k].at < v.at) assessments[k] = v;

  const lastLocation = (b.lastLocation?.at ?? "") > (a.lastLocation?.at ?? "") ? b.lastLocation : a.lastLocation;

  return {
    schemaVersion: MEMBER_SCHEMA_VERSION,
    saved: earliest(a.saved, b.saved),
    completed: earliest(a.completed, b.completed),
    recent,
    lastLocation,
    programme: { days },
    assessments,
    updatedAt: new Date().toISOString(),
  };
}
