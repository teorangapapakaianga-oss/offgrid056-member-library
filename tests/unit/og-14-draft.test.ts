import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, storageDurationClaims, supplyTargets, targetLabelDurations } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.07 — OG-14 Water, Food and Air Household Snapshot: the narrowed draft (owner ruling NARROW).
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live, and it has no res-ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-14"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-14"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const text = newText.replace(/30-Day Pantry Builder/g, "").replace(/OffGrid056/g, "OffGrid");

describe("Stage 10.07 · OG-14 locked metadata", () => {
  it("is the owner's narrowed worksheet: general / resilience-planning / planning / worksheet, draft, no collection", () => {
    expect(meta).toMatchObject({ title: "Water, Food and Air Household Snapshot", foundation: "general", programComponent: "resilience-planning", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 20, recordStatus: "draft", collections: [], tags: [] });
    expect(pc.classificationsDecided["OG-14"]).toBe("resilience-planning");
    expect(PROGRAM_COMPONENTS).toContain("resilience-planning");
    expect(COLLECTION_IDS).toEqual(["start-here", "planning-tools"]);
  });

  it("carries the owner-approved description (Stage 10.08)", () => {
    expect(meta.description).toBe("A practical worksheet to help you capture what your household currently has in place across Water, Food and Air, note what still needs attention and record the key points your household should know.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.08\)/);
  });

  it("Stage 10.10: res-1014 is assigned in the deployed record only (internal routing/data), never in the review config, the member-facing copy or the PDFs", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1014");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      const og14 = recs.filter((r) => r.legacyCode === "OG-14" || r.id === "res-1014");
      expect(og14).toHaveLength(1);
      expect(og14[0]).toMatchObject({ id: "res-1014", legacyCode: "OG-14" });
      expect(recs).toHaveLength(30);
    }
  });

  it("answers all five programme-alignment questions and records the legacy metadata drift", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
    expect(String(meta.legacyMetadataDrift)).toMatch(/Food/);
    expect(String(meta.legacyMetadataDrift)).toMatch(/growing and preserving/);
    expect(String(meta.foundationStatus)).toMatch(/legacy metadata drift/);
  });

  it("has the owner-approved related list in snapshot order, ending with the Priority Lock Worksheet (Stage 10.08)", () => {
    expect(meta.relatedResources).toEqual(["res-1008", "res-1011", "res-1013", "res-1007"]);
    expect(String(meta.relatedResourcesStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.08\)/);
    expect(meta.relatedResources).toHaveLength(4);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Water Storage Calculator", "30-Day Pantry Builder", "Healthy Home Air Audit", "Priority Lock Worksheet"]);
  });

  it("carries the standing blocks only, with the two legacy topics recorded REMOVED by the owner", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d).sort()).toEqual(["fire-and-emergency", "food-safety-power-cut"]);
    for (const v of Object.values(d)) expect(v).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
    expect(meta.safetyExemptions).toBeUndefined();
  });
});

describe("Stage 10.07 · OG-14 draft copy: duplicated and legacy content is not carried", () => {
  it("has no price, currency, percentage, score, ratio or duration figure", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?)\b/i);
  });

  it("is clean under every claim family, sentence by sentence (survival, supply, emergency-period, storage-duration, target-label, multiplier, comparative, outcome, assurance)", () => {
    expect(sentences.filter((s) => isSurvivalClaimSentence(s))).toEqual([]);
    expect(sentences.filter((s) => supplyTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => emergencyPeriodTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => storageDurationClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => targetLabelDurations(s).length)).toEqual([]);
    expect(sentences.filter((s) => multiplierClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => comparativePerformanceClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => outcomeClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => assuranceClaims(s).length)).toEqual([]);
  });

  it("carries none of the removed legacy material", () => {
    const t = text.replace("nothing here is a score, a target or a guarantee", "");
    for (const re of [/Week\b|\bDay\b/, /30-Day Programme/i, /Asset OG|\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Basic Survival|Mini-Plan|surviv\w+|\bcritical\b/i, /\bpillars?\b/i, /Week 2 Lock|Focus wins/i, /\bscore\b|\btarget\b|Gap to close|Days of supply|storage:|7-day|3-day/i, /Action Lock|Priority Actions|Budget|\btier\b|\bspent\b/i, /smoke|detector|\bCO\b|alarm|filtration|Filtration/i, /Next: |Before You Move|Complete\b/]) expect(t, String(re)).not.toMatch(re);
  });

  it("teaches no technical safety topic and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
    expect(newText).not.toMatch(/alarm|detector|smoke|carbon monoxide|\bgas\b|LPG|generator|batter(?:y|ies)|electric\w*|heating|insulation|roof|structural|boil\w*|filter\w*|purif\w+|bleach|use-by|best[- ]before|spoil\w*|power cut|fridge|freezer|perishable/i);
  });

  it("is market-neutral: no agency, emergency number or jurisdiction-specific term in the body", () => {
    expect(newText).not.toMatch(/\b(111|000|112|106)\b|civil defence|\bNEMA\b|\bSES\b|\bFENZ\b|Get Ready|Food Standards|council|tenan\w+/i);
  });

  it("does not become a scorecard, risk assessment, readiness checklist, action lock, budget tool or supply target", () => {
    expect(content.to).not.toMatch(/checklist-box|lock-table|scorecard|budget/i);
    expect(text.replace(/Priority Lock Worksheet/g, "")).not.toMatch(/rank|priorit|assess/i);
    expect((content.to.match(/class="worksheet-label"/g) ?? []).length).toBe(13);
  });
});

describe("Stage 10.10 · OG-14 is deployed", () => {
  it("is in the Deployed section (not Staged or Not started) of the resource register", () => {
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr.split("## Deployed")[1].split("## Staged")[0]).toMatch(/\| OG-14 \| Water, Food and Air Household Snapshot \| general \/ worksheet \|/);
    expect(rr.split("## Staged, not deployed (1)")[1].split("## Prepared")[0]).not.toMatch(/^\| OG-14 \|/m);
    expect(rr.split("## Not started (13)")[1].split("## Route clashes")[0]).not.toMatch(/\| OG-14 \|/);
  });
});

describe("Stage 10.07 · OG-14 draft copy: the owner's structure", () => {
  it("has the new title and subtitle, and no legacy title", () => {
    expect(allNew).toContain("Water, Food and Air<br>Household Snapshot");
    expect(allNew).toContain("Capture what your household has in place across water, food and air, note what still needs attention and record the key points everyone at home should know.");
    expect(allNew).not.toMatch(/Basic Survival|Mini-Plan|Week 2 Lock/i);
  });

  it("has the sections in the recommended order", () => {
    const order = ["Why Use This Snapshot", "Before You Begin", "Water Snapshot", "Food Snapshot", "Air Snapshot", "What Needs Attention Next?", "Family Briefing Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });

  it("uses descriptive member-entered fields for each area, with no scores", () => {
    for (const x of ["What we currently have:", "Where it is kept:", "What still needs attention:", "What we currently have in place:", "What we have noticed:", "What needs attention next:"]) expect(newText, x).toContain(x);
    expect(newText).toContain("What does everyone in the household need to know?");
    expect(newText).toContain("Where are important supplies or information kept?");
    expect(newText).toContain("What should we talk through together?");
  });

  it("ends the forward handoff at the Priority Lock Worksheet, with the three areas as 'review first' and no programme pointer", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"));
    const order = ["Water Storage Calculator", "30-Day Pantry Builder", "Healthy Home Air Audit", "Priority Lock Worksheet"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect((next.match(/Review first/g) ?? []).length).toBe(3);
    expect(newText.slice(newText.lastIndexOf("Where Next"))).not.toMatch(/Week|Next: |OG-/);
  });
});
