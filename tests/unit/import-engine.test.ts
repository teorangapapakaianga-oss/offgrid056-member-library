import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { planImport, runImport, updateLedger, type ImportTarget } from "@/admin-import/import/engine";
import { emptyDecision, type Decision, type DraftRecord } from "@/admin-import/review/workflow";
import type { Candidate } from "@/admin-import/types";

/**
 * Stage 9.4 runs against controlled fixtures only — no real OffGrid056 material is imported.
 *
 * The engine writes into the member library, so these tests are mostly about damage control: what it refuses,
 * what it backs up, and what it puts back when something goes wrong halfway through.
 */
let root: string; // stands in for the library (data/ and public/)
let workspace: string;
let sourceDir: string; // stands in for the owner's source folders
let target: ImportTarget;

const SOURCE_BYTES = "%PDF-1.7\nfixture resource, not real OffGrid056 material\n";

function fixtureCandidate(n: number, overrides: Partial<Candidate> = {}): Candidate {
  const filename = `OG-${String(n).padStart(2, "0")}_Fixture_Resource.pdf`;
  const filePath = path.join(sourceDir, filename);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, `${SOURCE_BYTES}${n}`);
  const base: Candidate = {
    candidateId: `cand-${String(n).padStart(4, "0")}`,
    source: {
      path: filePath,
      folder: sourceDir,
      sourceLabel: "fixtures",
      filename,
      extension: ".pdf",
      sizeBytes: fs.statSync(filePath).size,
      modified: "2026-05-01T00:00:00.000Z",
      checksum: `sha256:${String(n).repeat(64).slice(0, 64)}`,
      fileType: "pdf",
      onlineOnly: false,
      misplacedSource: false,
    },
    textLength: 100,
    textError: null,
    status: "CURRENT",
    materialKind: "resource",
    reviewFlags: [],
    inferred: {
      title: { value: `Fixture Resource ${n}`, confidence: "HIGH", evidence: [] },
      resourceType: { value: "worksheet", confidence: "HIGH", evidence: [] },
      foundation: { value: "water", confidence: "HIGH", evidence: [] },
      secondaryFoundations: [],
      category: { value: "water-storage", confidence: "HIGH", evidence: [] },
      legacyCode: { value: `OG-${String(n).padStart(2, "0")}`, confidence: "HIGH", evidence: [] },
      estimatedTime: { value: 15, confidence: "HIGH", evidence: [] },
      difficulty: { value: "beginner", confidence: "HIGH", evidence: [] },
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
  return { ...base, ...overrides };
}

const readyDraft = (n: number): Partial<DraftRecord> => ({
  id: `res-${String(n).padStart(4, "0")}`,
  title: `Fixture Resource ${n}`,
  slug: `fixture-resource-${n}`,
  description: "A controlled fixture used to test the import engine. Not real member material.",
  foundation: "water",
  category: "water-storage",
  resourceType: "worksheet",
  difficulty: "beginner",
  estimatedTime: 15,
  tags: [],
  learningObjectives: [],
  collections: [],
  status: "published", // deliberately not draft: the engine must force draft anyway (D9-7)
});

const readyDecision = (n: number, patch: Partial<Decision> = {}): Decision => ({
  ...emptyDecision(`cand-${String(n).padStart(4, "0")}`, "CURRENT"),
  status: "READY_TO_IMPORT",
  approved: true,
  draft: readyDraft(n),
  ...patch,
});

const decisionsFor = (...ns: number[]) =>
  Object.fromEntries(ns.map((n) => [`cand-${String(n).padStart(4, "0")}`, readyDecision(n)])) as Record<string, Decision>;

const resourceFile = (slug: string) => path.join(root, "data", "resources", `${slug}.json`);
const auditLines = () =>
  fs
    .readFileSync(path.join(workspace, "logs", "audit.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l) as Record<string, unknown>);

beforeEach(() => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-import-"));
  root = path.join(tmp, "library");
  workspace = path.join(tmp, "workspace");
  sourceDir = path.join(tmp, "sources");
  for (const d of [path.join(root, "data", "resources"), path.join(root, "public", "resources"), workspace, sourceDir]) {
    fs.mkdirSync(d, { recursive: true });
  }
  target = { libraryRoot: root, workspace };
});

afterEach(() => {
  fs.rmSync(path.dirname(root), { recursive: true, force: true });
});

describe("planning", () => {
  it("ignores everything that is not marked ready to import", () => {
    const candidates = [fixtureCandidate(1), fixtureCandidate(2)];
    const decisions = { ...decisionsFor(1), "cand-0002": emptyDecision("cand-0002", "CURRENT") };
    const plan = planImport(candidates, decisions, target);
    expect(plan.items).toHaveLength(1);
    expect(plan.items[0].candidateId).toBe("cand-0001");
  });

  it("plans a create when the resource is new, and a replace when it exists", () => {
    const candidates = [fixtureCandidate(1)];
    expect(planImport(candidates, decisionsFor(1), target).items[0].action).toBe("create");

    fs.writeFileSync(resourceFile("fixture-resource-1"), "{}");
    expect(planImport(candidates, decisionsFor(1), target).items[0].action).toBe("replace");
  });

  it("re-checks the gate instead of trusting the stored status", () => {
    // Marked ready, but the metadata is not valid any more.
    const decisions = decisionsFor(1);
    decisions["cand-0001"].draft = { ...readyDraft(1), description: "" };
    const plan = planImport([fixtureCandidate(1)], decisions, target);
    expect(plan.items[0].action).toBe("reject");
    expect(plan.items[0].reasons.join(" ")).toMatch(/description/);
  });

  it("refuses material that is not a resource, even when it is marked ready", () => {
    const internal = fixtureCandidate(1, { materialKind: "internal" });
    const plan = planImport([internal], decisionsFor(1), target);
    expect(plan.items[0].action).toBe("reject");
    expect(plan.items[0].reasons.join(" ")).toMatch(/override is required/);
  });
});

describe("dry run", () => {
  it("writes nothing at all", () => {
    const plan = planImport([fixtureCandidate(1)], decisionsFor(1), target);
    const result = runImport(plan, target, { commit: false });

    expect(result.committed).toBe(false);
    expect(result.imported).toHaveLength(0);
    expect(fs.existsSync(resourceFile("fixture-resource-1"))).toBe(false);
    expect(fs.readdirSync(path.join(root, "data", "resources"))).toHaveLength(0);
  });

  it("still records that it was asked", () => {
    runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: false });
    expect(auditLines().some((l) => l.event === "import.dry-run")).toBe(true);
  });
});

describe("batch import", () => {
  it("imports several candidates in one run", () => {
    const candidates = [1, 2, 3].map((n) => fixtureCandidate(n));
    const plan = planImport(candidates, decisionsFor(1, 2, 3), target);
    expect(plan.counts.create).toBe(3);

    const result = runImport(plan, target, { commit: true });
    expect(result.imported).toHaveLength(3);
    for (const n of [1, 2, 3]) {
      expect(fs.existsSync(resourceFile(`fixture-resource-${n}`))).toBe(true);
    }
  });

  it("writes a record the library can actually read, as a draft", () => {
    runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: true });
    const record = JSON.parse(fs.readFileSync(resourceFile("fixture-resource-1"), "utf8"));

    expect(record.id).toBe("res-0001");
    expect(record.slug).toBe("fixture-resource-1");
    expect(record.foundation).toBe("water");
    // The editor said "published"; owner decision D9-7 says everything enters as a draft.
    expect(record.status).toBe("draft");
  });

  it("copies the download beside the record without touching the source", () => {
    const candidate = fixtureCandidate(1);
    const before = fs.readFileSync(candidate.source.path);
    const beforeMtime = fs.statSync(candidate.source.path).mtimeMs;

    runImport(planImport([candidate], decisionsFor(1), target), target, { commit: true });

    expect(fs.existsSync(path.join(root, "public", "resources", "fixture-resource-1.pdf"))).toBe(true);
    expect(fs.readFileSync(candidate.source.path)).toEqual(before);
    expect(fs.statSync(candidate.source.path).mtimeMs).toBe(beforeMtime);
  });

  it("leaves nothing half-written behind", () => {
    runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: true });
    const leftovers = fs.readdirSync(path.join(root, "data", "resources")).filter((f) => f.endsWith(".importing"));
    expect(leftovers).toHaveLength(0);
  });
});

describe("backup before replacement", () => {
  it("backs up the existing record before overwriting it", () => {
    const original = JSON.stringify({ id: "res-0001", note: "the version that was already there" });
    fs.writeFileSync(resourceFile("fixture-resource-1"), original);

    const result = runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: true });

    expect(result.backupDir).not.toBeNull();
    const backup = path.join(result.backupDir!, "data", "resources", "fixture-resource-1.json");
    expect(fs.existsSync(backup)).toBe(true);
    expect(fs.readFileSync(backup, "utf8")).toBe(original); // the old version, intact
    expect(JSON.parse(fs.readFileSync(resourceFile("fixture-resource-1"), "utf8")).note).toBeUndefined();
  });

  it("backs up an existing download too", () => {
    fs.writeFileSync(resourceFile("fixture-resource-1"), "{}");
    const download = path.join(root, "public", "resources", "fixture-resource-1.pdf");
    fs.writeFileSync(download, "the old download");

    const result = runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: true });
    const backup = path.join(result.backupDir!, "public", "resources", "fixture-resource-1.pdf");
    expect(fs.readFileSync(backup, "utf8")).toBe("the old download");
  });

  it("creates no backup when nothing is being replaced", () => {
    const result = runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: true });
    expect(result.backupDir).toBeNull();
  });
});

describe("rollback", () => {
  it("restores everything when a write fails part way through a batch", () => {
    const untouched = JSON.stringify({ id: "res-0002", note: "must survive" });
    fs.writeFileSync(resourceFile("fixture-resource-2"), untouched);

    const plan = planImport([1, 2, 3].map((n) => fixtureCandidate(n)), decisionsFor(1, 2, 3), target);
    // The third write fails: its source file disappears after planning.
    fs.rmSync(plan.items[2].sourceFile!);

    const result = runImport(plan, target, { commit: true });

    expect(result.error).not.toBeNull();
    expect(result.rolledBack).toBe(true);
    expect(result.imported).toHaveLength(0);
    // The record created earlier in the batch is gone again…
    expect(fs.existsSync(resourceFile("fixture-resource-1"))).toBe(false);
    // …and the one that was replaced is back exactly as it was.
    expect(fs.readFileSync(resourceFile("fixture-resource-2"), "utf8")).toBe(untouched);
  });

  it("records the rollback", () => {
    const plan = planImport([fixtureCandidate(1)], decisionsFor(1), target);
    fs.rmSync(plan.items[0].sourceFile!);
    runImport(plan, target, { commit: true });
    expect(auditLines().some((l) => l.event === "import.rolled-back")).toBe(true);
  });
});

describe("rejecting invalid imports", () => {
  it("rejects without writing anything, and says why", () => {
    const decisions = decisionsFor(1, 2);
    decisions["cand-0002"].draft = { ...readyDraft(2), id: "nonsense" };

    const plan = planImport([fixtureCandidate(1), fixtureCandidate(2)], decisions, target);
    const result = runImport(plan, target, { commit: true });

    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].candidateId).toBe("cand-0002");
    expect(result.rejected[0].reasons.join(" ")).toMatch(/id/);
    expect(fs.existsSync(resourceFile("fixture-resource-2"))).toBe(false);
    // A rejection does not stop the valid ones.
    expect(fs.existsSync(resourceFile("fixture-resource-1"))).toBe(true);
  });

  it("rejects a candidate whose low-confidence guesses were never confirmed", () => {
    const candidate = fixtureCandidate(1, {
      inferred: { ...fixtureCandidate(1).inferred, difficulty: { value: "beginner", confidence: "LOW", evidence: [] } },
    });
    const plan = planImport([candidate], decisionsFor(1), target);
    expect(plan.items[0].action).toBe("reject");
    expect(plan.items[0].reasons.join(" ")).toMatch(/low confidence/);
  });
});

describe("importing twice", () => {
  it("skips a candidate already imported from identical bytes", () => {
    const candidates = [fixtureCandidate(1)];
    const first = runImport(planImport(candidates, decisionsFor(1), target), target, { commit: true });
    updateLedger(target, first.imported);

    const second = planImport(candidates, decisionsFor(1), target);
    expect(second.items[0].action).toBe("skip");
    expect(second.items[0].reasons.join(" ")).toMatch(/already imported/);
  });

  it("re-imports when the source file has changed since", () => {
    const candidates = [fixtureCandidate(1)];
    const first = runImport(planImport(candidates, decisionsFor(1), target), target, { commit: true });
    updateLedger(target, first.imported);

    const changed = [fixtureCandidate(1, { source: { ...candidates[0].source, checksum: "sha256:" + "f".repeat(64) } })];
    expect(planImport(changed, decisionsFor(1), target).items[0].action).toBe("replace");
  });
});

describe("audit logging", () => {
  it("records every write with what it was and what it replaced", () => {
    fs.writeFileSync(resourceFile("fixture-resource-1"), "{}");
    runImport(planImport([fixtureCandidate(1), fixtureCandidate(2)], decisionsFor(1, 2), target), target, { commit: true, by: "owner" });

    const writes = auditLines().filter((l) => l.event === "import.write");
    expect(writes).toHaveLength(2);
    expect(writes[0]).toMatchObject({ candidateId: "cand-0001", slug: "fixture-resource-1", action: "replace", by: "owner" });
    expect(writes[0].backup).toBeTruthy();
    expect(writes[1]).toMatchObject({ candidateId: "cand-0002", action: "create" });
    expect(writes[1].backup).toBeNull();
  });

  it("only ever appends", () => {
    runImport(planImport([fixtureCandidate(1)], decisionsFor(1), target), target, { commit: true });
    const after_first = auditLines().length;
    runImport(planImport([fixtureCandidate(2)], decisionsFor(2), target), target, { commit: true });
    expect(auditLines().length).toBeGreaterThan(after_first);
  });
});

describe("source integrity across a whole import", () => {
  it("leaves every source file byte-identical, including its timestamp", () => {
    const candidates = [1, 2, 3].map((n) => fixtureCandidate(n));
    const before = candidates.map((c) => ({
      path: c.source.path,
      bytes: fs.readFileSync(c.source.path),
      mtime: fs.statSync(c.source.path).mtimeMs,
    }));

    const result = runImport(planImport(candidates, decisionsFor(1, 2, 3), target), target, { commit: true });
    expect(result.imported).toHaveLength(3);

    for (const b of before) {
      expect(fs.existsSync(b.path)).toBe(true);
      expect(fs.readFileSync(b.path)).toEqual(b.bytes);
      expect(fs.statSync(b.path).mtimeMs).toBe(b.mtime);
    }
  });
});
