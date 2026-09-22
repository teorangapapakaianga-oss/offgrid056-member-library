# OG-11 — 30-DAY PANTRY BUILDER · PREPARED FOR REVIEW · NOT DEPLOYED

OG-11 has been through the full workflow:

AUDIT → METADATA → LEGACY → FOOD SAFETY → NZ/AU MARKET → CLAIMS → RE-SKIN → PDF → VERIFY-PREP

- Both PDFs pass. OG-11 is **PREVIEW_WITH_PROPOSED_COPY**: its 12 copy changes, its food-safety block, its
  difficulty and its time all await you.
- **The live preview is unchanged:** `87d2301c`, nine resources.

**Three things to know first:**

1. **New Zealand's food-safety detail cannot be verified automatically.** MPI (New Zealand Food Safety) sits behind
   bot protection, as FENZ and ACC did. The NZ block therefore uses only what Get Ready NZ says, which is the
   "fridge first" order. **NZ timings, refreezing and discard rules are VERIFY_LIVE_SOURCE**, for you to check on
   MPI directly.
2. **The NZ fridge figure in our market profile was almost certainly wrong.** It said *"less than 24 hours"*. It
   could not be verified, and it looks like a misreading of a search summary. It is now **VERIFY and fails
   closed**. No deployed resource used it.
3. **Two print defects were found and fixed** in the re-skin, both caused by the new wording:
   - a callout box split across a page
   - a checklist cell wrapping onto the next page

**Date:** 22 September 2026

---

## 1. OG-11 audit

| | Finding |
|---|---|
| Title | **30-Day Pantry Builder** (cover: "30-Day Pantry / Builder") |
| Purpose | *"Build a 30-day food supply that your family will actually eat. No waste. No forgotten cans. Just a practical rotation system that works."* |
| Structure | the "Eat-What-You-Store" rule · Step 1 household eating profile · Step 2 inventory table (5 categories: grains, protein, fruit and veg, dairy and fats, cooking) · the "Expiry Date Trap" box · Step 3 shopping list · storage checklist (6 items) · "Build Gradually" box · 70 fill-in fields · 6 pages |
| Group | A (next in the migration order) |
| Safety exposure | **food safety in a power cut**, required by the audit (pantry ×6). Nothing hazardous beyond food storage. |
| Legacy branding | colours and fonts only; handled by the re-skin |
| Legacy navigation | "Week 2 — Water, Food & Air" · "OffGrid056 30-Day Programme" · "Asset OG-11 \| Day 11" ×2 · "Day 11 Complete" · *"The next asset ensures…"* · *"Next: OG-12 FIFO Rotation Tracker →"* · *"…the rotation principle covered in OG-12"* |
| Platform / product / supplier names | none |
| Shopping examples | none market-specific; no supermarket or brand names |
| Units | **"cal"** (calories). Both NZ and AU food labels use **kilojoules**. |

**Its teaching is sound and needs no rewrite:** buy what your household already eats, rotate stock, store it
well, and build gradually. **The problems are in its figures (§6).**

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | 30-Day Pantry Builder | the document; allowed by your ruling, with 30 days framed as a goal |
| ID / slug | res-1011 · `30-day-pantry-builder` | |
| Type | **worksheet** | PROPOSED (audit MEDIUM): profile, inventory table, shopping list, checklist; 70 fields |
| Foundation | **food** | inferred, HIGH |
| Category | **pantry-resilience** | PROPOSED. The category's own description is *"A pantry buffer built from what you already eat"*, which is OG-11's rule. |
| Difficulty | **NEEDS_OWNER_REVIEW** — recommend *beginner* | not stated; listing and checking cupboards |
| Time | **NEEDS_OWNER_REVIEW** — recommend 30 min | profile, five-category check, a 6-item list and the checklist; excludes shopping |
| Description | *"Build toward a 30-day pantry that your family will actually eat. No waste. No forgotten cans. Just a practical rotation system that works."* | PROPOSED: "build toward" makes 30 days a goal |
| Tags | none | the source has none; none invented |
| PDF title | 30-Day Pantry Builder — OffGrid056 | standard |

## 3. The 30-day target — recommendation

**Keep the title, and make 30 days explicitly OffGrid056's planning goal, separate from each market's official
baseline.**

**The official baselines, verified live, are not the same:**

| Market | Official emergency food baseline | Source |
|---|---|---|
| **NZ** | *"you may be stuck at home for three days or more"*, with long-lasting food that doesn't need cooking | Get Ready (NZ Civil Defence) |
| **AU** | **varies by state**: *"Non-perishable food for three days"* (Queensland) to *"a sufficient supply of food, water and essential items for up to 14 days"* (NSW) | Get Ready Queensland · NSW Food Authority |

**Proposed wording for Step 2's target line** (your preferred sentence, verbatim, then the market's baseline):

- **NZ:** *"Build beyond the basic emergency supply toward a pantry target that suits your household, storage space,
  budget and resilience goals. OffGrid056's planning goal is 30 days. The official emergency baseline in New
  Zealand is food for at least three days (Get Ready)."*
- **AU:** *"Build beyond the basic emergency supply toward a pantry target that suits your household, storage space,
  budget and resilience goals. OffGrid056's planning goal is 30 days. Official emergency advice varies by state —
  from food for at least three days (Get Ready Queensland) to supplies for up to 14 days (NSW Food Authority) — so
  check your state's advice."*

**Neither version implies an authority requires 30 days.** The AU version implies no single national figure.

## 4. NZ food safety — sources and wording

**Source read live:** [Get Ready (NZ Civil Defence) — No power](https://getready.govt.nz/prepared/household/impacts/no-power).

> **If the power goes out, eat the food from your fridge first, then your freezer, then the food in your cupboard
> or emergency kit.**
> Keep a stock of food that doesn't need to be cooked — canned food is good — or something to cook it on, such as
> a gas barbecue or camp stove. Don't forget food for babies and pets.

**Not included, VERIFY_LIVE_SOURCE:**

- fridge timing
- freezer timing
- refreezing
- discard rules
- tasting warnings

These are on **New Zealand Food Safety (MPI)**, whose pages show a bot-protection challenge. I did not try to get
past it. Search summaries of MPI give **self-contradictory** figures: an unopened fridge "4 hours", but food "can be
kept" if the power was off under 24 hours. That is exactly how the old profile value went wrong.

**To complete the NZ block, please open these on MPI's site, confirm the current wording, and note the URL:**

- MPI's household power-cut guidance
- [MPI — Food safety in natural disasters and emergencies](https://www.mpi.govt.nz/food-business/food-safety-in-natural-disasters-and-emergencies-2).
  **Note: this is on MPI's *food-business* path.** Our NZ profile linked to it, and it may not be the household page.

**Market profile:**

- NZ `fridgeWithoutPower` (*"less than 24 hours"*) and `freezerWithoutPower` (*"less than 4 days"*) are now
  **VERIFY**, and fail closed.
- The earlier test asserting they were verified is updated to assert the opposite.
- No deployed resource used either figure.

## 5. AU food safety — sources and wording

**Source read live:** [NSW Food Authority — Food safety in emergencies](https://www.foodauthority.nsw.gov.au/consumer/keeping-food-safe/flood-fire-power-cut-emergencies),
the "During an emergency" and "After a power failure" sections.

> **A closed fridge should keep food cold for about four hours, and a freezer usually won't defrost for at least 24
> hours if its door stays shut** — so keep both closed as much as you can, and note the time the power went off.
> Eskies with ice bricks or gel packs can keep food cold for longer.
> If frozen food has thawed, don't refreeze it: keep it cold and eat it as soon as possible. Throw out food that
> was being cooked when the power failed if you can't finish cooking it properly within two hours.

**Deliberately not used:**

- **NSW's rule on warmed fridge food.** The page contradicts itself: *"left out for over 4 hours"* in one section,
  *"allowed to warm for 2 hours or more"* in the other.
- **Any tasting warning.** None of the sources read gives one.

**No AU timing appears in the NZ file.** Checked in the PDF: none of "about four hours", "at least 24 hours" or
"eskies".

**Profile:** AU `freezerWithoutPower` is corrected to NSW's live wording, *"at least 24 hours, if the door stays
shut"*.

## Pantry safety — added only where sourced

The source's own storage and rotation teaching is kept. **FSANZ covers both NZ and AU**, so its rules apply in
both markets.

| Guidance | Source (read live) | Where |
|---|---|---|
| Use-by is about safety (*"should not be eaten after"*); best-before is about quality (*"should be safe … may have lost some quality"*) | [FSANZ — Use-by and best-before dates](https://www.foodstandards.gov.au/consumer/labelling/dates) (25 Feb 2025) | the Expiry Date Trap box |
| Some canned foods with a shelf life over two years carry no date | FSANZ, the same page and [Canned foods](https://www.foodstandards.gov.au/consumer/prevention-of-foodborne-illness/cannedfoods) (2 Oct 2025) | the same box |
| Cans that are swollen, leaking, rusted or dented should not be used | FSANZ Canned foods | the same box, one sentence |
| Canned food keeps best in a cool, dry place | FSANZ Canned foods | supports the "Cool" and "Dry" checklist items |
| Rotate, and check dates regularly | NSW Food Authority | *"Check your pantry regularly"* |

**Not added:** pest-prevention, moisture and contamination rules beyond the source's own checklist ("Pest-proof",
"Dry"). The source already covers them, and adding more would be the generic overload you ruled out.

---

## 6. Unsupported-claim table

| # | Claim | Decision | Source / reason |
|---|---|---|---|
| 1 | "a 30-day food supply" (cover and description) | **REWRITE** → *"Build toward a 30-day pantry"* | your ruling: a goal, not a requirement |
| 2 | "Target: 30 days of calories per person (approx. **2,000 cal/day = 60,000 calories** per person for 30 days)" | **REWRITE** → planning target plus the market's baseline (§3) | "cal" is not the NZ/AU label unit (kJ). The 8,700 kJ reference was **not** on the FSANZ page read, so no energy figure is kept. Needs vary. |
| 3 | "Most canned goods last **2–5 years**" | **REMOVE**, replaced by FSANZ date guidance | unsourced |
| 4 | "Dried goods last **1–2 years**" | **REMOVE** | unsourced |
| 5 | "Check your pantry every **3 months**" | **REWRITE** → *"Check your pantry regularly"* | NSW: dates *"checked regularly"* |
| 6 | "Cool (under **20°C** ideally)" | **REWRITE** → *"□ Cool"* | unsourced temperature; FSANZ says "cool, dry place", and "Dry" is already its own item |
| 7 | "Add **2–3** extra items per weekly grocery run. In **10 weeks**, you have a full 30-day supply" | **REWRITE** → *"Add a few extra items to each weekly shop. Over time you will reach your pantry target…"* | arithmetic that depends on what is bought |
| 8 | "A 30-day supply of beans nobody eats…" | **KEEP** | an illustration of the goal, not a figure |
| 9 | Fields: "Number of people", "3 meals we eat regularly", "Item 1–6", "Days of food this shop adds" | **KEEP** | form prompts, not claims |
| 10 | NZ baseline "at least three days"; AU "three days" / "up to 14 days" | **VERIFIED** | Get Ready NZ; Get Ready Qld; NSW Food Authority |
| 11 | AU fridge ~4 hours, freezer at least 24 hours, 2-hour cooking rule | **VERIFIED**, AU only | NSW Food Authority |

**After the proposed changes, none of the removed figures appears in either PDF.** Checked by reading both files
back.

## 7. Exact proposed copy changes (12)

**Status: PROPOSED — none approved.** They are in `config/proposed-copy.json` and rendered for review only.

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 2 — Water, Food & Air | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Page headers ×2 | Asset OG-11 \| Day 11 | *removed* |
| 4 | Closing heading | Day 11 Complete | Pantry Plan Complete |
| 5 | Closing | …and a storage plan. The next asset ensures nothing goes to waste through a simple rotation system. | …and a storage plan. |
| 6 | Closing | Next: OG-12 FIFO Rotation Tracker → | *removed* |
| 7 | Cover subtitle and description | Build a 30-day food supply that your family will actually eat. | Build toward a 30-day pantry that your family will actually eat. |
| 8 | Step 2 target — **NZ** | Target: 30 days of calories per person (approx. 2,000 cal/day = 60,000 calories per person for 30 days). | §3 NZ wording |
| 9 | Step 2 target — **AU** | the same | §3 AU wording |
| 10 | The Expiry Date Trap | Most canned goods last 2–5 years. Dried goods last 1–2 years. Write expiry dates clearly on every item with a permanent marker. Check your pantry every 3 months. Use what expires soonest — this is the rotation principle covered in OG-12. | Check the date on every item. A use-by date is about safety: don't eat food after it. A best-before date is about quality: food should still be safe for a while after it, but may not be at its best. Some canned foods with a shelf life of more than two years carry no date — write the date you bought them on the can with a permanent marker. Inspect cans as you go and don't use any that are swollen, leaking, rusted or dented. Check your pantry regularly and use what expires soonest first — the 'first in, first out' rotation principle. |
| 11 | Storage checklist | □ Cool (under 20°C ideally) | □ Cool |
| 12 | Build Gradually | Add 2–3 extra items per weekly grocery run. In 10 weeks, you have a full 30-day supply without stressing your budget. | Add a few extra items to each weekly shop. Over time you will reach your pantry target without stressing your budget. |

**Every change matched its source exactly.** Changes 8 and 9 are the only market-specific ones; everything else is
shared.

## 8 & 9. NZ and AU PDF status

| Check | NZ | AU |
|---|---|---|
| Pages | 6 | 6 |
| PDF title | 30-Day Pantry Builder — OffGrid056 | the same |
| Emergency numbers | 111 only | 000 + 112 |
| Food block, own-market sentences | 3 / 3 | 4 / 4 |
| Food block, other market's sentences | 0 | 0 |
| Official baseline shown | NZ only | AU only |
| Removed claims present | none | none |
| Tokens / VERIFY markers | 0 / 0 | 0 / 0 |
| OG codes in text | 0 | 0 |
| Table rows intact | 6 / 6 | 6 / 6 |
| Expiry Date Trap box intact | yes | yes |
| `import:verify-prep` | ✓ | ✓ |

## Two print defects found and fixed (caused by the new wording)

1. **The Expiry Date Trap box split across pages 3 and 4.** In NZ it broke mid-sentence. In AU its title was left
   alone at the foot of page 3. The NZ and AU safety blocks differ in length, so the break fell differently in each.
   - **Fix, in the re-skin:** short callout boxes (`warning-box`, `info-box`, `closing-box`, `total-box`) are kept
     whole, and headings are kept with their text.
   - Large section containers are **not** forced whole, which would leave big gaps.
   - A new test covers it.
2. **The checklist cell wrapped onto the next page.** My first wording, *"□ Cool and dry (canned food keeps best in
   a cool, dry place)"*, was too long for its small cell, and it duplicated the existing "□ Dry" item. It is now
   *"□ Cool"*.

**The rule changes only newly rendered PDFs.** The nine deployed resources' PDFs were **not** re-rendered. They
still pass `import:verify-prep`. When any of them is next re-rendered, its pagination may shift, and it will be
re-verified then.

---

## 10. Import readiness

**PREVIEW_WITH_PROPOSED_COPY** — NOT READY. What stands in the way:

1. Approve the **12 copy changes** (§7).
2. Approve the **food-safety block**:
   - AU wording as proposed
   - NZ wording as proposed, **or** after you verify MPI's timings and discard rules and I add them
3. **Difficulty** (recommend beginner) and **time** (recommend 30 min). Confirm worksheet / food /
   pantry-resilience.

## 11. Tests

**254 passed** (252 + 2). Lint and typecheck clean. `import:verify-prep`: **20 / 20** prepared PDFs.

- **New:** callout boxes kept whole, and headings kept with their text.
- **Changed, and stricter:** NZ power-cut food figures must now be **unverified** until MPI is checked. The old test
  asserted they were verified.

**Live checks:**

| Check | Result |
|---|---|
| Worker | unchanged, `87d2301c` |
| Deployed resources | the nine are unchanged |
| Access | still blocks, including OG-11's would-be URL |
| OG-11 staged | not staged |
| OG-11 in GitHub | 0 files |
| `--real` | refused |

## 12. Deployment recommendation

**Do not deploy OG-11 yet.**

**Recommended path:**

1. You check MPI's power-cut guidance by hand. That is optional, but it would give NZ members the same practical
   timing detail AU members get.
2. You approve the copy, the food block and the metadata.
3. I move the proposals into `approved-copy.json`, re-render, and run the full exact-build verification.
4. OG-11 deploys as the **10th** protected resource, on its own, with the usual Access and routing checks.

**Alternative:** approve the NZ block as it stands (Get Ready only) and deploy now. NZ members would get "fridge
first" but no timings, and AU members would get NSW's timings. Accurate but asymmetric, and your call.

**Stopped. OG-11 not deployed.**
