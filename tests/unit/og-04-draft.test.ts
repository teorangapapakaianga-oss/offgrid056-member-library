import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 9.81 — OG-04 Property Type Review: the narrowed draft.
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-04"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-04"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);

describe("Stage 9.81 · OG-04 locked metadata", () => {
  it("is the owner's narrowed resource, as a draft in the existing planning-tools collection", () => {
    expect(meta).toMatchObject({ title: "Property Type Review", foundation: "general", programComponent: "resilience-planning", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 15, recordStatus: "draft", collections: ["planning-tools"] });
    expect(pc.classificationsDecided["OG-04"]).toBe("resilience-planning");
    expect(COLLECTION_IDS).toContain("planning-tools");
    expect(PROGRAM_COMPONENTS).toContain("resilience-planning");
  });

  it("carries the owner-approved description, which stays focused on the property situation and what to check", () => {
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED/);
    expect(meta.description).toBe("A worksheet to record your property situation, because it shapes what you can change, what may need permission and what to check first, before you make resilience or off-grid changes.");
    expect(String(meta.description)).not.toMatch(/\b(legal|law|tenan\w*|landlord|real estate|valuation|design|install\w*|consent)\b/i);
  });

  it("records the owner's Stage 9.81A rulings: market wording, cover, grid, related list, OG-03 untouched", () => {
    for (const k of ["marketWordingStatus", "coverStatus", "constraintsGridStatus", "toHelpYouThinkStatus", "og03ReverseLinkStatus"]) expect(String(meta[k]), k).toMatch(/9\.81A/);
    expect(meta.relatedResources).not.toContain("res-1026");
    expect(meta.relatedResources).not.toContain("res-1027");
    expect((meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy?: string }>)["batteries-and-electrical"]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
  });

  it("keeps the 'To Help You Think' box to neutral reflection prompts", () => {
    const box = memberFacingText(`<div class="content">${content.to.match(/To Help You Think[\s\S]*?<\/div>\s*<table/)![0]}</div>`);
    expect(box).toContain("Questions to ask yourself");
    expect(box).not.toMatch(/\b(legal|law|tenan\w*|landlord|consents?|council|permits?|code|install\w*|solar|batter\w*|generator|regulat\w*|grant|must|cannot|allowed|illegal)\b/i);
  });

  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });

  it("proposes six related resources whose ids are real private records when the records are present; OG-03's own list is untouched", () => {
    expect(meta.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1003", "res-1020", "res-1512"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string; relatedResources: string[]; legacyCode: string });
    const titles = new Map(recs.map((r) => [r.id, r.title]));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Home Resilience Scorecard", "Household Risk Identifier", "Resilience Product Wishlist", "Household Spending Capacity Check", "Alternative Energy Suitability Check", "Off-Grid System Architecture Planner"]);
    expect(recs.find((r) => r.legacyCode === "OG-03")!.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1026", "res-1027", "res-1025"]);
    expect(recs.some((r) => r.legacyCode === "OG-04")).toBe(false); // not staged
  });

  it("records the legacy electrical topic as REMOVED (the rewrite teaches nothing on it), and adds no topic block", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    expect((meta.safetyTopicDispositions as Record<string, { disposition: string }>)["batteries-and-electrical"].disposition).toBe("REMOVED");
    expect(safetyExposureFor(newText)).toEqual([]);
  });
});

describe("Stage 9.81 · OG-04 draft copy: legacy material removed", () => {
  it("has no price, currency symbol, percentage, threshold, age claim or 30-day wording", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\b(NZD|AUD)\b|\d\s?%|per ?cent|\b(19|20)\d0s\b|30[- ]day/i);
  });

  it("has no legacy programme labels, resource codes, matrix, profile pick or removed claims", () => {
    for (const re of [/Week \d|Day \d/, /30-Day Programme/i, /Asset OG-04|\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM/i, /Property Profile|\bmatrix\b/i, /Multiple Properties|\bEstate\b|Premium approach/i, /cheaper to build|retrofit|code\+|design in|portable only|ask landlord|council check|consent check/i, /Next: OG|forward respects|Day \d+ Complete/i, /\bpillars?\b/i, /Select Your Property Profile|primary profile/i]) expect(newText, String(re)).not.toMatch(re);
  });

  it("is market-neutral: no tenancy, consent, body-corporate, grant, scheme or building-standard wording", () => {
    for (const re of [/\b(tenan\w*|landlord|lease\w*)\b/i, /\b(consents?|council|permits?|building code|compliance|certif\w+|regulat\w*|legislat\w*)\b/i, /\b(body corporate|strata|owners corporation|unit titles?)\b/i, /\b(grants?|rebate|subsid\w*)\b/i, /Warmer Kiwi|EECA|KiwiSaver|GST/i, /\b(flat|lifestyle block|wood ?burner|wood heater|acreage)\b/i]) expect(newText, String(re)).not.toMatch(re);
  });

  it("names no solar, battery, generator, fuel or fire appliance, only the general categories", () => {
    expect(newText).not.toMatch(/\b(solar|batter(y|ies)|generators?|inverters?|wood ?burner|fireplace|gas|lpg|septic|panels?)\b/i);
    for (const t of ["energy systems", "water systems", "heating", "structural work", "outdoor improvements"]) expect(newText, t).toContain(t);
  });

  it("makes no absolute legal statement and says so", () => {
    expect(newText).not.toMatch(/\b(must not|illegal|unlawful|prohibited|forbidden|required by law|entitled|always|never)\b/i);
    expect(newText).toContain("not legal, building or professional advice");
    expect(newText).toContain("nothing you tick or write here is a conclusion about what is allowed");
  });
});

describe("Stage 9.81 · OG-04 draft copy: the owner's structure", () => {
  it("asks four SEPARATE questions: occupancy, dwelling type, setting and building stage", () => {
    for (const q of ["A. How do you occupy the property?", "B. What type of dwelling is it?", "C. What is the property setting?", "D. What is the building stage?"]) expect(newText, q).toContain(q);
    for (const o of ["I own it", "I rent it", "Detached home", "Townhouse or attached home", "Apartment or unit", "Rural dwelling", "Urban or suburban", "Rural or lifestyle", "Existing", "Renovating", "Building new", "Not sure"]) expect(newText, o).toContain(o);
  });

  it("keeps the six legacy property facts, in the legacy order, as member-entered fields", () => {
    const labels = ["1. Year built (approximate)", "2. Approximate floor area", "3. Number of levels / storeys", "4. Land size (if applicable)", "5. Current insulation status (ceiling, walls, floor)", "6. Roof type and condition"];
    const at = labels.map((l) => newText.indexOf(l));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });

  it("replaces the capability matrix with a BLANK five-column constraints grid", () => {
    const grid = content.to.match(/<table class="property-table constraint-grid">[\s\S]*?<\/table>/)![0];
    expect([...grid.matchAll(/<th>([^<]*)<\/th>/g)].map((m) => m[1])).toEqual(["Area / change I am considering", "What I think I can change", "What may need permission", "What I need to check first", "Who I may need to ask"]);
    const cells = [...grid.slice(grid.indexOf("<tbody>")).matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.length % 5).toBe(0);
    expect(cells.every((c) => c === "")).toBe(true);
  });

  it("keeps the three rules in calm, practical wording", () => {
    for (const r of ["Rule 1: What I can do", "Rule 2: What I cannot do yet", "Rule 3: What I must check first"]) expect(newText, r).toContain(r);
  });

  it("points on along the owner's journey, with the energy and off-grid planners as later-stage options", () => {
    const next = newText.slice(newText.indexOf("Where Next"));
    const order = ["Home Resilience Scorecard", "Household Risk Identifier", "Resilience Product Wishlist", "Household Spending Capacity Check", "3-Tier Budget Planner", "90-Day Implementation Roadmap", "Alternative Energy Suitability Check", "Off-Grid System Architecture Planner"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toContain("later-stage options, not your next step");
  });

  it("carries a continuation heading above the last two Step 4 fields, which keep their writing space", () => {
    const tail = content.to.slice(content.to.indexOf("Step 4 — Your Property Rules (continued)"));
    expect(tail.startsWith("Step 4 — Your Property Rules (continued)")).toBe(true);
    expect(tail.indexOf("The first thing I will check, and who I will ask")).toBeGreaterThan(0);
    expect(tail.indexOf("Notes")).toBeGreaterThan(tail.indexOf("The first thing"));
    expect((tail.slice(tail.indexOf("The first thing"), tail.indexOf("Notes")).match(/worksheet-line/g) ?? []).length).toBe(2);
    expect((tail.slice(tail.indexOf("Notes")).match(/worksheet-line/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it("connects the property situation to resilience planning, off-grid plans, independence and checking before spending or building", () => {
    for (const s of ["resilience plan", "off-grid plans", "independence", "before you spend or build"]) expect(newText, s).toContain(s);
  });
});
