import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 9.76 — OG-03 Household Spending Capacity Check: the narrowed draft.
 *
 * Read from the committed review config (no private file needed). The draft is NOT rendered, NOT staged and NOT live.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-03"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-03"];
const content = ac.find((c) => c.where === "Worksheet content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);

describe("Stage 9.76 · OG-03 locked metadata", () => {
  it("is the owner's narrowed resource, as a draft", () => {
    expect(meta).toMatchObject({ title: "Household Spending Capacity Check", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 15, recordStatus: "draft", collections: ["planning-tools"], tags: [] });
  });

  it("carries only the standing safety blocks (no topic block)", () => {
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
  });

  it("answers all five programme-alignment questions", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
  });

  it("names the six owner-proposed related resources, and each id is a real private record when the records are present", () => {
    expect(meta.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1026", "res-1027", "res-1025"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Home Resilience Scorecard", "Household Risk Identifier", "Resilience Product Wishlist", "3-Tier Budget Planner", "90-Day Implementation Roadmap", "Project Support Brief Template"]);
  });
});

describe("Stage 9.76 · OG-03 draft copy: no legacy commercial material survives", () => {
  it("has no price, currency symbol, percentage or amount of any kind", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\b(NZD|AUD)\b|\d\s?%|per ?cent/i);
  });

  it("has no legacy programme labels, product names, funnel language or old resource codes", () => {
    for (const re of [/Week \d|Day \d/, /30-Day Programme/i, /Asset OG-03|\bOG-\d|\bOG-B\d/, /OFFGRID056\.COM/i, /DIY Starter|Community Plan|Action Plan Plus|Professional Review|Property Assessment|Skool/i, /\bpillars?\b/i, /Day \d+ Complete|scales to fit/i, /Property Profile Matrix/i, /\bsubsid|Warmer Kiwi|EECA|grant\b/i, /\btier\b(?!\s+Budget Planner)/i]) expect(newText, String(re)).not.toMatch(re);
  });

  it("keeps the Honesty Rule and the five member-entered fields in the owner's wording", () => {
    expect(newText).toContain("The Honesty Rule");
    for (const f of ["Approximate Monthly Household Income", "Essential Monthly Household Expenses", "Existing Debt / Financial Commitments", "Current Savings Available for Resilience Projects", "Realistic Amount Available to Allocate Now"]) expect(newText, f).toContain(f);
  });

  it("has the four non-commercial planning positions and the decision fields, with no number attached to any position", () => {
    for (const p of ["Protect Essentials First", "Small Steps", "Planned Upgrades", "A Larger Project"]) expect(newText, p).toContain(p);
    const block = memberFacingText(`<div class="content">${content.to.slice(content.to.indexOf("Step 3: Choose"), content.to.indexOf("Your Spending Capacity Decision"))}</div>`).replace("Step 3:", "");
    expect(block).toContain("Protect Essentials First");
    expect(block).not.toMatch(/\d/);
    for (const f of ["Amount I can realistically allocate now", "Amount I may be able to allocate later", "My first priority", "What I am not prepared to compromise", "Notes"]) expect(newText, f).toContain(f);
  });

  it("says 'not financial advice' exactly once, and never tells the member to spend", () => {
    expect((newText.match(/not financial advice/g) ?? []).length).toBe(1);
    expect(newText).not.toMatch(/\byou should (buy|spend)|aim to (spend|save)|recommended (spend|budget|amount)|target of/i);
  });

  it("does not reproduce the OG-26 tiered budget framework", () => {
    for (const p of ["Sleep Safe", "Live Well", "Full Autonomy", "Subsidy Offset", "Net Cost", "Est. Cost", "Contingency"]) expect(newText, p).not.toContain(p);
    expect(newText).toContain("3-Tier Budget Planner");
  });

  it("is market-neutral: no NZ- or AU-only agency, programme or tax wording", () => {
    expect(newText).not.toMatch(/Kiwi|energy\.gov\.au|Centrelink|KiwiSaver|superannuation|GST|\bCivil Defence\b|\bSES\b/);
  });

  it("every digit is a step or field number, the brand, or a live resource title", () => {
    const digits = [...newText.matchAll(/\d+/g)].map((m) => m[0]);
    expect(digits.every((d) => ["056", "1", "2", "3", "4", "5", "90"].includes(d)), digits.join(",")).toBe(true);
  });
});

describe("Stage 9.76A · owner rulings on the OG-03 draft", () => {
  it("the soft cost claim is gone and no cost claim replaces it", () => {
    expect(newText).not.toMatch(/many early steps|cost(s)? little or nothing|\b(free|cheap|inexpensive|low[- ]cost)\b/i);
  });

  it("the security statement is a planning principle, with no 'less secure' wording and no guarantee", () => {
    expect(newText).toContain("Protect essential household needs first when deciding what you can allocate.");
    expect(newText).not.toMatch(/less secure|more secure|guarantee(d)? (financial )?security/i);
  });

  it("states the positions are planning positions, not levels, ratings or financial assessments, and keeps the approved labels without 'Capacity'", () => {
    expect(newText).toContain("These are planning positions, not levels, ratings or financial assessments.");
    for (const l of ["Protect Essentials First", "Small Steps", "Planned Upgrades", "A Larger Project"]) expect(newText).toContain(l);
    expect(newText).not.toMatch(/(Small Step|Planned Upgrade|Larger Project) Capacity/);
  });

  it("carries the financial note once, in the owner's exact words", () => {
    expect((newText.match(/This worksheet is for personal planning only and is not financial advice\./g) ?? []).length).toBe(1);
    expect((newText.match(/financial advice/g) ?? []).length).toBe(1);
  });

  it("Where Next runs Scorecard, Risk Identifier, Wishlist, then 3-Tier Budget Planner → 90-Day Roadmap → Project Support Brief → Advanced 90-Day Roadmap, the last labelled a later-stage option", () => {
    const next = newText.slice(newText.indexOf("Where Next"));
    const order = ["Home Resilience Scorecard", "Household Risk Identifier", "Resilience Product Wishlist", "3-Tier Budget Planner", "90-Day Implementation Roadmap", "Project Support Brief Template", "90-Day Implementation Roadmap (Advanced)"].map((n) => next.indexOf(n));
    expect(order.every((p, i) => p >= 0 && (i === 0 || p > order[i - 1])), order.join(",")).toBe(true);
    expect(next).toContain("Later, for a larger plan");
    expect(next).toContain("The last row is a later-stage option, not your next step.");
  });

  it("uses the owner's exact description", () => {
    expect(meta.description).toBe("A practical worksheet to help households understand what they can realistically allocate toward resilience and off-grid improvements while protecting essential household needs.");
  });
});
describe("Stage 9.77 · the one approved wording refinement, and nothing else", () => {
  it("the savings helper text is the owner's final wording, and the old wording is gone", () => {
    expect(newText).toContain("Savings you have chosen to make available for resilience projects. Keep any savings you want to protect for other purposes separate.");
    expect(newText).not.toMatch(/Savings you could use for resilience|retirement savings|money you keep for emergencies/);
  });

  it("the other four field helpers are unchanged", () => {
    for (const h of [
      "The money that comes in each month, after tax, from all sources. Think of a typical month.",
      "What you must pay each month: housing, food, power, water, transport, insurance, health costs and anything else you cannot do without.",
      "Regular repayments and other commitments, such as loans, credit cards or hire purchase.",
      "After essentials, commitments and your safety buffer, what could you put toward resilience now without strain? It can be zero.",
    ]) expect(newText).toContain(h);
  });

  it("layout only: every fill-in section is kept whole and each major section starts a page", () => {
    for (const marker of ["Step 1: Take a Financial Snapshot", "Step 2: Work Out Your Available Capacity", "If it helps", "Step 3: Choose a Realistic Spending Position", "Your Spending Capacity Decision", "Where Next"]) {
      const at = content.to.indexOf(marker);
      expect(at, marker).toBeGreaterThan(-1);
      expect(content.to.lastIndexOf('class="keep-together page-start"', at), marker).toBeGreaterThan(content.to.lastIndexOf('class="keep-together">', at));
    }
  });
});
describe("Stage 9.78A · OG-03 is discoverable in Planning Tools, using the existing collection only", () => {
  it("is in the existing planning-tools collection, and not in Start Here", () => {
    expect(meta.collections).toEqual(["planning-tools"]);
    expect(COLLECTION_IDS).toContain("planning-tools");
  });

  it("introduces no new collection or taxonomy: the collection ids and programme components are exactly the existing ones", () => {
    expect([...COLLECTION_IDS]).toEqual(["start-here", "planning-tools"]);
    expect([...PROGRAM_COMPONENTS]).toEqual(["off-grid-living", "resilience-planning", "resilience-emergency", "planning-implementation", "advanced-future"]);
  });

  it("keeps the six related links, and the Advanced roadmap only in the PDF's Where Next table", () => {
    expect(meta.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1026", "res-1027", "res-1025"]);
    expect(meta.relatedResources as string[]).not.toContain("res-1510");
    expect(newText).toContain("90-Day Implementation Roadmap (Advanced)");
  });
});