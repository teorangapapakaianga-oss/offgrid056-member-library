import { beforeEach, describe, expect, it, vi } from "vitest";
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
