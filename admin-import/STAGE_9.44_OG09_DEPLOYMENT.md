# HOUSEHOLD WATER TREATMENT GUIDE (OG-09) · DEPLOYED TO PRIVATE PREVIEW (#18)

**Status:** live in the private preview as the **18th** protected draft resource, and the **third** water resource.

- **Worker version:** `ac0d053a-8abd-4965-8bfe-3cae8ea943a5`
- **Route:** `/resources/household-water-treatment-guide/` — a new route; no placeholder held it, so there was no
  supersession and no collision
- **Rollback:** `d993cb64-676a-46bc-80eb-f4c9850fb0ea` (17 resources)
- **Date:** 23 September 2026 · **Stage:** 9.44, implementing the Stage 9.43 rulings

---

## 1. Push confirmation

`git push origin main` → `2ec6dc6..627ad87  main -> main`. `origin/main` is at
**`627ad874002238d56074ff839a2e7329bf9c2090`** and contains `admin-import/audit/treatment.ts`,
`admin-import/config/treatment-sources.json`, `tests/unit/treatment.test.ts` and both stage reports. No member file
went with it.

## 2. OG-08 current-content audit (ruling 8)

Three layers, audited separately.

| Layer | Treatment mentions | Teaching signals | What it actually says |
|---|---|---|---|
| **A. OG-08's own migrated text** | **1** — "filtration" | **0** | One sequencing line: *"Do not plan rainwater tanks or filtration systems before you have basic stored water covered."* It tells a member what to do first. No method, no dose, no efficacy claim. On its own text alone OG-08 requires only `stored-drinking-water`. |
| **B. Injected safety blocks** | NZ 2 · AU 0 | 0 | NZ: the storage block's *"add five drops of plain, unscented household bleach per litre… at least 30 minutes"* and *"Disinfect collected rainwater before drinking it…"*. AU: *"boil it vigorously for at least one minute…"*. Both match approved registry claims (`nz-bleach-storage-dose`, `au-boil-one-minute-wa`). |
| **C. Legacy source** | **3** | **1** | The removed dosing line *"Add 5 drops of plain unscented bleach per litre if treating uncertain water sources"*, the sequencing line, and the old navigation *"Next: OG-09 Water Filtration Comparison Matrix"* — which is where the "comparison matrix" teaching signal came from. **This layer is what raised the detector, and none of it is member-facing.** |

**Conclusion:** the migrated OG-08 teaches storage calculation only. The treatment wording was removed at migration.

## 3. OG-08 exemption and classification (rulings 9 and 10)

Recorded in `metadata-review.json` under OG-08: one `safetyExemptions` entry for `water-treatment`, with
`allowedMentions: ["filtration systems"]`, the owner's reason, and a `safetyExemptionsAudit` block holding all three
layers, the final-output gate result and the lapse rule.

**It fails closed, two ways:**

1. **Any unreviewed treatment word** — bleach, chlorination, boiling, filter, UV, purification, disinfection — breaks
   it, because every treatment mention outside the one reviewed phrase counts against it.
2. **Any treatment *teaching* signal**, even with no treatment word at all. `exemptionHolds` now also runs the
   detector's teaching test for this block, so *"The cartridge removes bacteria from the tank"* lapses the exemption
   although it names no method. A test proves exactly that case.

**Scope:** OG-08 alone. No global exemption, no exempted phrase anywhere else — a test asserts that OG-08 is the only
resource exempted from this block, and that the same phrase plus a dose still fails.

**Final-output gates (ruling 10):** `treatmentFindings` on the **finished, rendered** OG-08 files —
**NZ 0 findings · AU 0 findings**. The storage block's claims matched the registry. Nothing bypassed a gate, and
nothing needed silencing.

## 4. Title and route (ruling 4)

| | |
|---|---|
| Member-facing title | **Household Water Treatment Guide** |
| PDF title | **Household Water Treatment Guide — OffGrid056** |
| Slug and route | **`/resources/household-water-treatment-guide/`** |
| Running header, both pages | **Household Water Treatment Guide** |
| Cover | **Household Water<br>Treatment Guide** |
| `legacyCode` | `OG-09` — internal only, never rendered |
| Related-resource and learning-path references | **none existed** — nothing in `data/` pointed at `res-1009` or at a filtration route, so there was nothing to remap. OG-09's own links to OG-08 and OG-10 are set. |
| Old naming anywhere in the build | **0 occurrences** of `water-filtration-comparison-matrix`; no visible "Filtration Comparison Matrix" or "Water Filtration" in either PDF |

The rename runs through the record because prep now takes an owner-approved `title`, from which the slug, the route
and the PDF title follow. The document's cover and header were changed by two approved copy changes, so the page and
the record cannot drift apart.

## 5. Final NZ PDF

| Check | Result |
|---|---|
| File | `household-water-treatment-guide.NZ.pdf` · **8 pages** |
| Title | Household Water Treatment Guide — OffGrid056 |
| Emergency numbers | **111 only** |
| NZ treatment content | boil one minute · 5 drops per litre / half a teaspoon per 10 litres · protozoa limit · filter caution · MBIE's four options · annual testing · annual tank inspection |
| AU content | **none** — no NSW, WA Health, micron, rolling boil, "Australian", 000, SES, Bureau of Meteorology |
| Blocks | Making water safe to drink · Storing drinking water |
| Treatment gates | **0 findings** |
| Removed | no Berkey, no prices, no "Removes Bacteria", no maintenance intervals, no "Quick Decision Framework", no creek/stream/lake shortcut |
| Legacy | no OG code, no "Asset", no "Day 9 Complete", no "Week 2", no 30-Day Programme |
| Tokens · VERIFY | none |
| Status | draft |

## 6. Final AU PDF

| Check | Result |
|---|---|
| File | `household-water-treatment-guide.AU.pdf` · **9 pages** |
| Emergency numbers | **000 (and 112) only** |
| National vs state | NHMRC labelled national; NSW labelled NSW; WA labelled WA; "no single national Australian ratio" present |
| Operator testing | present **and labelled** "for private water supply operators, not for households" |
| NZ content | **none** — no MBIE, Taumata Arowai, HealthEd/HE10148, NIWA, 111, Civil Defence, "New Zealand" |
| Treatment gates | **0 findings** |
| Everything else | as NZ: removed content gone, legacy gone, no tokens, draft |

## 7. Gate regression (ruling 12)

`tests/unit/treatment.test.ts` — **23 passed**, covering every case listed:

| Case | Result |
|---|---|
| NZ treatment in NZ · AU treatment in AU | **pass** (0 findings) |
| NZ treatment in AU | **blocked** — ratio, boil time, filter claim |
| AU treatment in NZ | **blocked** — both state ratios, UV, filter claims |
| No registry | **fails closed** — every claim blocked |
| Unsupported bleach ratio · boil time · filter claim · UV claim · testing interval | **blocked**, each |
| Contamination guidance with no limitation | **blocked**; with the limitation present, passes |
| Extra | altitude wording always blocked · micron values AU-only · a standing time is not read as a boil time · a comparison table's rows are read as claims · the registry has no cross-market claim · enHealth is cited nowhere |

## 8. Deployment result

**Success.** 550 files uploaded. Every unauthenticated probe redirects (302) to the Access login:
`/`, `/downloads/`, `/foundations/water/`, the OG-09 page, and **both** OG-09 PDFs.

**Before deploying:** `import:prep` 18/18 with all changes applied · `import:verify-prep` **36/36 files** ·
`import:verify-build` **18 records, 36 market files, 0 broken internal links** · the staged PDFs are byte-identical to
the verified ones · **all 34 earlier PDFs unchanged** · routing checked locally (no market → **no download**, NZ → NZ
only, AU → AU only; one card on Downloads, one on the Water foundation page, matching the live OG-10 exactly).

## 9. Worker version

**`ac0d053a-8abd-4965-8bfe-3cae8ea943a5`**

## 10. Protected resource count

**18** draft resources (36 market files): OG-02, OG-08, **OG-09**, OG-10, OG-11, OG-15, OG-18, OG-19, OG-20, OG-21,
OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B07, OG-B10, OG-B12. All 18 private records are `status: draft`.

## 11. Tests

**368 passing** (361 → +7: five for the OG-08 exemption, two for the rename). Lint clean, typecheck clean.

## 12. Rollback

**`d993cb64-676a-46bc-80eb-f4c9850fb0ea`** (17 resources) is in the deployment history, with its private files in
`workspace/backups/private-assets-d993cb64` (51 files). The new live state is backed up in
`workspace/backups/private-assets-ac0d053a` (54 files). Rolling back removes the new route; nothing else changes,
because no existing record was touched.

**Other controls:** `--real` refused · private member files in git: **0** (`private-assets/` is ignored) · public/demo
build unchanged.

## 13. Next recommended water resource

**OG-B08 — Water Tank Sizing & Placement Guide.** It completes the water pathway (need → collection → treatment →
tanks), needs **no new safety research** (drinking water, working at height and now water treatment are all approved),
and its subject sits directly beside OG-10, which is already live and carries the tank wording it will build on.

Two things to decide when that stage opens: whether OG-B08 should carry the new `water-treatment` block (its source
will tell us), and whether the **Water Basics learning path** — which still points at demonstration placeholders —
should be rebuilt on the three real water resources now that they exist.

**Stopped.** OG-B08 and OG-13 not started.
