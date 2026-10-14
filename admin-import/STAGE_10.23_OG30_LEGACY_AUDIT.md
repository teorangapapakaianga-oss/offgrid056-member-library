# Stage 10.23 — OG-30 legacy resource audit and disposition

**Audit only.** No rewrite, cover, render, stable ID, protected record, staging or deployment. No config, register, record, PDF, route, Planning Tools, Worker, Cloudflare, Supabase, Railway, OS or entitlement item changed. The only new tracked file is this report (git-ignored scratch evidence stays under `workspace/`).

LIVE (unchanged): **33 protected resources · 66 market files · Planning Tools 12 · Downloads 55 · My Progress 58 · 0 broken links** · Worker `4b864fb7-6736-46e5-b918-39f92ab37128` · rollback `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`. Migration (unchanged): Deployed 33 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 10 = 45.

## 1. Source (one candidate, two identical copies)
Searched only the two OffGrid056 legacy archives and the repo (not the shared Downloads folder at large).
| | |
|---|---|
| HTML | `…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-30_Upgrade_Pathway_Decision_Matrix.html`, 14,227 bytes, 2 May 2026, sha256 `33962ADE2D194F839C20422CFFF61DC55A0CA747556A0CEDE06079341CF73BCF` (working copy `workspace/og-30-legacy.html`) |
| PDF | `…\OffGrid056\PDFs\OG-30_Upgrade_Pathway_Decision_Matrix.pdf`, 590,302 bytes, 6 pages, sha256 `8461798698FBBD8D071AA2E96B20D7C5D43368DCA7673AC5F88C48336A2471CE` |
| Second copy | `Downloads\New folder - Copy\Off-Grid- Survival\OffGrid056\…` holds the same HTML and PDF, **byte-identical** (1 May 2026). No alternate version, no DOCX or Markdown. **Authoritative: the HTML/PDF pair above.** |
| Titles | HTML title and PDF title field "OG-30 Upgrade Pathway Decision Matrix — OffGrid056"; chip "Week 4 — Action Plan & Pathway", label "OffGrid056 30-Day Programme", subtitle "Day 30 — Choose your long-term resilience direction", brand "OFFGRID056.COM" |
| Cover asset | legacy Week 4 programme artwork (`/mnt/agents/…/Week4_ActionPlanPathway_Cover.jpg`, alt "Week 4 Cover"); no OG-30 image |
| Earlier mentions | Stage 9.5: general, planner, content-update class B; safety standard lists it among resources needing electrical wording. No review-config entry, ruling or classification decision. |

## 2. What the source contains
**Purpose (its own words):** "Day 30 is not the end. It is the beginning. This matrix helps you choose what happens next: maintain, expand, accelerate, or transform. Every pathway is valid. The only wrong choice is no choice at all."
**Sections:** (1) **The Four Pathways**: A Maintain & Monitor, B Grow & Optimise, C Go Off-Grid, D Total Resilience / Homestead, each with Profile, What you do, Time commitment (hours per month), Capital required (dollar ranges) and Best for. (2) **Pathway Comparison Matrix**: seven dimensions across the four pathways (autonomy level from "72 hours – 2 weeks" to "1 year+ indefinite", grid dependency, food dependency, skill level, community role, annual maintenance cost, upfront capital). (3) **My Pathway Decision**: ten blank prompts (current tier completed from OG-26; goal in one sentence; time horizon; capital I can access; skills I am willing to learn; sacrifices I accept; selected pathway A to D; first upgrade project "after Day 30"; target completion; how I will measure success). (4) **Next 12-Month Upgrade Calendar**: twelve rows (Month, Project, Budget $, Owner, Status). (5) **"Congratulations — You Have Completed OffGrid056"** closing: "In 30 days you have audited your home…", "You are not the same person who started Day 1. You are prepared, informed, and action-ready.", "a plan is the difference between panic and purpose when the world gets uncertain", "Welcome to the resilient life. Now go build it."
**Member actions:** read four pathways, choose one, answer ten prompts, fill a twelve-month project and budget calendar. **Type:** a decision matrix plus planner (member-entered half and a heavily prescriptive reference half). **Technical content:** named but not taught (off-grid solar and battery, bore or spring water, composting toilet or septic, grid disconnection, orchards, livestock, multiple dwellings). **Prices:** eleven dollar ranges. **Market-specific content:** none by name (dollar figures and "legally permitted" are unmarked).

## 3. Overlap with the live library (33 protected + demo)
| Resource | Overlap | Strength | Note |
|---|---|---|---|
| res-1512 Off-Grid System Architecture Planner (general / advanced-future / planner, advanced) | long-term independence design | **MODERATE** | res-1512 designs an integrated system; OG-30 only chooses a direction. Natural neighbour, no collection. |
| res-1026 3-Tier Budget Planner | the Essential / Balanced / Complete tier and a capital view | MODERATE | OG-30 starts "Current Tier Completed (from OG-26)". |
| res-1029 Household Action Plan, res-1027 90-Day Implementation Roadmap, res-1510 Roadmap (Advanced) | project, owner, budget and status calendar | **MODERATE** | the twelve-month calendar duplicates what the action plan and roadmap already do. |
| res-1021 Home Energy & Shelter Upgrade Plan | "upgrade" projects | LOW to MODERATE | different subject (a specific plan) |
| res-1003 Household Spending Capacity Check, res-1004 Property Type Review | capital and property context | LOW | |
| res-1028, res-1007, res-1504 | roles, priorities, monthly challenge | LOW | |
No exact or near-duplicate exists. **OG-30 still has one distinct job:** choosing a long-term direction (how far the household wants to take its independence) with the reasons, trade-offs and first project written down. Nothing else in the library asks that question. Its twelve-month calendar and the comparison matrix are not distinct.

## 4. Member value test
1. **Problem:** after near-term planning, the household has no structured way to decide how far it wants to go over the longer term. 2. **Solved elsewhere?** Partly: tiers and budget (res-1026), actions and roles (res-1029, res-1028), schedule (res-1027), system design (res-1512, advanced); not the direction decision. 3. **Distinct output?** Yes: a chosen direction and the reasoning. 4. **Useful now?** Yes, as a standalone decision worksheet; no, as the "end of the 30-day journey". 5. **Rewrite improve or duplicate?** It improves the library if narrowed to the decision (the matrix numbers and the calendar are the parts that would duplicate or mislead).

## 5. Classification (recommendation only)
**Foundation: general.** **Program Component: advanced-future** (long-term direction beyond the near-term plan, matching res-1512; alternative planning-implementation, an owner choice). **Category: planning. Resource type: worksheet** (member-entered; the source is a planner). **Difficulty: intermediate** (decisions about long-term trade-offs; inferred, source states none). **Estimated time: 30 minutes** (inferred). **Planning Tools: OWNER DECISION.** Recommend NO if advanced-future (consistent with res-1512, which is in no collection), YES if you prefer planning-implementation and discoverability. Not added.

## 6. Safety audit
`safetyExposureFor` on the HTML and the PDF: **batteries-and-electrical** (Pathway B "solar battery expansion", Pathway C "off-grid solar + battery"). Topics named by the source that the detector does not own but a rewrite must not teach: water supply (bore, spring, water storage), sanitation (composting toilet, septic), grid disconnection, livestock, food forests, multiple dwellings. **No procedure is taught**; every item is a label. **Recommendation:** a neutral rewrite names no system or appliance (the member may write their own), so it carries only the standing emergency-contact and general-disclaimer blocks. No detector change.

## 7. Regulatory audit
Hardened detector: **1 assertion**: "sever grid connections **where legally permitted**" (Pathway C). It is a legality statement, classed too absolute and unsupported (no market source); **REMOVE** in a rewrite. No licence, consent, permit or compliance wording otherwise. Unresolved after rewrite: 0 expected.

## 8. Numeric and claim audit (per market, identical)
33 candidates; **Bucket C 14 per market**: eleven dollar ranges (capital per year, capital over years, four annual-maintenance bands, four upfront-capital bands), the two capital-linked intervals "2-5 years" and "5-10 years", and "legally permitted". Prices: 11 PRICE, 2 PLACEHOLDER. The remaining candidates are programme labels, hours-per-month commitments and the autonomy durations (D). Claim families: **only regulatory fires (1 sentence of 96)**; survival, supply, emergency-period, storage, target-label, payback, warranty, payment, multiplier, comparative, outcome and assurance: 0. **Detector gaps noted for the owner (not patched):** the "Autonomy Level" row ("72 hours – 2 weeks" to "1 year+ indefinite") is an unsupported autonomy-duration claim that no family owns; and the absolute and outcome statements ("Every pathway is valid", "You are prepared, informed, and action-ready", "a plan is the difference between panic and purpose") are not caught. All of it is removed in a rewrite, so no detector change is needed. No exemption proposed.

## 9. Legacy-language audit
REMOVE: "Week 4 — Action Plan & Pathway", "OffGrid056 30-Day Programme" (twice), "Day 30", "Day 1", "Day 30 is not the end", "After Day 30", "In 30 days you have…", "Congratulations — You Have Completed OffGrid056", "You are not the same person who started Day 1", "panic and purpose", "Welcome to the resilient life", OFFGRID056.COM, the old cover path and alt, OG-30 and the "(from OG-26)" cross-reference, "72-hour". REWRITE: "Upgrade Pathway Decision Matrix" (title), "Upgrade Project", "Pathway A/B/C/D" labels, "Go Off-Grid", "Homestead". KEEP INTERNAL ONLY: the four-pathway mapping. Content flags: programme-sequencing 4, cross-reference 1.

## 10. Market feasibility
**One identical market-neutral NZ/AU body is achievable.** The only blockers are the dollar figures (unmarked currency) and "where legally permitted"; both go. No jurisdiction term needed.

## 11. Related resources and automatic fill
Recommended (live IDs): **BEFORE** res-1027 90-Day Implementation Roadmap · **NEXT** res-1512 Off-Grid System Architecture Planner · **ALSO USEFUL** res-1026 3-Tier Budget Planner · **LATER** res-1021 Home Energy & Shelter Upgrade Plan (res-1029 Household Action Plan is a good alternative for BEFORE). **Engine check (real engine, simulated; nothing changed):** four curated links suppress the fill; with three links (without res-1021) it would append res-0008 (demo), res-1510 and res-0006 (demo); with two it would append res-1026, res-0008, res-1510 and res-0006. **Four curated links are required.**
**New caution for staging:** the engine fills pages with fewer than four curated links in **slug-alphabetical order** from the general / planning pool, and the sixth slot on three existing pages is now `household-action-plan`. If OG-30 is a general / planning resource whose slug sorts **before** "household-action-plan" (for example starting with "d", "f" or "g"), it would again change those three pages. Slugs sorting after it (for example `long-term-direction-planner`) will not. Worth fixing in the slug ruling.

## 12. Cover concept (not generated)
A title-free image of an adult couple, or a couple with an older child, at a table in a calm home looking out toward a garden or open land through a window, with a notebook and one blank sheet in front of them (a quiet, forward-looking scene), natural daylight, warm tones, a clear upper area for the template title. Avoid: readable text, logos, OG codes, solar panels, batteries, tools, uniforms, houses under construction, livestock, survival or fear imagery, robots, neon.

## 13. Disposition
**B — REWRITE BEFORE MIGRATION (narrow).** The distinct job (choose a long-term direction and record why) is worth keeping, but the source cannot migrate: eleven unsupported dollar ranges and capital-linked durations (Bucket C 14), an unsupported autonomy-duration row, a legality statement, programme-completion framing with absolute and outcome language, named off-grid systems, and a twelve-month calendar that duplicates res-1029 and res-1027. A neutral, member-entered "direction" worksheet removes all of it. **D (archive) is a reasonable alternative** because the library already covers tiers, actions, roles and system design and this job is small; **C (merge)** has no good target (res-1512 is advanced and system-focused; res-1026 is budgeting).

## 14. Proposed future structure (no copy drafted)
- **Title:** Long-Term Direction Planner (alternatives: Next Steps Direction Worksheet, Future Direction Worksheet). **Description (one sentence):** "A practical worksheet to help your household think through how far you want your resilience planning to go and choose a direction for what comes next."
- General / advanced-future / planning / worksheet; intermediate; about 30 minutes. Slug suggestion `long-term-direction-planner` (see the slug caution above).
- **Sections:** What This Worksheet Is For (with How to Use It); Where We Are Now (what we have done, what is working, what is still open); Directions We Are Considering (a member-written table: direction · what it would mean for us · what it would ask of us · what we would change or give up · what we still need to find out; the household names its own options, with optional neutral prompts such as keep things as they are, improve step by step, become more self-reliant); Our Chosen Direction (the direction, why, the time horizon in the household's own words, what we can commit, skills we are willing to learn, trade-offs we accept, how we will know it is working); Our First Project (one project, who, a target date if any); When We Will Revisit It; Notes; Where Next; Where You Are Now; standing blocks. **No** pathway cost bands, durations, hours, comparison matrix, twelve-month calendar or completion message.
- **Safety blocks:** emergency-contact and general-disclaimer only. **Market:** one identical body. **Planning Tools:** owner decision (lean NO with advanced-future). **Related:** the four above. **Cover:** title-free image.

## 15. State
Stable ID assigned **NO** (the Stage 9.5 mapping suggests `res-1030`; unassigned, recorded nowhere); protected record NO; staging NO; render NO; deployment NO. Repo changes: this report only; scratch under `workspace/` is git-ignored (detector evidence `workspace/og30-detect.txt`). No application code changed, so no lint or typecheck was needed; `git status` shows only the report.

## 16. Owner decisions required
1. Approve disposition **B** (narrow rewrite), or choose D (archive) or C (merge). 2. Title and the one-sentence description. 3. Program Component: advanced-future (recommended) or planning-implementation; difficulty intermediate; about 30 minutes. 4. Planning Tools: yes or no (recommend no with advanced-future). 5. The four related links (res-1027, res-1512, res-1026, res-1021) or alternatives. 6. A slug that sorts after `household-action-plan` (recommended `long-term-direction-planner`), or acceptance that three existing pages' automatic related cards may change again. 7. Whether the two detector gaps (autonomy-duration rows and absolute or outcome statements) need a ruling (not needed for a rewrite).

## 17. Next stage
After your ruling: **Stage 10.23A — OG-30 rewrite draft and owner copy review** (config only, no render, no ID). Not begun.
