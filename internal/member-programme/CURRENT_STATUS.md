# Current status

**As at:** 7 October 2026, after **Stage 9.81** (OG-04 rewrite draft for owner review; not rendered, staged or deployed; dmin-import/STAGE_9.81_OG04_REWRITE_DRAFT.md; live unchanged) and **Stage 9.80** (audit of OG-04 only; no live change; dmin-import/STAGE_9.80_OG04_AUDIT.md) and **Stage 9.79 — DEPLOYED: OG-03 live as protected resource #24.** LIVE NOW: 24 protected resources, 48 market files, 992 files, Worker `89333107-7c0a-4bdb-8229-f2b5241a9e05` (100%); rollback target `e63141a1-380a-4770-a125-9fd7a15d0bdb` (then `7de9641f…` → `db2fd12a…` → `fa23ec74…` → `1922f7ba…`). The "LIVE (unchanged since Stage 9.74)" and "STAGED, NOT DEPLOYED" statements below are superseded by this line. Previously: **Stage 9.78B** (the existing `planning-tools` collection completed: OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B10 added beside OG-03, and the four demo placeholders res-0005/0006/0008/0009 hidden from the protected Planning Tools listing only; Planning Tools now lists 7 real resources; no component, PDF, copy or route-policy change; staged, not deployed; 750 tests; report `admin-import/STAGE_9.78B_PLANNING_TOOLS_COLLECTION.md`), **Stage 9.78A** (OG-03 added to the existing `planning-tools` collection so Planning Tools lists it; staged, not deployed; 739 tests; report `admin-import/STAGE_9.78A_OG03_DISCOVERY.md`) and **Stage 9.78**. **LIVE (unchanged since Stage 9.74):** 23 protected resources, 46 market files, Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb`, rollback chain retained (see the 9.74 rows below). **STAGED, NOT DEPLOYED:** OG-03 Household Spending Capacity Check as protected resource #24 (`res-1003`, draft; record and two byte-identical approved PDFs in `private-assets/`; staged build 24 records / 48 market files / 0 broken links / Bucket C 0; 736 tests; no unexplained difference in the staged manifest diff); report `admin-import/STAGE_9.78_OG03_STAGED.md`. Earlier OG-03 history: audit (9.75), rewrite draft (9.76, 9.76A), render (9.77). Rows marked **9.74** describe the live state; the rows below the line are older snapshots kept for history.

| | |
|---|---|
| **9.74 · Protected resources** | **23** (all draft) · **46** market files · 0 broken links · Bucket C 0 |
| **9.74 · Worker version** | **`e63141a1-380a-4770-a125-9fd7a15d0bdb`** live (984 files) |
| **9.74 · Rollback** | **`7de9641f-df4c-4cab-8e84-055c0861879d`** (immediate); also retained `db2fd12a-955e-47c4-b3c9-d174e3da85d8`, `fa23ec74-85d2-4d91-b484-3f037ccbe38b`, `1922f7ba-a0b3-4a7b-ba01-593b3df6a160` |
| **9.74 · Tests** | **708 passing** · lint clean · typecheck clean |
| **9.74 · Classification** | all 23 resources carry Foundation, Programme Component, Category, Type and the five alignment answers; `deployedBeforeClassification` is **empty**; OG-B07 = off-grid-living, OG-B12 = advanced-future |
| **9.74 · Route policy** | `supersedes` empty; `separateDemo` = OG-01, OG-08, OG-10, OG-13 (all owner-approved); an unlisted collision fails the build; demo placeholders are unlisted but reachable; programme days 2, 9, 11, 13, 29 stay on the demo placeholders |
| **9.74 · Covers** | the 20 affected resources' 40 PDFs carry the corrected shared cover (no shadow panel) |
| **9.74 · Deferred work** | none: `classify-the-21-live-resources`, `shared-cover-cleanup` and `demo-protected-route-separation` are all DEPLOYED |
| **9.74 · Next** | owner chooses the next resource (claims-first audit first); see `NEXT_ACTIONS.md` |

---

*Older snapshot (Stage 9.61 and earlier):*

| | |
|---|---|
| *(9.61 snapshot)* Protected resources | 21 (all draft) |
| *(9.61 snapshot)* Worker version | `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |
| **Rollback available** | `1922f7ba-a0b3-4a7b-ba01-593b3df6a160` (20 resources, before OG-17) · private files in `workspace/backups/private-assets-1922f7ba` |
| **Tests** | **512 passing** · lint clean · typecheck clean |
| **Next resource** | **OG-B09**, once the gas blocks exist. Stage 9.62 is recommended as the Gas/LPG block architecture — the research is complete and unbuilt, and parts of it are already dated |
| **Last deployment** | Stage 9.60, 6 October 2026: **OG-17 Solid Fuel Heating Planner as resource #21** |
| **Last report** | `admin-import/STAGE_9.61_PRICE_PRESENCE_GATE.md` (validation architecture — nothing deployed) |

**A note on the test count.** 317 at Stage 9.39 → 324 at Stage 9.40 (OG-10 and supersession) → 328 at Stage 9.41 (the
OG-10 ruling tests) → 361 at Stage 9.43 (treatment gates and OG-09) → 368 at Stage 9.44 (the OG-08 exemption and the
rename) → 376 at Stage 9.45 (OG-B08) → 377 at Stage 9.46 → 390 at Stage 9.47 → 404 at Stage 9.48 → 410 at Stage 9.49 → 417 at Stage 9.50 (numeric blocking) → 429 at Stage 9.52 (the Air blocks and the ratio
claim type) → 434 at Stage 9.53 (OG-13 and owner ruling 1) → 436 at Stage 9.54 (the category revert and the
block selection) → 441 at Stage 9.56 (the Australian gas wording) → 456 at Stage 9.57 (the gas detector) →
467 at Stage 9.58 (safety enforcement) → 475 at Stage 9.59 (OG-17's claims) → 477 at Stage 9.60 (OG-17's
currency and metadata) → **512** at Stage 9.61 (the price gate). Nothing was removed.

## The 19 deployed resources

| # | Code | Title | Foundation |
|---|---|---|---|
| 1 | OG-02 | Household Risk Identifier | general |
| 2 | OG-08 | Water Storage Calculator | water |
| 3 | OG-09 | **Household Water Treatment Guide** (renamed from Water Filtration Comparison Matrix) | water |
| 4 | OG-10 | Rainwater Harvesting Planner | water |
| 5 | OG-11 | 30-Day Pantry Builder | food |
| 6 | OG-15 | Warm Home Scorecard | shelter |
| 7 | OG-18 | Solar Power 101 Workbook | energy |
| 8 | OG-19 | Battery Backup Planner | energy |
| 9 | OG-20 | Alternative Energy Suitability Check | energy |
| 10 | OG-21 | Home Energy & Shelter Upgrade Plan | shelter |
| 11 | OG-22 | Resilience Product Wishlist | general |
| 12 | OG-25 | Project Support Brief Template | general |
| 13 | OG-26 | 3-Tier Budget Planner | general |
| 14 | OG-27 | 90-Day Implementation Roadmap | shelter |
| 15 | OG-B04 | Monthly Planning Challenge Template | general |
| 16 | OG-B07 | Solar Planning Deep Worksheet | energy |
| 17 | OG-B08 | **Water Tank Sizing & Placement Guide** | water |
| 18 | OG-B10 | 90-Day Implementation Roadmap (Advanced) | general |
| 19 | OG-B12 | Off-Grid System Architecture Planner | general |
| 20 | **OG-13** | **Healthy Home Air Audit** — the first Air resource | air |
| 21 | **OG-17** | **Solid Fuel Heating Planner** | shelter |

Each has an NZ and an AU PDF: **42 market files**, 0 broken internal links.

## Controls, last checked at Stage 9.60

| Control | State |
|---|---|
| Cloudflare Access on all traffic | **on** — every probe redirects (302) to the Access login |
| All real resources draft | **yes**, 21/21 |
| NZ/AU routing | **working** — no market, no download; NZ gets NZ, AU gets AU |
| Real member files in public GitHub | **none** |
| `--real` | **refused** |
| Public/demo build | **unchanged** — 30 demonstration resources |
| Rollback snapshots | retained in `workspace/backups/` |

## Current blockers

| Blocker | What it holds up | Needed |
|---|---|---|
| **Gas / LPG blocks not built** | **OG-B09 only** | **Research complete (Stage 9.56); the detector now reads teaching rather than counting the word (Stage 9.57).** What remains is drafting blocks A–E with a non-numeric Australian core plus labelled state overrides, and **no shared Australian leak sentence**. **OG-17 is released — it needed no gas wording and no exemption** |
| **Diesel guidance not researched** | diesel generator or heating content | verified NZ + AU guidance |
| **Grants and rebates not researched** | OG-16 | current NZ programmes and AU state/territory schemes |
| **Consents and approvals not researched** | OG-B11 | NZ council consents, AU state/territory approvals |
| ~~OG-09 and the OG-08 block question~~ | — | **both resolved at Stage 9.44**: OG-09 is deployed as the Household Water Treatment Guide, and OG-08 carries an audited, resource-specific exemption that lapses the moment it teaches treatment |
| ~~OG-02's fire-block requirement~~ | — | **resolved at Stage 9.47**: an audited, hazard-identification-only exemption covering exactly "Fire in the home" and "Bushfire risk area", which lapses on any fire teaching |
| ~~Water Basics learning path~~ | — | **resolved at Stage 9.47**: the private path override is built, tested and deployed; the public demonstration path is untouched |
| ~~One unsourced live figure~~ | — | **resolved at Stage 9.49**: OG-08's AU sentence now says "Get Ready Queensland advises storing drinking water for three days", and the numeric scan is **zero findings** across all 19 resources |
| ~~Two OG-13 rulings outstanding~~ | — | **both answered at Stage 9.53.** Bleach is removed from both markets' mould wording, and `healthy-home-air` was added to the air taxonomy. OG-13 is prepared and verified. Three one-line preferences remain, none of them blocking: the category overlap with `healthy-home-checks`, whether OG-13 keeps `indoor-combustion` (it carries approved gas/LPG wording into an Air resource), and whether the never-mix caution returns — all three in `STAGE_9.53_OG13_PREPARED.md` §11 |
| ~~Unlabelled Victorian servicing interval~~ | — | **corrected and deployed at Stage 9.56** (it affected 6 resources, not 5 — OG-13 joined at Stage 9.54). The Australian wording now carries no interval and points the member at their own state or territory's regulator. A test checks every prepared AU file, not just the config |
| ~~`requiredSafety` is computed from the legacy source~~ | — | **resolved at Stage 9.58.** Enforcement now reads the migrated member-facing output, per market, before blocks are injected. The legacy source became `sourceSafetyTopics` — migration evidence — and any topic that leaves must be accounted for by a carried block, an owner-approved exemption, or a written disposition, or preparation fails. 8 of the 20 live resources had such a removal; all 8 were already accounted for |
| ~~A price has no automatic gate~~ | — | **closed at Stage 9.61.** Every member-facing price now needs a recorded disposition — REMOVE, CURRENT-SOURCE-REQUIRED or OWNER-APPROVED-LIVE-PRICE — or preparation fails. Numeric blocking still excludes `currency` and the content flag still matches only `%` and `°C`; the price gate is what covers it. First run: **0 true prices** across 42 files, and **55 legacy prices** recorded as removed across 7 migrations |
| **US and CA markets** | publishing outside NZ/AU | their own safety review; **non-publishable until then** |

## Known, accepted limitations

- **Market-specific resources have no single download.** A worksheet with per-market files deliberately offers no
  market-less file, so a programme day's worksheet link or a workshop handout is omitted rather than offering the
  wrong market's file. Members reach the resource from its own page.
- **Demo placeholders still fill most of the library.** the public build is **30** demonstration placeholders and no real resources; 28 of those routes are still
  unsuperseded in the preview. Real resources supersede them
  one route at a time (see `SAFETY_REGISTER.md` → route supersession).

## Stage 9.62 (6 October 2026) - gas architecture built, nothing deployed

Five gas blocks built (PENDING OWNER APPROVAL), AU leak response FAILS CLOSED, 551 tests passing, Worker unchanged (fa23ec74), 21 resources unchanged. Report: admin-import/STAGE_9.62_GAS_ARCHITECTURE.md.


## Stage 9.62A (6 October 2026) - gas owner review and hardening, nothing deployed

Tests 576, lint/typecheck clean. Tightened AU common-core rule (4+ jurisdictions or national source); AU unflued and AU leak FAIL CLOSED; required-gas-block-set mechanism (all five gas blocks pending owner approval, so nothing releases); annual/spelled-number detection; block-owned numeric claims scoped to their block. Report: admin-import/STAGE_9.62A_GAS_OWNER_REVIEW.md. Worker unchanged (fa23ec74).


## Stage 9.62C (6 October 2026) - OG-27 ruling, exact block ownership, gas wording for owner review

587 tests; 21/21 ready, 42/42 files, Bucket C 0. Numeric scan now credits a figure to a safety block only inside that block's own content. OG-27 '15 minutes every Sunday' registered as an owner-defined schedule (OG-27 only). Five gas blocks still PENDING OWNER APPROVAL. Report: admin-import/STAGE_9.62C_OWNER_REVIEW.md. Worker unchanged.


## Stage 9.62D (6 October 2026) - gas AU approval state recorded

AU wording OWNER-APPROVED for gas-and-lpg-general, gas-cylinder-safety, gas-installation-and-servicing; AU unflued and AU leak fail closed (drafted leak wording unserved). NZ wording of all five and the three NZ numeric claims remain PENDING OWNER APPROVAL. 588 tests. Nothing deployed. Report: admin-import/STAGE_9.62D_GAS_CLOSEOUT.md.


## Stage 9.63 (6 October 2026) - NZ gas wording and numeric claims approved; OG-B09 claims-first prepared

NZ wording of all five gas blocks and the three NZ numeric claims OWNER-APPROVED. 599 tests; 21/21 ready, 42/42, Bucket C 0. Numeric scanner now detects insulation R-values. OG-B09 audited (not rendered, no PDFs): gas-and-lpg-general only; owner decisions pending. Report: admin-import/STAGE_9.63_OGB09_CLAIMS_FIRST.md.


## Stage 9.64 (6 October 2026) - OG-B09 owner rulings and migrated draft prepared

OG-B09 configured (approved-copy + metadata) and verified as a draft: gas-and-lpg-general + solid-fuel-heating, 0 R-values/prices/percentages, ready in both markets. NOT rendered, no PDFs, NOT a protected resource. 610 tests. Report: admin-import/STAGE_9.64_OGB09_DRAFT.md.


## Stage 9.64A (6 October 2026) - OG-B09 repositioned as a resilience checklist

Title: Resilient Heating & Insulation Upgrade Checklist. Heating table reframed (fuel/energy, electricity dependency, outage consideration); related resources proposed; batteries-and-electrical now detector-required and carried (owner review). 619 tests. Not rendered, not deployed. Report: admin-import/STAGE_9.64A_POSITIONING.md.


## Stage 9.64B (6 October 2026) - programme components; OG-B09 finalised

Programme-component classification added (off-grid-living, resilience-planning, resilience-emergency, planning-implementation, advanced-future); alignment rule enforced before a new resource is ready. OG-B09 = resilience-planning, ready to render (not rendered, not deployed). 633 tests. Report: admin-import/STAGE_9.64B_PROGRAM_COMPONENTS.md.


## Stage 9.65 (6 October 2026) - OG-B09 rendered and QA'd; component rulings recorded

OG-B09 PDFs (NZ + AU, 8 pages each, comparison on its own landscape section) rendered into workspace/prep/OG-B09, 69/69 QA checks, verify-prep passed. NOT yet protected resource #22; not deployed. Budgeting and system-architecture overlaps ruled; live-21 classification scheduled for the next normal deployment (exemption kept). 637 tests. Report: admin-import/STAGE_9.65_OGB09_RENDER.md.


## Stage 9.66 (6 October 2026) - OG-B09 DEPLOYED as protected resource #22

Worker db2fd12a-955e-47c4-b3c9-d174e3da85d8; rollback fa23ec74-85d2-4d91-b484-3f037ccbe38b retained. 22 protected resources, 44 market files, 637 tests, Bucket C 0. Status draft behind Access; public/demo untouched. classify-the-21-live-resources still scheduled for the next normal deployment. Report: admin-import/STAGE_9.66_OGB09_DEPLOYED.md.


## Stage 9.67 (6 October 2026) - OG-01 Home Resilience Scorecard: claims-first audit (no migration)

Audit complete; 644 tests; 22/22, 44/44, Bucket C 0. Numeric scanner now reads 'N+ unit'. Owner decisions pending (STAGE_9.67 section 13). Report: admin-import/STAGE_9.67_OG01_AUDIT.md.


## Stage 9.68 (6 October 2026) - OG-01 migrated DRAFT prepared

Owner rulings applied: Start Here; 1-10 per question, two per foundation, subtotals /20, no /100; Part A / Part B; numbers removed (not registered); electrical + fire blocks. Draft ready (both markets), not rendered, not deployed. Future task recorded: context-aware duration-of-supply claim type. 659 tests; 22/22, 44/44, Bucket C 0. Report: admin-import/STAGE_9.68_OG01_DRAFT.md.


## Stage 9.68A (6 October 2026) - OG-01 final copy corrections; Safety Notes placement

Questions reworded, bands approved, member flow reordered; electrical + fire blocks now in a labelled Safety Notes section via an opt-in placement marker (emergency box stays top, disclaimer end; default unchanged; missing marker = held, never dropped). 673 tests; 22/22, 44/44, Bucket C 0. Ready to render (not rendered). Report: admin-import/STAGE_9.68A_OG01_FINAL_COPY.md.

