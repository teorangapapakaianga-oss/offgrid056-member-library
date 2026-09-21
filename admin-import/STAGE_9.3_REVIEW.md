# STAGE 9.3 — ADMIN REVIEW UI — OWNER REVIEW

**Status:** complete, awaiting owner review. **Nothing has been imported.** No source file was modified.
**Date:** 21 September 2026 · Full read-only scan of the three approved sources + local admin interface.

---

## 1. Full-scan report

Run: `npm run import:scan` across the three approved sources, read-only.

```
files 329 · 247.6 MB · 30s
OG codes 90 · legacy 57 · online-only 0 · unreadable 0
```

| Source | Files |
|---|---:|
| OffGrid056 Complete 30-Day Programme | 101 |
| Household Resilience Guide V1 | 149 |
| Documents\Work\01_ACTIVE_PROJECTS\OffGrid056 | 79 |

**Requested totals**

| Measure | Total |
|---|---:|
| Files scanned | 329 |
| OG codes found | 90 |
| **CURRENT** candidates (resource, current brand) | 92 |
| **LEGACY** candidates (legacy branding present) | 57 (52 of them resource candidates) |
| Duplicates (files in a duplicate group) | 182 |
| NEEDS_REVIEW | 185 |
| Internal / source-only files | 87 |
| Cover + support assets | 94 |
| Source / support packages (ZIP) | 4 |
| Exact duplicate groups | 14 |
| Likely duplicate groups | 17 |
| Version-candidate groups | 61 |
| Legacy-brand findings (individual issues) | 274 |
| OneDrive online-only / skipped | 0 |
| Unreadable files | 0 |

**File types:** markdown 97 · image 94 · pdf 50 · html 47 · text 16 · code 10 · font 9 · zip 4 · style 2

**Foundation confidence (all 329):** HIGH 69 · MEDIUM 106 · LOW 154
**Resource-type confidence (all 329):** HIGH 106 · MEDIUM 72 · LOW 151

LOW dominates because assets, internal files and packages are deliberately given no inference at all. Across the
144 actual resource candidates the picture is much stronger, and every LOW field must be confirmed by a person
before that candidate can move anywhere (§7).

**Resource types among resource candidates:** planner 52 · worksheet 21 · guide 16 · programme 14 ·
assessment 13 · checklist 7 · supplier-resource 7 · template 6 · download-pack 3 · workbook 2 · none 3

**Foundations among resource candidates:** general 91 · shelter 37 · energy 19 · air 9 · water 8 · food 6

Two problems the full scan exposed, both now fixed:

- **21 files were reported "unreadable".** They were fonts, stylesheets and build scripts — there was no text to
  read. They are now typed `font` / `style` / `code` and classified as internal. Unreadable is now 0, so the
  number means what it says.
- **Internal files were being classified as resources.** `README_FONTS.md` and similar slipped past the rule
  because `\b` does not fire after an underscore — the same trap that once made "OffGrid056" look like an OG
  code. Filenames are now normalised before matching, and 87 internal files are correctly identified.

---

## 2. Your five decisions — how each is implemented

| Decision | Implementation | Evidence |
|---|---|---|
| **1. Broad household assessments → General** | A foundation only wins when the name claims it through a *specific* word. Where the only claim is a whole-household word (home, household, resilience, readiness, preparedness), the resource is filed under **general**. | OG-01 Home Resilience Scorecard → **general** (was shelter) · OG-02 Household Risk Identifier → **general** · OG-13 Healthy Home **Air** Audit → **air** · OG-08 **Water** Storage Calculator → **water** · OG-18 Solar Power → **energy** |
| **2. Guide ZIP is source, PDF is the resource** | ZIPs are `materialKind: "package"` and cannot become library items without a written override. A ZIP holding more than one OG code is flagged `PACKAGE_CONTENTS_REVIEW`. | 4 packages, 0 importable |
| **3. index.html, READMEs, manifests, build and navigation files are internal** | `materialKind: "internal"`, cannot reach READY_TO_IMPORT without an override. Covers name patterns, build folders, index/contents documents, and fonts/stylesheets/scripts. | 87 internal files |
| **4. Run the full scan** | Done, read-only, before the UI was tested. Nothing imported. | §1 and §9 |
| **5. Cover images attach, never import** | Images are `materialKind: "asset"` with a role (coverImage / thumbnail / supportingAsset). Where the owning resource is unclear → `ASSET_LINK_REVIEW`. | 94 assets · 32 brand artwork · 1 attached by OG code · 61 flagged for review |

On decision 5 — the 61 flagged are mostly the Guide's own IMG-01…IMG-14 illustrations. They clearly belong to
the Guide, but not to *one* resource each, so the importer refuses to guess and asks you. The 32 brand items
(logos, icons, diagrams, week covers, promos) are marked as brand artwork with nothing to decide, so they do
not clutter that queue.

---

## 3. Admin UI build report

**`npm run import:admin` → http://127.0.0.1:3810**

It is a small standalone Node server, deliberately **not** a page in the member site. The member site is a
static export, so anything added to it ends up in `out/` and ships. Keeping the admin interface outside Next
entirely means it cannot appear in member navigation, in a static route, in the build output or in public
assets — by construction rather than by configuration. It binds to `127.0.0.1` only.

| View | What it does |
|---|---|
| **Dashboard** | Totals, the "not member resources" breakdown, findings, and six breakdowns (foundation, resource type, both confidences, file type, workflow status). |
| **Candidate list** | Ten filters — every one you listed (foundation, resource type, workflow status, confidence, legacy branding, duplicate status, file type, **OG code**, source folder) plus material — and search across title, filename, OG code and tags. The OG code filter offers "has a code", "no code" and each of the 45 codes found. |
| **Candidate detail** | Source facts (filename, extension, size, modified, checksum, source folder), every inference with its confidence and evidence, legacy findings and migration actions, duplicate group, extracted text, and the proposed library record. |
| **Metadata editor** | All 16 editable fields, validated against the real library schema. |
| **Duplicate review** | Side-by-side cards with checksum, type, size, modified date, title, branding state, text length and source, with KEEP / ARCHIVE / REVIEW / IGNORE. |
| **Preview** | The member resource card, the detail-page facts, foundation and type badges, download metadata, legacy warnings and validation status. |

Source folders appear in the admin only, with that stated on screen. They are never published (§10).

---

## 4. Candidate totals

| Status | Count |
|---|---:|
| Total candidates | 329 |
| Ready to review (resource candidates) | 144 |
| Current | 92 |
| Legacy | 57 |
| Duplicates | 182 |
| Needs review | 185 |
| Rejected | 0 |
| Ready to import | 0 |
| Imported | **0** |

Nothing is ready to import and nothing has been imported, exactly as instructed.

---

## 5. Duplicate totals

| Kind | Groups |
|---|---:|
| EXACT | 14 |
| VERSION_CANDIDATE | 61 |
| LIKELY | 17 |
| **Total** | **92** |

No winner is chosen and nothing is deleted. A KEEP/ARCHIVE decision records an intention in the workspace; it
does not touch the file. Verified: after marking one member ARCHIVE, both source files were still present with
matching checksums.

---

## 6. Legacy totals

- **57 files** carry legacy branding, with **274 individual findings**.
- Findings cover the old navy `#1A2332` and gold `#C9A227`, Playfair Display / Inter typography, and
  "5 Pillars" terminology, each with the evidence and a migration action.
- Source files are never modified. Re-skinning remains deferred (D9-9).

---

## 7. Safety: what the workflow will not let through

READY_TO_IMPORT is the only status that can put something in front of a member, so it carries every condition:

1. the material must be a **resource** — internal files, artwork and packages need a **written override**;
2. the metadata must be **complete and valid**, checked against the real `ResourceSchema`, not a copy of it;
3. an admin must **tick the approval box**;
4. every **LOW-confidence guess** must be explicitly confirmed by a person;
5. no open review flag, and no unresolved `CONTENT_MISMATCH`;
6. a duplicate must be settled first — DUPLICATE → READY_TO_IMPORT is not an allowed move.

Proven live against the real data:

```
empty draft      → 422  "DUPLICATE → READY_TO_IMPORT is not an allowed change"
internal file    → 422  "this is internal or source material … a written override is required"
                        "category: 'air-quality' is not a category of air"
                        "these were guessed with low confidence and still need a person
                         to confirm them: difficulty, estimatedTime"
```

The UI shows the blockers, but the **server** enforces them: the rules cannot be bypassed from the browser.

---

## 8. Screenshots

In `workspace/reports/screenshots/`:

1. `1_dashboard.png`
2. `2_candidate_list.png`
3. `3_candidate_detail.png`
4. `4_metadata_editor.png`
5. `5_duplicate_review.png`
6. `6_preview_and_workflow.png`

---

## 9. Test results

**114 tests pass, 0 failures** (5 files):

- **58 V1 member tests — unchanged and passing.** None weakened, skipped or edited.
- **23 importer tests** (Stage 9.2), including the source-integrity proof.
- **33 new admin-review tests** (Stage 9.3), covering: the draft an admin starts from; metadata validation
  against the real schema; category-belongs-to-foundation; vocabulary rejection; allowed status transitions;
  IMPORTED never settable from the UI; every READY_TO_IMPORT condition individually; internal/asset/package
  refusal and the written-override path; an empty override reason not counting as an override; artwork
  attachment by OG code; flagging artwork that cannot be placed; brand artwork needing no decision; workspace
  persistence and reload; and surviving a corrupt decisions file without losing the scan.

Live checks against the real 329-candidate set, beyond the automated tests:

- every filter returns the right subset (assets 94, internal 87, legacy 57, pdf 50, 30-Day Programme 101,
  OG code "has a code" 90 / "no code" 239, OG-08 → its PDF and HTML pair);
- search works across title, filename, OG code and tags;
- editing persists to `workspace/decisions.json` and reads back unchanged;
- duplicate decisions persist and are written to the audit log;
- status transitions obey the workflow rules, refused server-side with reasons.

**Source integrity after the full scan and an admin session — all 329 files:**

```
files: 329 | missing: 0 | drift: 0
```

Checked with `Get-FileHash`, independent of the importer's own checksum: content, size and modified time all
unchanged.

---

## 10. Member-build isolation proof

| | Files | Total | JS |
|---|---:|---:|---:|
| Stage 8 baseline | 800 | 20.03 MB | 956 KB |
| After Stage 9.3 | 800 | 20.03 MB | 956 KB |

**Unchanged.** A search of the entire `out/` tree found **no** occurrence of any of:

```
admin-import · importer · workspace · 3810 · decisions.json · candidates.json
OneDrive · C:\Users · sha256: · ASSET_LINK_REVIEW · READY_TO_IMPORT · materialKind
```

There is no `out/admin` route, and **nothing in `app/`, `components/` or `lib/` imports `admin-import`** — the
dependency runs one way only: the importer reads the library's schema, never the reverse.

---

## 11. Owner decisions required

1. **The "Work: active project" source is mostly business material.** Of its 79 files, most are strategy,
   marketing and campaign documents (sales system, personas, funnel, campaign copy). These are now classified
   internal so they cannot become resources by accident. Should this source be **narrowed to a subfolder**, or
   dropped from the resource scan and kept only for provenance?
2. **The Guide's 14 illustrations (IMG-01…IMG-14)** are flagged ASSET_LINK_REVIEW. Confirm the intended
   handling: attach them all to the single Guide resource, treat them as programme artwork with no resource
   attachment, or assign them individually in 9.3.
3. **General is now the largest foundation** (91 of 144 resource candidates), a direct result of decision 1.
   Confirm that is expected, or whether broad resources should be split across foundations during review.
4. **52 candidates are typed `planner`.** That is the classifier's fallback when a document is plan-like but
   not clearly a worksheet or checklist. Worth a spot-check during review — say so if you would rather these
   defaulted to NEEDS_REVIEW with no type at all.
5. **Duplicate volume:** 92 groups, 61 of them version candidates (largely PDF/HTML pairs, which decision D9-10
   says to keep as both). Confirm that PDF/HTML pairs can be **auto-resolved** as "keep both" rather than
   requiring a click each, which would cut the review queue substantially.

---

## 12. Next stage

**STAGE 9.4 — IMPORT ENGINE.** Not started. No imports have been performed.
Awaiting owner approval of this package.
