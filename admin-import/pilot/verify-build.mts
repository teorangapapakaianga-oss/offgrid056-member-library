/**
 * Verify the exact deployment build before it is deployed.
 *
 *   npm run build:preview && npm run import:verify-build
 *
 * `import:verify-prep` checks the prepared PDFs in the workspace; this checks what will actually ship. Every
 * market file named in every private record is read back from `out/` — the files the Worker serves — so a stale
 * copy, a missing file or a mis-staged market cannot slip through between preparation and deployment.
 * Exits non-zero on any problem.
 */
import fs from "node:fs";
import path from "node:path";
import { extractText, detectFileType } from "../parsers/index";
import { isApprovedPublication } from "../../lib/content/publication";
import { fileProblems, loadProfiles, pdfInfoTitle } from "./verify-build-rules";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const RECORDS = path.join(ROOT, "private-assets", "data-resources");
const PROFILES = loadProfiles(path.join(ROOT, "admin-import", "config", "verify-build-profiles.json"));

interface PrivateRecord {
  id: string;
  legacyCode: string;
  slug: string;
  title: string;
  status: string;
  publicationStatus?: string;
  releaseChannel?: string;
  marketFiles: Record<string, { fileUrl: string }>;
}

if (!fs.existsSync(OUT) || !fs.existsSync(RECORDS)) {
  console.error("Needs out/ (run npm run build:preview) and private-assets/data-resources/.");
  process.exit(1);
}

const records: PrivateRecord[] = fs.readdirSync(RECORDS).map((f) => JSON.parse(fs.readFileSync(path.join(RECORDS, f), "utf8")));

let failures = 0;
const rows: string[] = [];
for (const r of records.sort((a, b) => a.legacyCode.localeCompare(b.legacyCode))) {
  // Stage 10.19B: every real resource must carry an owner-approved publication pair, so its badge is honest (fail closed).
  if (!isApprovedPublication(r)) {
    failures++;
    rows.push(`✗ ${r.legacyCode} publicationStatus "${r.publicationStatus ?? "(none)"}" / releaseChannel "${r.releaseChannel ?? "(none)"}" is not an owner-approved combination`);
  }
  if (r.status !== "draft") {
    failures++;
    rows.push(`✗ ${r.legacyCode} record status is "${r.status}", not draft`);
  }
  for (const [market, mf] of Object.entries(r.marketFiles ?? {})) {
    const file = path.join(OUT, mf.fileUrl);
    if (!fs.existsSync(file)) {
      failures++;
      rows.push(`✗ ${r.legacyCode.padEnd(7)} ${market}  MISSING ${mf.fileUrl}`);
      continue;
    }
    const { text, meta } = await extractText(file, detectFileType(file, ".pdf"), 400000);
    const title = await pdfInfoTitle(file);
    const problems = fileProblems({ record: r, market, text, title }, PROFILES).map((x) => x.message);
    if (problems.length) failures++;
    rows.push(`${problems.length ? "✗" : "✓"} ${r.legacyCode.padEnd(7)} ${market}  ${String(meta.pages).padStart(2)}p  "${title}"${problems.length ? "  — " + problems.join("; ") : ""}`);
  }
}

// Every internal link on the Downloads page and each resource page must resolve inside the build.
const broken = new Set<string>();
for (const page of ["downloads", ...records.map((r) => `resources/${r.slug}`)]) {
  const html = fs.readFileSync(path.join(OUT, page, "index.html"), "utf8");
  for (const m of html.matchAll(/href="(\/[^"#?]+)"/g)) {
    const u = m[1];
    const candidates = [path.join(OUT, u), path.join(OUT, u, "index.html"), path.join(OUT, `${u}.html`)];
    if (!candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile())) broken.add(`${page} → ${u}`);
  }
}

console.log(rows.join("\n"));
console.log(`\n  records ${records.length} · market files ${rows.filter((r) => /^[✓✗] OG/.test(r)).length} · broken internal links ${broken.size}`);
for (const b of [...broken].slice(0, 20)) console.log(`    ✗ ${b}`);
const ok = failures === 0 && broken.size === 0;
console.log(ok ? "\n  deployment build verified.\n" : `\n  ${failures} problem(s) — do NOT deploy this build.\n`);
process.exit(ok ? 0 : 1);
