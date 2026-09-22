# OG-21 — HOME ENERGY & SHELTER UPGRADE PLAN · REVIEW · NOT DEPLOYED

OG-21 is ready for your review as **PREVIEW_WITH_PROPOSED_COPY**. Its 23 proposed changes appear in the NZ and AU
previews so you can see them, but none is approved yet.

**What the audit found:**

1. **OG-21 was the programme's "Week 3 summary".** Almost all of its problem content is **programme structure**:
   - "The Week 3 Lock"
   - "Days 15–20" and the day ranges on each card
   - "from OG-03"
   - the Week 4 preview
   - "Week 3 Complete"
2. **It contains almost no technical claims.** There are no temperatures, efficiency or heat-loss percentages, R-values,
   Healthy Homes or Building Code references, running costs, payback periods, or savings figures.
3. **It works best as a summary plan** that draws on the Warm Home Scorecard, Solar Power 101 and the Battery Backup
   Planner, and feeds the 3-Tier Budget Planner.

**Safety:** it needs two blocks, wood burners and electrical, and both are already approved. No new hazard was found.

**One decision about the title** is set out in §2.

**Also done this stage:** the approved **OG-18 back-links** on OG-B07, OG-19 and OG-26 are queued in the records and
verified in a local build. They are **not deployed**; they'll ship with the next approved deployment.

**Live preview unchanged:** `4daef2b4`, 12 resources.
**Date:** 22 September 2026

---

## 0. Related links queued (Stage 9.31 approval)

| Record | relatedResources | Assessment |
|---|---|---|
| OG-B07 Solar Planning Deep Worksheet (`res-1507`) | + `res-1018` | Approved: OG-18 is its introduction. |
| OG-19 Battery Backup Planner (`res-1019`) | + `res-1018` | Approved: OG-18 covers the solar side before the battery. |
| OG-26 3-Tier Budget Planner (`res-1026`) | `res-1022`, `res-1027`, + `res-1018` | **Useful, so added.** Tier 2's *"Grid-tied solar sized to your household's use + monitoring"* asks the member to budget for something OG-18 teaches them to size and get quotes for. |

**Record changes only:** no PDF was re-rendered and no copy was changed. They're kept in the metadata as well as the
private records, and a test guards them.

**Local build with the links:** `import:verify-build` gives 12 records, 24 files, 0 broken links. Each of the three
pages now links to OG-18; the Warm Home Scorecard page (checked for comparison) is unchanged.

**Rollback:** a new snapshot, `workspace/backups/private-assets-4daef2b4`, holds the private files **exactly as
live**, without the queued links. Its 24 PDFs are byte-identical to the live build.

## 1. OG-21 audit

| | |
|---|---|
| Title (document) | **Home Energy & Shelter Upgrade Plan** (cover and page headers) |
| Group | re-skin group B |
| Source | HTML/PDF pair |
| Pages | 6 |
| Tables | 1 |
| Intro box | "The Week 3 Lock" |
| Summary | "Week 3 Pillar Summary": 3 cards (Shelter, Heating, Energy) |
| Priority table | 5 rows, ranking actions by impact, cost and ease |
| Budget | "Consolidated Week 3 Budget": 7 fields |
| Next steps | the Week 4 preview |
| Commitment | the commitment and signature box |
| Closing | "Week 3 Complete" |
| Audit safety notes | solid fuel (8 mentions); batteries and inverters (8 mentions) |

**Legacy programme content:**

- "Week 3 — Shelter, Heating & Energy"
- "OffGrid056 30-Day Programme"
- "Week 3 synthesis"
- "Asset OG-21 | Day 21" ×2
- "The Week 3 Lock … Days 15–20 … Week 3"
- "Week 3 Pillar Summary" and "Days 15–16 / 16–17 / 18–20"
- "Rank your Week 3 actions"
- the "Pillar" column
- "Consolidated Week 3 Budget" and "Week 3 total investment"
- "(from OG-03)", a visible code
- "declared tier budget"
- "Before You Move to Week 4" and "Week 4 Preview"
- "My Week 3 Commitment"
- "Week 3 Complete"
- "Next: Week 4 …"

**Not present:** Action Plan Plus, Skool, old product names, tier labels, generators.

**Products, providers and brands:** **none named.** There are no heat pumps, wood burners, batteries, solar
products, installers, retailers or energy providers.

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| **Title** | **Home Energy & Shelter Upgrade Plan** | **SOURCE**: the cover and page headers. **Your decision:** your brief says "Home Energy Shelter Upgrade Plan", which is the audit's name, taken from the file name. With "&", the PDF title and route are **Home Energy & Shelter Upgrade Plan — OffGrid056** and `/resources/home-energy-and-shelter-upgrade-plan/`. Without it, the cover would need a copy change to match. I recommend keeping "&". |
| ID | res-1021 | |
| Foundation | shelter | audit HIGH |
| Type | planner | audit HIGH |
| Category | **household-resilience** (*"The home as the base of your resilience plan."*) | **INFERRED**. Alternative: property-assessment. |
| Difficulty | recommend **beginner** | **OWNER-REVIEW REQUIRED** · INFERRED: summarising, ranking and budgeting, with no calculations |
| Time | recommend **30 min** | **OWNER-REVIEW REQUIRED** · INFERRED: 3 summary cards, a 5-row priority table, 7 budget fields and a commitment. Excludes completing the resources it draws on. |
| Description | *"Your complete Shelter, Heating & Energy roadmap — priorities, budgets, and timelines in one actionable document."* | **PROPOSED**: the cover subtitle without "Week 3 synthesis." |
| Tags | none | none invented |
| Related | Warm Home Scorecard · Solar Power 101 Workbook · Battery Backup Planner · 3-Tier Budget Planner | **PROPOSED** (§3) |

## 3. Relationship to current library resources

**OG-21 is the summary step.** It gathers each resource's result and turns it into priorities and a budget. **It
doesn't repeat any teaching**, only a line for each result:

| OG-21 card or field | Comes from | Duplication? |
|---|---|---|
| Warm home score ___/80, top cold zone, insulation planned | **Warm Home Scorecard** (OG-15). **Its scale is also /80 (checked).** | none: OG-21 records the result |
| Solid fuel, fuel stock, chimney/flue | heating resources not in the library yet (OG-16/17) | none |
| Solar target kW | **Solar Power 101 Workbook** (OG-18) | none |
| Battery target kWh | **Battery Backup Planner** (OG-19) | none |
| Other energy option | the Day 20 resource (OG-20), **not in the library**, so the field is now generic | none |
| Budget check | **3-Tier Budget Planner** (OG-26), replacing "from OG-03" | none |
| Next steps | Resilience Product Wishlist · Project Support Brief Template · 3-Tier Budget Planner · 90-Day Implementation Roadmap (all live) | none |

**Future resources:** when heating or insulation resources join the library (OG-16, OG-17), the heating card can
name them the same way the shelter and energy cards now do.

**Proposed related links:** res-1015, res-1018, res-1019, res-1026.

## 4. Claims table

**Categories from your brief that the source doesn't contain:**

- **Heating:** no temperature recommendations, efficiency percentages, heat-loss percentages, heater sizing,
  insulation savings, running costs, payback periods, wood-burner claims, heat-pump claims or energy-saving
  percentages.
- **Shelter:** no R-values, insulation levels, retrofit assumptions, roof, wall or floor claims, draught-proofing,
  condensation, ventilation, Healthy Homes or Building Code references.

**The only claims and figures in the source:**

| # | Exact original | Classification | Action |
|---|---|---|---|
| C1 | *"Warm home score: ___/80"* | cross-resource scale | **KEEP**: matches the live Warm Home Scorecard's /80 |
| C2 | *"Score: ___/10"* ×3, *"1-5"* ease, *"H/M/L"* | the member's own ratings | **KEEP** |
| C3 | *"Do the highest-impact, lowest-cost actions first."* | recommendation (general prioritisation) | **KEEP** |
| C4 | *"Grant eligible: □ Yes □ No"* | grants and subsidies (no programme named) | **REWRITE** to *"Grant or rebate eligible"*, which is neutral: NZ grants, and AU state and territory rebates. No programme is named in either market. |
| C5 | *"Solid fuel chosen" / "Winter fuel stock: ___ m³" / "Chimney swept"* | heating assumption: every member uses solid fuel | **REWRITE** the last two with "(if solid fuel)", and "Chimney / flue". "Solid fuel chosen" is kept. The approved block already says to have the chimney flue cleaned every year. |
| C6 | *"I commit to starting these … actions within 14 days"* | the member's own commitment prompt | **KEEP_AS_EXAMPLE** |
| C7 | *"Your shelter is becoming a fortress."* | overstatement | **REMOVE** (closing rewrite) |
| C8 | *"You have audited your home's warmth, identified grants, planned solid fuel backup, sized a solar system, selected battery storage, and explored alternatives."* | assumes six programme days were completed | **REWRITE** (closing) |
| C9 | *"If you only keep one document from Week 3, keep this."* | programme framing | **REWRITE** (intro box) |

**No numbers were added.**

## 5. Required safety blocks

| Block | Needed? | Why |
|---|---|---|
| **Wood burners and open fires** (solid-fuel-heating, approved) | **YES** | Solid fuel, fuel stock and chimney/flue |
| **Batteries and electrical safety** (approved) | **YES** | Solar, battery and "energy invest" planning |
| Emergency + disclaimer | yes | every resource |
| Generator / CO / indoor combustion | **no** | the word "generator" doesn't appear. "Other energy option" is a blank field with no teaching. |
| Food safety | no | not mentioned, and the detector doesn't trigger |
| Working at height | no | no roof task |
| Gas | no | not mentioned |

**No new hazard was found.**

**Placement:** the wood-burner block prints on page 5, with the disclaimer. That matches how it prints in the live
OG-15.

## 6. NZ / AU differences

**OG-21 has no market-specific copy.** All 23 changes apply to both markets, and a test enforces this. The market
differences come only from the approved blocks:

| Area | NZ | AU |
|---|---|---|
| Electrical | "licensed electrical worker" | "licensed electrician" |
| Wood burners | the approved NZ block wording | the approved AU block wording |
| Emergency / agency | 111 · Civil Defence | 000 + 112 · SES |
| Grants and rebates | "Grant or rebate eligible", with **no programme named** | the same. No NZ scheme (for example Warmer Kiwi Homes), no EECA, and no single national AU scheme. |

**Not in the source:** insulation or heating terminology, wood-burner rules, building or planning terms, agencies,
climate assumptions. **Nothing was added.**

## 7. Exact proposed copy changes (23; PROPOSED, not approved)

All 23 apply to both markets. Each was checked against the re-skinned source before being recorded, and all apply.

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 3 — Shelter, Heating & Energy | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Cover subtitle | **Week 3 synthesis.** Your complete Shelter, Heating & Energy roadmap — … | Your complete Shelter, Heating & Energy roadmap — … (the rest unchanged) |
| 4 | Page headers ×2 | Asset OG-21 \| Day 21 | *removed* |
| 5 | Intro box | **The Week 3 Lock**: This worksheet synthesises Days 15–20 into one coherent Shelter + Heating + Energy plan. If you only keep one document from Week 3, keep this. It is your insulation, heating, solar, battery, and alternative energy snapshot — ready to act on or share with a professional. | **How to Use This Plan**: This plan brings your shelter, heating and energy planning together in one place. Fill in what you have from the Warm Home Scorecard, the Solar Power 101 Workbook and the Battery Backup Planner, and leave blank anything you have not looked at yet. It is your insulation, heating, solar, battery, and alternative energy snapshot — ready to act on or share with a professional. |
| 6 | Summary heading | Week 3 Pillar Summary | Shelter, Heating & Energy Summary |
| 7 | Shelter card | Days 15–16 | From the Warm Home Scorecard |
| 8 | Shelter card | Grant eligible: | Grant or rebate eligible: |
| 9 | Heating card | Days 16–17 | Main or backup heating |
| 10 | Heating card | Winter fuel stock: ___ m³ / Chimney swept: | Winter fuel stock (if solid fuel): ___ m³ / Chimney / flue swept (if solid fuel): |
| 11 | Energy card | Days 18–20 | From Solar Power 101 and the Battery Backup Planner |
| 12 | Energy card | Alternative: | Other energy option (if any): |
| 13 | Priority intro | Rank your Week 3 actions by impact, cost, and ease. | Rank your shelter, heating and energy actions by impact, cost, and ease. |
| 14 | Priority table | Pillar | Area |
| 15 | Budget heading | Consolidated Week 3 Budget | Consolidated Budget |
| 16 | Budget | Week 3 total investment | Total investment |
| 17 | Budget | Still within declared tier budget? (from OG-03) | Still within my budget? (see the 3-Tier Budget Planner) |
| 18 | Heading | Before You Move to Week 4 | Next Steps |
| 19 | Week 4 box | **Week 4 Preview — Action Planning**: Week 4 is where everything comes together. You will build your complete product wishlist, prepare supplier questions, decide if you need professional help, create a 3-tier budget, and write your 90-day implementation roadmap. You are no longer learning — you are executing. | **Taking It Further**: When you are ready to act, the library can help you list what to buy (Resilience Product Wishlist), brief a professional (Project Support Brief Template), set a three-tier budget (3-Tier Budget Planner) and schedule the work (90-Day Implementation Roadmap). |
| 20 | Commitment | My Week 3 Commitment | My Commitment |
| 21 | Commitment | I commit to starting these Week 3 actions within 14 days: | I commit to starting these actions within 14 days: |
| 22 | Closing | **Week 3 Complete**: You have audited your home's warmth, identified grants, planned solid fuel backup, sized a solar system, selected battery storage, and explored alternatives. Your shelter is becoming a fortress. | **Plan Complete**: Your shelter, heating and energy priorities, budget and timeline are now in one place — ready to act on or share with a professional. |
| 23 | Next link | Next: Week 4 — Action Plan & Upgrade Pathway → | *removed* |

**Notes:**

- **Change 19 drops "prepare supplier questions"** because that resource isn't in the library.
- **Changes 5, 19 and 22 are new wording.** Approve or strike each one.

## 8. NZ PDF readiness

| Check | Result |
|---|---|
| File | `home-energy-and-shelter-upgrade-plan.NZ.pdf` |
| Pages | 6 |
| Title | Home Energy & Shelter Upgrade Plan — OffGrid056 |
| Emergency numbers | 111 only |
| AU terms | none: no licensed electrician, SES, 000, 112 or "Australia" |
| Blocks | Wood burners and open fires; Batteries and electrical safety |
| Legacy content | **none** (25 terms checked): Week 3/4, Days, Day 21, OG-03, OG codes, Pillar, fortress, "declared tier" and the rest |
| Tokens · VERIFY · browser-error page | none |
| Changes | all 23 applied |
| Draft | yes |

**Layout:**

| Page | Content |
|---|---|
| 2 | safety blocks, intro, summary cards |
| 3 | priority table, whole |
| 4 | budget and next steps |
| 5 | commitment, closing, disclaimer and wood-burner block |

**Status: PREVIEW_WITH_PROPOSED_COPY.** It's waiting on the 23 changes, the title, difficulty and time.

## 9. AU PDF readiness

| Check | Result |
|---|---|
| File | `home-energy-and-shelter-upgrade-plan.AU.pdf` |
| Pages | 6 |
| Title | Home Energy & Shelter Upgrade Plan — OffGrid056 |
| Emergency numbers | 000 + 112 only |
| NZ content | **no "New Zealand", "NZ", EECA, Warmer Kiwi, Civil Defence or 111** (the verifier checks the country name) |
| Electrical wording | "licensed electrician" |
| Other checks | the same as NZ |
| Status | the same as NZ |

**Checks run:** `import:verify-prep` passes 26/26 files, including the unapplied-change check and the other-market
check.

**Caught during preparation:** my first version of change 12 ended in a partial tag (`<span`). The verifier failed
it rather than guess, and it was corrected to plain text.

## 10. Tests

**274 passed** (269 + 5). Lint and typecheck clean.

**The five new tests:**

1. OG-21 leaves no programme navigation, legacy codes or "Pillar".
2. It names only resources that are in the library.
3. It's market-neutral.
4. It uses only the two blocks it needs.
5. The OG-18 back-links are queued on OG-B07, OG-19 and OG-26.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `4daef2b4` |
| Deployed resources | the 12 are unchanged |
| Access | still blocks, including OG-21's would-be URL and PDF |
| OG-21 in GitHub | 0 files |
| `private-assets/` tracked in git | 0 files |
| `--real` | refused |

## 11. Deployment recommendation

**Do not deploy OG-21 yet.** It needs these decisions:

1. **Title:** keep "Home Energy & Shelter Upgrade Plan", with "&", as recommended.
2. **The 23 changes.** I recommend approving all of them. Most are programme-navigation removals. The new wording in
   5, 19 and 22 needs your review.
3. **Metadata:** beginner, 30 min, category household-resilience.

**After that:** re-render, verify, then deploy as the **13th** resource, **together with the queued OG-18
back-links**, with rollback to `4daef2b4`.

**OG-20:** a research-only generator-safety stage is recorded for later
(`STAGE_OG20_GENERATOR_SAFETY_RESEARCH_PLAN.md`). **I haven't started it.**

**Stopped. OG-21 not deployed.**
