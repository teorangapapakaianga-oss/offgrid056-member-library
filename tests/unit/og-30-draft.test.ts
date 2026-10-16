import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.23A — OG-30 Long-Term Direction Planner: the rewrite draft (owner ruling: REWRITE BEFORE MIGRATION).
 *
 * Read from the committed review config (no private file needed). The draft is NOT owner-approved copy, NOT rendered, NOT staged and NOT live, and it has no resource ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-30"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-30"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const text = newText.replace(/OffGrid056/g, "OffGrid").replace(/90-Day Implementation Roadmap/g, "Live Title A").replace(/Off-Grid System Architecture Planner/g, "Live Title B").replace(/3-Tier Budget Planner/g, "Live Title C");

describe("Stage 10.23A · OG-30 locked metadata", () => {
  it("is the owner's rewritten worksheet: general / advanced-future / planning / worksheet, intermediate, 30 minutes, draft, in no collection", () => {
    expect(meta).toMatchObject({ title: "Long-Term Direction Planner", foundation: "general", programComponent: "advanced-future", category: "planning", resourceType: "worksheet", difficulty: "intermediate", estimatedTime: 30, recordStatus: "draft", collections: [], tags: [], proposedSlug: "long-term-direction-planner" });
    expect(pc.classificationsDecided["OG-30"]).toBe("advanced-future");
    expect(PROGRAM_COMPONENTS).toContain("advanced-future");
    expect(COLLECTION_IDS).toContain("planning-tools");
    expect(String(meta.collectionsStatus)).toMatch(/Planning Tools = NO/);
  });
  it("carries the owner's description exactly", () => {
    expect(meta.description).toBe("A practical worksheet to help your household decide how far you want to take your resilience plans, choose a direction and identify the first project to explore.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-14 \(Stage 10\.23A\)/);
  });
  it("Stage 10.23C: res-1030 is assigned in the staged record only (internal routing/data), never in the review config or the member-facing copy, and Planning Tools is unchanged", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1030");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Record<string, unknown> & { legacyCode: string; id: string; slug: string });
      const og30 = recs.filter((r) => r.legacyCode === "OG-30" || r.id === "res-1030" || r.slug === "long-term-direction-planner");
      expect(og30).toHaveLength(1);
      expect(og30[0]).toMatchObject({
        id: "res-1030", slug: "long-term-direction-planner", legacyCode: "OG-30", title: "Long-Term Direction Planner", foundation: "general", programComponent: "advanced-future", category: "planning", resourceType: "worksheet", difficulty: "intermediate", estimatedTime: 30,
        status: "draft", publicationStatus: "approved", releaseChannel: "private-preview", collections: [], tags: [], premium: false, isPlaceholder: false, downloadable: true,
        relatedResources: ["res-1027", "res-1512", "res-1026", "res-1021"], description: meta.description,
        marketFiles: { NZ: { fileUrl: "/resources/long-term-direction-planner.NZ.pdf", fileFormat: "PDF" }, AU: { fileUrl: "/resources/long-term-direction-planner.AU.pdf", fileFormat: "PDF" } },
      });
      expect(recs).toHaveLength(38); // 36 live + res-1513 and res-1515 staged (Stage 11.0J)
      expect(recs.filter((r) => (r.collections as string[] | undefined)?.includes("planning-tools"))).toHaveLength(12);
      const sha = (f: string) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
      expect(sha(path.join(root, "private-assets/resources/long-term-direction-planner.NZ.pdf"))).toBe("eca257980ea8b3cd439a0947f07d2e42e5aa18d7f1592452b941a3f5cd1cbcbe");
      expect(sha(path.join(root, "private-assets/resources/long-term-direction-planner.AU.pdf"))).toBe("a29643746bbeecdcf0229426de1928b930cf36e4796c0b982c6782a0c9d413ff");
    }
    expect(String(meta.migrationState)).toMatch(/^DEPLOYED \(Stage 10\.23D\)/);
    expect(String(meta.coverStatus)).toMatch(/^OWNER-SUPPLIED 2026-10-14 \(Stage 10\.23B\)/);
    expect(String(meta.coverStatus)).toContain("23DAB88CEBD189911CA0FEDAB0B8FA4381AC157C20FF07644B805DABD1FFF0FD");
    expect(allNew).toContain('<img src="assets/long-term-direction-planner-cover.png" class="cover-img"');
    expect(allNew.replace(/<style>[\s\S]*?<\/style>/, "")).not.toMatch(/Week4_ActionPlanPathway|Week 4 Cover|Week1_Foundation|Week2_WaterFoodAir|Week3_/);
  });
  it("has the owner-approved four curated related links in the metadata order", () => {
    expect(meta.relatedResources).toEqual(["res-1027", "res-1512", "res-1026", "res-1021"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["90-Day Implementation Roadmap", "Off-Grid System Architecture Planner", "3-Tier Budget Planner", "Home Energy & Shelter Upgrade Plan"]);
  });
  it("answers the five programme-alignment questions and carries the standing blocks only", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d)).toEqual(["batteries-and-electrical"]);
    expect(d["batteries-and-electrical"]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
  });
});

describe("Stage 10.23A · OG-30 draft copy: the legacy pathways, matrix, calendar and claims are not carried", () => {
  it("has no price, currency, percentage, figure, duration, period or fixed cadence", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect([...text.matchAll(/\d+/g)].map((m) => m[0])).toEqual([]);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?|daily|weekly|monthly|quarterly|annual(?:ly)?|indefinite)\b/i);
  });
  it("is clean under every claim family, sentence by sentence", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("carries none of the legacy programme, pathway, matrix, calendar, completion, technical, regulatory or absolute wording", () => {
    for (const re of [/Week\b|\bDay\b/, /30[- ]Day|30 days/i, /\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Congratulations|Completed OffGrid056|panic|purpose|resilient life|action-ready|prepared|future-proof|self-sufficien|independen/i, /Maintain|Grow & Optimi|Go Off|Homestead|Pathway [A-D]\b|Pathway Comparison|Upgrade Calendar|Autonomy|Upfront Capital|Maintenance Cost/i, /from OG-26|Tier Completed/i, /\bgrid\b|off-grid|solar|batter|generator|inverter|electric|septic|toilet|\bbore\b|spring|livestock|orchard|dwelling|\bgas\b|\bfuel\b/i, /\b(?:legal|legally|illegal|unlawful|required|must|licensed|certified|registered|approved|inspection|consent|permit|permitted|regulations?|compliance|authority|code)\b/i, /guarantee|\bensures?\b|\balways\b|\bnever\b|only wrong/i, /civil defence|NZ|New Zealand|Australia|council/i]) expect(text, String(re)).not.toMatch(re);
  });
  it("teaches no technical safety topic and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
  });
  it("is market-neutral: no agency, emergency number or jurisdiction-specific term in the body", () => {
    expect(text).not.toMatch(/\b(111|000|112|106)\b|\bNEMA\b|\bSES\b|WorkSafe|\bABN\b|\bACN\b/i);
  });
});

describe("Stage 10.23A · OG-30 draft copy: the owner's structure", () => {
  it("has the new title, chip and subtitle, and no legacy title", () => {
    expect(allNew).toContain("Long-Term Direction<br>Planner");
    expect(allNew).toContain("General · Advanced Future");
    expect(allNew).toContain("A calm, practical worksheet for thinking through where you want your household’s resilience plans to go next.");
    expect(allNew).not.toMatch(/OG-30|Day 30|Upgrade Pathway|Choose your long-term resilience direction/);
  });
  it("has the sections in the approved order", () => {
    const order = ["What This Worksheet Is For", "Where We Are Now", "Directions We Are Considering", "Our Chosen Direction", "Our First Project", "When We Will Revisit It", "Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has the six baseline fields", () => {
    for (const l of ["What is working well for us now:", "What we would like to strengthen:", "What feels unfinished:", "What we do not want to take on:", "What matters most to our household:", "What we want more clarity about:"]) expect(newText).toContain(l);
  });
  it("has exactly three member-named direction cards with the five prompts, and no scores, ranking or numeric levels", () => {
    for (const l of ["A", "B", "C"]) { expect(newText).toContain(`Direction ${l}`); expect(newText).toContain(`Our name for Direction ${l}:`); }
    expect(newText).not.toContain("Direction D");
    for (const p of ["What this direction means to us:", "Why we are considering it:", "What would change:", "What might stay the same:", "What we still need to understand:"]) expect((newText.match(new RegExp(p.replace(/[?.]/g, "\\$&"), "g")) ?? []).length, p).toBe(3);
    expect(newText.replace(/not a score or an assessment/i, "")).not.toMatch(/\bscore\b|\brank|\blevel\b/i);
  });
  it("has the chosen-direction, first-project and revisit fields with no cost, deadline or cadence", () => {
    for (const x of ["Direction we want to explore:", "Why this feels right for us:", "What we are not committing to yet:", "What we still need to confirm:", "Who should be involved in the decision:", "First project we want to explore:", "Why this project comes first:", "What we already know:", "What we need to learn:", "Who can help us think it through:", "Our next practical step is:", "When we want to look at this direction again:", "What might make us reconsider:", "What we want to know before reviewing it:", "What would tell us that our priorities have changed:", "Notes:"]) expect(newText).toContain(x);
    expect(newText).not.toMatch(/\bdeadline\b|\bcosts?\b|\bbudget amount\b|professional help is|always need/i);
  });
  it("points on in the approved order with exactly three printed rows and no Later or Home Energy row", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"), newText.indexOf("Where You Are Now"));
    const order = ["90-Day Implementation Roadmap", "Off-Grid System Architecture Planner", "3-Tier Budget Planner"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toMatch(/Before[\s\S]*Next[\s\S]*Also useful/);
    expect((next.match(/Also useful/g) ?? []).length).toBe(1);
    expect(next).not.toMatch(/\bLater\b|Home Energy/);
  });
  it("closes with a summary of what the member now has, with no completion, outcome or independence wording", () => {
    const closing = newText.slice(newText.lastIndexOf("Where You Are Now"));
    expect(closing).toContain("a clearer picture of where your household is");
    expect(closing).not.toMatch(/prepared|action-ready|future-proof|self-sufficient|independen|resilient|completed|congratulat|success|guarantee/i);
  });
});
