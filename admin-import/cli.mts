/**
 * Importer command line (Stage 9.2: scan and classify only).
 *
 *   npm run import:scan                     scan the enabled sources, classify, group duplicates
 *   npm run import:scan -- --sample         scan only the controlled sample in config/sample.json
 *   npm run import:scan -- --source "30-Day Programme"
 *   npm run import:report                   rebuild the readable report from the saved workspace
 *
 * Everything is written to `workspace/` (git-ignored). Source folders are only ever read.
 */
import fs from "node:fs";
import path from "node:path";
import sourcesConfig from "./config/sources.json";
import { scanSources, type SourceConfig } from "./scanner/scan";
import { classify, type TextBundle } from "./mappers/classify";
import { groupDuplicates } from "./dedupe/group";
import type { Candidate, DuplicateGroup, ScanSummary } from "./types";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKSPACE = path.join(ROOT, "workspace");
const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);
const valueOf = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

function ensureWorkspace() {
  for (const dir of ["", "logs", "reports", "text"]) fs.mkdirSync(path.join(WORKSPACE, dir), { recursive: true });
}

function audit(event: string, detail: Record<string, unknown>) {
  fs.appendFileSync(
    path.join(WORKSPACE, "logs", "audit.jsonl"),
    JSON.stringify({ at: new Date().toISOString(), event, ...detail }) + "\n",
    "utf8",
  );
}

async function commandScan() {
  ensureWorkspace();
  const sample = has("--sample");
  const onlySource = valueOf("--source");

  let sources = (sourcesConfig.sources as SourceConfig[]).filter((s) => s.enabled);
  if (onlySource) sources = sources.filter((s) => s.label === onlySource);

  let only: string[] | undefined;
  if (sample) {
    const samplePath = path.join(import.meta.dirname, "config", "sample.json");
    const list = JSON.parse(fs.readFileSync(samplePath, "utf8")) as { files: string[] };
    only = list.files;
    // A sample may name files in any configured source, enabled or not.
    sources = sourcesConfig.sources as SourceConfig[];
    sources = sources.map((s) => ({ ...s, enabled: true }));
  }

  console.log(sample ? "Scanning the controlled sample…" : `Scanning ${sources.length} source folder(s)…`);
  const { entries, texts, summary } = await scanSources(sources, {
    ignore: sourcesConfig.ignore,
    limits: sourcesConfig.limits,
    only,
    onProgress: (done, total, file) => {
      if (done % 25 === 0 || done === total) process.stdout.write(`\r  ${done}/${total} ${path.basename(file).slice(0, 40).padEnd(42)}`);
    },
  });
  process.stdout.write("\n");

  const candidates: Candidate[] = entries.map((e) => classify(e, texts.get(e.candidateId) ?? { text: "", raw: "", meta: {} }));
  const bundles = new Map<string, TextBundle>(texts);
  const groups = groupDuplicates(candidates, bundles);

  // Text stays in the workspace only: it can contain long extracts of unreleased material.
  fs.writeFileSync(path.join(WORKSPACE, "text", "extracted.json"), JSON.stringify(Object.fromEntries([...texts].map(([k, v]) => [k, v.text.slice(0, 20000)])), null, 1), "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "inventory.json"), JSON.stringify({ summary, entries }, null, 1), "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "candidates.json"), JSON.stringify(candidates, null, 1), "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "duplicates.json"), JSON.stringify(groups, null, 1), "utf8");
  audit("scan", { sources: summary.sources.map((s) => s.label), files: summary.files, sample });

  writeReport(summary, candidates, groups);
  printSummary(summary, candidates, groups);
}

function writeReport(summary: ScanSummary, candidates: Candidate[], groups: DuplicateGroup[]) {
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  const pct = (n: number) => `${Math.round((n / Math.max(1, candidates.length)) * 100)}%`;
  const count = (f: (c: Candidate) => boolean) => candidates.filter(f).length;

  lines.push(`# Scan report — ${date}`, "");
  lines.push(`Scanned **${summary.files} files** (${(summary.bytes / 1e6).toFixed(1)} MB) in ${(summary.durationMs / 1000).toFixed(1)}s.`, "");
  lines.push("| Source | Files |", "|---|---:|");
  for (const s of summary.sources) lines.push(`| ${s.label} | ${s.files} |`);
  lines.push("", "## File types", "", "| Type | Files |", "|---|---:|");
  for (const [type, n] of Object.entries(summary.byFileType).sort((a, b) => b[1] - a[1])) lines.push(`| ${type} | ${n} |`);

  lines.push("", "## Classification", "");
  lines.push(`- OG codes found: **${count((c) => !!c.inferred.legacyCode.value)}** (${pct(count((c) => !!c.inferred.legacyCode.value))})`);
  lines.push(`- Resource type inferred: **${count((c) => !!c.inferred.resourceType.value)}** — HIGH ${count((c) => c.inferred.resourceType.confidence === "HIGH")} · MEDIUM ${count((c) => c.inferred.resourceType.confidence === "MEDIUM")} · LOW ${count((c) => c.inferred.resourceType.confidence === "LOW")}`);
  lines.push(`- Foundation inferred: **${count((c) => !!c.inferred.foundation.value)}** — HIGH ${count((c) => c.inferred.foundation.confidence === "HIGH")} · MEDIUM ${count((c) => c.inferred.foundation.confidence === "MEDIUM")} · LOW ${count((c) => c.inferred.foundation.confidence === "LOW")}`);
  lines.push(`- Legacy branding: **${count((c) => c.legacyBranding)}**`);
  lines.push(`- Online-only (not downloaded): **${summary.onlineOnly}** · misplaced source: **${summary.misplaced}** · unreadable: **${summary.unreadable}**`);

  lines.push("", "## Duplicate groups", "");
  if (!groups.length) lines.push("None found.");
  for (const g of groups) {
    lines.push(`### ${g.groupId} — ${g.kind}${g.pdfHtmlPair ? " (PDF/HTML pair)" : ""}${g.contentMismatch ? " ⚠ CONTENT_MISMATCH" : ""}`);
    lines.push(`_${g.reason}_`, "");
    for (const id of g.members) {
      const c = candidates.find((x) => x.candidateId === id)!;
      lines.push(`- \`${id}\` ${c.source.filename} — ${c.source.sourceLabel}, ${(c.source.sizeBytes / 1024).toFixed(0)} KB, modified ${c.source.modified.slice(0, 10)}`);
    }
    lines.push("");
  }

  lines.push("## Candidates", "", "| id | file | type | resource type | foundation | conf | OG | legacy | duplicate |", "|---|---|---|---|---|---|---|---|---|");
  for (const c of candidates) {
    lines.push(
      `| ${c.candidateId} | ${c.source.filename} | ${c.source.fileType} | ${c.inferred.resourceType.value ?? "—"} | ` +
        `${c.inferred.foundation.value ?? "—"} | ${c.inferred.foundation.confidence} | ${c.inferred.legacyCode.value ?? "—"} | ` +
        `${c.legacyBranding ? c.legacyIssues.length + " issue(s)" : "—"} | ${c.duplicateKind ?? "—"} |`,
    );
  }

  const file = path.join(WORKSPACE, "reports", `SCAN_REPORT_${date}.md`);
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
  console.log(`\nreport: ${path.relative(ROOT, file)}`);
}

function printSummary(summary: ScanSummary, candidates: Candidate[], groups: DuplicateGroup[]) {
  const count = (f: (c: Candidate) => boolean) => candidates.filter(f).length;
  console.log(`\nfiles ${summary.files} · ${(summary.bytes / 1e6).toFixed(1)} MB · ${(summary.durationMs / 1000).toFixed(1)}s`);
  console.log(`types: ${Object.entries(summary.byFileType).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
  console.log(`OG codes ${count((c) => !!c.inferred.legacyCode.value)} · legacy ${count((c) => c.legacyBranding)} · online-only ${summary.onlineOnly} · unreadable ${summary.unreadable}`);
  console.log(`duplicate groups ${groups.length}: ${groups.map((g) => `${g.kind}×${g.members.length}`).join(", ") || "none"}`);
}

const command = args[0] ?? "scan";
if (command === "scan") {
  await commandScan();
} else {
  console.error(`Unknown command "${command}". Try: scan`);
  process.exit(1);
}
