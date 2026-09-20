import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  draftFromCandidate,
  emptyDecision,
  lowConfidenceFields,
  toResourceRecord,
  validateDraft,
  type Decision,
  type DraftRecord,
} from "@/admin-import/review/workflow";
import { loadWorkspace, saveDecisions } from "@/admin-import/review/store";
import { linkAssets } from "@/admin-import/assets/link";
import type { Candidate, MaterialKind } from "@/admin-import/types";

/**
 * Stage 9.3 is the gate between "a file we found" and "something a member sees". These tests are about the
 * gate holding: what cannot pass, and what a person must do before anything can.
 */
function candidate(overrides: Partial<Candidate> = {}): Candidate {
  const base: Candidate = {
    candidateId: "cand-0001",
    source: {
      path: "C:\\src\\OG-08_Water_Storage_Calculator.pdf",
      folder: "C:\\src",
      sourceLabel: "30-Day Programme",
      filename: "OG-08_Water_Storage_Calculator.pdf",
      extension: ".pdf",
      sizeBytes: 527119,
      modified: "2026-05-01T00:00:00.000Z",
      checksum: "sha256:" + "a".repeat(64),
      fileType: "pdf",
      onlineOnly: false,
      misplacedSource: false,
    },
    textLength: 3200,
    textError: null,
    status: "CLASSIFIED",
    materialKind: "resource",
    reviewFlags: [],
    inferred: {
      title: { value: "Water Storage Calculator", confidence: "HIGH", evidence: ["document title"] },
      resourceType: { value: "worksheet", confidence: "HIGH", evidence: ['filename contains "calculator"'] },
      foundation: { value: "water", confidence: "HIGH", evidence: ['filename contains "water"'] },
      secondaryFoundations: [],
      category: { value: "water-storage", confidence: "MEDIUM", evidence: ['title contains "storage"'] },
      legacyCode: { value: "OG-08", confidence: "HIGH", evidence: ['filename contains "OG-08"'] },
      estimatedTime: { value: 15, confidence: "MEDIUM", evidence: ["3,000 words ÷ 200 wpm"] },
      difficulty: { value: "beginner", confidence: "MEDIUM", evidence: ["stated in the document"] },
      tags: ["calculator"],
    },
    legacyBranding: false,
    legacyIssues: [],
    migrationActions: [],
    duplicateGroup: null,
    duplicateKind: null,
    duplicateOf: [],
    pairedWith: null,
    contentMismatch: false,
    disposition: null,
    importNotes: "",
    importApproved: false,
    importedAt: null,
  };
  return { ...base, ...overrides };
}

/** A complete, valid draft: the state an admin reaches after filling the editor in properly. */
const goodDraft = (): Partial<DraftRecord> => ({
  id: "res-0042",
  title: "Water Storage Calculator",
  slug: "water-storage-calculator",
  description: "Work out how much drinking water your household needs and how to store it safely.",
  foundation: "water",
  category: "water-storage",
  resourceType: "worksheet",
  difficulty: "beginner",
  estimatedTime: 15,
  tags: ["calculator"],
  learningObjectives: [],
  collections: [],
  status: "draft",
});

const decisionFor = (c: Candidate, patch: Partial<Decision> = {}): Decision => ({
  ...emptyDecision(c.candidateId, c.status),
  ...patch,
});

describe("the draft an admin starts from", () => {
  it("is the classifier's guesses, not blanks", () => {
    const d = draftFromCandidate(candidate());
    expect(d.title).toBe("Water Storage Calculator");
    expect(d.foundation).toBe("water");
    expect(d.resourceType).toBe("worksheet");
    expect(d.slug).toBe("water-storage-calculator");
    expect(d.tags).toContain("calculator");
  });

  it("leaves the id and description empty, because nobody can guess those", () => {
    const d = draftFromCandidate(candidate());
    expect(d.id).toBe("");
    expect(d.description).toBe("");
  });
});

describe("metadata validation", () => {
  it("accepts a complete record", () => {
    expect(validateDraft(goodDraft(), candidate())).toEqual([]);
  });

  it("names every missing required field", () => {
    const issues = validateDraft({}, candidate()).map((i) => i.field);
    expect(issues).toContain("id");
    expect(issues).toContain("description");
  });

  it("rejects a category that does not belong to the chosen foundation", () => {
    const issues = validateDraft({ ...goodDraft(), foundation: "air", category: "water-storage" }, candidate());
    expect(issues.some((i) => i.field === "category" && i.message.includes("not a category of air"))).toBe(true);
  });

  it("rejects values outside the library vocabulary", () => {
    const bad = validateDraft({ ...goodDraft(), resourceType: "infographic", difficulty: "expert", collections: ["nope"] }, candidate());
    const fields = bad.map((i) => i.field);
    expect(fields).toContain("resourceType");
    expect(fields).toContain("difficulty");
    expect(fields).toContain("collections");
  });

  it("rejects an id that is not in the library's format", () => {
    expect(validateDraft({ ...goodDraft(), id: "42" }, candidate()).some((i) => i.field === "id")).toBe(true);
  });

  it("checks the record against the real library schema, not a copy of the rules", () => {
    // A description the admin's own checks would allow, but the member site would refuse (over 220 characters).
    const issues = validateDraft({ ...goodDraft(), description: "x".repeat(400) }, candidate());
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((i) => i.field === "description")).toBe(true);
  });

  it("builds a record the member site would accept, with a real download", () => {
    const record = toResourceRecord({ ...draftFromCandidate(candidate()), ...goodDraft() } as DraftRecord, candidate());
    expect(record.fileFormat).toBe("PDF");
    expect(record.downloadable).toBe(true);
    expect(record.fileSizeBytes).toBe(527119);
    expect(record.status).toBe("draft"); // owner decision D9-7: everything enters as a draft
  });
});

describe("status transitions", () => {
  it("only allows the moves in the workflow table", () => {
    const c = candidate();
    const d = decisionFor(c, { status: "REJECTED" });
    expect(canTransition(c, d, "CURRENT").ok).toBe(false);
    expect(canTransition(c, d, "NEEDS_REVIEW").ok).toBe(true);
  });

  it("never offers IMPORTED as something the interface can set", () => {
    for (const [, targets] of Object.entries(ALLOWED_TRANSITIONS)) {
      expect(targets).not.toContain("IMPORTED");
    }
  });

  it("lets working states move around freely without ceremony", () => {
    const c = candidate();
    const d = decisionFor(c, { status: "CLASSIFIED" });
    for (const to of ["CURRENT", "LEGACY", "DUPLICATE", "NEEDS_REVIEW", "REJECTED"] as const) {
      expect(canTransition(c, d, to).ok).toBe(true);
    }
  });
});

describe("READY_TO_IMPORT — the gate", () => {
  const ready = (c: Candidate, patch: Partial<Decision> = {}) =>
    canTransition(c, decisionFor(c, { status: "CURRENT", draft: goodDraft(), approved: true, ...patch }), "READY_TO_IMPORT");

  it("passes when the metadata is valid and an admin has approved it", () => {
    expect(ready(candidate()).ok).toBe(true);
  });

  it("refuses without an explicit approval", () => {
    const check = ready(candidate(), { approved: false });
    expect(check.ok).toBe(false);
    expect(check.blockers.join(" ")).toMatch(/tick the approval box/);
  });

  it("refuses while the metadata is incomplete, and says exactly what is missing", () => {
    const check = ready(candidate(), { draft: { ...goodDraft(), description: "" } });
    expect(check.ok).toBe(false);
    expect(check.blockers.join(" ")).toMatch(/description/);
  });

  it("refuses while a low-confidence guess has not been looked at", () => {
    const c = candidate({
      inferred: { ...candidate().inferred, difficulty: { value: "beginner", confidence: "LOW", evidence: ["no signal"] } },
    });
    expect(lowConfidenceFields(c)).toContain("difficulty");
    const check = ready(c);
    expect(check.ok).toBe(false);
    expect(check.blockers.join(" ")).toMatch(/low confidence/);

    // Once a person confirms it, the same candidate passes.
    expect(ready(c, { reviewedFields: ["difficulty"] }).ok).toBe(true);
  });

  it("refuses while a PDF and its HTML twin disagree", () => {
    const check = ready(candidate({ contentMismatch: true }));
    expect(check.blockers.join(" ")).toMatch(/CONTENT_MISMATCH/);
  });

  it("refuses while any review flag is still open", () => {
    const check = ready(candidate({ reviewFlags: ["ASSET_LINK_REVIEW"] }));
    expect(check.blockers.join(" ")).toMatch(/ASSET_LINK_REVIEW/);
  });

  it("refuses to promote a duplicate before the duplicate itself is settled", () => {
    const c = candidate({ duplicateKind: "EXACT" });
    const check = canTransition(c, decisionFor(c, { status: "DUPLICATE", draft: goodDraft(), approved: true }), "READY_TO_IMPORT");
    expect(check.ok).toBe(false);
  });
});

describe("material that must never quietly become a resource", () => {
  const kinds: Exclude<MaterialKind, "resource">[] = ["internal", "asset", "package"];

  it.each(kinds)("refuses to import %s material, however complete the metadata", (kind) => {
    const c = candidate({ materialKind: kind, status: "NEEDS_REVIEW" });
    const check = canTransition(c, decisionFor(c, { status: "NEEDS_REVIEW", draft: goodDraft(), approved: true }), "READY_TO_IMPORT");
    expect(check.ok).toBe(false);
    expect(check.blockers.join(" ")).toMatch(/override is required/);
  });

  it.each(kinds)("allows %s material through only with a written override", (kind) => {
    const c = candidate({ materialKind: kind, status: "NEEDS_REVIEW" });
    const check = canTransition(
      c,
      decisionFor(c, {
        status: "NEEDS_REVIEW",
        draft: goodDraft(),
        approved: true,
        override: { reason: "the owner confirmed this one is a genuine member resource", by: "admin", at: new Date().toISOString() },
      }),
      "READY_TO_IMPORT",
    );
    expect(check.ok).toBe(true);
  });

  it("does not treat an empty override reason as an override", () => {
    const c = candidate({ materialKind: "asset", status: "NEEDS_REVIEW" });
    const check = canTransition(
      c,
      decisionFor(c, { status: "NEEDS_REVIEW", draft: goodDraft(), approved: true, override: { reason: "", by: "admin", at: "" } }),
      "READY_TO_IMPORT",
    );
    expect(check.ok).toBe(false);
  });
});

describe("artwork attachment (owner decision 5)", () => {
  const asset = (filename: string, id: string) =>
    candidate({
      candidateId: id,
      materialKind: "asset",
      source: { ...candidate().source, filename, extension: ".jpg", fileType: "image" },
      asset: { role: "coverImage", scope: "resource", attachTo: null, attachEvidence: [] },
      inferred: { ...candidate().inferred, legacyCode: { value: null, confidence: "LOW", evidence: [] } },
    });

  it("attaches artwork to the resource with the same OG code", () => {
    const art = asset("OG-08_cover.jpg", "cand-0002");
    art.inferred.legacyCode = { value: "OG-08", confidence: "HIGH", evidence: [] };
    const result = linkAssets([candidate(), art]);
    expect(art.asset!.attachTo).toBe("cand-0001");
    expect(result.attached).toBe(1);
    expect(art.reviewFlags).not.toContain("ASSET_LINK_REVIEW");
  });

  it("flags artwork it cannot place, rather than guessing", () => {
    const art = asset("Autumn_Photo_Shoot_042.jpg", "cand-0003");
    const result = linkAssets([candidate(), art]);
    expect(art.asset!.attachTo).toBeNull();
    expect(art.reviewFlags).toContain("ASSET_LINK_REVIEW");
    expect(result.needsReview).toBe(1);
  });

  it("treats logos, icons and section covers as brand artwork, with nothing to decide", () => {
    const brand = ["OffGrid056_Logo.png", "og-icon-air.svg", "Week2_WaterFoodAir_Cover.jpg", "FullProgramme_Bundle_Promo.jpg"].map((n, i) =>
      asset(n, `cand-01${i}`),
    );
    const result = linkAssets([candidate(), ...brand]);
    expect(result.brand).toBe(4);
    for (const b of brand) {
      expect(b.asset!.scope).toBe("brand");
      expect(b.reviewFlags).not.toContain("ASSET_LINK_REVIEW");
    }
  });
});

describe("the workspace", () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "og-review-"));
    fs.mkdirSync(path.join(root, "text"), { recursive: true });
    fs.writeFileSync(path.join(root, "candidates.json"), JSON.stringify([candidate()]), "utf8");
    fs.writeFileSync(path.join(root, "inventory.json"), JSON.stringify({ summary: { byFileType: {} }, entries: [] }), "utf8");
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  it("gives every candidate a starting decision", () => {
    const ws = loadWorkspace(root);
    expect(ws.decisions["cand-0001"].status).toBe("CLASSIFIED");
    expect(ws.decisions["cand-0001"].approved).toBe(false);
  });

  it("persists decisions, and reads them back unchanged", () => {
    const ws = loadWorkspace(root);
    ws.decisions["cand-0001"].draft = goodDraft();
    ws.decisions["cand-0001"].disposition = "KEEP";
    saveDecisions(root, ws.decisions);

    const again = loadWorkspace(root);
    expect(again.decisions["cand-0001"].draft.id).toBe("res-0042");
    expect(again.decisions["cand-0001"].disposition).toBe("KEEP");
  });

  it("writes only into the workspace, never near a source file", () => {
    const ws = loadWorkspace(root);
    saveDecisions(root, ws.decisions);
    const written = fs.readdirSync(root);
    expect(written).toContain("decisions.json");
    // The candidate's own source path is outside the workspace and must be untouched by any of this.
    expect(fs.existsSync(path.join(root, "OG-08_Water_Storage_Calculator.pdf"))).toBe(false);
  });

  it("survives a corrupt decisions file instead of losing the scan", () => {
    fs.writeFileSync(path.join(root, "decisions.json"), "{ not json", "utf8");
    const ws = loadWorkspace(root);
    expect(ws.candidates).toHaveLength(1);
    expect(ws.decisions["cand-0001"].status).toBe("CLASSIFIED");
  });
});
