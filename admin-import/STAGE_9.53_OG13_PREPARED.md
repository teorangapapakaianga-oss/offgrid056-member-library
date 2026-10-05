# OG-13 HEALTHY HOME AIR AUDIT · PREPARED FOR OWNER REVIEW (NOT DEPLOYED)

**Date:** 5 October 2026 · **Stage:** 9.53

Worker still `0aff3fcd-7080-4ae7-bf28-c5d09414b90a` · **19** deployed drafts, unchanged · `private-assets/` still
58 files and 38 PDFs, **nothing written** · `--real` refused · public/demo unchanged.

OG-13 is prepared in `workspace/prep/OG-13/` with both market PDFs rendered and verified. **Nothing was deployed.**

---

## 1. Taxonomy / category result — `healthy-home-air` ADDED

**It can be added safely, and I have added it so that preparation could actually run.** The exact addition, in
`data/taxonomy/foundations.json`, inside the `air` foundation's `categories`, after `healthy-home-checks`:

```json
{ "slug": "healthy-home-air", "name": "Healthy Home Air", "description": "The air inside your home: alarms, damp, mould, ventilation and smoke." }
```

**Why it is safe:** the addition is purely additive. `FoundationSchema` requires at least one category and validates
slug, name and description only; `tools/validate-content.ts` checks that each resource's category exists in its
foundation, not the reverse. A category with no resources renders its own empty state
(`No Healthy Home Air resources yet`), so the public demonstration build is unaffected. **`npx tsx
tools/validate-content.ts` passes**: 30 resources, 3 learning paths, content validation passed. A test now asserts
the slug exists, that slugs stay unique, and that OG-13's recorded category is one the taxonomy holds.

**One thing you should know before this is final.** The air foundation already has **`healthy-home-checks` —
"Walk-through checks for a drier, healthier home"** — which describes this exact resource. The foundation now has
two near-synonymous categories, and `healthy-home-checks` holds one demonstration placeholder. Reverting is a
one-line change to the taxonomy plus one field in `metadata-review.json`. I applied your preference rather than
overriding it, but I would not have chosen two.

## 2. Exact OG-13 before/after claim changes

**22 approved copy changes: 8 shared, 7 NZ, 7 AU. All applied.** Recorded in `config/approved-copy.json` with an
exact `from`, `to`, expected match count and reason.

### Removed outright (shared)

| Before | After |
|---|---|
| `Week 2 — Water, Food & Air` (cover) | *removed* |
| `OffGrid056 30-Day Programme` (cover) | `OffGrid056 Member Library` |
| `alt="Week 2"` (cover image) | `alt="Air"` |
| `Asset OG-13 | Day 13` (×2 page headers) | `Air · Healthy Home` |
| **Quick Wins Under $50** box, whole: `$15–$30 each — highest life-saving ROI in your entire home`, `$10–$20 — trickle vents stop condensation`, `$40–$80 — drops humidity below mould threshold`, `$5 — kills visible mould on hard surfaces` | *removed entirely.* Five prices, the ROI claim, the invented mould threshold and the bleach line all go. **No pricing registry entry was created.** |
| `Day 13 Complete` + `Next: OG-14 Basic Survival Systems Mini-Plan →` + "the most critical survival system in your home" | `What You Have Found` + "You have walked the house and scored the ten things that decide the air in it… Your three lowest scores are your list." + `Start with anything you scored 1 or 2.` |

### Kept, but labelled as ours (shared)

| Before | After |
|---|---|
| `<h2>Scoring Scale</h2>` | the heading plus: *"This 1–5 scale, and the score bands further on, are OffGrid056's own way of ranking what to fix first. They are not an official standard, and no agency publishes them."* |
| `Add all 10 scores above` | `Add all 10 scores above — OffGrid056's own scale, not an official standard` |

The 1–5 scale and the 10–20 / 21–30 / 31–38 / 39–44 / 45–50 bands are unchanged. They are now unmistakably an
OffGrid056 instrument rather than something a member could read as official.

### The survival claim and the health claims

| Before | After |
|---|---|
| `You can survive 3 weeks without food but only 3 minutes without clean air. This audit identifies the invisible threats in your home… then tells you exactly how to fix them.` | **NZ:** "Score the ten things that decide the air you breathe — alarms, damp, mould, ventilation and smoke — then fix the three that score worst. New Zealand guidance throughout." **AU:** as above, ending "Australian guidance throughout, labelled by state where the rules differ." |
| `Mould, carbon monoxide, and poor ventilation cause more hospitalisations than power outages. The damage is cumulative — you do not feel it day to day, but your lungs do. This audit takes 20 minutes and could prevent years of health problems.` | **NZ:** "Damp, mould, smoke and carbon monoxide are all easy to get used to. Health New Zealand advises that smoke can make it hard for some people to breathe, and that older people, pregnant people, young children and people with asthma or heart disease are most at risk…" **AU:** "…NSW Health advises that mould may cause health problems for people who are sensitive or allergic to it — a runny or blocked nose, irritated eyes and skin, sometimes wheezing — and that for someone with asthma it may trigger an attack, **though most people will not experience any health problems**…" |

Three unsourced claims gone: the survival comparison, the hospitalisations comparison, and "could prevent years of
health problems". The replacements are each market's own agency wording, and the Australian one keeps NSW Health's
own reassurance rather than only its warnings.

### The audit rows that changed, per market

| Row | Before (both markets) | NZ after | AU after |
|---|---|---|---|
| **1. Smoke alarms** | `Working on every level, tested monthly, under 10 years old` | "One in every bedroom, hallway and living area. **Fire and Emergency New Zealand** advises testing once a month, checking the expiry date every year, and replacing alarms every ten years." | "Working on every level. **Fire and Rescue NSW** advises testing every month by holding the test button for at least five seconds, and replacing alarms every ten years. **In Queensland, interconnected photoelectric alarms are required by law** — check what applies where you live." |
| **2. CO alarms** | `Near sleeping areas, tested monthly, under 5 years old` | "Considered or installed, near sleeping areas" | "Installed near bedrooms" |
| **6. Kitchen ventilation** | `Range hood works; cooking fumes extracted, not recirculated` | "Range hood works, and the moist air is vented to the outside — **not into the roof space**, which is what Building Performance (MBIE) asks for." | "Range hood works, and cooking fumes go outside rather than being recirculated." |
| **7. Bathroom ventilation** | `Fan works; shower steam clears within 10 minutes` | "Extractor fan works **and vents to the outside**, and windows are opened after showering." | "Extractor fan works, and the bathroom is ventilated during and after showering." |
| **10. Masks** | `N95 or P2 masks available for dust/smoke events` | **row retitled "Smoke event plan":** "In a smoke event you can shut the house up, switch any air conditioning to recirculate, and follow official advice — which is what **Health New Zealand** advises." | **row retitled "P2 or N95 masks":** "Available for smoke events, and you know a mask only works if it **forms a tight seal** — which is what **NSW Health** advises. They are not designed to fit a child's face." |

**"Under 10 years old" and "under 5 years old" are both gone.** Neither is what any agency publishes: both publish
*replacement at ten years* for smoke alarms, New Zealand adds an annual expiry check, and **no source in either
market publishes a CO alarm lifespan or a CO test frequency at all.** Nothing replaced the CO figures.

**Row 10 is the sharpest market split in the library.** New Zealand gets no mask claim, because Health New Zealand's
page names no mask; Australia gets one, because NSW Health does — with the fit condition and the children
limitation attached, since the claim is misleading without them.

### Rows kept unchanged

3 (visible mould), 4 (musty smell), 5 (condensation), 8 (bedroom air), 9 (wood burner serviced, flue clear, no
cracks in firebox) — all observations, and row 9 is covered by the approved solid-fuel block.

## 3. NZ member-facing wording

Full text in `workspace/og13.NZ.txt`; **8 pages**. The shape:

- **Cover** — title, the new subtitle, `OffGrid056 Member Library`.
- **Safety blocks, in order:** In an emergency (111) · **Smoke alarms and fire safety** (FENZ: long-life
  photoelectric, interconnection, every bedroom/hallway/living area, not the kitchen; the maintenance routine —
  monthly test, six-monthly vacuum, annual expiry check and 9V battery, ten-year replacement; Tenancy Services'
  rental requirement including **three metres of each bedroom door** and the 1 July 2016 standard) · Carbon monoxide
  · Never bring it inside.
- **The audit** — the health framing box, the labelled 1–5 scale, the ten rows, the score summary and bands, the
  top-three worksheet, the closing box.
- **Then:** Before you start (disclaimer, NZ trades named) · **Mould and dampness** (Tenancy Services: prevention
  list; white vinegar, **diluted half and half on painted surfaces**; leave then wipe; rinse the cloth; **gloves, eye
  protection and a safety mask**; building surveyor and landlord routes) · **Ventilation and moisture** (MBIE: vent
  outside **not into the roof space**, dryer outside, **windows several times a day for 15 minutes**, **18–22°C**,
  **up to 40 litres a day** of ground moisture without a vapour barrier, and MBIE's own "you should not need a
  dehumidifier") · Wood burners and open fires.

**No bleach anywhere.** **No Australian figure, state or agency anywhere** — a test enforces both.

## 4. AU member-facing wording

Full text in `workspace/og13.AU.txt`; **9 pages**. Differences that matter:

- **In an emergency** is 000 / 112 / 106 TTY, SES rather than Civil Defence.
- **Smoke alarms and fire safety** opens by saying **there is no single national household smoke alarm rule in
  Australia**, then gives Fire and Rescue NSW's routine **attributed in every sentence** (monthly test, five-second
  hold, six-monthly vacuum, 12-monthly batteries, ten-year replacement, and NSW law's within-10-years-of-manufacture
  rule), then Queensland's requirement **named as Queensland legislation**, staged 2017 → 2022 → **1 January 2027**,
  then FRNSW's point that the number, placement and interconnection of alarms matters more than sensor type.
- **Mould and dampness** is NSW Health's moisture-first framing, **mild detergent or four parts vinegar to one part
  water**, Better Health Channel's cleaning technique, **Better Health Channel's PPE** (shower cap, rubber gloves,
  eye protection, overalls, suitable footwear, **P1 or P2 face mask**), who should not do the work, the **P2 medical
  caveat**, no dry brushing, HEPA vacuuming only, the absorbent-materials and occupational-hygienist routes, and
  NSW Health's health wording with the public health unit number.
- **Ventilation and moisture** states the gap in member-facing words: *"No Australian source read for this guidance
  publishes an airing time, an indoor humidity target or an extraction rate for homes, so none is given here. Judge
  it by what you can see and smell instead: condensation on the windows, a musty smell, or air that does not shift."*

**No bleach anywhere. No New Zealand figure, agency or name anywhere.** AU is one page longer than NZ because of the
Queensland paragraph and the Better Health Channel PPE paragraph.

## 5. Safety blocks triggered

| Block | How it got there |
|---|---|
| `general-disclaimer`, `emergency-contact` | standard on every resource |
| **`fire-and-smoke-alarms`** | **required by the detector** (as `fire-and-emergency`) and carried |
| **`solid-fuel-heating`** | **required by the detector** and carried |
| `mould-and-dampness`, `home-ventilation`, `carbon-monoxide`, `indoor-combustion` | carried by your ruling; the detectors do not demand them |

**Eight blocks — the most of any resource in the library.** `missingRequired: []`, **no exemption was created or
used**, and **the OG-02 fire exemption is neither referenced nor stretched**.

**A correction to Stage 9.52.** I reported there that the fire detector does not require the fire block for OG-13,
having measured the HTML's visible text (2 fire mentions against a threshold of 3). Prep uses the audit's extracted
text — **PDF and HTML together** — and on that it **does** require both `fire-and-emergency` and
`solid-fuel-heating`. Both are answered: `fire-and-smoke-alarms` satisfies the fire requirement through the
`answers` field built last stage, which is exactly what it was built for. The practical advice from that stage still
holds and is now acted on: the blocks are carried deliberately in `metadata-review.json` rather than relied on from
mention counts.

**One consequence you should decide on, not a blocker.** The approved `carbon-monoxide` and `indoor-combustion`
blocks both carry **gas and LPG wording** — "gas and LPG heaters" in the NZ CO block, "Have gas heaters checked by a
licensed gasfitter at least every two years" in the AU one, and a full unflued-gas-heater paragraph in
`indoor-combustion` for both markets. That wording is **owner-approved since Stage 9.19 and already live in five
resources**, so nothing unsupported has been introduced and `GAS_SAFETY_REQUIRED` does not fire (it is checked on the
resource's own text, which contains no gas wording at all). But Stage 9.51 recommended that the Air resource avoid
naming gas heaters until the gas research stage, and carrying `indoor-combustion` means it does name them. **The
audit has no row about bringing an outdoor appliance inside**, so that block is the one I would drop if you want the
gas surface smaller; `carbon-monoxide` earns its place through row 2. Say the word and it is one field.

## 6. Numeric registry findings

**Zero findings. Bucket C = 0 in both markets.**

| Market | Candidates | A sourced | C needs source |
|---|---|---|---|
| NZ | 12 | **12** | **0** |
| AU | 13 | **13** | **0** |

Every figure is explained by a Stage 9.52 registry entry or by the block that carries it. The entries now actually
earn their keep — these matched live member-facing text for the first time: `nz-smoke-alarm-maintenance-fenz`
(six months, 9V, ten years), `nz-rental-alarm-3m-tenancy` (three metres), `nz-airing-15-minutes-mbie` (15 minutes),
`nz-indoor-temperature-mbie` (**18–22°C — the library's first live temperature claim**),
`nz-ground-moisture-litres-mbie` (40 litres), `nz-mould-vinegar-half-and-half-tenancy` (**half and half — the first
live ratio claim**), `au-smoke-alarm-maintenance-nsw`, `au-smoke-alarm-test-seconds-nsw` (five seconds),
`au-smoke-alarm-ten-years-law-nsw`, `au-qld-alarm-ten-year-battery-qfd`, and `au-mould-vinegar-ratio-nsw`
(**four parts vinegar to one part water — the second live ratio claim**).

**Library-wide, with OG-13 included: 338 candidates — A 181 · B 2 · C_NEEDS_SOURCE 0 · D 111 · E 44.** Categories:
interval 248 · capacity 50 · distance 17 · percentage 11 · area 4 · height 4 · power 3 · **temperature 1**.
Temperature has gone from theoretical to exercised. Pressure is still neither.

**No new exemption of any kind was created in this stage.**

## 7. Owner ruling 1 — bleach removed, and the exact changes to the shared block

**Ruling applied. Neither market's wording names bleach at all**, and a test enforces it in both the block bodies
and the numeric registry.

The mould block already withheld every bleach *instruction* at Stage 9.52, so the ruling required **two exact
changes**, both reported here as the ruling asks:

1. **Removed from the AU body** — the Victorian never-mix caution, which was the only sentence left in either market
   that named bleach:
   > ~~"**Do not mix bleach with ammonia, acids or other cleaners — Better Health Channel warns this can release
   > hazardous chlorine or chloramine fumes.** If you use a commercially available product, check the label for how
   > much to use and on which surfaces it can be used, and always read and follow its safety instructions."~~

   replaced by the same source's general sentence, with no bleach in it:
   > "If you use a commercially available cleaning product, Better Health Channel advises checking the label for how
   > much to use and which surfaces it can be used on, and always reading and following its safety instructions."

   **My reasoning, for the record:** a caution against mixing bleach is protective, and dropping it is arguable. I
   dropped it because with no bleach instruction left anywhere, that sentence was the only thing introducing bleach
   into a document that otherwise never mentions it — which runs against the ruling's own stated reason. It is a
   one-line restore if you disagree.

2. **Added to the AU body** — PPE, which your ruling asks for and which AU did not have. NSW Health's PPE list
   ("PVC or nitrate rubber gloves; safety glasses; and safety shoes") is written **for cleaning with bleach**, so it
   could not be attached to the vinegar method without misattributing the source. Better Health Channel's
   mould-removal page, read live, gives non-bleach PPE instead: good ventilation, **shower cap, rubber gloves, eye
   protection, overalls, suitable footwear and a P1 or P2 face mask**; that pregnant women, children and people with
   weakened immune systems or chronic lung disease should not remove mould or be present; that anyone with a
   pre-existing heart or lung condition should **seek medical advice before using a P2 mask**; the asthma advice; no
   dry brushing; and HEPA-only vacuuming. NZ's PPE is unchanged (Tenancy Services: gloves, eye protection, safety
   mask).

**Withheld figures stay withheld and unregistered:** one part bleach to three parts water (Tenancy Services) and
250 mL of bleach in 4 litres of water (NSW Health). Neither has a registry entry or a match pattern, so neither can
pass anything. The block's `changeRule` now records the ruling, both withheld figures, and the PPE attribution rule.

**Two further block changes, both caught by reading the rendered files rather than by a gate, and both reported:**

3. **`home-ventilation` AU named the other market.** `verify-prep` rejected the AU file with *"names the other
   market: New Zealand"*. The body carried "— and a New Zealand figure must not be borrowed for an Australian home",
   which is an internal rule I had written into member-facing wording by mistake. It already lives in the block's
   `changeRule`, so it was removed from the body rather than reworded, and replaced with observable signals:
   "Judge it by what you can see and smell instead: condensation on the windows, a musty smell, or air that does not
   shift." **A test now asserts no AU block names New Zealand, FENZ, Tenancy Services or MBIE, and no NZ block names
   Australia, NSW, Queensland or Victoria.**
4. **A duplicated sentence across two blocks.** With both blocks carried, NSW Health's "mould grows in wet or moist
   areas that lack adequate ventilation" printed twice. The ventilation block now drops the duplicate **only when
   the mould block is also present**, through the existing `marketBodyWhen` mechanism — the same way the electrical
   block drops its generator paragraph beside the generator block. Every resource carrying ventilation without mould
   keeps the full wording. The AU PPE paragraph's lead was also reworded from "Before you start" (the title of the
   disclaimer block a few centimetres above it on the page) to "Protect yourself first".

## 8. Proposed NZ PDF page count

**8 pages.** `healthy-home-air-audit.NZ.pdf`, 311,234 bytes, rendered from the prepared NZ file and verified.

## 9. Proposed AU PDF page count

**9 pages.** `healthy-home-air-audit.AU.pdf`, 316,838 bytes, rendered and verified.

For scale: the longest resources in the library are OG-26 and OG-27 at 9 pages, so OG-13 sits at the top of the
existing range. It is long because it carries eight safety blocks. **If you drop `indoor-combustion` (§5) it loses
roughly a page in each market.**

## 10. Test count

**434 passing** (429 → **+5**), lint clean, typecheck clean. The five new ones:

| # | Test |
|---|---|
| 11 | names bleach nowhere in either market — block bodies *and* the numeric registry (ruling 1) |
| 11b | still gives each market its own sourced PPE, including the P2 medical caveat, and does not attach NSW's bleach-specific list to vinegar |
| 11c | no AU block names New Zealand, FENZ, Tenancy Services or MBIE; no NZ block names Australia, NSW, Queensland or Victoria |
| 13 | `healthy-home-air` is a real category of the air foundation, slugs stay unique, and OG-13's recorded category is one the taxonomy holds |
| 14 | OG-13 carries all six approved blocks, answers every block its topics require, uses no exemption, and both markets are publishable |
| 15 | neither prepared market file contains a price, a legacy code, `Day 13`, `30-Day Programme`, bleach, or any of the eight removed claims — and the scoring scale is still labelled "not an official standard" |

(That is six entries for five net new tests: the old test 11 was rewritten rather than added.)

Test 11 replaced the Stage 9.52 test that asserted the never-mix caution was present — it asserted the opposite of
what the ruling now requires.

## 11. Remaining blockers

**None for preparation. Two things for you, neither blocking.**

| # | Item | State |
|---|---|---|
| 1 | `healthy-home-air` vs the existing `healthy-home-checks` | **applied as you preferred**, with the overlap flagged (§1). One-line revert. |
| 2 | `indoor-combustion` brings approved gas/LPG wording into an Air resource | **carried as you instructed** (§5). The audit has no row that needs it. One field to drop. |
| 3 | The never-mix caution I removed | **my judgement call** (§7.1), reported exactly. One line to restore. |

Everything else is clean: 20/20 resources `READY_AFTER_FINAL_VALIDATION`, 40 market files, **zero** market problems,
**zero** gate findings, **zero** content flags, 40/40 files verified, build-level checks still green on the live 19.

## 12. Migration readiness

**`READY_AFTER_FINAL_VALIDATION`** — the same state every resource reached immediately before its deployment stage.

- description from the owner-approved text · foundation `air` · type `assessment` · category `healthy-home-air` ·
  difficulty `beginner` (OWNER-APPROVED / INFERRED) · estimatedTime `20` (OWNER-APPROVED / INFERRED) ·
  **status `draft`** · tags `[]`
- PDF title **`Healthy Home Air Audit — OffGrid056`** — the owner standard, no legacy code
- route `/resources/healthy-home-air-audit/`, which **supersedes a demonstration placeholder** on the same address,
  preview only — the third use of the Stage 9.39 rule
- related resources: `res-1002` (Household Risk Identifier) and `res-1015` (Warm Home Scorecard), both live
- schema validation passes; 22/22 copy changes applied; 40/40 prepared files verified

## 13. Deployment recommendation

**Deploy as resource #20 — after you have answered the three items in §11, and only on your explicit approval.**

I recommend deploying, with one reservation worth a minute of your time: **§5's gas question.** Everything else is
either settled or a one-line preference. My own recommendation on each:

1. **Category** — keep `healthy-home-air` if you want Air's entry assessment to own its own shelf; switch to
   `healthy-home-checks` if you would rather not carry two near-synonyms. Either validates.
2. **`indoor-combustion`** — **I would drop it from OG-13.** The audit never asks about barbecues, patio heaters or
   generators, `carbon-monoxide` already covers the CO risk that row 2 is about, and dropping it keeps the Air
   resource clear of unflued-gas-heater wording until the gas stage, exactly as Stage 9.51 recommended. That costs
   nothing a member needs and removes about a page from each market file.
3. **The never-mix caution** — I would leave it out, for the reason in §7.1, but it is your call and restoring it is
   trivial.

When you approve, the deployment stage is the usual shape: stage the record and the two PDFs into `private-assets/`,
build the preview, deploy with a rollback retained, verify the login wall and both market downloads, and update the
deployment register. **Nothing has been staged or deployed in this stage.**

**Stopped before deployment,** as instructed.
