# OG-13 HEALTHY HOME AIR AUDIT · DEPLOYED AS RESOURCE #20

**Date:** 5 October 2026 · **Stage:** 9.54

**Worker `776e704a-0f69-4c86-b80f-8b08da7880cb`** · **20** protected drafts · **40** market files · 0 broken links ·
Cloudflare Access verified on every route including the new one · rollback retained · `--real` refused ·
public/demo unchanged.

**The first Air resource is live.** Air had no resource at the start of Stage 9.51.

---

## 1. Push confirmation for `0f801ad`

`git push origin main` → `09fb3c3..0f801ad  main -> main`. **`origin/main` =
`0f801ada11c8cad167788a5f21dc1878b3ee09ce`**, containing:

- `admin-import/STAGE_9.53_OG13_PREPARED.md` — the Stage 9.53 preparation report
- OG-13's prepared **configuration** — 22 approved copy changes in `approved-copy.json`, metadata in
  `metadata-review.json`, the three Air blocks' Stage 9.53 changes in `safety-blocks.json`
- the Stage 9.53 tests in `tests/unit/air-blocks.test.ts` (+93 lines)
- **no private member content.** The 25 tracked PDFs are all `public/resources/…` demonstration placeholders;
  `private-assets/` is git-ignored (`.gitignore` line 65), as are `data/resources/*.private.json` and
  `data/learning-paths/*.private.json`. Prepared files live in `workspace/`, also ignored.

**One thing worth naming plainly:** OG-13's *prepared files* are not in git and never will be — by design. What is
in git is every decision that produces them.

## 2. Category revert confirmation

**`healthy-home-air` is gone.** Removed from `data/taxonomy/foundations.json`; `git diff 09fb3c3 --
data/taxonomy/foundations.json` returns **nothing**, so the taxonomy is byte-identical to its state before Stage
9.53 added the slug.

The air foundation is back to its **original six categories**: `ventilation`, `dampness-moisture`,
`indoor-air-quality`, `healthy-home-checks`, `air-worksheets`, `air-checklists`. **`npx tsx
tools/validate-content.ts` passes.** A test now asserts the slug does not come back, that slugs stay unique, and
that OG-13's recorded category is one the taxonomy holds.

## 3. Final metadata

| Field | Value |
|---|---|
| title | **Healthy Home Air Audit** |
| resourceType | **assessment** |
| foundation | **air** |
| category | **healthy-home-checks** |
| difficulty | **beginner** — OWNER-APPROVED / INFERRED |
| estimatedTime | **20** minutes — OWNER-APPROVED / INFERRED |
| status | **draft** |
| id · slug | `res-1013` · `healthy-home-air-audit` |
| PDF title | **`Healthy Home Air Audit — OffGrid056`** (owner standard; no legacy code) |
| tags · relatedResources | `[]` · `res-1002`, `res-1015` |
| legacyCode | `OG-13` — internal only, nowhere in the member-facing files |

## 4. Final safety block list

**Seven blocks in each market file**, in the order they appear:

| # | Block | Why it is there |
|---|---|---|
| 1 | `emergency-contact` | standard |
| 2 | **`fire-and-smoke-alarms`** | **required by the detector** (answers `fire-and-emergency`) |
| 3 | `carbon-monoxide` | carried — row 2 asks about it |
| 4 | `general-disclaimer` | standard |
| 5 | **`mould-and-dampness`** | carried — rows 3 and 4 |
| 6 | **`home-ventilation`** | carried — rows 5, 6, 7 and 8 |
| 7 | **`solid-fuel-heating`** | **required by the detector** — row 9 |

**Five topic blocks** (`fire-and-smoke-alarms`, `carbon-monoxide`, `mould-and-dampness`, `home-ventilation`,
`solid-fuel-heating`) plus the two standard ones. Exactly the set your ruling named.

- `required: ["solid-fuel-heating", "fire-and-emergency"]` · **`missingRequired: []`**
- **No exemption created or used** — `exemptions: 0`
- **OG-02's fire exemption untouched**, not referenced, not stretched
- No block injected twice; no block failed to place

## 5. `indoor-combustion` removed — confirmed

Not in OG-13's `safetyBlocks`, not in `approvedSafetyBlocks`, and **not in either rendered file** — a test checks
the actual `data-block` attributes in both market files, not just the config.

Its content is gone with it: neither file contains `unflued gas heater`, `cabinet heater`, `patio heater`, or
`Outdoor appliances stay outdoors`.

**The global block and detector are unchanged.** `indoor-combustion` still exists in `safety-blocks.json` with both
markets' wording, and OG-15, OG-26 and OG-27 still carry it. A test asserts the block is still defined. This was a
resource-level selection recorded in `metadata-review.json` — nothing was weakened.

## 6. `carbon-monoxide` retained — confirmed

Present in both files (`data-block="carbon-monoxide"`), with each market's own wording: NZ's "get outside into fresh
air immediately, then call 111"; AU's 000 for severe symptoms, the Poisons Information Centre on 13 11 26, and the
UL2034 / EN50291 alarm standard. Row 2 of the audit — *"Carbon monoxide alarms: considered or installed, near
sleeping areas"* (NZ) / *"Installed near bedrooms"* (AU) — is answered by it.

**Reported plainly, because it is the one place gas wording remains.** With `indoor-combustion` gone, the only
gas references left in OG-13 are:

1. **the `carbon-monoxide` block** — NZ: "gas and LPG heaters" in the list of what burns fuel, and the
   yellow-flame / licensed-gas-worker paragraph; AU: "Have gas heaters checked by a licensed gasfitter at least
   every two years" and "rooms with gas heaters"; and
2. **the `general-disclaimer`**, which is on every one of the 20 resources: "Anything involving fixed wiring, gas,
   structural work or an appliance flue must be done by a suitably qualified and licensed tradesperson."

Both are owner-approved since Stage 9.19 and live across the library. `GAS_SAFETY_REQUIRED` does not fire, because
it is checked on the resource's own text — which contains **no** gas wording at all. The unflued-LPG *teaching* that
ruling 2 was about is the part that is gone.

## 7. Bleach absent — confirmed

**Neither market file contains the word "bleach" anywhere**, in the resource's own text or in any injected block.
Checked three ways:

- the rendered files: zero matches for `/bleach/i` in NZ and AU
- the block bodies: zero matches in `mould-and-dampness` NZ and AU
- the numeric registry: no entry's wording or match pattern mentions bleach, so no bleach dilution can pass anything

The withheld figures stay withheld and unregistered: one part bleach to three parts water (Tenancy Services) and
250 mL of bleach in 4 litres of water (NSW Health). **The mould architecture was not touched in this stage** —
ruling 3 required nothing beyond what Stage 9.53 already did, so nothing was changed.

Each market keeps its own sourced PPE: NZ gloves, eye protection and a safety mask (Tenancy Services); AU good
ventilation, shower cap, rubber gloves, eye protection, overalls, footwear and a P1 or P2 face mask, with the P2
medical caveat (Better Health Channel).

## 8. NZ final PDF page count

**7 pages.** `healthy-home-air-audit.NZ.pdf`, 307,333 bytes. Was 8 before `indoor-combustion` came out.

## 9. AU final PDF page count

**8 pages.** `healthy-home-air-audit.AU.pdf`, 313,101 bytes. Was 9.

**Verified in both files.** **No blank pages** — text extracted page by page from the deployed PDFs: NZ 278 / 2,356
/ 1,295 / 1,032 / 541 / 1,828 / 1,643 characters; AU 319 / 2,505 / 1,462 / 970 / 541 / 658 / 2,792 / 1,206. Every
page carries content. **No duplicated safety paragraph** (every block paragraph over 60 characters appears exactly
once). **No cross-market wording.** No unresolved `{{tokens}}`. No `VERIFY` / `TODO` / `PLACEHOLDER` /
`notVerifiedForMarket` markers. Title `Healthy Home Air Audit — OffGrid056`; record `status: "draft"`; category
`healthy-home-checks`.

## 10. Numeric validation result

**Blocking still ON. Bucket C = 0 everywhere.**

| Scope | Candidates | A sourced | **C needs source** |
|---|---|---|---|
| OG-13 NZ | 12 | 12 | **0** |
| OG-13 AU | 12 | 12 | **0** |
| **Library-wide (20 resources)** | **337** | **180** | **0** |

Library buckets: A 180 · B 2 · **C 0** · D 111 · E 44. Categories: interval 247 · capacity 50 · distance 17 ·
percentage 11 · area 4 · height 4 · power 3 · **temperature 1**.

The four things you asked to be confirmed:

- **The ratio claim type is still exercised in both markets.** NZ: `half and half` → `nz-mould-vinegar-half-and-half-tenancy`. AU: `four parts vinegar to one part water` → `au-mould-vinegar-ratio-nsw`. Both `A_ALREADY_SOURCED`.
- **Temperature remains sourced.** `18–22°C` → `nz-airing-15-minutes-mbie`, `A_ALREADY_SOURCED`. It is the library's only temperature claim and it is NZ-only, as it must be.
- **Jurisdiction labels still enforced.** The AU alarm figures match only because the sentence names Fire and Rescue NSW; the Queensland battery figure only because it names the Queensland Fire Department; the AU dilution only because it names NSW Health. Strip the attribution and the figure fails — that is what `requiresLabel` does, and the Stage 9.52 tests still prove it.
- **No numeric claim disappeared from validation because a block changed.** The library count moved 338 → **337**, and the AU file 13 → **12**, for one reason: `indoor-combustion`'s servicing interval left the document with the block. **It is not an unvalidated figure — it is a figure that is no longer in the resource.** Every figure still printed is still classified, and the equivalent AU servicing interval survives inside the `carbon-monoxide` block, where it is block-sourced.

## 11. Full-library validation result

| Check | Result |
|---|---|
| `import:prep`, 20 resources | **20/20 `READY_AFTER_FINAL_VALIDATION`** |
| Market files | **40** |
| Market problems | **0** |
| Gate findings (fuel, treatment, numeric) | **0** |
| Content flags | **0** |
| `import:verify-prep` | **40/40 verified** |
| `import:verify-build` | **records 20 · market files 40 · broken internal links 0 · deployment build verified** |
| `tools/validate-content.ts` | **passes** — 30 demo resources, 3 learning paths |

## 12. Updated test count

**436 passing** (434 → **+2**), lint clean, typecheck clean. Four tests in the Air suite were rewritten or added
for this stage's rulings:

| # | Test | Change |
|---|---|---|
| 13 | uses an existing air category, and the Stage 9.53 slug stays reverted | **rewritten** — it asserted the opposite before |
| 14 | carries five blocks, keeps `carbon-monoxide`, drops `indoor-combustion`, and the global block is untouched | **rewritten** |
| 16 | neither rendered file carries the `indoor-combustion` block, its unflued-gas paragraph, or any block twice | **new** |
| 17 | neither rendered file names the other market's agencies or figures; no NZ mask claim; the AU mask claim keeps its conditions | **new** |

The Air suite is **19 tests**. No flake this run: 436/436 clean.

## 13. Deployment result

**Deployed.** `wrangler deploy` → `Deployed og056-preview triggers`, 554 files uploaded (388 already present).

- **Cloudflare Access verified on every route**, including the new ones. All nine probes returned **302 →
  `odd-surf-0ad6.cloudflareaccess.com`**: `/`, `/library/`, `/foundations/air/`,
  `/foundations/air/healthy-home-checks/`, `/resources/healthy-home-air-audit/`, **both market PDFs**,
  `/resources/household-water-treatment-guide/` and `/learning-paths/water-basics/`.
- **All 20 resources are `draft`.** Nothing was published.
- **Route supersession, third use:** the real resource takes `/resources/healthy-home-air-audit/` from a
  demonstration placeholder, **in the preview only**. The public demonstration build is untouched — `git diff` on
  `public/` is empty, and rolling back restores the placeholder.
- **`--real` was not run** and remains hard-refused.
- **No real member file entered GitHub.** `private-assets/` holds 61 files and 40 PDFs; `build:preview` staged them,
  built, and then **removed all 61 staged files**. `git status` shows only `metadata-review.json`,
  `foundations.json` and the test file.

## 14. New Worker version

**`776e704a-0f69-4c86-b80f-8b08da7880cb`**

## 15. Protected resource count

**20** protected drafts, **40** market files, behind Cloudflare Access.

## 16. Rollback version

**`0aff3fcd-7080-4ae7-bf28-c5d09414b90a`** — the 19-resource deployment, with its private files kept at
`workspace/backups/private-assets-pre-og13` (58 files). Rolling back also restores the demonstration placeholder on
the `healthy-home-air-audit` route, because the placeholder is only superseded while the real record is present.

## 17. Recommendation for Stage 9.55

**Gas / LPG research — research only, nothing migrated.**

It is the largest remaining blocker and has been for ten stages. It holds **OG-17 Solid Fuel Heating Planner** and
**OG-B09 Insulation & Heating Upgrade Checklist** outright, and it is the reason this stage had to spend three
rulings and two reports deciding how much pre-approved gas wording an Air resource may carry. `GAS_SAFETY_REQUIRED`
currently fails closed on every gas or LPG mention in a resource's own text, which is correct and will stay that way
until the wording exists.

**Shape:** read live and quote — **NZ** WorkSafe gas safety and Health NZ on unflued heaters; **AU** each state's
gas regulator plus Energy Safe Victoria's GIS 36, which I have already read in full and returned at Stage 9.52 but
have not used. Return the wording for approval, build nothing until it is approved. Expect the same honest finding
as smoke alarms: **Australia will differ by state and there will be no national rule.**

**Two alternatives, for completeness.** A **low-hazard batch** (two or three of OG-01, OG-03, OG-04, OG-12, OG-14,
OG-23, OG-24, OG-B02, OG-B05, OG-B06) would move the resource count fastest and needs no research — a reasonable
choice if visible progress matters more right now. A **second Air resource** would let the Air pathway exist, but
the obvious candidates (ventilation and moisture control, mould and dampness) exist only as safety blocks today, so
one would have to be built from a legacy resource that is not clearly Air.

**My recommendation is gas**, because every stage that touches heating, cooking or combustion pays a tax until it is
done.

**Stopped after deployment.** No gas research begun, no other resource started.
