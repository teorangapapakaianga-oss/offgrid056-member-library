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

for (const code of fs.readdirSync(PREP).filter((d) => fs.statSync(path.join(PREP, d)).isDirectory())) {
  const dir = path.join(PREP, code);
  for (const pdf of fs.readdirSync(dir).filter((n) => n.endsWith(".pdf")).sort()) {
    const market = pdf.includes(".NZ.") ? "NZ" : pdf.includes(".AU.") ? "AU" : "?";
    const file = path.join(dir, pdf);
    const { text, meta } = await extractText(file, detectFileType(file, ".pdf"), 400000);
    const problems: string[] = [];

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
