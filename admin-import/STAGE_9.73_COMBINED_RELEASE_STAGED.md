# Stage 9.73 — owner rulings applied; combined library cleanup STAGED (not deployed)

> **Superseded in part by `STAGE_9.73A_ROUTE_AUDIT_AND_FINAL_RULINGS.md`:** OG-B07 is now **off-grid-living** (not advanced-future); the ten "applied from the locked rules" classifications are owner-confirmed; the three grandfathered supersessions are **not approved** and are pending a per-collision ruling; the demo Home Resilience Scorecard card is now **hidden** from listings; counts below (701 tests, 329 changed files) are now 706 tests and 175 changed files.

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Staged and validated. NOT deployed.** The live Worker is still `7de9641f-df4c-4cab-8e84-055c0861879d` (rollback `db2fd12a-955e-47c4-b3c9-d174e3da85d8`, earlier `fa23ec74…`, `1922f7ba…`). No member wording changed.

The Wrangler asset-count discrepancy is closed (Stage 9.72: 563 uploaded + 397 already uploaded = 960 files; previous 562 + 396 = 958; net +2 = the OG-01 PDFs).

## 1 · Complete 21-resource classification
Full table with all five alignment answers per resource: **`STAGE_9.73_CLASSIFICATION_TABLE.md`** (generated from the applied config and records, so it cannot drift). Summary:

| Code | Resource | Foundation | Programme Component | Category | Type | Basis |
|---|---|---|---|---|---|---|
| OG-08 | Water Storage Calculator | water | off-grid-living | water-storage | worksheet | **owner ruling** |
| OG-17 | Solid Fuel Heating Planner | shelter | off-grid-living | heating | planner | **owner ruling** |
| OG-19 | Battery Backup Planner | energy | off-grid-living | backup-energy | planner | **owner ruling** |
| OG-11 | 30-Day Pantry Builder | food | resilience-emergency | pantry-resilience | worksheet | **owner ruling** |
| OG-13 | Healthy Home Air Audit | air | resilience-planning | healthy-home-checks | assessment | **owner ruling** |
| OG-22 | Resilience Product Wishlist | general | resilience-planning | planning | worksheet | **owner ruling** |
| OG-21 | Home Energy & Shelter Upgrade Plan | shelter | planning-implementation | household-resilience | planner | **owner ruling** |
| OG-B10 | 90-Day Implementation Roadmap (Advanced) | general | planning-implementation | planning | planner | **owner ruling** |
| OG-26 | 3-Tier Budget Planner | general | planning-implementation | planning | planner | locked earlier |
| OG-B12 | Off-Grid System Architecture Planner | general | advanced-future | planning | planner | locked earlier |
| OG-B07 | Solar Planning Deep Worksheet | energy | advanced-future | solar | worksheet | locked earlier — see §11 |
| OG-27 | 90-Day Implementation Roadmap | general | planning-implementation | planning | planner | applied from locked rules |
| OG-25 | Project Support Brief Template | general | planning-implementation | planning | template | applied from locked rules |
| OG-B04 | Monthly Planning Challenge Template | general | planning-implementation | planning | planner | applied from locked rules |
| OG-18 | Solar Power 101 Workbook | energy | off-grid-living | solar | workbook | applied from locked rules |
| OG-20 | Alternative Energy Suitability Check | energy | off-grid-living | household-energy-planning | assessment | applied from locked rules |
| OG-09 | Household Water Treatment Guide | water | off-grid-living | water-security | guide | applied from locked rules |
| OG-10 | Rainwater Harvesting Planner | water | off-grid-living | rainwater | planner | applied from locked rules |
| OG-B08 | Water Tank Sizing & Placement Guide | water | off-grid-living | household-water-planning | guide | applied from locked rules |
| OG-15 | Warm Home Scorecard | shelter | resilience-planning | heating | assessment | applied from locked rules |
| OG-02 | Household Risk Identifier | general | resilience-planning | planning | worksheet | applied from locked rules |
Foundation, category and type are unchanged from what is live (each foundation re-validated against the resource's text). Wording was read for every resource before answering "does the wording match the role?"; all 21 answer yes, so none stops at owner review. OG-01 and OG-B09 already had components.

## 2 · The eight owner rulings — applied exactly
OG-08, OG-17, OG-19 → off-grid-living · OG-11 → resilience-emergency · OG-13, OG-22 → resilience-planning · OG-21, OG-B10 → planning-implementation. Pinned by `tests/unit/classification-complete.test.ts`. Recorded in `program-components.json` (`classificationsDecided`) and, per resource, in `metadata-review.json`. The advanced-future rule is recorded too, and a test pins that exactly OG-B07 and OG-B12 are advanced-future and that OG-B10 is not.

## 3 · Final exemption-list state
`deployedBeforeClassification` is **EMPTY**, emptied by a script that refuses unless all 21 have a valid component on the record, agreeing review config, and all five answers (`workspace/empty-exemption.mts`), after the strict-schema validation of all 23 records passed and before the full regression. History is kept in `deployedBeforeClassificationWas` (read by no gate). With it empty, all 23 resources prep **READY** (the alignment rule is now enforced for every resource). `scheduledMigration` now reads: prepared, NOT DEPLOYED.

## 4 · The exact demo / protected route defect
`data/resources/home-resilience-scorecard.json` is the public demo placeholder `res-0007` ("DEMONSTRATION ENTRY"). The real OG-01 (`res-1001`) has the same slug. `lib/content/supersession.ts` resolved every such clash **automatically**: it dropped the placeholder and added the alias `res-0007 → res-1001`, which `repository.ts` applied to related links, learning paths, programme days and workshops. So: the placeholder vanished, **programme day 2, day 29 and the demo Household Resilience Assessment resolved to protected OG-01**, and no one had approved that. (There are exactly four clashes today: OG-08, OG-10, OG-13 and OG-01.)

## 5 · Route-separation solution (narrow; no routing rewrite)
**One config file and one resolver change.** `lib/content/route-policy.json` lists every owner-approved clash resolution; the resolver now fails closed:
- **`supersedes`** (placeholder → the one real id): the three resolved-and-live pairs, **grandfathered unchanged** (res-0015→res-1008, res-0016→res-1010, res-0013→res-1013), so no live behaviour changes for OG-08, OG-10 or OG-13.
- **`separateDemo`** (res-0007 → res-1001): the real resource **keeps** `/resources/home-resilience-scorecard/`; the placeholder **stays a placeholder** on `/resources/demo-home-resilience-scorecard/`; **nothing is aliased**.
- **Any other clash, or a pair naming the wrong real id: the build stops** with a message naming the pair. Non-preview builds still stop on any clash. A `demo-` route that is itself taken stops the build.
Alternatives I considered and rejected: (a) *move the real OG-01 to a new route* — changes the deployed protected URL, its record slug and PDF names for no benefit; (b) *drop the placeholder and dangle its references* — breaks days 2/29 and the demo page; (c) *a full /demo/ namespace for every placeholder* — a broad routing rewrite and a change to every demo link. The chosen option touches only clashing placeholders and needs no routing code.
Tests (`route-separation.test.ts`, 17 new; `supersession.test.ts` updated): demo placeholder route stays demo; protected OG-01 route resolves to the protected resource; unlisted clash fails closed; wrong real id fails closed; non-preview still fails; demo cannot inherit protected PDF links and the protected record cannot fall back to demo; programme days 2/29 resolve exactly as configured; unknown route stays missing (`404-page`, no SPA fallback); the Worker has no script and Access fronts the whole hostname. The unauthenticated-Access check is the live probe (`workspace/probe-access3.mjs`, run in Stage 9.71: every route 302 to Access); the staged build changes no Access setting.

## 6 · Programme days 2 and 29
**Preserved as the demo placeholder.** I searched the register, programme architecture and the day records for an approved mapping of either day to OG-01 and found none: the register line "OG-01 … res-0007 (demo) — expected" predicts the route clash, it does not map programme days. In the staged build both days link to `/resources/demo-home-resilience-scorecard/` and neither contains `res-1001`. No implicit promotion.

## 7 · Cover regeneration: 20 resources, 40 PDFs (NZ and AU both rendered)
Candidates were generated into `workspace/candidates/` (deployed PDFs untouched). **Gate** (`workspace/candidate-gate.mts`, every PDF vs its deployed counterpart): same page count and size; per-page text; per-page pixels; cover changed only inside the shadow-panel area. **First pass: 28 of 40 clean, 12 flagged.** The 12 had **word-for-word identical text** but moved page breaks (OG-B07 gained a page, 4→5). Cause, from evidence: Chrome 154.0.8037.98 was installed 2026-10-01; the deployed files were rendered 2026-09-22. The cover cannot cause it (a forced page break ends the cover). Because the brief allows only the cover correction, those 12 are built as the **new cover page + the deployed pages 2..N, byte-for-byte reused** (`workspace/splice-cover.py`; the original page-1-to-N structure, text and PDF title are kept). Splicing initially re-encoded the PDF title; `import:verify-build` caught it; fixed to write the original title bytes; title tokens now identical to deployed for all 12. The 12: OG-19 AU, OG-20 NZ, OG-21 NZ+AU, OG-B07 NZ+AU, OG-22 NZ+AU, OG-25 NZ+AU, OG-26 NZ, OG-27 NZ. **Final gate: ALL 40 PASS** (same page count and size, identical text on every page, identical later pages, cover changed). Market + safety check (`candidate-market.mts`): every candidate has the same other-market hits, the same safety-block counts and the same whole-document text as its deployed copy.

## 8 · Visual QA — all 40 inspected, NZ and AU independently
Contact sheets `workspace/shots/candidates-{NZ,AU}-{1,2}.png`. Centred covers (15 resources) and bottom-anchored covers (5): shadow panel gone; title fully readable and not cut; subtitle preserved; image and lime border unchanged; no clipping or overflow; no page-count drift; no new blank pages; later pages pixel-identical; AU wording present on AU covers ("Australian…", "where you live"), NZ on NZ. OG-B04 and OG-B10 have no cover and were not regenerated.

## 9 · Staged manifest diff (build id normalised; baseline = a build of the exact deployed state)
| | files |
|---|---|
| baseline (deployed state) | 960 |
| staged release | **966** |
| added | **6** — `resources/demo-home-resilience-scorecard/` (index.html, index.txt, 4 payloads) |
| removed | 0 |
| changed | **329** = 40 PDFs + 58 pages + 231 payloads |
| identical | 631 |
**Every one of the 289 changed pages/payloads carries one of the two intended differences** (the re-instated demo placeholder `res-0007`, or the new `programComponent` field); 0 unexplained; no unchanged file carries either. The changed pages are the 49 resource pages (the 21 classified resources, the demo placeholders whose listing payload now includes the re-instated entry, and OG-01), programme days 2 and 29, library, downloads, home, planning-tools, programme, progress, saved. The 40 PDFs are byte-identical to the validated candidates in both `out/` and `private-assets/`; OG-01, OG-B04 and OG-B10 are unchanged.

## 10 · Validation
**701 tests passing** (673 + 4 cover + 17 route + 7 classification) · lint clean · typecheck clean (my own scripts fixed) · `import:verify-prep` verified · `import:verify-build` verified (**23 records · 46 market files · 0 broken links**) · 23 / 23 ready, 0 market problems, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · staged-release QA (`qa-release.mts`) ALL PASS · classification complete for every one of the 23 resources · exemption empty only after validation · live Worker unchanged.

## 11 · Items for the owner before deploying
1. **OG-B07 (locked advanced-future):** Stage 9.65 locked it; your Stage 9.73 definition of advanced-future (integrated whole-property architecture, advanced multi-system design, specialist system architecture, later-stage integration) is narrower, and OG-B07 is a *single-system* (solar) worksheet aimed at what an installer needs. I applied the locked ruling as instructed and recorded the tension in its alignment answer. If you would move it (likely to off-grid-living), say so; it is a one-line change.
2. **OG-22:** applied your ruling (resilience-planning). Its budget summary and procurement phasing sit against the budgeting rule's default; recorded as an owner override.
3. **13 classifications are applications of the locked rules, not explicit rulings** (marked "owner to confirm" in the table).
4. **The three grandfathered supersessions (OG-08, OG-10, OG-13)** keep their previous behaviour. Please reconfirm them under the new separation rule.
5. **Library side effect:** with the placeholder no longer dropped, the protected library lists the demo "Home Resilience Scorecard" card (a DEMONSTRATION entry) next to the real one, as it already lists the other 30 demo placeholders. Say if you want demo cards hidden or retitled in the preview.

## 12 · Exactly what would change
**Git (committed in this stage):** `lib/content/supersession.ts`, `lib/content/repository.ts`, new `lib/content/route-policy.json`, `admin-import/config/metadata-review.json` (21 entries gain `programComponent`, status, 5 alignment answers), `admin-import/config/program-components.json`, `admin-import/config/future-tasks.json`, tests (new `route-separation`, `classification-complete`; updated `supersession`, `program-component`), reports and registers.
**Private, git-ignored:** 21 records in `private-assets/data-resources` gain `programComponent` (OG-02, 08, 09, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 25, 26, 27, B04, B07, B08, B10, B12); **40 PDFs** replaced in `private-assets/resources` (the NZ and AU of OG-02, 08, 09, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 25, 26, 27, B07, B08, B09, B12, under their existing names; OG-02's NZ stays `household-risk-identifier.pdf`). Nothing else.
**Live (on deployment only):** one new Worker version containing the above; today's live site is untouched.

## 13 · Rollback plan
A single Worker version carries the whole release, so **one rollback undoes all three workstreams**: `wrangler rollback 7de9641f-df4c-4cab-8e84-055c0861879d` (deployment history also keeps `db2fd12a…`, `fa23ec74…`, `1922f7ba…`; none removed). File-level rollback: `workspace/backups/private-assets-7de9641f` (the exact pre-release private assets) and `workspace/backups/private-assets-9.73-records` (records as classified, PDFs old); `git revert` of the Stage 9.73 commit restores code and config. The first deploy step would again be a fresh build, verification and an Access probe.

## 14 · Readiness
**Ready for combined deployment on your explicit approval**, after the §11 items. Not deployed.
