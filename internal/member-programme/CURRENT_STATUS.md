# Current status

**As at:** 5 October 2026, after Stage 9.55 (Gas / LPG research — nothing built, nothing deployed).

| | |
|---|---|
| **Protected resources in the private preview** | **20** (all draft) |
| **Worker version** | **`776e704a-0f69-4c86-b80f-8b08da7880cb`** |
| **Rollback available** | `0aff3fcd-7080-4ae7-bf28-c5d09414b90a` (19 resources, before OG-13) · private files in `workspace/backups/private-assets-pre-og13` |
| **Tests** | **436 passing** · lint clean · typecheck clean |
| **Next resource** | **not chosen.** Air has one resource and no pathway; the recommended next stage is the Gas / LPG research that unblocks OG-17 and OG-B09 — see `NEXT_ACTIONS.md` |
| **Last deployment** | Stage 9.54, 5 October 2026: **OG-13 Healthy Home Air Audit as resource #20** |
| **Last report** | `admin-import/STAGE_9.55_GAS_LPG_RESEARCH.md` (research only — nothing built or deployed) |

**A note on the test count.** 317 at Stage 9.39 → 324 at Stage 9.40 (OG-10 and supersession) → 328 at Stage 9.41 (the
OG-10 ruling tests) → 361 at Stage 9.43 (treatment gates and OG-09) → 368 at Stage 9.44 (the OG-08 exemption and the
rename) → 376 at Stage 9.45 (OG-B08) → 377 at Stage 9.46 → 390 at Stage 9.47 → 404 at Stage 9.48 → 410 at Stage 9.49 → 417 at Stage 9.50 (numeric blocking) → 429 at Stage 9.52 (the Air blocks and the ratio
claim type) → 434 at Stage 9.53 (OG-13 and owner ruling 1) → **436** at Stage 9.54 (the category revert and the
block selection). Nothing was removed.

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

Each has an NZ and an AU PDF: **40 market files**, 0 broken internal links.

## Controls, last checked at Stage 9.54

| Control | State |
|---|---|
| Cloudflare Access on all traffic | **on** — every probe redirects (302) to the Access login |
| All real resources draft | **yes**, 20/20 |
| NZ/AU routing | **working** — no market, no download; NZ gets NZ, AU gets AU |
| Real member files in public GitHub | **none** |
| `--real` | **refused** |
| Public/demo build | **unchanged** — 30 demonstration resources |
| Rollback snapshots | retained in `workspace/backups/` |

## Current blockers

| Blocker | What it holds up | Needed |
|---|---|---|
| **Gas / LPG guidance part-researched** | OG-B09, and any gas-appliance content | **Stage 9.55 read NZ in full and 5 of 8 AU jurisdictions live.** Still needed: TAS, ACT and NT read live, four search-only AU pages re-read, and an owner decision on how an AU body can be shaped when the jurisdictions contradict each other. **OG-17 looks like a detector false positive and may not need this at all** |
| **Diesel guidance not researched** | diesel generator or heating content | verified NZ + AU guidance |
| **Grants and rebates not researched** | OG-16 | current NZ programmes and AU state/territory schemes |
| **Consents and approvals not researched** | OG-B11 | NZ council consents, AU state/territory approvals |
| ~~OG-09 and the OG-08 block question~~ | — | **both resolved at Stage 9.44**: OG-09 is deployed as the Household Water Treatment Guide, and OG-08 carries an audited, resource-specific exemption that lapses the moment it teaches treatment |
| ~~OG-02's fire-block requirement~~ | — | **resolved at Stage 9.47**: an audited, hazard-identification-only exemption covering exactly "Fire in the home" and "Bushfire risk area", which lapses on any fire teaching |
| ~~Water Basics learning path~~ | — | **resolved at Stage 9.47**: the private path override is built, tested and deployed; the public demonstration path is untouched |
| ~~One unsourced live figure~~ | — | **resolved at Stage 9.49**: OG-08's AU sentence now says "Get Ready Queensland advises storing drinking water for three days", and the numeric scan is **zero findings** across all 19 resources |
| ~~Two OG-13 rulings outstanding~~ | — | **both answered at Stage 9.53.** Bleach is removed from both markets' mould wording, and `healthy-home-air` was added to the air taxonomy. OG-13 is prepared and verified. Three one-line preferences remain, none of them blocking: the category overlap with `healthy-home-checks`, whether OG-13 keeps `indoor-combustion` (it carries approved gas/LPG wording into an Air resource), and whether the never-mix caution returns — all three in `STAGE_9.53_OG13_PREPARED.md` §11 |
| **Unlabelled Victorian servicing interval** | correctness of 5 live resources | the AU `carbon-monoxide` and `indoor-combustion` blocks say gas heaters should be checked "at least every two years", which is Victoria's figure written as if Australian. NSW says annually; WA says two years unless the appliance is over ten years old; Queensland publishes no interval. An owner ruling is needed — see `STAGE_9.55_GAS_LPG_RESEARCH.md` §16 |
| **US and CA markets** | publishing outside NZ/AU | their own safety review; **non-publishable until then** |

## Known, accepted limitations

- **Market-specific resources have no single download.** A worksheet with per-market files deliberately offers no
  market-less file, so a programme day's worksheet link or a workshop handout is omitted rather than offering the
  wrong market's file. Members reach the resource from its own page.
- **Demo placeholders still fill most of the library.** the public build is **30** demonstration placeholders and no real resources; 28 of those routes are still
  unsuperseded in the preview. Real resources supersede them
  one route at a time (see `SAFETY_REGISTER.md` → route supersession).
