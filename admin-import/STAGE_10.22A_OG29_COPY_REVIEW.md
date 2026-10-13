# Stage 10.22A — OG-29 Household Action Plan: rewrite and owner copy review

**Copy rewrite for owner review only.** Not rendered, no cover generated, no resource ID, no protected record, not staged, not deployed. The prep tool prints a suggested internal ID `res-1029` (**SUGGESTED / UNASSIGNED**); it is recorded nowhere. OG-29 stays Not started. Live is unchanged: **32 protected resources · 64 market files · Planning Tools 11 · Downloads 54 · My Progress 57 · 0 broken links** · Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` · rollback `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`. Migration: Deployed 32 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 11 = 45. The draft is held in the review config (`approved-copy.json`, `metadata-review.json`, `program-components.json`; generator `workspace/add-og29-config.mts`) and prepared into the git-ignored review workspace (`workspace/prep/OG-29/`, HTML only, no PDF).

## 1. Owner locks
**Household Action Plan.** Description (exact): "A practical worksheet to help your household turn its main resilience decisions into a clear list of actions, owners and next steps." General / planning-implementation / planning / worksheet; beginner; 20 minutes. Planning Tools: FUTURE YES (live stays 11, expected 12 after a future deployment). Slug (proposed) `household-action-plan`. One identical NZ/AU body. Standing emergency-contact and general-disclaimer blocks only. Ten action rows.

## 2. Section architecture
Cover · What This Plan Is For (with How to Use It) · Our Plan Details · What We Have Decided · Our First Ten Actions · When We Will Review It · Notes · Where Next · Where You Are Now · standing emergency-contact and general-disclaimer blocks (injected).

## 3. Complete proposed member-facing copy
**Cover (text only; no image generated).** General · Planning · OffGrid056 Member Library · **Household Action Plan** · subtitle (my draft, for your approval): "A calm, practical worksheet for turning your household's decisions into clear actions and next steps." · Prepare • Adapt • Thrive.

**What This Plan Is For.** "This worksheet helps your household bring its main decisions together into one clear list of actions. It is based on the choices you have already made, and it helps turn them into practical next steps." "It is not a score or an assessment. Fill in what suits your household, leave blank anything that does not apply, and change your answers whenever your plans change." **How to Use It:** "Write in your own words. Short notes are enough. Work through the sections in order, or go straight to the action list if you already know what comes first."

**Our Plan Details.** Six fields, two writing lines each: Household or family name · What we are mainly working on · What matters most to us right now · What we have already completed · What still needs attention · What we want to do next.

**What We Have Decided.** "Write down the key decisions your household has made so far. Add the reason beside each one, so it is easy to remember why you chose it." Table (six blank rows): Decision · Why we chose it · What this affects · Anything we still need to confirm.

**Our First Ten Actions.** "List the ten actions that matter most to your household. Give each one an owner and a clear next step. Use the last column to record progress or anything to follow up." Table (exactly ten blank rows, numbered 1 to 10): No. · Action · Owner · Next step · Notes or status. No date, cadence or percentage column.

**When We Will Review It.** "Decide together when you want to come back to this plan. There is no set timing, so choose what suits your household." Fields (three lines each): When we want to look at this plan again · What might make us change it · What we want to check next time.

**Notes.** One open field (five lines): Anything else we want to remember.

**Where Next.** "Use these resources alongside your plan. Each one helps with a different part of putting it into action." Before: **90-Day Implementation Roadmap**, "Spread your actions across phases and see how they fit together over time." Next: **Household Responsibility Roster**, "Agree who looks after each area and who can step in as a backup." Also useful: **Priority Lock Worksheet**, "Choose the first priorities that help you decide which actions come first." (Printed: three rows. The later link, 3-Tier Budget Planner, is metadata only and not printed.)

**Where You Are Now.** "You now have a record of the decisions your household has made, a practical list of actions, a named owner for each one and a place to note the next step. Keep this plan somewhere easy to find, and update it when your plans change."

## 4. Structure and fields
- **Ten-action table:** No. (1 to 10, structural) · Action · Owner · Next step · Notes or status.
- **Review fields:** the three above, member-chosen, no fixed timing.
- **Where Next printed order:** Before (res-1027) · Next (res-1028) · Also useful (res-1007). **Related metadata order:** res-1027, res-1028, res-1007, res-1026.

## 5. Removed from the legacy source
The 30-asset programme table in four Week/Day blocks (all legacy titles and key outputs), "Consolidated Week-by-Week Actions", the Plan Effective Date, Selected Resilience Tier, 90-Day Roadmap Start Date and "Total Budget Approved $" fields, the capstone Purpose box, the Top-10 due-date column and "(Next 30 Days)", "Day 29 Complete", "your contract with yourself", "Review it monthly. Update it quarterly.", both "Next:" pointers, OFFGRID056.COM, the old cover path and every OG code. Kept: a decision record and a ten-row owned action list.

## 6. Validation (prepared NZ and AU files; `workspace/og29-draft-qa.mts`: ALL PASS)
**NZ and AU body identical:** **2,455 characters** each (below the 2,500 to 3,500 target; not padded); body HTML **6,444 bytes** each, byte-identical; one market-neutral body, no override. Standing blocks: **emergency-contact and general-disclaimer only**. Technical safety triggers **0** (the legacy `batteries-and-electrical` topic, triggered only by two asset names, is recorded REMOVED). Regulatory candidates **0**, unresolved **0** (the only regulatory-unit candidate is the standing disclaimer block). Numeric **Bucket C 0** (two candidates: the live title "90-Day Implementation Roadmap" and the disclaimer block). Price 0; payback 0; warranty 0; payment 0; multiplier 0; comparative 0; outcome 0; assurance 0; survival 0; supply 0; emergency-period 0; storage 0; target-label 0; legacy-language **0**; content flags **0**. Removed-content hit counts all 0 (OG-29, any OG code, Week, Day, 30-Day, Tomorrow, Next:, OFFGRID056.COM, daily/weekly/monthly/quarterly/annual and "week by week", "29 days", credentials, technical, medical, regulatory words, promises, civil defence). The only digits in the body are the ten structural row numbers. No exemption, no registry entry.

## 7. Related, Planning Tools, cover and governance
- **Automatic fill (real engine, simulated, nothing changed):** with the four curated links the page shows exactly res-1027, res-1028, res-1007, res-1026, all "Linked by us"; no res-0006, res-0008 or res-1510. `lib/related.ts` unchanged.
- **Planning Tools:** future YES, recorded in the draft metadata; not added (live 11, expected 12).
- **Cover direction (recorded, nothing generated):** title-free image; mixed-age household at a kitchen or dining table or a wall-planning setting; blank visual planner and sticky notes; natural daylight; clear upper area for the template title "Household Action Plan"; no readable generated text, OG code, logos, technical tools, uniforms or emergency imagery. The draft still references the legacy stand-in only until a cover is supplied (`coverStatus` PENDING).
- **Governance to apply at staging:** status draft; publicationStatus approved; releaseChannel private-preview; accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED.

## 8. Tests and repo
Focused `tests/unit/og-29-draft.test.ts` (16 tests) passes. Default-timeout full suite **62 files, 1,688 tests, all passed**. Lint 0 errors (55 existing warnings); typecheck 0; `import:verify-prep` 0; `import:verify-build` 0 (32 records · 64 market files · 0 broken links). One existing test was adjusted: the OG-28 test no longer forbids `res-1028` across all config, because OG-29's related links name it; it still forbids it in OG-28's own entry, the copy and the PDFs. Repo changes: three review-config files, `og-29-draft.test.ts`, the adjusted `og-28-draft.test.ts` and this report. Stable ID NO; record NO; render NO; staging NO; deployment NO.

## 9. Owner decisions required before the render stage
1. Approve the copy (and any edits), including the drafted cover subtitle. 2. Confirm the body length is acceptable (2,455 characters, slightly under the target). 3. Confirm the printed Where Next (three rows) and the four-link metadata. 4. Supply the title-free cover image (or approve a named image workflow). 5. Then, as separate approvals: render, stable ID and staging, deployment.

## 10. Next stage
**Stage 10.22B — OG-29 final render and visual QA** after your copy approval and the cover (no ID or deployment unless separately approved). Not started.
