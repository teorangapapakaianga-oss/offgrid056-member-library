import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.18 — OG-24 Professional Support Planner: the narrowed draft (owner ruling NARROW, Stage 10.17).
 *
 * Read from the committed review config (no private file needed). The draft is NOT owner-approved copy, NOT rendered, NOT staged and NOT live, and it has no res-ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-24"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-24"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const text = newText.replace(/OffGrid056/g, "OffGrid").replace(/90-Day Implementation Roadmap/g, "Live Title");

describe("Stage 10.18 · OG-24 locked metadata", () => {
  it("is the owner's narrowed worksheet: general / planning-implementation / planning / worksheet, draft, in the planning-tools collection", () => {
    expect(meta).toMatchObject({ title: "Professional Support Planner", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 20, recordStatus: "draft", collections: ["planning-tools"], tags: [] });
    expect(pc.classificationsDecided["OG-24"]).toBe("planning-implementation");
    expect(PROGRAM_COMPONENTS).toContain("planning-implementation");
    expect(COLLECTION_IDS).toContain("planning-tools");
  });
  it("carries the owner's description exactly", () => {
    expect(meta.description).toBe("A practical worksheet to help you identify where professional support may be useful, record who you are considering and prepare the questions you want answered before you engage them.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-09 \(Stage 10\.17\)/);
  });
  it("Stage 10.18C: res-1024 is assigned in the staged record only (internal routing/data), never in the review config or the member-facing copy, and Planning Tools is unchanged until deployment", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1024");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      const og24 = recs.filter((r) => r.legacyCode === "OG-24" || r.id === "res-1024");
      expect(og24).toHaveLength(1);
      expect(og24[0]).toMatchObject({ id: "res-1024", legacyCode: "OG-24" });
      expect(recs).toHaveLength(32); // all 32 live (Stage 10.21D)
    }
    expect(String(meta.collectionsStatus)).toMatch(/NOT changed until OG-24 is staged and deployed/);
    expect(meta.relatedResources).toEqual(["res-1023", "res-1025", "res-1022", "res-1027"]);
    expect(String(meta.relatedResourcesStatus)).toMatch(/^OWNER-APPROVED 2026-10-13 \(Stage 10\.18C\)/);
    expect(String(meta.coverStatus)).toMatch(/^OWNER-APPROVED 2026-10-13 \(Stage 10\.18B\)/);
    expect(allNew).toContain('<img src="assets/professional-support-cover.webp" class="cover-img"');
    expect(allNew.replace(/<style>[\s\S]*?<\/style>/, "")).not.toMatch(/Week4_ActionPlanPathway|Week 4 Cover|Week1_Foundation|Week2_WaterFoodAir|Week3_/);
    expect(String(meta.migrationState)).toMatch(/^DEPLOYED \(Stage 10\.18D\)/);
  });
  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });
  it("carries the standing blocks only; the legacy electrical, gas and solid-fuel topics are recorded REMOVED by the owner", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d).sort()).toEqual(["batteries-and-electrical", "gas-and-lpg", "gas-installation-and-servicing", "solid-fuel-heating"]);
    for (const k of Object.keys(d)) expect(d[k]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
    expect(meta.safetyExemptions).toBeUndefined();
  });
});

describe("Stage 10.18 · OG-24 draft copy: the legacy structure and claims are not carried", () => {
  it("has no price, currency, percentage, score, ratio, duration or figure", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?)\b/i);
  });
  it("is clean under every claim family, sentence by sentence, including the licensing, legality, consent and permit rules", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("keeps the question-style licensing and approvals wording quiet and present", () => {
    for (const q of ["What qualifications, registrations or licences apply to the work you do?", "Who is responsible for approvals or inspections if they apply?"]) {
      expect(regulatoryAssertions(q)).toEqual([]);
      expect(newText).toContain(q);
    }
  });
  it("carries none of the removed legacy material", () => {
    const t = text.replace("nothing here is a score, a ranking or a guarantee", "");
    for (const re of [/Week\b|\bDay\b/, /30-Day Programme/i, /\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Professional Review|Vet sellers|Tomorrow|Next: /, /\bscore\b|\/\s?50|40\+|red flag|total/i, /payback|warranty|GST|NZD|\bfee\b/i, /NZ|New Zealand|Australia|LBP|EWRB|PGDB|NZRAB|ADNZ|Consumer Guarantees|EECA|Building Code|mandatory|compliance|illegal|unlawful|always licensed|valid licen[cs]e|regulations? apply|certified technician/i, /solar|batter|inverter|electric|wiring|gas\b|LPG|heat pump|wood burner|flue|plumb|drainlayer|roof|structural|generator|insulation|filtration/i, /Never pay|50\/50|upfront|deposit/i]) expect(t, String(re)).not.toMatch(re);
  });
  it("teaches no technical safety topic and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
  });
  it("is market-neutral: no agency, register, emergency number or jurisdiction-specific term in the body", () => {
    expect(text).not.toMatch(/\b(111|000|112|106)\b|civil defence|\bNEMA\b|\bSES\b|council|WorkSafe|\bABN\b|\bACN\b/i);
  });
  it("never ranks, recommends or approves a professional", () => {
    expect(newText).not.toMatch(/best professional|approved professional|licensed professional|safe professional|recommended professional|right professional|\brank(?:ed|ing)?\b[^.]{0,20}professional/i);
    expect(newText).toContain("This planner does not recommend or approve anyone.");
  });
  it("names no professional type or regulated trade", () => {
    expect(newText.replace(/suppliers and installers/g, "")).not.toMatch(/electrician|plumber|builder|architect|engineer|gasfitter|surveyor|consultant|tradesperson/i);
  });
});

describe("Stage 10.18 · OG-24 draft copy: the owner's structure", () => {
  it("has the new title and subtitle, and no legacy title", () => {
    expect(allNew).toContain("Professional Support<br>Planner");
    expect(allNew).toContain("Work out where professional support may help, record who you are considering and prepare your questions before you speak to them.");
    expect(allNew).not.toMatch(/Professional Review|Selector|OG-24|Day 24/);
  });
  it("has the sections in the owner's order", () => {
    const order = ["What This Planner Is For", "What I Need Help With", "Why I May Want Professional Support", "Professional / Trade I May Need", "People or Businesses I Am Considering", "Questions to Ask", "What I Want From Them", "Things I Want to Check More Closely", "My Next Contact", "Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has the six help fields, eight reasons, four professional-or-trade fields and no pre-filled type", () => {
    for (const x of ["What I want help with:", "What outcome I am trying to achieve:", "What part of the project I am unsure about:", "What I have already decided:", "What I have not decided yet:", "What information I need before I can move forward:", "Type of professional / trade I may need:", "Why I think they may help:", "What part of the project I want them involved in:", "What I still need to confirm about their role:"]) expect(newText).toContain(x);
    for (const x of ["I need advice before deciding what to do.", "I need someone to review my plan.", "I need help understanding the work involved.", "I need a quote or scope of work.", "I need someone to complete part of the project.", "I need help checking what requirements apply.", "I want another opinion before I commit."]) expect(newText).toContain(x);
  });
  it("has three people-or-business options with the five fields each, and no score or ranking", () => {
    for (const x of ["Option A", "Option B", "Option C"]) expect(content.to).toContain(`<h3>${x}</h3>`);
    for (const f of ["Name / business:", "Contact details:", "What they may help with:", "How I found them:", "What I still need to check:"]) expect((content.to.match(new RegExp(f.replace(/[/]/g, "\\/"), "g")) ?? []).length, f).toBe(3);
  });
  it("has the eleven approved market-neutral questions, each a question", () => {
    const qs = [...content.to.matchAll(/<div class="checklist-text">([^<]*)<\/div>/g)].map((m) => m[1]).slice(8, 19);
    expect(qs).toEqual([
      "What experience do you have with this kind of work?",
      "What qualifications, registrations or licences apply to the work you do?",
      "Can you show me evidence of the qualifications or registrations you rely on?",
      "Do you carry insurance relevant to this work?",
      "What part of the work will you complete yourself?",
      "Will anyone else or any subcontractor be involved?",
      "What information do you need from me before starting?",
      "What documents or records will you provide?",
      "Who is responsible for approvals or inspections if they apply?",
      "What follow-up or support is available after the work is completed?",
      "What should I clarify before agreeing to proceed?",
    ]);
    expect(qs.every((q) => q.endsWith("?"))).toBe(true);
  });
  it("has the nine closer-look prompts shown as prompts, and the five next-contact fields", () => {
    for (const x of ["The role or responsibility is unclear.", "I am not sure which qualifications or registrations apply.", "Important questions are unanswered.", "Something discussed is not shown in writing.", "Responsibility for approvals or inspections is unclear.", "Insurance information is unclear.", "I am unclear about who will actually carry out the work.", "I want another opinion before deciding."]) expect(newText).toContain(x);
    expect(content.to).toContain('class="checklist-section prompts"');
    for (const x of ["Who I want to contact next:", "Why:", "What I want to ask first:", "What I need ready before I contact them:", "My follow-up note:"]) expect(newText).toContain(x);
  });
  it("has open notes and a short closing that makes no promise", () => {
    expect(newText).toContain("My notes:");
    const closing = newText.slice(newText.lastIndexOf("Where You Are Now"));
    expect(closing.length).toBeLessThan(450);
    expect(closing).not.toMatch(/right professional|best|guarantee|ensure|sure to|safe|compliant|everything you need/i);
  });
  it("points on in the owner's flow, with no programme pointer", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"));
    const order = ["Supplier Comparison Worksheet", "Project Support Brief Template", "Resilience Product Wishlist", "90-Day Implementation Roadmap"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toMatch(/Before[\s\S]*Next[\s\S]*Also useful[\s\S]*Later/);
    expect(newText).not.toMatch(/OG-2\d|Tomorrow|Day 2\d/);
  });
});
