/**
 * A self-contained demonstration of the import chain (Stage 9.4).
 *
 * Stage 9.4 is fixtures only, so this builds its own little world — source files, candidates, decisions and an
 * empty library — under `workspace/demo/`, and imports into that. The real workspace and the real member
 * library are not touched, and no OffGrid056 material is involved.
 *
 * Three fixtures, chosen to show the engine's behaviour rather than flatter it:
 *   1. a clean resource that imports;
 *   2. a resource whose metadata is incomplete, which must be rejected;
 *   3. an internal file marked ready by mistake, which must be refused without an override.
 */
import fs from "node:fs";
import path from "node:path";
import type { Candidate, MaterialKind } from "../types";
import { emptyDecision, type Decision, type DraftRecord } from "../review/workflow";

const FIXTURE_PDF = "%PDF-1.7\n% a fixture, not real OffGrid056 material\n";

function candidate(id: string, filename: string, sourceDir: string, materialKind: MaterialKind): Candidate {
  const filePath = path.join(sourceDir, filename);
  fs.writeFileSync(filePath, `${FIXTURE_PDF}${id}\n`);
  const stat = fs.statSync(filePath);
  return {
    candidateId: id,
    source: {
      path: filePath,
      folder: sourceDir,
      sourceLabel: "demo fixtures",
      filename,
      extension: ".pdf",
      sizeBytes: stat.size,
      modified: new Date(stat.mtimeMs).toISOString(),
      checksum: `sha256:${id.replace(/\W/g, "")}`.padEnd(71, "0"),
      fileType: "pdf",
      onlineOnly: false,
      misplacedSource: false,
    },
    textLength: 120,
    textError: null,
    status: "CURRENT",
    materialKind,
    reviewFlags: [],
    inferred: {
      title: { value: filename.replace(/\.pdf$/, "").replace(/_/g, " "), confidence: "HIGH", evidence: ["fixture"] },
      resourceType: { value: "worksheet", confidence: "HIGH", evidence: ["fixture"] },
      foundation: { value: "water", confidence: "HIGH", evidence: ["fixture"] },
      secondaryFoundations: [],
      category: { value: "water-storage", confidence: "HIGH", evidence: ["fixture"] },
      legacyCode: { value: null, confidence: "LOW", evidence: [] },
      estimatedTime: { value: 15, confidence: "HIGH", evidence: ["fixture"] },
      difficulty: { value: "beginner", confidence: "HIGH", evidence: ["fixture"] },
      tags: [],
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
}

const draft = (n: number, slug: string, overrides: Partial<DraftRecord> = {}): Partial<DraftRecord> => ({
  id: `res-9${String(n).padStart(3, "0")}`,
  title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  slug,
  description: "A demonstration fixture used to exercise the import engine. Not real member material.",
  foundation: "water",
  category: "water-storage",
  resourceType: "worksheet",
  difficulty: "beginner",
  estimatedTime: 15,
  tags: [],
  learningObjectives: [],
  collections: [],
  status: "published", // the engine must still import it as a draft (D9-7)
  ...overrides,
});

export interface DemoWorld {
  workspace: string;
  libraryRoot: string;
  candidates: Candidate[];
  decisions: Record<string, Decision>;
}

/** Build (or rebuild) the demonstration world. Everything lives under `workspace/demo/`. */
export function buildDemo(workspaceRoot: string): DemoWorld {
  const demo = path.join(workspaceRoot, "demo");
  const sourceDir = path.join(demo, "sources");
  const libraryRoot = path.join(demo, "library");
  for (const dir of [sourceDir, path.join(libraryRoot, "data", "resources"), path.join(libraryRoot, "public", "resources"), path.join(demo, "logs")]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const good = candidate("demo-0001", "Water_Storage_Fixture.pdf", sourceDir, "resource");
  const incomplete = candidate("demo-0002", "Incomplete_Fixture.pdf", sourceDir, "resource");
  const internal = candidate("demo-0003", "README_Fixture.pdf", sourceDir, "internal");

  const decisions: Record<string, Decision> = {
    "demo-0001": { ...emptyDecision("demo-0001", "CURRENT"), status: "READY_TO_IMPORT", approved: true, draft: draft(1, "water-storage-fixture") },
    // Marked ready, but with no description: the engine must reject it rather than import a blank card.
    "demo-0002": { ...emptyDecision("demo-0002", "CURRENT"), status: "READY_TO_IMPORT", approved: true, draft: draft(2, "incomplete-fixture", { description: "" }) },
    // Internal material marked ready by mistake, with no written override.
    "demo-0003": { ...emptyDecision("demo-0003", "NEEDS_REVIEW"), status: "READY_TO_IMPORT", approved: true, draft: draft(3, "readme-fixture") },
  };

  const candidates = [good, incomplete, internal];
  fs.writeFileSync(path.join(demo, "candidates.json"), JSON.stringify(candidates, null, 1), "utf8");
  fs.writeFileSync(path.join(demo, "decisions.json"), JSON.stringify(decisions, null, 1), "utf8");
  return { workspace: demo, libraryRoot, candidates, decisions };
}
