# Stage 10.16 — next legacy resource verification and OG-24 claims-first audit

**Audit only.** Nothing was rewritten, rendered, assigned an ID, staged or deployed. The three registers, protected records, PDFs, `route-policy.json`, Start Here, Planning Tools, programme routes, the related-resource rules, the claim registry, detectors, the Worker and Access are untouched.

LIVE: **30 protected resources · 60 market files · 0 broken links** · Worker `7bccd708-70a8-479f-90c8-b6f7239e1c91` · rollback `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · Bucket C 0 · 1,523 tests. Migration (unchanged): Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 13 = 45.

## 1. Not Started (verified)
OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15 (13). The three registers agree; no priority rule exists, so the earliest code applies: **OG-24**. Register row: `| OG-24 | Professional Review Selector | — |` (General, planning and programme).

## 2. Source
HTML `…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-24_Professional_Review_Selector.html` (12,651 bytes; copy `workspace/og-24-legacy.html`); PDF `…\OffGrid056\PDFs\OG-24_Professional_Review_Selector.pdf` (5 pages, 507,823 bytes). HTML `<title>` and PDF title: "OG-24 Professional Review Selector — OffGrid056". Cover title "OG-24 Professional Review Selector" (chip "Week 4 — Action Plan & Pathway", "OffGrid056 30-Day Programme", subtitle "Day 24 — Know when DIY ends and expert help begins", "OFFGRID056.COM", build-path image `Week4_ActionPlanPathway_Cover.jpg`). Page header "Professional Review Selector" / "Day 24 — Week 4 … 30-Day Programme". Pointers: "Next: Tomorrow you will create a formal Project Support Brief…" and "Next: OG-25 Project Support Brief Template →". Programme role: Day 24 of Week 4; programme day 24 is the demo placeholder `res-0024` (Seasonal Growing Planner, food).

## 3. Purpose and output
Help the member decide which projects need licensed professionals, learn who the professionals are and how to verify them, list the professionals they expect to engage, and prepare what to give them. Outcome: know when DIY ends and expert help begins. Output: a **planner** (the "My Professional Team Selector" table plus briefing checklist); the rest is a reference guide. Classification: **planner**, with a guide/reference half that is claim-heavy.

## 4. Inventory
| # | Section | Mark |
|---|---|---|
| 1 | Cover (Week 4, 30-Day Programme, Day 24, OG-24, OFFGRID056.COM, old image) | REWRITE (shared cover, remove all) |
| 2 | Page header (Day 24 … 30-Day Programme) | REMOVE |
| 3 | Purpose ("not always legal, safe, or efficient") | REWRITE (legal assertion) |
| 4 | DIY vs Professional Matrix: ten rows with "DIY Safe? / Licensed Required? / When to Hire" ("Always. Illegal and dangerous otherwise", "Fire and electrocution risk", "Backflow and contamination risk", "LBP builder", "refrigeration engineer", "solid fuel installer", "drainlayer", "Pro install may qualify for subsidy", ">120V DC") | **REMOVE** (regulatory, safety-teaching, qualification and NZ-specific claims throughout) |
| 5 | Key Professional Roles in NZ, six roles (LBP builder, registered electrician, certifying plumber/gasfitter/drainlayer, energy auditor, architect, environmental consultant) each with "What they do / When you need one / How to verify" (NZ registers: lbp.website, EWRB, PGDB, EECA, NZRAB/ADNZ; "$33,000 (Consumer Guarantees Act threshold)"; "50V AC / 120V DC") | **REMOVE** claims and register names; **REWRITE** as market-neutral role names with member questions ("what licence or registration applies where I live, and how do I check it?") |
| 6 | My Professional Team Selector (six rows: role, project, engage by, "Est. Fee ($NZD)", shortlist names) | KEEP_AS_MEMBER_INPUT (drop "$NZD"; fee column becomes a member note or is dropped) |
| 7 | Professional Briefing Checklist (audit results OG-01, wishlist OG-22, site plan, drawings, budget range "never reveal your maximum", timeline, decision criteria, OG-23 questions) | REWRITE (OG codes → titles; "never reveal" is advice to verify/remove); largely duplicates the live Project Support Brief Template |
| 8 | Closing box ("You now know exactly which projects require licensed professionals…", Tomorrow, Next: OG-25) | REWRITE (assurance); REMOVE pointers |

## 5–6. Foundation and Program Component
**Foundation: general** (cross-cutting, no single foundation is its subject). **Program Component: planning-implementation** (supplier/installer and professional planning is named in the locked definition); verified from the source: the job is engagement planning, not risk assessment.

## 7. OG-23 overlap
OG-23 (live) prepares questions for suppliers and installers and records answers side by side. OG-24 decides **who** to engage and when, which is a different question, so there is a logical sequence OG-23 → OG-24 only if OG-24 stays a member-input planner. Duplicated: "verify credentials/ask for references" themes and the pointer to OG-23's questions. Unique value: the team list (role, project, timing, shortlist). Everything else in OG-24 (matrix, role guide) is claim content that OG-23 deliberately avoided. Not worth a standalone guide; a narrowed planner could stand, or fold into OG-25 as a section.

## 8. OG-25 overlap
Live OG-25 (Project Support Brief Template, 6 pages) is the project brief: overview, context, scope, commercial terms, attachments, evaluation criteria. OG-24's briefing checklist (site plan, drawings, budget range, timeline, decision criteria) is a subset of OG-25 Parts A–F: **fully duplicated**. OG-24 bridges OG-23 → OG-25 only through the team list; the journey "compare suppliers (23) → decide which professionals (24) → brief them (25)" is useful, but without the checklist OG-24 is thin. Note: live OG-25 itself still carries stale legacy wording ("Days of autonomy desired", "Required Start Date", "Penalties") and was not part of this audit; recorded for the owner.

## 9. Journey position
Companion between OG-23 and OG-25: …OG-22 → OG-23 → **OG-24** → OG-25, alongside the main line OG-03 → OG-07 → OG-26 → OG-27. Documentation only.

## 10. Demo and programme
Programme day 24 = demo `res-0024` Seasonal Growing Planner (food placeholder, no relation). No demo counterpart on topic; no route collision (a slug such as `professional-review-selector` or a renamed title is unused); `route-policy.json` `supersedes` is empty and needs no entry; no placeholder or same-topic collision (closest demo titles: Home Weatherproofing Guide, Property Resilience Assessment, neither a counterpart).

## 11. Professional / tradesperson claims
Every credential statement is NZ-specific or regulatory: "Licensed Required? Yes — electrician / plumber / LBP builder / refrigeration engineer / solid fuel installer / drainlayer" (REGULATORY), "Always. Illegal and dangerous otherwise" (REGULATORY, REMOVE), "Always licensed" (REGULATORY), "Building consent and certified flue work required" (REGULATORY), "Refrigerant handling requires certified technician" (REGULATORY/NEEDS_SOURCE), "valid licence and category match required" (MARKET_SPECIFIC), "Public health and environmental regulations apply" (REGULATORY), "Any project over $33,000 (Consumer Guarantees Act threshold)" (NEEDS_SOURCE/MARKET_SPECIFIC; AU differs), "work over 50V AC / 120V DC" (NEEDS_SOURCE, technical), "Pro install may qualify for subsidy" (NEEDS_SOURCE), registers and boards: LBP, EWRB, PGDB, EECA, NZRAB, ADNZ (MARKET_SPECIFIC, NZ only), "food safety certification" (NEEDS_SOURCE). **MEMBER_QUESTION candidates:** "What licence or registration should this person hold where I live, and how can I check it?", "Are they insured?", "Can they show recent similar work?". SAFE_GENERAL: "Resilience projects can span plumbing, electrical, structural and consent work".

## 12. Market (NZ/AU)
Entirely NZ: "Key Professional Roles in NZ", LBP, EWRB, PGDB, EECA, NZRAB/ADNZ, "$NZD", Consumer Guarantees Act, "building consent", "Gasfitter", "Drainlayer". No AU equivalents are given; AU analogues would differ by state (licensing is state-based). Recommendation: **market-neutral member questions only**; no sourced difference is essential to the member job.

## 13. Safety
OG-24 teaches **no** technical safety procedure; it states reasons to hire a professional. The detector nonetheless maps its words to `solid-fuel-heating`, `gas-and-lpg`, `gas-installation-and-servicing` and `batteries-and-electrical` (and fuel check `GAS_SAFETY_REQUIRED: "gas appliance"`). That is a naming effect: a rewrite that names no appliance or system and only asks the member to confirm the right qualification would carry the **standing blocks only** (emergency-contact, general-disclaimer). Naming wood burners, gas appliances, batteries or solar in the rewrite would re-trigger the technical blocks, which would be wrong for a planner. Owner ruling: avoid naming those systems (recommended) or accept the blocks.

## 14. Price / payment
Price scan: 1 finding, `$33,000`. Money words: budget, price. "Est. Fee ($NZD)" column (professional fees; member input, no figure). "Budget range (never reveal your maximum — state a range)" is negotiation advice, no figure. Payback 0, warranty 0, payment norm 0 (the detectors find no deposit, retainer, staged-payment or hourly-rate statements). "Decision criteria (price, speed, warranty, ongoing support)" is a member-input list.

## 15. Regulatory
**The hardened regulatory detector found 0 assertions in OG-24**, although the source is full of them (see §11). Probed directly: "Illegal and dangerous otherwise", "Always licensed", "Building consent and certified flue work required", "Refrigerant handling requires certified technician", "valid licence and category match required", "Public health and environmental regulations apply", "Consumer Guarantees Act threshold" all return 0 (only "Mandatory in NZ" and "required by law" forms fire). No claim is registered at audit stage.

## 16. Numeric/claims (legacy, per market)
Candidates: **6 per market, Bucket C 4**: `>120V DC`, `$33,000`, `50V AC`, `120V DC` (plus two "30-Day" non-claims). Duplicate-owner count: **0**. Survival, supply, emergency-period, storage-duration, target-label (forward/reverse), payback, warranty, payment, multiplier, comparative, outcome and assurance: **0** hits (81 sentences scanned). **Live library after Stage 10.15: 30 resources / 60 files, 450 candidates, Bucket C 0**; unresolved payback/warranty/payment/regulatory 0.

## 17. Legacy language
OG-24 ×1 (in the title/cover), OG-25 ×1, OG-23 ×1, OG-01 and OG-22 (in the checklist); Week ×2 ("Week 4 — Action Plan & Pathway"); Day ×3 ("Day 24"); 30-Day Programme ×2; "Tomorrow" ×2 and "Next:" ×2; OFFGRID056.COM ×1; `/mnt/…Week4_ActionPlanPathway_Cover.jpg` and alt "Week 4 Cover"; "Day 24 Complete". Pillars, survival, prepper, panic, premium, upsell, Skool, Simply Services, HTPS: 0.

## 18. Related candidates (no order)
res-1023 Supplier Comparison Worksheet; res-1025 Project Support Brief Template; res-1022 Resilience Product Wishlist; res-1026 3-Tier Budget Planner; res-1027 90-Day Implementation Roadmap. Not recommended: any system-specific resource (the rewrite names none).

## 19. Planning Tools
**OWNER-REVIEW.** Only a narrowed member-input planner would qualify (reusable list of who to engage); live Planning Tools is 9. A standalone guide would be NO.

## 20. Proposed metadata (if narrowed)
Title **Professional Help Planner** (OWNER-REVIEW REQUIRED); Foundation general; Program Component planning-implementation; Category planning; Type planner (or worksheet, OWNER-REVIEW); Difficulty beginner; Time 20 min; Status draft; Collections none or planning-tools (OWNER-REVIEW); Tags none; Description (draft): "A practical planner to list the professionals your project may need, when you will engage them and who is on your shortlist, with questions to ask each one before you commit." No res-ID.

## 21. Disposition
**NARROW.** Keep only the member-input team planner and a short set of market-neutral questions about qualifications; remove the DIY-vs-professional matrix, the NZ role/register guide, the $33,000 and voltage thresholds, all subsidy and compliance claims, and the duplicated briefing checklist (point to the Project Support Brief Template instead). Reasons: unique value is small (team list); overlap with OG-23 is moderate, with OG-25 high; claim burden very high (4 Bucket C plus ~15 undetected regulatory/credential statements); market burden total (NZ-only); safety burden low once no system is named; rewrite burden high; journey value modest (bridge 23 → 25). **Fallback: MERGE_CONCEPTUALLY into OG-25** (a "professionals you will engage" section; no standalone resource).

## 22. Detector gaps
**DETECTOR GAP — OWNER RULING REQUIRED:** the regulatory-assertion detector does not recognise licensing/legality statements: "licensed required", "Always licensed", "Illegal and dangerous otherwise", "consent … required", "certified … required", "valid licence … required", "regulations apply", plus "Consumer Guarantees Act threshold" and credential/register claims. Today these are caught only by the ordinary numeric scan when a figure appears and by the content-flag scan; qualification-requirement statements with no figure pass. Not patched; a rewrite must not rely on the detector for professional-selection wording. Also: the safety-exposure mapping triggers technical blocks purely from named professions/appliances (not a gap in claims but a gap in distinguishing "hire a professional" from teaching).

## 23. Owner decisions required
1. Disposition: NARROW (recommended) / MERGE_CONCEPTUALLY into OG-25 / other. 2. If narrowed: title, type (planner vs worksheet) and description. 3. Whether to name no systems or appliances (standing blocks only) or accept technical blocks. 4. Planning Tools: yes/no. 5. Market-neutral questions only (recommended) vs AU/NZ sourced differences. 6. Whether to harden the regulatory detector for licensing/legality statements before the rewrite (recommended) and whether to revisit the stale live OG-25 wording. 7. Related links and order (later stage).

## 24. Validation
`npm run lint` **0**; `npx tsc --noEmit` **0**; `npx vitest run` **0**: 54 files, **1,523 tests** (registry, claim-detector, numeric, price, target-label, reverse-target, payback, warranty, payment, regulatory, outcome, assurance, content-flag, related-resource, route-policy, route-separation, built-output, register-consistency and planning-tools-collection suites are all inside the run); `npm run import:verify-build` **0** (30 records · 60 market files · 0 broken links). Live Bucket C **0**.
