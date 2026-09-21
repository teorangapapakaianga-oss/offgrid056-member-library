import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { reskinHtml } from "@/admin-import/reskin/reskin";
import { findContentFlags, prepareResource, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";
import { safetyExposureFor } from "@/admin-import/audit/group-a";

/**
 * Stage 9.16. Group-A batch 2 hardening: no silent metadata fallbacks, required safety blocks enforced, legacy
 * programme text flagged, and the cover title no longer covering its label.
 */
const DOC = `<!DOCTYPE html><html><head><style>.cover-label { position: absolute; bottom: 155px; } .cover-title { position: absolute; bottom: 75px; font-size: 45px; }</style></head><body>
<div class="cover-page">
  <div class="cover-label">OffGrid056 30-Day Programme</div>
  <h1 class="cover-title">OG-27 90-Day Implementation Roadmap</h1>
  <p class="cover-subtitle">Turn your plan into phased action with deadlines</p>
</div>
<div class="content"><h2>Plan</h2><p>Install the solar inverter and batteries.</p>
<p>Next: OG-28 Household Responsibility Roster &rarr;</p></div></body></html>`;

const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];

function item(overrides: Record<string, unknown> = {}) {
  return {
    legacyCode: "OG-27",
    proposedResourceId: "res-1027",
    title: "90 Day Implementation Roadmap",
    foundation: { value: "shelter", confidence: "MEDIUM", evidence: [] },
    resourceType: { value: "planner", confidence: "MEDIUM", evidence: [] },
    legacyIssues: [],
    legacyTerminology: [],
    safetyNotes: [],
    ...overrides,
  } as unknown as PrepInputs["item"];
}

function prep(extra: Partial<PrepInputs> = {}) {
  return prepareResource({
    item: item(),
    sourceHtml: DOC,
    blocks,
    markets,
    launchMarkets: ["NZ", "AU"],
    outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-prep-")),
    ...extra,
  });
}

describe("cover layout", () => {
  it("stacks label, title and subtitle in one column so a long title cannot cover the label", () => {
    const { html } = reskinHtml(DOC);
    expect(html).toMatch(/<div class="cover-text"><div class="cover-label">[\s\S]*<h1 class="cover-title">[\s\S]*<p class="cover-subtitle">[\s\S]*<\/p><\/div>/);
    expect(html).toContain(".cover-text > .cover-label, .cover-text > .cover-title, .cover-text > .cover-subtitle { position: static");
  });

  it("leaves the centred cover design alone, which already stacks in normal flow", () => {
    const centred = DOC.replace(/<style>[^<]*<\/style>/, "<style>.cover-page { display: flex; flex-direction: column; align-items: center; } .cover-label { font-size: 11px; }</style>");
    const { html } = reskinHtml(centred);
    expect(html).not.toContain('class="cover-text"');
  });

  it("changes no cover wording", () => {
    const { html } = reskinHtml(DOC);
    for (const text of ["OffGrid056 30-Day Programme", "OG-27 90-Day Implementation Roadmap", "Turn your plan into phased action with deadlines"]) {
      expect(html).toContain(text);
    }
  });
});

describe("content flags", () => {
  it("flags programme structure, next-step links, product tiers and other resources", () => {
    const flags = findContentFlags(
      `<p>OffGrid056 30-Day Programme</p><p>Day 27 Complete</p><p>Next: OG-28 Roster &rarr;</p><p>Bonus Asset | Tier 3</p><p>for Action Plan Plus members</p>`,
      "OG-27",
    );
    const kinds = flags.map((f) => f.kind);
    expect(kinds).toContain("programme-sequencing");
    expect(kinds).toContain("day-complete");
    expect(kinds).toContain("next-link");
    expect(kinds).toContain("product-name");
    expect(flags).toContainEqual({ code: "LEGACY_PROGRAMME_CONTEXT", kind: "cross-reference", text: "OG-28" });
    expect(flags.filter((f) => f.kind !== "figure-needs-source").every((f) => f.code === "LEGACY_PROGRAMME_CONTEXT")).toBe(true);
  });

  it("flags previous-step links and the old product and platform names from config", () => {
    const terms = { productNames: ["Resilience Action Plan Community"], platformNames: ["Skool", "Kajabi"] };
    const flags = findContentFlags(
      `<p>Previous: OG-13 Heat Loss Map</p><p>Join the Resilience Action Plan Community</p><p>Post it on Kajabi</p>`,
      "OG-14",
      terms,
    );
    expect(flags.map((f) => f.kind)).toEqual(expect.arrayContaining(["previous-link", "product-name", "platform-name", "cross-reference"]));
  });

  it("does not flag the resource's own code, and flags unsourced figures and health claims", () => {
    const flags = findContentFlags(`<p>Asset code OG-27</p><p>Lowering by 1°C saves 10% on heating.</p><p>Hypothermia is a threat.</p>`, "OG-27");
    expect(flags.some((f) => f.kind === "cross-reference")).toBe(false);
    expect(flags.some((f) => f.kind === "figure-needs-source")).toBe(true);
    expect(flags.some((f) => f.kind === "health-claim")).toBe(true);
  });

  it("does not flag a resource's own weekly structure or the ordinary word 'previous'", () => {
    const flags = findContentFlags(`<p>Week 1: Learn</p><p>Week 2: Assess</p><p>Previous reports or assessments</p>`, "OG-B04");
    expect(flags).toEqual([]);
  });

  it("does not flag a roadmap's own day milestones beyond the 30-day programme", () => {
    const flags = findContentFlags(`<p>Day 90 — retrospective and next 90 days</p><p>Day 60 Remaining</p><p>Next week, review the plan.</p>`, "OG-B10");
    expect(flags).toEqual([]);
    expect(findContentFlags(`<p>Day 25 — A professional brief</p>`, "OG-25").map((f) => f.kind)).toEqual(["programme-sequencing"]);
  });

  it("finds nothing in plain teaching copy", () => {
    expect(findContentFlags(`<p>Check the roof for loose tiles after a storm.</p>`, "OG-01")).toEqual([]);
  });
});

describe("prepareResource: no silent metadata", () => {
  it("does not fall back to a foundation, type or category when the audit is only MEDIUM confidence", () => {
    const r = prep({ estimatedTime: 30, difficulty: "intermediate" });
    expect(r.foundation).toBeNull();
    expect(r.resourceType).toBeNull();
    expect(r.validation.ok).toBe(false);
    expect(r.validation.issues.join(" ")).toMatch(/foundation|category|resourceType/);
  });

  it("uses reviewed values when given", () => {
    const r = prep({ foundation: "general", resourceType: "planner", category: "planning", estimatedTime: 30, difficulty: "intermediate" });
    expect(r.foundation).toBe("general");
    expect(r.resourceType).toBe("planner");
    expect(r.validation.ok).toBe(true);
  });

  it("rejects a category that does not belong to the foundation", () => {
    const r = prep({ foundation: "energy", resourceType: "worksheet", category: "planning", estimatedTime: 30, difficulty: "advanced" });
    expect(r.validation.ok).toBe(false);
    expect(r.validation.issues.join(" ")).toContain('"planning" is not a category of the energy foundation');
  });
});

describe("required safety for any resource", () => {
  it("is computed from the text alone, so a Group-B resource is not waved through with no required blocks", () => {
    const text = "Rainwater tank. Water storage (200L). Drinking water filter. Solar panel. Battery (10kWh). Inverter. Wood burner. Chimney. Flue.";
    expect(safetyExposureFor(text)).toEqual(expect.arrayContaining(["stored-drinking-water", "batteries-and-electrical", "solid-fuel-heating"]));
    expect(safetyExposureFor("Score each room from 1 to 5.")).toEqual([]);
  });
});

describe("prepareResource: safety", () => {
  it("blocks every market when a required safety block is missing", () => {
    const r = prep({ requiredSafety: ["batteries-and-electrical"] });
    expect(r.safety.missingRequired).toEqual(["batteries-and-electrical"]);
    for (const m of r.markets) {
      expect(m.publishable).toBe(false);
      expect(m.problems.join(" ")).toContain("batteries-and-electrical");
    }
    expect(r.importReadiness).toBe("NEEDS_CONTENT_REVIEW");
  });

  it("resolves the electrical block to each market's own licence name and number", () => {
    const r = prep({ requiredSafety: ["batteries-and-electrical"], extraSafetyBlocks: ["batteries-and-electrical"] });
    expect(r.safety.missingRequired).toEqual([]);
    const nz = fs.readFileSync(r.files.find((f) => f.endsWith(".NZ.html"))!, "utf8");
    const au = fs.readFileSync(r.files.find((f) => f.endsWith(".AU.html"))!, "utf8");
    expect(nz).toContain("licensed electrical worker");
    expect(nz).not.toContain("licensed electrician");
    expect(au).toContain("licensed electrician");
    expect(au).not.toContain("licensed electrical worker");
    expect(nz).toContain("call 111");
    expect(au).toContain("call Triple Zero (000)");
    for (const html of [nz, au]) expect(html).not.toMatch(/\{\{[^}]+\}\}/);
  });

  it("fails closed in a market that has no verified wording of its own", () => {
    const r = prep({ launchMarkets: ["NZ", "AU", "US"], extraSafetyBlocks: ["batteries-and-electrical"] });
    const us = r.markets.find((m) => m.code === "US")!;
    expect(us.publishable).toBe(false);
    expect(us.problems.join(" ")).toContain("safety.notVerifiedForMarket");
    expect(r.markets.filter((m) => m.code !== "US").every((m) => m.publishable)).toBe(true);
  });

  it("keeps every topic block's NZ and AU wording free of the other market's number", () => {
    for (const block of Object.values(topicBlocks.blocks) as { id: string; marketBody: Record<string, string> }[]) {
      expect(block.marketBody.NZ, block.id).not.toMatch(/\b000\b|\b112\b|Triple Zero/);
      expect(block.marketBody.AU, block.id).not.toMatch(/\b111\b/);
    }
  });

  it("gives the PDF the member-facing title, never the legacy code", () => {
    const withTitle = DOC.replace("<!DOCTYPE html><html><head>", "<!DOCTYPE html><html><head><title>OG-27 90-Day Implementation Roadmap — OffGrid056</title>");
    const r = prep({ sourceHtml: withTitle });
    const html = fs.readFileSync(r.files[0], "utf8");
    expect(html).toContain("<title>90-Day Implementation Roadmap</title>");
    expect(html).not.toMatch(/<title>[^<]*OG-27/);
    expect(r.legacyCode).toBe("OG-27"); // kept for migration and audit history
  });

  it("is ready after final validation once metadata, content, safety and copy are all approved", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const r = prep({
      sourceHtml: clean,
      foundation: "general",
      resourceType: "planner",
      category: "planning",
      estimatedTime: 30,
      difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"],
      requiredSafety: ["batteries-and-electrical"],
      proposedBlockIds: [],
    });
    expect(r.importReadiness).toBe("READY_AFTER_FINAL_VALIDATION");
    expect(r.recordStatus).toBe("draft");
  });

  it("holds a resource that depends on one not yet in the library, whatever else is approved", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const r = prep({
      sourceHtml: clean,
      foundation: "general",
      resourceType: "planner",
      category: "planning",
      estimatedTime: 30,
      difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"],
      requiredSafety: ["batteries-and-electrical"],
      proposedBlockIds: [],
      blockedBy: { dependency: "OG-26 / 3-Tier Budget Planner" },
    });
    expect(r.validation.ok).toBe(true);
    expect(r.importReadiness).toBe("BLOCKED_BY_RESOURCE_DEPENDENCY");
    expect(r.blockedBy?.dependency).toBe("OG-26 / 3-Tier Budget Planner");
  });

  it("uses an owner-specified PDF title when one is given", () => {
    const r = prep({ pdfTitle: "90-Day Implementation Roadmap — OffGrid056" });
    expect(fs.readFileSync(r.files[0], "utf8")).toContain("<title>90-Day Implementation Roadmap — OffGrid056</title>");
  });

  it("holds a resource whose topic blocks are still proposals", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const r = prep({
      sourceHtml: clean,
      foundation: "general",
      resourceType: "planner",
      category: "planning",
      estimatedTime: 30,
      difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"],
      requiredSafety: ["batteries-and-electrical"],
      proposedBlockIds: ["batteries-and-electrical"],
    });
    expect(r.contentFlags).toEqual([]);
    expect(r.safety.proposed).toEqual(["batteries-and-electrical"]);
    expect(r.importReadiness).toBe("NEEDS_SAFETY_APPROVAL");
  });
});
