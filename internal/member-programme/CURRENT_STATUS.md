# Current status

**As at:** 23 September 2026, after Stage 9.44 (OG-09 deployed as the Household Water Treatment Guide).

| | |
|---|---|
| **Protected resources in the private preview** | **18** (all draft) |
| **Worker version** | **`ac0d053a-8abd-4965-8bfe-3cae8ea943a5`** |
| **Rollback available** | `d993cb64-676a-46bc-80eb-f4c9850fb0ea` (17 resources) |
| **Tests** | **368 passing** · lint clean · typecheck clean |
| **Next resource** | **OG-B08 — Water Tank Sizing & Placement Guide** (not started), or **OG-13 Healthy Home Air Audit** |
| **Last deployment** | Stage 9.44, 23 September 2026: Household Water Treatment Guide (OG-09) (#18) |
| **Last report** | `admin-import/STAGE_9.44_OG09_DEPLOYMENT.md` |

**A note on the test count.** 317 at Stage 9.39 → 324 at Stage 9.40 (OG-10 and supersession) → 328 at Stage 9.41 (the
OG-10 ruling tests) → **361** at Stage 9.43 (23 treatment-gate tests, 7 OG-09 tests, 3 gate-inside-prep tests).
Nothing was removed.

## The 18 deployed resources

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
| 17 | OG-B10 | 90-Day Implementation Roadmap (Advanced) | general |
| 18 | OG-B12 | Off-Grid System Architecture Planner | general |

Each has an NZ and an AU PDF: **36 market files**, 0 broken internal links.

## Controls, last checked at Stage 9.44

| Control | State |
|---|---|
| Cloudflare Access on all traffic | **on** — every probe redirects (302) to the Access login |
| All real resources draft | **yes**, 18/18 |
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
| ~~OG-09 and the OG-08 block question~~ | — | **both resolved at Stage 9.44**: OG-09 is deployed as the Household Water Treatment Guide, and OG-08 carries an audited, resource-specific exemption that lapses the moment it teaches treatment |
| **US and CA markets** | publishing outside NZ/AU | their own safety review; **non-publishable until then** |

## Known, accepted limitations

- **Market-specific resources have no single download.** A worksheet with per-market files deliberately offers no
  market-less file, so a programme day's worksheet link or a workshop handout is omitted rather than offering the
  wrong market's file. Members reach the resource from its own page.
- **Demo placeholders still fill most of the library.** 29 remain in the public build; real resources supersede them
  one route at a time (see `SAFETY_REGISTER.md` → route supersession).
