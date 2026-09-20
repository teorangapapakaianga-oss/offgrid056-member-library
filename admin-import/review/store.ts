/**
 * The review workspace: everything the admin interface reads and writes.
 *
 * All of it lives in `workspace/` (git-ignored, never deployed). Editing in the admin UI changes decisions
 * here and **nothing else** — source files are never touched, and the member library is not written to until
 * Stage 9.4 performs an actual import.
 */
import fs from "node:fs";
import path from "node:path";
import type { Candidate, DuplicateGroup, ScanSummary } from "../types";
import { emptyDecision, type Decision } from "./workflow";

export interface Workspace {
  root: string;
  summary: ScanSummary;
  candidates: Candidate[];
  groups: DuplicateGroup[];
  decisions: Record<string, Decision>;
  texts: Record<string, string>;
}

const readJson = <T>(file: string, fallback: T): T => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
};

export function loadWorkspace(root: string): Workspace {
  const inventory = readJson<{ summary: ScanSummary; entries: unknown[] }>(path.join(root, "inventory.json"), {
    summary: { scannedAt: "", sources: [], files: 0, bytes: 0, byFileType: {}, onlineOnly: 0, misplaced: 0, unreadable: 0, durationMs: 0 },
    entries: [],
  });
  const candidates = readJson<Candidate[]>(path.join(root, "candidates.json"), []);
  const groups = readJson<DuplicateGroup[]>(path.join(root, "duplicates.json"), []);
  const decisions = readJson<Record<string, Decision>>(path.join(root, "decisions.json"), {});
  const texts = readJson<Record<string, string>>(path.join(root, "text", "extracted.json"), {});

  // A candidate with no decision yet starts from whatever the classifier worked out.
  for (const c of candidates) {
    if (!decisions[c.candidateId]) decisions[c.candidateId] = emptyDecision(c.candidateId, c.status);
  }
  return { root, summary: inventory.summary, candidates, groups, decisions, texts };
}

/** Written whole, so a half-written file can never be read back as a decision. */
export function saveDecisions(root: string, decisions: Record<string, Decision>): void {
  const file = path.join(root, "decisions.json");
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(decisions, null, 1), "utf8");
  fs.renameSync(temp, file); // inside workspace/ only — never a source folder
}

/** Append-only record of every admin action, for the Stage 9.6 audit. */
export function audit(root: string, event: string, detail: Record<string, unknown>): void {
  fs.mkdirSync(path.join(root, "logs"), { recursive: true });
  fs.appendFileSync(path.join(root, "logs", "audit.jsonl"), JSON.stringify({ at: new Date().toISOString(), event, ...detail }) + "\n", "utf8");
}
