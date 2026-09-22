# Current status

**As at:** 23 September 2026, after Stage 9.43 (treatment architecture built, OG-09 rebuilt for review — no change to
the live preview).

| | |
|---|---|
| **Protected resources in the private preview** | **17** (all draft) |
| **Worker version** | **`d993cb64-676a-46bc-80eb-f4c9850fb0ea`** |
| **Rollback available** | `a65a1ef1-feea-4e89-9d96-c16b8db40336` (16 resources) |
| **Tests** | **361 passing** · lint clean · typecheck clean |
| **Next resource** | **OG-09** — rebuilt and prepared, **waiting on owner content approval** before deployment as #18 |
| **Last deployment** | Stage 9.41, 23 September 2026: OG-10 Rainwater Harvesting Planner (#17) |
| **Last report** | `admin-import/STAGE_9.43_OG09_TREATMENT_ARCHITECTURE.md` (built and prepared — nothing deployed) |

**A note on the test count.** 317 at Stage 9.39 → 324 at Stage 9.40 (OG-10 and supersession) → 328 at Stage 9.41 (the
OG-10 ruling tests) → **361** at Stage 9.43 (23 treatment-gate tests, 7 OG-09 tests, 3 gate-inside-prep tests).
Nothing was removed.

## The 17 deployed resources

| # | Code | Title | Foundation |
|---|---|---|---|
| 1 | OG-02 | Household Risk Identifier | general |
| 2 | OG-08 | Water Storage Calculator | water |
| 3 | OG-10 | Rainwater Harvesting Planner | water |
| 4 | OG-11 | 30-Day Pantry Builder | food |
| 5 | OG-15 | Warm Home Scorecard | shelter |
| 6 | OG-18 | Solar Power 101 Workbook | energy |
| 7 | OG-19 | Battery Backup Planner | energy |
| 8 | OG-20 | Alternative Energy Suitability Check | energy |
| 9 | OG-21 | Home Energy & Shelter Upgrade Plan | shelter |
| 10 | OG-22 | Resilience Product Wishlist | general |
| 11 | OG-25 | Project Support Brief Template | general |
| 12 | OG-26 | 3-Tier Budget Planner | general |
| 13 | OG-27 | 90-Day Implementation Roadmap | shelter |
| 14 | OG-B04 | Monthly Planning Challenge Template | general |
| 15 | OG-B07 | Solar Planning Deep Worksheet | energy |
| 16 | OG-B10 | 90-Day Implementation Roadmap (Advanced) | general |
| 17 | OG-B12 | Off-Grid System Architecture Planner | general |

Each has an NZ and an AU PDF: **34 market files**, 0 broken internal links.

## Controls, last checked at Stage 9.41

| Control | State |
|---|---|
| Cloudflare Access on all traffic | **on** — every probe redirects (302) to the Access login |
| All real resources draft | **yes**, 17/17 |
| NZ/AU routing | **working** — no market, no download; NZ gets NZ, AU gets AU |
| Real member files in public GitHub | **none** |
| `--real` | **refused** |
| Public/demo build | **unchanged** — 30 demonstration resources |
| Rollback snapshots | retained in `workspace/backups/` |

## Current blockers

| Blocker | What it holds up | Needed |
|---|---|---|
| **Gas / LPG guidance not researched** | OG-17, OG-B09, and any gas-appliance content | verified NZ + AU gas guidance, then owner approval |
| **Diesel guidance not researched** | diesel generator or heating content | verified NZ + AU guidance |
| **Grants and rebates not researched** | OG-16 | current NZ programmes and AU state/territory schemes |
| **Consents and approvals not researched** | OG-B11 | NZ council consents, AU state/territory approvals |
| **OG-09 content approval** | deploying OG-09 as #18 | owner approval of the rebuilt teaching content (Stage 9.43 report), the title decision, and the OG-08 detector decision |
| **OG-08 requires the water-treatment block on re-preparation** | re-preparing or re-deploying OG-08 (the live copy is untouched) | owner decision: add the block, or record that the migrated text teaches no treatment |
| **US and CA markets** | publishing outside NZ/AU | their own safety review; **non-publishable until then** |

## Known, accepted limitations

- **Market-specific resources have no single download.** A worksheet with per-market files deliberately offers no
  market-less file, so a programme day's worksheet link or a workshop handout is omitted rather than offering the
  wrong market's file. Members reach the resource from its own page.
- **Demo placeholders still fill most of the library.** 29 remain in the public build; real resources supersede them
  one route at a time (see `SAFETY_REGISTER.md` → route supersession).
