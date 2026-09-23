# NUMERIC CLAIM REGISTRY · REPORT-ONLY DISCOVERY

**Date:** 23 September 2026 · **Stage:** 9.48 · **Nothing deployed, nothing blocked, no member file changed.**

Worker still `1e4ab83b-4086-4c18-bf09-f6024152abbb` · **19** protected drafts · **all 38 PDFs byte-identical** to the
live deployment · `--real` refused · public/demo unchanged.

---

## 1. Push confirmation

`git push origin main` → `eb563fc..843aafe  main -> main`. **`origin/main` = `843aafe3d14766d34eaaf815d3dbb0002b9e3caa`**,
carrying `admin-import/STAGE_9.47_WATER_PATH_AND_OG02.md`, the private learning-path architecture
(`lib/content/supersession.ts`, `lib/content/repository.ts`, `tools/build-preview.mjs`, `tools/validate-content.ts`,
`.gitignore`) and the OG-02 classification.

## 2. Schema — `admin-import/config/numeric-claims.json`

```jsonc
{
  "mode": "report-only",                    // blocking is a separate, owner-approved switch
  "seedingRule": "Bucket A only — a source recorded in approved stage work. Nothing from memory, no invented citation.",
  "claims": [{
    "id": "nz-tank-stand-height-mbie",
    "market": "NZ",                         // NZ | AU — never both in one entry
    "jurisdiction": "national",             // or "NSW (state-specific, used as a labelled example)"
    "owningResources": ["OG-10", "OG-B08"], // [] would mean any resource in that market — unused so far
    "category": "height",
    "claimType": "range",                   // value | range | threshold | conversion | interval | example
    "unit": "m",
    "value": { "min": 0.3, "max": 1.0 },    // or { exact }, or { text } for a compound figure
    "allowedWording": "a stand over 30cm and under one metre; over one metre generally needs a building consent",
    "match": ["\\b30 ?cm\\b[\\s\\S]{0,80}\\bone metre\\b", "…"],   // the context the figure must sit in
    "requiresLabel": "MBIE",                // attribution that must be in the same sentence, or null
    "source": "https://www.building.govt.nz/…",
    "authority": "Building Performance, MBIE",
    "sourceDate": "2026-01-15 (read live 2026-09-23)",
    "limitations": ["A consent threshold, not a structural design…"],
    "status": "VERIFIED — OWNER-APPROVED 2026-09-23 (Stages 9.40 and 9.45)"
  }]
}
```

## 3. Detector architecture — `admin-import/audit/numeric.ts`

Sentences come from the same extractor the treatment gates use, so a **comparison table's rows are read as claims**
too. For each sentence:

1. **Treatment first.** If a treatment registry entry matches, the candidate is `E_TREATMENT_OWNED`. If the sentence
   is treatment-shaped but matches nothing, it is *still* treatment's problem (`treatment-context`) — this module
   never offers a second opinion on a bleach ratio or a boil time.
2. **Safety blocks.** A figure inside an injected `og-safety` block is `A_ALREADY_SOURCED`, credited to that block:
   the block is owner-approved and its per-market sources are recorded in `safety-blocks.json`.
3. **Registry.** Otherwise a numeric-claims entry must match on **market**, **owning resource**, **context pattern**
   and **`requiresLabel`** together. Any one of those failing means no match.
4. **Structure and furniture.** Page markers, resource and legacy codes, emergency numbers, dates, step and page
   numbering and standard numbers are `B_STRUCTURAL`; blanks, the member's own figures, variable-only formulas,
   planning horizons ("14-Day Supply", "3-day / 7-day / 14-day"), self-set tests ("48-hour off-grid test"), worksheet
   rhythms ("update weekly") and explained arithmetic ("your gap is 0 L") are `D_NOT_A_CLAIM`.
5. **Everything else** is `C_NEEDS_SOURCE`.

Two bugs found and fixed while calibrating, both worth naming because they are the kind that make a detector lie:
"1,000mm" was being read as the emergency number **000**, and `ten` + `t` was matching the word **"tent"** as ten
tonnes.

## 4. Totals

**301 numeric candidates** across the 17 prepared resources with figures (OG-B04 and OG-B10 contribute worksheet
rhythms only; two of the 19 resources contain no numbers at all).

| Bucket | Count |
|---|---|
| **A — already sourced** | **151** |
| **B — structural / presentation** | **2** |
| **C — needs source** | **1** |
| **D — not a claim** | **110** |
| **E — treatment-registry owned** | **37** |

By category: interval 232 · capacity 47 · distance 14 · height 4 · power 2 · area 2.

Per resource: OG-08 A24 D36 C1 E2 · OG-09 A8 E27 · OG-10 A27 D4 E2 · OG-11 A8 D14 B2 · OG-15 A5 · OG-18 D20 ·
OG-19 A3 D10 · OG-20 A2 D2 · OG-21 A3 D4 · OG-22 A4 · OG-25 D2 · OG-26 A15 E2 · OG-27 A18 D6 · OG-B04 A4 D6 ·
OG-B08 A15 E2 · OG-B10 A2 D6 · OG-B12 A13 E2.

## 5. Bucket A — already sourced (151)

Two kinds:

- **135 inside owner-approved safety blocks** — the storage baselines, the fridge and freezer timings, the generator
  cool-down, the gas servicing interval, the CO and height wording. Each block records its own per-market sources in
  `safety-blocks.json`, so these were sourced when the block was approved.
- **16 in the resources' own text**, now registered (section 10): the water storage baselines and their formulas,
  the pantry day figures, the roof conversion and its worked example, MBIE's tank sizes and stand heights, NSW's
  1 mm screen example, the water-weight conversion, and MBIE's annual desludging.

## 6. Bucket B — structural / presentation (2)

Only two survived once the emergency-number bug was fixed: **"Step 2: 30-Day Pantry Inventory"** in OG-11, NZ and AU
— step numbering that happens to contain a duration. Everything else that looked structural turned out to be either a
real claim or worksheet furniture, which is the right outcome: this bucket should be small.

## 7. Bucket C — NEEDS SOURCE (1)

**One live figure in nineteen resources has no recorded source.**

| Field | Detail |
|---|---|
| **Resource** | OG-08 Water Storage Calculator |
| **Market** | **AU only** |
| **Exact wording** | *"The official baseline is drinking water for three days; your state or territory emergency service may advise more for your area."* |
| **Figure** | three days |
| **Why it is a claim** | It says "the official baseline" without naming whose. The only Australian source verified for it is **Get Ready Queensland**, a state source, and the resource attributes the figure properly two paragraphs earlier. This sentence generalises it. |
| **Safety significance** | **Low-to-moderate.** Three days is the conservative end of Australian advice and the sentence already sends the member to their own state or territory. The risk is the pattern, not the number: an unattributed "official baseline" is how a state figure quietly becomes a national rule. |
| **Recommended action** | **REWRITE NON-NUMERIC or label it** — either *"Get Ready Queensland's baseline is drinking water for three days"* or *"Your state or territory sets the baseline — Get Ready Queensland advises three days."* A national source (enHealth or the Australian Government's emergency guidance) would also settle it, but that is research, not a rewrite. |

**Not resolved here.** It is one sentence in a live resource, and changing it is a content change for you to approve.

## 8. Bucket D — not a claim (110)

Planning horizons the member chooses (3-day / 7-day / 14-day / 30-day rows and targets), self-set tests ("48-hour
off-grid test"), worksheet rhythms ("update weekly", "weekly check-in day"), durations in passing with nothing
recommended, explained arithmetic ("your gap is 0 L — the extra is a surplus"), and empty lines. OG-18 contributes 20
and OG-08 36, which is what a calculator and a workbook full of member inputs should look like.

## 9. Bucket E — treatment-registry owned (37)

Every bleach ratio, boil time, contact time, storage life, micron rating, UV requirement and testing interval in
OG-09, OG-08, OG-10, OG-26 and OG-B12. The numeric module defers to `treatment-sources.json` for all of them, and a
test asserts no id or claim is duplicated between the two registries.

## 10. Seeded registry entries (16)

| id | Market | Category | Owns | Figure |
|---|---|---|---|---|
| `nz-storage-litres-per-person-per-day` | NZ | capacity | OG-08 | 3 L per person per day |
| `nz-storage-days` | NZ | interval | OG-08 | at least three days |
| `au-storage-litres-per-person-qld` | AU | capacity | OG-08 | 10 L per person (Qld example) |
| `au-storage-days-qld` | AU | interval | OG-08, OG-11 | three days (Get Ready Queensland) |
| `au-pantry-days-nsw` | AU | interval | OG-11 | up to 14 days (NSW Food Authority) |
| `nz-food-days-getready` | NZ | interval | OG-11 | food for at least three days (Get Ready) |
| `shared-roof-litre-per-mm-per-m2` / `…-au` | NZ / AU | capacity | OG-10 | 1 L per m² per mm, before losses |
| `shared-roof-worked-example` / `…-au` | NZ / AU | capacity | OG-10 | 150 m² × 1,000 mm ≈ 150,000 L (labelled example) |
| `nz-tank-size-examples-mbie` | NZ | capacity | OG-10 | MBIE's 240 L / 500 L+ / 5,000 / 10,000 / 30,000 L |
| `au-insect-screen-mm-nsw` | AU | distance | OG-10, OG-B08 | 1 mm screens (NSW Health example) |
| `nz-tank-stand-height-mbie` | NZ | height | OG-10, OG-B08 | stand over 30cm, under 1 m; over 1 m needs consent |
| `nz-water-weight-conversion-mbie` / `au-water-weight-conversion` | NZ / AU | weight | OG-B08 | about 1 kg per litre |
| `nz-tank-desludge-annually-mbie` | NZ | interval | OG-B08 | desludge annually |

Every entry carries its source URL, authority, date, limitations and owner-approval reference. **Nothing was seeded
from Bucket C, and no citation was invented** — each one traces to a source read live in Stages 9.27–9.46.

## 11. Cost / currency inventory

**Empty.** A sweep of all 38 prepared files for `$`, `NZ$`, `AU$` and cost ranges returns **zero matches**. Every
price the legacy resources carried — OG-09's nine ranges, OG-B08's `$`–`$$$$` column and maintenance costs, OG-22's
and OG-26's estimates — was removed during migration, and the detector's `currency` category has nothing to classify.

**Recommendation:** keep `currency` in the schema but **do not build a pricing architecture**. If prices ever return
they need a freshness system (a "checked on" date, a review interval, a market), which is a different problem from a
safety claim and deserves its own stage.

## 12. Proposed additional categories

| Category | Recommendation |
|---|---|
| **area** | **Add** — in use already (the 150 m² roof). It behaves like distance but reads differently. |
| **flow** (L/hour, L/min) | **Keep in the schema, unused.** Nothing in the library states a flow rate. Pump and filter capacities would land here the moment a pump resource is migrated. |
| **power / energy** (W, kW, kWh, V, A) | **Add.** Two candidates already exist in the energy resources, and OG-19's kW-versus-kWh explanation is exactly the kind of figure that needs sourcing if it ever becomes specific. |
| **currency** | **Keep, unused** — see item 11. |
| **temperature** | **Keep.** No live figure today (the NSW contact-time temperatures are treatment-owned), but °C is one flood-cleanup or food-safety migration away. |
| **pressure** | **Keep, unused.** NSW's 150 kPa filter threshold is treatment-owned; a plumbing resource would bring its own. |

No category should be added just because a number exists — `ratio` and `count` were considered and rejected for that
reason.

## 13. Tests

**404 total** (390 → **+14**), lint clean, typecheck clean.

The fourteen: treatment defers (registered and unregistered); no id is shared between the two registries; NZ's
baseline does not explain an AU sentence; NSW's 1 mm fails without its label and fails entirely in NZ; an approved
figure fails in a resource that does not own it; 1 mm of screen does not approve 1 mm of clearance; 30cm of stand
does not approve 30cm behind a pump; a formula's fixed value is a claim while `Need − Have` is not; planning
horizons, self-set tests and worksheet rhythms are not claims; dates, emergency numbers, resource codes and standards
are ignored; the detector is **not wired into preparation** and the config says `report-only`; an **empty registry
approves nothing** while the seeded one explains the same sentence; and every seeded claim records source, authority,
date, limitations and approval.

**One honest note:** in the full-suite run, `importer.test.ts > infers a foundation with confidence and evidence`
timed out once under parallel load and passed when that file was run alone (30/30). It is the same long-running
importer test that flaked at Stage 9.41, it is untouched by this stage, and the failure is a 5-second timeout rather
than an assertion.

## 14. Recommendation — report-only → blocking

**Recommend switching on, in two steps, and not today.**

1. **Now (no code change):** the discovery is done and the picture is unusually clean — one unexplained figure in
   nineteen resources. Resolve **Bucket C item 1** (OG-08's AU sentence) first, because switching on a gate while a
   known finding is open is how exceptions get invented.
2. **Then (one small stage):** wire `scanNumericClaims` into `prepareResource` beside the treatment gates, failing on
   `C_NEEDS_SOURCE` only, with the same "no registry approves nothing" behaviour. Because the registry now explains
   151 of 151 sourced figures, the expected result on the current library is **zero findings** — which is the
   condition I would want met before making it blocking.

**What blocking buys:** a figure typed into a future resource — a clearance, a capacity, a load — cannot reach a
member without an entry naming its source, its market and the resource it belongs to. **What it costs:** every new
sourced figure needs a registry entry as part of its stage, exactly as treatment figures do now.

**Do not enable it for percentages yet.** The `%` category is the noisiest (efficiency claims, battery depth of
discharge, budget splits), and none of the current 19 resources carries a live percentage claim — that means the
rule has never been exercised, and a first outing should not be on a live build.

## 15. OG-13

**Untouched.** Not started, not audited, not prepared. The Air foundation is still empty, and nothing in this stage
went near it.

**Stopped.** Report-only. Numeric blocking is **not** enabled, nothing was deployed, and no member content changed.
