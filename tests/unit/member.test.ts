import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSummaries } from "@/lib/content/repository";
import { overallProgress } from "@/lib/progress";
import { createBackup, parseBackup } from "@/lib/member/backup";
import { LocalMemberStore, mergeStates } from "@/lib/member/store";
import { MEMBER_CORRUPT_KEY, MEMBER_STORAGE_KEY, NOTES_MAX, RECENT_LIMIT, emptyState, type MemberState } from "@/lib/member/types";

/** Minimal localStorage stand-in; `fail` makes every write throw, as a blocked/full browser does. */
class FakeStorage {
  map = new Map<string, string>();
  fail = false;
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    if (this.fail) throw new Error("storage blocked");
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

function install(storage = new FakeStorage()) {
  vi.stubGlobal("window", { localStorage: storage, addEventListener: () => {} });
  return storage;
}

const read = (s: FakeStorage): MemberState => JSON.parse(s.getItem(MEMBER_STORAGE_KEY)!);

describe("LocalMemberStore", () => {
  let storage: FakeStorage;
  let store: LocalMemberStore;

  beforeEach(async () => {
    storage = install();
    store = new LocalMemberStore();
    await store.load();
  });

  it("starts empty and reports that it is ready", () => {
    const v = store.getSnapshot();
    expect(v.ready).toBe(true);
    expect(v.storage).toBe("local");
    expect(v.savedIds.size).toBe(0);
    expect(v.completedIds.size).toBe(0);
  });

  it("saves and unsaves, persisting under the approved key", async () => {
    await store.setSaved("res-0001", true);
    expect(store.getSnapshot().savedIds.has("res-0001")).toBe(true);
    expect(Object.keys(read(storage).saved)).toEqual(["res-0001"]);
    await store.setSaved("res-0001", false);
    expect(store.getSnapshot().savedIds.size).toBe(0);
    expect(read(storage).saved).toEqual({});
  });

  it("records completion with a timestamp and notifies subscribers", async () => {
    const seen = vi.fn();
    store.subscribe(seen);
    await store.setCompleted("res-0002", true);
    expect(seen).toHaveBeenCalled();
    expect(read(storage).completed["res-0002"]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("keeps recently viewed unique, newest first, and capped", async () => {
    for (let i = 1; i <= RECENT_LIMIT + 5; i++) await store.recordView(`res-${String(i).padStart(4, "0")}`);
    await store.recordView("res-0003");
    const { recent, lastLocation } = store.getSnapshot().state;
    expect(recent).toHaveLength(RECENT_LIMIT);
    expect(recent[0].id).toBe("res-0003");
    expect(recent.filter((r) => r.id === "res-0003")).toHaveLength(1);
    expect(lastLocation).toMatchObject({ kind: "resource", id: "res-0003" });
  });

  it("tracks programme days and notes, and tidies empty days away", async () => {
    await store.setDayCompleted(3, true);
    await store.setDayNotes(3, "Checked the tank");
    expect(store.getSnapshot().state.programme.days["3"]).toMatchObject({ completed: true, notes: "Checked the tank" });
    await store.setDayCompleted(3, false);
    expect(store.getSnapshot().state.programme.days["3"].notes).toBe("Checked the tank");
    await store.setDayNotes(3, "");
    expect(store.getSnapshot().state.programme.days["3"]).toBeUndefined();
  });

  it("truncates notes at the documented limit", async () => {
    await store.setDayNotes(1, "x".repeat(NOTES_MAX + 500));
    expect(store.getSnapshot().state.programme.days["1"].notes).toHaveLength(NOTES_MAX);
  });

  it("recovers from damaged data instead of crashing, keeping a copy", async () => {
    storage.map.set(MEMBER_STORAGE_KEY, "{not json");
    const s2 = new LocalMemberStore();
    const v = await s2.load();
    expect(v.ready).toBe(true);
    expect(v.recovered).toBe(true);
    expect(v.savedIds.size).toBe(0);
    expect(storage.getItem(MEMBER_CORRUPT_KEY)).toBe("{not json");
  });

  it("rejects a document with the wrong shape or an unknown version", async () => {
    storage.map.set(MEMBER_STORAGE_KEY, JSON.stringify({ schemaVersion: 99, saved: { "res-0001": "2026-01-01T00:00:00Z" } }));
    const v = await new LocalMemberStore().load();
    expect(v.recovered).toBe(true);
    expect(v.savedIds.size).toBe(0);
  });

  it("never writes over stored progress with an empty document when an action fires before loading", async () => {
    // Regression: opening a resource records the view on mount, which used to race the first load.
    storage.map.set(
      MEMBER_STORAGE_KEY,
      JSON.stringify({ ...emptyState(), saved: { "res-0014": "2026-09-01T00:00:00Z" }, completed: { "res-0002": "2026-09-01T00:00:00Z" } }),
    );
    const fresh = new LocalMemberStore();
    await fresh.recordView("res-0022"); // no load() call first, exactly as the mount effect does
    const stored = read(storage);
    expect(Object.keys(stored.saved)).toEqual(["res-0014"]);
    expect(Object.keys(stored.completed)).toEqual(["res-0002"]);
    expect(stored.recent[0].id).toBe("res-0022");
  });

  it("keeps working when the browser blocks storage", async () => {
    const blocked = install(Object.assign(new FakeStorage(), { fail: true }));
    const s2 = new LocalMemberStore();
    const v = await s2.load();
    expect(v.storage).toBe("memory");
    await s2.setSaved("res-0001", true);
    expect(s2.getSnapshot().savedIds.has("res-0001")).toBe(true); // works for this visit
    expect(blocked.getItem(MEMBER_STORAGE_KEY)).toBeNull(); // but nothing is written
  });
});

describe("backup and restore", () => {
  const state: MemberState = {
    ...emptyState(new Date("2026-09-20T00:00:00Z")),
    saved: { "res-0001": "2026-09-10T00:00:00Z" },
    completed: { "res-0002": "2026-09-11T00:00:00Z" },
    recent: [{ id: "res-0002", at: "2026-09-11T00:00:00Z" }],
    programme: { days: { "1": { completed: true, completedAt: "2026-09-12T00:00:00Z", notes: "done", notesAt: "2026-09-12T00:00:00Z" } } },
  };

  it("round-trips a backup file", () => {
    const text = JSON.stringify(createBackup(state, new Date("2026-09-20T10:00:00Z")));
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.summary).toMatchObject({ saved: 1, completed: 1, programmeDays: 1, notes: 1 });
    expect(result.backup.state).toEqual(state);
  });

  it.each([
    ["not json at all", "hello"],
    ["another app's file", JSON.stringify({ format: "something.else", version: 1 })],
    ["a newer backup version", JSON.stringify({ format: "og056.member.backup", version: 2, app: "x", exportedAt: "2026-09-20T00:00:00Z", state })],
    ["a damaged state", JSON.stringify({ format: "og056.member.backup", version: 1, app: "x", exportedAt: "2026-09-20T00:00:00Z", state: { ...state, saved: { nope: 1 } } })],
    ["a day outside 1–30", JSON.stringify({ format: "og056.member.backup", version: 1, app: "x", exportedAt: "2026-09-20T00:00:00Z", state: { ...state, programme: { days: { "99": { completed: true } } } } })],
  ])("refuses %s with a readable reason", (_label, text) => {
    const result = parseBackup(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.length).toBeGreaterThan(10);
  });

  it("merge keeps existing progress and the earliest completion dates", () => {
    const mine: MemberState = {
      ...emptyState(),
      saved: { "res-0009": "2026-09-01T00:00:00Z" },
      completed: { "res-0002": "2026-09-15T00:00:00Z" },
      programme: { days: { "1": { completed: false, notes: "mine", notesAt: "2026-09-19T00:00:00Z" } } },
    };
    const merged = mergeStates(mine, state);
    expect(Object.keys(merged.saved).sort()).toEqual(["res-0001", "res-0009"]);
    expect(merged.completed["res-0002"]).toBe("2026-09-11T00:00:00Z"); // earliest wins
    expect(merged.programme.days["1"]).toMatchObject({ completed: true, notes: "mine" }); // newer notes win
  });

  // Locked at Stage 4: the field-level merge rules, one test each.
  describe("locked merge rules", () => {
    const at = (iso: string) => iso;
    const base = (over: Partial<MemberState> = {}): MemberState => ({ ...emptyState(new Date("2026-09-20T00:00:00Z")), ...over });

    it("1. saved/completed keep the earliest valid date, even across time zones", () => {
      const mine = base({ saved: { "res-0001": at("2026-09-20T09:00:00+12:00") }, completed: { "res-0002": at("2026-09-18T00:00:00Z") } });
      const backup = base({ saved: { "res-0001": at("2026-09-19T23:00:00Z") }, completed: { "res-0002": at("2026-09-10T00:00:00Z") } });
      const m = mergeStates(mine, backup);
      // 2026-09-20T09:00+12:00 IS 2026-09-19T21:00Z, i.e. earlier than 23:00Z, despite sorting later as text
      expect(m.saved["res-0001"]).toBe("2026-09-20T09:00:00+12:00");
      expect(m.completed["res-0002"]).toBe("2026-09-10T00:00:00Z");
    });

    it("1b. an unparseable date never wins", () => {
      const mine = base({ completed: { "res-0002": "2026-13-45T99:00:00Z" } });
      const backup = base({ completed: { "res-0002": at("2026-09-10T00:00:00Z") } });
      expect(mergeStates(mine, backup).completed["res-0002"]).toBe("2026-09-10T00:00:00Z");
    });

    it("2. completion stays true if either side has it, for resources and programme days", () => {
      const mine = base({ programme: { days: { "4": { completed: false } } } });
      const backup = base({ completed: { "res-0005": at("2026-09-01T00:00:00Z") }, programme: { days: { "4": { completed: true, completedAt: at("2026-09-02T00:00:00Z") } } } });
      const m = mergeStates(mine, backup);
      expect(m.completed["res-0005"]).toBeDefined();
      expect(m.programme.days["4"]).toMatchObject({ completed: true, completedAt: "2026-09-02T00:00:00Z" });
      // and the other way round
      expect(mergeStates(backup, mine).programme.days["4"].completed).toBe(true);
    });

    it("3. the newest timestamped note wins, and a timed note beats an untimed one", () => {
      const older = base({ programme: { days: { "3": { completed: true, notes: "older", notesAt: at("2026-09-10T00:00:00Z") } } } });
      const newer = base({ programme: { days: { "3": { completed: true, notes: "newer", notesAt: at("2026-09-19T00:00:00Z") } } } });
      expect(mergeStates(older, newer).programme.days["3"].notes).toBe("newer");
      expect(mergeStates(newer, older).programme.days["3"].notes).toBe("newer");
      const untimed = base({ programme: { days: { "3": { completed: true, notes: "no timestamp" } } } });
      expect(mergeStates(untimed, older).programme.days["3"].notes).toBe("older");
    });

    it("4. recent items are de-duplicated, newest first and capped at 20", () => {
      const many = (offset: number) =>
        Array.from({ length: 15 }, (_, i) => ({ id: `res-${String(i + offset).padStart(4, "0")}`, at: new Date(Date.UTC(2026, 8, 1 + i + offset)).toISOString() }));
      const mine = base({ recent: [...many(1), { id: "res-0001", at: at("2026-09-01T00:00:00Z") }] });
      const backup = base({ recent: [...many(10), { id: "res-0001", at: at("2026-09-19T00:00:00Z") }] });
      const m = mergeStates(mine, backup);
      expect(m.recent).toHaveLength(RECENT_LIMIT);
      expect(new Set(m.recent.map((r) => r.id)).size).toBe(m.recent.length);
      expect(m.recent.map((r) => Date.parse(r.at))).toEqual([...m.recent.map((r) => Date.parse(r.at))].sort((x, y) => y - x));
      expect(m.recent.find((r) => r.id === "res-0001")?.at).toBe("2026-09-19T00:00:00Z"); // newest entry per resource
    });

    it("5. ids the library no longer has are preserved, and ignored by views and progress", () => {
      const retired = "res-9999";
      const mine = base({ saved: { [retired]: at("2026-09-01T00:00:00Z") }, completed: { [retired]: at("2026-09-01T00:00:00Z") } });
      const m = mergeStates(mine, base({ saved: { "res-0001": at("2026-09-02T00:00:00Z") } }));
      expect(m.saved[retired]).toBeDefined(); // kept, never silently dropped
      // progress counts only resources that exist in the content
      const items = getSummaries();
      const completedIds = new Set(Object.keys(m.completed));
      const overall = overallProgress(items, completedIds);
      expect(overall.completed).toBe(0);
      expect(overall.percent).toBe(0);
      // and nothing in the library resolves it to a link
      expect(items.some((r) => r.id === retired)).toBe(false);
    });

    it("6. lastLocation: the newest timestamp wins, whichever side it is on", () => {
      const browser = base({ lastLocation: { kind: "resource", id: "res-0014", at: at("2026-09-20T02:00:00Z") } });
      const backup = base({ lastLocation: { kind: "programme-day", id: "9", at: at("2026-09-19T08:00:00Z") } });
      expect(mergeStates(browser, backup).lastLocation).toMatchObject({ id: "res-0014", kind: "resource" });
      expect(mergeStates(backup, browser).lastLocation).toMatchObject({ id: "res-0014" });
      const newerBackup = base({ lastLocation: { kind: "programme-day", id: "12", at: at("2026-09-21T00:00:00Z") } });
      expect(mergeStates(browser, newerBackup).lastLocation).toMatchObject({ id: "12", kind: "programme-day" });
      // one side empty
      expect(mergeStates(base(), browser).lastLocation).toMatchObject({ id: "res-0014" });
      expect(mergeStates(browser, base()).lastLocation).toMatchObject({ id: "res-0014" });
    });

    it("6b. a stored location without a timestamp is repaired instead of resetting everything", async () => {
      const storage = install();
      storage.map.set(
        MEMBER_STORAGE_KEY,
        JSON.stringify({ ...emptyState(), saved: { "res-0014": "2026-09-01T00:00:00Z" }, lastLocation: { kind: "resource", id: "res-0014" } }),
      );
      const v = await new LocalMemberStore().load();
      expect(v.recovered).toBe(false); // progress kept
      expect(v.savedIds.has("res-0014")).toBe(true);
      expect(v.state.lastLocation).toBeNull(); // only the unusable field is dropped
    });
  });

  it("replace uses the backup exactly", async () => {
    install();
    const store = new LocalMemberStore();
    await store.load();
    await store.setSaved("res-0009", true);
    await store.importState(state, "replace");
    expect([...store.getSnapshot().savedIds]).toEqual(["res-0001"]);
  });

  it("merge through the store never drops what is already there", async () => {
    install();
    const store = new LocalMemberStore();
    await store.load();
    await store.setSaved("res-0009", true);
    await store.importState(state, "merge");
    expect([...store.getSnapshot().savedIds].sort()).toEqual(["res-0001", "res-0009"]);
  });
});
