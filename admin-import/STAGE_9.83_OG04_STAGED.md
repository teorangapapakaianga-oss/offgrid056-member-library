# Stage 9.83 — OG-04 Property Type Review staged as protected resource #25

**Date:** 7 October 2026 · **STAGED ONLY. NOT DEPLOYED.** The live Worker is unchanged: `89333107-7c0a-4bdb-8229-f2b5241a9e05` (100%); rollback target `e63141a1-380a-4770-a125-9fd7a15d0bdb` (then `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`). Cloudflare Access settings were not touched.

## 1 · Staged resource metadata

| Field | Value |
|---|---|
| ID | `res-1004` |
| Legacy code | OG-04 |
| Title | Property Type Review |
| Slug | `property-type-review` |
| Foundation | general |
| Program Component | resilience-planning |
| Category | planning |
| Type | worksheet |
| Difficulty | beginner |
| Estimated time | 15 minutes |
| Status | draft |
| Collections | `["planning-tools"]` |
| Tags | `[]` |
| Description | A worksheet to record your property situation, because it shapes what you can change, what may need permission and what to check first, before you make resilience or off-grid changes. (the Stage 9.81A approved text) |
| Market files | NZ and AU, PDF, downloadable |
| Related | res-1001, res-1002, res-1022, res-1003, res-1020, res-1512 |

## 2 · Staged file paths (all git-ignored; nothing in git, nothing in `public/`)

- `private-assets/data-resources/property-type-review.private.json`
- `private-assets/resources/property-type-review.NZ.pdf`
- `private-assets/resources/property-type-review.AU.pdf`

The private-assets delta against the snapshot taken just before staging is exactly these three files (73 → 76 files; nothing else added, removed or changed).

## 3 · Full SHA-256 hashes

| File | SHA-256 |
|---|---|
| private resource record | `A407088FBB7FFDBEEAEA454DCAB3CEF58F1EB153361C496D979DDD56F842899E` |
| NZ PDF | `C39C3D561573E1816AD1C43DDC4B2F3EED2CE086D40EEEB4DC5C437E004CF96E` |
| AU PDF | `A1E4EF42DE129671BDEA6A7D8E03B8EA4CA6B32749E51A0488205CE67D5C0F7E` |

## 4 · Byte identity of the staged PDFs

The two PDFs were copied, not regenerated, from the approved Stage 9.82A renders (`workspace/prep/OG-04/`); the staging script compared hashes after the copy. Re-verified after the build: for NZ and for AU, the approved render, the staged copy in `private-assets/resources/` and the copy in `out/resources/` are byte-identical (same SHA-256). They are 9 pages each, portrait 612 × 792 on every page, with the title "Property Type Review — OffGrid056" and page 7 opening with "Step 4 — Your Property Rules (continued)" (automated PDF QA passes on both the `out/` and `private-assets/` copies). The 48 PDFs already deployed (the 46 from Stage 9.74 plus OG-03's two) are byte-identical to the deployed tree: 73 PDFs compared in the deployed tree, 0 changed.

## 5 · Related-resource verification

The record's six related ids resolve to existing private records with the expected titles, in this order: res-1001 Home Resilience Scorecard · res-1002 Household Risk Identifier · res-1022 Resilience Product Wishlist · res-1003 Household Spending Capacity Check · res-1020 Alternative Energy Suitability Check · res-1512 Off-Grid System Architecture Planner. **Not related ids:** 3-Tier Budget Planner (res-1026) and 90-Day Implementation Roadmap (res-1027); they appear in Where Next only. OG-03's own related list is unchanged and does not include OG-04.

## 6 · Planning Tools final contents (8 protected resources, each exactly once; no demo placeholder)

| Code | id | Title |
|---|---|---|
| OG-03 | res-1003 | Household Spending Capacity Check |
| **OG-04** | **res-1004** | **Property Type Review** |
| OG-22 | res-1022 | Resilience Product Wishlist |
| OG-25 | res-1025 | Project Support Brief Template |
| OG-26 | res-1026 | 3-Tier Budget Planner |
| OG-27 | res-1027 | 90-Day Implementation Roadmap |
| OG-B04 | res-1504 | Monthly Planning Challenge Template |
| OG-B10 | res-1510 | 90-Day Implementation Roadmap (Advanced) |

The deployed Planning Tools lists the seven without OG-04; the staged one adds only OG-04. The four demo placeholders are not listed.

## 7 · Route checks (all pass)

- **Unique:** one `res-1004` and one `property-type-review` slug among the 25 protected records; no `data/resources/property-type-review.json` demo file; no new `demo-` route.
- **No demo/protected collision**, so no `route-policy.json` entry was needed and the policy file is unchanged.
- **OG-04 route:** `/resources/property-type-review/` is built (page set of 6 files) and its page data carries general / resilience-planning / planning / worksheet.
- **Explicit demo and programme routes unchanged:** programme days 2, 9, 11, 13 and 29 still point at their demo placeholders; the four separated demo routes and the four demo placeholders' own routes are still built; the protected library lists the real OG-01, OG-08, OG-10 and OG-13 once each.
- **Start Here unchanged:** 8 entries before and after, each deep-equal.
- **Library:** exactly one resource summary added (res-1004), none removed, none changed; Program Components and all collection assignments unchanged.

## 8 · Market checks (all pass)

The worksheet body is identical in NZ and AU (5,497 characters each). NZ carries "call 111" and the New Zealand tradesperson wording only; AU carries "call 000", 112 and the Australian wording only; no cross-market leakage. No tenancy, consent, grant, body-corporate or building-standard wording; no electrical-technology wording. No currency, percentage or age claim.

## 9 · Safety checks (all pass)

The legacy electrical-topic disposition remains **REMOVED** (owner-approved, Stage 9.81A). The staged PDFs carry only the two standing blocks (emergency contact and general disclaimer); no electrical or other topic block. The staged copy is the approved render, so no new trigger.

## 10 · Register integrity

Audited before completing staging, on `internal/member-programme/CURRENT_STATUS.md` and `NEXT_ACTIONS.md`:
- **Paths:** every `admin-import/…` path resolves to a file on disk (20 in CURRENT_STATUS, 15 in NEXT_ACTIONS), and no "dmin-import" or other truncated path remains. The only reference not yet on disk at audit time was this report, which is written next.
- **Characters:** no control characters and no mojibake (the "â€”" shown by some Windows consoles is a display artefact; the files are UTF-8).
- **Worker IDs:** `89333107-7c0a-4bdb-8229-f2b5241a9e05` is the live Worker; rollback `e63141a1-380a-4770-a125-9fd7a15d0bdb`, then the older versions `7de9641f…`, `db2fd12a…`, `fa23ec74…`, `1922f7ba…`, all in full and correct.
- **One defect found and fixed:** the top paragraph of CURRENT_STATUS still said "LIVE (unchanged since Stage 9.74): 23 protected resources…" and "STAGED, NOT DEPLOYED: OG-03…", both stale since OG-03 was deployed in Stage 9.79. I rewrote that paragraph so that LIVE (Stage 9.79: 24 / 48, Worker `89333107…`) and STAGED, NOT DEPLOYED (Stage 9.83: OG-04, 25 / 50) are separate statements, with the Stage 9.82A and 9.83 references accurate.

## 11 · Exact register files changed

- `internal/member-programme/CURRENT_STATUS.md` (top "As at" paragraph rewritten as above)
- `internal/member-programme/NEXT_ACTIONS.md` ("As at" line and a Stage 9.83 note)

No other register was edited. **For your information:** `internal/member-programme/RESOURCE_REGISTER.md` was last brought up to date at Stage 9.60 (its counts still read 21 deployed, apart from the OG-03 row from Stage 9.78) and its OG-04 row is "—". You asked me not to make unrelated register edits, so I left it as it is.

## 12 · Staged counts

**25 protected resources · 50 market files · 1000 files in `out/` · 0 broken internal links · Bucket C 0** (`import:verify-build`: records 25 · market files 50 · broken internal links 0 · deployment build verified).

## 13 · Live counts

**24 protected resources · 48 market files · 992 files · 0 broken links** (the deployed tree, unchanged). The Worker list shows `89333107-7c0a-4bdb-8229-f2b5241a9e05` at 100%.

## 14 · Manifest diff: staged build against the currently deployed tree (build id normalised)

| | |
|---|---|
| Total staged files | 1,000 |
| Added | 8 |
| Removed | 0 |
| Changed (same path, different content) | 299 |
| Unchanged | 693 |
| Existing PDFs changed | 0 |
| Unexplained differences | **0** |

**Added (8):** the six OG-04 page files (`resources/property-type-review/index.html`, `index.txt`, `__next._full.txt`, `__next._tree.txt` and the two `__PAGE__.txt` payloads) and the two PDFs `property-type-review.NZ.pdf` and `.AU.pdf`.

**Changed (299: 60 pages, 239 payloads), attributed at content level (`workspace/explain-og04.mts`, which diffs every segment):**
- 299 files differ only because OG-04 appears in the embedded resource data (its summary, record, listing card or download row);
- 3 of them also lose OG-04's own listing row or card, removed as a whole block, after which the rest matches the deployed page exactly;
- 2 contain a count or total that rose by one with the new resource;
- 8 contain an item-index list into which the new resource was inserted (one entry added, later indexes shifted by one);
- 1 differs only in Next.js head and script markup (build noise).

These classes overlap (a file can show more than one), and there is **no unexplained difference**. The 60 changed routes are pages that embed the library data (listings and resource pages); the attribution above shows each differs only by OG-04 appearing in that data, and none changed in any other way. The Planning Tools page (checked separately) differs only by gaining OG-04.

## 15 · Tests

**774 passing** (36 files): the 769 from Stage 9.82A plus 5 new tests for the staged record and PDFs (`tests/unit/og-04-staged.test.ts`). Four existing assertions were updated because the staged state legitimately changed: the protected-record count (24 → 25, classification test), Planning Tools membership (seven → eight, two assertions) and the OG-04 "not staged" assertion (now: staged as `res-1004` with exactly the six related ids). No assertion was loosened. Lint clean; typecheck clean. Route-policy, demo/protected separation and collection/listing tests are in the suite and pass; the separate release QA (`workspace/qa-release-og04.mts`) passes in full: 25 records, 50 market files all present, every record draft, every protected page carries its classification, demo routes and programme references intact, no demo card in any listing, 48 deployed PDFs byte-identical, the only new PDFs are OG-04's two, no private PDF in `public/`.

## 16 · Bucket C

**0** (both markets; library-wide too). Price claims 0.

Other validation: `import:verify-prep` verifies both OG-04 PDFs (9 pages each) and all prepared files; the regression run shows 0 content flags, 0 price findings, 0 safety-removal findings and 0 market problems.

## 17 · Cloudflare Access

An unauthenticated probe of 41 routes (pages, PDFs, demo routes and unknown routes) redirected all 41 to Cloudflare Access; none answered 200. Access settings were not changed.

## 18 · Stale request closed

The old request "Update inside docx 1" is **closed and dropped** at the owner's instruction. It is not an active task and will not appear in future reports unless you raise it again.

## 19 · Readiness to deploy OG-04 as protected resource #25

**Ready, pending your explicit approval.** The deployment would upload the 1,000-file staged build exactly as validated, with `89333107-7c0a-4bdb-8229-f2b5241a9e05` retained as the immediate rollback target and all older versions kept. Nothing has been deployed.
