import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBackup, parseBackup } from "@/lib/member/backup";
import { isMarketCode, MARKETS, MARKET_CODES, marketName } from "@/lib/member/market";
import { LocalMemberStore, mergeStates } from "@/lib/member/store";
import { MEMBER_STORAGE_KEY, emptyState, type MemberState } from "@/lib/member/types";
import { checkMemberState } from "@/lib/member/validate";

/**
 * The market layer decides which emergency number a member is shown. Most of these tests are therefore about
 * what must NOT happen: no guessing, no falling back to another country, and no existing member's progress
 * being disturbed by the field's arrival.
 */
class FakeStorage {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
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

describe("the markets on offer", () => {
  it("offers New Zealand and Australia, and nothing not yet verified", () => {
    expect(MARKET_CODES).toEqual(["NZ", "AU"]);
    expect(MARKETS.map((m) => m.name)).toEqual(["New Zealand", "Australia"]);
    expect(isMarketCode("US")).toBe(false); // designed for, not yet offered
    expect(isMarketCode("nz")).toBe(false); // exact codes only
    expect(marketName("AU")).toBe("Australia");
  });
});

describe("first visit", () => {
  let storage: FakeStorage;
  let store: LocalMemberStore;

  beforeEach(async () => {
    storage = install();
    store = new LocalMemberStore();
    await store.load();
  });

  it("starts with no market, so nothing market-dependent can be shown yet", () => {
    expect(store.getSnapshot().state.market).toBeNull();
  });

  it("records a New Zealand choice with the time it was made", async () => {
    await store.setMarket("NZ");
    const m = store.getSnapshot().state.market;
    expect(m?.code).toBe("NZ");
    expect(Number.isNaN(Date.parse(m!.at))).toBe(false);
    expect(read(storage).market?.code).toBe("NZ");
  });

  it("records an Australian choice", async () => {
    await store.setMarket("AU");
    expect(read(storage).market?.code).toBe("AU");
  });

  it("switches market when the member changes it, and keeps their progress", async () => {
    await store.setSaved("res-0001", true);
    await store.setMarket("NZ");
    await store.setMarket("AU");

    const state = store.getSnapshot().state;
    expect(state.market?.code).toBe("AU");
    expect(Object.keys(state.saved)).toEqual(["res-0001"]); // untouched by the switch
  });

  it("persists across a restart of the store", async () => {
    await store.setMarket("AU");
    const reopened = new LocalMemberStore();
    await reopened.load();
    expect(reopened.getSnapshot().state.market?.code).toBe("AU");
  });
});

describe("state written before markets existed", () => {
  it("loads untouched, and reads as 'not chosen yet'", async () => {
    const storage = install();
    // Exactly what a Stage 4 browser saved: no `market` key at all.
    const old = { ...emptyState(), saved: { "res-0007": "2026-01-01T00:00:00.000Z" } } as Record<string, unknown>;
    delete old.market;
    storage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(old));

    const store = new LocalMemberStore();
    const view = await store.load();

    expect(view.recovered).toBe(false); // NOT treated as damaged
    expect(view.state.market).toBeNull();
    expect(view.state.saved["res-0007"]).toBe("2026-01-01T00:00:00.000Z"); // progress intact
  });

  it("is accepted by validation, because the field is optional", () => {
    const old = { ...emptyState() } as Record<string, unknown>;
    delete old.market;
    expect(checkMemberState(old).ok).toBe(true);
  });
});

describe("an invalid stored market", () => {
  it("is rejected by validation rather than trusted", () => {
    const bad = { ...emptyState(), market: { code: "XX", at: new Date().toISOString() } };
    const result = checkMemberState(bad);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.path).toBe("state.market.code");
  });

  it("is rejected when the timestamp is nonsense", () => {
    const bad = { ...emptyState(), market: { code: "NZ", at: "whenever" } };
    expect(checkMemberState(bad).ok).toBe(false);
  });

  it("is rejected when it carries unexpected keys", () => {
    const bad = { ...emptyState(), market: { code: "NZ", at: new Date().toISOString(), lat: -41.3 } };
    expect(checkMemberState(bad).ok).toBe(false); // no location smuggled in alongside
  });

  it("causes the damaged document to be recovered, not silently half-loaded", async () => {
    const storage = install();
    storage.setItem(MEMBER_STORAGE_KEY, JSON.stringify({ ...emptyState(), market: { code: "FR", at: new Date().toISOString() } }));
    const view = await new LocalMemberStore().load();
    expect(view.recovered).toBe(true);
    expect(view.state.market).toBeNull();
  });
});

describe("backup and restore", () => {
  it("carries the market in a backup", async () => {
    const storage = install();
    const store = new LocalMemberStore();
    await store.load();
    await store.setMarket("AU");

    const backup = createBackup(await store.exportState());
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed.ok).toBe(true);
    expect(parsed.ok && parsed.backup.state.market?.code).toBe("AU");
    void storage;
  });

  it("restores a market from a backup made before markets existed, without failing", () => {
    const old = { ...emptyState() } as Record<string, unknown>;
    delete old.market;
    const backup = createBackup(old as unknown as MemberState);
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed.ok).toBe(true);
    expect(parsed.ok && (parsed.backup.state.market ?? null)).toBeNull();
  });
});

describe("merging two devices (rule 7)", () => {
  const withMarket = (code: "NZ" | "AU", at: string): MemberState => ({ ...emptyState(), market: { code, at } });

  it("keeps the newest deliberate choice", () => {
    const older = withMarket("NZ", "2026-01-01T00:00:00.000Z");
    const newer = withMarket("AU", "2026-06-01T00:00:00.000Z");
    expect(mergeStates(older, newer).market?.code).toBe("AU");
    expect(mergeStates(newer, older).market?.code).toBe("AU"); // order must not matter
  });

  it("never unsets a chosen market by merging one that was never chosen", () => {
    const chosen = withMarket("NZ", "2026-01-01T00:00:00.000Z");
    const neverChose = emptyState();
    expect(mergeStates(chosen, neverChose).market?.code).toBe("NZ");
    expect(mergeStates(neverChose, chosen).market?.code).toBe("NZ");
  });

  it("leaves it unset when neither side ever chose", () => {
    expect(mergeStates(emptyState(), emptyState()).market).toBeNull();
  });

  it("compares as instants, so a different time zone does not win on string order", () => {
    // Later in real time, but sorts earlier as text.
    const nzEarlier = withMarket("NZ", "2026-06-01T23:00:00.000+12:00"); // 11:00Z
    const auLater = withMarket("AU", "2026-06-01T20:00:00.000Z");
    expect(mergeStates(nzEarlier, auLater).market?.code).toBe("AU");
  });

  it("does not disturb the other Stage 4 merge rules", () => {
    const a: MemberState = { ...emptyState(), market: { code: "NZ", at: "2026-01-01T00:00:00.000Z" }, saved: { "res-0001": "2026-03-01T00:00:00.000Z" } };
    const b: MemberState = { ...emptyState(), market: { code: "AU", at: "2026-02-01T00:00:00.000Z" }, saved: { "res-0001": "2026-01-15T00:00:00.000Z" } };
    const merged = mergeStates(a, b);
    expect(merged.market?.code).toBe("AU"); // newest choice
    expect(merged.saved["res-0001"]).toBe("2026-01-15T00:00:00.000Z"); // rule 1: earliest date still wins
  });
});

describe("no location is ever collected", () => {
  it("stores only a market code and a timestamp", async () => {
    const storage = install();
    const store = new LocalMemberStore();
    await store.load();
    await store.setMarket("NZ");

    const stored = read(storage);
    expect(Object.keys(stored.market!).sort()).toEqual(["at", "code"]);
    const asText = JSON.stringify(stored);
    for (const forbidden of ["lat", "lon", "latitude", "longitude", "geo", "ip", "coords", "timezone"]) {
      expect(asText.toLowerCase()).not.toContain(forbidden);
    }
  });
});
