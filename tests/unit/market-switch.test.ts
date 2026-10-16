import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { editionForMarket } from "@/lib/content/companions";
import { LocalMemberStore } from "@/lib/member/store";
import { MEMBER_STORAGE_KEY, type MemberState } from "@/lib/member/types";

/**
 * Stage 11.0K usability fix — changing country from a market-specific download panel.
 *
 * Cause: the only control was the sidebar indicator (desktop only, at the foot of a scrolling sidebar), so a member who chose New Zealand could not find how to
 * switch. The store and the file selection already worked; these tests lock that behaviour, and the source test locks the new in-panel control.
 */
class FakeStorage {
  map = new Map<string, string>();
  getItem(k: string) { return this.map.get(k) ?? null; }
  setItem(k: string, v: string) { this.map.set(k, v); }
  removeItem(k: string) { this.map.delete(k); }
}
const install = (s = new FakeStorage()) => { vi.stubGlobal("window", { localStorage: s, addEventListener: () => {} }); return s; };
const stored = (s: FakeStorage) => (JSON.parse(s.getItem(MEMBER_STORAGE_KEY)!) as MemberState).market?.code;

const files = { NZ: { fileUrl: "/resources/x.NZ.pdf" }, AU: { fileUrl: "/resources/x.AU.pdf" } };
const companions = { NZ: { fileUrl: "/resources/x.NZ.docx", format: "DOCX", sizeBytes: 1 }, AU: { fileUrl: "/resources/x.AU.docx", format: "DOCX", sizeBytes: 2 } };
const pair = (m: "NZ" | "AU" | null) => { const e = editionForMarket(files, companions, m); return e && [e.file.fileUrl, e.companion?.fileUrl]; };

describe("PDF and editable version change together, and only ever for the chosen country", () => {
  it("NZ → AU → NZ", () => {
    expect(pair("NZ")).toEqual(["/resources/x.NZ.pdf", "/resources/x.NZ.docx"]);
    expect(pair("AU")).toEqual(["/resources/x.AU.pdf", "/resources/x.AU.docx"]);
    expect(pair("NZ")).toEqual(["/resources/x.NZ.pdf", "/resources/x.NZ.docx"]);
  });
  it("never mixes editions: the PDF and DOCX always carry the same market code", () => {
    for (const m of ["NZ", "AU"] as const) { const [pdf, docx] = pair(m)!; expect(pdf).toContain(`.${m}.`); expect(docx).toContain(`.${m}.`); }
  });
  it("offers nothing without a market, and never falls back to the other country", () => {
    expect(pair(null)).toBeNull();
    expect(editionForMarket({ NZ: files.NZ }, companions, "AU")).toBeNull();
    expect(editionForMarket(files, { NZ: companions.NZ }, "AU")?.companion).toBeNull(); // no AU editable version: none is shown, and not the NZ one
  });
});

describe("the chosen country is stored and survives a reload", () => {
  let storage: FakeStorage;
  beforeEach(() => { storage = install(); });
  it("NZ → AU → NZ, each change persisted and read back by a fresh store (a page reload)", async () => {
    const store = new LocalMemberStore();
    await store.load();
    await store.setMarket("NZ");
    expect(stored(storage)).toBe("NZ");
    expect((await new LocalMemberStore().load()).state.market?.code).toBe("NZ");
    await store.setMarket("AU");
    expect(stored(storage)).toBe("AU");
    expect((await new LocalMemberStore().load()).state.market?.code).toBe("AU");
    await store.setMarket("NZ");
    expect(stored(storage)).toBe("NZ");
    expect((await new LocalMemberStore().load()).state.market?.code).toBe("NZ");
  });
  it("no market is ever inferred: a fresh browser has none", async () => {
    expect((await new LocalMemberStore().load()).state.market).toBeFalsy();
  });
});

describe("the visible 'Change country' control is part of the download panel", () => {
  const src = (f: string) => readFileSync(path.join(process.cwd(), f), "utf8");
  it("is rendered inside MarketDownload for a chosen country and inside the 'not available' state", () => {
    expect(src("components/resources/market-download.tsx")).toMatch(/<MarketSwitcher/);
    const gate = src("components/member/market-controls.tsx");
    expect(gate).toMatch(/Change country/);
    expect(gate.slice(gate.indexOf("export function MarketGate"))).toMatch(/<MarketSwitcher/); // the unavailable-for-this-market branch
    expect(gate).toMatch(/Choose your country/);
  });
  it("shows only when a country is chosen, and writes the same stored choice as the sidebar", () => {
    const sw = src("components/member/market-controls.tsx");
    const body = sw.slice(sw.indexOf("export function MarketSwitcher"), sw.indexOf("export function MarketChooser"));
    expect(body).toMatch(/if \(!view\.ready \|\| !market\) return null/);
    expect(body).toMatch(/memberStore\.setMarket\(code\)/);
    expect(body).toMatch(/MarketButtons/);
  });
  it("is used by every market-specific download: MarketDownload is the only component that renders marketFiles", () => {
    expect(src("app/resources/[slug]/page.tsx")).toMatch(/<MarketDownload/);
    expect(src("app/resources/[slug]/page.tsx").match(/<MarketDownload/g)).toHaveLength(1);
  });
});
