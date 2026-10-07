import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { emergencyPeriodTargets, isSurvivalClaimSentence, supplyTargets } from "@/admin-import/audit/numeric";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 9.91 — OG-06 Emergency Readiness Checklist: the narrowed draft.
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live, and it has no res-ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-06"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-06"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);

describe("Stage 9.91 · OG-06 locked metadata", () => {
  it("is the owner's narrowed resource, as a draft with no collection", () => {
    expect(meta).toMatchObject({ title: "Emergency Readiness Checklist", foundation: "general", programComponent: "resilience-emergency", category: "planning", resourceType: "checklist", difficulty: "beginner", estimatedTime: 20, recordStatus: "draft", collections: [], tags: [] });
    expect(pc.classificationsDecided["OG-06"]).toBe("resilience-emergency");
    expect(PROGRAM_COMPONENTS).toContain("resilience-emergency");
    expect(COLLECTION_IDS).toEqual(["start-here", "planning-tools"]); // no collection, no new collection, no new category
  });

  it("has the owner's description, marked for review, with no '72-hour' wording", () => {
    expect(meta.description).toBe("A practical checklist to help households identify the basic emergency items they already have, where important supplies are kept and what still needs to be organised before a disruption.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-REVIEW REQUIRED/);
    expect(String(meta.description)).not.toMatch(/72/);
  });

  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });

  it("proposes six related resources whose ids and titles exist; no existing related list changes; no res-ID and no private record yet", () => {
    expect(meta.relatedResources).toEqual(["res-1002", "res-1004", "res-1008", "res-1011", "res-1013", "res-1019"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string; legacyCode: string; relatedResources: string[] });
    const titles = new Map(recs.map((r) => [r.id, r.title]));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Household Risk Identifier", "Property Type Review", "Water Storage Calculator", "30-Day Pantry Builder", "Healthy Home Air Audit", "Battery Backup Planner"]);
    expect(recs.some((r) => r.legacyCode === "OG-06")).toBe(false);
    expect(recs).toHaveLength(25);
    expect(recs.find((r) => r.legacyCode === "OG-04")!.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1003", "res-1020", "res-1512"]);
    expect(recs.find((r) => r.legacyCode === "OG-03")!.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1026", "res-1027", "res-1025"]);
  });

  it("records the three legacy safety topics as REMOVED and adds no topic block", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string }>;
    expect(Object.keys(d).sort()).toEqual(["batteries-and-electrical", "fire-and-emergency", "food-safety-power-cut"]);
    for (const k of Object.keys(d)) expect(d[k].disposition, k).toBe("REMOVED");
    expect(safetyExposureFor(newText)).toEqual([]);
  });
});

describe("Stage 9.91 · OG-06 draft copy: the legacy claims are not carried", () => {
  it("has no price, currency, percentage, quantity, duration or period of any kind", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%/);
    expect(newText.replace(/30-Day Pantry Builder/g, "")).not.toMatch(/\b\d+\s?(?:hours?|days?|weeks?|months?|years?|minutes?|litres?|L|kg|mah)\b|\b(?:hours?|days?|weeks?|months?|years?)\b/i);
  });

  it("is clean under the survival-duration, supply-duration and emergency-period scans, sentence by sentence", () => {
    expect(sentences.filter((s) => isSurvivalClaimSentence(s))).toEqual([]);
    expect(sentences.filter((s) => supplyTargets(s).length)).toEqual([]);
    expect(sentences.filter((s) => emergencyPeriodTargets(s).length)).toEqual([]);
  });

  it("carries none of the legacy programme labels, codes, titles, survival or fear framing", () => {
    for (const re of [/Week \d|Day \d/, /30-Day Programme/i, /Asset OG-06|\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM/i, /72[- ]hour/i, /survive|worst|critical|worldwide|help may not|without outside help/i, /laminat/i, /Next: OG|Priority Lock/i, /\bpillars?\b/i]) expect(newText, String(re)).not.toMatch(re);
  });

  it("carries none of the removed technical, quantity or heat-source wording", () => {
    for (const re of [/10 ?L\b|90 ?litres|180 ?L|litres/i, /days? of meals|supply of formula|supply of pet food/i, /\b(?:camping|stoves?|gas|fireplaces?|wood ?burners?|candles?|matches|tarps?|ropes?)\b/i, /\b(?:creek|swimming pool|filtration|cylinder|boil\w*)\b/i, /smoke alarm|CO detector|carbon monoxide|extinguisher/i, /mAh|can opener|emergency frequency|civil defence/i, /\b(?:fridge|freezer|refrigerat\w+|perishable)\b/i, /\b(?:solar|generators?|inverters?|fuel)\b/i]) expect(newText, String(re)).not.toMatch(re);
  });

  it("is market-neutral: no agency, emergency number or NZ-only or AU-only term in the body", () => {
    expect(newText).not.toMatch(/\b(111|000|112|106)\b|civil defence|\bNEMA\b|\bSES\b|\bFENZ\b|get ready|council|consent|strata|body corporate/i);
  });

  it("'battery' appears only inside the live title 'Battery Backup Planner'", () => {
    expect((newText.match(/batter(?:y|ies)/gi) ?? []).length).toBe(1);
    expect(newText).toContain("Battery Backup Planner");
  });
});

describe("Stage 9.91 · OG-06 draft copy: the owner's structure", () => {
  it("has the new title, a short subtitle, and no 72-Hour title anywhere", () => {
    expect(allNew).toContain("Emergency Readiness<br>Checklist");
    expect(allNew).toContain("Check what your household already has, record where it is kept and see what still needs organising.");
    expect(allNew).not.toMatch(/72[- ]Hour/i);
  });

  it("has twelve neutral checklist areas, in the owner's order, as tick boxes", () => {
    expect((content.to.match(/class="checklist-box"/g) ?? []).length).toBe(12);
    const areas = ["Water to drink", "Food", "Essential medicines", "First-aid supplies", "Lighting", "Phones and communication", "Backup power for small devices", "Warm clothing and blankets", "Important documents", "Household contact details", "Pets", "Meeting place"];
    const at = areas.map((a) => newText.indexOf(`${a}:`));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });

  it("has exactly the four location fields and the meeting-place prompt", () => {
    const labels = ["Emergency supplies are kept:", "First-aid supplies are kept:", "Important documents are kept:", "Our household meeting place is:"];
    const at = labels.map((l) => newText.indexOf(l));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(newText).toContain("Choose somewhere everyone in your household knows and can get to. Talk it through together and write it here.");
  });

  it("has Why This Matters, Before You Begin, Step 1 to Step 3, Where Next and the closing wording, in that order", () => {
    const order = ["Why This Matters", "Before You Begin", "Step 1: Check What You Have", "Step 2: Record Where Things Are Kept", "Step 3: What to Organise Next", "Where Next", "Where You Are Now"];
    const at = order.map((o) => newText.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(newText).toContain("It is a planning guide, and it does not predict or guarantee any result.");
    expect(newText).toContain("not how much to keep or what to do in an emergency");
  });

  it("points on along the owner's journey: the Scorecard and Risk Identifier before, Property Type Review next, four optional topic resources", () => {
    const next = newText.slice(newText.indexOf("Where Next"));
    const order = ["Home Resilience Scorecard", "Household Risk Identifier", "Property Type Review", "Water Storage Calculator", "30-Day Pantry Builder", "Battery Backup Planner", "Healthy Home Air Audit"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
});

describe("Stage 9.91 · nothing else moved", () => {
  it("leaves the registers' OG-06 row where it was (Not started) and the counts as locked", () => {
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr.split("## Not started (18)")[1].split("## Route clashes")[0]).toMatch(/\| OG-06 \| 72-Hour Emergency Checklist \|/);
    expect(rr).toMatch(/\*\*Not started\*\*[^\n]*\*\*18\*\*/);
  });
});
