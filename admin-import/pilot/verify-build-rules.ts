/**
 * The per-file checks of `npm run import:verify-build` (Stage 11.0J: moved here from verify-build.mts so they can be tested, with the default behaviour unchanged).
 *
 * Every protected PDF is checked against the DEFAULT rules below. A resource may carry a PROFILE in
 * `admin-import/config/verify-build-profiles.json`: a narrow, version-controlled, owner-approved set of exceptions for one named resource id.
 * A profile can change only the rules it names (document title, allowed resource codes, required emergency numbers, agency requirement). It never
 * switches a check off for a resource wholesale, and every cross-market, removed-wording, token and error-page check still applies to it.
 *
 * Rule identifiers: VB-TITLE, VB-OG-CODE, VB-TOKEN, VB-ERRPAGE, VB-DAYCOMPLETE, VB-TASTING, VB-REMOVED, VB-NZ-NUMBERS, VB-NZ-AGENCY, VB-NZ-FOREIGN-AGENCY,
 * VB-NZ-AU-TIMING, VB-AU-NUMBERS, VB-AU-AGENCY, VB-AU-NZ-TERM, VB-MARKET.
 */
import fs from "node:fs";

// PDF text extraction inserts page markers and spaces between styled runs; compare with both removed.
const flat = (s: string) => s.replace(/--\s*\d+ of \d+\s*--\s*\d*/g, "").replace(/\s+/g, "").toLowerCase();
// An emergency number stands alone: "000" inside "$1,000" is a price.
const standalone = (t: string, n: string) => new RegExp(`(?<![\\d,.$])\\b${n}\\b(?![,.]?\\d)`).test(t);
export { flat, standalone };

/** Wording removed by owner decision (Stages 9.16–9.22). None of it may ship again. */
export const REMOVED = [
  "15%", "200L", "5,000L", "3-5kW", "10kWh", "4-week", "Up to $3,000", "$30,000", "10–20%", "within hours", "16–18", "approximately 10%", "30% more",
  "Next: OG", "30-Day Programme", "Action Plan Plus", "Bonus Asset", "Just core survival", "Skool",
  // OG-11 (Stage 9.25–9.26): calorie targets, shelf lives, temperature and build-up arithmetic; the invalid NZ figure
  "2,000 cal", "60,000 calories", "2–5 years", "1–2 years", "every 3 months", "under 20°C", "In 10 weeks", "less than 24 hours", "less than 4 days",
];
/** Australian-only food-safety timing (NSW Food Authority). MPI publishes no NZ timings, so none may appear in NZ. */
export const AU_ONLY = ["about four hours", "at least 24 hours", "Eskies"];
/** New Zealand-only content that must never reach an Australian file. */
export const NZ_ONLY = [
  "Trade Me", "EECA", "Warmer Kiwi", "Rural Support", "Civil Defence", "licensed electrical worker", "NZD",
  // NZ planning and council terms (owner rulings, Stages 9.22–9.23)
  "building consents", "consents lodged", "resource consent", "property folder",
];


export type Market = "NZ" | "AU";
export interface EmergencyRule {
  /** emergency numbers that must appear (as stand-alone numbers) */
  require: string[];
  /** emergency numbers that must not appear */
  forbid: string[];
}
export interface VerifyProfile {
  resourceId: string;
  legacyCode: string;
  /** the document title embedded in the PDF's Info dictionary; {market} is replaced by NZ or AU */
  infoTitle: string;
  /** the only resource codes that may be printed in the file (the resource's own, and any resource it names) */
  allowedOgCodes: string[];
  emergency: Record<Market, EmergencyRule>;
  /** "not-required": the country's emergency AGENCY name need not appear (the foreign-agency checks still apply) */
  agency: "required" | "not-required";
  reason: string;
  approvedBy: string;
}
export interface Problem {
  rule: string;
  expected: string;
  actual: string;
  message: string;
}
export interface FileFacts {
  record: { id: string; legacyCode: string; title: string };
  market: string;
  /** extracted PDF text */
  text: string;
  /** the document title read from the PDF's Info dictionary (see pdfInfoTitle) */
  title: string;
}

export function loadProfiles(file: string): VerifyProfile[] {
  if (!fs.existsSync(file)) return [];
  return (JSON.parse(fs.readFileSync(file, "utf8")) as { profiles: VerifyProfile[] }).profiles;
}

/** The profile for this exact resource, if the owner approved one. Matching is by stable id AND legacy code, never by market or pattern. */
export function profileFor(profiles: VerifyProfile[], record: FileFacts["record"]): VerifyProfile | undefined {
  return profiles.find((p) => p.resourceId === record.id && p.legacyCode === record.legacyCode);
}

export function fileProblems(f: FileFacts, profiles: VerifyProfile[] = []): Problem[] {
  const { record: r, market, text, title } = f;
  const t = flat(text);
  const p = profileFor(profiles, r);
  const out: Problem[] = [];
  const add = (rule: string, expected: string, actual: string, message: string) => out.push({ rule, expected, actual, message });

  const wantTitle = p ? p.infoTitle.replace("{market}", market) : `${r.title} — OffGrid056`;
  if (title !== wantTitle) add("VB-TITLE", wantTitle, title, `PDF title "${title}"`);

  const codes = [...new Set(text.match(/\bOG-B?\d{2}\b/g) ?? [])];
  const stray = p ? codes.filter((c) => !p.allowedOgCodes.includes(c)) : codes;
  if (stray.length) add("VB-OG-CODE", p ? `only ${p.allowedOgCodes.join(", ")}` : "no resource code", stray.join(","), `OG code in text: ${stray.join(",")}`);

  if (/\{\{[^}]+\}\}/.test(text)) add("VB-TOKEN", "no unresolved token", "token present", "unresolved token");
  if (/\bVERIFY\b/.test(text)) add("VB-TOKEN", "no VERIFY marker", "VERIFY present", "VERIFY marker");
  if (/this site can.t be reached|ERR_[A-Z_]+/i.test(text) || text.length < 500) add("VB-ERRPAGE", "real content", `${text.length} characters`, "browser error page or empty file");
  if (/\bDay \d{1,2} Complete\b/.test(text)) add("VB-DAYCOMPLETE", "no 'Day X Complete'", "present", "'Day X Complete'");
  if (/\btast(e|ing)\s+(it|the food|food)\b|\bdo not taste\b|\bdon't taste\b/i.test(text)) add("VB-TASTING", "no tasting advice", "present", "tasting advice");
  for (const s of REMOVED) if (t.includes(flat(s))) add("VB-REMOVED", "removed wording absent", s, `contains removed wording "${s}"`);

  const numbers = (m: Market, def: EmergencyRule): EmergencyRule => (p ? p.emergency[m] : def);
  const numProblem = (m: Market, rule: string, def: EmergencyRule, label: string) => {
    const e = numbers(m, def);
    const missing = e.require.filter((n) => !standalone(text, n)), present = e.forbid.filter((n) => standalone(text, n));
    if (missing.length || present.length) add(rule, `require [${e.require.join(",")}] forbid [${e.forbid.join(",")}]`, `missing [${missing.join(",")}] forbidden present [${present.join(",")}]`, `${label} emergency numbers wrong`);
  };
  const agencyRequired = !p || p.agency === "required";
  if (market === "NZ") {
    numProblem("NZ", "VB-NZ-NUMBERS", { require: ["111"], forbid: ["000", "112"] }, "NZ");
    if (agencyRequired && !t.includes(flat("Civil Defence"))) add("VB-NZ-AGENCY", "names Civil Defence", "absent", "NZ agency missing");
    if (t.includes(flat("State Emergency Service"))) add("VB-NZ-FOREIGN-AGENCY", "no AU agency", "State Emergency Service present", "AU agency in an NZ file");
    for (const s of AU_ONLY) if (t.includes(flat(s))) add("VB-NZ-AU-TIMING", "no AU-only timing", s, `AU-only timing "${s}" in an NZ file`);
  } else if (market === "AU") {
    numProblem("AU", "VB-AU-NUMBERS", { require: ["000", "112"], forbid: ["111"] }, "AU");
    if (agencyRequired && !t.includes(flat("State Emergency Service"))) add("VB-AU-AGENCY", "names the State Emergency Service", "absent", "AU agency missing");
    for (const s of NZ_ONLY) if (t.includes(flat(s))) add("VB-AU-NZ-TERM", "no NZ-only term", s, `NZ-only "${s}" in an AU file`);
  } else add("VB-MARKET", "NZ or AU", market, `unknown market "${market}"`);
  return out;
}

/**
 * The document title (Info dictionary) of a PDF, as a viewer shows it. Reading the first raw "/Title" is wrong for a PDF that also has
 * outline bookmarks (their entries are "/Title" too), which is how the Stage 11.0I editions were mis-read in Stage 11.0J.
 */
export async function pdfInfoTitle(file: string): Promise<string> {
  const buf = fs.readFileSync(file);
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buf) });
    const info = await parser.getInfo();
    await parser.destroy?.();
    const t = (info as { info?: { Title?: string } }).info?.Title;
    if (typeof t === "string" && t.length) return t;
  } catch {
    /* fall through to the raw reader */
  }
  return rawPdfTitle(buf);
}

/** Legacy reader (first raw /Title): kept only as the fallback when the Info dictionary cannot be read. */
export function rawPdfTitle(buf: Buffer): string {
  const raw = buf.toString("latin1");
  const m = raw.match(/\/Title\s*(<[0-9A-Fa-f]+>|\((?:\\.|[^\\)])*\))/);
  if (!m) return "(none)";
  const v = m[1];
  if (v.startsWith("<")) {
    const x = Buffer.from(v.slice(1, -1), "hex");
    return x[0] === 0xfe && x[1] === 0xff ? Buffer.from(x.subarray(2)).swap16().toString("utf16le") : x.toString("latin1");
  }
  return v.slice(1, -1);
}
