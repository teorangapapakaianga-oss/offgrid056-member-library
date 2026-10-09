import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, storageDurationClaims, supplyTargets } from "@/admin-import/audit/numeric";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.02C — OG-12 Pantry Rotation Tracker: the narrowed draft.
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live, and it has no res-ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-12"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-12"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);

describe("Stage 10.02C · OG-12 locked metadata", () => {
  it("is the owner's narrowed template, as a draft with no collection", () => {
    expect(meta).toMatchObject({ title: "Pantry Rotation Tracker", foundation: "food", programComponent: "resilience-emergency", category: "food-storage", resourceType: "template", difficulty: "beginner", estimatedTime: 15, recordStatus: "draft", collections: [], tags: [] });
    expect(pc.classificationsDecided["OG-12"]).toBe("resilience-emergency");
    expect(PROGRAM_COMPONENTS).toContain("resilience-emergency");
    expect(COLLECTION_IDS).toEqual(["start-here", "planning-tools"]);
  });

  it("carries the owner-approved description (Stage 10.03)", () => {
    expect(meta.description).toBe("A reusable tracker to help you note what is in your pantry, where it is kept and what date information is shown, so you can see which items you want to use first.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.03\)/);
    for (const k of ["trackerStatus", "monthlyWordingStatus", "rotationWordingStatus", "coverStatus", "relatedResourcesStatus", "approvedSafetyBlocksStatus"]) expect(String(meta[k]), k).toMatch(/OWNER-APPROVED 2026-10-09 \(Stage 10\.03/);
    expect(String(meta.description)).not.toMatch(/FIFO|week|day 12|expir|shelf|fresh|safe/i);
  });

  it("Stage 10.04: res-1012 is assigned in the staged record only (internal routing/data), never in the review config, the member-facing copy or the PDFs", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1012");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      const og12 = recs.filter((r) => r.legacyCode === "OG-12" || r.id === "res-1012");
      expect(og12).toHaveLength(1);
      expect(og12[0]).toMatchObject({ id: "res-1012", legacyCode: "OG-12" });
      expect(recs).toHaveLength(30);
    }
  });

  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });

  it("has the owner-approved related list: the 30-Day Pantry Builder first, then the Emergency Readiness Checklist", () => {
    expect(meta.relatedResources).toEqual(["res-1011", "res-1006"]);
    expect(meta.relatedResources).toHaveLength(2);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["30-Day Pantry Builder", "Emergency Readiness Checklist"]);
  });

  it("carries the approved food-safety-power-cut block (owner Option A) plus the standing blocks, with no disposition, exemption or other technical block", () => {
    expect(meta.safetyBlocks).toEqual(["food-safety-power-cut"]);
    expect(meta.approvedSafetyBlocks).toEqual(["food-safety-power-cut"]);
    expect(meta.safetyTopicDispositions).toBeUndefined();
    expect(meta.safetyExemptions).toBeUndefined();
  });
});

describe("Stage 10.02C · OG-12 draft copy: the legacy structure and claims are not carried", () => {
  it("has no price, currency, percentage, shelf-life duration, supply period or schedule figure", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%/);
    expect(newText.replace(/30-Day Pantry Builder/g, "")).not.toMatch(/\b\d+\s?(?:hours?|days?|weeks?|months?|years?|minutes?)\b|\b(?:hours?|days?|weeks?|years?)\b/i);
  });

  it("is clean under every claim family, sentence by sentence (survival, supply, emergency-period, storage-duration, multiplier, comparative, outcome)", () => {
    expect(sentences.filter((s) => isSurvivalClaimSentence(s))).toEqual([]);
    expect(sentences.filter((s) => supplyTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => emergencyPeriodTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => storageDurationClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => multiplierClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => comparativePerformanceClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => outcomeClaims(s).length)).toEqual([]);
  });

  it("carries none of the removed legacy material", () => {
    const text = newText.replace(/30-Day Pantry Builder/g, "");
    for (const re of [/Week\b|\bDay\b/, /30-Day Programme/i, /Asset OG-12|\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM/i, /FIFO|first in, first out|golden rule|Pro Tip|one-in-one-out/i, /shelf[- ]life|30-day supply|3 months|years|months/i, /eliminat|perpetually|saves money|indefinite|No more waste|stops waste|still safe|gone bad|signs/i, /Exp\. Date|Expiry Date|Quantity Left/i, /Next:|Day 12 Complete|Healthy Home Air/i]) expect(text, String(re)).not.toMatch(re);
  });

  it("teaches no food safety: no use-by or best-before rule, spoilage, temperature or power-cut wording (OG-11 owns it)", () => {
    expect(newText).not.toMatch(/use-by|best[- ]before|spoil\w*|safe to eat|unsafe|bulging|swollen|rust\w*|temperature|power cut|power goes|refrigerat\w*|fridge|freezer|defrost\w*|throw (?:it )?out|food poisoning|bacteria/i);
    expect(newText).toContain("For date labels and food safety, see the 30-Day Pantry Builder.");
  });

  it("is market-neutral: no agency, emergency number or jurisdiction-specific term in the body", () => {
    expect(newText).not.toMatch(/\b(111|000|112|106)\b|civil defence|\bNEMA\b|\bSES\b|\bFENZ\b|Get Ready|Food Standards|council|tenan\w+/i);
  });
});

describe("Stage 10.02C · OG-12 draft copy: the owner's structure", () => {
  it("has the new title and subtitle", () => {
    expect(allNew).toContain("Pantry Rotation<br>Tracker");
    expect(allNew).toContain("A reusable tracker to note what is in your pantry, where it is kept and what you want to use next.");
    expect(allNew).not.toMatch(/FIFO Rotation/i);
  });

  it("has the sections in the recommended order", () => {
    const order = ["Why Use This Tracker", "How to Use It", "Your Pantry Rotation Tracker", "Quick Pantry Check", "Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });

  it("has exactly the six owner columns, and never the generic Exp. Date or Expiry Date heading", () => {
    expect(content.to).toMatch(/<th class="t-item">Item<\/th><th class="t-qty">Quantity<\/th><th class="t-loc">Stored Location<\/th><th class="t-add">Added \/ Bought<\/th><th class="t-lab">Date Label \(as shown\)<\/th><th class="t-note">Use Next \/ Notes<\/th>/);
    expect((content.to.match(/<th[ >]/g) ?? []).length).toBe(6 + 3); // six tracker columns, three in Where Next
    expect(content.to).not.toMatch(/Exp\. Date|Expiry Date/);
  });

  it("uses the approved rotation concept and the reusable-check wording with five check items", () => {
    expect(newText).toContain("Put older items where they are easier to reach and use them before newer items where appropriate.");
    expect(newText).toContain("Use this tracker whenever you check your pantry. If a monthly routine suits your household, use the same tracker each month.");
    for (const x of ["Update the quantities.", "Move older items forward.", "Note the items you want to use next.", "Add newly bought items.", "Check the packaging and the date label shown on the item."]) expect(newText).toContain(x);
    expect((content.to.match(/class="checklist-box"/g) ?? []).length).toBe(5);
  });

  it("points on: the 30-Day Pantry Builder first, then the Emergency Readiness Checklist, with no programme pointer", () => {
    const next = newText.slice(newText.lastIndexOf("Where Next"));
    expect(next.indexOf("30-Day Pantry Builder")).toBeGreaterThanOrEqual(0);
    expect(next.indexOf("30-Day Pantry Builder")).toBeLessThan(next.indexOf("Emergency Readiness Checklist"));
  });
});

describe("Stage 10.04 · registers", () => {
  it("OG-12 is deployed (not in Not started or Staged) and the counts are as locked", () => {
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr.split("## Not started (13)")[1].split("## Route clashes")[0]).not.toMatch(/\| OG-12 \|/);
    expect(rr.split("## Deployed")[1].split("## Staged")[0]).toMatch(/\| OG-12 \| Pantry Rotation Tracker \| food \/ template \|/);
    expect(rr.split("## Staged, not deployed (0)")[1].split("## Prepared")[0]).not.toMatch(/^\| OG-12 \|/m);
    expect(rr).toMatch(/\*\*Not started\*\*[^\n]*\*\*13\*\*/);
  });
});
