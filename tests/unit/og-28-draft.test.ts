import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.21A — OG-28 Household Responsibility Roster: the rewrite draft (owner ruling: REWRITE BEFORE MIGRATION).
 *
 * Read from the committed review config (no private file needed). The draft is NOT owner-approved copy, NOT rendered, NOT staged and NOT live, and it has no resource ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-28"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-28"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const text = newText.replace(/OffGrid056/g, "OffGrid").replace(/90-Day Implementation Roadmap/g, "Live Title");

describe("Stage 10.21A · OG-28 locked metadata", () => {
  it("is the owner's rewritten worksheet: general / planning-implementation / planning / worksheet, draft, in the planning-tools collection", () => {
    expect(meta).toMatchObject({ title: "Household Responsibility Roster", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", recordStatus: "draft", collections: ["planning-tools"], tags: [] });
    expect(pc.classificationsDecided["OG-28"]).toBe("planning-implementation");
    expect(PROGRAM_COMPONENTS).toContain("planning-implementation");
    expect(COLLECTION_IDS).toContain("planning-tools");
  });
  it("carries the owner's description exactly", () => {
    expect(meta.description).toBe("A practical worksheet to help your household agree who looks after what, record a backup for each area and choose a regular time to check in.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-13 \(Stage 10\.21A\)/);
  });
  it("Stage 10.21C: res-1028 is assigned in the staged record only (internal routing/data), never in the review config or the member-facing copy, and Planning Tools is unchanged until deployment", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1028");
    expect(JSON.stringify(meta), "OG-28 review entry").not.toContain("res-1028"); // later resources (OG-29) may name res-1028 as a related link in their own entries
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string });
      const og28 = recs.filter((r) => r.legacyCode === "OG-28" || r.id === "res-1028");
      expect(og28).toHaveLength(1);
      expect(og28[0]).toMatchObject({ id: "res-1028", legacyCode: "OG-28" });
      expect(recs).toHaveLength(36); // 35 live + res-1514 staged (Stage 10.27C)
    }
    expect(String(meta.collectionsStatus)).toMatch(/NOT changed until OG-28 is staged and deployed/);
    expect(String(meta.migrationState)).toMatch(/^DEPLOYED \(Stage 10\.21D\)/);
    expect(String(meta.coverStatus)).toMatch(/^OWNER-SUPPLIED 2026-10-14 \(Stage 10\.21B\)/);
  });
  it("has the owner-approved four curated related links (Stage 10.21B.1), in order", () => {
    expect(meta.relatedResources).toEqual(["res-1007", "res-1027", "res-1006", "res-1026"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Priority Lock Worksheet", "90-Day Implementation Roadmap", "Emergency Readiness Checklist", "3-Tier Budget Planner"]);
  });
  it("answers all five programme-alignment questions and carries the standing blocks only", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d).sort()).toEqual(["batteries-and-electrical", "food-safety-power-cut"]);
    for (const k of Object.keys(d)) expect(d[k]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
  });
});

describe("Stage 10.21A · OG-28 draft copy: the legacy structure and claims are not carried", () => {
  it("has no price, currency, percentage, score, ratio, duration, frequency or figure", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?|daily|weekly|monthly|annual(?:ly)?)\b/i);
  });
  it("is clean under every claim family, sentence by sentence", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("carries none of the removed legacy, technical, medical, credential, cadence or absolute wording", () => {
    for (const re of [/Week\b|\bDay\b/, /30-Day Programme/i, /\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Tomorrow|Next: |Sunday|huddle|override/i, /solar|batter|inverter|generator|electric|wiring|gas\b|wood|pellet|heater|plumb|greywater|filter|pump|water testing/i, /CPR|first aid|medication|medical|clinic/i, /security|perimeter|gate\b/i, /certificat|licen[cs]|qualif|trained and capable|skills required/i, /nothing is forgotten|everyone knows|ensures?\b|guarantee|\balways\b|\bnever\b/i, /civil defence|NZ|New Zealand|Australia|council/i]) expect(text, String(re)).not.toMatch(re);
  });
  it("teaches no technical safety topic and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
  });
  it("is market-neutral: no agency, emergency number or jurisdiction-specific term in the body", () => {
    expect(text).not.toMatch(/\b(111|000|112|106)\b|\bNEMA\b|\bSES\b|WorkSafe|\bABN\b|\bACN\b/i);
  });
});

describe("Stage 10.21A · OG-28 draft copy: the owner's structure", () => {
  it("has the new title and subtitle, and no legacy title", () => {
    expect(allNew).toContain("Household Responsibility<br>Roster");
    expect(allNew).toContain("A practical worksheet for sharing responsibility, creating backups and keeping household plans clear.");
    expect(allNew).not.toMatch(/OG-28|Day 28|Make resilience a team sport/);
  });
  it("has the sections in the approved order", () => {
    const order = ["What This Roster Is For", "Our Household", "Areas We Look After", "Our Responsibility Roster", "Our Regular Check-In", "If Someone Is Unavailable", "Change Log and Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has the approved columns and fields, with no pre-filled areas", () => {
    for (const c of ["Area", "Why it matters to us", "Who currently knows this area", "Primary person", "Backup person", "What we want to practise or understand", "Date", "What changed", "Who is now responsible", "Follow-up needed"]) expect(content.to).toContain(`<th>${c}</th>`);
    for (const l of ["Household or group name:", "Date started:", "People taking part:", "Review note:"]) expect(newText).toContain(l);
    const cells = [...content.to.matchAll(/<td>([^<]*)<\/td>/g)].map((m) => m[1]).filter((c) => !/^(Before|Next|Also useful)$/.test(c));
    expect(cells.filter((c) => c.trim() && !/^<strong>/.test(c) && !/Worksheet|Roadmap|Checklist|Choose|Turn|Note what/.test(c))).toEqual([]);
  });
  it("has the approved check-in and unavailable-person prompts", () => {
    for (const x of ["When do we want to check in?", "What should we quickly review?", "Has anything changed?", "Does anyone need support?", "Does a backup need more practice?", "Is anything unclear?", "Which areas need a backup first?", "Who can step in?", "Is there information we need to make easier to find?", "Is there anything we should practise together?", "What can wait until the usual person is available?"]) expect(newText).toContain(x);
  });
  it("points on in the approved order with exactly three items and no Later", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"), newText.indexOf("Where You Are Now"));
    const order = ["Priority Lock Worksheet", "90-Day Implementation Roadmap", "Emergency Readiness Checklist"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toMatch(/Before[\s\S]*Next[\s\S]*Also useful/);
    expect(next).not.toMatch(/\bLater\b/);
    expect(newText).not.toMatch(/OG-29|Master Action Plan|Tomorrow/);
  });
  it("positions the worksheet in Planning & Implementation with no promise", () => {
    const closing = newText.slice(newText.lastIndexOf("Where You Are Now"));
    expect(closing).toContain("Planning & Implementation");
    expect(closing).not.toMatch(/guarantee|ensure|prevent|everything|nothing/i);
  });
});
