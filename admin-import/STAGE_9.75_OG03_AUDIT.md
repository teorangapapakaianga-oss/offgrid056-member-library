# Stage 9.75 — OG-03 Budget Pathway Selector: claims-first audit

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Audit only. OG-03 was not migrated, rendered or deployed; no live resource changed.** Live baseline confirmed: 23 / 23 protected · 46 / 46 market files · Bucket C = 0 · 0 broken links · Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb`, rollback `7de9641f-df4c-4cab-8e84-055c0861879d`.
**Sources read in full:** `OG-03_Budget_Pathway_Selector.html` (12 KB) and `.pdf` (4 pages). The PDF and HTML say the same thing (no figure or wording appears in one and not the other; only text-extraction artefacts differ).

## 1 · What OG-03 is (purpose)
A **commercial tier matcher** from the old 30-Day Programme (Week 1, Day 3). The member writes down income, essential expenses, discretionary income, emergency savings and a maximum comfortable spend (Step 1), reads a six-row table that maps income and savings bands to **OffGrid056's own products and prices** (DIY Starter $5–$17, Community Plan $27/mo, Action Plan Plus $47–$97, Professional Review $197–$497, Property Assessment $497–$2,500, Project Support $2,500+) (Step 2), and circles one product tier (Step 3). It closes with "Day 3 Complete … every product recommendation … scales to what you declared" and "Next: OG-04 Property Profile Matrix →".
**Primary output:** a *declared product tier*. So it is mainly **programme / product navigation (a sales-funnel step)** with a small **household budget-capacity kernel** (Step 1 and the "Honesty Rule"). It is **not** an assessment of resilience, not a project allocation, and not a roadmap. Primary output controls classification.

## 2 · Programme position (locked classification, checked against the content)
| | |
|---|---|
| Title (legacy) | Budget Pathway Selector |
| Foundation | **general** (cross-foundation) |
| Programme Component | **planning-implementation** — locked earlier (budgeting ruling: the output is matching a household budget to an action pathway). **Confirmed against the actual content**, with one caution: the *legacy* output (a product tier) is not budgeting; the budgeting kernel (spending capacity and pace) is. The component is correct for the narrowed resource, not for the legacy form as written. |
| Category / Type | `planning` / `worksheet` (proposed; the same category as OG-26, OG-22, OG-02) |
| Role in the member journey | Planning & Implementation, between "what do I want" (OG-22 wishlist) and "what will it cost in tiers" (OG-26). See §9. |

## 3 · Full legacy claim inventory (every item classified)
| # | Legacy item | Class | Note |
|---|---|---|---|
| 1 | Cover chip "Week 1 — Foundation", "OffGrid056 30-Day Programme", "Asset OG-03 \| Day 3" | **REMOVE** | old programme labels (content flags: programme-sequencing ×3) |
| 2 | Footer "OFFGRID056.COM" | **REMOVE** | replaced by the library's own branding |
| 3 | Title "Budget Pathway Selector"; tagline "Match your income … to the right resilience tier. Don't buy what you can't afford. Don't skip what you can." | **REWRITE** | "tier" and "pathway" mean products here; the spirit (don't overspend, don't under-invest) is worth keeping |
| 4 | "The Honesty Rule" paragraph (over-spending creates a new problem; under-investing leaves you exposed; find the sweet spot) | **KEEP** (light edit) | no figures; consistent with the library's tone |
| 5 | Step 1 Financial Snapshot — five member-entered fields (income after tax; essential expenses; discretionary = income − essentials; emergency savings "not retirement funds"; maximum I could spend this month without stress) | **KEEP** | member-entered, no figures; the one part with no equivalent in the library. VERIFY the wording stays neutral (not financial advice) |
| 6 | Step 2 intro "Use your discretionary income and savings to find your starting tier. You can always upgrade later." | **REWRITE** | "upgrade" = buy a higher product |
| 7 | Six-tier table: six OffGrid056 products with prices | **REMOVE** | commercial offers and prices; not carried (§4) |
| 8 | Income bands ("Under $200/mo" … "$3,000+/mo", "High / irregular income") and savings bands ("Under $500 saved" … "$50,000+ available") | **REMOVE** | unsourced owner thresholds that decide advice by income and savings; replaced by member-entered fields |
| 9 | Product descriptions: "community Skool", "group calls", "action plan templates", "workbooks, calculators, supplier sheets, 90-day roadmap", "expert review of one pillar", "full property resilience blueprint across all 5 pillars", "supplier sourcing, contractor coordination, managed implementation" | **REMOVE** | obsolete offers, a third-party platform name (Skool), "pillar(s)" is an old label; the library resources these gesture at already exist (OG-27, OG-25, OG-B12) and can be linked by name |
| 10 | "New Zealand Specific" box: Warmer Kiwi Homes covers 50–90% of insulation costs; EECA average retrofit ~$4,300; effective cost $430–$2,150 | **REMOVE** | NZ-only, unsourced, and **in conflict with what the library already holds**: OG-26 (checked 22 Sept 2026 against official pages) deliberately dropped fixed amounts because the share "depends on your eligibility", notes wood and pellet burners are no longer funded, and has a matching Australian panel. The derived $430–$2,150 stacks two unverified figures. NOT RELIED UPON (see §5) |
| 11 | Step 3 "Declare Your Tier": five product options with prices + "Why this tier fits my situation right now" | **REWRITE** | keep the "declare and write your why" mechanic, drop the products. (The list omits the sixth tier, Project Support — an internal inconsistency in the legacy) |
| 12 | "Day 3 Complete — you now have a realistic budget tier. Every product recommendation, worksheet and action step from here forward scales to fit what you actually declared." | **REMOVE** | promises behaviour the library does not have |
| 13 | "Next: OG-04 Property Profile Matrix →" | **REMOVE** | obsolete code; OG-04 is not migrated (content flag: next-link) |
| 14 | Duplicate material | **NOTE** | "maximum I could spend … without stress" duplicates OG-26's "compare to your available capital"; the tier *names* collide in concept with OG-26's "Tier 1 / 2 / 3" (different meaning) |

## 4 · Price inventory (price detector: 30 detections = 29 PRICE + 1 PLACEHOLDER, 0 not-a-price)
24 distinct amounts, plus 5 cost-column cells and 1 placeholder cell that the detector flags a second time:
- **Six product prices** (tier column): $5–$17, $27/mo, $47–$97, $197–$497, $497–$2,500, $2,500+ → **remove** (commercial offers; not carried; any future pricing system is separate and not approved).
- **Five monthly discretionary bands**: $200, $200–$500, $500–$1,500, $1,500–$3,000, $3,000+, and the placeholder "High / irregular income" → **remove** (replace with member-entered fields).
- **Six savings bands**: $500, $500–$2,000, $2,000–$5,000, $5,000–$15,000, $15,000–$50,000, $50,000 → **remove**.
- **The same five product prices repeated** in the Step 3 choice list → **remove**.
- **NZ subsidy**: $4,300 and $430–$2,150 → **remove** (cannot be a verified current price claim; derived).
No amount is a verified current price claim; none is carried automatically; **no price survives**. No pricing-freshness architecture is proposed.

## 5 · Numeric inventory (numeric detector: 31 candidates, identical in NZ and AU; **26 Bucket C**, 5 Bucket D)
| Kind | Items | Type |
|---|---|---|
| Currency (Bucket C ×24) | the 24 amounts above | **owner-defined commercial/planning mechanics** (tier prices, income and savings thresholds), except `$4,300` and `$430–$2,150`, which are **external factual claims** (EECA average; derived) |
| Percentage (Bucket C ×1) | `50–90%` Warmer Kiwi Homes share | **external factual claim**, NZ only. Not re-read from an official page today (the EECA address I tried returned 404, and I do not rely on guesses or snippets): the figure is **NOT RELIED UPON**; the library's own verified wording (OG-26, 22 Sept 2026) says the share depends on eligibility |
| Interval (Bucket C ×1) | "monthly support" in the Community Plan line | product wording → removed with the product |
| Bucket D ×5 | "30-Day" (programme label), "Monthly" ×3 (field and column labels), "90-day" (a product feature) | not claims; the first and last are removed with the labels/products |
Durations / timelines / dates / quantities: only "Day 3", "Week 1", "this month", "/mo" and "90-day roadmap"; no dates; no physical quantities; no durations of supply. No broad exemption is requested; after the removals **nothing numeric remains** to register. (The one arithmetic relation, discretionary = income − essentials, is member-entered mechanics, not a claim.)

## 6 · Overlap check (concept only; nothing merged or deleted)
| Resource | Relationship |
|---|---|
| **OG-26 3-Tier Budget Planner** (live) | **Closest.** Its tiers are *scope-of-resilience budgets* (Sleep Safe / Live Well / Full Autonomy) with member-entered costs, a "how to budget" method and market-correct assistance panels (NZ and AU). It has **no** household-finance snapshot: it only says "compare to your available capital". OG-03's *product* tiers duplicate nothing in it; OG-03's *snapshot* fills a gap in front of it. |
| **OG-B04 Monthly Planning Challenge** (live) | Different job (a monthly cadence: learn, assess, plan, act); only a one-line "set budget" step in common. No overlap in output. |
| **OG-27 90-Day Implementation Roadmap** (live) | Different job (phased actions with deadlines). OG-03 would sit *before* it as an input ("how much, how fast"). |
| **OG-B10 90-Day Roadmap (Advanced)** (live) | Different job (programme overview, budget burn-down, dependencies). Its "Total Budget Allocated" and "Starting Budget" boxes are exactly the number OG-03's capacity check would produce. |
**Finding:** as written, OG-03 fills **no unique role in a member library** (its tiers are a sales funnel the member is already inside). Its **narrowed kernel** — "what can my household comfortably commit, in money and in pace" — **is unique and sits naturally before OG-26**. So: *narrow it*, do not merge it into OG-26 now (that would change a live resource), and do not simply delete a gap the library has.

## 7 · OffGrid056 alignment
**As written: weak.** Apart from the word "resilience", it reads as a financial worksheet whose destination is buying OffGrid056 products; nothing ties the spend to resilience, independence or the five foundations. **The narrowed form must earn its place** by tying the decision to the member's own plan: which of their three priority foundations (OG-01) and which MUST items (OG-22) the spend is for, and how fast they can responsibly go. Proposed alignment answers (OWNER-REVIEW REQUIRED, written for the narrowed form): foundation = general (it spans all five); component = planning-implementation (its output is a spending capacity and a starting pace — a budgeting/allocation step); resilience role = helps a household decide how much, and how fast, it can responsibly spend on resilience so that it neither overspends nor stalls; kind of guidance = implementation planning (household budgeting) — not emergency guidance, not system design; wording matches role = yes **only after** the tiers, prices, thresholds and subsidy box are removed.

## 8 · Five Foundations ruling
**general / cross-foundation.** It is not about air, water, shelter, food or energy specifically; it prices whichever the household chooses. Do not force a foundation.

## 9 · Member journey
- **Component:** Planning & Implementation. **Not** Start Here (OG-01 is), **not** Resilience Planning (it assesses nothing), **not** Resilience & Emergency, **not** Off-Grid Living, **not** Advanced / Future.
- **Before it:** OG-01 Home Resilience Scorecard (priorities) → OG-02 Household Risk Identifier → OG-22 Resilience Product Wishlist (what the household wants, MUST first).
- **After it:** OG-26 3-Tier Budget Planner (cost it by scope, with assistance) → OG-27 90-Day Implementation Roadmap → OG-25 Project Support Brief (when quotes are needed) → OG-B10 (advanced tracking).
- Proposed related resources (OWNER-REVIEW REQUIRED): OG-26, OG-22, OG-27, OG-01.

## 10 · NZ / AU differences
- **Currency:** every "$" is unlabelled; NZD and AUD differ, and the legacy thresholds are not market-specific. The narrowed resource carries **no amount at all**, so no currency wording is needed (a member-entered field may simply say "$").
- **NZ-only material:** the Warmer Kiwi Homes / EECA box (a grant/finance claim) — flagged, **removed**. There is no Australian counterpart in the document, and none should be invented. Where assistance matters, the member is pointed to **OG-26's market-correct assistance panels** (NZ: EECA, council, Rural Support Trust; AU: energy.gov.au, state and territory government, council).
- **Tax / finance / grants:** "income after tax", "emergency savings (not retirement funds)" are generic; the narrowed form should not name KiwiSaver, superannuation or any regulated product, and stays general education, not financial advice (the standing disclaimer covers it).
- Market files expected: NZ and AU, with identical body text; only the standing blocks differ.

## 11 · Safety findings
Safety-topic detection on the extracted HTML and PDF text and on the member-facing HTML: **no topic** (electrical, fire/smoke/CO, gas, water treatment, food safety, heating, generators: none). Fuel/gas teaching signals: none. The only incidental hits (food, power, storage, insulation) are **budget categories and the subsidy sentence**, not teaching. **No safety block is required**; none should be added for incidental words. The standing blocks apply as for every resource: `general-disclaimer` and `emergency-contact`. No exemption needed.

## 12 · Proposed metadata (every inferred field: OWNER-REVIEW REQUIRED)
| Field | Proposal | Basis |
|---|---|---|
| Title | **Household Spending Capacity Check** (alternative: "Resilience Spending Capacity Worksheet") | OWNER-REVIEW REQUIRED — inferred; "Budget Pathway Selector" implies product pathways |
| Foundation | general | locked reasoning §8 |
| Programme Component | planning-implementation | locked earlier; confirmed for the narrowed form |
| Category | planning | OWNER-REVIEW REQUIRED — existing general category (as OG-26, OG-22) |
| Type | worksheet | OWNER-REVIEW REQUIRED — inferred (member-entered snapshot and declaration; no calculator) |
| Difficulty | beginner | OWNER-REVIEW REQUIRED — inferred: five typed fields and one subtraction |
| Estimated time | 15 minutes | OWNER-REVIEW REQUIRED — INFERRED: the legacy states none; about 2 content pages |
| Description | "Work out what your household can comfortably commit to resilience, in money and in pace, before you build a budget. It asks for your own figures and gives no prices." | OWNER-REVIEW REQUIRED — inferred wording |
| Tags | [] | convention across all live resources |
| Status | **draft** | standing rule |
| Collections | none | OWNER-REVIEW REQUIRED |
Safety blocks: `general-disclaimer`, `emergency-contact` only. Related resources: OG-26, OG-22, OG-27, OG-01 (proposed).

## 13 · Recommendation: **NARROW**
Keep a short, member-entered **spending capacity check** (Step 1 snapshot, "Honesty Rule", a declared starting pace and the reason why), tied to OG-01/OG-22 and handing on to OG-26 and OG-27. **Remove** all six product tiers and every price, all income and savings thresholds, the NZ subsidy box, the "Day 3 / Week 1 / 30-Day Programme / Asset OG-03" labels, "pillars", "Skool", the "scales everything" promise and the OG-04 link. Not KEEP (it would put commercial prices and unsourced thresholds into a member library). Not RETIRE as the first choice (it would delete a real gap in front of OG-26), though RETIRE is the clean fallback if you prefer OG-26 to carry the whole budget path. Not MERGE now (that would alter a live resource).

## 14 · Owner decisions required
1. **Disposition:** NARROW (recommended) · RETIRE (fallback) · KEEP as written (not recommended).
2. **Title** (the proposal above or your own).
3. **Confirm removal of every price and all six commercial tiers** (and the third-party "Skool" reference), with the library resources they gesture at referenced only by name if wanted.
4. **Income / savings thresholds:** remove and rely on member-entered fields (recommended), or define a different mechanic.
5. **NZ Warmer Kiwi Homes box:** remove and point to OG-26's assistance panels (recommended); no Australian equivalent to be added.
6. **Metadata:** category `planning`, type `worksheet`, beginner, 15 minutes, collections none.
7. **Journey position:** after OG-22, before OG-26, with the related list OG-26 / OG-22 / OG-27 / OG-01.
8. **Wording of the financial fields:** keep income, expenses, discretionary income, emergency savings and maximum comfortable spend as private member-entered fields, framed as general education and not financial advice.

## 15 · Validation (nothing live changed)
Price scan, numeric scan (NZ and AU), safety scan, content-flag scan and old-label scan run on the legacy source (`workspace/og03-detect.mts`); the audit facts are pinned in `tests/unit/og-03-audit.test.ts` (7 tests, skip-safe without the private working copy). **715 tests passing** (708 + 7) · lint clean · typecheck clean · `import:verify-prep` and `import:verify-build` verified (**23 records · 46 market files · 0 broken links**) · 23 / 23 ready · **Bucket C = 0** (live) · Worker `e63141a1…` unchanged · git status: only the new test and this report.
