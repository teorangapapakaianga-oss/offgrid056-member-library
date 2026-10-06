import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareResource, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";
import { SAFETY_NOTES_MARKER, injectSafety, injectSafetyChecked } from "@/admin-import/pilot/run";

/**
 * Stage 9.68A — opt-in placement of a resource's TOPIC safety blocks.
 *
 * The default is unchanged (critical blocks first, the disclaimer last). A resource whose copy carries the Safety Notes
 * marker, and which asks for it, gets its topic blocks there. The emergency box and the disclaimer never move, and no
 * block is ever dropped.
 */
const BLOCKS = [
  { id: "general-disclaimer", title: "Before you start", body: "General disclaimer $1 and $& text.", severity: "STANDARD" },
  { id: "emergency-contact", title: "In an emergency", body: "Call 111.", severity: "CRITICAL" },
  { id: "batteries-and-electrical", title: "Batteries and electrical safety", body: "Use a licensed electrical worker.", severity: "CRITICAL" },
  { id: "fire-and-smoke-alarms", title: "Smoke alarms and fire safety", body: "Test your alarm.", severity: "CRITICAL" },
  { id: "gas-and-lpg-general", title: "Gas and LPG appliances", body: "Gas text.", severity: "STANDARD" },
];
const DOC = (extra = "") => `<html><head></head><body><div class="content">\n<h2>Part A</h2><p>assessment</p>\n<h2>Safety Notes</h2>${extra}\n<h2>Where Next</h2><p>next</p>\n</div></body></html>`;
const pos = (html: string, id: string) => html.indexOf(`data-block="${id}"`);

describe("Stage 9.68A · default safety placement is unchanged", () => {
  it("puts critical blocks before the content and standard blocks (the disclaimer) at the end", () => {
    const out = injectSafety(DOC(SAFETY_NOTES_MARKER), BLOCKS);
    const first = out.indexOf("<h2>Part A");
    for (const id of ["emergency-contact", "batteries-and-electrical", "fire-and-smoke-alarms"]) expect(pos(out, id), id).toBeLessThan(first);
    expect(pos(out, "general-disclaimer")).toBeGreaterThan(out.indexOf("Where Next"));
  });

  it("ignores the marker unless the resource asks for it", () => {
    const out = injectSafety(DOC(SAFETY_NOTES_MARKER), BLOCKS, {});
    expect(pos(out, "batteries-and-electrical")).toBeLessThan(out.indexOf("<h2>Part A"));
  });
});

describe("Stage 9.68A · opt-in Safety Notes placement", () => {
  const opt = { topicBlockMarker: SAFETY_NOTES_MARKER };

  it("moves the topic blocks to the marker, after the assessment content and inside the Safety Notes section", () => {
    const out = injectSafety(DOC(SAFETY_NOTES_MARKER), BLOCKS, opt);
    const notes = out.indexOf("<h2>Safety Notes");
    const next = out.indexOf("<h2>Where Next");
    for (const id of ["batteries-and-electrical", "fire-and-smoke-alarms", "gas-and-lpg-general"]) {
      expect(pos(out, id), id).toBeGreaterThan(notes);
      expect(pos(out, id), id).toBeLessThan(next);
    }
    expect(out).not.toContain(SAFETY_NOTES_MARKER);
  });

  it("never moves the emergency box (top) or the disclaimer (end)", () => {
    const out = injectSafety(DOC(SAFETY_NOTES_MARKER), BLOCKS, opt);
    expect(pos(out, "emergency-contact")).toBeLessThan(out.indexOf("<h2>Part A"));
    expect(pos(out, "general-disclaimer")).toBeGreaterThan(out.indexOf("Where Next"));
  });

  it("keeps every block's wording intact (no shortening, no replacement-pattern damage)", () => {
    const out = injectSafety(DOC(SAFETY_NOTES_MARKER), BLOCKS, opt);
    for (const b of BLOCKS) expect(out, b.id).toContain(b.body);
    expect(out).toContain("General disclaimer $1 and $& text.");
  });

  it("places every block exactly once", () => {
    const out = injectSafetyChecked(DOC(SAFETY_NOTES_MARKER), BLOCKS, opt);
    expect(out.unplaced).toEqual([]);
    expect(out.placed.sort()).toEqual(BLOCKS.map((b) => b.id).sort());
    for (const b of BLOCKS) expect((out.html.match(new RegExp(`data-block="${b.id}"`, "g")) ?? []).length, b.id).toBe(1);
  });

  it("FAILS SAFE: with no marker in the document, the blocks go to the default places and none is dropped", () => {
    const out = injectSafetyChecked(DOC(), BLOCKS, opt);
    expect(out.unplaced).toEqual([]);
    expect(pos(out.html, "batteries-and-electrical")).toBeLessThan(out.html.indexOf("<h2>Part A"));
    expect(pos(out.html, "general-disclaimer")).toBeGreaterThan(out.html.indexOf("Where Next"));
  });
});

describe("Stage 9.68A · a resource that asks for Safety Notes placement but has no marker is flagged, not trusted", () => {
  const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
  const markets = profilesFile.markets as unknown as MarketProfile[];
  const doc = (extra: string) => `<!DOCTYPE html><html><head></head><body><div class="cover-page"><div class="cover-label">OffGrid056</div><h1 class="cover-title">Checklist</h1><p class="cover-subtitle">A checklist.</p></div><div class="content"><h2>Plan</h2><p>Work through the questions.</p>${extra}</div></body></html>`;
  const prep = (html: string, placement: "safety-notes" | null) =>
    prepareResource({
      item: { legacyCode: "OG-97", proposedResourceId: "res-1097", title: "Checklist", foundation: { value: "shelter", confidence: "HIGH", evidence: [] }, resourceType: { value: "checklist", confidence: "HIGH", evidence: [] }, legacyIssues: [], legacyTerminology: [], safetyNotes: [] } as unknown as PrepInputs["item"],
      sourceHtml: html, blocks, markets, launchMarkets: ["NZ", "AU"], outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-sp-")),
      description: "A checklist to work through.", foundation: "shelter", resourceType: "checklist", category: "insulation", difficulty: "beginner", estimatedTime: 20,
      proposedBlockIds: [], extraSafetyBlocks: ["batteries-and-electrical"], safetyBlockPlacement: placement,
    });

  it("with the marker, the electrical block is inside the Safety Notes section", () => {
    const r = prep(doc(`<h2>Safety Notes</h2>${SAFETY_NOTES_MARKER}<h2>Where Next</h2>`), "safety-notes");
    const html = fs.readFileSync(r.files.find((f) => f.endsWith(".NZ.html"))!, "utf8");
    expect(html.indexOf('data-block="batteries-and-electrical"')).toBeGreaterThan(html.indexOf("<h2>Safety Notes"));
    expect(html.indexOf('data-block="emergency-contact"')).toBeLessThan(html.indexOf("<h2>Plan"));
    expect(r.markets.every((m) => m.problems.every((p) => !/SAFETY_PLACEMENT/.test(p)))).toBe(true);
  });

  it("without the marker, the blocks are still placed (by default) and the resource is held with a clear finding", () => {
    const r = prep(doc(""), "safety-notes");
    for (const m of r.markets) {
      expect(m.problems.join(" "), m.code).toMatch(/SAFETY_PLACEMENT_MARKER_MISSING/);
      expect(m.publishable, m.code).toBe(false);
    }
    const html = fs.readFileSync(r.files.find((f) => f.endsWith(".NZ.html"))!, "utf8");
    expect(html).toContain('data-block="batteries-and-electrical"');
    expect(html.indexOf('data-block="batteries-and-electrical"')).toBeLessThan(html.indexOf("<h2>Plan"));
  });

  it("a resource that does not ask for it is unaffected", () => {
    const r = prep(doc(`<h2>Safety Notes</h2>${SAFETY_NOTES_MARKER}`), null);
    const html = fs.readFileSync(r.files.find((f) => f.endsWith(".NZ.html"))!, "utf8");
    expect(html.indexOf('data-block="batteries-and-electrical"')).toBeLessThan(html.indexOf("<h2>Plan"));
  });
});