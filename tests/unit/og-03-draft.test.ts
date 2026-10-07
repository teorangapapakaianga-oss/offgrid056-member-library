import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { memberFacingText } from "@/admin-import/pilot/prep";

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
    expect(meta).toMatchObject({ title: "Household Spending Capacity Check", foundation: "general", programComponent: "planning-implementation", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 15, recordStatus: "draft", collections: [], tags: [] });
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
