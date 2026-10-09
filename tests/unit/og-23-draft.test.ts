import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.12A — OG-23 Supplier Comparison Worksheet: the narrowed draft (owner ruling NARROW).
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live, and it has no res-ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-23"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-23"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const text = newText.replace(/OffGrid056/g, "OffGrid").replace(/3-Tier Budget Planner|90-Day Implementation Roadmap/g, "Live Title");

describe("Stage 10.12A · OG-23 locked metadata", () => {
  it("is the owner's narrowed worksheet: general / planning-implementation / planning / worksheet, draft, in the planning-tools collection", () => {
    expect(meta).toMatchObject({ title: "Supplier Comparison Worksheet", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 30, recordStatus: "draft", collections: ["planning-tools"], tags: [] });
    expect(pc.classificationsDecided["OG-23"]).toBe("planning-implementation");
    expect(PROGRAM_COMPONENTS).toContain("planning-implementation");
    expect(COLLECTION_IDS).toContain("planning-tools");
  });
  it("carries the owner's description exactly", () => {
    expect(meta.description).toBe("A practical worksheet to help you prepare questions for suppliers and installers, record their answers side by side and note anything that needs a closer look before you decide.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.12\)/);
  });
  it("assigns no res-ID and does not change Planning Tools: no private record, no ID in the config, and the collection status says it is unchanged until deployment", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1023");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      expect(recs.filter((r) => r.legacyCode === "OG-23" || r.id === "res-1023")).toEqual([]);
    }
    expect(String(meta.collectionsStatus)).toMatch(/NOT changed until OG-23 is staged and deployed/);
  });
  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });
  it("has the owner-approved four explicit related links in the approved order (the curated-related rule then shows only those)", () => {
    expect(meta.relatedResources).toEqual(["res-1022", "res-1025", "res-1026", "res-1027"]);
    expect(String(meta.relatedResourcesStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.13\)/);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Resilience Product Wishlist", "Project Support Brief Template", "3-Tier Budget Planner", "90-Day Implementation Roadmap"]);
  });
  it("carries the standing blocks only, with batteries-and-electrical recorded REMOVED by the owner", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d)).toEqual(["batteries-and-electrical"]);
    expect(d["batteries-and-electrical"]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
    expect(meta.safetyExemptions).toBeUndefined();
  });
});

describe("Stage 10.12A · OG-23 draft copy: the legacy structure and claims are not carried", () => {
  it("has no price, currency, percentage, score, ratio, duration or figure", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?)\b/i);
  });
  it("is clean under every claim family, sentence by sentence (survival, supply, emergency-period, storage, target-label, payback, warranty, payment, regulatory, multiplier, comparative, outcome, assurance)", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("carries none of the removed legacy material", () => {
    const t = text.replace("nothing here is a score, a ranking or a guarantee", "");
    for (const re of [/Week\b|\bDay\b/, /30-Day Programme/i, /\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Question Bank|Vet sellers|Tomorrow|Next: /, /\bscore\b|\/\s?50|40\+|red flag|total/i, /payback|warranty \(years\)|GST|Years in/i, /NZ|New Zealand|AS\/NZS|BRANZ|CodeMark|EECA|Warmer Kiwi|Energy Rating|NSF|lines company|Building Code|mandatory|compliance/i, /solar|batter|inverter|heat pump|insulation|filtration|potable|first-flush|COP\b/i, /Never pay|50\/50|upfront/i]) expect(t, String(re)).not.toMatch(re);
  });
  it("teaches no technical safety topic and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
  });
  it("is market-neutral: no agency, emergency number, jurisdiction-specific term or standard in the body", () => {
    expect(text).not.toMatch(/\b(111|000|112|106)\b|civil defence|\bNEMA\b|\bSES\b|council|\bABN\b|\bACN\b|Australia/i);
  });
  it("never ranks, recommends or approves a supplier", () => {
    expect(newText).not.toMatch(/best supplier|approved supplier|safe supplier|compliant supplier|recommended supplier|\brank(?:ed|ing)?\b[^.]{0,20}supplier/i);
    expect(newText).toContain("it does not rate or recommend any supplier");
  });
});

describe("Stage 10.12A · OG-23 draft copy: the owner's structure", () => {
  it("has the new title and subtitle, and no legacy title", () => {
    expect(allNew).toContain("Supplier Comparison<br>Worksheet");
    expect(allNew).toContain("Prepare your questions, record what each supplier or installer tells you side by side, and note what needs a closer look before you decide.");
    expect(allNew).not.toMatch(/Question Bank|OG-23|Day 23/);
  });
  it("has the sections in the recommended order", () => {
    const order = ["Why Use This Worksheet", "Before You Contact a Supplier", "Questions to Ask", "Compare Supplier A / B / C", "Things I Want to Look At More Closely", "My Follow-Up Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has fifteen supplier questions, each a question, in five groups, and no system-specific set", () => {
    const qs = [...content.to.matchAll(/<div class="checklist-text">([^<]*)<\/div>/g)].map((m) => m[1]);
    expect(qs.slice(0, 15).every((q) => q.endsWith("?"))).toBe(true);
    expect(qs).toHaveLength(15 + 7);
    expect((content.to.match(/<h3>/g) ?? []).length - 1).toBe(5);
  });
  it("compares Supplier / Installer A, B and C over ten member-entered rows, with no score or total", () => {
    for (const x of ["Supplier / Installer A", "Supplier / Installer B", "Supplier / Installer C"]) expect(content.to).toContain(`<th>${x}</th>`);
    const table = content.to.match(/<table class="cmp-table">[\s\S]*?<\/table>/)![0];
    expect((table.match(/<td class="c-lab">/g) ?? []).length).toBe(10);
    expect(table).not.toMatch(/total|score|rank/i);
    for (const r of ["Timeframe they gave", "Warranty details they gave", "Payment stages they proposed", "Questions still unanswered"]) expect(table).toContain(r);
  });
  it("has the closer-look prompts and the four member follow-up fields", () => {
    for (const x of ["The quote or the scope is unclear.", "Important questions have not been answered.", "Something was promised that is not shown in writing.", "The warranty or support details are unclear.", "I felt pressure to decide quickly.", "The payment stages are unclear.", "It is unclear who is responsible for the installation or the follow-up."]) expect(newText).toContain(x);
    for (const x of ["The supplier I want to follow up with:", "Why:", "Questions I still need answered:", "What I need before deciding:"]) expect(newText).toContain(x);
  });
  it("gives the member generous writing space for their own questions, and shows the closer-look items as prompts", () => {
    const own = content.to.match(/Questions of my own:<\/div>([\s\S]*?)<\/div>\s*<\/div>/)![1];
    expect((own.match(/worksheet-line/g) ?? []).length).toBeGreaterThanOrEqual(5);
    expect(content.to).toContain('class="checklist-section prompts"');
    for (const k of ["questionsStatus", "comparisonStatus", "closerLookStatus", "followUpStatus", "relatedResourcesStatus"]) expect(String(meta[k]), k).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.13\)/);
    expect(String(meta.coverStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.13A\)/);
    expect(String(meta.coverStatus)).toMatch(/workspace\/prep\/OG-23\/assets\/supplier-comparison-cover\.webp/);
    expect(allNew).toContain('<img src="assets/supplier-comparison-cover.webp" class="cover-img"');
    expect(allNew.replace(/<style>[\s\S]*?<\/style>/, "")).not.toMatch(/Week4_ActionPlanPathway|Week 4 Cover|Week1_Foundation|Week2_WaterFoodAir|Week3_/);
  });
  it("points on in the owner's flow, with no programme pointer", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"));
    const order = ["Resilience Product Wishlist", "Project Support Brief Template", "3-Tier Budget Planner", "90-Day Implementation Roadmap"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(newText).not.toMatch(/OG-24|Professional Review|Tomorrow|Day 2\d/);
  });
});
