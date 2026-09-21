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
import { linkAssets } from "./assets/link";
import { loadWorkspace } from "./review/store";
import { planImport, runImport, updateLedger } from "./import/engine";
import { buildDemo } from "./import/demo";
import { auditProgramme } from "./audit/programme";
import { renderAuditReport, renderStructure } from "./audit/report";
import { reskinHtml } from "./reskin/reskin";
import { runPilot, writePilot } from "./pilot/run";
import { prepareResource } from "./pilot/prep";
import { analyseGroupA, safetyExposureFor } from "./audit/group-a";
import { assessMarket } from "./markets/readiness";
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
  const assets = linkAssets(candidates); // artwork attached to its resource, or flagged (owner decision 5)

  // Text stays in the workspace only: it can contain long extracts of unreleased material.
  fs.writeFileSync(path.join(WORKSPACE, "text", "extracted.json"), JSON.stringify(Object.fromEntries([...texts].map(([k, v]) => [k, v.text.slice(0, 20000)])), null, 1), "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "inventory.json"), JSON.stringify({ summary, entries }, null, 1), "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "candidates.json"), JSON.stringify(candidates, null, 1), "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "duplicates.json"), JSON.stringify(groups, null, 1), "utf8");
  audit("scan", { sources: summary.sources.map((s) => s.label), files: summary.files, sample, assetsAttached: assets.attached, assetsNeedingReview: assets.needsReview });

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

  lines.push("", "## What the files are", "");
  lines.push("| Material | Files | Meaning |", "|---|---:|---|");
  lines.push(`| Resource candidates | ${count((c) => c.materialKind === "resource")} | may become library items |`);
  lines.push(`| Internal / source-only | ${count((c) => c.materialKind === "internal")} | working files, never resources (owner decision 3) |`);
  lines.push(`| Cover / support assets | ${count((c) => c.materialKind === "asset")} | artwork attached to a resource (owner decision 5) |`);
  lines.push(`| Source / support packages | ${count((c) => c.materialKind === "package")} | ZIPs: provenance only (owner decision 2) |`);
  lines.push("");
  lines.push(`- Current candidates (resource, current brand): **${count((c) => c.materialKind === "resource" && !c.legacyBranding)}**`);
  lines.push(`- Legacy candidates (resource, legacy brand): **${count((c) => c.materialKind === "resource" && c.legacyBranding)}**`);
  lines.push(`- Needs review: **${count((c) => c.status === "NEEDS_REVIEW")}** · duplicates: **${count((c) => c.status === "DUPLICATE")}**`);
  lines.push(`- Artwork attached to a resource: **${count((c) => c.materialKind === "asset" && !!c.asset?.attachTo)}** · flagged ASSET_LINK_REVIEW: **${count((c) => c.reviewFlags.includes("ASSET_LINK_REVIEW"))}**`);

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
  console.log(
    `material: resource ${count((c) => c.materialKind === "resource")} · internal ${count((c) => c.materialKind === "internal")} · ` +
      `asset ${count((c) => c.materialKind === "asset")} · package ${count((c) => c.materialKind === "package")}`,
  );
  const kinds = groups.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.kind]: (acc[g.kind] ?? 0) + 1 }), {});
  console.log(`duplicate groups ${groups.length}: ${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(" · ") || "none"}`);
}

/**
 * Import (Stage 9.4).
 *
 *   npm run import:apply                  plan only: says what would happen, writes nothing
 *   npm run import:apply -- --commit      carry the plan out, into the fixture library
 *   npm run import:apply -- --commit --real    blocked: importing real resources needs owner approval
 *
 * The target is a sandbox library inside the workspace unless `--real` is given, and `--real` is refused
 * until the owner approves Stage 9.5. Stage 9.4 is fixtures only, by instruction.
 */
async function commandApply() {
  ensureWorkspace();
  const commit = has("--commit");
  const real = has("--real");

  if (real) {
    console.error(
      "\n  Refused: --real would write into the member library.\n" +
        "  Stage 9.4 is fixtures only; importing real OffGrid056 resources needs owner approval at Stage 9.5.\n",
    );
    audit("import.refused", { reason: "--real not approved until Stage 9.5" });
    process.exit(1);
  }

  // --demo builds its own fixtures, decisions and empty library, so the chain can be exercised end to end
  // without involving the real workspace or any OffGrid056 material.
  const demo = has("--demo") ? buildDemo(WORKSPACE) : null;
  const workspace = demo ? demo.workspace : WORKSPACE;
  const libraryRoot = demo ? demo.libraryRoot : path.join(WORKSPACE, "fixture-library");
  for (const dir of [path.join(libraryRoot, "data", "resources"), path.join(libraryRoot, "public", "resources")]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const ws = demo ? { candidates: demo.candidates, decisions: demo.decisions } : loadWorkspace(WORKSPACE);
  const target = { libraryRoot, workspace };
  const plan = planImport(ws.candidates, ws.decisions, target);

  console.log(`\n  target: ${path.relative(ROOT, libraryRoot)} (sandbox — not the member library)`);
  console.log(`  plan: create ${plan.counts.create} · replace ${plan.counts.replace} · skip ${plan.counts.skip} · reject ${plan.counts.reject}\n`);

  for (const item of plan.items) {
    const mark = { create: "+", replace: "~", skip: "=", reject: "✗" }[item.action];
    console.log(`  ${mark} ${item.action.padEnd(7)} ${item.slug.padEnd(38)} ${item.filename}`);
    for (const reason of item.reasons.slice(0, 4)) console.log(`      ${reason}`);
  }

  if (!plan.items.length) {
    console.log("  Nothing is marked READY_TO_IMPORT, so there is nothing to do.\n");
    return;
  }

  const result = runImport(plan, target, { commit, by: "cli" });
  if (!commit) {
    console.log("\n  Dry run: nothing was written. Add --commit to carry this out.\n");
    return;
  }

  if (result.error) {
    console.error(`\n  Import failed and was rolled back: ${result.error}\n`);
    process.exit(1);
  }
  updateLedger(target, result.imported);
  console.log(`\n  imported ${result.imported.length} · rejected ${result.rejected.length} · skipped ${result.skipped.length}`);
  if (result.backupDir) console.log(`  backups: ${path.relative(ROOT, result.backupDir)}`);
  console.log("");
}

/**
 * Stage 9.5 — programme audit. Reads the workspace, writes a report. Imports nothing, changes nothing.
 *
 *   npm run import:audit
 */
async function commandAudit() {
  ensureWorkspace();
  const ws = loadWorkspace(WORKSPACE);
  if (!ws.candidates.length) {
    console.error("No candidates in the workspace. Run `npm run import:scan` first.");
    process.exit(1);
  }

  const auditResult = auditProgramme(ws.candidates, ws.texts, ws.groups);
  const markdown = renderAuditReport(auditResult) + "\n" + renderStructure(auditResult);

  const reportFile = path.join(WORKSPACE, "reports", "STAGE_9.5_PROGRAMME_AUDIT.md");
  fs.writeFileSync(reportFile, markdown, "utf8");
  fs.writeFileSync(path.join(WORKSPACE, "reports", "programme-audit.json"), JSON.stringify(auditResult, null, 1), "utf8");
  audit("audit.programme", { items: auditResult.items.length, core: auditResult.totals.core, bonus: auditResult.totals.bonus });

  const t = auditResult.totals;
  console.log(`\n  programme files ${t.programmeFiles} · core ${t.core} · bonus ${t.bonus}`);
  console.log(`  pairs ${t.pairs} · pdf only ${t.pdfOnly} · html only ${t.htmlOnly} · content mismatches ${t.contentMismatches}`);
  console.log(`  re-skin  A ${auditResult.reskin.A.length} · B ${auditResult.reskin.B.length} · C ${auditResult.reskin.C.length} · none ${auditResult.reskin.none.length}`);
  console.log(
    `  readiness  ${Object.entries(auditResult.readiness).filter(([, v]) => v.length).map(([k, v]) => `${k} ${v.length}`).join(" · ")}`,
  );
  console.log(`  days missing: ${auditResult.dayGaps.length ? auditResult.dayGaps.join(", ") : "none"}`);
  console.log(`\n  report: ${path.relative(ROOT, reportFile)}\n`);
}

/**
 * Stage 9.6C — re-skin. Reads legacy HTML, writes current-brand HTML into `workspace/reskin/`.
 * The source folders are never written to.
 *
 *   npm run import:reskin                 re-skin every Group-A resource
 *   npm run import:reskin -- --only OG-02
 */
async function commandReskin() {
  ensureWorkspace();
  const ws = loadWorkspace(WORKSPACE);
  const auditResult = auditProgramme(ws.candidates, ws.texts, ws.groups);
  const only = valueOf("--only");

  const targets = auditResult.items.filter((i) => (only ? i.legacyCode === only : i.reskinGroup === "A"));
  if (!targets.length) {
    console.error(only ? `No resource ${only} in the audit.` : "No Group-A resources found.");
    process.exit(1);
  }

  const outDir = path.join(WORKSPACE, "reskin");
  const fontsOut = path.join(outDir, "fonts");
  const assetsOut = path.join(outDir, "assets");
  for (const d of [outDir, fontsOut, assetsOut]) fs.mkdirSync(d, { recursive: true });

  // Brand fonts travel with the re-skinned documents, so they render without a network call.
  for (const font of ["BebasNeue-Regular.woff2", "Montserrat-Regular.woff", "Montserrat-SemiBold.woff", "Montserrat-Bold.woff"]) {
    const from = path.join(ROOT, "styles", "fonts", font);
    if (fs.existsSync(from)) fs.copyFileSync(from, path.join(fontsOut, font));
  }

  // Cover art referenced by the documents, copied from the programme source (read-only).
  const covers = ws.candidates.filter((c) => c.materialKind === "asset" && /cover/i.test(c.source.filename));
  for (const cover of covers) {
    const dest = path.join(assetsOut, cover.source.filename);
    if (!fs.existsSync(dest) && fs.existsSync(cover.source.path)) fs.copyFileSync(cover.source.path, dest);
  }

  const log: Record<string, unknown>[] = [];
  console.log(`\n  re-skinning ${targets.length} resource(s) → ${path.relative(ROOT, outDir)}\n`);

  for (const item of targets) {
    if (!item.html) {
      console.log(`  ✗ ${item.legacyCode} has no HTML source to re-skin`);
      continue;
    }
    const source = fs.readFileSync(item.html.folder + path.sep + item.html.filename, "utf8");
    const { html, changes, warnings } = reskinHtml(source, { strapline: "Prepare • Adapt • Thrive" });
    const outFile = path.join(outDir, `${item.proposedSlug}.html`);
    fs.writeFileSync(outFile, html, "utf8");

    // The source's absolute asset paths were broken; check the repointed files actually arrived, and only
    // complain about the ones that did not.
    for (const m of html.matchAll(/src="assets\/([^"]+)"/g)) {
      if (!fs.existsSync(path.join(assetsOut, m[1]))) warnings.push(`cover image missing from the re-skin output: assets/${m[1]}`);
    }

    const changed = changes.filter((c) => c.kind !== "note").reduce((n, c) => n + c.count, 0);
    console.log(`  ✓ ${item.legacyCode.padEnd(7)} ${item.proposedSlug.padEnd(36)} ${changed} change(s)${warnings.length ? ` · ${warnings.length} warning(s)` : ""}`);
    for (const w of warnings) console.log(`      ⚠ ${w}`);

    log.push({ legacyCode: item.legacyCode, slug: item.proposedSlug, file: path.relative(ROOT, outFile), changes, warnings });
    audit("reskin", { legacyCode: item.legacyCode, changes: changed, warnings: warnings.length });
  }

  fs.writeFileSync(path.join(outDir, "reskin-log.json"), JSON.stringify(log, null, 1), "utf8");
  console.log(`\n  log: ${path.relative(ROOT, path.join(outDir, "reskin-log.json"))}`);
  console.log("  source files were not modified.\n");
}

/**
 * Stage 9.6D — one resource, all the way through.
 *
 *   npm run import:pilot
 */
async function commandPilot() {
  ensureWorkspace();
  const ws = loadWorkspace(WORKSPACE);
  const auditResult = auditProgramme(ws.candidates, ws.texts, ws.groups);
  const item = auditResult.items.find((i) => i.legacyCode === "OG-02");
  if (!item?.html) {
    console.error("OG-02 or its HTML source is not in the audit. Run `npm run import:scan` first.");
    process.exit(1);
  }

  const pilotDir = path.join(WORKSPACE, "pilot");
  const spec = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "pilot", "og-02.json"), "utf8"));
  const profiles = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "markets", "profiles.json"), "utf8"));
  const sourcePath = path.join(item.html.folder, item.html.filename);

  const result = runPilot({
    sourceHtml: fs.readFileSync(sourcePath, "utf8"),
    sourcePath,
    resource: spec.resource,
    blocks: spec.safetyBlocks,
    libraryRecord: spec.libraryRecord,
    markets: profiles.markets,
    launchMarkets: profiles.launchMarkets,
  });

  // The re-skinned documents need the fonts and their own cover art beside them. Only what the pilot actually
  // references is copied: the asset folder also holds multi-megabyte cover masters this document never uses.
  const referenced = new Set([...(result.markets[0]?.html ?? "").matchAll(/src="assets\/([^"]+)"/g)].map((m) => m[1]));
  const copyInto = (sub: string, wanted?: Set<string>) => {
    const from = path.join(WORKSPACE, "reskin", sub);
    const to = path.join(pilotDir, sub);
    fs.mkdirSync(to, { recursive: true });
    if (!fs.existsSync(from)) return;
    for (const f of fs.readdirSync(from)) {
      if (wanted && !wanted.has(f)) continue;
      const dest = path.join(to, f);
      if (fs.existsSync(dest)) continue; // already there: copying again can fail on a read-only copy
      try {
        fs.copyFileSync(path.join(from, f), dest);
      } catch (e) {
        console.log(`    ⚠ could not copy ${sub}/${f}: ${(e as Error).message}`);
      }
    }
  };
  copyInto("fonts");
  copyInto("assets", referenced);
  const written = writePilot(result, pilotDir);

  console.log(`\n  PILOT — ${result.legacyCode} → ${spec.libraryRecord.id}\n`);
  console.log(`  re-skin: ${result.changeLog.length} kinds of change${result.reskinWarnings.length ? `, ${result.reskinWarnings.length} warning(s)` : ""}`);
  for (const c of result.changeLog) console.log(`    · ${c}`);
  for (const w of result.reskinWarnings) console.log(`    ⚠ ${w}`);

  console.log(`\n  markets:`);
  for (const m of result.markets) {
    console.log(`    ${m.market}: ${m.publishable ? "publishable" : "NOT publishable"}${m.unresolvedTokens.length ? ` · unresolved: ${m.unresolvedTokens.join(", ")}` : ""}`);
    for (const p of m.problems) console.log(`      ✗ ${p}`);
  }

  console.log(`\n  differences between launch markets (${result.differences.length} fields):`);
  for (const d of result.differences) {
    console.log(`    ${d.field.padEnd(30)} ${Object.entries(d.values).map(([k, v]) => `${k}: ${v}`).join("  |  ")}`);
  }

  console.log(`\n  validation: ${result.validation.ok ? "PASSES the member library schema" : "FAILS"}`);
  for (const i of result.validation.issues) console.log(`    ✗ ${i}`);

  // --- draft import into a sandbox library (never the member library) -------------------------------------
  if (result.validation.ok && result.record) {
    const libraryRoot = path.join(pilotDir, "library");
    for (const d of [path.join(libraryRoot, "data", "resources"), path.join(libraryRoot, "public", "resources")]) {
      fs.mkdirSync(d, { recursive: true });
    }
    const recordFile = path.join(libraryRoot, "data", "resources", `${spec.libraryRecord.slug}.json`);
    const existed = fs.existsSync(recordFile);
    if (existed) {
      // Backup before replacement, exactly as the import engine does.
      const backupDir = path.join(WORKSPACE, "backups", new Date().toISOString().replace(/[:.]/g, "-"), "pilot");
      fs.mkdirSync(backupDir, { recursive: true });
      fs.copyFileSync(recordFile, path.join(backupDir, path.basename(recordFile)));
    }
    fs.writeFileSync(recordFile, JSON.stringify(result.record, null, 2) + "\n", "utf8");
    audit("pilot.import", { candidate: result.legacyCode, slug: spec.libraryRecord.slug, action: existed ? "replace" : "create", status: result.record.status });
    console.log(`\n  draft import: ${existed ? "replaced" : "created"} ${path.relative(ROOT, recordFile)} (status: ${result.record.status})`);
    console.log(`  the member library was not touched: this is a sandbox under workspace/.`);
  }

  audit("pilot", { legacyCode: result.legacyCode, markets: result.markets.map((m) => m.market), valid: result.validation.ok });
  console.log(`\n  written: ${written.map((w) => path.relative(ROOT, w)).join(", ")}\n`);
}

/**
 * Stage 9.7B/C — migration readiness. Analysis only: reads the workspace, writes a report.
 *
 *   npm run import:readiness
 */
async function commandReadiness() {
  ensureWorkspace();
  const ws = loadWorkspace(WORKSPACE);
  const auditResult = auditProgramme(ws.candidates, ws.texts, ws.groups);
  const profiles = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "markets", "profiles.json"), "utf8"));

  const groupA = analyseGroupA(auditResult, ws.texts);
  const markets = (profiles.launchMarkets as string[]).map((code: string) =>
    assessMarket(profiles.markets.find((m: { code: string }) => m.code === code)),
  );

  console.log(`\n  GROUP-A MIGRATION ORDER (${groupA.length} resources)\n`);
  console.log(`  #   OG       resource                              risk    layout  safety  tokens  blocked`);
  for (const r of groupA) {
    console.log(
      `  ${String(r.order).padStart(2)}  ${r.legacyCode.padEnd(8)} ${r.proposedResourceId.padEnd(10)} ${(r.resourceType ?? "—").padEnd(12)} ` +
        `${r.risk.padEnd(7)} ${r.layout.complexity.padEnd(7)} ${String(r.safetyExposure.length).padEnd(7)} ${String(r.marketTokens.length).padEnd(7)} ${r.blockedBy.join(",") || "—"}`,
    );
  }

  console.log(`\n  LAUNCH READINESS\n`);
  for (const m of markets) {
    const verified = m.blocks.filter((b) => b.verified).length;
    console.log(`  ${m.name} (${m.code})`);
    console.log(`    emergency ${m.emergency.number}${m.emergency.alternatives !== "—" ? ` / ${m.emergency.alternatives}` : ""} · units ${m.units}`);
    console.log(`    safety blocks verified: ${verified}/${m.blocks.length}`);
    console.log(`    unresolved: ${m.unresolved.join(", ") || "none"}`);
    console.log(`    publishable — baseline: ${m.publishableBaseline ? "YES" : "no"} · everything: ${m.publishableFull ? "YES" : "no"}`);
  }

  const out = { generatedAt: new Date().toISOString(), groupA, markets };
  const file = path.join(WORKSPACE, "reports", "readiness.json");
  fs.writeFileSync(file, JSON.stringify(out, null, 1), "utf8");
  audit("readiness", { groupA: groupA.length, markets: markets.map((m) => m.code) });
  console.log(`\n  report: ${path.relative(ROOT, file)}\n`);
}

/**
 * Stage 9.10B — prepare Group-A resources for review. Writes to `workspace/prep/`. Deploys nothing.
 *
 *   npm run import:prep -- --codes OG-B04,OG-B10,OG-25
 */
async function commandPrep() {
  ensureWorkspace();
  const ws = loadWorkspace(WORKSPACE);
  const auditResult = auditProgramme(ws.candidates, ws.texts, ws.groups);
  const codes = (valueOf("--codes") ?? "").split(",").map((c) => c.trim()).filter(Boolean);
  if (!codes.length) {
    console.error("Give the resources to prepare, e.g. --codes OG-B04,OG-B10,OG-25");
    process.exit(1);
  }

  const spec = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "pilot", "og-02.json"), "utf8"));
  const profiles = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "markets", "profiles.json"), "utf8"));
  // Owner decisions live in config, not in code, so each one is visible and dated.
  const approvedCopy = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "config", "approved-copy.json"), "utf8")).changes ?? {};
  const metadata = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "config", "metadata-review.json"), "utf8")).resources ?? {};
  // Topic safety blocks are proposals until the owner approves them for a resource.
  const topicBlocks = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "config", "safety-blocks.json"), "utf8")).blocks ?? {};
  const blocks = { ...spec.safetyBlocks, ...topicBlocks };
  const legacyTerms = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "config", "legacy-terms.json"), "utf8"));
  // What each resource's topics require, so a missing CRITICAL block stops the resource — computed for every
  // resource, whichever re-skin group it is in.
  const exposureOf = (i: (typeof auditResult.items)[number]) =>
    safetyExposureFor([i.pdf, i.html].map((f) => (f ? ws.texts[f.candidateId] ?? "" : "")).join("\n"));
  const results = [];

  for (const code of codes) {
    const item = auditResult.items.find((i) => i.legacyCode === code);
    if (!item?.html) {
      console.log(`  ✗ ${code}: not in the audit, or has no HTML source`);
      continue;
    }
    const result = prepareResource({
      item,
      sourceHtml: fs.readFileSync(path.join(item.html.folder, item.html.filename), "utf8"),
      blocks,
      markets: profiles.markets,
      launchMarkets: profiles.launchMarkets,
      outDir: path.join(WORKSPACE, "prep", item.legacyCode),
      copyChanges: approvedCopy[item.legacyCode] ?? [],
      estimatedTime: metadata[item.legacyCode]?.estimatedTime ?? null,
      difficulty: metadata[item.legacyCode]?.difficulty ?? null,
      foundation: metadata[item.legacyCode]?.foundation ?? null,
      resourceType: metadata[item.legacyCode]?.resourceType ?? null,
      category: metadata[item.legacyCode]?.category ?? null,
      extraSafetyBlocks: metadata[item.legacyCode]?.safetyBlocks ?? [],
      requiredSafety: exposureOf(item),
      proposedBlockIds: Object.keys(topicBlocks).filter((id) => !(metadata[item.legacyCode]?.approvedSafetyBlocks ?? []).includes(id)),
      legacyTerms,
      description: metadata[item.legacyCode]?.description ?? null,
      pdfTitle: metadata[item.legacyCode]?.pdfTitle ?? null,
      blockedBy: metadata[item.legacyCode]?.blockedBy ?? null,
    });
    results.push(result);

    console.log(`\n  ${result.legacyCode} → ${result.proposedResourceId}  ${result.title}`);
    console.log(`    description: ${result.description ?? "—"}  (${result.descriptionSource})`);
    console.log(`    foundation ${result.foundation ?? "—"} · type ${result.resourceType ?? "—"}`);
    console.log(`    re-skin: ${result.reskin.changes.length} kinds of change · legacy brand issues ${result.branding.legacyIssues}`);
    for (const f of result.terminology.otherFindings) console.log(`    ⚠ ${f}`);
    console.log(`    safety blocks: ${result.safety.blocks.join(", ")}${result.safety.proposed.length ? ` (proposed: ${result.safety.proposed.join(", ")})` : ""}`);
    for (const b of result.safety.missingRequired) console.log(`    ✗ required safety block missing: ${b}`);
    for (const f of result.contentFlags) console.log(`    ⚑ ${f.code} · ${f.kind}: ${f.text.slice(0, 100)}`);
    for (const m of result.markets) console.log(`    ${m.code}: ${m.publishable ? "publishable" : "blocked"} · emergency ${m.emergencyNumber}`);
    for (const c of result.copyChanges) console.log(`    copy (${c.where}): ${c.applied ? "APPLIED" : `NOT applied — matched ${c.matched}×`}`);
    console.log(`    estimated time: ${result.estimatedTime ?? "unset"} min`);
    console.log(`    validation: ${result.validation.ok ? "passes" : "FAILS"}${result.validation.issues.length ? " — " + result.validation.issues[0] : ""}`);
    console.log(`    pdf title: ${result.pdfTitle}`);
    if (result.blockedBy) console.log(`    blocked by: ${result.blockedBy.dependency}`);
    console.log(`    readiness: ${result.importReadiness}`);
  }

  fs.writeFileSync(path.join(WORKSPACE, "prep", "prep-report.json"), JSON.stringify(results, null, 1), "utf8");
  audit("prep", { codes, prepared: results.length });
  console.log(`\n  prepared ${results.length} resource(s) → ${path.relative(ROOT, path.join(WORKSPACE, "prep"))}`);
  console.log("  nothing deployed, nothing imported.\n");
}

const command = args[0] ?? "scan";
if (command === "prep") {
  await commandPrep();
} else if (command === "readiness") {
  await commandReadiness();
} else if (command === "pilot") {
  await commandPilot();
} else if (command === "reskin") {
  await commandReskin();
} else if (command === "scan") {
  await commandScan();
} else if (command === "apply") {
  await commandApply();
} else if (command === "audit") {
  await commandAudit();
} else {
  console.error(`Unknown command "${command}". Try: scan, apply, audit`);
  process.exit(1);
}
