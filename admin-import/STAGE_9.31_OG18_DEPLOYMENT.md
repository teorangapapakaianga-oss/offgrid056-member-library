# OG-18 — SOLAR POWER 101 WORKBOOK · DEPLOYED TO PRIVATE PREVIEW (#12)

**Status:** OG-18 is live in the private preview as the **12th** protected draft resource.

- **Worker version:** `4daef2b4`
- **Access:** still on all traffic
- **Changes applied:** all 29 approved changes, including your "No" wording
- **Metadata:** as ruled
- **Food-safety exemption:** recorded for OG-18 only, and holding
- **Rollback:** `e175bc11`

**Date:** 22 September 2026

---

## 1. Final "Any No" replacement wording

It appears under the heading *"Is My Roof Solar-Ready?"*, in both markets:

> Answer honestly. A "No" does not necessarily rule solar out — discuss the constraint with a qualified installer.

The approved OG-B07 roof note follows it: *"Use existing plans, ground-based estimates, or measurements provided by
your installer."*

It went into approved change 7, so there is no chained edit. A test enforces both parts: "solvable" can't return,
and your wording must be present.

## 2. Food-safety exemption record

In `metadata-review.json` → `OG-18.safetyExemptions`:

| Field | Value |
|---|---|
| block | `food-safety-power-cut` (your "food-power-cut") |
| resource | OG-18 |
| reason | appliance/load reference only; no food-safety teaching |
| detail | The only trigger is the "Fridge / freezer" row of the energy-use table. OG-18 does not teach food storage, fridge outage timing, food disposal, refreezing or food handling during outages. |
| allowedMentions | `Fridge / freezer` |
| approved | owner, 2026-09-22, Stage 9.30 ruling 6 |

**How it works:**

- **The detector is unchanged.** The exemption is read only for the resource that carries it.
- **It lapses on its own.** For each market, prep checks OG-18's final member-facing text. If "fridge", "freezer",
  "pantry" or "perishable" appears anywhere other than the allowed row, the exemption no longer holds: the block is
  required again and both markets are blocked. The message says what triggered it.
- **Prep reports** `exemption from food-safety-power-cut: holds` for OG-18.

**New tests prove all three:**

1. It holds with only the allowed row.
2. It lapses when a food sentence is added.
3. Without the exemption, the same content is still blocked. OG-18 is the only resource that carries one.

## 3. Final NZ result

| Check | Result |
|---|---|
| File | `solar-power-101-workbook.NZ.pdf` |
| Pages | 7 |
| Title | Solar Power 101 Workbook — OffGrid056 |
| Emergency numbers | **111 only** |
| AU terms | **none**: no licensed electrician, feed-in tariff, distribution network, permits/approvals, SES, 000 or 112 |
| 30–45° tilt | present, **only** in the roof-pitch field: *"30–45° is ideal in NZ — from plans or your installer"* |
| Electrical wording | "licensed electrical worker"; the block is present |
| Roof block | "Stay off the roof", plus the approved roof note |
| Removed content | **none present** (54 terms checked): pricing, payback, "4 peak sun hours", "÷ 4", "× 1.5 winter buffer", sunshine hours, Auckland |
| OG codes · tokens · VERIFY · browser-error page | none |
| Draft | yes |
| Changes | all 29 applied |
| "No" wording | present |
| Exemption | recorded, holds |

**Layout:** each table sits whole on one page.

| Page | Content |
|---|---|
| 3 | roof check |
| 4 | consumption table with its daily total |
| 5 | sizing table, note and Reality Check |
| 6 | cost table and "Comparing quotes" |

## 4. Final AU result

| Check | Result |
|---|---|
| File | `solar-power-101-workbook.AU.pdf` |
| Pages | 7 |
| Title | Solar Power 101 Workbook — OffGrid056 |
| Emergency numbers | **000 + 112 only** |
| New Zealand references | **none**: no "New Zealand", "NZ" or "Aotearoa" (checked by the verifier) |
| Removed NZ content | no Auckland figure, no NZ pricing, **no 30–45° tilt** |
| Terms | no "Consents", no power company or buy-back |
| AU wording | "licensed electrician"; feed-in tariff; distribution-network export limit; "Permits, approvals and inspection (if required)" |
| Other checks | the same as NZ: blocks present, no removed figures, codes, tokens, VERIFY or browser error; draft; all changes applied; "No" wording present; tables intact |

**Checks run on both:**

- `import:verify-prep`: 24/24 files pass.
- `import:verify-build` on the exact build: **12 records, 24 files, 0 broken links**.
- The deployed OG-18 PDFs are **byte-identical** to the checked PDFs.

**OG codes:** `legacyCode: "OG-18"` exists only in the page's internal data, like every other resource. It is not
visible text.

## 5. Deployment result

**Success.**

**Local preview, before deploying:**

| Check | Result |
|---|---|
| Before a market is chosen | no download offered |
| NZ chosen | NZ file only |
| AU chosen | AU file only |
| Metadata on the page | "beginner" and "30 min" shown |
| Visible OG code | none |
| Related links | **OG-B07 and OG-19** shown |

**After deploying**, every unauthenticated request was redirected (302) to the Access login. That included `/`,
`/downloads/`, the OG-18 page, both OG-18 PDFs, and an OG-19 PDF.

## 6. Worker version

**`4daef2b4-746f-4426-80cc-216c14e3fada`**

## 7. OG-18 route

`/resources/solar-power-101-workbook/` (behind Access)

## 8. Protected resource count

**12** draft resources: OG-02, OG-11, OG-15, **OG-18**, OG-19, OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B07, OG-B10.

**The 11 earlier resources are unchanged.** Their PDFs were not re-rendered and their records were not edited.

## 9. Tests

**269 passed** (264 + 5). Lint and typecheck clean.

**The five new tests:**

- Four for the exemption: it holds, it lapses, it's resource-specific, and it's recorded for OG-18 only.
- One for the "No" wording.

**Other status:**

| Check | Result |
|---|---|
| `--real` | refused |
| OG-18 files in git | 0 |
| `private-assets/` files tracked in git | 0 |

## 10. Rollback

**`e175bc11`** (11 resources). Its private files are backed up locally in
`workspace/backups/private-assets-e175bc11` (git-ignored). Earlier versions stay in the deployment history.

## 11. Links from live OG-B07 and OG-19

**Now:** OG-18 links forward to OG-B07 (`res-1507`) and OG-19 (`res-1019`). The live OG-B07 and OG-19 records are
**unchanged**, as ruled.

**Recommendation for a later approved deployment:**

- **Add `res-1018` (OG-18) to both records' `relatedResources`.** It's a two-line record change, with no PDF
  re-render and no copy change, verified by `import:verify-build` like any build.
- **No wording change is needed.** Neither PDF mentions OG-18: OG-19's legacy navigation was already removed, and
  OG-B07's PDF has none.
- **Timing:** bundle it with the next resource's deployment, so it doesn't cost a separate release.

**Optional:** OG-26's Tier 2 *"Grid-tied solar sized to your household's use"* could link to OG-18 in the same
change.

## 12. Next recommended resource

**OG-21, Home Energy Shelter Upgrade Plan** (the audit classifies it as shelter/planner).

**Why OG-21:**

- Its two audit safety notes are solid-fuel heating (8 mentions) and batteries/inverters (8 mentions). **Both
  matching blocks, solid-fuel-heating and batteries-and-electrical, are already owner-approved for NZ and AU.**
- It continues the energy and shelter journey.
- It can go claims-first, like OG-18 and OG-19.

**Why not OG-20 yet (Alternative Energy Suitability Check):**

- It has **14 generator mentions**, and the detector requires a **`generator-safety`** block. **No such block
  exists yet.** The approved carbon-monoxide and indoor-combustion blocks, and the electrical block's backfeeding
  line, cover part of it, but not generator siting or refuelling.
- The generator distance is still `VERIFY` for NZ and AU.

**I recommend a research-only stage first:** verify NZ and AU generator-safety wording from official sources
(for example WorkSafe NZ and Energy Safe Victoria), for your approval. Prepare OG-20 after that.

**Stopped. OG-20 not prepared.**
