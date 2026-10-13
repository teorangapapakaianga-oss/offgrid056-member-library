# Stage 10.21 — OG-28 legacy resource audit and preparation

**Audit only.** No rewrite, render, stable ID, protected record, staging or deployment. No config, register, record, PDF, route, Planning Tools, Worker, Cloudflare, Supabase, Railway, OS or entitlement item changed. The only new file is this report (and git-ignored scratch evidence under `workspace/`).

LIVE (unchanged): **31 protected resources · 62 market files · Planning Tools 10 · Downloads 53 · My Progress 56 · 0 broken links** · Worker `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`. Migration (unchanged): Deployed 31 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 12 = 45.

## 1. Source (one confident candidate)
The registers, tests and earlier stage reports all name OG-28 "Household Responsibility Roster" (register row `| OG-28 | Household Responsibility Roster | electrical |`). The programme archive holds exactly one pair; no duplicate or alternative candidate exists.
| | |
|---|---|
| HTML | `…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-28_Household_Responsibility_Roster.html` (12,085 bytes, 2 May 2026; working copy `workspace/og-28-legacy.html`) |
| PDF | `…\OffGrid056\PDFs\OG-28_Household_Responsibility_Roster.pdf` (481,474 bytes, 5 pages) |
| Titles | HTML `<title>` and PDF title field: "OG-28 Household Responsibility Roster — OffGrid056"; cover title "OG-28 Household Responsibility Roster"; page-header title "Household Responsibility Roster" |
| Programme context | Chip "Week 4 — Action Plan & Pathway", label "OffGrid056 30-Day Programme", subtitle "Day 28 — Make resilience a team sport", brand "OFFGRID056.COM"; Day 28 of Week 4 |
| Pointers | "Day 28 Complete"; "Next: Tomorrow you will consolidate everything from the past 30 days into a single Master Action Plan"; "Next: OG-29 30-Day Master Action Plan →" |
| Cover asset | legacy Week 4 programme artwork (`/mnt/…/Week4_ActionPlanPathway_Cover.jpg`, alt "Week 4 Cover"); no OG-28 image exists |
| Markets / version | one market-agnostic source (NZ-flavoured only in "civil defence"); no version or date recorded beyond the file date; no private-only or duplicate source |
| Existing metadata | none (no review-config entry, no approved copy beyond the shared "Next: OG-28" removal in other resources, not in `program-components.json` decisions); Stage 9.5 read it as a Template; Stage 9.64B listed it "planning-implementation ? (or emergency)" |

## 2. Source purpose (separate from any recommendation)
Help a household share the work of resilience so it does not depend on one person: seven named roles (Energy & Power Steward, Water & Sanitation Manager, Food & Garden Coordinator, Heating & Shelter Custodian, Communications & Information Officer, Medical & First Aid Lead, Security & Access Controller), each with duties, a frequency and skills; a roster table (role, primary, backup, training status); a weekly "huddle" agenda; and an emergency-override table. **Audience:** a household with several capable members, including children in training roles. **Outcome:** everyone has a role, a backup and a training path. **Output:** a filled-in household roster (member entries) plus a meeting agenda. **Type:** a roster worksheet / template (member-entered), with a reference half of prescriptive role descriptions. It fills a real gap: no live or demo resource covers household roles, backups or a regular check-in (keyword and title search of all 31 protected and 30 demo resources found none; the nearest demo is the Household Contacts Template, a contact list, not a roster).

## 3. Classification
**Foundation: general** (the roles span every foundation; no single foundation is the subject). **Program Component: planning-implementation** (the current rule: allocation, schedule and action-plan output; the emergency override is one section, not the job). Not in `classificationsDecided` yet and Stage 9.64B flagged it "?", so **NEEDS_OWNER_METADATA** confirmation. **Category: planning.** **Resource type: worksheet** (member-entered roster); Stage 9.5 read it as a Template — owner choice.

## 4. Overlap
**UNIQUE.** No protected resource covers the job: Emergency Readiness Checklist (items and where supplies are), Priority Lock Worksheet (priorities), 90-Day Implementation Roadmap (schedule), Monthly Planning Challenge Template (monthly challenge), Professional Support Planner and Supplier Comparison Worksheet (outside help). OG-29 (30-Day Master Action Plan, not started) will consolidate action; no overlap in the roster job. Not superseded.

## 5. Journey fit and related candidates (resolved by ID; none activated)
Cross-cut Planning & Implementation, after the household has priorities and before it schedules the work; also touches Emergency Readiness (backup roles). Candidates: **BEFORE** res-1007 Priority Lock Worksheet (decide what matters most; moderate); **NEXT** res-1027 90-Day Implementation Roadmap (schedule the work; moderate); **ALSO USEFUL** res-1006 Emergency Readiness Checklist (what the household has; moderate); **LATER** res-1504 Monthly Planning Challenge Template (monthly routines; weak, owner may prefer res-1022 or none). res-1510 not used. Four explicit links would invoke the curated-related rule.

## 6. Safety audit
Detected topics (legacy HTML and PDF): **batteries-and-electrical** (solar, battery, inverter, generator fuel, load shedding, "basic electrical safety") and **food-safety-power-cut** (pantry rotation, preserving). Fuel/gas check: no GAS_SAFETY trigger ("wood, gas, pellets" is a fuel-store mention). Role prescriptions also touch plumbing, water testing, greywater diversion, heater servicing, first aid and medication, and perimeter/security checks, none of them taught as procedures. **Unsafe or unsupported instructions:** no step-by-step technical or medical instruction; the risky parts are the technical role definitions ("Service heaters annually", "Manage greywater diversion", "Check medication expiry", "Annual CPR refresher", "first aid certificate") and the system-specific duties. **Market:** none beyond "civil defence" (NZ term). **Recommendation:** a rewrite that names no system or appliance (the OG-24 approach: member-entered areas and roles) would carry only the standing emergency-contact and general-disclaimer blocks and a single identical NZ/AU body. Keeping the technical roles would require the batteries-and-electrical and food-safety blocks and per-market wording.

## 7. Regulatory audit
Hardened detector: **0 candidates** (total regulatory-owned 0, unresolved 0); no licensing, legality, consent, permit or mandatory wording; the credential-style items are labels, not assertions ("Skills required: First aid certificate" and "Annual professional service"; both would be removed in a rewrite). **DETECTOR GAP — OWNER RULING REQUIRED (minor):** a credential requirement written as a label ("Skills required: First aid certificate", "The backup must be trained and capable") is not owned by any family; and an absolute completeness statement ("Everyone knows their role. Nothing is forgotten.", "Every capable person has a role, a backup, and a training path") is not owned by the assurance or outcome families. Neither would survive a neutral rewrite, so no detector change is needed to proceed; recorded for the owner. Not patched.

## 8. Numeric and claim audit (per market, identical)
22 candidates; **Bucket C 7 per market** (all recommended-frequency intervals: "Daily check", "Weekly pantry check", "Service heaters annually", "Weekly fuel check", "Annual professional service", "Weekly equipment test", "Monthly kit check"); the rest are programme labels, member-entry cadences and the "15-minute" huddle (D / B / E). Price 0 (no price figures); survival, supply, emergency-period, storage, target-label, payback, warranty, payment, multiplier, comparative, outcome and assurance families: 0 hits across 114 sentences. Bucket C must be 0 before staging: replace recommended cadences with member-chosen frequency fields.

## 9. Legacy language
Programme sequencing (Week 4, Day 28, "30-Day Programme", "Day 28 Complete", "consolidate everything from the past 30 days"); OG codes (OG-28, OG-29); "Next:" and "Tomorrow" pointers; OFFGRID056.COM and the old cover path/alt; a fixed "Sunday" 15-minute huddle; absolute promises ("Nothing is forgotten", "Everyone knows their role"). Not present: Pillars, survival, prepper, panic, premium, upsell, Skool, Simply Services, HTPS. Content-flag scan: day-complete, next-link ×3, programme-sequencing ×4, cross-reference OG-29.

## 10. Market, collection and governance
- **Body:** one identical market-neutral NZ/AU body is achievable after rewrite (neutral "official alerts" for "civil defence warnings"; "your local medical service"); no NZ or AU override needed.
- **Collection:** **OWNER DECISION REQUIRED** — Planning Tools is plausible (a reusable household planning worksheet); not Start Here. Not added.
- **Governance to prepare if migrated:** status draft; publicationStatus approved; releaseChannel private-preview; accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED. No record written.

## 11. Disposition
**B — REWRITE BEFORE MIGRATION.** The job is unique and useful, but the source cannot migrate as-is: heavy programme framing, seven unsourced recommended cadences (Bucket C 7), system-specific technical and medical role prescriptions that would trigger the electrical and food-safety blocks and per-market wording, a credential requirement and absolute promises. A neutral, member-entered rewrite keeps the unique value (roster, backups, regular check-in, "if someone is unavailable" order) and removes the claim, safety and market burden. A merge into another resource is not supported (no existing resource owns this job).

## 12. Proposal (for owner review; nothing created)
| | |
|---|---|
| Title | **Household Responsibility Roster** (clear, current; "OG-28" and "Day 28" removed; alternative "Household Roles Planner" if you prefer) |
| Description | "A practical worksheet to help your household agree who looks after what, record a backup for each area and choose a regular time to check in." |
| Classification | general / planning-implementation (NEEDS_OWNER_METADATA) / planning / worksheet (owner choice vs template); difficulty beginner and about 20 minutes are INFERRED (the source states neither; its huddle is 15 minutes) |
| Collection | planning-tools (OWNER DECISION) |
| Slug | `household-responsibility-roster` (unused by any protected or demo resource) |
| Section architecture | What this roster is for · Our household (names and notes) · Areas we look after (member-chosen or ticked areas such as water, food, energy, shelter and warmth, communication, health and home security, with no duties, skills or system names) · Our roster (area, primary, backup, what we want to practise) · Our regular check-in (member-entered day, time, what we will look at, top tasks) · If someone is unavailable (member-entered backup order) · Notes · Where Next · Where You Are Now · standing emergency-contact and general-disclaimer blocks |
| Cover concept | a household gathered round a kitchen table sorting tasks on a paper chart or with sticky notes, calm, natural light, mixed ages, no identifiable faces or logos, no uniforms, no tools, no fear imagery, no robots, no neon, no OG code |
| Stable ID | **not assigned**; protected record **not created**; staging **not performed** |

## 13. Owner decisions required
1. Approve disposition B (rewrite) or choose another. 2. Confirm Program Component planning-implementation (or emergency) and the type (worksheet or template). 3. Title and description. 4. Whether to drop the named system, appliance and medical roles (recommended) or keep them with the technical blocks. 5. Planning Tools: yes or no. 6. The four related links (res-1007, res-1027, res-1006, and a fourth). 7. Whether the minor detector gap (credential labels and absolute completeness statements) needs a ruling.

## 14. Validation
No application code, config or test changed. `npm run lint` **0**; `npx tsc --noEmit` **0**; full `npx vitest run` at the **default timeout: all 1,656 tests passed (60 files)**; `import:verify-prep` **0**; `import:verify-build` **0** (31 records · 62 market files · 0 broken internal links). Live counts and the Worker are unchanged; nothing deployed.

## 15. Next stage
After your ruling: B → owner copy-review (rewrite draft) stage first; then render, staging and deployment as separate approved stages. OG-28 stays Not started until then. Not begun.
