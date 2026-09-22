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
// Copy changes are recorded as HTML; a PDF only carries the visible text, so both sides are compared as text.
const visible = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&rarr;/g, "→").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
type ReportRow = {
  legacyCode: string;
  recordStatus?: string;
  safety: { blocks: string[] };
  copyChanges: { where: string; from: string; to: string; applied: boolean; markets?: string[] }[];
};
const expected = new Map<
  string,
  { status: string | undefined; blocks: string[]; copy: { from: string; to: string; markets?: string[] }[]; unapplied: { where: string; markets?: string[] }[] }
>(
  (fs.existsSync(reportFile) ? (readJson(reportFile) as ReportRow[]) : []).map((r) => [
    r.legacyCode,
    {
      status: r.recordStatus,
      blocks: r.safety.blocks,
      copy: r.copyChanges.filter((c) => c.applied).map((c) => ({ from: visible(c.from), to: visible(c.to), markets: c.markets })),
      // A recorded change that did not apply means the document is not what was approved — never a pass.
      unapplied: r.copyChanges.filter((c) => !c.applied).map((c) => ({ where: c.where, markets: c.markets })),
    },
  ]),
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
    if (want && want.status !== "draft") problems.push(`record status is "${want.status}", not draft`);
    for (const u of (want?.unapplied ?? []).filter((c) => !c.markets || c.markets.includes(market))) problems.push(`recorded copy change NOT applied: ${u.where}`);
    for (const id of want?.blocks ?? []) {
      const title = blockTitles[id];
      if (!title || !flat.includes(norm(title))) problems.push(`safety block "${id}" missing`);
    }
    // A market-specific change is only checked in the market it belongs to.
    for (const { from, to } of (want?.copy ?? []).filter((c) => !c.markets || c.markets.includes(market))) {
      // The new wording must be there, and the old wording gone — which is also the only way to check a removal.
      if (to && !flat.includes(norm(to))) problems.push(`approved copy missing: "${to.slice(0, 50)}"`);
      if (from && !norm(to).includes(norm(from)) && flat.includes(norm(from))) problems.push(`replaced wording still present: "${from.slice(0, 50)}"`);
    }

    // The HTML it was printed from must not point at assets that are not there.
    const html = path.join(dir, pdf.replace(/\.pdf$/, ".html"));
    if (fs.existsSync(html)) {
      const src = fs.readFileSync(html, "utf8");
      for (const m of src.matchAll(/(?:src="|url\(['"]?)((?:assets|fonts)\/[^"')]+)/g)) {
        if (!fs.existsSync(path.join(dir, m[1]))) problems.push(`broken asset ${m[1]}`);
      }
      // The <title> is the PDF's title bar: the member sees the resource title, never a legacy code.
      const docTitle = src.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
      if (/\bOG-B?\d{2}\b/.test(docTitle)) problems.push(`legacy code in the PDF title: "${docTitle}"`);
      // Owner standard (2026-09-22): "<Resource Title> — OffGrid056".
      if (!/^\S.* — OffGrid056$/.test(docTitle.trim())) problems.push(`PDF title "${docTitle}" does not follow "<Resource Title> — OffGrid056"`);
    } else problems.push("source HTML missing");

    // No other launch market's agency or trade term.
    const own = profiles.find((p) => p.code === market);
    for (const other of profiles.filter((p) => p.code !== market && ["NZ", "AU"].includes(p.code))) {
      // Every agency the other market's profile names (EECA, WorkSafe, Healthy Homes, the SES…), not only the
      // emergency one: an AU file quoting NZ subsidy schemes is as wrong as one quoting 111.
      const ownNames = new Set(Object.values(own?.agencies ?? {}).map((a) => a?.name));
      for (const [key, agency] of Object.entries(other.agencies)) {
        const theirs = agency?.name;
        if (!theirs || theirs === "VERIFY" || theirs.startsWith("your ") || ownNames.has(theirs)) continue;
        // Match the distinctive part: "Civil Defence (NEMA)" → "Civil Defence", "EECA" → "EECA".
        const core = theirs.replace(/\s*\(.*\)$/, "");
        if (flat.includes(norm(core))) problems.push(`contains ${other.code} ${key} agency "${core}"`);
      }
      const theirs = other.agencies.emergencyManagement?.name;
      if (theirs && theirs.startsWith("your ") && own?.agencies.emergencyManagement?.name !== theirs && flat.includes(norm(theirs))) problems.push(`contains ${other.code} agency "${theirs}"`);
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

    // An emergency number stands alone: "000" inside "$1,000" or "30,000" is a price, not Triple Zero.
    const standalone = (n: string) => new RegExp(`(?<![\\d,.$])\\b${n}\\b(?![,.]?\\d)`).test(text);
    if (market === "NZ") {
      if (!standalone("111")) problems.push("NZ file without 111");
      if (standalone("000") || standalone("112")) problems.push("NZ file contains an Australian number");
    } else if (market === "AU") {
      if (!standalone("000") || !standalone("112")) problems.push("AU file without 000 and 112");
      if (standalone("111")) problems.push("AU file contains the New Zealand number");
    } else {
      problems.push("cannot tell which market this file is for");
    }

    if (problems.length) failures++;
    console.log(`  ${problems.length ? "✗" : "✓"} ${code.padEnd(7)} ${market}  ${meta.pages} page(s)${problems.length ? "  — " + problems.join("; ") : ""}`);
  }
}

console.log(failures ? `\n  ${failures} file(s) FAILED — do not use them.\n` : "\n  all prepared files verified.\n");
process.exit(failures ? 1 : 0);
