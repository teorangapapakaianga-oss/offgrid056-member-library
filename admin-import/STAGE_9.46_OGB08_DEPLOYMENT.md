# WATER TANK SIZING & PLACEMENT GUIDE (OG-B08) · DEPLOYED TO PRIVATE PREVIEW (#19)

**Status:** live in the private preview as the **19th** protected draft resource, and the **fourth** water resource —
the water pathway is now complete: need → collection → treatment → tanks.

- **Worker version:** `7eee1f48-82c3-483f-8d0b-4b2d4c47e586`
- **Route:** `/resources/water-tank-sizing-and-placement-guide/` — new route, no placeholder, no collision
- **Rollback:** `ac0d053a-8abd-4965-8bfe-3cae8ea943a5` (18 resources)
- **Date:** 23 September 2026 · **Stage:** 9.46

---

## 1. Push confirmation

`git push origin main` → `1434a31..5ed343e  main -> main`. **`origin/main` = `5ed343e643ad109d7146ce4b86a6945b6a529505`**,
carrying `admin-import/STAGE_9.45_OGB08_PREPARED.md` and the preparation changes (OG-B08's 15 copy changes, its
metadata, and the eight regression tests). Local and remote are identical.

## 2. Metadata confirmation

| Field | Value | Basis |
|---|---|---|
| title | **Water Tank Sizing & Placement Guide** | owner-approved, unchanged |
| resourceType · foundation · category | **guide · water · household-water-planning** | owner-approved |
| difficulty | **intermediate** | **OWNER-APPROVED / INFERRED** |
| estimatedTime | **25 minutes** | **OWNER-APPROVED / INFERRED** |
| status | **draft** | as deployed |
| description | unchanged from Stage 9.45 | owner-approved |
| relatedResources | `res-1008` → `res-1010` → `res-1009` | owner-approved; OG-B12 not added |

Every status line in `metadata-review.json` now reads `owner-approved 2026-09-23 (Stage 9.46)`.

## 3. Fire-and-emergency exemption

**Approved and recorded** — resource-specific, **zero-mention**, fails closed. Tests prove it holds on the migrated
copy and lapses on *fire egress*, *bushfire*, *smoke alarm* and *evacuation* wording alike.

**One correction to Stage 9.45, and one detector fix.** Stage 9.45 said the legacy source "tripped the fire detector
three times". The three fire phrases are real — *"Good for bushfire zones"*, *"Rural; fire resistance"* and *"Not
blocking fire egress paths"* — but **"bushfire" was invisible to the detector**, because the pattern required a word
boundary before "fire". The requirement was actually raised by the audit text counting the PDF and HTML copies
together. Under ruling 2 an exemption must lapse on *any* fire wording, so the detector now also matches **bushfire**
and **wildfire**. Without that fix, a future edit reintroducing *"suits bushfire zones"* would have slipped past the
exemption.

**That fix has one consequence, and it needs your decision (not this stage's):** with "bushfire" now counted,
**OG-02 Household Risk Identifier** — live since Stage 9.13 — requires the `fire-and-emergency` block on
re-preparation. Its audit:

| Layer | Fire wording | Reading |
|---|---|---|
| Legacy source | "Fire" (risk-matrix row) and "□ Bushfire risk area" | two checklist items in a **risk identifier**: the member ticks hazards they face |
| Migrated own text | the same two | unchanged by migration |
| Injected blocks | none | — |

**It names hazards; it teaches no fire safety** — the same shape as OG-08's water-treatment case. **The deployed
OG-02 is untouched and its PDFs were not re-rendered.** The choice is yours: record an OG-02-specific, audited
exemption with `allowedMentions` limited to those two checklist items, or leave OG-02 blocked from re-preparation
until fire guidance is researched and a real block exists. **No exemption was created**, because this stage's rulings
did not cover OG-02.

## 4. NZ PDF result

| Check | Result |
|---|---|
| File | `water-tank-sizing-and-placement-guide.NZ.pdf` · **6 pages** |
| PDF title | Water Tank Sizing & Placement Guide — OffGrid056 |
| Emergency numbers | **111 only** |
| NZ wording | MBIE; structural engineer for in-ground tanks; building consent; stand over 30cm and under one metre; qualified plumber; licensed electrical worker; overflow contained or to stormwater |
| AU wording | **none** — no NSW, WA Health, AS/NZS 4020, 000, SES, licensed electrician, "state or territory" |
| Fire wording | **none** |
| Invented setback | **none** — no "3 m", and no `N m` figure outside MBIE's stand heights |
| Blocks | Storing drinking water · Stay off the roof |
| Removed claims | no lifespans, no `$` costs, no crane, no bushfire suitability, no "Hygienic", no "1,000L standard", no Tier 3, no Action Plan Plus, no Week 3 cover |
| Tokens · VERIFY · legacy code | none |
| Status | draft |

## 5. AU PDF result

| Check | Result |
|---|---|
| File | `water-tank-sizing-and-placement-guide.AU.pdf` · **6 pages** |
| Emergency numbers | **000 (and 112) only** |
| AU wording | NSW Health throughout, labelled; AS/NZS 4020 and AS 2070 as NSW Health states them; 1 mm screens **as an example**; licensed plumber; licensed electrician; council, state and territory |
| NZ wording | **none** — no MBIE, NIWA, Taumata Arowai, HE10148, 111, Civil Defence, building consent, "electrical worker", "New Zealand" |
| Fire wording · invented setback | **none** |
| Everything else | as NZ: blocks, removed claims, no tokens, draft |

## 6. Treatment-gate result

**0 findings in both markets**, on the finished files including their injected blocks. OG-B08 teaches no treatment: no
topic mentions, no teaching signals, and no registry claim needed beyond the storage block's own. It states that tank
water is not automatically safe and points at the Household Water Treatment Guide. **No treatment exemption exists,
because none is needed.**

## 7. Deployment result

**Success.** Every unauthenticated probe returns **302** to the Access login: `/`, `/downloads/`,
`/foundations/water/`, the OG-B08 page and **both** OG-B08 PDFs.

**Before deploying:** `import:prep` 19/19 · `import:verify-prep` **38/38 files** · `import:verify-build` **19 records,
38 market files, 0 broken internal links** · staged PDFs byte-identical to the verified ones · **all 36 earlier PDFs
unchanged** · routing checked locally (no market → **no download**; NZ → NZ; AU → AU; one card on the Water foundation
page).

## 8. Worker version

**`7eee1f48-82c3-483f-8d0b-4b2d4c47e586`**

## 9. Protected resource count

**19** draft resources (38 market files): OG-02, OG-08, OG-09, OG-10, OG-11, OG-15, OG-18, OG-19, OG-20, OG-21,
OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B07, **OG-B08**, OG-B10, OG-B12. All 19 private records are `status: draft`.

## 10. Tests

**377 passing** (376 → +1: the fire-exemption lapse test, which also covers bushfire). Lint clean, typecheck clean.
`--real` refused · public `data/resources` unchanged at 30 demo records · no private file in git.

## 11. Rollback

**`ac0d053a-8abd-4965-8bfe-3cae8ea943a5`** (18 resources) is in the deployment history, with its private files in
`workspace/backups/private-assets-ac0d053a` (54 files). The new state is backed up in
`workspace/backups/private-assets-7eee1f48` (57 files). Rolling back removes the new route and changes nothing else:
no existing record or PDF was touched.

## 12. Water Basics private learning-path override — recommendation

**Not implemented; the public path file is untouched.** The approved future pathway is OG-08 → OG-10 → OG-09 → OG-B08.

**Recommended design — a private learning path, staged exactly as private records already are:**

1. `private-assets/data-learning-paths/water-basics.private.json`, holding the real ids and a written description.
2. `build:preview` stages it into `data/learning-paths/` alongside the private records, and removes it afterwards —
   the same add-then-remove step that already exists, so nothing new can leak into a public build.
3. The loader prefers a `.private.json` path over the demo file of the same id, which is the resource-supersession
   rule applied to paths: **real supersedes demo in the preview only**, and a real-vs-real or demo-vs-demo collision
   fails the build.
4. `validate-content` keeps its current rule — every step must resolve — so a private path naming a missing id fails
   closed, and the public build still validates against demo ids alone.

**Why this shape:** it reuses two mechanisms that are already proven (private staging and supersession), it leaves the
public build exactly as it is, and it is reversible by deleting one file. The alternative — extending route
supersession to paths — hides the real pathway in a less obvious place and touches the loader more deeply.

**Scope when you approve it:** one config file, one staging step, one loader rule, and tests covering preview-vs-public
and the collision cases. Estimated one small stage, no member content changes.

## 13. Numeric-claim detector — next-stage recommendation

**Recorded as its own architecture task; not attempted here.** The figure flag only catches `%` and `°C`, so an
arbitrary capacity or distance is not caught in general — OG-B08 is protected by its explicit regression tests
instead.

**Recommended approach, modelled on `treatment-sources.json`:** a `numeric-claims.json` registry keyed by market,
holding each approved figure with its source, authority, date and the resource it belongs to (MBIE's tank sizes and
stand heights for NZ, NSW Health's 1 mm screens for AU, the water-weight conversion, the storage baselines); a
detector that finds capacity, distance, height, weight, pressure and interval figures in the finished files; and the
same fail-closed rule as the treatment gates — a figure passes only when an entry for that market matches it. The work
is mostly in seeding the registry from the 19 live resources so the existing set stays green, which is why it deserves
its own stage rather than a regex added in passing.

**Stopped.** The Water Basics learning path is unchanged, and OG-13 has not been started.
