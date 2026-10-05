# Current status

**As at:** 6 October 2026, after Stage 9.61 (the price presence gate. Nothing deployed).

| | |
|---|---|
| **Protected resources in the private preview** | **21** (all draft) |
| **Worker version** | **`fa23ec74-85d2-4d91-b484-3f037ccbe38b`** |
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

