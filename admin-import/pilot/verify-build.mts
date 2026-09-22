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

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const RECORDS = path.join(ROOT, "private-assets", "data-resources");

interface PrivateRecord {
  legacyCode: string;
  slug: string;
  title: string;
  status: string;
  marketFiles: Record<string, { fileUrl: string }>;
}

if (!fs.existsSync(OUT) || !fs.existsSync(RECORDS)) {
  console.error("Needs out/ (run npm run build:preview) and private-assets/data-resources/.");
  process.exit(1);
}

const records: PrivateRecord[] = fs.readdirSync(RECORDS).map((f) => JSON.parse(fs.readFileSync(path.join(RECORDS, f), "utf8")));
// PDF text extraction inserts page markers and spaces between styled runs; compare with both removed.
const flat = (s: string) => s.replace(/--\s*\d+ of \d+\s*--\s*\d*/g, "").replace(/\s+/g, "").toLowerCase();
// An emergency number stands alone: "000" inside "$1,000" is a price.
const standalone = (t: string, n: string) => new RegExp(`(?<![\\d,.$])\\b${n}\\b(?![,.]?\\d)`).test(t);

/** The title Chrome embedded in the PDF — what a PDF viewer shows in its title bar. */
function pdfTitle(file: string): string {
  const raw = fs.readFileSync(file).toString("latin1");
  const m = raw.match(/\/Title\s*(<[0-9A-Fa-f]+>|\((?:\\.|[^\\)])*\))/);
  if (!m) return "(none)";
  const v = m[1];
  if (v.startsWith("<")) {
    const b = Buffer.from(v.slice(1, -1), "hex");
    return b[0] === 0xfe && b[1] === 0xff ? Buffer.from(b.subarray(2)).swap16().toString("utf16le") : b.toString("latin1");
  }
  return v.slice(1, -1);
}

/** Wording removed by owner decision (Stages 9.16–9.22). None of it may ship again. */
const REMOVED = [
  "15%", "200L", "5,000L", "3-5kW", "10kWh", "4-week", "Up to $3,000", "$30,000", "10–20%", "within hours", "16–18", "approximately 10%", "30% more",
  "Next: OG", "30-Day Programme", "Action Plan Plus", "Bonus Asset", "Just core survival", "Skool",
  // OG-11 (Stage 9.25–9.26): calorie targets, shelf lives, temperature and build-up arithmetic; the invalid NZ figure
  "2,000 cal", "60,000 calories", "2–5 years", "1–2 years", "every 3 months", "under 20°C", "In 10 weeks", "less than 24 hours", "less than 4 days",
];
/** Australian-only food-safety timing (NSW Food Authority). MPI publishes no NZ timings, so none may appear in NZ. */
const AU_ONLY = ["about four hours", "at least 24 hours", "Eskies"];
/** New Zealand-only content that must never reach an Australian file. */
const NZ_ONLY = [
  "Trade Me", "EECA", "Warmer Kiwi", "Rural Support", "Civil Defence", "licensed electrical worker", "NZD",
  // NZ planning and council terms (owner rulings, Stages 9.22–9.23)
  "building consents", "consents lodged", "resource consent", "property folder",
];

let failures = 0;
const rows: string[] = [];
for (const r of records.sort((a, b) => a.legacyCode.localeCompare(b.legacyCode))) {
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
    const t = flat(text);
    const title = pdfTitle(file);
    const problems: string[] = [];
    if (title !== `${r.title} — OffGrid056`) problems.push(`PDF title "${title}"`);
    if (/\bOG-B?\d{2}\b/.test(text)) problems.push(`OG code in text: ${[...new Set(text.match(/\bOG-B?\d{2}\b/g))].join(",")}`);
    if (/\{\{[^}]+\}\}/.test(text)) problems.push("unresolved token");
    if (/\bVERIFY\b/.test(text)) problems.push("VERIFY marker");
    if (/this site can.t be reached|ERR_[A-Z_]+/i.test(text) || text.length < 500) problems.push("browser error page or empty file");
    if (/\bDay \d{1,2} Complete\b/.test(text)) problems.push("'Day X Complete'");
    // No official source used (MPI, NSW Food Authority) gives tasting advice, so none may appear.
    if (/\btast(e|ing)\s+(it|the food|food)\b|\bdo not taste\b|\bdon't taste\b/i.test(text)) problems.push("tasting advice");
    for (const s of REMOVED) if (t.includes(flat(s))) problems.push(`contains removed wording "${s}"`);
    if (market === "NZ") {
      if (!standalone(text, "111") || standalone(text, "000") || standalone(text, "112")) problems.push("NZ emergency numbers wrong");
      if (!t.includes(flat("Civil Defence"))) problems.push("NZ agency missing");
      if (t.includes(flat("State Emergency Service"))) problems.push("AU agency in an NZ file");
      for (const s of AU_ONLY) if (t.includes(flat(s))) problems.push(`AU-only timing "${s}" in an NZ file`);
    } else if (market === "AU") {
      if (standalone(text, "111") || !standalone(text, "000") || !standalone(text, "112")) problems.push("AU emergency numbers wrong");
      if (!t.includes(flat("State Emergency Service"))) problems.push("AU agency missing");
      for (const s of NZ_ONLY) if (t.includes(flat(s))) problems.push(`NZ-only "${s}" in an AU file`);
    } else problems.push(`unknown market "${market}"`);
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
