# WATER BASICS PRIVATE PATHWAY DEPLOYED · OG-02 FIRE CLASSIFICATION

**Date:** 23 September 2026 · **Stage:** 9.47

- **Worker version:** `1e4ab83b-4086-4c18-bf09-f6024152abbb`
- **No new resource:** still **19** protected drafts, 38 market files. What changed is the *pathway*.
- **Rollback:** `7eee1f48-82c3-483f-8d0b-4b2d4c47e586`

---

## 1. Push confirmation

`git push origin main` → `5ed343e..eb563fc  main -> main`. **`origin/main` = `eb563fcce4aa493d7b8ee4c20920abde44979095`**,
carrying `admin-import/STAGE_9.46_OGB08_DEPLOYMENT.md` and the Stage 9.46 changes.

## 2. OG-02 current-content fire audit

| Layer | Fire references | Fire-teaching signals |
|---|---|---|
| **A. Own migrated text (NZ and AU)** | **2**, both checklist labels: **"Fire in the home"** (household risk list) and **"Bushfire risk area"** (property risk list) | **0** |
| **B. Injected safety blocks** | **0** in either market | **0** |
| **C. Legacy source** | the same 2 labels, nothing else | **0** |

**Confirmed:** OG-02's only member-facing fire references are hazard-identification labels — things the member ticks.
There is no response, evacuation, egress, alarm, extinguisher, suppression, defensible-space or preparation wording
anywhere in it, and nothing fire-related was removed during migration. The block requirement was raised because the
audit text counts the PDF and HTML copies of the source together (two mentions each).

## 3. OG-02 exemption result

**Approved and recorded**, scoped to the exact audited context:

```
block:           fire-and-emergency
allowedMentions: ["Fire in the home", "Bushfire risk area"]
purpose:         hazard identification ONLY
```

With the audit attached (all three layers, the final-output check, and the lapse rule). Running it against the
**final migrated NZ and AU files**: 2 allowed mentions, **0 unexpected**, **0 teaching signals** — it holds, and
**OG-02 was not re-rendered or redeployed** because nothing about it changed.

**It fails closed two ways.** Any fire or bushfire wording outside those two labels lapses it, and so does any
fire-*teaching* signal, including wording that never uses the word: extinguishers, fire blankets, smoke alarms,
sprinklers, suppression, defensible space, firebreaks, fire drills, plans, response or safety, "prepare for
bushfires", and — in a document that mentions fire — escape plans, escape routes, "two exits", egress, sheltering,
embers and evacuation plans. Tests cover *Install smoke alarms*, *Plan two exits*, *Prepare for bushfires*, *Use a
fire extinguisher*, *Clear a defensible space*, *Write an evacuation plan*, and a bare "Fire risk is highest in
summer".

**One refinement, and why.** The ambiguous half of that list is judged **in context**: "escape routes" counts as fire
teaching only when the document mentions fire somewhere. Without that, OG-B08's placement line — *"Not blocking
escape routes or access for emergency services"* — would have been read as fire teaching and lapsed its own
exemption, although that resource never mentions fire. The unambiguous half (extinguisher, smoke alarm, defensible
space…) always counts, whatever else the document says. **The fire detector itself was not weakened**; it still
catches fire, bushfire, wildfire, smoke alarm and evacuation, as strengthened at Stage 9.46.

**Scope:** two resources now hold a fire exemption — **OG-02** (two reviewed labels) and **OG-B08** (zero mentions).
Neither shares a phrase with the other, and a test asserts the list is exactly those two.

## 4. Private learning-path architecture

Reusable, and built from mechanisms that already work:

| Piece | What it does |
|---|---|
| `private-assets/data-learning-paths/` | where private paths live — outside `data/`, git-ignored, never committed |
| `tools/build-preview.mjs` | stages that directory into `data/learning-paths/` for the preview build and **removes it afterwards**, exactly as the records and downloads are staged. A third entry in the same `STAGE` list; the existing `unstage()` runs on exit, including on failure |
| `lib/content/supersession.ts` → `resolveLearningPathCollisions` | the route rule, applied to pathways: **a private path supersedes the demonstration path with the same id, in the preview only** |
| `lib/content/repository.ts` → `loadLearningPaths` | marks a path private by its file name (`*.private.json`), resolves collisions, then maps steps through the same resource alias map, so a step naming a superseded placeholder still lands on the real resource |
| `tools/validate-content.ts` | keeps "every step must resolve to a published resource" — which in a preview build includes drafts — and now also fails a path that names the same step twice |
| `.gitignore` | `data/learning-paths/*.private.json`, so a staged file cannot be committed even by accident |

**Nothing is water-specific.** Any private path supersedes the demo path with its id.

**Collision rules, all tested:**

| Case | Result |
|---|---|
| private + demo, **preview** | private wins, demo dropped |
| private + demo, **any other build** | **build fails** |
| private + private | **build fails**, in every build |
| demo + demo | **build fails**, in every build |
| step naming a resource that does not exist | **build fails** (existing rule, unchanged) |
| the same step twice in one path | **build fails** (new) |

## 5. Final Water Basics private path

`private-assets/data-learning-paths/water-basics.private.json`:

```
id:    water-basics
title: Water Basics
steps: res-1008 → res-1010 → res-1009 → res-1508
```

Which resolves, in the deployed preview, to:

1. **Water Storage Calculator** — how much water the household needs
2. **Rainwater Harvesting Planner** — how much the roof can supply
3. **Household Water Treatment Guide** — making it safe to drink
4. **Water Tank Sizing & Placement Guide** — where the tank goes

Verified on the built preview: four steps in that order, every route resolving, **no demo placeholder** in the path
(the demonstration Water Security Guide and Water Storage Checklist are gone from it), no duplicate step, market
routing untouched, and no duplicate cards anywhere.

## 6. Public/demo isolation proof

A full public build (`npm run build`, no preview flag) was run and inspected:

| Check | Result |
|---|---|
| Public Water Basics path | **unchanged** — steps `res-0014`, `res-0015`, `res-0017`, `res-0016` |
| Its rendered page links | the four **demo** routes (water-security-guide, water-storage-calculator, water-storage-checklist, rainwater-harvesting-planner) |
| Private ids on that page | **none** |
| Private slugs anywhere in the public build | **0 files** (`household-water-treatment-guide`, `water-tank-sizing-and-placement-guide`) |
| Private resource routes in the public build | **none** — 30 demo resource routes only |
| Public validation | **passes**: 30 resources, 30 published, 3 learning paths |
| Staged files left behind after the preview build | **0** in `data/`, **0** PDFs in `public/resources/` |
| Private files in git | **0** |

## 7. Deployment result

**Success.** The override is live in the protected preview. Unauthenticated probes return **302** to the Access login
for `/`, **`/learning-paths/water-basics/`**, `/downloads/`, the treatment guide's page and the tank guide's NZ PDF.

Pre-flight: `import:prep` 19/19 · `import:verify-prep` **38/38** · `import:verify-build` **19 records, 38 market
files, 0 broken internal links** · **all 38 PDFs byte-identical to the previous deployment** (no resource changed).

## 8. Worker version

**`1e4ab83b-4086-4c18-bf09-f6024152abbb`**

## 9. Protected resource count

**19**, unchanged — this stage added a pathway, not a resource. All 19 private records are `status: draft`.

## 10. Tests

**390 passing** (377 → **+13**). Lint clean, typecheck clean.

- **5 on path supersession**: private replaces demo in the preview; refused outside it; private+private fails;
  demo+demo fails; non-colliding paths untouched.
- **3 on the private path itself**: the exact four-step order with no placeholder and no duplicate, every step
  backed by a real private record; staged only by `build:preview` and git-ignored; the public demonstration path
  unchanged and still the one the public build loads.
- **5 on OG-02**: the exemption covers exactly the two audited labels with the audit recorded; it holds on the
  hazard checklist; it lapses on each of six kinds of fire teaching; it lapses on any other fire wording; and the
  fire-exemption list is exactly OG-02 and OG-B08.

## 11. Rollback

**`7eee1f48-82c3-483f-8d0b-4b2d4c47e586`** (19 resources, demonstration Water Basics path) is in the deployment
history, with its private files in `workspace/backups/private-assets-7eee1f48` (57 files). The new state is backed up
in `workspace/backups/private-assets-1e4ab83b` (58 files — the extra one is the private path). Rolling back restores
the demonstration pathway and changes nothing else: no record, PDF or route was touched.

## 12. Stage 9.48 proposal — numeric claim registry

**Not implemented.** This is the design for your review.

### Schema (`admin-import/config/numeric-claims.json`)

```jsonc
{
  "description": "...",
  "status": "OWNER-APPROVED <date> (Stage 9.48)",
  "claims": [
    {
      "id": "nz-tank-stand-height",           // stable, market-prefixed
      "market": "NZ",                          // NZ | AU — never both
      "jurisdiction": "national",              // or "NSW (state-specific)"
      "owningResources": ["OG-10", "OG-B08"], // where it may appear; [] means any resource in that market
      "category": "height",                    // see the categories below
      "claimType": "threshold",                // value | range | threshold | ratio | interval | conversion | example
      "unit": "m",
      "value": { "min": 0.3, "max": 1.0 },    // or { "exact": 1000 }, or { "text": "one minute" }
      "allowedWording": "over 30cm and under one metre; over one metre generally needs a building consent",
      "match": ["\\bover 30cm\\b[\\s\\S]{0,80}\\bunder one metre\\b"],
      "requiresLabel": "MBIE",                // wording that must appear in the same sentence, or null
      "source": "https://www.building.govt.nz/...",
      "authority": "Building Performance, MBIE",
      "sourceDate": "2026-01-15",
      "limitations": ["A stand above one metre is a consent question, not a design instruction."],
      "status": "VERIFIED_LIVE — OWNER-APPROVED <date>"
    }
  ]
}
```

### Categories to detect

capacity (L, kL, gallons) · distance and clearance (m, mm, cm) · height · weight and load (kg, t) · pressure (kPa,
bar) · duration and interval (minutes, hours, days, monthly, annually) · temperature (°C) · percentages · plus a
catch-all for ratios and doses already covered by `treatment-sources.json`, which stays as it is and is consulted
first so nothing is registered twice.

### Matching strategy

Context, not bare numbers — the same shape as the treatment gates, which is the part that has been proven in
practice:

1. Find a **number with a unit** in a rendered sentence (tables read row-wise, as the treatment gates already do).
2. Classify it by unit and by the nouns around it (tank, stand, roof, screen, pump, interval…).
3. Look for a claim in the registry with the **same market**, a matching category and a `match` pattern that the
   sentence satisfies; if `requiresLabel` is set, that wording must be in the same sentence, which is what keeps
   NSW figures labelled NSW.
4. If `owningResources` is non-empty, the resource being prepared must be in it — that stops a figure verified for
   one resource drifting into another.
5. No match → **fail closed**, exactly as `UNSOURCED_*` does today, with the sentence and the reason.

### Seeding the 19 live resources without false failures

The risk is obvious: switch it on and every existing figure fails at once. The sequence that avoids that:

1. **Inventory first, block nothing.** Run the detector over the 38 prepared files in *report-only* mode and produce
   a table of every numeric claim it finds, grouped by market and resource — expected to be roughly 120–180 figures,
   most of them worksheet furniture (field widths, page numbers, "30-Day", tier numbers) rather than claims.
2. **Triage that table into four buckets**: *already sourced* (MBIE tank sizes, NSW screens, the storage baselines,
   the weight conversion), *structural noise* to exclude by pattern (page numbers, CSS-driven values, dates,
   resource codes), *needs a source* (anything real and unattributed — the interesting output of the whole exercise),
   and *not a claim* (a member's own input field).
3. **Seed the registry from bucket one only**, each entry carrying the source and date already recorded in the stage
   reports, so nothing new has to be researched to reach a green build.
4. **Turn the gate on in report-only mode across all 19**, confirm zero unexplained findings, then flip it to
   blocking in the same commit as the tests.
5. **Bucket three goes back to you as a list** — figures that are live today and have no recorded source. That is the
   real prize, and it is better found deliberately than discovered by a future edit.

**Estimated shape:** one config file, one detector module, one prep hook, and a seeding pass over the live set; no
member content changes unless bucket three turns something up.

**Stopped.** The public demonstration path is unchanged, OG-13 is not started, and `numeric-claims.json` is not
implemented.
