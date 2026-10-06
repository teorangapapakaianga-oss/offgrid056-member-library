# Stage 9.73A — final owner rulings applied; route audit; staged release rebuilt (NOT deployed)

> **Superseded in part by `STAGE_9.73B_FINAL_ROUTE_SEPARATION.md`:** the owner ruled **separate** for OG-08, OG-10 and OG-13, so the "pending owner ruling" statuses and the three `supersedes` entries described below no longer exist; `route-policy.json` now separates all four pairs. Final counts: 708 tests; 984 files; 24 added, 211 changed.

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Staged and validated. NOT deployed.** Live Worker unchanged: `7de9641f-df4c-4cab-8e84-055c0861879d` (rollback `db2fd12a-955e-47c4-b3c9-d174e3da85d8`). No member wording changed. Supersedes the parts of `STAGE_9.73_COMBINED_RELEASE_STAGED.md` noted below.

## 1 · Final complete 21-resource classification
Full table with all five alignment answers: `STAGE_9.73_CLASSIFICATION_TABLE.md` (regenerated; 0 "owner to confirm", 0 missing). Foundation / category / type unchanged from live.
| Code | Resource | Foundation | Programme Component | Category | Type | Basis |
|---|---|---|---|---|---|---|
| OG-08 | Water Storage Calculator | water | off-grid-living | water-storage | worksheet | owner ruling (9.73) |
| OG-17 | Solid Fuel Heating Planner | shelter | off-grid-living | heating | planner | owner ruling (9.73) |
| OG-19 | Battery Backup Planner | energy | off-grid-living | backup-energy | planner | owner ruling (9.73) |
| OG-11 | 30-Day Pantry Builder | food | resilience-emergency | pantry-resilience | worksheet | owner ruling (9.73) |
| OG-13 | Healthy Home Air Audit | air | resilience-planning | healthy-home-checks | assessment | owner ruling (9.73) |
| OG-21 | Home Energy & Shelter Upgrade Plan | shelter | planning-implementation | household-resilience | planner | owner ruling (9.73) |
| OG-B10 | 90-Day Implementation Roadmap (Advanced) | general | planning-implementation | planning | planner | owner ruling (9.73) |
| OG-22 | Resilience Product Wishlist | general | resilience-planning | planning | worksheet | **explicit owner override of the budgeting rule** |
| **OG-B07** | Solar Planning Deep Worksheet | energy | **off-grid-living** | solar | worksheet | **owner correction (9.73A)** |
| OG-B12 | Off-Grid System Architecture Planner | general | advanced-future | planning | planner | locked (kept) |
| OG-26 | 3-Tier Budget Planner | general | planning-implementation | planning | planner | locked |
| OG-27 | 90-Day Implementation Roadmap | general | planning-implementation | planning | planner | owner-confirmed (9.73A) |
| OG-25 | Project Support Brief Template | general | planning-implementation | planning | template | owner-confirmed (9.73A) |
| OG-B04 | Monthly Planning Challenge Template | general | planning-implementation | planning | planner | owner-confirmed (9.73A) |
| OG-18 | Solar Power 101 Workbook | energy | off-grid-living | solar | workbook | owner-confirmed (9.73A) |
| OG-20 | Alternative Energy Suitability Check | energy | off-grid-living | household-energy-planning | assessment | owner-confirmed (9.73A) |
| OG-09 | Household Water Treatment Guide | water | off-grid-living | water-security | guide | owner-confirmed (9.73A) |
| OG-10 | Rainwater Harvesting Planner | water | off-grid-living | rainwater | planner | owner-confirmed (9.73A) |
| OG-B08 | Water Tank Sizing & Placement Guide | water | off-grid-living | household-water-planning | guide | owner-confirmed (9.73A) |
| OG-15 | Warm Home Scorecard | shelter | resilience-planning | heating | assessment | owner-confirmed (9.73A) |
| OG-02 | Household Risk Identifier | general | resilience-planning | planning | worksheet | owner-confirmed (9.73A) |
Totals: off-grid-living 9 · planning-implementation 6 · resilience-planning 4 · resilience-emergency 1 · advanced-future 1.

## 2 · OG-B07 = off-grid-living — confirmed
Record, review config and `classificationsDecided` all say off-grid-living; its alignment answers were rewritten (an advanced **single-system** solar resource; difficulty alone is not advanced-future). **OG-B12 stays advanced-future** and is now the only advanced-future resource (pinned by test).

## 3 · Ten rulings recorded
OG-27, OG-25, OG-B04 (planning-implementation); OG-18, OG-20, OG-09, OG-10, OG-B08 (off-grid-living); OG-15, OG-02 (resilience-planning) — each recorded in `classificationsDecided`, and its status now reads "OWNER RULING 2026-10-07 (Stage 9.73A)". No "owner to confirm" remains anywhere (test-pinned). OG-22 recorded as an explicit owner override.

## 4 · Exemption list
`deployedBeforeClassification` is **EMPTY** and stays empty. All 23 resources prep READY with the alignment rule enforced for every one; every one has Foundation, Programme Component, Category, Type and all five answers (test: `classification-complete.test.ts`); none depends on the old exemption.

## 5–7 · Route collision audits (no live behaviour changed; entries kept only so today's behaviour is preserved until you rule)
There are exactly four collisions. **Common facts for all three below:** the real resource currently **replaces** the demo placeholder on the shared route; the real record has **no default file** (market files only), so no demo download is inherited by it and no protected PDF is exposed through any demo reference; every demo reference below is itself DEMONSTRATION content (programme days titled "Placeholder action", the workshop titled "DEMO:"); so today **demo programme content walks a member into protected resource pages**, the same defect as OG-01.

**OG-08 — Water Storage Calculator (`res-1008`) vs demo `res-0015` Water Storage Calculator**
- Shared route `/resources/water-storage-calculator/`. Policy today: supersede (Stage 9.39).
- Demo references (5): demo resource `res-0014` Water Security Guide → related; **programme day 9** (resource card + worksheet; no worksheet file); the demo `water-basics` learning path file → steps (already replaced in the preview by the explicit private `water-basics` path, whose steps are real ids — unaffected either way); demo workshop `demo-water-storage-workshop` → downloads (handout falls back to the demo file; no protected file).
- Inherited PDF/download: none. The static demo PDF `resources/water/water-storage-calculator.pdf` still ships, unreferenced.
- Reason to preserve: continuity of the private water pathway and the demo programme walking into a working tool. Reason to separate: the principle — demo content must not silently lead into protected content.
- **Recommended ruling: SEPARATE.**

**OG-10 — Rainwater Harvesting Planner (`res-1010`) vs demo `res-0016`**
- Route `/resources/rainwater-harvesting-planner/`. Policy today: supersede (Stage 9.41).
- Demo references (4): demo `res-0014` → related; **programme day 11** (card + worksheet, no file); the demo `water-basics` path (replaced by the private path, unaffected).
- Inherited PDF/download: none (static demo PDF ships unreferenced).
- **Recommended ruling: SEPARATE** (same reasoning).

**OG-13 — Healthy Home Air Audit (`res-1013`) vs demo `res-0013`**
- Route `/resources/healthy-home-air-audit/`. Policy today: supersede (Stage 9.54).
- Demo references (3): demo `res-0010` Ventilation Basics → related; **programme day 13** (card + worksheet, no file). No learning path or workshop.
- Inherited PDF/download: none.
- **Recommended ruling: SEPARATE.**

**What SEPARATE would change when deployed (live behaviour, only after your ruling):** the demo placeholders return on `/resources/demo-water-storage-calculator/`, `/demo-rainwater-harvesting-planner/`, `/demo-healthy-home-air-audit/`, hidden from every listing; programme days 9, 11, 13, the demo workshop, and demo resources `res-0014` and `res-0010` resolve to the demo placeholders again; the protected pages, PDFs and the private `water-basics` path are unchanged. **The alternative (SUPERSEDE)** needs a written approval per entry. Until you rule, the three entries stay in `route-policy.json` with status **"AUDITED — PENDING OWNER RULING, not approved by being grandfathered"** (test-pinned: no supersession may claim approval). **OG-01 (the fourth) is owner-approved: separate.**

## 8 · Route policy rule (implemented)
Every collision needs an explicit entry in `lib/content/route-policy.json`; an unlisted collision fails the build; an entry naming a different real id fails; a taken `demo-` route fails; non-preview builds fail on any clash. Tests: `route-separation.test.ts` (now 20), `supersession.test.ts`.

## 9 · OG-01 demo card — hidden
The separated placeholder is **unlisted** (code: `isUnlisted`, listings use `getSummaries()` which excludes it; explicit references use `{ includeUnlisted: true }`): hidden from the library, Start Here, foundations, categories, collections (incl. planning-tools), home, progress, saved and downloads. Related auto-suggestions never pick it. It stays generated and reachable at `/resources/demo-home-resilience-scorecard/`, and programme days 2 and 29 and the demo Household Resilience Assessment still point at it; nothing deleted or renamed. **Proof (built output, `qa-release.mts`):** the library lists the real `res-1001` exactly once; the demo scorecard appears in exactly 26 files, all in the allowed places (its own route, the programme overview and days 2 and 29, the demo Household Resilience Assessment); 12 listing/page checks show no demo card. (The programme overview lists days 2 and 29 and so shows their demo resource: that is the programme's explicit demo content, as you ruled.)

## 10 · 40-PDF cover candidates — approved, unchanged
Same validated method: 28 fully regenerated; the 12 Chrome-reflow PDFs (OG-19 AU, OG-20 NZ, OG-21 NZ+AU, OG-B07 NZ+AU, OG-22 NZ+AU, OG-25 NZ+AU, OG-26 NZ, OG-27 NZ) = corrected cover + unchanged deployed pages 2–N. Re-verified on the final build: same page count, identical text on every page, title metadata token identical to deployed, same safety-block counts and other-market hits, identical later pages (gate and market/safety check re-run: PASS for all 40). PDFs byte-identical in `out/` and `private-assets/`.

## 11 · Final staged manifest diff (build id normalised; baseline = a build of the exact deployed state)
960 → **966** files · added **6** (`resources/demo-home-resilience-scorecard/`) · removed **0** · changed **175** = **40 PDFs + 27 pages + 108 payloads** · identical **785**. (Down from 329 changes in 9.73 because the demo card is no longer listed on every page.) Attribution: every changed non-PDF file carries `programComponent` or the demo scorecard's explicit references, **except** (a) the downloads page (5 files), which differs only because it shows the **new byte sizes of the 40 regenerated PDFs** (verified: 40/40 new sizes present, 0 old), and (b) `library/index.html`, which differs only by **Next.js build-to-build markup noise** (verified: rebuilding identical input twice changes exactly this one file). No unexplained change.

## 12–13 · Validation
**706 tests passing** (701 + 5) · lint clean · typecheck clean · `import:verify-prep` verified · `import:verify-build` verified (**23 records · 46 market files · 0 broken links**) · 23 / 23 ready, 0 market problems, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · release QA ALL PASS · fire, electrical, market, price and safety validation clean · live Worker unchanged.

## 14 · Exact remaining owner decisions
1. **Rule on OG-08, OG-10 and OG-13 separately** — separate (recommended) or supersede with a written approval. (Whatever you choose, the deploy will carry it.)
2. **Explicit approval to deploy** the combined release (the OG-01 separation and demo-card hiding, the classification of all 21 resources, and the 40 cover PDFs), with rollback `7de9641f…` retained.
That is all: OG-B07, the ten confirmations, OG-22, the OG-01 demo card and the cover method are settled.

## 15 · Readiness
**Ready for deployment on your approval, once item 1 is ruled** (if you want the three separated, I will change the three policy entries, rebuild, re-run the tests and the manifest diff, and stop for your deploy word). Not deployed.
