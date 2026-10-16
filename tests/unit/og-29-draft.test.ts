import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.22A — OG-29 Household Action Plan: the rewrite draft (owner ruling: REWRITE BEFORE MIGRATION).
 *
 * Read from the committed review config (no private file needed). The draft is NOT owner-approved copy, NOT rendered, NOT staged and NOT live, and it has no resource ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-29"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-29"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const text = newText.replace(/OffGrid056/g, "OffGrid").replace(/90-Day Implementation Roadmap/g, "Live Title").replace(/3-Tier Budget Planner/g, "Live Title B");

describe("Stage 10.22A · OG-29 locked metadata", () => {
  it("is the owner's rewritten worksheet: general / planning-implementation / planning / worksheet, draft, in the planning-tools collection", () => {
    expect(meta).toMatchObject({ title: "Household Action Plan", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 20, recordStatus: "draft", collections: ["planning-tools"], tags: [] });
    expect(pc.classificationsDecided["OG-29"]).toBe("planning-implementation");
    expect(PROGRAM_COMPONENTS).toContain("planning-implementation");
    expect(COLLECTION_IDS).toContain("planning-tools");
  });
  it("carries the owner's description exactly", () => {
    expect(meta.description).toBe("A practical worksheet to help your household turn its main resilience decisions into a clear list of actions, owners and next steps.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-14 \(Stage 10\.22A\)/);
  });
  it("Stage 10.22C: res-1029 is assigned in the staged record only (internal routing/data), never in the review config or the member-facing copy, and Planning Tools is unchanged until deployment", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1029");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      const og29 = recs.filter((r) => r.legacyCode === "OG-29" || r.id === "res-1029");
      expect(og29).toHaveLength(1);
      expect(og29[0]).toMatchObject({ id: "res-1029", legacyCode: "OG-29" });
      expect(recs).toHaveLength(38); // all 38 live (res-1513 and res-1515 deployed in Stage 11.0K)
    }
    expect(String(meta.collectionsStatus)).toMatch(/NOT changed until OG-29 is staged and deployed/);
    expect(String(meta.migrationState)).toMatch(/^DEPLOYED \(Stage 10\.22D\)/);
    expect(String(meta.coverStatus)).toMatch(/^OWNER-SUPPLIED 2026-10-14 \(Stage 10\.22B\)/);
    expect(String(meta.coverStatus)).toContain("1B67D0D6829EFBE19B51D2A1D6EAFE13AAC3940309A91C8033E68DAE8905D359");
    expect(allNew).toContain('<img src="assets/household-action-plan-cover.png" class="cover-img"');
    expect(allNew.replace(/<style>[\s\S]*?<\/style>/, "")).not.toMatch(/Week4_ActionPlanPathway|Week 4 Cover|Week1_Foundation|Week2_WaterFoodAir|Week3_/);
  });
  it("has the owner-approved four curated related links in the metadata order", () => {
    expect(meta.relatedResources).toEqual(["res-1027", "res-1028", "res-1007", "res-1026"]);
    expect(JSON.stringify(meta.relatedResources)).not.toMatch(/res-1504|res-000|res-1510/);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["90-Day Implementation Roadmap", "Household Responsibility Roster", "Priority Lock Worksheet", "3-Tier Budget Planner"]);
  });
  it("answers all five programme-alignment questions and carries the standing blocks only", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d)).toEqual(["batteries-and-electrical"]);
    expect(d["batteries-and-electrical"]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
  });
});

describe("Stage 10.22A · OG-29 draft copy: the legacy programme index and claims are not carried", () => {
  it("has no price, currency, percentage, score, ratio, duration, frequency or figure at all", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    const digits = [...text.matchAll(/\d+/g)].map((m) => Number(m[0]));
    expect(digits).toEqual([]);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?|daily|weekly|monthly|quarterly|annual(?:ly)?)\b|week by week/i);
  });
  it("is clean under every claim family, sentence by sentence", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("carries none of the legacy programme, OG-code, 30-resource table, technical, regulatory or absolute wording", () => {
    for (const re of [/Week\b|\bDay\b/, /30[- ]Day|30 days|29 days/i, /\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Tomorrow|Next: |Upgrade Pathway|Master Action|capstone|contract with yourself/i, /Home Resilience Audit|Skills & Knowledge|Momentum Builder|Seed Vault|Grid-Tie|Supplier Question Bank|Professional Review Selector/i, /solar|batter|inverter|generator|electric|wiring|\bgas\b|\bfuel\b|wood|heater|plumb|greywater|filter|pump|water testing/i, /CPR|first aid|medication|medical/i, /\b(?:legal|illegal|unlawful|required|must|licensed|certified|registered|approved|inspection|consent|permit|regulations?|compliance|authority|code)\b/i, /nothing is forgotten|guarantee|\bensures?\b|\balways\b|\bnever\b/i, /civil defence|NZ|New Zealand|Australia|council/i]) expect(text, String(re)).not.toMatch(re);
  });
  it("teaches no technical safety topic and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
  });
  it("is market-neutral: no agency, emergency number or jurisdiction-specific term in the body", () => {
    expect(text).not.toMatch(/\b(111|000|112|106)\b|\bNEMA\b|\bSES\b|WorkSafe|\bABN\b|\bACN\b/i);
  });
});

describe("Stage 10.22A · OG-29 draft copy: the owner's structure", () => {
  it("has the new title and subtitle, and no legacy title", () => {
    expect(allNew).toContain("Household Action<br>Plan");
    expect(allNew).toContain("A calm, practical worksheet for turning your household’s decisions into clear actions and owners.");
    expect(allNew).not.toContain("household's decisions");
    expect(allNew).not.toContain("clear actions and next steps");
    expect(allNew).not.toMatch(/OG-29|Day 29|Everything from 30 days/);
  });
  it("has the sections in the approved order", () => {
    const order = ["What This Plan Is For", "Our Plan Details", "What We Have Decided", "Our First Ten Actions", "When We Will Review It", "Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has the six plan-detail fields and the four decision prompts, with no money field", () => {
    for (const l of ["Household or property:", "Date:", "Our main goal:", "Our main priority:", "What we want to improve:", "Who is involved:", "What have we decided to do?", "Why is this important to us?", "What still needs clarification?", "What are we deliberately not doing yet?"]) expect(newText).toContain(l);
    expect(newText).not.toMatch(/budget amount|how much|amount we|cost of/i);
  });
  it("has exactly ten action rows and exactly the five approved columns (Why it matters and Target date kept, no Next step, no number column)", () => {
    const head = content.to.match(/<table class="rost-table actions">[\s\S]*?<\/thead>/)![0];
    expect(head.match(/<th>[^<]*<\/th>/g)!.join("")).toBe("<th>Action</th><th>Why it matters</th><th>Owner</th><th>Target date</th><th>Status / Notes</th>");
    expect(content.to).not.toMatch(/Next step/);
    expect((content.to.match(/<tr><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><\/tr>/g) ?? []).length).toBe(10);
    expect(head).not.toMatch(/<th>(?:No\.|Score|Rank|Percent|Day|Week|Month|Cost|Price|Supplier)/i);
  });
  it("keeps review timing member-controlled, with one notes area", () => {
    expect(newText).toContain("We will review this plan when:");
    expect(newText).toContain("Notes:");
    expect(newText).not.toMatch(/review it monthly|update it quarterly|week by week|every \w+ days?|past 29 days/i);
  });
  it("points on in the approved order with exactly three printed rows (before, next, also useful) and no Later, res-1026, 1504 or demo row", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"), newText.indexOf("Where You Are Now"));
    const order = ["90-Day Implementation Roadmap", "Household Responsibility Roster", "Priority Lock Worksheet"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toMatch(/Before[\s\S]*Next[\s\S]*Also useful/);
    expect((next.match(/Also useful/g) ?? []).length).toBe(1);
    expect(next).not.toMatch(/\bLater\b|3-Tier|Monthly Planning|30-Day Action/);
    expect(newText).not.toMatch(/OG-30|Tomorrow/);
  });
  it("closes with neutral prompts and no programme-completion language", () => {
    const closing = newText.slice(newText.lastIndexOf("Where You Are Now"));
    for (const p of ["Our main priority now is:", "The first action we will take is:", "The person responsible is:", "The next thing we need to clarify is:"]) expect(closing).toContain(p);
    expect(closing).not.toMatch(/complete|congratulat|finished|journey|success|guarantee/i);
  });
});