import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { applyCopyChanges, fuelSafetyFindings, memberFacingText } from "@/admin-import/pilot/prep";
import { reskinHtml } from "@/admin-import/reskin/reskin";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";
import { programAlignmentGaps } from "@/admin-import/pilot/prep";

/**
 * Stage 9.68 — OG-01 Home Resilience Scorecard: owner rulings and the migrated DRAFT.
 * Nothing here renders or deploys OG-01.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
interface Change { where: string; from: string; to: string; expectedMatches: number; markets?: string[]; approvedBy: string; approvedOn: string; reason: string }
const changes = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-01"] ?? [];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-01"];
const text = (html: string) => html.slice(html.indexOf("<body")).replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<input[^>]*placeholder="([^"]*)"[^>]*>/g, " $1 ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();


describe("Stage 9.68 · OG-01 owner rulings are recorded exactly", () => {
  it("carries the approved metadata", () => {
    expect(meta).toMatchObject({
      title: "Home Resilience Scorecard",
      foundation: "general",
      programComponent: "resilience-planning",
      category: "getting-started",
      resourceType: "assessment",
      difficulty: "beginner",
      estimatedTime: 20,
      tags: [],
      recordStatus: "draft",
      description: "Assess your household across Air, Water, Shelter, Food and Energy, identify the foundations that need the most attention, and choose practical next steps for building greater resilience and independence.",
      difficultyBasis: "OWNER-APPROVED / INFERRED",
      timeBasis: "OWNER-APPROVED / INFERRED",
    });
    expect(String(meta.memberJourneyRole)).toMatch(/^START HERE/);
    expect(meta.collections).toEqual(["start-here"]);
  });

  it("has answered the five programme-alignment questions", () => {
    expect(programAlignmentGaps({ programComponent: meta.programComponent as string, programAlignment: meta.programAlignment as Record<string, string> })).toEqual([]);
  });

  it("carries exactly the electrical and fire blocks — not carbon monoxide — and suppresses nothing", () => {
    expect(meta.safetyBlocks).toEqual(["batteries-and-electrical", "fire-and-smoke-alarms"]);
    expect(meta.approvedSafetyBlocks).toEqual(["batteries-and-electrical", "fire-and-smoke-alarms"]);
    expect(meta.safetyBlocks as string[]).not.toContain("carbon-monoxide");
    for (const k of ["safetyExemptions", "safetyTopicDispositions", "fuelExemptions", "priceDispositions", "safetyBlockTrims"]) expect(meta[k], k).toBeUndefined();
  });

  it("asks for its topic safety blocks to appear in a labelled Safety Notes section", () => {
    expect(meta.safetyBlockPlacement).toBe("safety-notes");
    expect(String(meta.safetyBlockPlacementStatus)).toMatch(/intact and unshortened/);
  });

  it("has the six approved related resources, one per foundation plus the Risk Identifier", () => {
    expect(meta.relatedResources).toEqual(["res-1013", "res-1008", "res-1015", "res-1011", "res-1019", "res-1002"]);
  });

  it("every copy change is owner-approved, dated and reasoned", () => {
    expect(changes.length).toBeGreaterThanOrEqual(5);
    for (const c of changes) {
      expect(c.approvedBy, c.where).toBe("owner");
      expect(c.approvedOn, c.where).toBe("2026-10-06");
      expect(c.reason.length, c.where).toBeGreaterThan(20);
    }
  });

  it("records the scale as owner-defined, with the bands OWNER-APPROVED and no headline total", () => {
    expect(String(meta.scaleStatus)).toMatch(/OWNER-DEFINED \/ OFFGRID056 SELF-ASSESSMENT SCALE/);
    expect(String(meta.scaleStatus)).toMatch(/NO headline total/);
    expect(String(meta.scaleStatus)).toMatch(/OWNER-APPROVED 2026-10-06 \(Stage 9\.68A\)[\s\S]*Starting Point 2–9, Building Resilience 10–15, Strong Foundation 16–20/);
    expect(String(meta.scaleStatus)).toMatch(/no scientific, government or predictive validity/);
  });

  it("records the context-aware duration-of-supply task for the future, and does not apply it", () => {
    const f = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/future-tasks.json"), "utf8")) as { tasks: { id: string; status: string; mustDistinguish: Record<string, string>; constraints: string[] }[] };
    const t = f.tasks.find((x) => x.id === "context-aware-duration-of-supply-claim-type")!;
    expect(t.status).toMatch(/NOT STARTED/);
    expect(t.mustDistinguish.ordinarySentence).toContain("You do not need to buy 30 days of food in one shop.");
    expect(t.constraints.join(" ")).toMatch(/Do not modify OG-11/);
  });
});

describe("Stage 9.68 · the migrated OG-01 draft, built from the legacy source when the working copy has it", () => {
  const list = path.join(root, "workspace/candidates.json");
  const build = (): string | null => {
    if (!fs.existsSync(list)) return null;
    const cands = JSON.parse(fs.readFileSync(list, "utf8")) as { source: { path: string; filename: string; extension: string } }[];
    const f = cands.find((c) => c.source.filename.startsWith("OG-01_") && /\.html?$/i.test(c.source.extension));
    if (!f) return null;
    const skinned = reskinHtml(fs.readFileSync(f.source.path, "utf8"), { strapline: "Prepare • Adapt • Thrive" }).html;
    const out = applyCopyChanges(skinned, changes);
    for (const r of out.results) expect(r.applied, r.where).toBe(true);
    return out.html;
  };

  it("applies every approved change exactly once", () => {
    build();
  });

  it("removes every legacy programme label, number and alarming band", () => {
    const html = build();
    if (!html) return;
    const t = text(html);
    expect(t).not.toMatch(/30-Day Programme|Day 1|Day 1 Complete|OG-0\d|Next:|Week 1/);
    expect(t).not.toMatch(/\b10\s?L\b|3 days|7\+|72 hours|\/\s?100|100 points|Quick-Fire/);
    expect(t).not.toMatch(/Critical|Vulnerable|Fully prepared|Capable|Weak Spot|know exactly|Pillar/i);
    expect(t).not.toMatch(/\bCO detector\b|every level|refer to it daily/);
  });

  it("scores 1–10, two questions per foundation, with a result out of 20 per foundation and NO headline total", () => {
    const html = build();
    if (!html) return;
    const t = text(html);
    for (const f of ["AIR", "WATER", "SHELTER", "FOOD", "ENERGY"]) expect(t, f).toContain(f);
    expect((html.match(/<td class="question-col">(?:[1-9]|10)\. /g) ?? []).length).toBe(10);
    expect((html.match(/__ \/ 20/g) ?? []).length).toBe(5);
    expect(t).toContain("OffGrid056 self-assessment scale");
    expect(t).toMatch(/not scientifically validated/);
    expect(t).toMatch(/not approved by any government or agency/);
    expect(t).toMatch(/does not predict safety/);
    expect(t).toMatch(/not a guarantee of preparedness/);
    expect(t).toMatch(/Do not add the foundations together/);
  });

  it("has the ten revised Part A questions, word for word", () => {
    const html = build();
    if (!html) return;
    const t = text(html);
    for (const q of [
      "1. We do not regularly notice damp, condensation or visible mould in our home.",
      "2. The air inside our home feels fresh rather than stuffy.",
      "3. We know where our household water comes from and how it reaches us.",
      "4. We have identified a backup source of water we could use if our usual supply were interrupted.",
      "5. Our home holds warmth reasonably well and does not feel difficult to keep comfortable in colder weather.",
      "6. Our roof, windows and doors keep the weather out, with no leaks or draughts.",
      "7. We know what food we have available and where it is stored.",
      "8. We rotate the food we store so that nothing is forgotten or out of date.",
      "9. We have a backup source of power for our essential needs (for example solar, a battery, a generator or a charged power station).",
      "10. We have a safe backup plan for essential lighting, phone charging and food preparation if mains power is unavailable.",
    ]) expect(t, q).toContain(q);
    expect(t).not.toMatch(/insulated|heating costs|can reach it easily|basic cooking/);
  });

  it("flows: How To Use → About → Part A → Results → Priorities → Part B → Household → Safety Notes → Where Next → Closing", () => {
    const html = build();
    if (!html) return;
    const body = text(html);
    const order = ["How To Use This Scorecard", "About This Scale", "Part A — Your Five Foundations", "Your Foundation Results", "Your Three Priority Foundations", "Part B — Emergency Basics", "Household Considerations These are not scored", "Safety Notes These safety notes apply", "Where Next Each foundation has a resource", "Where You Are Now"];
    const at = order.map((s) => body.indexOf(s));
    expect(at.every((i) => i >= 0), order.filter((_, i) => at[i] < 0).join(",")).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });

  it("leaves no safety marker behind and does not add a universal carbon-monoxide question", () => {
    const html = build();
    if (!html) return;
    expect(html).toContain("og056:safety-notes");
    expect(text(html)).not.toMatch(/carbon monoxide|CO alarm|CO detector/i);
  });

  it("uses calm foundation band names and none of the forbidden ones", () => {
    const html = build();
    if (!html) return;
    const t = text(html);
    for (const band of ["Starting Point", "Building Resilience", "Strong Foundation"]) expect(t, band).toContain(band);
  });

  it("keeps Part B separate and unscored, with no fixed durations", () => {
    const html = build();
    if (!html) return;
    const t = text(html);
    expect(t).toContain("Part B — Emergency Basics");
    expect(t).toMatch(/It is not scored and is not part of your foundation results/);
    expect(t).toContain("Our home has working smoke alarms.");
    expect(t).toContain("Our household has stored emergency drinking water.");
    expect(t).toContain("Our household keeps food that could support us through a disruption.");
    const partB = t.slice(t.indexOf("Part B — Emergency Basics"), t.indexOf("Household Considerations"));
    expect(partB).not.toMatch(/\d+\s?(?:days?|hours?|L\b|litres?)/);
  });

  it("has the household considerations, three priority foundations and where-next mapping", () => {
    const html = build();
    if (!html) return;
    const t = text(html);
    for (const p of ["Communication", "Children, older people, or anyone with disability or mobility needs", "Essential medications", "Sanitation", "Heating and cooking fuel", "Pets or animals"]) expect(t, p).toContain(p);
    expect(t).toContain("Use your results to choose the three foundations you want to work on first.");
    for (const r of ["Healthy Home Air Audit", "Water Storage Calculator", "Warm Home Scorecard", "30-Day Pantry Builder", "Battery Backup Planner", "Household Risk Identifier"]) expect(t, r).toContain(r);
    expect(t).toContain("Quick Household Facts");
  });

  it("has no numeric Bucket C, no price, no gas, in either market", () => {
    const html = build();
    if (!html) return;
    for (const market of ["NZ", "AU"]) {
      const c = scanNumericClaims(html, { resource: "OG-01", market, registry, treatment }).filter((x) => x.bucket === "C_NEEDS_SOURCE");
      expect(c.map((x) => x.figure), market).toEqual([]);
    }
    expect(fuelSafetyFindings(html)).toEqual([]);
    expect(text(html)).not.toMatch(/[$]\s?\d/);
  });

  it("does not trigger a fire false positive, and the electrical topic is the detector-required one", () => {
    const html = build();
    if (!html) return;
    const topics = safetyExposureFor(memberFacingText(html));
    expect(topics).toContain("batteries-and-electrical");
    expect(text(html)).not.toMatch(/Quick-Fire/);
    for (const not of ["gas-and-lpg", "solid-fuel-heating", "water-treatment", "carbon-monoxide"]) expect(topics, not).not.toContain(not);
  });
});
