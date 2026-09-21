# BATCH 2 (OG-27, OG-B07, OG-15) — PREPARED, NONE READY, NOTHING DEPLOYED

All three came through the full pipeline, and all six NZ/AU PDFs pass verification. **None is ready to
import.** Each needs owner decisions on four things:

- metadata
- legacy content
- its proposed safety blocks
- proposed copy changes

**Nothing was deployed.** The live preview is unchanged at `619b70d5` (OG-02, OG-B04, OG-B10, OG-25).
**Date:** 22 September 2026

---

## Read this first — five findings

### 1. The OG-27 cover title was hiding its label — and deployed OG-25 has the same defect

On the fixed-layout cover, the enlarged title grows upward over the small label. On OG-27, *"OffGrid056 30-Day
Programme"* sat behind *"OG-27 90-Day Implementation Roadmap"*.

**The live OG-25 PDF has the same collision.** OG-02 uses the centred cover layout and is not affected. OG-B04 and
OG-B10 have no cover page.

**Fixed in the re-skin, for that layout only:** label, title and subtitle now stack in one column, so a longer
title pushes the label up instead of covering it. No wording or sizes changed. The centred layout (OG-B07,
OG-15) is left alone: my first version of the fix broke it, the screenshot showed that, and I corrected it.

The live OG-25 PDF is untouched, because you locked the deployed set. **It needs a re-render the next time you
approve a deployment.**

### 2. Two deployed resources carry legacy text my earlier reviews missed

- **OG-25** (live):
  - *"Next: OG-26 3-Tier Budget Planner →"*
  - *"Tomorrow you will build a 3-Tier Budget Planner…"*
  - *"OffGrid056 30-Day Programme"*
  - *"Week 4 — Action Plan & Pathway"*
  - *"Day 25 Complete"*
  - a reference to OG-01
  - its description, *"Day 25 — A professional brief anyone can understand"*
- **OG-B10** (live): header *"OffGrid056 Action Plan Plus | Automated milestone tracking…"*

These should have been flagged at Stage 9.12, and I missed them. **The prep step now detects this class of text
automatically**; that detector is what surfaced them. I have not changed the live resources. Your decision is
listed in §9.

### 3. The prep step was quietly filling in fallback metadata — now it can't

Before this stage, a resource with no confident audit value was silently given:

- foundation *general*
- type *worksheet*
- the foundation's **first category**

**All three fallbacks are gone.** A field now comes from one of two places:

- the reviewed metadata file
- a HIGH-confidence audit inference

Otherwise it is left out, and the record fails validation until you decide. A category that does not belong to
its foundation is also rejected.

The deployed three now carry their foundation and type explicitly in the metadata file. All three still validate.

### 4. These are the first resources to need topic safety blocks, and those blocks are not yet sourced for NZ/AU

OG-27 and OG-B07 teach solar, inverters and batteries, so the audit **requires** the CRITICAL
*Batteries and electrical* block. I have also **recommended** further blocks (below).

The wording comes from the safety standard with only market substitutions. But the standard's own sources for
these blocks are mostly **US and Canadian** (CPSC, Health Canada), with **NZ-only** support for wood burners. That
does not meet your rule that each market's sources be authoritative and official for that market.

The blocks are in the prep PDFs **as proposals**. The pipeline marks every resource using one as not ready until
you approve it. The standard also recommends that a suitably qualified person reviews CRITICAL wording; you have
not yet decided who.

### 5. OG-27 "exercises market tokens" less than the audit suggested

The four market fields the audit listed for OG-27 are **topics it talks about, not values printed in it**:

- emergency number
- water per person
- electrician
- energy agency

The body prints no emergency number, water figure or agency name.

Everything that genuinely varies by market comes through the safety blocks. It resolves correctly:

| | NZ | AU |
|---|---|---|
| Emergency | **111**, 111 TXT | **000**, 112 from a mobile, 106 TTY |
| Agency | Civil Defence (NEMA) | your State Emergency Service (SES) |
| Electrical licence (new block) | licensed electrical worker | licensed electrician |

The one hard-coded market term in OG-27's body is ***"building consents"***, which is New Zealand usage. It is
listed as a proposed copy change.

**Watch-out:** AU's energy agency is still `VERIFY`. No block uses it, so nothing is blocked today. Any future
wording that names "your energy agency" would make every AU resource unpublishable until it is verified.

---

## 1. Proposed metadata

| | OG-27 | OG-B07 | OG-15 |
|---|---|---|---|
| **Final title** | 90-Day Implementation Roadmap | Solar Planning Deep Worksheet | Warm Home Scorecard |
| **Resource ID / slug** | res-1027 · `90-day-implementation-roadmap` | res-1507 · `solar-planning-deep-worksheet` | res-1015 · `warm-home-scorecard` |
| **Resource type** | planner — *inferred, HIGH* | worksheet — **proposed; source-supported** (the title says Worksheet); the audit said planner at MEDIUM | assessment — *inferred, HIGH* |
| **Foundation** | general — **proposed** | energy — *inferred, HIGH* | shelter — *inferred, HIGH* |
| **Category** | planning — **proposed** (same as OG-B10) | solar — **proposed** | **NEEDS_OWNER_REVIEW** — recommend *heating* |
| **Difficulty** | **NEEDS_OWNER_REVIEW** — recommend *intermediate* | advanced | **NEEDS_OWNER_REVIEW** — recommend *beginner* |
| **Difficulty basis** | owner review required; recommendation is inferred | **source-supported** | owner review required; recommendation is inferred |
| **Estimated time** | **NEEDS_OWNER_REVIEW** — recommend 30 min | **NEEDS_OWNER_REVIEW** — recommend 30 min | **NEEDS_OWNER_REVIEW** — recommend 30 min |
| **Time basis** | first pass: 12 weekly rows, owners, 3 sign-offs (the roadmap itself runs 90 days) | 15 fields, a shading table and a payback calculation, with measurements, bills and quotes already to hand | 16 scores, the hand test, and 3 cold-zone plans |
| **Description** | *"Day 27 — Turn your plan into phased action with deadlines"* (see §7) | *"Advanced solar planning for Action Plan Plus members…"* (see §7) | *"Score your home's warmth, insulation, and heating efficiency room by room. Find the leaks, drafts, and cold zones that drain your comfort and your wallet."* (kept as is) |
| **Tags** | none — the source has none, and none invented | none | none |
| **Safety exposure** | electrical (required); heating and CO (recommended) | electrical (required); **working at height** (roof survey, no block exists) | heating: gas, wood burner, portable heaters (recommended) |
| **Market-specific fields** | "building consents" (NZ usage), subsidies, grid application | "Feed-in tariff" (usual AU term; NZ usually says "buy-back rate") | "grants and programmes" for insulation (NZ/AU schemes differ; the text refers to OG-16) |
| **Content-review flags** | programme structure ×5, next-step ×3, cross-references OG-26 and OG-28 | product tier ×3 ("Action Plan Plus", "Bonus Asset \| Tier 3") | programme structure ×4, next-step ×2, OG-16, **3 unsourced figures**, **2 health claims** |

**Why OG-27's foundation is general and not the audit's shelter:** its three sprints span water, energy, heating
and shelter. Its advanced companion, OG-B10, is general/planning.

**Why OG-B07 is advanced:** the cover reads *"Advanced solar planning"*, the title is *"Deep Worksheet"*, and it
asks for azimuth, pitch, kWh/year and feed-in rates.

**Title clash to be aware of:** OG-27 *"90-Day Implementation Roadmap"* and OG-B10 *"90-Day Implementation
Roadmap (Advanced)"* sit side by side in the library. The slugs are distinct. You may want a clearer name for the
base version.

---

## 2 & 3. PDF status

| | NZ | AU |
|---|---|---|
| **OG-27** | ✅ 7 pages · 111 only · Civil Defence · licensed electrical worker | ✅ 7 pages · 000 + 112 only · SES · licensed electrician |
| **OG-B07** | ✅ 4 pages · 111 only · Civil Defence · licensed electrical worker | ✅ 4 pages · 000 + 112 only · SES · licensed electrician |
| **OG-15** | ✅ 6 pages · 111 only · Civil Defence | ✅ 6 pages · 000 + 112 only · SES |

All six PDFs:

- zero unresolved tokens and zero `VERIFY` markers
- no Skool references and no external links
- no browser-error page
- no other market's number, agency or licence term
- every safety block present
- fonts and cover art load

`publishable()` returns **true** for NZ and AU on all three. That covers market resolution only; readiness is
held by the reviews in §9.

`import:verify-prep` now checks more than the numbers:

- every safety block prep recorded is in the PDF
- every approved copy change is present
- no broken assets
- no cross-market agency or licence term

A deliberately wrong file (OG-B04's PDF planted in OG-27's folder) was caught and failed: *three safety blocks
missing*. All 12 prepared PDFs pass.

---

## 4. Safety changes (proposed — not approved)

| Block (severity) | OG-27 | OG-B07 | OG-15 | Standard's source basis |
|---|---|---|---|---|
| In an emergency (CRITICAL) | ✓ | ✓ | ✓ | NZ Police, Triple Zero — **approved, already live** |
| Before you start / disclaimer | ✓ | ✓ | ✓ | editorial — **approved, already live** |
| Batteries and electrical safety (CRITICAL) | **required** | **required** | — | CPSC (US) |
| Carbon monoxide (CRITICAL) | recommended | — | recommended | Health Canada, Ontario, CPSC |
| Never bring it inside (CRITICAL) | recommended | — | recommended | CPSC; unflued-heater rules in NZ/AU still `VERIFY` |
| Wood burners and open fires (HIGH) | — | — | recommended | Fire and Emergency NZ; no AU source |

**Why each is recommended:**

- **OG-27:** Sprint 1 buys *"emergency heating"* and runs a *24-hour off-grid test*. That is exactly when people
  bring heaters and cookers inside.
- **OG-15:** question 12 names *"fireplace, wood burner, gas heater, portable"* as backup heating.

**Wording changes to the standard (substitutions only):**

- *"licensed electrician"* → the market's own term. NZ reads **licensed electrical worker**; AU reads **licensed
  electrician**.
- *"call emergency services"* → *"call 111"* in NZ and *"call 000"* in AU.

No new facts, figures or distances were introduced. The generator distance is not used anywhere.

**Placement:** CRITICAL blocks sit at the top of the content, and the HIGH wood-burner block sits at the end with
the disclaimer. The standard asks for blocks *at the point of hazard*; the pipeline cannot yet do that.

**Gap, not filled:** OG-B07 asks members to measure *"Roof area"* and *"Roof pitch"*, which means working at
height. The standard has **no working-at-height block**, and I have not invented one. Options:

- source a block (WorkSafe NZ / Safe Work Australia)
- reword the field toward *"or ask your installer"* (the source already says *"Measure carefully or provide to
  installer"*)
- accept it as is

---

## 5. Terminology changes

**None needed.** None of the three uses "5 Pillars" or "pillar". No framework phrase was replaced.

## 6. Branding changes (automatic re-skin)

| | Changes |
|---|---|
| Colours | legacy navy #1A2332, gold #C9A227, orange #E8703A → brand greens; slate #2D3A4D in OG-B07 and OG-15 as well |
| Type | Playfair Display → Bebas Neue (headings ×1.18); Inter → Montserrat |
| Covers | broken `/mnt/agents/…` image paths repointed to local cover art |
| Layout | the OG-27 cover label/title collision fix |

- OG-27: 19 kinds of change
- OG-B07: 19 kinds of change
- OG-15: 20 kinds of change

**OFFGRID056.COM** is kept, as ruled before: it is OffGrid056's own domain.

**Minor:** OG-B07 (solar) uses the Week 3 cover image, which shows a **wood burner**. It is the source's own
choice.

---

## 7. Exact proposed copy changes (none applied)

**OG-27**

| Where | Original | Proposed |
|---|---|---|
| Description (from cover) | Day 27 — Turn your plan into phased action with deadlines | Turn your plan into phased action with deadlines |
| Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| Header line | Day 27 — Week 4: Action Plan & Pathway \| OffGrid056 30-Day Programme | *remove* |
| Week 1 action | Confirm budget tier from OG-26. | Confirm your budget tier. |
| Week 11 action | Compare actual spend to OG-26 budget. | Compare actual spend to your budget. |
| Week 5 action | Submit any building consents. | Submit any building consent or permit applications. |
| Closing | Day 27 Complete | Roadmap Complete |
| Closing | Next: Tomorrow you will assign household responsibilities so resilience is a team sport, not a solo burden. | *remove* |
| Closing | Next: OG-28 Household Responsibility Roster → | *remove* (OG-28 is not in the library) |

**OG-B07**

| Where | Original | Proposed |
|---|---|---|
| Cover label | OffGrid056 Action Plan Plus | OffGrid056 Member Library |
| Description (cover) | Advanced solar planning for Action Plan Plus members. Roof orientation, shading analysis… | Advanced solar planning: roof orientation, shading analysis, load profile, and payback estimator — everything a professional installer needs to quote accurately. |
| Header | Bonus Asset \| Tier 3 | *remove* |
| Financial field | Feed-in tariff rate ($/kWh you sell back) | Feed-in tariff or buy-back rate ($/kWh you sell back) |

**OG-15**

| Where | Original | Proposed |
|---|---|---|
| Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| Header | Asset OG-15 \| Day 15 | *remove* |
| Closing | Day 15 Complete | Scorecard Complete |
| Closing | Tomorrow: what grants and programmes can help pay for the fixes. | *remove* |
| Closing | Next: OG-16 Grant Eligibility & Insulation Planner → | *remove* (OG-16 is not in the library) |

**OG-15 teaching content: flagged, not rewritten.** These need a source, or your decision:

| Text | Issue |
|---|---|
| *"hypothermia is a real threat within hours — not days"* | health claim, unsourced |
| *"it is about survival"* | framing |
| *"Bedrooms comfortable for sleeping (16–18°C)"* | unsourced; 16°C looks low against the widely cited WHO minimum of 18°C (I have not verified that source here) |
| *"Every 1°C you lower your thermostat saves approximately 10%"* | unsourced |
| *"A home heated to 21°C costs roughly 30% more than one heated to 18°C"* | unsourced |
| Score boxes | print a grey *"0"* placeholder (source behaviour); harmless on screen, odd on paper |

**Cover-week labels** (*"Week 4 — Action Plan & Pathway"*, *"Week 3 — Shelter, Heating & Energy"*): propose
removing them, or replacing them with the foundation name. Your call.

---

## 8. Unresolved issues

1. **Safety sourcing:** NZ/AU official sources for the electrical, CO and indoor-combustion blocks; an AU source
   for wood burners; and who signs off CRITICAL wording.
2. **Working at height** in OG-B07: no block exists.
3. **Metadata:**
   - three estimated times
   - two difficulties (OG-27, OG-15), plus confirming OG-B07's
   - OG-15's category
   - confirming the proposed foundation, type and category for OG-27 and OG-B07
4. **Copy:** the §7 changes, and the five OG-15 claims and figures.
5. **Deployed resources:** OG-25's legacy text and cover collision, and OG-B10's "Action Plan Plus" header.
6. **AU energy agency** remains `VERIFY`, a latent blocker for any future wording that names it.

## 9. Import readiness

| | Readiness | Why |
|---|---|---|
| OG-27 | **NOT READY — NEEDS_CONTENT_REVIEW** | legacy text; 3 proposed safety blocks; difficulty and time unset |
| OG-B07 | **NOT READY — NEEDS_CONTENT_REVIEW** | product-tier text; proposed electrical block; working-at-height gap; time unset |
| OG-15 | **NOT READY — NEEDS_CONTENT_REVIEW** | legacy text; unsourced claims; 3 proposed safety blocks; category, difficulty and time unset |

The prep step also now reports the deployed OG-25 and OG-B10 as NEEDS_CONTENT_REVIEW, because of finding 2.
OG-B04 is unaffected.

## 10. Deployment recommendation

**Do not deploy any of the three yet.**

Suggested order once you've decided:

1. **OG-15** first, if the heating blocks are approved. It has no required block, so it is the least dependent on
   new safety wording.
2. **OG-27**.
3. **OG-B07** last, because of the working-at-height gap.

Separately, I recommend **re-rendering OG-25 at the next approved deployment**, to fix the cover collision and
apply whatever you decide about its legacy text.

---

## Checks

| Check | Result |
|---|---|
| Tests | **236 passed** (224 existing + 12 new: cover layout, content flags, no-fallback metadata, category/foundation mismatch, required-safety blocking, per-market electrical wording, proposed-block hold) |
| Lint / typecheck | clean |
| `import:verify-prep` | 12/12 PDFs pass; negative test caught |
| Live Worker | unchanged, `619b70d5`; the four deployed resources untouched |
| Access | `/`, `/downloads/`, a live PDF, and the three new resources' would-be URLs → all **302 to Access login** |
| Public GitHub | no real resource committed; the batch-2 PDFs exist only in git-ignored `workspace/` and were not staged into `private-assets/` |
| `--real` | still refused |

**Stopped. OG-27, OG-B07 and OG-15 are not deployed.**
