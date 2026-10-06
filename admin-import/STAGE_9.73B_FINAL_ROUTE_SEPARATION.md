# Stage 9.73B — final route separation (OG-01, OG-08, OG-10, OG-13) and the deployment gate

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Staged and validated. NOT deployed.** Live Worker unchanged: `7de9641f-df4c-4cab-8e84-055c0861879d`. Classification and the 40 cover PDFs are unchanged from Stage 9.73A (locked). No member wording changed.

## 1–3 · Final demo / protected routing (all four pairs use the same explicit route-policy pattern)
| Protected resource (route) | Demo placeholder (route) | Demo references that stay demo |
|---|---|---|
| **OG-08** Water Storage Calculator `res-1008` — `/resources/water-storage-calculator/` | `res-0015` — `/resources/demo-water-storage-calculator/` | programme **day 9**; demo workshop `demo-water-storage-workshop` handout; demo Water Security Guide (`res-0014`) |
| **OG-10** Rainwater Harvesting Planner `res-1010` — `/resources/rainwater-harvesting-planner/` | `res-0016` — `/resources/demo-rainwater-harvesting-planner/` | programme **day 11**; demo Water Security Guide (`res-0014`) |
| **OG-13** Healthy Home Air Audit `res-1013` — `/resources/healthy-home-air-audit/` | `res-0013` — `/resources/demo-healthy-home-air-audit/` | programme **day 13**; demo Ventilation Basics (`res-0010`) |
| **OG-01** Home Resilience Scorecard `res-1001` — `/resources/home-resilience-scorecard/` | `res-0007` — `/resources/demo-home-resilience-scorecard/` | programme **days 2 and 29**; demo Household Resilience Assessment (`res-0005`) |
For each pair: the protected resource keeps its route, its record and its NZ/AU PDFs and stays behind Access; the demo placeholder stays a demo placeholder, is **not aliased** to anything, is hidden from the library, Start Here, foundations, categories, collections, home, progress, saved and downloads, and stays reachable on its own `demo-` route and through the explicit references above; nothing is deleted or renamed. **No protected PDF is inherited:** a demo keeps its own static demo file path; a protected record has no default file and never names a demo path (test-pinned for all four pairs). The demo `water-basics` learning path (which names `res-0015` and `res-0016`) is replaced as a whole in the preview by the explicit private `water-basics` path, which keeps its real steps (`res-1008, 1010, 1009, 1508`); that is an explicit private file, not an alias, and nothing in the demo path resolves to a protected resource.
**Visible effect of the separation (demo content only):** on programme days 2, 9, 11, 13 and 29 and on the demo workshop, the card and the worksheet block now show the demo placeholder and its own demo file (for example day 11's "Placeholder worksheet … PDF · 41 KB"), instead of the protected resource. Today's deployed days link into protected pages.

## 4 · Programme days — final targets (verified in the built output)
Day 2 → demo OG-01 placeholder (`res-0007`) · Day 29 → demo OG-01 placeholder (`res-0007`) · Day 9 → demo OG-08 placeholder (`res-0015`) · Day 11 → demo OG-10 placeholder (`res-0016`) · Day 13 → demo OG-13 placeholder (`res-0013`). None contains the protected id or a link to the protected route. Pinned by test on the day records and by `qa-release.mts` on the built pages.

## 5 · Final `lib/content/route-policy.json`
```
"supersedes": {}                                  ← EMPTY: nothing is superseded; no grandfathering remains
"separateDemo": { "res-0007": "res-1001",         ← OG-01  (OWNER-APPROVED 9.73/9.73A)
                  "res-0015": "res-1008",         ← OG-08  (OWNER-APPROVED 9.73B)
                  "res-0016": "res-1010",         ← OG-10  (OWNER-APPROVED 9.73B)
                  "res-0013": "res-1013" }        ← OG-13  (OWNER-APPROVED 9.73B)
```
No "pending" or "grandfathered" status remains (test-pinned). Any collision not listed fails the build; an entry naming a different real id fails; a taken `demo-` route fails; non-preview builds fail on any clash. (The supersede mechanism stays in the resolver only so a future collision can be given an explicit written approval.)

## 6 · Classification — locked, unchanged
All 21 previously exempt resources fully classified (Foundation, Programme Component, Category, Type, five answers); OG-B07 = off-grid-living; OG-B12 = advanced-future (the only one); `deployedBeforeClassification` empty. Table: `STAGE_9.73_CLASSIFICATION_TABLE.md`.

## 7 · 40-PDF cover status — locked, unchanged
The same 40 validated PDFs (28 re-rendered, 12 = corrected cover + deployed pages 2–N). Re-verified on this build: gate PASS (page counts and sizes, per-page text, later pages pixel-identical, cover changed only) and market/safety PASS; staged files byte-identical to the candidates.

## 8 · Final staged manifest diff (against a build of the exact deployed code and assets)
960 → **984** files · added **24** · removed **0** · changed **211** = **40 PDFs + 35 pages + 136 payloads** · identical **749**.
- **Added 24** = the four demo routes × 6 files each (`demo-home-resilience-scorecard`, `demo-water-storage-calculator`, `demo-rainwater-harvesting-planner`, `demo-healthy-home-air-audit`); nothing else added.
- **Every difference is attributed at content level** (`workspace/explain-diff.mts`: for each changed page the differing segments are paired and the common prefix/suffix trimmed; every remaining region is classified) — **NO UNEXPLAINED DIFFERENCE**:
  - **40 PDFs** — the corrected covers.
  - **105 page files** — the new `programComponent` metadata (the 21 resource pages plus every page whose data embeds them).
  - **86 page files** — the new byte sizes of the replaced PDFs (strict rule: every number in the differing region is the old or new size of a replaced PDF).
  - **55 files** — approved route separation: programme days 2, 9, 11, 13, 29 and the programme overview, the demo workshop and the workshops overview, and the demo Household Resilience Assessment, Water Security Guide and Ventilation Basics.
  - **9 files** — Next.js build markup noise (head/script tags; an identical-input rebuild changes `library/index.html` the same way).
  - (A file can fall in more than one class.)

## 9–10 · Validation
**708 tests passing** (706 + 2) · lint clean · typecheck clean · `import:verify-prep` verified · `import:verify-build` verified (**23 records · 46 market files · 0 broken links**) · 23 / 23 ready, 0 market problems, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · numeric, fire, electrical, market, price and safety validation clean · route-policy and demo/protected separation tests pass · release QA ALL PASS (all four pairs; programme days and workshop; the demo placeholders appear in 79 files, all in allowed places; every listing page has no demo card; each protected resource listed exactly once) · PDF verification pass · exemption empty · live Worker unchanged.

## 11 · Exactly what would change
**Git (committed with this stage):** `lib/content/route-policy.json` (the four-pair policy), `tests/unit/route-separation.test.ts`, `admin-import/config/future-tasks.json`, this report and the registers. (The code for unlisting, the classification, the metadata and the tests from 9.73 / 9.73A are already committed.)
**Private, git-ignored (already staged):** 21 records gain `programComponent` — OG-02, 08, 09, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 25, 26, 27, B04, B07, B08, B10, B12; **40 PDFs** replaced — the NZ and AU of OG-02, 08, 09, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 25, 26, 27, B07, B08, B09, B12 (OG-02's NZ stays `household-risk-identifier.pdf`).
**Live, only on deployment:** one new Worker version (984 files) containing the above. OG-01, OG-B04 and OG-B10 PDFs and everything else are byte-identical to today's.

## 12 · Rollback state
Live and rollback unchanged: **current `7de9641f-df4c-4cab-8e84-055c0861879d`**, previous `db2fd12a-955e-47c4-b3c9-d174e3da85d8` (earlier `fa23ec74…`, `1922f7ba…`); nothing removed. One Worker version carries all four workstreams, so `wrangler rollback 7de9641f-df4c-4cab-8e84-055c0861879d` undoes the whole release. File backups: `workspace/backups/private-assets-7de9641f` (exact pre-release private assets), `workspace/backups/private-assets-9.73-records`; `git revert` restores code and config.

## 13 · Readiness
**Ready for combined deployment on your explicit approval.** No owner decision is outstanding. Not deployed.
