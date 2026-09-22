# OG-11 FINAL — MPI VERIFIED LIVE · READY FOR YOUR DEPLOYMENT DECISION

**MPI was read live, in an ordinary browser visit** (no bot challenge this time). It settles the NZ question:

- **MPI publishes no fridge or freezer safe-time figures at all.** The old "less than 24 hours" is confirmed
  invalid. NZ timing fields stay absent because **the official source does not give them**, not because they could
  not be read.
- **MPI does publish refreezing and discard guidance.** That is now verified and in the NZ block, pending your
  confirmation.

OG-11 is **READY_AFTER_FINAL_VALIDATION**: validated end to end, including a test build with market routing.
**Nothing is deployed.** The live preview is unchanged at `87d2301c` with nine resources.

**Date:** 22 September 2026

---

## 1. MPI verification result

**Page:** [New Zealand Food Safety (MPI) — Food safety in natural disasters and emergencies](https://www.mpi.govt.nz/food-safety-home/food-safety-in-natural-disasters-and-emergencies).
This is the **household** page, *"Last reviewed: 24.02.25"*, read live on 22 September 2026.

| You asked me to check | What MPI says |
|---|---|
| **Refrigerated food timing** | **None published.** *"fridges, freezers, and ovens may break down, and food could spoil more quickly"*; *"open the fridge and freezer as little as possible to help keep it cooler for longer"* |
| **Freezer timing** | **None published** |
| **Discard guidance** | *"Check the food – does it smell or look different? Has the colour changed and does it have a slimy texture? If so, it's probably unsafe to eat."* · *"throw out bad or rotting food before it spoils other food"* |
| **Refreezing** | *"If food is still visibly frozen (for example, it still has ice crystals on it), and packaging isn't damaged or open, you can still safely refreeze it. You should not refreeze food that has defrosted. You can still keep or use food that was frozen but has defrosted, you just need to keep it cold (like in the fridge)."* |
| **Tasting advice** | **None.** MPI uses smell, look, colour and texture, so no tasting advice is stated. |
| Other outage guidance | *"eat foods that will expire soon first … eat canned foods last"*; keep drinks in a working fridge; boil or purify water |
| **Pantry (relevant to OG-11)** | a survival kit of food lasting *"at least 3 days"* · *"Regularly restock and refresh"* · *"Check use-by dates and make sure cans and packaging are not damaged or rusty"* · keep supplies above flood level |

**The old profile link was wrong too.** It pointed to MPI's **food-business** page. It now points to this household
page.

**The NZ fridge and freezer figures stay VERIFY.** They fail closed, never reach a member, and never show "VERIFY"
text, because no NZ wording uses them. The test enforcing this stays in place.

## 2. Final NZ food-safety wording

> **If the power goes out, eat the food from your fridge first, then your freezer, then the food in your cupboard
> or emergency kit.** Open the fridge and freezer as little as possible to keep them cooler for longer.
> Keep a stock of food that doesn't need to be cooked — canned food is good — or something to cook it on, such as
> a gas barbecue or camp stove. Don't forget food for babies and pets.
> **Food that is still visibly frozen — with ice crystals on it and its packaging undamaged — can be refrozen.
> Don't refreeze food that has defrosted**; keep it cold and use it. If food smells or looks different, has changed
> colour or has a slimy texture, it's probably unsafe to eat — throw it out.

| Part | Source | Status |
|---|---|---|
| "fridge first → freezer → cupboard" | Get Ready | **owner-approved** (Stage 9.25 ruling 5) |
| "open as little as possible", the refreeze rule, the discard check | MPI, read live | **added after direct verification, as ruling 6 allowed. Please confirm.** |
| Timings | — | **none**: MPI publishes none |

## 3. Final AU food-safety wording (owner-approved, unchanged)

> **A closed fridge should keep food cold for about four hours, and a freezer usually won't defrost for at least 24
> hours if its door stays shut** — so keep both closed as much as you can, and note the time the power went off.
> Eskies with ice bricks or gel packs can keep food cold for longer.
> If frozen food has thawed, don't refreeze it: keep it cold and eat it as soon as possible. Throw out food that
> was being cooked when the power failed if you can't finish cooking it properly within two hours.

Source: NSW Food Authority, read live. **No AU timing is in the NZ file.**

## 4. Final 12 copy changes (approved, all applied, all matched exactly)

| # | Before | After | Basis |
|---|---|---|---|
| 1 | Week 2 — Water, Food & Air (cover) | *removed* | standing navigation rule |
| 2 | OffGrid056 30-Day Programme (cover) | OffGrid056 Member Library | standing rule |
| 3 | Asset OG-11 \| Day 11 (×2 headers) | *removed* | standing rule |
| 4 | Day 11 Complete | Pantry Plan Complete | standing rule |
| 5 | …The next asset ensures nothing goes to waste through a simple rotation system. | *removed* | standing rule |
| 6 | Next: OG-12 FIFO Rotation Tracker → | *removed* | standing rule |
| 7 | Build a 30-day food supply… | **Build toward a 30-day pantry…** | ruling 1 |
| 8 | Target: 30 days of calories … 2,000 cal/day = 60,000 … **(NZ)** | *"Build beyond the basic emergency supply toward a pantry target that suits your household, storage space, budget and resilience goals. OffGrid056's planning goal is 30 days. The official emergency baseline in New Zealand is food for at least three days (Get Ready)."* | rulings 1 and 3 |
| 9 | the same **(AU)** | *"…OffGrid056's planning goal is 30 days. Official emergency advice varies by state — from food for at least three days (Get Ready Queensland) to supplies for up to 14 days (NSW Food Authority) — so check your state's advice."* | rulings 1 and 3 |
| 10 | Most canned goods last 2–5 years. Dried goods last 1–2 years. … every 3 months … OG-12. | FSANZ use-by / best-before wording, cans with no date, damaged cans, *"Check your pantry regularly"*, first in first out | ruling 3 |
| 11 | □ Cool (under 20°C ideally) | **□ Cool** | ruling 3 |
| 12 | Add 2–3 extra items … In 10 weeks… | *"Add a few extra items to each weekly shop. Over time you will reach your pantry target without stressing your budget."* | ruling 3 |

**MPI now also supports two of these directly.** Its household page says a kit of food for *"at least 3 days"*
(change 8) and *"Check use-by dates and make sure cans and packaging are not damaged or rusty"* (change 10).

## 5. Final metadata (owner-approved)

| Field | Value |
|---|---|
| ID / slug | res-1011 · `30-day-pantry-builder` |
| Title | 30-Day Pantry Builder |
| Type / foundation / category | worksheet / food / pantry-resilience |
| Difficulty | beginner — **OWNER-APPROVED CLASSIFICATION** |
| Time | 30 min — **OWNER-APPROVED** |
| Description | Build toward a 30-day pantry that your family will actually eat. No waste. No forgotten cans. Just a practical rotation system that works. |
| Safety blocks | emergency, disclaimer, food safety in a power cut |
| Status | draft |
| legacyCode | OG-11 (internal only) |

## 6 & 7. NZ and AU PDF results

| Check | NZ | AU |
|---|---|---|
| PDF title | 30-Day Pantry Builder — OffGrid056 | the same |
| Pages | 6 | 6 |
| Emergency numbers | **111 only** | **000 + 112 only** |
| Food block, exact wording | 13 / 13 phrases | 5 / 5 |
| Other market's food wording | 0 | 0 |
| **Cross-market food timing** | **none** (no "four hours", "24 hours", "eskies" or "two hours") | AU timings only |
| Official baseline shown | NZ only | AU only |
| Unsupported or invalid figures (calories, 2–5 / 1–2 years, 3 months, 20°C, 2–3 items / 10 weeks, "less than 24 hours", "less than 4 days") | none | none |
| Tasting advice | none | none |
| Visible tokens / VERIFY text | 0 / 0 | 0 / 0 |
| Visible OG codes | 0 | 0 |
| Old programme navigation | none | none |
| Table rows / expiry box / food block intact | 6/6 · yes · yes | 6/6 · yes · yes |
| `import:verify-prep` | ✓ | ✓ |

**Test build (then removed):** OG-11 was staged, built and verified with `import:verify-build` (10 records, 20
files, 0 broken links), then routed in the browser:

| Market | Result |
|---|---|
| **No market** | no file on the resource page or Downloads; the chooser is shown |
| **NZ** | NZ file only, on both |
| **AU** | AU file only, on both |
| Draft | the badge is shown |

OG-11 was then **unstaged and the build rebuilt with nine**, so `out/` and `private-assets/` match what is live
(9 records, 18 files, verified; OG-11 absent). A deploy cannot pick it up by accident.

## 8. Readiness

**READY_AFTER_FINAL_VALIDATION.**

**One item for your confirmation:** the three MPI sentences added to the NZ block (§2):

- *"open as little as possible"*
- the refreeze rule
- the discard check

**Is OG-11 safe and useful enough to deploy with this NZ block? Yes.** The feared "limited" NZ block did not
materialise.

- NZ members get:
  - the order to eat food in
  - keeping doors closed
  - when refreezing is and is not safe
  - how to recognise spoiled food
- **The only asymmetry is timings.** AU gets NSW's hours; NZ gets none, because MPI publishes none. That reflects
  the official sources, not a gap in our work.

## 9. Tests

**254 passed.** Lint and typecheck clean. `import:verify-prep`: 20 / 20.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `87d2301c` |
| Deployed resources | the nine are unchanged, and **not** re-rendered (per ruling 8, none needs the new print fixes) |
| Access | still blocks, including OG-11's would-be URL |
| OG-11 in GitHub | 0 files |
| `--real` | refused |

## 10. Deployment recommendation

**Once you confirm the MPI lines, deploy OG-11 as the 10th protected resource**, on its own, with the usual steps:

1. Stage.
2. Build.
3. Run `import:verify-build`.
4. Check routing: none / NZ / AU.
5. Deploy.
6. Check Access on every URL.

Rollback target: `87d2301c`.

**Next in the Group-A order after OG-11:** OG-19 (Battery Backup Planner). It needs the approved electrical block
and this food block, **both now available for NZ and AU.**

**Stopped before deployment.**
