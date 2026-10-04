# AIR SAFETY ARCHITECTURE · BUILT (OG-13 NOT MIGRATED, NO PDFs, NOTHING DEPLOYED)

**Date:** 23 September 2026 · **Stage:** 9.52

Worker still `0aff3fcd-7080-4ae7-bf28-c5d09414b90a` · **19** protected drafts · **38** market files · all 38 PDFs
untouched · `private-assets/` still 58 files, none written this stage · `--real` refused · public/demo unchanged.

**Two things are withheld and need your ruling before they can be written:** the bleach step in both markets' mould
wording (§5), and the category slug for OG-13 (§2). Everything else in the brief is built.

---

## 1. Push confirmation

`git push origin main` → `02711ee..0e8b914  main -> main`. **`origin/main` =
`0e8b914c3ec8915f9b472377712d1a3021beacca`**, containing `admin-import/STAGE_9.51_OG13_AIR_RESEARCH.md` and the
Stage 9.51 register updates.

## 2. OG-13 metadata — recorded, with one field that cannot be recorded as approved

Filed in `config/metadata-review.json` as your decision. OG-13 is **not** migrated; this only files the ruling.

| Field | Recorded |
|---|---|
| title | **Healthy Home Air Audit** |
| resourceType | **assessment** |
| foundation | **air** |
| difficulty | **beginner** — OWNER-APPROVED / INFERRED |
| estimatedTime | **20 minutes** — OWNER-APPROVED / INFERRED, metadata only, not restated in the copy |
| status | **draft** |
| tags | `[]` |

**`category: air-quality` does not exist.** The air foundation's category slugs are `ventilation`,
`dampness-moisture`, `indoor-air-quality`, `healthy-home-checks`, `air-worksheets` and `air-checklists`. I have
recorded **`indoor-air-quality`** as the nearest match to what you approved and marked it **NEEDS OWNER
CONFIRMATION**, because `healthy-home-checks` — "Walk-through checks for a drier, healthier home" — is arguably the
better fit for a room-by-room audit. Schema validation fails on `air-quality`, so this has to be settled before
OG-13 is prepared. I did not want to pick for you silently.

## 3. `fire-and-smoke-alarms` — built

NZ: FENZ (long-life photoelectric, interconnection, placement, the kitchen exception and a heat alarm) plus the
maintenance routine, plus Tenancy Services' legal requirement for rentals.

AU: **no national rule is stated anywhere in the block.** It opens by saying the rules differ by state and territory,
then gives Fire and Rescue NSW's routine **attributed in every sentence**, then Queensland's requirement as
legislation staged 2017 → 2022 → **1 January 2027**, then FRNSW's point that what matters is the number of alarms,
their placement and interconnection rather than sensor type.

**It answers the detector without renaming the detector.** The topic detector asks for `fire-and-emergency`; the
approved wording is `fire-and-smoke-alarms`. The block declares `answers: ["fire-and-emergency"]`, and prep treats a
requirement as met by an included block that declares it. That keeps the two reviewed hazard-label exemptions —
OG-02 (Stage 9.47) and OG-B08 (Stage 9.46) — pointing at exactly the requirement you approved them against, and the
mechanism can only ever *satisfy* a requirement for a resource that actually carries the block. It cannot suppress
one.

## 4. `home-ventilation` — built

NZ uses MBIE's figures: extraction in the kitchen, bathroom and laundry **vented outside, not into the roof space**;
the dryer vented outside or a condensing/heat-pump type; **airing for about 15 minutes several times a day**;
**18–22°C**; **up to 40 litres a day** of ground moisture with no vapour barrier; and MBIE's own conclusion that a
dehumidifier should not be needed.

AU is **non-numeric, and says so in the member-facing text**: "No Australian source read for this guidance publishes
an airing time, an indoor humidity target or an extraction rate for homes, so none is given here — and a New Zealand
figure must not be borrowed for an Australian home." The rest is NSW Health's ventilation and water-damage wording.
**No gas appliance is named in either market**, so MBIE's unflued-gas advice is left for the gas stage.

## 5. `mould-and-dampness` — built, with the bleach step WITHHELD · **ruling needed**

Built: NZ gets Tenancy Services' prevention list, **white vinegar diluted half and half on painted surfaces**, the
leave-then-wipe method, rinsing the cloth, **gloves, eye protection and a safety mask**, and the building surveyor
and landlord routes. AU gets NSW Health's moisture-first framing, **mild detergent or four parts vinegar to one part
water**, Better Health Channel's cleaning technique, the absorbent-materials and occupational-hygienist routes, and
NSW Health's calm health wording ("most people will not experience any health problems", public health unit
1300 066 055).

**Withheld in both markets: every bleach instruction.** Your ruling was that if the source wording is ambiguous I
must stop and return it rather than implement it. New South Wales' reads as a *sequence*, which is the exact risk you
named. Here is the wording, verbatim, read live 2026-09-23:

> **NSW Health** — *Mould* fact sheet (current as at 20 December 2022):
> "For routine clean-up of mouldy surfaces, use mild detergent or vinegar diluted in water solution (4 parts vinegar
> to 1 part water). If the mould is not readily removed and the item cannot be discarded, use diluted bleach solution
> (250mls of bleach in 4 litres of water) to clean the surface. When using bleach, protective equipment is
> recommended: PVC or nitrate rubber gloves; safety glasses; and safety shoes. Make sure the area is well-ventilated
> while you are cleaning with bleach. Ensure the surface is dried completely once cleaned."

> **Tenancy Services (NZ)** — *Mould and dampness* (last updated 12 May 2022):
> "White vinegar is a cheap and effective way to clean mould. On painted surfaces, dilute the vinegar with water
> (half and half) to avoid damaging the paint. Leave it for a few days then wipe off the dead mould with soap and
> water using a clean cloth. You can also use diluted household bleach. Mix one part bleach with three parts water
> in a bucket of water. Use a clean sponge or cloth when washing off mould and rinse it often. This reduces the risk
> of the mould spreading. Wear gloves, eye protection and a safety mask when dealing with cleaning products and
> mould."

**Three observations you should have before ruling.**

1. **New Zealand's is unambiguous — alternatives** ("You can also use diluted household bleach"). New South Wales'
   is **sequential** ("If the mould is not readily removed … use diluted bleach solution"). I withheld both rather
   than implement one and withhold the other, because a block that offers vinegar in one market and vinegar-then-
   bleach in the other invites exactly the copying between markets this architecture exists to prevent.
2. **NSW's PPE list belongs to bleach, not to vinegar.** "When using bleach, protective equipment is recommended:
   PVC or nitrate rubber gloves; safety glasses; and safety shoes." Attaching it to the vinegar method — which is
   what a casual merge would do — would misattribute the source. The AU block therefore carries Better Health
   Channel's general cleaning technique instead, and **no PPE list**, which is a real gap if you approve bleach.
3. **I found no never-mix source for New Zealand.** The only live-read one is Victorian: Better Health Channel,
   *Mould removal at home* — "Do not mix bleach with ammonia, acids or other cleaners – this can release hazardous
   chlorine or chloramine fumes." I have put that in the **AU** block, attributed to Better Health Channel
   (Victorian Department of Health), and flag it as a source added this stage for your confirmation. **The NZ block
   mentions bleach nowhere at all**, so no mixing caution is asserted there and none is invented. A test enforces
   both facts.

**Three options when you rule:** (a) approve each market's own bleach wording as the source writes it, with NZ's
PPE for NZ and NSW's bleach-specific PPE for AU; (b) leave bleach out permanently and keep both markets on
detergent and vinegar; (c) approve bleach for AU only, where the source actually escalates to it. I have no
recommendation that is not a judgement about your members, so I have implemented none of them.

## 6. The CO ruling, and ESV GIS-36 — returned separately, as asked

**"CO detectors under 5 years old" is removed, and no replacement lifespan exists.** No NZ or AU household source
publishes one. A test asserts that none of the three new blocks mentions carbon monoxide at all, and that the
approved `carbon-monoxide` block still carries no five-year life. **The CO architecture is unchanged.**

**ESV GIS-36 was retrievable and I read it fully** — *"GIS 36: Carbon monoxide alarms for domestic use"*, Energy Safe
Victoria. The supported wording, verbatim where it matters:

- CO alarms "can be a useful back-up precaution but should not be considered a substitute for the proper
  installation and regular maintenance of gas appliances, every two years".
- Electrochemical CO alarms "have a limited life span of around 2 to 7 years, but their life expectancy and
  effectiveness will vary depending on their environment … battery condition, and the level of exposure to CO".
- Some "provide a visual and audible warning when the electrochemical sensing cell has expired (which is the ideal
  type), while others may only provide a use-by date".
- They "are pre-calibrated and do not require maintenance other than to clean the outside case occasionally and
  ensure the holes on the front of the unit are kept clear".
- "CO alarms only detect CO gas. They do not detect smoke, fire, or other types of gas."
- Placement: audible from all sleeping areas; near gas heating appliances per the manufacturer; close to the
  bedhead; **not** near gas cooking, **not** in damp areas, **not** in dead air spaces.

**I have used none of it, deliberately, for two reasons.** It is **Victorian** industry guidance, so it could only
ever be state-labelled AU wording, never national and never New Zealand. And it is **gas-adjacent throughout** — its
servicing interval, its placement list and its purpose all reference gas appliances — so using it would pull gas
wording into the library while `GAS_SAFETY_REQUIRED` still fails closed on all of it. **It also does not give you a
lifespan rule:** "around 2 to 7 years … will vary" is a range with a dependency, not a replace-at test, which is
precisely why "under 5 years old" had no source to begin with. The usable sentence, if you want one later, is the
expiry-date one — and that is an owner decision for the gas stage, not this one.

## 7. The ratio claim type — built

A dilution carries no unit, so the unit scanner could never see it. `claimType: "ratio"` now exists, and a ratio is
detected as a **capacity** candidate measured in **parts** — a ratio of volumes is still a volume claim, so it blocks
under the capacity activation rather than needing a new blocking category, exactly as you asked.

| Property | How it holds |
|---|---|
| **Context aware** | the sentence must be about **mixing or diluting**; a bare "1:3" in prose is not a dilution |
| **Not a score** | a scoring instrument is refused outright — `score`, `scale`, `rating`, `out of 5`, `points`, `tier`, `weighting`. OG-13's own 1–5 room scores and its "10–20 = Critical" bands are not chemistry, and a test proves it |
| **Market scoped** | NZ's half-and-half fails in an AU file; NSW's 4:1 fails in an NZ file |
| **Resource scoped** | the entries are owned by OG-13; the same words elsewhere have nothing to match |
| **Source backed** | explained only by an entry whose `claimType` is `ratio`, with authority, date and limitations |
| **Fail closed** | no entry, no figure: an unregistered ratio is `C_NEEDS_SOURCE` and blocks the market |
| **Treatment first** | a **bleach** ratio still belongs to `treatment-sources.json`; the numeric scanner classifies it `E_TREATMENT_OWNED` and offers no second opinion |

Patterns: `N part(s) X to M part(s) Y`, `half and half`, and `N:M`. Three forms, both guards, no allow-list.

## 8. Numeric registry — 12 new entries, only for figures the blocks actually use

**17 → 29 claims.** Each carries market, jurisdiction, owning resource, claim type, value, unit or ratio, source,
authority, date, limitations and label requirement.

| id | Market | Category · type | Figure | Label required |
|---|---|---|---|---|
| nz-smoke-alarm-maintenance-fenz | NZ | interval · interval | monthly test, six-monthly vacuum, yearly expiry and battery, ten-year replacement | — (FENZ names the routine in the block) |
| nz-smoke-alarm-9v-battery-fenz | NZ | power · value | 9V battery | — |
| nz-rental-alarm-3m-tenancy | NZ | distance · threshold | three metres of each bedroom door | Tenancy Services |
| nz-airing-15-minutes-mbie | NZ | interval · example | 15 minutes, several times a day | — |
| nz-indoor-temperature-mbie | NZ | temperature · range | 18–22°C | — |
| nz-ground-moisture-litres-mbie | NZ | capacity · threshold | up to 40 litres a day | — |
| nz-mould-vinegar-half-and-half-tenancy | NZ | capacity · **ratio** | half and half | Tenancy Services |
| au-smoke-alarm-maintenance-nsw | AU | interval · interval | monthly, six-monthly, 12-monthly, ten-year | Fire and Rescue NSW |
| au-smoke-alarm-test-seconds-nsw | AU | interval · threshold | at least five seconds | Fire and Rescue NSW |
| au-smoke-alarm-ten-years-law-nsw | AU | interval · threshold | within 10 years of manufacture | NSW |
| au-qld-alarm-ten-year-battery-qfd | AU | interval · threshold | non-removable ten-year battery | Queensland |
| au-mould-vinegar-ratio-nsw | AU | capacity · **ratio** | four parts vinegar to one part water | NSW Health |

**No bleach entry exists in either market.** NSW's 250 mL in 4 litres and Tenancy Services' one-part-to-three are
recorded in the registry header as withheld, with no `match` pattern, so they cannot pass anything.

**Temperature gets its first real claim.** Stage 9.50 recorded temperature and pressure as switched on but never
exercised; `nz-indoor-temperature-mbie` is the first temperature entry in the library. Pressure is still
theoretical, and **no area or power figure has yet made a test fail** — unchanged and still worth saying.

**Queensland's 2017 / 2022 / 1 January 2027 are classified `B_STRUCTURAL`** (the detector reads them as dates), so
they are not registry entries. The Queensland attribution and the staging stay in the block's own wording, and the
`changeRule` says so.

## 9. One architecture finding, reported rather than fixed

**The water-treatment gate `UNSOURCED_TESTING_INTERVAL` has no topic context**, so it fires on any sentence that
contains a testing word and a recognised interval — including a smoke alarm maintenance routine.

I did **not** narrow it. Instead the blocks' routines are written **one instruction per sentence**, which is how both
agencies write them anyway, with the Australian attribution kept inside every sentence. That is the safer trade, and
the re-scan in §12 shows why: the same gate is currently the thing that blocks OG-13's legacy *"tested monthly, under
10 years old"* and *"tested monthly, under 5 years old"* rows in both markets. Narrowing it to water would have
quietly unblocked them.

**What this means for OG-13's migration:** its own copy will need the same discipline. A row that says "tested
monthly" and "every six months" in one sentence will fail the treatment gate even though it is about alarms. Whether
to give that gate a water-topic condition is a decision for you, not a fix I should make while building something
else.

## 10. Regression tests — 12 named, all passing

| # | Test |
|---|---|
| 1 | sees a unitless dilution ratio that the unit scanner cannot see |
| 2 | fails closed on an unregistered ratio, and blocks the market |
| 3 | accepts a registered ratio in its own market, with its attribution |
| 4 | does not let a ratio travel between markets |
| 5 | does not mistake a scoring instrument for a ratio (1:5 scores, "10-20 = Critical", "out of 5") |
| 6 | leaves a bleach ratio to the treatment architecture rather than judging it here |
| 7 | answers the fire detector's requirement **only** for a resource that carries the block |
| 8 | changes nothing for the two resources that hold a reviewed fire exemption |
| 9 | leaves no unsourced figure in any of the three blocks, in either market |
| 10 | keeps every market-specific figure and dilution on its own side |
| 11 | instructs no bleach cleaning method while the owner ruling is outstanding |
| 12 | writes no carbon monoxide alarm lifespan anywhere, in either market |

**Suite: 429 passing** (417 → **+12**), lint clean, typecheck clean.

**One known flake, reported as always:** `importer.test.ts > infers a foundation with confidence and evidence` times
out at 5 s under full-suite load. Run alone it passes **30/30**. It is untouched and unrelated to this stage.

## 11. Full library re-run — green, and nothing moved

- `import:prep` across all 19 resources → **19/19 `READY_AFTER_FINAL_VALIDATION`**, **38 market files**, **zero**
  market problems, **zero** gate findings of any kind
- `import:verify-prep` → **all prepared files verified**
- `import:verify-build` → **records 19 · market files 38 · broken internal links 0 · deployment build verified**
- Numeric scan across every prepared file: **313 candidates — A 156 · B 2 · C_NEEDS_SOURCE 0 · D 111 · E 44**,
  identical to Stage 9.50. **Target met: C = 0.**
- **No resource broke, so no exemption was created.** Nothing to stop and report on.
- **No member content changed.** `private-assets/` still holds 58 files and 38 PDFs, none written this stage; no
  copy, title, route, record, learning path or existing safety wording was touched. The changed files are
  `audit/numeric.ts`, `markets/resolve.ts`, `pilot/prep.ts`, `config/safety-blocks.json`,
  `config/numeric-claims.json`, `config/metadata-review.json` (OG-13's decision only) and one new test file.
- **No live ratio candidate exists yet.** Nothing in the current 19 resources carries a dilution outside treatment,
  so the ratio path is exercised by tests and by the new blocks' own wording, not by live member content. Said
  plainly, as with pressure.

## 12. OG-13 re-scan — read only, nothing prepared

Run against the legacy source with the extended architecture. **Identical results in both markets.**

| Verdict | Claims |
|---|---|
| **READY TO KEEP** | "working on every level" · "near sleeping areas" · no black or green spots · musty smell · condensation and windows dry in the morning · range hood extracts rather than recirculates (strengthen with MBIE's vent-outside-not-into-the-roof-space) · can open windows, no blocked vents, bedding aired · wood burner serviced, flue clear, no cracks in firebox (approved solid-fuel block) · the 1–5 scale and its bands, as OffGrid056's own labelled instrument |
| **READY TO REWRITE** | smoke alarms "tested monthly, under 10 years old" → **monthly test plus replace at ten years plus an annual expiry check**, which is what FENZ and FRNSW actually publish · "the damage is cumulative" → NSW Health's own calmer wording · masks → **AU only, as NSW Health supports it**; NZ asks whether the household can shut the house up and follow official advice, with **no NZ mask claim** · trickle vents → kept as a question, not as a claim |
| **MUST REMOVE** | "3 weeks without food but only 3 minutes without clean air" · "more hospitalisations than power outages" · "could prevent years of health problems" · **CO "under 5 years old"** (no replacement lifespan) · CO "tested monthly" (no source in either market) · "shower steam clears within 10 minutes" · "drops humidity below mould threshold" · "highest life-saving ROI" · **all five prices — $50, $15–$30, $10–$20, $40–$80, $5 — and the whole "Quick Wins Under $50" box.** No pricing registry entry was created, as instructed |
| **STILL BLOCKED** | the two alarm rows, by `UNSOURCED_TESTING_INTERVAL` in **both** markets (see §9) · 10 `C_NEEDS_SOURCE` figures per market: "3 weeks", "3 minutes", "10 years", "monthly" ×2, "5 years", and the four prices. All of them are on the MUST REMOVE or READY TO REWRITE list, so **nothing here needs a new registry entry** |

**A correction to Stage 9.51.** I reported that the fire detector blocks OG-13. Measured directly, the legacy
source's visible text carries **two** fire mentions ("Smoke alarm", "fire") against the detector's threshold of
three, so **the detector does not currently require the fire block for OG-13** — and `safetyExposureFor` returns
nothing at all for it. What *is* true: `fireTeachingSignals` finds "smoke alarms", so a hazard-label exemption could
never hold; and the treatment gate blocks the alarm rows anyway. OG-13 is still blocked, by a different gate than I
said. **The gap is worth your attention:** a rebuilt OG-13 that teaches alarm guidance may not *require* the fire
block by mention count, so its blocks must be carried deliberately in `metadata-review.json` rather than relied on
from the detector. Carbon monoxide and solid fuel have the same property — CO has no topic detector entry at all, and
the source's two flue mentions are below the solid-fuel threshold.

## 13. What was not done, and what I recommend next

**Not done, as instructed:** OG-13 is **not migrated**, **no OG-13 PDFs** were prepared, **nothing was deployed**,
and **no Air learning path was built** — a one-resource pathway is not a pathway, and the second Air resource does
not exist yet.

**Stage 9.53 — the two rulings, then OG-13's migration.** It needs you first, on two things only: the **bleach
wording** (§5, three options) and the **category slug** (§2). Both are small, and both block the build. With those
settled, OG-13's migration is a normal claims-first stage: carry the three new blocks plus `carbon-monoxide` and
`solid-fuel-heating` explicitly in metadata, remove the five prices and three health claims, rewrite the alarm and
mask rows around the blocks' wording, keep every sentence clear of the treatment gate's testing-interval trap, and
prepare, render and deploy as resource #20.

**One thing I would raise separately, not bundle in:** whether `UNSOURCED_TESTING_INTERVAL` should gain a water-topic
condition (§9). It is working in our favour today and I would not change it in the same stage as a migration.

**Stopped.** No resource was migrated, no PDF was rendered, no deployment was made, and no exemption was created.
