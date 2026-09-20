# STAGE 9.2 — SCANNER + CLASSIFIER — OWNER REVIEW

**Status:** complete, awaiting owner review. The admin review UI has **not** been built (Stage 9.3).
**Date:** 21 September 2026 · **Run:** controlled sample of 21 real files.

---

## 1. What was built

| Part | File | What it does |
|---|---|---|
| Types | `admin-import/types.ts` | Inventory, candidate, inference, duplicate and summary shapes. Every inference carries `{ value, confidence, evidence }`. |
| Sources | `admin-import/config/sources.json` | The approved folders, ignore lists and limits. |
| Rules | `admin-import/config/inference-rules.json` | Keyword maps for resource types, foundations, categories and difficulty. |
| Legacy brand | `admin-import/config/legacy-brand.json` | Old colours, fonts, "5 Pillars" wording, and what to do about each. |
| Sample | `admin-import/config/sample.json` | The 21 files used for this run. |
| Parsers | `admin-import/parsers/index.ts` | Real file type from magic bytes; text from PDF, HTML, Markdown, DOCX, XLSX, ZIP; image dimensions; MP4 duration. |
| Scanner | `admin-import/scanner/scan.ts` | Walks the sources, checksums, reads text. Read-only. |
| Classifier | `admin-import/mappers/classify.ts` | OG code, title, resource type, foundation, category, difficulty, reading time, legacy branding. |
| De-duplication | `admin-import/dedupe/group.ts` | EXACT, VERSION_CANDIDATE and LIKELY groups. Picks no winner. |
| CLI | `admin-import/cli.mts` | `npm run import:scan` |
| Tests | `tests/unit/importer.test.ts` | 23 tests (see §13). |

Nothing in `admin-import/` is imported by the member site. It runs only from the command line.

---

## 2. How to run it

```bash
npm run import:scan -- --sample
```

`--sample` limits the run to the 21 files in `sample.json`. Without it, the scan covers every enabled source.
`--source "<label>"` narrows it to one source.

Output goes to `workspace/` (git-ignored, decision D9-4):

- `inventory.json` — every file found, with checksum and provenance
- `candidates.json` — the same files with inferences, confidence and evidence
- `duplicates.json` — the duplicate groups
- `text/extracted.json` — extracted text, kept for the classifier and for Stage 9.3
- `logs/audit.jsonl` — one line per file, append-only
- `reports/SCAN_REPORT_<date>.md` — the human-readable summary

---

## 3. Scan result (21-file sample)

```
files 21 · 97.2 MB · 18.9s
types: markdown 3 · image 4 · html 4 · pdf 9 · zip 1
OG codes 10 · legacy 7 · online-only 0 · unreadable 0
duplicate groups 5
```

---

## 4. Classification results

| File | Code | Type | Foundation | Conf. | Status |
|---|---|---|---|---|---|
| OG-08_Water_Storage_Calculator (.html/.pdf) | OG-08 | worksheet `+calculator` | water | HIGH | DUPLICATE |
| OG-11_30Day_Pantry_Builder.pdf | OG-11 | worksheet | food | HIGH | CLASSIFIED |
| OG-13_Healthy_Home_Air_Audit.pdf | OG-13 | assessment | air | HIGH | CLASSIFIED |
| OG-15_Warm_Home_Scorecard.pdf | OG-15 | assessment | shelter | HIGH | CLASSIFIED |
| OG-18_Solar_Power_101_Workbook.pdf | OG-18 | workbook | energy | HIGH | CLASSIFIED |
| OG-B01_QuickStart_Resilience_Checklist.pdf | OG-B01 | checklist | shelter | MEDIUM | CLASSIFIED |
| OG-01_Home_Resilience_Scorecard (.html/.pdf) | OG-01 | assessment | shelter | MEDIUM | DUPLICATE |
| OG-05_5_Pillars_Quick_Reference.html | OG-05 | guide | general | MEDIUM | CLASSIFIED |
| Guide FINAL .pdf / .zip | — | guide / download-pack | general | MEDIUM/HIGH | DUPLICATE |
| Guide Workbook_Pages.pdf | — | guide | general | MEDIUM | CLASSIFIED |
| POSITIONING_AND_5_FOUNDATIONS.md | — | planner | general | MEDIUM | CLASSIFIED |
| README.md, BRAND_PLAN.md, index.html | — | — | general | MEDIUM | NEEDS_REVIEW |
| 4 × cover / IMG-01 images | — | *(none)* | *(none)* | LOW | NEEDS_REVIEW |

**Totals:** CLASSIFIED 8 · DUPLICATE 6 · NEEDS_REVIEW 7 · legacy branding flagged 7.
**Foundation confidence:** HIGH 7 · MEDIUM 10 · LOW 4.

Deliberate behaviours worth noting:

- **Images get no type and no foundation.** Artwork belongs to whatever resource uses it; guessing from a filename helps nobody. All four are NEEDS_REVIEW.
- **Index and internal documents are not treated as resources.** README, BRAND_PLAN and index.html are inventoried and flagged, never silently classified.
- **Everyday words are demoted when picking a foundation.** "water", "home", "energy" and "power" appear in nearly all of this material, so they only ever count as weak evidence. That is why OG-08 reaches HIGH (litres, rainwater, tank, rotation) while a file that merely mentions water does not.
- **Calculators become Worksheet + tag `calculator`, and the XLSX is retained** (decision D9-6).

---

## 5. OG code detection

10 of 21 files carry a code. The pattern requires a separator (`OG-08`, `OG_08`, `OG 08`), so:

- `OffGrid056` and `OG056-HRG_IMG-01…` are **not** read as OG-56 — this was a real false positive, now covered by a test;
- `OG-2026` and similar dates are rejected by the range check;
- a document listing more than two different codes is treated as an **index**, not as one resource.

---

## 6. Duplicate groups found

| Group | Kind | Members |
|---|---|---|
| dup-001 | EXACT | `IMG-01_cover` in `assets/images` and in `_source_deliveries/from_assets` — identical bytes, 4,405 KB |
| dup-002 | VERSION_CANDIDATE (PDF/HTML pair) | OG-01 Scorecard .html + .pdf |
| dup-003 | VERSION_CANDIDATE (PDF/HTML pair) | OG-08 Calculator .html + .pdf |
| dup-004 | VERSION_CANDIDATE | `IMG-01_cover` original 4,405 KB vs web-resized 905 KB — same name, different bytes |
| dup-005 | VERSION_CANDIDATE | Guide FINAL `.pdf` and `.zip` |

**No winner is chosen and nothing is deleted.** Every group is left for a person to decide in Stage 9.3.
Per decision D9-10 the PDF/HTML pairs are kept as *both*: PDF as the member artefact, HTML as the re-skinning source. Where the two texts diverge, the pair is flagged `CONTENT_MISMATCH`; neither pair in this sample was.

---

## 7. Legacy branding detected

7 files carry legacy branding — the old navy `#1A2332` and gold `#C9A227`, Playfair Display / Inter typography, and "5 Pillars" wording. Each finding records the evidence and a migration action (→ Resilience Green / Deep Green, → Bebas Neue / Montserrat, → Five Foundations).

Two false-positive classes are explicitly handled: "Inter" no longer matches *winter*, *interruption* or *internal* (short font names must appear in a font context), and current-brand files are left alone.

**Source files are never modified.** Legacy branding is recorded, not corrected.

---

## 8. Safety — every rule in the Stage 9 brief

| Rule | Status | Evidence |
|---|---|---|
| Do not upload files externally | ✅ | No network code anywhere in `admin-import/`. |
| Do not send source material to third parties | ✅ | Same: everything is local filesystem I/O. |
| Do not delete original files | ✅ | No `unlink`, `rm`, `rmdir` or `rename` in the importer. |
| Do not modify originals | ✅ | Files opened read-only; proven in §12. |
| Do not expose source paths to members | ✅ | Paths live only in `workspace/`, which is git-ignored and never deployed. |
| Do not commit secrets | ✅ | `workspace/` git-ignored; no credentials in config. |
| Do not import real member data | ✅ | Nothing is imported at all in 9.2 — scanning only. |
| Do not change Git global identity | ✅ | Untouched. |
| All scanning local | ✅ | No outbound calls. |
| All imports enter as draft (D9-7) | ✅ | Every candidate is `importApproved: false`, `disposition: null`, `importedAt: null`. |
| Admin excluded from member build (D9-8) | ✅ | §11. |
| Videos by URL, local paths retained but not published (D9-1) | ✅ | `video: { durationSeconds, hostingUrl }`; path stays in `workspace/` only. |
| ITEEK source read-only and flagged (D9-2) | ✅ | Present in `sources.json` as `enabled: false, misplaced: true`; any entry from it carries `misplacedSource: true`. |
| Scan order: programme, guide, work project (D9-3) | ✅ | That is the order in `sources.json`. |

OneDrive "online only" files are detected **before** anything is read, so a scan can never silently pull gigabytes down from the cloud. None of the 21 sample files were online-only.

---

## 9. Dependencies added

All three are **devDependencies**, so they are never installed in a production build of the member site:

- `pdf-parse ^2.4.5` — PDF text
- `adm-zip ^0.6.1` + `@types/adm-zip ^0.5.8` — DOCX, XLSX and ZIP contents

---

## 10. Limits and known gaps

- Text extraction is capped per file, and files above the size limit are inventoried without text (checksum and provenance are still recorded).
- PDF text from letter-spaced headings is rejoined by `unspace()`; heavily designed PDFs can still extract awkwardly, which lowers confidence rather than producing a wrong answer.
- Scanned-image PDFs yield no text (no OCR). They fall to LOW confidence and NEEDS_REVIEW.
- Difficulty is always LOW confidence — the source material rarely states a level.
- MP4 duration is read from the `mvhd` header; other containers return `null`.

---

## 11. Member build size — before and after the admin dependencies

| | Files | Total | JS |
|---|---|---|---|
| Before (Stage 8 baseline) | 800 | 20.03 MB | 956 KB |
| After adding pdf-parse + adm-zip | 800 | 20.03 MB | 956 KB |

**No change.** A search of the whole `out/` tree for `admin-import`, `pdf-parse`, `adm-zip`, `AdmZip` and `PDFParse` returns nothing.

---

## 12. Source integrity — proof

Checked against the 21 **real** source files, with `Get-FileHash` (an implementation independent of the importer's own checksum):

```
SOURCE INTEGRITY AFTER SCAN -> files: 21 | missing: 0 | drift: 0
```

Every file is still present, byte-identical, the same size, and carries the same last-modified time — the scan does not even disturb a timestamp. The same property is asserted automatically in the test suite, so a future change that starts writing to a source folder will fail the build.

---

## 13. Importer tests — 23 tests

| Area required by the brief | Tests |
|---|---|
| File scanning | finds every file with size, date, type, checksum; honours ignore rules |
| Extension detection | real type from bytes, not the extension (an HTML file named `.pdf` is HTML); DOCX vs XLSX vs plain ZIP; text read out of DOCX and XLSX; letter-spaced PDF headings rejoined |
| Checksum generation | stable, and identical for identical files |
| OG code detection | filenames and bonus codes; not fooled by `OffGrid056`, `OG056-HRG` or `OG-2026`; multi-code documents treated as an index |
| Foundation inference | value, confidence and evidence; never guessed for artwork |
| Resource-type inference | type with evidence; calculator → worksheet + `calculator` tag; index/internal documents flagged instead of imported; slug generation |
| Duplicate detection | EXACT grouping; version grouping; filename and text similarity measures |
| Metadata validation | every entry has a positive size, a `sha256:` checksum and a valid date |
| Conflict handling | no winner is ever chosen; every candidate stays `disposition: null` |
| Batch import / backup before replacement / invalid rejection / audit logging | **covered in Stage 9.4**, when the import engine exists — 9.2 writes nothing into the library, so there is nothing yet to back up, replace or reject. The audit log (`workspace/logs/audit.jsonl`) is written and verified by hand this stage. |
| **Source integrity** | every source file unchanged in content, size and modified time after a scan |

---

## 14. Existing V1 tests

**All 58 pass, unchanged.** Full run: **81 tests passed (58 V1 + 23 importer), 4 files, 0 failures.** No V1 test was weakened, skipped or edited.

---

## 15. Owner decisions required before Stage 9.3

1. **OG-01 "Home Resilience Scorecard" is inferred as SHELTER (MEDIUM).** It arguably spans all five foundations. Should whole-household assessments default to **general** instead of shelter?
2. **The Guide FINAL `.zip` and `.pdf` are grouped as versions of each other.** Confirm the intended handling: publish the PDF as the resource and treat the ZIP as a download pack, or keep only one.
3. **`index.html` from the Guide build** is flagged NEEDS_REVIEW as an internal file. Confirm it is not a member resource.
4. **Full scan scope.** 9.2 ran on a 21-file sample. Confirm when to run the full scan across all three sources, which will take considerably longer and produce a much larger review queue.
5. **The four cover images** are inventoried but classified as artwork. Confirm they should be attached to resources in Stage 9.3 rather than imported as resources.

---

## 16. Next stage

**STAGE 9.3 — ADMIN REVIEW UI.** Not started, as instructed. Awaiting owner approval of this package.
