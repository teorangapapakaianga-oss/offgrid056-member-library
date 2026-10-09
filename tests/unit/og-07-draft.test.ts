import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, supplyTargets } from "@/admin-import/audit/numeric";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 9.97 — OG-07 Priority Lock Worksheet: the narrowed draft.
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live, and it has no res-ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-07"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-07"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);

describe("Stage 9.97 · OG-07 locked metadata", () => {
  it("is the owner's narrowed worksheet, as a draft with no collection", () => {
    expect(meta).toMatchObject({ title: "Priority Lock Worksheet", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 15, recordStatus: "draft", collections: [], tags: [] });
    expect(pc.classificationsDecided["OG-07"]).toBe("planning-implementation");
    expect(PROGRAM_COMPONENTS).toContain("planning-implementation");
    expect(COLLECTION_IDS).toEqual(["start-here", "planning-tools"]);
  });

  it("carries the owner-approved description (Stage 9.98), with no programme or performance wording", () => {
    expect(meta.description).toBe("A practical worksheet to help you turn your assessment and planning results into three clear first actions, set a target date for each and decide what you will start with.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-08 \(Stage 9\.98\)/);
    for (const k of ["priorityTableStatus", "reflectionStatus", "commitmentStatus", "coverStatus", "relatedResourcesStatus"]) expect(String(meta[k]), k).toMatch(/OWNER-APPROVED 2026-10-08 \(Stage 9\.98\)/);
    expect(String(meta.description)).not.toMatch(/week|day 7|pillar|72/i);
  });

  it("Stage 10.00: res-1007 is assigned in the deployed record only (internal routing/data), never in the review config, the member-facing copy or the PDFs", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1007");
    expect(JSON.stringify(meta), "OG-07 review entry").not.toContain("res-1007"); // other records may link to it in relatedResources (Stage 10.07: the OG-14 related-list recommendation)
    expect(allNew).not.toContain("res-1007");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      const og07 = recs.filter((r) => r.legacyCode === "OG-07" || r.id === "res-1007");
      expect(og07).toHaveLength(1);
      expect(og07[0]).toMatchObject({ id: "res-1007", legacyCode: "OG-07" });
      expect(recs).toHaveLength(30);
    }
  });

  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });

  it("has the owner-approved five related resources, in the journey order (not res-1004, res-1006 or res-1015)", () => {
    expect(meta.relatedResources).toEqual(["res-1001", "res-1002", "res-1003", "res-1026", "res-1027"]);
    expect(meta.relatedResources).not.toContain("res-1004");
    expect(meta.relatedResources).not.toContain("res-1006");
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Home Resilience Scorecard", "Household Risk Identifier", "Household Spending Capacity Check", "3-Tier Budget Planner", "90-Day Implementation Roadmap"]);
  });

  it("adds no safety block and no topic disposition (the legacy teaches no technical topic)", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    expect(meta.safetyTopicDispositions).toEqual({});
    expect(safetyExposureFor(newText)).toEqual([]);
  });

  it("records the conceptual journey with OG-07 between OG-03 and OG-26, as documentation only", () => {
    expect(String(meta.memberJourneyRole)).toContain("OG-01 → OG-02 → OG-06 → OG-04 → OG-22 → OG-03 → OG-07 → OG-26 → OG-27");
  });
});

describe("Stage 9.97 · OG-07 draft copy: the legacy structure and claims are not carried", () => {
  it("has no price, currency, percentage, quantity, score or period", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?(?:100|25)\b/);
    expect(newText.replace(/90-Day Implementation Roadmap|3-Tier Budget Planner/g, "")).not.toMatch(/\b\d+\s?(?:hours?|days?|weeks?|months?|years?|minutes?)\b|\b(?:hours?|days?|weeks?|months?|years?)\b/i);
  });

  it("is clean under every claim family, sentence by sentence (survival, supply, emergency-period, multiplier, comparative)", () => {
    expect(sentences.filter((s) => isSurvivalClaimSentence(s))).toEqual([]);
    expect(sentences.filter((s) => supplyTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => emergencyPeriodTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => multiplierClaims(s).length)).toEqual([]);
    expect(sentences.filter((s) => comparativePerformanceClaims(s).length)).toEqual([]);
  });

  it("carries none of the legacy programme labels, codes, scoring, claims or framing", () => {
    const text = newText.replace(/Home Resilience Scorecard|3-Tier Budget Planner|90-Day Implementation Roadmap/g, "");
    for (const re of [/Week\b|\bDay\b/, /30-Day Programme/i, /Asset OG-07|\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM/i, /\bpillars?\b/i, /72[- ]hour/i, /Resilience Score|Risk Score|budget tier|Budget Needed/i, /5[- ]pillar/i, /witness/i, /follow-through|2–3x|more progress than most|most people make/i, /procrastination|north star|No new priorities|Lock Principle/i, /Week 2|Next:/]) expect(text, String(re)).not.toMatch(re);
  });

  it("is market-neutral: no agency, emergency number or market-specific term in the body", () => {
    expect(newText).not.toMatch(/\b(111|000|112|106)\b|civil defence|\bNEMA\b|\bSES\b|\bFENZ\b|council|consent|strata|body corporate|tenan\w+/i);
  });
});

describe("Stage 9.97 · OG-07 draft copy: the owner's structure", () => {
  it("has the new title and subtitle, and no Week 1 title anywhere", () => {
    expect(allNew).toContain("Priority Lock<br>Worksheet");
    expect(allNew).toContain("Turn what you have learned into three clear first actions, set a date for each and decide what you will start with.");
    expect(allNew).not.toMatch(/Week 1/i);
  });

  it("has the sections in the recommended order", () => {
    const order = ["Why This Matters", "Before You Begin", "Step 1 — Review What You Already Know", "Step 2 — Lock Your Three Priorities", "Step 3 — Think Through What Could Get in the Way", "My First Commitment", "Where Next", "Where You Are Now"];
    const at = order.map((o) => newText.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });

  it("uses the owner's neutral wording for the source of the priorities", () => {
    expect(newText).toContain("Look back at your completed assessments and planning tools. Choose the three actions that matter most for your household right now.");
    expect(newText).toContain("You do not need to have completed every earlier resource");
  });

  it("has a four-column table with exactly Priority, Foundation, First Action and Done By, and three rows", () => {
    expect(content.to).toMatch(/<th class="c-pri">Priority<\/th><th class="c-fnd">Foundation<\/th><th class="c-act">First Action<\/th><th class="c-due">Done By<\/th>/);
    expect((content.to.split('<table class="lock-table">')[1].split("</table>")[0].match(/<td class="c-pri">\d<\/td>/g) ?? []).length).toBe(3);
    expect(content.to.split('<table class="lock-table">')[1].split("</table>")[0]).not.toMatch(/Pillar|Budget|Cost|Score|\$/);
  });

  it("has the three ruled reflection prompts and the commitment, without a witness field", () => {
    for (const p of ["Why are these the right actions to start with?", "What could stop me from completing them?", "What is one thing I can do now to make starting easier?"]) expect(newText).toContain(p);
    expect(newText).toContain("My first commitment:");
    expect(newText).toContain("Name or signature");
    expect(newText).toContain("This is a personal planning worksheet, not a formal agreement.");
    expect(allNew).not.toMatch(/witness/i);
  });

  it("points on along the journey: three earlier steps, then the 3-Tier Budget Planner, then the 90-Day Implementation Roadmap", () => {
    const next = newText.slice(newText.indexOf("Where Next"));
    const order = ["Home Resilience Scorecard", "Household Risk Identifier", "Household Spending Capacity Check", "3-Tier Budget Planner", "90-Day Implementation Roadmap"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
});

describe("Stage 10.00 · registers", () => {
  it("OG-07 is deployed (not in Not started or Staged) and the counts are as locked", () => {
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr.split("## Not started (13)")[1].split("## Route clashes")[0]).not.toMatch(/\| OG-07 \|/);
    expect(rr.split("## Deployed")[1].split("## Staged")[0]).toMatch(/\| OG-07 \| Priority Lock Worksheet \| general \/ worksheet \|/);
    expect(rr.split("## Staged, not deployed (0)")[1].split("## Prepared")[0]).not.toMatch(/^\| OG-07 \|/m);
    expect(rr).toMatch(/\*\*Not started\*\*[^\n]*\*\*13\*\*/);
  });
});
