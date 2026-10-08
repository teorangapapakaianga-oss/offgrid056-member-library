# Stage 10.01 — next legacy resource selection and OG-12 claims-first audit

**Audit only.** Nothing was rewritten, migrated, rendered, staged or deployed. Registers, records, PDFs, `route-policy.json`, Start Here, Planning Tools, Five Foundations, programme routes, the same-topic algorithm, Access and the Worker are untouched.

LIVE: **27 protected resources · 54 market files · 0 broken links** · Worker `8834be25-0110-4355-94a5-93b9943f792d` · rollback `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` · Bucket C 0 · 1,106 tests. Migration state (unchanged): Deployed 27 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 16 = 45.

## 1. The 16 Not Started resources (legacy-code order)
Read from `internal/member-programme/RESOURCE_REGISTER.md`, section "Not started (16)", and checked against the other state tables and the 27 protected records: each code appears exactly once in the register and none has a protected record, so **no register conflict**.

| # | Code | Title (register) | Notes |
|---|---|---|---|
| 1 | **OG-12** | FIFO Rotation Tracker | — |
| 2 | OG-14 | Basic Survival Systems Mini-Plan | — |
| 3 | OG-23 | Supplier Question Bank | — |
| 4 | OG-24 | Professional Review Selector | — |
| 5 | OG-28 | Household Responsibility Roster | electrical |
| 6 | OG-29 | 30-Day Master Action Plan | electrical · heavy programme framing |
| 7 | OG-30 | Upgrade Pathway Decision Matrix | electrical |
| 8 | OG-B01 | QuickStart Resilience Checklist | solid fuel · drinking water |
| 9 | OG-B02 | Emergency Contacts Info Sheet | — |
| 10 | OG-B03 | 5 Starter Product Guide | — |
| 11 | OG-B05 | Community Call Prep Sheet | — |
| 12 | OG-B06 | Progress Tracker Wall Chart | — |
| 13 | OG-B11 | Building Consent Navigator | consents research first |
| 14 | OG-B13 | Resilience Insurance Documentation | generators · electrical · drinking water |
| 15 | OG-B14 | Community Resilience Network Builder | — |
| 16 | OG-B15 | Annual Maintenance Calendar | generators · solid fuel · electrical · drinking water |

Not eligible: all 27 deployed, OG-05 (merged), OG-16 (blocked); nothing is staged or prepared.

## 2. Selection
**OG-12 FIFO Rotation Tracker** — register row `| OG-12 | FIFO Rotation Tracker | — |` under "Not started (16)", Food. It is the earliest legacy code among the genuinely Not Started resources (the numeric series sorts before the B series). The register carries no explicit priority rule (the "Immediate queue" in `NEXT_ACTIONS.md` is a labelled Stage 9.61 historical snapshot), so the earliest-code rule applies.

## 3. Source
| | |
|---|---|
| HTML `<title>` | "OG-12 FIFO Rotation Tracker — OffGrid056" |
| Cover title | "FIFO Rotation<br>Tracker" (chip "Week 2 — Water, Food & Air"; label "OffGrid056 30-Day Programme"; brand "OFFGRID056.COM") |
| Cover subtitle | "First In, First Out — the golden rule of food storage. This tracker stops waste, saves money, and keeps your pantry supply fresh and reliable." |
| Page-header title | "FIFO Rotation Tracker"; header right "Asset OG-12 \| Day 12" |
| HTML | `…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-12_FIFO_Rotation_Tracker.html` (copy: `workspace/og-12-legacy.html`) |
| PDF | `…\OffGrid056\PDFs\OG-12_FIFO_Rotation_Tracker.pdf` (4 pages, 501,849 bytes; PDF title field "OG-12 FIFO Rotation Tracker — OffGrid056") |
| Programme context | "Week 2 — Water, Food & Air", "Day 12" |
| Legacy next pointer | "Next: OG-13 Healthy Home Air Audit →" (OG-13 is live) |

## 4. Primary job
Keep a household's stored food in rotation: label, order oldest-to-front, and log items (item, date bought, expiry, location, date used or rotated, notes) with a monthly check. Primary output: **a reusable monthly pantry rotation log** (a tracker/template) with a monthly checklist. The 13-row shelf-life guide is a reference table inside it.

## 5. Content inventory
| # | Section | Content | Class |
|---|---|---|---|
| 1 | Cover | chip "Week 2 — Water, Food & Air", "OffGrid056 30-Day Programme", title, subtitle with "golden rule", "saves money", "fresh and reliable", "OFFGRID056.COM", build-path image | REWRITE (shared cover; remove programme, claims and legacy brand) |
| 2 | Page headers (×2) | "Asset OG-12 \| Day 12" | REMOVE |
| 3 | "The FIFO Principle" box | FIFO explained; "eliminates expired food, reduces waste, and keeps your 30-day supply perpetually fresh without thinking" | REWRITE (outcome claims, 30-day supply) |
| 4 | "The 4-Step FIFO System" | label with purchase date, organise by date, take from the front, restock at the back | REWRITE (overlaps OG-11; keep as a short method) |
| 5 | "Monthly Rotation Tracker" table | 6 columns, 7 blank rows; "Print this page monthly… Pin it inside your pantry cupboard" | KEEP_AS_MEMBER_INPUT (unique value; drop the "monthly" instruction or leave frequency to the member) |
| 6 | "Quick-Reference Shelf Life Guide" | 13 foods with shelf-life figures (2–5 years, 3–5, 2–3, 4–5, 6–12 months, 2 years, 1–2 years, 2–10 years, "Indefinite"), "signs it's gone bad", "rotation priority" | **REMOVE** (unsourced food-safety and shelf-life claims; not carried) |
| 7 | "This Month's Pantry Check" | six tick items; "expiring within 3 months"; "maintain 30-day supply" | REWRITE (keep the ticks, remove "3 months" and "30-day supply") |
| 8 | "Pro Tip: One-In-One-Out Rule" | add one, use one | REWRITE or REMOVE (unsourced rule of thumb; contradicts nothing but is a quantity-style claim) |
| 9 | Closing box | "Day 12 Complete"; "keeps your 30-day supply fresh indefinitely. No more expired cans. No more waste."; "Next: OG-13 Healthy Home Air Audit →" | REWRITE (programme label, claims, next pointer) |

Scan of the requested categories: Week/Day yes; 30-Day Programme yes (1); Pillars none; fear or survival framing none; unsupported numeric claims yes (shelf-life table, "3 months", "30-day supply"); multiplier or comparative none; quantities (one-in-one-out) yes; durations yes; percentages none; ratios none; prices none (one "saves money" savings claim); maintenance intervals ("monthly", "first of every month"); performance claims ("eliminates expired food", "perpetually fresh", "indefinitely", "No more waste"); safety instructions yes (signs of spoilage, "still safe", pests and moisture); market assumptions none; obsolete links the OG-13 pointer; public OG codes OG-12, OG-13; old URLs none ("OFFGRID056.COM", an image build path); promotional wording ("golden rule", "Pro Tip").

## 6. Foundation
**food.** The job is food storage and rotation; no other foundation applies (OG-11 is food).

## 7. Program Component
**resilience-emergency** (recommended; OWNER-REVIEW REQUIRED), matching OG-11 (food / resilience-emergency / pantry-resilience), because the tracker maintains a household's stored food for outages and disruption. `resilience-planning` is the alternative if the owner treats it as everyday kitchen management. `off-grid-living`, `planning-implementation` and `advanced-future` do not fit.

## 8. Journey position
Not part of the main planning journey (OG-01 → … → OG-07 → OG-26 → OG-27). It belongs to the **Food** pathway as the follow-on to OG-11 30-Day Pantry Builder: build the pantry, then keep it in rotation. In the wider bands it sits in Emergency Readiness / Household Resilience, after OG-06 and OG-11. No link was changed.

## 9. Overlap with the live library
| Resource | Overlap |
|---|---|
| **OG-11** 30-Day Pantry Builder (food / resilience-emergency / pantry-resilience, carries food-safety-power-cut) | **High.** Already teaches "first in, first out" rotation, labelling a purchase date on cans with a permanent marker, "The Expiry Date Trap" (use-by versus best-before) and can inspection, and carries the approved food-safety block. |
| OG-06 Emergency Readiness Checklist | Low (one checklist area for food). |
| OG-19, OG-26, OG-27 | Low (OG-26 mentions bottled water use-by; OG-27 mentions labelling stores). |
| OG-08 Water Storage Calculator, OG-B08 | Low (water rotation is separate). |
| All other live resources | None. |
**Unique member value:** a reusable monthly log (item / date bought / expiry / location / used / notes) and a monthly pantry-check list; OG-11 has no ongoing log. **Duplicated:** the FIFO principle, the labelling step and the expiry-date guidance. **Stronger existing resource:** OG-11 owns the rotation teaching. **Standalone:** justified only as a narrow tracker template.

## 10. Demo and programme relationships
- Demo counterpart: `res-0023` **Pantry Rotation Worksheet** (food / food-storage / worksheet, placeholder, no collection) is the same concept. Also related: `res-0022` Food Resilience Guide. No protected counterpart exists.
- Programme day 12 (`day-12.json`) points at demo `res-0012` "Indoor Air Quality Worksheet" (air), which is **not** the FIFO concept; the legacy day numbering does not match the demo programme. No change proposed.
- Workshops and learning paths: no reference to rotation or FIFO.
- Same-topic: food pages (OG-11, res-0022, res-0023) would be the natural neighbours; propagation is by the existing algorithm and cannot be predicted without a build (Stage 9.99 showed a new planning-category resource entering no list).
- Route collision: **none** found for `pantry-rotation-tracker` or `fifo-rotation-tracker` (demo slug `pantry-rotation-worksheet` differs). No supersedes issue is needed; the demo placeholder would simply stay.

## 11. NZ / AU market check (flags only)
The legacy body has no agency, number, building, tenancy or tradesperson content. Items that could differ: food-date terminology and labels (NZ and AU "use-by" / "best before" wording, owned by the existing OG-11 food-safety handling), the shelf-life and spoilage statements (food safety, removed in a rewrite), pest and moisture checks, and donating food. No new source research was done; the food-safety-power-cut block is already approved per market.

## 12. Price scan
Price findings = **0** (PRICE 0, PLACEHOLDER 0). One savings claim in words: "saves money" (cover subtitle). No dollar amount, cost range, payback or affordability claim.

## 13. Numeric and claim scan (per market: 15 candidates, **legacy Bucket C 3**)
Families: survival-duration 0; supply-duration **2** ("maintain 30-day supply", "keeps your 30-day supply fresh indefinitely"); emergency-period 0; multiplier 0; comparative-performance 0; ordinary interval candidates 13.

| Class | Items |
|---|---|
| **A. Factual claims** | 13 shelf-life figures in the table ("2–5 years", "3–5 years", "2–3 years", "4–5 years", "6–12 months", "2 years", "1–2 years", "2–10 years", "Indefinite" ×2); "30-day supply" ×3; "eliminates expired food"; "perpetually fresh"; "keeps … fresh indefinitely"; "saves money"; "No more expired cans. No more waste." |
| B. Structural labels | "Monthly Rotation Tracker"; column and table headings |
| C. Titles | "OffGrid056 30-Day Programme" |
| D. Schedules | "monthly", "first of every month", "Day 12", "Week 2" |
| E. Member-entered fields | the tracker columns; "expiring within 3 months" (a prompt carrying a figure) |
| F. Examples | none |
| G. Non-claims | "Rank", labels |

**Legacy Bucket C (the three C_NEEDS_SOURCE):** "3 months" ("Items I need to use urgently (expiring within 3 months)"), "30-day" ×2 (the two supply sentences). **Live-library Bucket C = 0** (27 resources, 54 files, 435 candidates).

**Detector gaps (reported, nothing changed):**
1. **Bare durations in table cells** ("2–5 years", "4–5 years", "6–12 months", "Indefinite") classify as `D_NOT_A_CLAIM — a duration in passing`. They are real, unsourced food shelf-life claims, so the numeric families miss the most important claim in this resource. A rewrite removes the table, but a rule for shelf-life or storage-life figures in tables would catch a repeat.
2. One supply sentence ("keeps your 30-day supply perpetually fresh without thinking") is not claimed by the supply rule (D, a duration in passing); "eliminates expired food", "perpetually fresh", "indefinitely", "saves money" and "No more waste" have no rule (a general outcome-claim gap beyond the multiplier and comparative families).

## 14. Safety scan
`food-safety-power-cut` is required (shelf life, "signs it's gone bad", "still safe"), in both the HTML and the legacy PDF. All other topics (emergency-contact, fire and smoke alarms, CO, generator, batteries and electrical, the four gas topics, water treatment, roof or structural, heating or combustion): none.

| Hit | Class |
|---|---|
| Shelf-life figures and "signs it's gone bad" per food | GENUINE_TOPIC and **REMOVE_IN_REWRITE** (unsourced; NEEDS_SOURCE if kept) |
| "Honey / Salt / Sugar: indefinite — still safe" | **NEEDS_SOURCE** → REMOVE_IN_REWRITE |
| "Checked for pests / moisture", "Used or donated items near expiry" | INCIDENTAL_MENTION |
| The approved food-safety-power-cut block (NZ and AU, already live with OG-11) | NEEDS_MARKET_BLOCK satisfied only if the rewrite still teaches a food topic; a narrow tracker that removes the shelf-life guide would need no topic block (owner decision) |
No block was added.

## 15. Claim conflicts with approved baselines
- **OG-11:** OG-11 deliberately gives no per-food shelf-life figures ("Some canned foods with a shelf life of more than two years carry no date…") and separates use-by (safety) from best-before (quality); OG-12's single generic "Exp. Date" column and its per-food shelf-life table conflict with that approach. OG-12's "indefinite — still safe" has no equivalent in OG-11.
- **OG-11 and the supply-duration architecture:** "maintain 30-day supply" restates a supply-duration target.
- **OG-13:** the legacy "Next: OG-13" pointer is a programme link, not a journey rule.
- No conflict with OG-06, OG-08, OG-09, OG-15, OG-17, OG-18, OG-19, OG-20, OG-21, OG-B07, OG-B08, OG-B09, OG-B12, the gas or generator architecture or the standing blocks.

## 16. Legacy language (every hit)
"Week 2 — Water, Food & Air" (cover chip); "Day 12" (×2 headers, "Day 12 Complete"); "OffGrid056 30-Day Programme"; "Asset OG-12" (×2); "OG-12" and "OG-13" in the title and pointer; "30-day supply" (×3); "OFFGRID056.COM"; the cover-image build path; "golden rule"; "Pro Tip"; "Next: OG-13 Healthy Home Air Audit →". Not present: Pillars, 72-hour, survival, critical, prepper, panic, worst-case, premium, upsell, Skool, Simply Services, HTPS, legacy URLs. Content flags: `day-complete`, `next-link`, `programme-sequencing` ×3, `cross-reference` (OG-13).

## 17. Proposed metadata (if standalone)
| Field | Proposal |
|---|---|
| Title | **Pantry Rotation Tracker** — OWNER-REVIEW REQUIRED (the demo placeholder is "Pantry Rotation Worksheet"; "FIFO" is jargon) |
| Foundation | food |
| Program Component | resilience-emergency — OWNER-REVIEW REQUIRED (alternative resilience-planning) |
| Category | food-storage ("Storing and rotating food so nothing is wasted") — OWNER-REVIEW REQUIRED (alternative pantry-resilience, as OG-11) |
| Type | template — OWNER-REVIEW REQUIRED (alternative worksheet) |
| Difficulty | beginner |
| Estimated time | 15 minutes — OWNER-REVIEW REQUIRED (the legacy states none) |
| Description (proposal) | "A reusable tracker to help you note what is in your pantry, where it is kept and when each item was bought, so the oldest items are used first." — OWNER-REVIEW REQUIRED |
| Tags | none |
| Status | draft |
| Collections | none |
| ID | not assigned |
No new taxonomy value is used.

## 18. Disposition
**Primary: NARROW.** Keep the one distinctive job — the reusable monthly rotation log and its short monthly check — as a market-neutral template that points to OG-11 for the rotation and expiry guidance. Remove the shelf-life guide, the "30-day supply" and "3 months" figures, the outcome claims ("eliminates", "perpetually fresh", "indefinitely", "saves money", "No more waste"), the Week 2 / Day 12 / Asset labels and the OG-13 pointer.
- *Unique value:* moderate (a log, not teaching). *Overlap:* high with OG-11. *Claim burden:* low once the table and outcome claims go (legacy Bucket C 3 → 0). *Safety burden:* low if no food-safety teaching remains; moderate if any shelf-life or spoilage guidance stays. *Market burden:* low. *Rewrite burden:* low to moderate. *Journey role:* the follow-on to OG-11 in the Food pathway.
**Fallback: MERGE_CONCEPTUALLY** into OG-11 (a rotation log as part of the pantry guidance). Choose it if the owner prefers one food-pantry resource.

## 19. Owner decisions required
1. Confirm OG-12 as the audit target, or choose another Not Started resource.
2. Disposition: NARROW (recommended) or MERGE_CONCEPTUALLY (fallback) or RETIRE.
3. Title (Pantry Rotation Tracker or another).
4. Program Component, category and type (resilience-emergency / food-storage / template are proposed).
5. Whether any shelf-life or spoilage guidance stays (the recommendation is none; a topic block and a source would then be needed).
6. Whether the tracker keeps the monthly framing or leaves the frequency to the member.
7. The tick items for the monthly check, and whether the One-In-One-Out tip is dropped (recommended).
8. Related resources and Where Next (candidates: OG-11 Pantry Builder, OG-06 Emergency Readiness Checklist, OG-08 Water Storage Calculator).
9. Authorise a detector rule for bare shelf-life figures in table cells and for outcome claims such as "eliminates", "indefinitely", "perpetually", "saves money" (recommended; a separate stage).
10. Estimated time and description wording.

## 20. Validation (exit codes)
price scan 0 · numeric, survival, supply, emergency-period, multiplier and comparative scans 0 · market, safety, legacy-language and overlap checks 0 · lint **0** · typecheck **0** · full tests **0** (**1,106** passed, 46 files) · built-output, register, route-separation and numeric-detector suites **0** (296 tests) · `import:verify-build` 0 (records 27 · market files 54 · broken internal links 0) · live-library scan: 435 candidates, **Bucket C 0**.

## 21. Readiness
Ready for an owner ruling. Nothing was changed.
