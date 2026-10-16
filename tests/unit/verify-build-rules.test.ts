import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractText, detectFileType } from "@/admin-import/parsers/index";
import { companionProblems, fileProblems, loadProfiles, loadReleaseSets, orphanCompanionProblems, pdfInfoTitle, rawPdfTitle, releaseSetProblems, type FileFacts } from "@/admin-import/pilot/verify-build-rules";

/**
 * Stage 11.0J — import:verify-build: the default per-file rules are unchanged, and two owner-approved, resource-scoped profiles (res-1513, res-1515) cover the
 * Stage 11.0I editions. Positive tests use the real staged PDFs where the private assets are present; the negative tests prove that wrong documents are still rejected.
 */
const root = process.cwd();
const profiles = loadProfiles(path.join(root, "admin-import/config/verify-build-profiles.json"));
const B13 = { id: "res-1513", legacyCode: "OG-B13", title: "Resilience Asset & Document Checklist" };
const B15 = { id: "res-1515", legacyCode: "OG-B15", title: "Seasonal Review & Annual Service Log" };
const FILLER = " Household worksheet line for the member to complete.".repeat(14);
const T = { B13: (m: string) => `OG-B13 ${m} Resilience Asset and Document Checklist`, B15: (m: string) => `OG-B15 ${m} Seasonal Review and Service Log` };
const facts = (record: FileFacts["record"], market: string, text: string, title: string): FileFacts => ({ record, market, text, title });
const rules = (f: FileFacts, p = profiles) => fileProblems(f, p).map((x) => x.rule);
const b13Text = (extra = "") => `OG-B13 resource page. Keep records and ask your insurer.${FILLER} ${extra}`;
const b15Text = (market: "NZ" | "AU", extra = "") => `OG-B15 seasonal review; see OG-B13 records. ${market === "NZ" ? "Call 111." : "Call Triple Zero (000)."}${FILLER} ${extra}`;

describe("Stage 11.0J · verify-build profiles", () => {
  it("are version-controlled, limited to the two named resources, and matched by id and legacy code", () => {
    expect(profiles.map((p) => [p.resourceId, p.legacyCode])).toEqual([["res-1513", "OG-B13"], ["res-1515", "OG-B15"]]);
    for (const p of profiles) { expect(p.approvedBy).toMatch(/Project Owner/); expect(p.agency).toBe("not-required"); }
    expect(fileProblems(facts({ ...B13, legacyCode: "OG-B99" }, "NZ", b13Text(), T.B13("NZ")), profiles).map((x) => x.rule)).toContain("VB-NZ-AGENCY"); // id matches but code does not: default rules
  });

  describe("positive: the owner-approved editions pass", () => {
    it("synthetic B13 and B15 files in each market pass", () => {
      for (const m of ["NZ", "AU"] as const) {
        expect(fileProblems(facts(B13, m, b13Text(), T.B13(m)), profiles)).toEqual([]);
        expect(fileProblems(facts(B15, m, b15Text(m), T.B15(m)), profiles)).toEqual([]);
      }
    });
    const pdfs = path.join(root, "private-assets/resources");
    it.skipIf(!fs.existsSync(pdfs))("the four real staged PDFs pass", async () => {
      for (const [rec, slug, code] of [[B13, "resilience-asset-and-document-checklist", "B13"], [B15, "seasonal-review-and-annual-service-log", "B15"]] as const) {
        for (const m of ["NZ", "AU"] as const) {
          const file = path.resolve(pdfs, `${slug}.${m}.pdf`);
          const { text } = await extractText(file, detectFileType(file, ".pdf"), 400000);
          const title = await pdfInfoTitle(file);
          expect(title, `${slug} ${m}`).toBe(T[code](m));
          expect(fileProblems(facts(rec, m, text, title), profiles), `${slug} ${m}`).toEqual([]);
          // the root cause of the Stage 11.0J failure: the first raw /Title is an outline bookmark, not the document title
          expect(rawPdfTitle(fs.readFileSync(file)), `${slug} ${m} raw`).not.toBe(title);
          // and the default rules, without a profile, would still reject these editions
          expect(rules(facts(rec, m, text, title), [])).toEqual(expect.arrayContaining(["VB-TITLE", "VB-OG-CODE"]));
        }
      }
    }, 60000);
  });

  describe("negative: invalid documents are still rejected", () => {
    it("wrong document title", () => {
      expect(rules(facts(B13, "NZ", b13Text(), "1. Start with a simple asset inventory"))).toEqual(["VB-TITLE"]);
      expect(rules(facts(B13, "NZ", b13Text(), T.B13("AU")))).toEqual(["VB-TITLE"]); // the other country's title
      expect(rules(facts(B15, "AU", b15Text("AU"), T.B15("NZ")))).toEqual(["VB-TITLE"]);
    });
    it("an unexpected resource code", () => {
      expect(rules(facts(B13, "NZ", b13Text("See OG-B14."), T.B13("NZ")))).toEqual(["VB-OG-CODE"]);
      expect(rules(facts(B13, "NZ", b13Text("See OG-B15."), T.B13("NZ")))).toEqual(["VB-OG-CODE"]); // B15 is allowed in B15 only
      expect(rules(facts(B15, "NZ", b15Text("NZ", "See OG-B02."), T.B15("NZ")))).toEqual(["VB-OG-CODE"]);
    });
    it("cross-country emergency numbers and agencies, even where none is required", () => {
      expect(rules(facts(B13, "NZ", b13Text("Call 000."), T.B13("NZ")))).toEqual(["VB-NZ-NUMBERS"]);
      expect(rules(facts(B13, "NZ", b13Text("Call 112."), T.B13("NZ")))).toEqual(["VB-NZ-NUMBERS"]);
      expect(rules(facts(B13, "NZ", b13Text("State Emergency Service"), T.B13("NZ")))).toEqual(["VB-NZ-FOREIGN-AGENCY"]);
      expect(rules(facts(B13, "AU", b13Text("Call 111."), T.B13("AU")))).toEqual(["VB-AU-NUMBERS"]);
      expect(rules(facts(B13, "AU", b13Text("Ask Civil Defence."), T.B13("AU")))).toEqual(["VB-AU-NZ-TERM"]);
    });
    it("B15 still needs its own country's number and rejects the other's", () => {
      expect(rules(facts(B15, "NZ", b15Text("NZ").replace("111", "one-one-one"), T.B15("NZ")))).toEqual(["VB-NZ-NUMBERS"]);
      expect(rules(facts(B15, "AU", b15Text("AU").replace("000", "zero"), T.B15("AU")))).toEqual(["VB-AU-NUMBERS"]);
      expect(rules(facts(B15, "AU", b15Text("AU", "or 111"), T.B15("AU")))).toEqual(["VB-AU-NUMBERS"]);
      expect(rules(facts(B15, "NZ", b15Text("NZ", "or 000"), T.B15("NZ")))).toEqual(["VB-NZ-NUMBERS"]);
      expect(rules(facts(B15, "NZ", b15Text("AU"), T.B15("NZ")))).toEqual(expect.arrayContaining(["VB-NZ-NUMBERS"])); // an AU-numbered file labelled NZ
    });
    it("the other global checks still apply to profiled resources", () => {
      expect(rules(facts(B13, "NZ", b13Text("Skool"), T.B13("NZ")))).toEqual(["VB-REMOVED"]);
      expect(rules(facts(B13, "NZ", b13Text("{{token}}"), T.B13("NZ")))).toEqual(["VB-TOKEN"]);
      expect(rules(facts(B13, "NZ", "short", T.B13("NZ")))).toEqual(["VB-ERRPAGE"]);
      expect(rules(facts(B13, "XX", b13Text(), T.B13("NZ")))).toContain("VB-MARKET");
    });
    it("a profile never relaxes another resource, and the default rules are unchanged", () => {
      const other = { id: "res-1514", legacyCode: "OG-B14", title: "Local Support Network Planner" };
      expect(rules(facts(other, "NZ", b13Text(), "Local Support Network Planner — OffGrid056"))).toEqual(expect.arrayContaining(["VB-OG-CODE", "VB-NZ-NUMBERS", "VB-NZ-AGENCY"]));
      expect(rules(facts(other, "AU", b13Text(), "Local Support Network Planner — OffGrid056"))).toEqual(expect.arrayContaining(["VB-AU-NUMBERS", "VB-AU-AGENCY"]));
      const ok = `Emergency 111. Civil Defence.${FILLER}`;
      expect(rules(facts(other, "NZ", ok, "Local Support Network Planner — OffGrid056"))).toEqual([]);
      const okAU = `Emergency 000 or 112. State Emergency Service.${FILLER}`;
      expect(rules(facts(other, "AU", okAU, "Local Support Network Planner — OffGrid056"))).toEqual([]);
      expect(rules(facts(other, "NZ", `${ok} 000`, "Local Support Network Planner — OffGrid056"))).toEqual(["VB-NZ-NUMBERS"]);
    });
  });
});

describe("Stage 11.0J · editable companions and release sets in verify-build", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "vb-"));
  fs.mkdirSync(path.join(out, "resources"));
  const good = Buffer.concat([Buffer.from("PK"), Buffer.from("docx body")]);
  const sha = (b: Buffer) => crypto.createHash("sha256").update(b).digest("hex");
  fs.writeFileSync(path.join(out, "resources/t.NZ.docx"), good);
  fs.writeFileSync(path.join(out, "resources/t.AU.docx"), good);
  const rec = (over: object = {}) => ({ legacyCode: "OG-B13", marketFiles: { NZ: { fileUrl: "/resources/t.NZ.pdf" }, AU: { fileUrl: "/resources/t.AU.pdf" } }, companionFiles: { NZ: { fileUrl: "/resources/t.NZ.docx", fileFormat: "DOCX", sha256: sha(good) }, AU: { fileUrl: "/resources/t.AU.docx", fileFormat: "DOCX", sha256: sha(good) } }, ...over });
  it("passes when the companions exist, are zip files and match the recorded SHA-256", () => {
    expect(companionProblems(rec(), out)).toEqual([]);
    expect(orphanCompanionProblems(out, [rec()])).toEqual([]);
  });
  it("rejects a missing file, a hash mismatch, a non-docx file and a companion without its market's PDF", () => {
    expect(companionProblems(rec({ companionFiles: { NZ: { fileUrl: "/resources/missing.docx", fileFormat: "DOCX", sha256: sha(good) } } }), out).map((p) => p.rule)).toEqual(["VB-COMPANION"]);
    const bad = rec({ companionFiles: { NZ: { fileUrl: "/resources/t.NZ.docx", fileFormat: "DOCX", sha256: "0".repeat(64) } } });
    expect(companionProblems(bad, out)[0].actual).toMatch(/does not match the record/);
    fs.writeFileSync(path.join(out, "resources/notzip.docx"), "plain text");
    expect(companionProblems(rec({ companionFiles: { NZ: { fileUrl: "/resources/notzip.docx", fileFormat: "DOCX", sha256: sha(Buffer.from("plain text")) } } }), out).map((p) => p.actual)).toEqual(["not a zip/docx file"]);
    expect(companionProblems(rec({ marketFiles: { NZ: { fileUrl: "/resources/t.NZ.pdf" } } }), out).map((p) => p.actual)).toContain("companion without a PDF for its market");
  });
  it("rejects any editable file in the build that no record names", () => {
    fs.writeFileSync(path.join(out, "resources/stray.docx"), good);
    expect(orphanCompanionProblems(out, [rec()]).map((p) => p.actual)).toEqual(["notzip.docx", "stray.docx"]);
    expect(orphanCompanionProblems(out, [])).toHaveLength(4); // with no record naming them, every .docx is an orphan
  });
  it("requires B13 and B15 to be released together", () => {
    const sets = loadReleaseSets(path.join(root, "admin-import/config/verify-build-profiles.json"));
    expect(sets.map((s) => s.resources)).toEqual([["res-1513", "res-1515"]]);
    expect(releaseSetProblems(["res-1001", "res-1513", "res-1515"], sets)).toEqual([]);
    expect(releaseSetProblems(["res-1001"], sets)).toEqual([]); // neither present: fine
    expect(releaseSetProblems(["res-1515"], sets)[0].rule).toBe("VB-RELEASE-SET"); // B15 alone would link to an unavailable B13
    expect(releaseSetProblems(["res-1513"], sets)[0].rule).toBe("VB-RELEASE-SET");
  });
});