# OG-08 — WATER STORAGE CALCULATOR · DEPLOYED TO PRIVATE PREVIEW (#16)

**Status:** OG-08 is live in the private preview as the **16th** protected draft resource, and the first resource in
the Water foundation.

- **Route:** it takes over `/resources/water-storage-calculator/` **inside the private preview only**, through a new
  reusable override. Real resources supersede demo placeholders there; every other route collision fails the build.
- **Public/demo build:** unchanged, and proven with a separate production build.
- **Worker version:** `a65a1ef1`
- **Rollback:** `61d2acd0`

**Date:** 22 September 2026

---

## 1. Private-preview override implementation

**New module:** `lib/content/supersession.ts`. It's a small pure function, `resolveRouteCollisions(resources,
{ preview })`, applied inside the content repository.

**The rule:**

| Collision on one canonical route | Private preview (`OG056_INCLUDE_DRAFTS=1`) | Any other build |
|---|---|---|
| **real + demo placeholder** | **the real resource supersedes the placeholder**. The placeholder is dropped, and its id becomes an alias of the real id. | **build fails** (a real record should never be there) |
| **real + real** | **build fails** | **build fails** |
| **placeholder + placeholder** | **build fails** | **build fails** |
| no collision | unchanged | unchanged |

**References follow the alias.** The repository (the only code that reads `data/`) rewrites references to a
superseded placeholder:

- related resources and pack items
- learning-path steps
- programme-day resources and worksheets
- workshop related resources and handouts

**The result is one card, one route and one Downloads entry.**

**Validation.** `tools/validate-content.ts`:

- **Sees the resolved list,** so duplicate-slug and route-collision checks work unchanged.
- **Treats drafts as reachable only in the preview build,** because superseding references now point at a draft.
  Production is unchanged.
- **Now accepts a market-specific worksheet** (`marketFiles`, no single `fileUrl`) as openable.

**This change was caught by the build itself.** The first preview build **failed closed** on programme day 9's
worksheet. Nothing was deployed, and all 48 staged private files were removed.

**Not a one-off:** nothing about OG-08 is hard-coded. The same rule will handle OG-10
(`rainwater-harvesting-planner`), OG-01 (`home-resilience-scorecard`) and OG-13 (`healthy-home-air-audit`).

**Tests (`tests/unit/supersession.test.ts`, 7):**

- a real resource supersedes a placeholder in preview, with the alias mapped
- file order doesn't matter
- a real resource plus a placeholder outside the preview fails
- **real vs real fails closed**, in preview and outside it
- placeholder vs placeholder fails
- no collision means no change
- **the public data still has the placeholder, once, and no real records**

## 2. Public / demo isolation

A plain **production** `npm run build` (no drafts, no private staging) gave:

| Check | Result |
|---|---|
| Content | **30 resources, all demo/placeholder**; validation passed |
| `/resources/water-storage-calculator/` | **the demo placeholder**: *"DEMONSTRATION ENTRY"* text, demo PDF linked and present (`/resources/water/water-storage-calculator.pdf`) |
| OG-08 market PDFs | **0** |
| Any `*.NZ.pdf` / `*.AU.pdf` | **0** |
| Any real record (`legacyCode`) | **0** |
| `private-assets/` tracked in git | 0 |
| `*.NZ/AU.pdf` tracked in git | 0 |

**The public demo data files weren't changed.** Afterwards the preview was rebuilt, so `out/` matches what's live
again, and it verified.

## 3. Final calculator formulas

| Row | NZ | AU | Label |
|---|---|---|---|
| 3-Day Emergency | **People × 3 L × 3 days** | **People × 10 L** | **OFFICIAL EMERGENCY BASELINE** (NZ: Get Ready; AU: for example Get Ready Queensland) |
| 7-Day Disruption | People × 3 L × 7 days | People × 10 L × 7 ÷ 3 | NZ: **OFFGRID056 EXTENDED RESILIENCE PLANNING**. AU: **OFFGRID056 PLANNING EXTRAPOLATION BASED ON THE 3-DAY BASELINE** |
| 14-Day Supply | People × 3 L × 14 days | People × 10 L × 14 ÷ 3 | the same |
| 30-Day Longer-Term Goal | People × 3 L × 30 days | People × 10 L × 30 ÷ 3 | the same |

**The notes under the table:**

- **NZ:** the extended rows are *"OffGrid056 extended resilience planning, not official NZ requirements"*.
- **AU:** they are *"an OffGrid056 planning extrapolation based on the 3-day baseline, not an official Australian
  daily allowance"*, and the state or territory may advise more.
- **Both:** *"Round each total up to the next whole litre."*

**A reference implementation is tested:** `lib/tools/water-storage.ts`.

| 4 people | 3 days | 7 days | 14 days | 30 days |
|---|---|---|---|---|
| NZ | 36 L | 84 L | 168 L | 360 L |
| AU | 40 L | 94 L (93.3 rounded up) | 187 L (186.7 rounded up) | 400 L |

**The AU three-day figure is never 30 L**, so there is no "10 L per person per day". This is tested.

**Usable water:** capacity × how full it is. *"Count only water that is safe to drink, or that you will make safe
before drinking — see Storing drinking water."*

## 4. Gap / surplus behaviour

| Where | Wording |
|---|---|
| Column | **"Gap (L) = Need − Have, never below 0"** |
| Reality Check | *"If you have any gap in your 3-day official baseline, close it first. **If you already have more than you need, your gap is 0 L — the extra is a surplus (Have − Need).**"* |

**Tested** (`storageGap`):

| Need | Have | Result |
|---|---|---|
| 40 | 60 | gap 0 L, surplus 20 L |
| 40 | 25 | gap 15 L, surplus 0 |
| 40 | 40 | 0 / 0 |

**No negative gap is possible.**

## 5. Final NZ result

| Check | Result |
|---|---|
| File | `water-storage-calculator.NZ.pdf` |
| Pages | 6 |
| Title | Water Storage Calculator — OffGrid056 |
| Emergency numbers | **111 only** |
| Formulas | all four NZ formulas (**3 L per person per day × days**); "EXTENDED RESILIENCE PLANNING" ×3 |
| AU wording | none: no 10 L formula, "EXTRAPOLATION", Get Ready Queensland, "state or territory", boiling |
| Bleach | once, **inside the approved NZ block only** (stored tap water) |
| Gap / surplus | wording present |
| Removed content | none of: 50–70%, >50 L, container sizes, 6–12 months, "Dark + cool + sealed", Day/Week navigation, OG codes |
| Drinking-water block | whole on page 6 |
| Tokens · VERIFY · browser-error page | none |
| Changes | all 20 applied |
| Draft | yes |

## 6. Final AU result

| Check | Result |
|---|---|
| File | `water-storage-calculator.AU.pdf` |
| Pages | 6 |
| Title | Water Storage Calculator — OffGrid056 |
| Emergency numbers | **000 + 112 only** |
| Baseline | **10 L per person for 3 days** represented correctly; **no "10 litres … per person per day"** |
| Formulas | all four AU formulas; the "PLANNING EXTRAPOLATION BASED ON THE 3-DAY BASELINE" label ×3; *"not an official Australian daily allowance"* |
| NZ content | **no bleach**, and no "civil defence", 3 L-per-day wording, "EXTENDED RESILIENCE PLANNING", 111 or New Zealand/NZ |
| Other checks | the same as NZ: gap/surplus wording, removed content, block whole, changes, draft |

**Checks run:**

- `import:verify-prep`: 32/32 files pass.
- All 16 resources READY.
- `import:verify-build`: **16 records, 32 files, 0 broken links**.
- The OG-08 PDFs in the build are **byte-identical** to the checked ones.
- **All 30 earlier PDFs are byte-identical** to the previous live build.

## 7. Deployment result

**Success.**

**Private-preview routing, checked in the exact build before deploying:**

| Check | Result |
|---|---|
| `/resources/water-storage-calculator/` | **OG-08**: Draft, Beginner, "20 min", its own description, no OG code |
| Water Storage Calculator entries | **one card each** in Downloads and on the Water foundation page. **No demo-PDF link anywhere.** |
| Market routing | before a market is chosen: **no file**. NZ: **the NZ file only**. AU: **the AU file only**. |
| Internal links that pointed at the placeholder | resolve to **OG-08**: the Water Security Guide's related links and programme day 9 → `/resources/water-storage-calculator/` |
| The demo workshop's handout | **omitted**, because OG-08 has no single, market-less file. This is fail-safe; members reach OG-08 from its own page. |

**After deploying**, every unauthenticated request was redirected (302) to the Access login. That included `/`,
`/downloads/`, the OG-08 page, both OG-08 PDFs, and the demo PDF path.

**Records:** all 16 are draft.

## 8. Worker version

**`a65a1ef1-feea-4e89-9d96-c16b8db40336`**

## 9. OG-08 route

`/resources/water-storage-calculator/` (behind Access; OG-08 in the private preview, the demo placeholder in the
public build)

## 10. Protected resource count

**16** draft resources: OG-02, **OG-08**, OG-11, OG-15, OG-18, OG-19, OG-20, OG-21, OG-22, OG-25, OG-26, OG-27,
OG-B04, OG-B07, OG-B10, OG-B12.

## 11. Tests

**317 passed** (305 + 12). Lint and typecheck clean.

**The twelve new tests:**

- **7 supersession tests,** including real-vs-real failing closed and the public placeholder intact.
- **4 calculator tests:** NZ formula; AU formula and rounding (never "per day"); the official-vs-planning labels; the
  gap/surplus rule.
- **1 OG-08 wording test:** no negative gap, and the surplus named.

**Also updated:** the OG-08 label test now checks both markets' planning labels (×3 each) and the "not an official
Australian daily allowance" wording.

**Other status:**

| Check | Result |
|---|---|
| `--real` | refused |
| OG-08 files in git | 0 |

## 12. Rollback confirmation

**`61d2acd0`** (15 resources) is in the deployment history. Its private files are in
`workspace/backups/private-assets-61d2acd0` (45 files), and its 30 PDFs are byte-identical to the new build's.

**Rolling back also removes OG-08's supersession,** because the placeholder record is untouched in `data/`. The new
live state is backed up in `workspace/backups/private-assets-a65a1ef1` (48 files).

## 13. Next recommended water resource

**OG-10, Rainwater Harvesting Planner** (water / planner).

**Why OG-10:**

- It's the natural next step: OG-08's own Reality Check says to cover stored water before planning rainwater tanks.
- Its safety needs are already approved: **drinking water**, and likely **working at height** for gutters and roofs.
- Its slug (`rainwater-harvesting-planner`) collides with a demo placeholder, which the new override now handles with
  no special case.
- It will need care over **collection rules**: NZ councils; AU states and territories. No national rule should be
  claimed.

**Held until later:**

- **OG-09, Filtration Comparison Matrix:** it teaches **treatment**, which needs its own NZ/AU treatment research
  beyond the approved storage block.
- **OG-B08, Water Tank Sizing & Placement Guide:** better after OG-10, since tank sizing builds on collection.

**Stopped. OG-09, OG-10 and OG-B08 not prepared.**
