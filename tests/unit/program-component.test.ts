import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_ALIGNMENT_KEYS, prepareResource, programAlignmentGaps, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import { FIVE_FOUNDATIONS, PROGRAM_COMPONENTS, ResourceSchema } from "@/lib/content/schemas";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";

/**
 * Stage 9.64B — the programme-component classification layer.
 *
 * It describes a resource's ROLE in the member journey and does not replace the Five Foundations. Every resource migrated
 * after the model must carry a foundation, a component, a category and a type, and answer five alignment questions,
 * before it can be ready. The 21 resources that were already live are named explicitly and are not blocked.
 */
const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as {
  components: Record<string, { label: string; definition: string }>;
  alignmentQuestions: Record<string, string>;
  deployedBeforeClassification: string[];
};
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources;
const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];

const DOC = `<!DOCTYPE html><html><head></head><body><div class="cover-page"><div class="cover-label">OffGrid056</div><h1 class="cover-title">Checklist</h1><p class="cover-subtitle">A checklist.</p></div><div class="content"><h2>Plan</h2><p>Work through the questions below.</p></div></body></html>`;
const ALIGNMENT = Object.fromEntries(PROGRAM_ALIGNMENT_KEYS.map((k) => [k, `answer for ${k}`]));
function prep(extra: Partial<PrepInputs> = {}) {
  return prepareResource({
    item: { legacyCode: "OG-98", proposedResourceId: "res-1098", title: "Checklist", foundation: { value: "shelter", confidence: "HIGH", evidence: [] }, resourceType: { value: "checklist", confidence: "HIGH", evidence: [] }, legacyIssues: [], legacyTerminology: [], safetyNotes: [] } as unknown as PrepInputs["item"],
    sourceHtml: DOC, blocks, markets, launchMarkets: ["NZ", "AU"], outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-pc-")),
    description: "A checklist to work through.", foundation: "shelter", resourceType: "checklist", category: "insulation", difficulty: "beginner", estimatedTime: 30,
    proposedBlockIds: [], ...extra,
  });
}

describe("Stage 9.64B · the component vocabulary", () => {
  it("is exactly the five approved components, defined in config", () => {
    expect([...PROGRAM_COMPONENTS]).toEqual(["off-grid-living", "resilience-planning", "resilience-emergency", "planning-implementation", "advanced-future"]);
    expect(Object.keys(config.components)).toEqual([...PROGRAM_COMPONENTS]);
    for (const c of Object.values(config.components)) {
      expect(c.label.length).toBeGreaterThan(2);
      expect(c.definition.length).toBeGreaterThan(40);
    }
  });

  it("does not replace the Five Foundations", () => {
    expect([...FIVE_FOUNDATIONS]).toEqual(["air", "water", "shelter", "food", "energy"]);
    expect(Object.keys(config.alignmentQuestions)).toEqual([...PROGRAM_ALIGNMENT_KEYS]);
  });

  it("the resource schema accepts a valid component, rejects an invented one, and leaves it optional", () => {
    const base = {
      id: "res-1098", slug: "x-y", title: "A checklist", description: "A checklist to work through.", foundation: "shelter", category: "insulation", resourceType: "checklist", difficulty: "beginner", estimatedTime: 30,
      featured: false, premium: false, isPlaceholder: false, status: "draft", downloadable: false, publishedDate: "2026-10-06", completionAvailable: true, learningObjectives: [], tags: [], relatedResources: [],
    };
    expect(ResourceSchema.safeParse({ ...base, programComponent: "resilience-planning" }).success).toBe(true);
    expect(ResourceSchema.safeParse({ ...base, programComponent: "home-heating" }).success).toBe(false);
    expect(ResourceSchema.safeParse(base).success, "optional: already-live resources carry none").toBe(true);
  });
});

describe("Stage 9.64B · programme alignment is required before a new resource can be ready", () => {
  it("a resource with no component is held at NEEDS_OWNER_METADATA", () => {
    const r = prep({ programComponentRequired: true, programComponent: null, programAlignment: null });
    expect(r.importReadiness).toBe("NEEDS_OWNER_METADATA");
  });

  it("a component with an unanswered alignment question is held too", () => {
    const partial = { ...ALIGNMENT, wordingMatchesRole: "" };
    const r = prep({ programComponentRequired: true, programComponent: "resilience-planning", programAlignment: partial });
    expect(r.importReadiness).toBe("NEEDS_OWNER_METADATA");
    expect(programAlignmentGaps({ programComponent: "resilience-planning", programAlignment: partial })).toEqual(["alignment question unanswered: wordingMatchesRole"]);
  });

  it("an invented component fails validation", () => {
    const r = prep({ programComponentRequired: true, programComponent: "home-heating", programAlignment: ALIGNMENT });
    expect(r.validation.ok).toBe(false);
    expect(r.validation.issues.join(" ")).toMatch(/programComponent/);
  });

  it("a fully classified resource is ready, and carries its component", () => {
    const r = prep({ programComponentRequired: true, programComponent: "resilience-planning", programAlignment: ALIGNMENT });
    expect(r.importReadiness).toBe("READY_AFTER_FINAL_VALIDATION");
    expect(r.programComponent).toBe("resilience-planning");
  });

  it("a resource that predates the model is not blocked for lacking one", () => {
    expect(prep({ programComponentRequired: false }).importReadiness).toBe("READY_AFTER_FINAL_VALIDATION");
  });

  it("names the 21 already-live resources explicitly, and OG-B09 is not one of them", () => {
    expect(config.deployedBeforeClassification).toHaveLength(21);
    expect(new Set(config.deployedBeforeClassification).size).toBe(21);
    expect(config.deployedBeforeClassification).toContain("OG-17");
    expect(config.deployedBeforeClassification).not.toContain("OG-B09");
  });
});

describe("Stage 9.64B · OG-B09 classification", () => {
  const e = meta["OG-B09"];
  it("is Resilience Planning — not a pure Off-Grid Living resource", () => {
    expect(e.programComponent).toBe("resilience-planning");
    expect(e.programComponent).not.toBe("off-grid-living");
    expect(e).toMatchObject({ title: "Resilient Heating & Insulation Upgrade Checklist", foundation: "shelter", category: "insulation", resourceType: "checklist", difficulty: "beginner", estimatedTime: 30, tags: [], recordStatus: "draft" });
  });

  it("has answered all five alignment questions", () => {
    expect(programAlignmentGaps({ programComponent: e.programComponent as string, programAlignment: e.programAlignment as Record<string, string> })).toEqual([]);
  });

  it("keeps the resilience wording and its required safety blocks (nothing is weakened to avoid a block)", () => {
    expect(e.safetyBlocks).toEqual(["gas-and-lpg-general", "solid-fuel-heating", "batteries-and-electrical"]);
    expect(String(e.approvedSafetyBlocksStatus)).toMatch(/KEPT/);
  });

  it("has the four approved related resources", () => {
    expect(e.relatedResources).toEqual(["res-1015", "res-1017", "res-1019", "res-1021"]);
  });
});
