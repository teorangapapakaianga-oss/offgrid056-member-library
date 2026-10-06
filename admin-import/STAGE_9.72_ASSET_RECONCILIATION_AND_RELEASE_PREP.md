# Stage 9.72 — deployment asset reconciliation + next-release prep

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Analysis and planning only. Nothing deployed, nothing rolled back, no live resource or metadata changed, no rollback removed.** Live: Worker `7de9641f-df4c-4cab-8e84-055c0861879d`, rollback `db2fd12a-955e-47c4-b3c9-d174e3da85d8` (earlier `fa23ec74…`, `1922f7ba…`).

## 1. What Wrangler's "563" is — and the corrected reading of 562 → 563

**Evidence.** In Wrangler 4.135.0's own source (`cli.js`): the upload manifest has one entry per file in `out/` (path → content hash). Wrangler posts the manifest; Cloudflare replies with the **content hashes it does not already hold**; `numberFilesToUpload` is the number of those hashes; and the success line prints `Uploaded <numberFilesToUpload> files (<manifestEntries − numberFilesToUpload> already uploaded)`.

So in `Uploaded 563 files (397 already uploaded)`:
- **563 is not the size of the deployment.** It is the number of distinct file contents Cloudflare did not already have.
- **563 + 397 = 960 = every file in `out/`.** That is the real total (counted: 960 files).
- In my Stage 9.66 and 9.71 write-ups I called 562/563 "assets". That was a misreading; I should have said "uploaded". Corrected here.

**The true totals (uploaded + already-uploaded, from the deploy log history):** Stage 9.66 (#22): 562 + 396 = **958 files**. Stage 9.71 (#23): 563 + 397 = **960 files**. The deployment grew by exactly **+2 files**.

**Why only +2, and what they are.** I rebuilt the pre-OG-01 state (OG-01's three private files set aside, then restored byte-identically) and diffed it against the current build by path and SHA-256:
| | prev (22) | curr (23) |
|---|---|---|
| files | 958 | 960 |
| added | | `resources/home-resilience-scorecard.NZ.pdf`, `…AU.pdf` (the +2), plus 3 `_next/static/<buildId>/_*Manifest.js` |
| removed | | the 3 `_next/static/<previous buildId>/…` files |
| same path, content changed | | 142 `.html` + 699 `.txt` (every page: see below) |
So **OG-01 added exactly two new paths**.

**Why OG-01's page, its text payloads and its Start Here entry are not "new files".** The public demo content already contains a **placeholder** with the same route: `data/resources/home-resilience-scorecard.json`, `res-0007`, "DEMONSTRATION ENTRY". Under the owner-approved supersession rule (Stage 9.38, `lib/content/supersession.ts`), in the private preview a real resource **replaces the placeholder on its route**. The route `/resources/home-resilience-scorecard/` therefore already existed (as the placeholder); OG-01 replaced the content of its 6 files in place. The built page carries `res-1001` and no `res-0007` anywhere in `out/`.

**Why the "uploaded" number barely moves between deploys.** Each Next.js build embeds a new build id in every page, so all 841 pages/payloads change content each build; those (about 560 distinct contents) are re-uploaded **every** deploy whatever the resource change. Of the 960 files, 283 share identical content with another file (677 distinct contents), which is why distinct-hash counts are lower than file counts. 562 → 563 is that churn plus the two PDFs, not a resource count. Independent check on my rebuild: 562 distinct contents absent from the previous build.

## 2. Baseline — confirmed, nothing changed
23 / 23 protected · 46 / 46 market files · **677 tests passing** · Bucket C = 0 · lint, typecheck clean · `import:verify-prep` and `import:verify-build` verified (23 records, 46 market files, 0 broken links) · 23/23 ready, 0 market problems, 0 findings, 0 flags, 0 price findings. `private-assets` (excluding OG-01's 3 files) hashes identically to before every stage in this series. Worker `7de9641f…` is the current deployment; `db2fd12a…` is the previous one and is still listed.

## 3. Deployment manifest (`out/`, generated, `workspace/deploy-manifest.mts`)
- **960 files**, 43.5 MB, 677 distinct contents.
- **71 PDFs:** 46 protected market PDFs (23 × NZ + AU; the pilot OG-02's NZ file is named `household-risk-identifier.pdf`, no `.NZ` suffix — a legacy name, counted by the record) + 25 demo placeholder PDFs.
- **56 resource route directories:** 23 protected (real) + 33 demo placeholder routes. Protected routes hold 138 files (23 `.html`, 115 `.txt` payloads).
- By kind: 548 other route pages/payloads · 295 resource page sets · 71 PDFs · 33 `_next` build assets · 13 root/static (icons, fonts, robots, a zip).
- **Exact OG-01 additions vs the previous deployed build:** 2 new paths (the two PDFs). Content replaced in place (placeholder → real): 6 files under `resources/home-resilience-scorecard/` (`index.html`, `index.txt`, `__next._full.txt`, `__next._tree.txt`, `__next.resources.$d$slug.__PAGE__.txt`, `__next.resources/$d$slug/__PAGE__.txt`). The demo placeholder's own download `resources/general/home-resilience-scorecard.pdf` (41,280 bytes) is still shipped, unreferenced, exactly as the other superseded placeholders' PDFs are.

## 4. Nothing missing — checked from the built artifacts (`workspace/verify-og01-artifacts.mts`: ALL PASS)
Page `index.html` + 4 payload files present · NZ and AU PDFs byte-identical across `out/`, `private-assets/` and the approved render · payload carries `res-1001`, title, general / resilience-planning / getting-started / assessment / beginner / 20 / draft / `["start-here"]`, NZ and AU market files and no default file, not a placeholder · all six related ids present and all six routes exist · Start Here (html and payload) and the library list OG-01.
**Caveat, stated plainly:** `out/` is now a **rebuild** of the same source (I rebuilt twice for the comparison), so its HTML/payloads carry a different build id from the bytes actually deployed. The files that matter for content (the two PDFs, the record data) are byte-identical; I cannot byte-compare to the live copy because live reads are behind Access (I did not sign in). The Worker itself was not redeployed.

## 4a. Corrections to Stage 9.71 (owner should know)
1. My "563 assets" note was a misreading (§1).
2. "No public/demo changes" was true of **repo files** but incomplete for the **deployed preview**: deploying OG-01 replaced the placeholder `res-0007` on its route, and, by the same Stage 9.38 rule, three references to `res-0007` now resolve to OG-01 in the preview: **programme day 2** and **day 29** (`data/programme/days`) and the demo placeholder **Household Resilience Assessment** (`related`). Preview-only; the public repository is unchanged. Same behaviour as every earlier real resource that shared a placeholder's route. Please confirm that pointing days 2 and 29 at the new Home Resilience Scorecard is what you want.

## 5. Next normal deployment — exact scope (PREP ONLY; neither task started)
**A. `classify-the-21-live-resources`** — all 21 in `deployedBeforeClassification`: OG-26, OG-11, OG-B10, OG-27, OG-20, OG-19, OG-21, OG-02, OG-09, OG-B04, OG-B12, OG-25, OG-10, OG-22, OG-B07, OG-18, OG-15, OG-08, OG-B08, OG-13, OG-17. (OG-01 and OG-B09 already carry components.) **Important:** emptying the list makes the five-question alignment record mandatory for each of the 21; a missing answer holds the resource at `NEEDS_OWNER_METADATA`. So the work is: component + the other four alignment answers for each, in `metadata-review.json` (config text, not member wording), plus `programComponent` on each private record.
**B. `shared-cover-cleanup`** — 20 resources, 40 PDFs (NZ + AU); see §7.

## 6. Proposed Program Component classifications — PROPOSALS ONLY (no metadata changed)
Locked values and rulings applied (budgeting → planning-implementation; basic/intermediate solar, battery, water, energy stay off-grid-living). Each foundation shown is unchanged.
| Code | Resource | Foundation | Proposed component | Basis | Confidence |
|---|---|---|---|---|---|
| OG-26 | 3-Tier Budget Planner | general | **planning-implementation** | already decided; budget allocation | decided |
| OG-27 | 90-Day Implementation Roadmap | general | **planning-implementation** | roadmap / schedule | high |
| OG-25 | Project Support Brief Template | general | **planning-implementation** | project brief, installer/supplier planning | high |
| OG-B04 | Monthly Planning Challenge Template | general | **planning-implementation** | recurring planning/tracking framework | high |
| OG-B12 | Off-Grid System Architecture Planner | general | **advanced-future** | already decided | decided |
| OG-B07 | Solar Planning Deep Worksheet | energy | **advanced-future** | already decided | decided |
| OG-18 | Solar Power 101 Workbook | energy | **off-grid-living** | entry-level solar stays off-grid-living | high |
| OG-20 | Alternative Energy Suitability Check | energy | **off-grid-living** | helps choose independent systems | high |
| OG-09 | Household Water Treatment Guide | water | **off-grid-living** | water treatment is named in the definition | high |
| OG-10 | Rainwater Harvesting Planner | water | **off-grid-living** | water capture | high |
| OG-B08 | Water Tank Sizing & Placement Guide | water | **off-grid-living** | tank siting/storage | high |
| OG-15 | Warm Home Scorecard | shelter | **resilience-planning** | warm-home scorecard (named) | high |
| OG-02 | Household Risk Identifier | general | **resilience-planning** | household assessment, ranks priorities (same role as OG-01) | high |
| OG-08 | Water Storage Calculator | water | off-grid-living **or** resilience-emergency | storage sizing vs emergency water | **OWNER RULING** |
| OG-11 | 30-Day Pantry Builder | food | resilience-emergency **or** off-grid-living | stored food vs rotation system | **OWNER RULING** |
| OG-13 | Healthy Home Air Audit | air | resilience-planning **or** resilience-emergency | household assessment incl. smoke alarms | **OWNER RULING** |
| OG-17 | Solid Fuel Heating Planner | shelter | off-grid-living **or** resilience-planning | solid-fuel is "off-grid heating/fuel systems"; but OG-B09 (heating comparison) is resilience-planning | **OWNER RULING** |
| OG-19 | Battery Backup Planner | energy | off-grid-living **or** resilience-planning | ruling keeps intermediate battery off-grid-living; resilience-planning's definition names "backup power" | **OWNER RULING** |
| OG-21 | Home Energy & Shelter Upgrade Plan | shelter | planning-implementation **or** resilience-planning | its output is a roadmap with budgets/timelines (ruling), but "phased upgrades" is in resilience-planning | **OWNER RULING** |
| OG-22 | Resilience Product Wishlist | general | planning-implementation **or** resilience-planning | prioritised purchases/allocation | **OWNER RULING** |
| OG-B10 | 90-Day Implementation Roadmap (Advanced) | general | planning-implementation **or** advanced-future | roadmap (ruling) but "advanced" with dependency mapping | **OWNER RULING** |
Recommended defaults where a ruling is needed (my lean, not a decision): OG-08 off-grid-living, OG-11 resilience-emergency, OG-13 resilience-planning, OG-17 off-grid-living, OG-19 off-grid-living, OG-21 planning-implementation, OG-22 planning-implementation, OG-B10 planning-implementation. Two further risks: any "does the wording match the role?" answer of **no** for a live resource stops that resource for owner review (it would mean changing member-facing wording), and no wording is assumed to change.

## 7. Shared cover cleanup — exact set (deployed NZ covers inspected by eye, `workspace/shots/cover-sheet.png`)
- **Centred covers, panel visibly stops mid/at the title — 15:** OG-02, OG-08, OG-09, OG-10, OG-11, OG-13, OG-15, OG-17, OG-18, OG-19, OG-20, OG-21, OG-B07, OG-B08, **OG-B09 (#22)**.
- **Bottom-anchored covers carrying the bad shadow (dark block upper right, clipped by the page edge; the title itself is not cut) — 5:** OG-22, OG-25, OG-26, OG-27, OG-B12.
- **No cover page, unaffected — 2:** OG-B04, OG-B10.
- **Already clean:** OG-01 (rendered after the fix).
→ **20 resources, 40 PDFs** (AU assumed the same: same CSS; confirm by eye in the regeneration QA). Keep OG-02's NZ filename `household-risk-identifier.pdf`.

## 8. Proposed combined release sequence (nothing run)
1. **Owner rulings** on the 8 uncertain classifications and on the day 2 / day 29 pointer (§4a). Freeze: no other change in the release.
2. **Backup and baseline:** copy `private-assets` to `workspace/backups/private-assets-7de9641f` (as in earlier releases); record the 23 live PDF hashes and the out/ manifest; confirm Worker `7de9641f…`.
3. **Classification (config + records only):** `programComponent` plus the four other alignment answers for all 21 in `metadata-review.json`; `programComponent` on each private record; re-prep all 23 with the exemption still in place; any "wording does not match role" → stop for owner. Only when every one is valid, **empty `deployedBeforeClassification`** and update the tests that pin it; re-prep must stay 23/23 ready.
4. **PDF regeneration (candidate folder, not over the deployed files):** render the 40 PDFs from the prep HTML (cover fix already in the pipeline). **Gates per PDF:** same page count as deployed; **text identical to the deployed PDF page by page** (`pdf-textdiff`); `import:verify-prep`; no new clipping. Any pagination or text difference → stop and diagnose; no wording may change.
5. **Visual QA:** contact sheet of all 40 covers plus full-page review of anything that moved; cover panel check on each.
6. **Stage:** replace the 40 private PDFs and the 21 records (backup retained); `build:preview`; `import:verify-build` (23 records, 46 market files, 0 broken links); byte check that every staged PDF equals its approved candidate; manifest diff against the baseline — the only expected differences are 40 PDFs, the 21 records' pages/payloads and build-id churn.
7. **Full regression:** lint, typecheck, full tests, `import:verify-prep`, numeric, market, safety, price; 23/23, 46/46, Bucket C = 0.
8. **Deploy** only on explicit owner approval: one `wrangler deploy`; a single Worker version carries everything, so one rollback to `7de9641f…` undoes the whole release.
9. **Post-deploy QA:** Access probe (every route 302, none 200), uploaded-tree checks (hashes, routes, counts), owner spot-check behind Access for cover and metadata.
10. **Rollback retention:** keep `7de9641f…`, `db2fd12a…`, `fa23ec74…`, `1922f7ba…`; remove nothing. Mark both tasks complete **only after** deployment; update the registers.

## 9–11. Validation and readiness
**677 tests passing** · lint clean · typecheck clean (two typing errors in my own new workspace scripts were found by typecheck and fixed) · `import:verify-prep` and `import:verify-build` verified · numeric, market, safety and price validation clean · **Bucket C = 0** · no live resource changed (private-assets baseline hash identical; Worker unchanged). **Readiness:** ready for you to rule on §6 and §4a; the release can then be prepared as one controlled deployment. Neither task is started.
