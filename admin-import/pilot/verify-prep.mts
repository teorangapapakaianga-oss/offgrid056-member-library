/**
 * Verify prepared resources before anyone relies on them.
 *
 *   npm run import:verify-prep
 *
 * Exits non-zero if any PDF fails. This exists because of a real near-miss: when a PDF was rendered before the
 * local server was listening, Chrome printed its own "This site can't be reached" page, and that became a
 * normal-looking PDF. Nothing about the file said it was wrong — only reading it back did. So every prepared PDF
 * is read back and checked for what it must contain, and must not.
 */
import fs from "node:fs";
import path from "node:path";
import { extractText, detectFileType } from "../parsers/index";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const PREP = path.join(ROOT, "workspace", "prep");

/** Text that only appears when the browser printed an error instead of the document. */
const BROWSER_ERROR = /this site can.t be reached|ERR_[A-Z_]+|refused to connect|404 not found/i;

let failures = 0;
if (!fs.existsSync(PREP)) {
  console.error("No workspace/prep — run `npm run import:prep` first.");
  process.exit(1);
}

const readJson = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));
const ADMIN = path.join(ROOT, "admin-import");
const profiles = readJson(path.join(ADMIN, "markets", "profiles.json")).markets as {
  code: string;
  agencies: Record<string, { name: string } | undefined>;
  terms: Record<string, string | undefined>;
}[];
const blockTitles: Record<string, string> = Object.fromEntries(
  Object.values({ ...readJson(path.join(ADMIN, "pilot", "og-02.json")).safetyBlocks, ...readJson(path.join(ADMIN, "config", "safety-blocks.json")).blocks }).map(
    (b) => [(b as { id: string }).id, (b as { title: string }).title],
  ),
);
// What prep said each resource should contain: its safety blocks and the approved copy it applied.
const reportFile = path.join(PREP, "prep-report.json");
const expected = new Map<string, { blocks: string[]; copy: string[] }>(
  (fs.existsSync(reportFile) ? (readJson(reportFile) as { legacyCode: string; safety: { blocks: string[] }; copyChanges: { to: string; applied: boolean }[] }[]) : []).map(
    (r) => [r.legacyCode, { blocks: r.safety.blocks, copy: r.copyChanges.filter((c) => c.applied).map((c) => c.to) }],
  ),
);
// PDF text extraction inserts spaces between styled runs ("OFFGRID056 .COM"), so phrases are compared with all
// whitespace removed. That still fails if a single word or character is missing.
const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

for (const code of fs.readdirSync(PREP).filter((d) => fs.statSync(path.join(PREP, d)).isDirectory())) {
  const dir = path.join(PREP, code);
  for (const pdf of fs.readdirSync(dir).filter((n) => n.endsWith(".pdf")).sort()) {
    const market = pdf.includes(".NZ.") ? "NZ" : pdf.includes(".AU.") ? "AU" : "?";
    const file = path.join(dir, pdf);
    const { text, meta } = await extractText(file, detectFileType(file, ".pdf"), 400000);
    const problems: string[] = [];
    const flat = norm(text);

    // Every safety block and every approved copy change prep recorded for this resource must have reached the PDF.
    const want = expected.get(code);
    if (!want) problems.push("not in prep-report.json — re-run import:prep");
    for (const id of want?.blocks ?? []) {
      const title = blockTitles[id];
      if (!title || !flat.includes(norm(title))) problems.push(`safety block "${id}" missing`);
    }
    for (const to of want?.copy ?? []) if (!flat.includes(norm(to))) problems.push(`approved copy missing: "${to.slice(0, 50)}"`);

    // The HTML it was printed from must not point at assets that are not there.
    const html = path.join(dir, pdf.replace(/\.pdf$/, ".html"));
    if (fs.existsSync(html)) {
      const src = fs.readFileSync(html, "utf8");
      for (const m of src.matchAll(/(?:src="|url\(['"]?)((?:assets|fonts)\/[^"')]+)/g)) {
        if (!fs.existsSync(path.join(dir, m[1]))) problems.push(`broken asset ${m[1]}`);
      }
    } else problems.push("source HTML missing");

    // No other launch market's agency or trade term.
    const own = profiles.find((p) => p.code === market);
    for (const other of profiles.filter((p) => p.code !== market && ["NZ", "AU"].includes(p.code))) {
      const theirs = other.agencies.emergencyManagement?.name;
      if (theirs && own?.agencies.emergencyManagement?.name !== theirs && flat.includes(norm(theirs))) problems.push(`contains ${other.code} agency "${theirs}"`);
      const term = other.terms.electrician;
      if (term && own?.terms.electrician !== term && (want?.blocks ?? []).includes("batteries-and-electrical") && flat.includes(norm(term)))
        problems.push(`contains ${other.code} term "${term}"`);
    }
    if (own?.agencies.emergencyManagement?.name && !flat.includes(norm(own.agencies.emergencyManagement.name))) problems.push("own emergency agency missing");

    if (BROWSER_ERROR.test(text)) problems.push("contains a browser error page, not the document");
    if (text.length < 500) problems.push(`only ${text.length} characters — almost certainly not the document`);
    if ((text.match(/\{\{[^}]+\}\}/g) ?? []).length) problems.push("unresolved market tokens");
    if (/skool/i.test(text)) problems.push("still references Skool");
    if (!/in an emergency/i.test(text)) problems.push("emergency safety block missing");
    if (!/not professional advice/i.test(text)) problems.push("general disclaimer missing");

    if (market === "NZ") {
      if (!/\b111\b/.test(text)) problems.push("NZ file without 111");
      if (/\b000\b|\b112\b/.test(text)) problems.push("NZ file contains an Australian number");
    } else if (market === "AU") {
      if (!/\b000\b/.test(text) || !/\b112\b/.test(text)) problems.push("AU file without 000 and 112");
      if (/\b111\b/.test(text)) problems.push("AU file contains the New Zealand number");
    } else {
      problems.push("cannot tell which market this file is for");
    }

    if (problems.length) failures++;
    console.log(`  ${problems.length ? "✗" : "✓"} ${code.padEnd(7)} ${market}  ${meta.pages} page(s)${problems.length ? "  — " + problems.join("; ") : ""}`);
  }
}

console.log(failures ? `\n  ${failures} file(s) FAILED — do not use them.\n` : "\n  all prepared files verified.\n");
process.exit(failures ? 1 : 0);
