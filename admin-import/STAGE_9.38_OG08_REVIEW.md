# OG-08 — WATER STORAGE CALCULATOR · REVIEW · NOT DEPLOYED

OG-08 is ready for your review as **PREVIEW_WITH_PROPOSED_COPY**. Its 20 proposed changes appear in the NZ and AU
previews so you can see them, but none is approved yet.

**What the audit found:**

1. **Its baseline was wrong for both markets.** It says: *"This calculator uses the civil defence standard of **10
   litres per person per day**"*, and every formula uses People × 10 L × days.
   - **NZ, approved:** 3 L per person **per day**, for at least 3 days.
   - **AU, approved:** 10 L per person **for three days**, not per day.
   - **The effect:** the old 3-day total over-stated NZ by more than 3× (a 4-person household: 120 L instead of
     36 L) and AU by 3× (120 L instead of 40 L). "Civil defence" was also NZ terminology in the AU file.
2. **It misapplies a treatment instruction:** *"Add 5 drops of plain unscented bleach per litre **if treating
   uncertain water sources**"*.
   - The NZ 5-drops method is for preparing **tap water for storage**. It is not a way to make uncertain water safe.
   - AU publishes no bleach ratio at all.
   - The proposals remove it. Storage planning now stays separate from water safety.
3. **It has unsourced figures:** "50–70%" underestimation, "more than 50 litres", "Rotate every 6–12 months",
   20 L / 200 L / 1000 L IBC containers.

**One decision is needed before OG-08 can be built:** a public **demo placeholder** already uses the slug
`water-storage-calculator`. See §10b.

**Also done this stage:** the OG-26 "gas heater" wording review is **queued** in its metadata
(`futureWordingReview`). OG-26 is unchanged.

**Live preview unchanged:** `61d2acd0`, 15 resources.
**Date:** 22 September 2026

---

## 1. OG-08 audit

| | |
|---|---|
| Title | **Water Storage Calculator** |
| Source | HTML/PDF pair |
| Audit | water HIGH · worksheet HIGH |
| Audit notes | no safety notes. **"Civil Defence ×4"** flagged as an NZ term. |
| Structure | intro box "The Numbers That Matter" · Step 1 needs (4 scenarios) · Step 2 current storage (5 sources, total box) · Step 3 gap analysis (4 targets) · Reality Check · Step 4 container plan (6 fields) · "Storage Tips" · closing |
| Legacy content | "Week 2 — Water, Food & Air" · "OffGrid056 30-Day Programme" · "Asset OG-08 \| Day 8" ×2 · "Day 8 Complete" · *"The next asset shows you how to make any water safe to drink."* · *"Next: OG-09 Water Filtration Comparison Matrix →"* |
| Not present | Skool, Action Plan Plus, tiers |
| Products | none named. The container examples were generic sizes, and they are removed. |
| Treatment content | **only** the misapplied bleach line (removed). No boiling times and no filter instructions. |

**Role:** OG-08 is the **introductory water-storage planning resource**. It covers how much a household needs, what it
already stores, and the gap. Treatment and infrastructure belong to later resources:

| Future resource | Covers |
|---|---|
| OG-09 Filtration Comparison Matrix | treatment |
| OG-10 Rainwater Harvesting Planner | collection |
| OG-B08 Water Tank Sizing & Placement Guide | tanks |

OG-08 doesn't link to these yet, because they aren't deployed.

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | Water Storage Calculator | **SOURCE** |
| PDF title | Water Storage Calculator — OffGrid056 | standard |
| ID | res-1008 | |
| Foundation | water | audit HIGH |
| Type | worksheet | audit HIGH |
| Category | **water-storage** (*"How much to store, how to store it, and how to rotate it."*) | **INFERRED**. Alternative: household-water-planning. |
| Difficulty | recommend **beginner** | **OWNER-REVIEW REQUIRED** · INFERRED: multiply, add, subtract |
| Time | recommend **20 min** | **OWNER-REVIEW REQUIRED** · INFERRED: 4 need rows, a 5-row inventory, 4 gap rows, 6 plan fields. Excludes measuring containers. |
| Description | *"Know exactly how much water your household needs, how much you currently store, and the gap between the two. No guesswork. Just numbers."* | **SOURCE**: the cover subtitle, unchanged (no figures) |
| Tags | none | none invented |

## 3. Final calculator logic

**Step 1 · Need (L)**

| Row | NZ formula | AU formula | Status |
|---|---|---|---|
| 3-Day Emergency | **People × 3 L × 3 days** | **People × 10 L** | **OFFICIAL EMERGENCY BASELINE** |
| 7-Day Disruption | People × 3 L × 7 days | People × 10 L × 7 ÷ 3 | *optional extended resilience storage*: OffGrid056 planning |
| 14-Day Supply | People × 3 L × 14 days | People × 10 L × 14 ÷ 3 | the same |
| 30-Day Longer-Term Goal | People × 3 L × 30 days | People × 10 L × 30 ÷ 3 | the same |

**How the formulas are built:**

- **Units:** litres. The input is renamed from "Your Number" to **"People"**.
- **NZ:** the official figure is a daily rate, so longer rows keep the same rate over more days. That is labelled as
  planning, not official.
- **AU:** the official figure is a three-day total, so longer rows **scale that total** (× days ÷ 3) in plain view.
  **No AU daily rate is invented.**
- **Rounding:** *"Round each total up to the next whole litre."* This matters for AU, where 7 ÷ 3 and 14 ÷ 3 don't
  divide evenly.

**Worked check (4 people):**

| | NZ | AU |
|---|---|---|
| 3-day | 4 × 3 × 3 = **36 L** | 4 × 10 = **40 L** |
| 7-day | 84 L | 93.3 → **94 L** |
| 14-day | 168 L | 186.7 → **187 L** |
| 30-day | 360 L | **400 L** |

The old source gave **120 L** for the 3-day row in both markets.

**Step 2 · Have (L):** usable litres = capacity × the share that is filled. The total is the sum. **New:** *"Count
only water that is safe to drink, or that you will make safe before drinking — see Storing drinking water."* A
rainwater tank or hot water cylinder isn't automatically drinking water.

**Step 3 · Gap (L):** the column now reads **"Gap (L) = Need − Have"**. The rows are relabelled: *3-Day Official
Baseline* · *7-Day / 14-Day / 30-Day (extended)*.

**Reality Check:** the old *"more than 50 litres"* threshold becomes *"If you have any gap in your 3-day official
baseline, close it first."* The rest is kept, including *"Do not plan rainwater tanks or filtration systems before you
have basic stored water covered."*

## 4. Claims table

| # | Original | Type | Action |
|---|---|---|---|
| C1 | *"the civil defence standard of 10 litres per person per day"* | litres per person / baseline | **REWRITE per market**: NZ 3 L per person per day for at least 3 days (Get Ready); AU at least 10 L per person for 3 days (for example Get Ready Queensland) |
| C2 | *"for drinking, cooking, and basic hygiene"* | scope claim | **REMOVE**: the official figures are for drinking water. NZ adds *"store more if you can…"* (approved wording). |
| C3 | *"Most households underestimate water needs by 50–70%"* | percentage | **REMOVE** |
| C4 | Formulas "People × 10L × 3/7/14/30 days" | calculation | **REWRITE** (§3) |
| C5 | 3 / 7 / 14 / 30 days | days | **3 days: VERIFY** (official, both markets) · **7, 14, 30: KEEP_AS_EXAMPLE**, labelled optional extended storage |
| C6 | *"Minimum civil defence standard"* (row caption) | "minimum" claim | **REWRITE**: "OFFICIAL EMERGENCY BASELINE" plus the source name per market |
| C7 | *"If your 3-day gap is more than 50 litres…"* | threshold | **REWRITE**: any 3-day gap first |
| C8 | *"(e.g., 20L drums, 200L barrel, 1000L IBC tote)"* | container sizes | **REMOVE**; see the approved block for suitable containers |
| C9 | *"(cool, dark, away from chemicals)"* | storage location | **REWRITE** to point to the block (NZ: cool, dark place; AU: cool, off the ground, mosquito-proof) |
| C10 | *"Dark + cool + sealed = safe."* | safety claim | **REMOVE** (overstates) |
| C11 | *"Store containers in a garage, shed, or cupboard"* | location | **REMOVE**; the block covers each market |
| C12 | *"Label every container with the fill date."* | practice | **REMOVE** from OG-08's own text; the NZ block already says to write the date |
| C13 | *"Rotate every 6–12 months"* | replacement frequency | **REMOVE**: NZ says check every 6 months; AU says at least twice a year. Both are in the blocks. |
| C14 | *"Add 5 drops of plain unscented bleach per litre if treating uncertain water sources"* | bleach ratio / treatment | **REMOVE**: misapplied. NZ's 5 drops is for storing tap water; AU gives none. |
| C15 | *"Hot water cylinder (emergency only)"* | source | **KEEP** (inventory line), now covered by the "only count water that is safe to drink…" note. **Flagged:** no approved guidance on drinking from a cylinder is added. |
| C16 | "Estimated cost", "Rotation plan" | the member's own figures | **KEEP** |
| C17 | *"The next asset shows you how to make any water safe to drink."* | overstatement / navigation | **REMOVE** |

**Not in OG-08:** boiling times and cost estimates. **No figures were added** beyond the two approved baselines, the
rounding rule and the plain arithmetic.

## 5. NZ baseline handling

- **Intro:** *"Get Ready advises storing at least **3 litres of drinking water per person per day, for at least three
  days**. That is the official emergency baseline, and the first row below. The longer periods are optional extended
  resilience storage."*
- **Row 1:** *"OFFICIAL EMERGENCY BASELINE (Get Ready)"*, People × 3 L × 3 days.
- **Note under the table** (the approved NZ block's own wording): *"Get Ready advises storing more if you can: hot
  weather and hard physical work can double what you need, children, nursing mothers and people who are unwell need
  more, and pets need water too."* Plus the extended-storage and rounding lines.
- **No AU figure or wording** (no 10 L, "state or territory", or boiling).

## 6. AU baseline handling

- **Intro:** *"Emergency guidance such as Get Ready Queensland advises storing at least **10 litres of drinking water
  per person for three days**, and your state or territory emergency service may advise more for your area."*
- **The AU figure is named as an example source,** so no national rule is claimed. This matches the approved AU
  block.
- **Row 1:** *"OFFICIAL EMERGENCY BASELINE (for example Get Ready Queensland)"*, People × 10 L.
- **Longer rows:** × days ÷ 3, labelled an OffGrid056 planning calculation.
- **No NZ figure or wording** (no 3 L per day, "civil defence", bleach, or "hot weather… can double", which is
  NZ-sourced).

## 7. Drinking-water safety requirements

| Block | Needed? | Why |
|---|---|---|
| **Storing drinking water** (approved NZ and AU) | **YES**, and it's the only topic block | Storage and water safety, per market: NZ bleach preparation and 6-month checks; AU containers, twice-yearly checks and boiling for 1 minute |
| Emergency + disclaimer | yes | every resource |
| Others | **no** | not triggered: no food, generator, electrical, fire or roof content |

- **Storage vs treatment:** OG-08's own text now does **storage calculation only**. The new "Storing It Safely" box
  says so, and points to the block for containers, checking and making water safe.
- **Bleach:** appears only inside the approved NZ block, once. There is none in AU.
- **The block prints whole** on page 6 in both markets.

## 8. NZ / AU differences

| Area | NZ | AU |
|---|---|---|
| Baseline | 3 L per person per day, for at least 3 days (Get Ready) | at least 10 L per person for 3 days (for example Get Ready Queensland; states may advise more) |
| Formula | People × 3 L × days | People × 10 L (× days ÷ 3 for longer) |
| "Store more" note | the NZ approved wording (hot weather, children, pets…) | the state or territory emergency service may advise more |
| Treatment (block) | 5 drops of unscented bleach per litre for stored tap water; wait 30 minutes | boil vigorously for at least 1 minute, or follow state or territory health advice |
| Checking (block) | every six months | at least twice a year |
| Agency terms | Get Ready / Civil Defence | state or territory emergency service; SES |
| Emergency numbers | 111 | 000 + 112 |

## 9. Exact proposed copy changes (20; PROPOSED, not approved)

**Market-specific:** 4–5 (intro), 6–7 (Step 1 table).

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 2 — Water, Food & Air | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Page headers ×2 | Asset OG-08 \| Day 8 | *removed* |
| 4 | Intro — **NZ** | Most households underestimate water needs by 50–70%. This calculator uses the civil defence standard of **10 litres per person per day** for drinking, cooking, and basic hygiene. Fill in your numbers. The gaps will be obvious. | Get Ready advises storing at least **3 litres of drinking water per person per day, for at least three days**. That is the official emergency baseline, and the first row below. The longer periods are optional extended resilience storage. Fill in your numbers. The gaps will be obvious. |
| 5 | Intro — **AU** | the same | Emergency guidance such as Get Ready Queensland advises storing at least **10 litres of drinking water per person for three days**, and your state or territory emergency service may advise more for your area. That is the official emergency baseline, and the first row below. The longer periods are optional extended resilience storage. Fill in your numbers. The gaps will be obvious. |
| 6 | Step 1 table — **NZ** | Scenario · Formula · Your Number · Total Litres; rows *People × 10L × 3 / 7 / 14 / 30 days*; captions "Minimum civil defence standard" … "Full month self-sufficiency target" | Scenario · Formula · **People** · Total Litres: **3-Day Emergency** (*OFFICIAL EMERGENCY BASELINE (Get Ready)*) People × 3 L × 3 days / **7-Day Disruption** (*Extended — plumbing failure, contamination event*) People × 3 L × 7 days / **14-Day Supply** (*Extended — major infrastructure disruption*) People × 3 L × 14 days / **30-Day Longer-Term Goal** (*Extended — optional*) People × 3 L × 30 days, then the note: *"The official baseline is drinking water. Get Ready advises storing more if you can: hot weather and hard physical work can double what you need, children, nursing mothers and people who are unwell need more, and pets need water too. The 7-, 14- and 30-day rows are **optional extended resilience storage** — OffGrid056 planning goals, not official requirements. Round each total up to the next whole litre."* |
| 7 | Step 1 table — **AU** | the same | the same structure: **3-Day Emergency** (*OFFICIAL EMERGENCY BASELINE (for example Get Ready Queensland)*) People × 10 L / 7-Day: People × 10 L × 7 ÷ 3 / 14-Day: People × 10 L × 14 ÷ 3 / 30-Day Longer-Term Goal: People × 10 L × 30 ÷ 3, then the note: *"The official baseline is drinking water for three days; your state or territory emergency service may advise more for your area. The 7-, 14- and 30-day rows scale that three-day amount to more days — **optional extended resilience storage** and an OffGrid056 planning calculation, not an official requirement. Round each total up to the next whole litre."* |
| 8 | Step 2 total note | Add all "Usable Litres" above | Usable litres = capacity × the share that is filled. Add all "Usable Litres" above. Count only water that is safe to drink, or that you will make safe before drinking — see Storing drinking water. |
| 9 | Gap table column | Gap (L) | Gap (L) = Need − Have |
| 10 | Gap row | 3-Day Minimum | 3-Day Official Baseline |
| 11 | Gap row | 7-Day Target | 7-Day (extended) |
| 12 | Gap row | 14-Day Target | 14-Day (extended) |
| 13 | Gap row | 30-Day Goal | 30-Day (extended) |
| 14 | Reality Check | If your 3-day gap is **more than 50 litres**, that is your highest priority this week. | If you have **any gap in your 3-day official baseline**, close it first. |
| 15 | Container field | Container type I will buy (e.g., 20L drums, 200L barrel, 1000L IBC tote) | Container type I will buy (see Storing drinking water for suitable containers) |
| 16 | Storage field | Where I will store it (cool, dark, away from chemicals) | Where I will store it (see Storing drinking water) |
| 17 | Storage Tips box | **Storage Tips**: Dark + cool + sealed = safe. Store containers in a garage, shed, or cupboard away from sunlight and chemicals. Label every container with the fill date. Rotate every 6–12 months. Add 5 drops of plain unscented bleach per litre if treating uncertain water sources. | **Storing It Safely**: This calculator is for **how much** to store. How to store it — which containers, where to keep them, how often to check them, and how to make water safe to drink — is in **Storing drinking water** in this resource, written for your market. |
| 18 | Closing heading | Day 8 Complete | Water Plan Complete |
| 19 | Closing text | …the precise gap to close. The next asset shows you how to make any water safe to drink. | …the precise gap to close. |
| 20 | Next link | Next: OG-09 Water Filtration Comparison Matrix → | *removed* |

**Each change was checked against the re-skinned source, and all 20 apply.**

**Caught during preparation:** my first draft reused "30-Day Goal" in Step 1, which is the wording change 13 removes.
The verifier failed it, and the row was renamed "30-Day Longer-Term Goal".

## 10. Related-resource recommendations

**Link:**

- **Resilience Product Wishlist** (res-1022): buying containers.
- **3-Tier Budget Planner** (res-1026): costing the gap. It already has water lines.
- **Off-Grid System Architecture Planner** (res-1512): the whole water system (capture, storage, treatment,
  distribution) for members going further.

**Not linked:** Household Risk Identifier (weak). **Future, not linked (undeployed):** OG-09 treatment, OG-10
rainwater, OG-B08 tanks. OG-08 would become their starting point.

## 10b. DECISION NEEDED — slug collision with a demo placeholder

**What's already there:** the public repo has a demonstration record from Stage 5:

- `data/resources/water-storage-calculator.json`: **res-0015**, `isPlaceholder: true`, *"DEMONSTRATION ENTRY: a
  placeholder…"*
- its demo PDF: `public/resources/water/water-storage-calculator.pdf`

**The conflict:**

- It uses the **same slug** OG-08 needs.
- `validate-content` rejects duplicate slugs, so **the preview build would fail**. This is fail-safe: nothing wrong
  can ship, but OG-08 **can't be built until this is decided**.
- The placeholder is referenced by a demo workshop, the Water Security Guide's related links, the "water-basics"
  learning path, programme day 9, and three unit tests.
- **The same collision is coming** for OG-10 (`rainwater-harvesting-planner`), OG-01 (`home-resilience-scorecard`)
  and OG-13 (`healthy-home-air-audit`).

**Nothing real is in GitHub:** the two tracked files are demo placeholders.

**Options:**

| Option | What happens | Trade-off |
|---|---|---|
| **A. Preview-only supersession (recommended)** | A real private record declares `supersedes: "res-0015"`. The preview build drops that placeholder and points its references to the real resource. | The public repo and production build are untouched. Reusable for OG-10, OG-01 and OG-13. Needs a small, tested build change. |
| B. Different slug for OG-08 | OG-08 becomes, for example, `household-water-storage-calculator` | No code change, but members see **two "Water Storage Calculator" entries** (demo and real) |
| C. Retire the placeholder in the public repo | delete res-0015 and its demo PDF; update the workshop, path, day 9 and tests | A public-repo change that also affects the demo site |

## 11. NZ PDF readiness

| Check | Result |
|---|---|
| File | `water-storage-calculator.NZ.pdf` |
| Pages | 6 |
| Title | Water Storage Calculator — OffGrid056 |
| Emergency numbers | 111 only |
| NZ formulas | all four present (People × 3 L × 3 / 7 / 14 / 30 days) |
| NZ wording | the Get Ready baseline; the "store more if you can" note |
| AU content | none: no 10 L formula, Get Ready Queensland, "state or territory", boiling, 000, 112, SES, "Australia" |
| Labels | the OFFICIAL EMERGENCY BASELINE and optional-extended labels; the rounding rule; the usable-litres and gap formulas |
| Removed content | none of: 50–70%, "10 litres per person per day", "more than 50 litres", 20L / 200L / 1000L / IBC, 6–12 months, "Dark + cool + sealed", "uncertain water sources", Day 8, Week 2, OG-08, OG-09, Next:, "Your Number" |
| Bleach | once, inside the approved NZ block only |
| Drinking-water block | whole on page 6 |
| Tokens · VERIFY · browser-error page | none |
| Changes | all 20 applied |
| Draft | yes |

**Status: PREVIEW_WITH_PROPOSED_COPY.**

## 12. AU PDF readiness

| Check | Result |
|---|---|
| File | `water-storage-calculator.AU.pdf` |
| Pages | 6 |
| Title | Water Storage Calculator — OffGrid056 |
| Emergency numbers | 000 + 112 only |
| AU formulas | all four present (People × 10 L; × 7 ÷ 3; × 14 ÷ 3; × 30 ÷ 3) |
| AU wording | the Get Ready Queensland example baseline; "scale that three-day amount"; boil for at least one minute (block) |
| NZ content | **no bleach, "civil defence", "3 L per person per day", NZ "store more" wording, 111 or "New Zealand" / "NZ"** |
| Other checks | the same as NZ: labels, removed content, block whole on page 6 |
| Status | the same as NZ |

**Checks run:**

- `import:verify-prep`: **32/32** files pass.
- The other 15 resources are all still READY.
- The live build verifies as 15 records, 30 files, 0 broken links.

## 13. Tests

**305 passed** (300 + 5). Lint and typecheck clean.

**The five new tests:**

1. NZ formulas use 3 L per person per day, never 10 L.
2. AU formulas use 10 L for three days, not per day, scaled openly. The scaling arithmetic is checked.
3. Both markets label the official baseline, the optional extended storage and the rounding rule.
4. There's no treatment in OG-08's own text, and no removed figures.
5. OG-08 uses only the drinking-water block, and the OG-26 review is queued.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `61d2acd0` |
| Deployed resources | the 15 are unchanged |
| Access | still blocks, including OG-08's would-be URL and PDF |
| OG-08 in GitHub | **0 files** (the two tracked files named `water-storage-calculator` are the Stage 5 demo placeholder, §10b) |
| `--real` | refused |

## 14. Deployment recommendation

**Do not deploy OG-08 yet.** It needs these decisions:

1. **The slug collision (§10b).** I recommend **Option A**, preview-only supersession of the placeholder.
2. **The 20 changes.** I recommend approving all of them. The ones that matter most:
   - **4–7:** the corrected baselines. This is safety-relevant, because the old figure was wrong in both markets.
   - **17:** removes the bleach misuse.
3. **Metadata:** water-storage (or household-water-planning), beginner, 20 min.

**After that:** apply your slug decision, re-render, verify the exact build, then deploy as the **16th** resource with
rollback to `61d2acd0`.

**Stopped. OG-08 not deployed. OG-09, OG-10 and OG-B08 not started.**
