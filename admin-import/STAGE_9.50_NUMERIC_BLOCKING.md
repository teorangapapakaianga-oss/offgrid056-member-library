# NUMERIC CLAIM BLOCKING · ENABLED

**Date:** 23 September 2026 · **Stage:** 9.50 · **A validation-system stage: no member content changed, nothing
deployed.**

Worker still `0aff3fcd-7080-4ae7-bf28-c5d09414b90a` · **19** protected drafts · **all 38 PDFs byte-identical** ·
`--real` refused · public/demo unchanged.

---

## 1. Push confirmation

`git push origin main` → `fd0997f..5fbb564  main -> main`. **`origin/main` = `5fbb56436fceebf0fe94d4c8d9898c0ecb2fc81b`**,
containing `admin-import/STAGE_9.49_BUCKET_C_RESOLVED.md`, the corrected OG-08 AU wording in `approved-copy.json`,
the re-scoped `numeric-claims.json` and the Stage 9.49 regression tests.

## 2. Blocking integration

One hook, beside the treatment gates in `prepareResource`, on the **finished** market file (resource text plus its
injected safety blocks):

```ts
const numeric = numericBlockingFindings(withSafety, {
  resource: item.legacyCode, market: code,
  registry: inputs.numericRegistry ?? { claims: [], mode: "report-only" },
  treatment: treatmentRegistry,
});
```

Findings join `otherFindings` **and** the market's `problems`, exactly as the fuel and treatment checks do — the same
path, no parallel route, no bypass. The CLI loads `numeric-claims.json` and passes it in.

**Mode lives in the config, not the code:** `"mode": "blocking"`, with `"blockingExcludes": ["percentage",
"currency"]` and an `activation` block recording what fails, what never fails, and the empty-registry rule. Turning
it off again is an owner decision recorded in a file rather than a code change.

**Fail-closed properties, all tested:**

- Only `C_NEEDS_SOURCE` fails. **B (structural), D (not a claim) and E (treatment-owned) never fail.**
- A missing or empty registry approves **nothing** — "the registry wasn't there" is not a pass condition.
- Market, jurisdiction, owning resource, context and `requiresLabel` must **all** match; any one failing is a
  finding.
- Treatment figures defer to `treatment-sources.json`, and no figure is duplicated between the registries.

## 3. Active blocking categories

| Category | Blocking | Exercised by |
|---|---|---|
| **capacity** | ✅ | live (storage litres, tank sizes, roof conversion) + tests |
| **distance / clearance** | ✅ | live (NSW 1 mm screens) + a test proving 1 mm of screen ≠ 1 mm of clearance |
| **height** | ✅ | live (MBIE stand heights) + a test proving 30 cm of stand ≠ 30 cm elsewhere |
| **weight / load** | ✅ | live (the kilogram-per-litre conversion) |
| **duration / interval** | ✅ | live (storage days, desludging, the Queensland attribution tests) |
| **area** | ✅ | live (the 150 m² worked example) — **classifier only; no test has yet made an area figure fail** |
| **power / energy** | ✅ | **two live candidates, both already sourced. No test has made a power figure fail** |
| **pressure** | ✅ enabled | **no live figure and no test case — coverage is theoretical** |
| **temperature** | ✅ enabled | **no live figure and no test case — coverage is theoretical** |
| **percentage** | ❌ **excluded** | detected and reported (11 candidates), blocking held back per ruling 8 |
| **currency** | ❌ **excluded** | nothing live; prices need a freshness system, not this gate |

**Stated plainly, as ruling 9 asks:** pressure and temperature are switched on but have never been exercised by a
live figure or a test; area and power are exercised by live sourced figures but by no failing test. The five
categories with both live figures and failing tests are capacity, distance, height, weight and interval.

## 4. Full re-prep result

**All 19 resources, 38 market files: green.**

- `import:prep` → **19/19 `READY_AFTER_FINAL_VALIDATION`**, zero `UNSOURCED_NUMERIC_CLAIM` findings
- `import:verify-prep` → **all prepared files verified**
- No resource, market or file was blocked, so no exemption was needed or created.

## 5. Bucket counts under blocking mode

**313 candidates** across the 17 resources that contain figures.

| Bucket | Count | Blocks? |
|---|---|---|
| **A — already sourced** | **156** | no |
| **B — structural** | **2** | never |
| **C — needs source** | **0** | would block |
| **D — not a claim** | **111** | never |
| **E — treatment-owned** | **44** | never |

Categories: interval 231 · capacity 47 · distance 14 · **percentage 11** · area 4 · height 4 · power 2.

**The count rose from 300 to 313 because the detector got better, not because content changed.** Two fixes:

1. **Percentages were invisible.** The unit match ended in `\b`, which can never fire after `%`, so "90%" was never
   detected at all. Eleven percentage candidates appeared once that was corrected — nine already sourced or
   treatment-owned, two in OG-18.
2. **OG-18's two:** the bare **"100%"** in the TOTAL row of a table the member fills in. Classified `D` — a column
   total, the member's own percentages adding to 100 — which is exactly how prep's existing figure flag has always
   treated a bare "100%". A classifier rule for a non-claim, not an exemption.

## 6. Blocked findings

**None.** Bucket C is zero and no resource failed.

## 7. Registry status

**17 claims**, unchanged in content this stage: 8 NZ, 9 AU; categories capacity 7, interval 6, distance 1, height 1,
weight 2. Every entry carries market, jurisdiction, owning resources, context patterns, label requirement, source,
authority, date, limitations and approval reference. What changed is the file's **mode** (`blocking`), its
**exclusions** (`percentage`, `currency`) and the `activation` record.

## 8–9. Tests, lint, typecheck

**417 passing** (410 → **+7**), lint clean, typecheck clean.

The seven: blocking is the active mode and is wired into prep; a sourced claim passes while an unregistered figure
fails with `UNSOURCED_NUMERIC_CLAIM`; wrong market, wrong resource and missing jurisdiction label each fail, and the
labelled version passes; B, D and E never block; percentages and currency are detected but held out of this
activation; an empty or missing registry blocks every factual figure while report-only mode changes nothing; and
**every prepared file in the live library produces zero blocking findings**.

## 10. Member content

**Nothing changed.** No PDF, copy, title, route, metadata, learning path or safety wording was touched — the only
files that changed are the detector, the registry's mode, the CLI wiring, prep's hook and the tests. All 38 PDFs are
byte-identical to the deployed set, and `private-assets/` still holds 58 files.

## 11. Worker

**Unchanged: `0aff3fcd-7080-4ae7-bf28-c5d09414b90a`.** No deployment was required or performed — this stage changes
what preparation *permits*, not what the preview *serves*. There is no runtime component to ship.

## 12. Next resource — OG-13 recommendation only

**Source:** `OG-13_Healthy_Home_Air_Audit.html` (17 KB) · title **"Healthy Home Air Audit"**.

**Likely role in the Air foundation:** the **entry assessment** — the first Air resource and the one that decides
what else a member needs. It is a 10-question room-by-room audit (smoke alarms, CO detectors, visible mould, musty
smell, condensation, kitchen and bathroom ventilation, bedroom air, wood-burner flue, P2/N95 masks) scored out of 50,
with a "top three actions" worksheet. It reads as the Air equivalent of OG-02's risk identifier.

**Likely safety architecture:** almost certainly **carbon-monoxide** (CO detectors, wood burner) and
**solid-fuel-heating** (flue, firebox), and possibly **indoor-combustion**. All three are approved, NZ and AU. The
audit's questions are *identification*, like OG-02's — but question 9 ("wood burner serviced; flue clear; no visible
cracks in firebox") and question 1 ("tested monthly, under 10 years old") are closer to instructions than labels,
so the fire detector will trip on smoke alarms and this one **cannot be handled by an OG-02-style exemption**.

**Likely research blockers — the honest part:**

1. **Smoke alarms.** "Tested monthly, under 10 years old" and "CO detectors… under 5 years old" are **numeric claims
   with lifespans and intervals**, and there is **no approved fire-and-emergency block in either market**. Under the
   gate switched on today they would fail as `UNSOURCED_NUMERIC_CLAIM`, and under the fire detector they would demand
   a block that does not exist. **This is a research stage before it is a migration stage** — FENZ (NZ) and each
   AU state fire service publish alarm guidance, and their figures differ.
2. **Mould and dampness.** The audit implies remediation ("bleach + spray bottle — kills visible mould"). NZ
   (Health NZ / Tenancy Services) and AU (state health) both publish household mould guidance; none of it is
   approved here yet.
3. **Ventilation figures.** "Shower steam clears within 10 minutes" is an unsourced interval.
4. **Prices.** The source carries eight: $50, $15–$30, $10–$20, $40–$80, $5. All must go, as in every prior
   migration.
5. **The opening claim.** "You can survive 3 weeks without food but only 3 minutes without clean air" and "cause
   more hospitalisations than power outages" are unsourced survival and epidemiological claims — REMOVE or REWRITE.

**Are the existing blocks enough?** **No.** Drinking water, food, electrical, generator, height, CO, solid fuel,
indoor combustion and treatment are all approved — but **air brings its own**: smoke alarms and fire safety (no block
exists, and the strict fire rule means it fails closed), and mould/dampness (no block, no approved wording).

**Recommended shape:** a **research-only stage first** — FENZ plus each AU state fire service on alarms, and NZ/AU
health guidance on mould and ventilation — then the migration. That is the same order that worked for water
treatment, and it is the order the current gates enforce anyway.

**Stopped.** OG-13 is not started. No new exemption was created in this stage.
