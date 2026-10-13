# Stage 10.22A — OG-29 Household Action Plan: rewrite draft and owner copy review

> **Corrected by Stage 10.22A-CORRECTION** (STAGE_10.22A_CORRECTION_OG29_COPY_ALIGNMENT.md): the action table is now exactly five columns (Action, Why it matters, Owner, Target date, Status / Notes) with no number column, the cover subtitle is the owner-accepted one (...clear actions and next steps.), and the body is 2,357 characters / 7,611 bytes. Where the two reports differ, the correction report is current.


**Copy/draft only.** Not rendered, no cover generated, no stable ID, no protected record, not staged, not deployed. The prep tool prints a suggested internal ID `res-1029` (**SUGGESTED / UNASSIGNED**); it is recorded nowhere. OG-29 stays Not started. This report supersedes the earlier Stage 10.22A draft report (`STAGE_10.22A_OG29_COPY_REVIEW.md`, removed): the description, the action columns, the decision and closing sections and the related set were re-issued by the owner and the draft was revised to match.

LIVE (unchanged): **32 protected resources · 64 market files · Planning Tools 11 · Downloads 54 · My Progress 57 · 0 broken links** · Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` · rollback `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`. Migration (unchanged): Deployed 32 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 11 = 45. The draft lives only in the review config (`approved-copy.json`, `metadata-review.json`, `program-components.json`; generator `workspace/add-og29-config.mts`) and in git-ignored prep HTML (`workspace/prep/OG-29/`, no PDF).

## 1. Final proposed metadata
Title **Household Action Plan** · description (exact): "A practical worksheet to bring your household decisions together, turn them into a clear list of priority actions and record who will take each action forward." · foundation general · program component planning-implementation · category planning · type worksheet · difficulty beginner · 20 minutes · status draft (publicationStatus approved, releaseChannel private-preview and the OS and entitlement placeholders to be applied only at a future staging stage) · collections planning-tools (FUTURE YES, not added; live 11, expected 12 after a future deployment) · proposed slug `household-action-plan` · tags none · one market-neutral body.

## 2. Complete proposed member-facing copy
**Cover (text only; no image generated).** General · Planning · OffGrid056 Member Library · **Household Action Plan** · subtitle (drafted, for your approval): "A calm, practical worksheet for turning your household's decisions into clear actions and owners." · Prepare • Adapt • Thrive.

**What This Plan Is For.** "This worksheet helps your household bring the decisions it has already made into one place, and turn them into a short list of next actions. You do not need to have finished anything in particular before you start." "It is not a score or an assessment. Fill in what suits your household, leave blank anything that does not apply, and change your answers whenever your plans change." **How to Use It:** "Start with what you have decided, then choose the actions that follow from those decisions. Short notes are enough."

**Our Plan Details.** Six fields, two writing lines each: Household or property · Date · Our main goal · Our main priority · What we want to improve · Who is involved. (No money field.)

**What We Have Decided.** "Record the important decisions your household has already made. Add the reason beside each one, so it is easy to remember why you chose it." Four open prompts, four lines each: What have we decided to do? · Why is this important to us? · What still needs clarification? · What are we deliberately not doing yet?

**Our First Ten Actions.** "Choose the ten actions that follow from your decisions. For each one, say why it matters, who will take it forward and a target date if you have one." Table, exactly ten blank rows numbered 1 to 10: No. · Action · Why it matters · Owner · Target date · Status or notes. No score, rank, percentage, programme-day, cost or fixed completion-period column.

**When We Will Review It.** "You might choose to look at this plan again when your priorities change, when an action is completed or when new information affects the plan. The timing is up to your household." Field (three lines): We will review this plan when:

**Notes.** One open field (nine lines): Notes:

**Where Next.** "Use these resources alongside your plan. Each one helps with a different part of putting it into action." Four printed rows: Before: **90-Day Implementation Roadmap**, "Spread your actions across phases and see how they fit together over time." · Next: **Household Responsibility Roster**, "Agree who looks after each area and who can step in as a backup." · Also useful: **3-Tier Budget Planner**, "Think through spending options and choose a budget position that suits your household." · Also useful: **Priority Lock Worksheet**, "Choose the first priorities that help you decide which actions come first."

**Where You Are Now.** Four neutral prompts, two lines each: Our main priority now is: · The first action we will take is: · The person responsible is: · The next thing we need to clarify is:

**Standing blocks (injected):** emergency-contact and general-disclaimer.

## 3. Five alignment answers (recorded in the review config)
1. **Member problem:** it helps a household consolidate decisions and convert them into clear owned actions. 2. **Standalone because:** it is the household's consolidated action record, while the 90-Day Implementation Roadmap handles time-phased implementation and the Household Responsibility Roster handles ongoing roles. 3. **Foundation general:** the actions can span multiple OffGrid056 foundations rather than belonging to one technical foundation. 4. **Planning-implementation:** its main output is an actionable household implementation plan with ownership and target dates. 5. **Must not become:** a programme index, technical guide, professional or legal compliance guide, budget planner, supplier-ranking worksheet, or a duplicate of the 90-Day Implementation Roadmap.

## 4. Related-resource mapping
Metadata and printed order: **BEFORE res-1027** 90-Day Implementation Roadmap · **NEXT res-1028** Household Responsibility Roster · **ALSO USEFUL res-1026** 3-Tier Budget Planner · **ALSO USEFUL res-1007** Priority Lock Worksheet. Not used: res-1504, the demo placeholders, automatic filler. **Engine check (real engine, simulated, nothing changed):** with the four links the page shows exactly res-1027, res-1028, res-1026, res-1007, all "Linked by us", in that order; no res-1504, res-0006, res-0008 or res-1510. `lib/related.ts` unchanged. This draft prints all four rows (the owner's list has no later item); the earlier three-row-plus-metadata idea no longer applies.

## 5. Validation (prepared NZ and AU files; `workspace/og29-draft-qa.mts`: ALL PASS)
**NZ and AU body identical: 2,379 characters each** (slightly under the 2,500 to 3,500 target; not padded); body HTML **7,725 bytes** each, byte-identical; one market-neutral body, no override. **Standing blocks: emergency-contact and general-disclaimer only; technical safety triggers 0** (the legacy `batteries-and-electrical` topic, which fired only on two asset titles in the removed table, is recorded REMOVED). **Regulatory candidates 0, unresolved 0** (the only regulatory-unit candidate is the standing disclaimer block). **Numeric Bucket C 0** (two candidates: the live title "90-Day Implementation Roadmap" and the disclaimer block). Price 0; payback 0; warranty 0; payment 0; multiplier 0; comparative 0; outcome 0; assurance 0; survival 0; supply-duration 0; emergency-period 0; storage 0; target-label 0; legacy-language **0**; content flags **0**. No exemption, no registry change, no detector change. The only digits in the body are the ten structural row numbers (and the "3" in the live title 3-Tier Budget Planner, treated as a title like the 90-Day roadmap).

## 6. Legacy-removal search (member-facing body, NZ and AU, actual counts)
OG-29 0 · 30-Day Programme 0 · Day 29 0 · Day 29 Complete 0 · Week 0 · Tomorrow 0 · Next: OG-30 0 · "Next:" 0 (the "Where Next" heading is not a hit) · OFFGRID056.COM 0 · $33,000 0 · 50V 0 · past 29 days 0 · Review it monthly 0 · Update it quarterly 0 · Work it week by week 0 · OG-05 0 · OG-16 0 · OG-30 0 · any OG code 0 · "30-day" 0. No monthly, weekly, quarterly, daily or annual wording. The prepared HTML still references the legacy Week 4 cover stand-in as a non-visible image source until a cover is supplied; it is not member-facing copy and is replaced before any render.

## 7. Safety, regulatory and numeric rules
No legal conclusion, licensing, permit, consent or compliance wording; no named system or appliance; no price, percentage, payback, warranty, payment, ratio or duration; no optional budget field (budgeting stays with the 3-Tier Budget Planner). No detector fired, so no stop condition arose.

## 8. Cover concept (text only; nothing generated)
A mixed-age household around a simple blank household planning board or table with notes and documents, calm natural light, a clear upper area for the template title "Household Action Plan". Avoid: readable writing in the image, logos, regulated uniforms, certification badges, installation work, unsafe tools, military or prepper visuals, robot imagery, OG codes and programme labels. A title-free image (the template title is added at render).

## 9. Tests and checks (actual exit codes)
Focused `tests/unit/og-29-draft.test.ts`: **17 tests passed**. Full default-timeout suite: **62 files, 1,689 tests, exit 0**. Lint: **exit 0** (0 errors, 56 existing warnings). Typecheck (`tsc --noEmit`): **exit 0**. `import:verify-prep`: **exit 0**. `import:verify-build`: **exit 0** (32 records · 64 market files · 0 broken internal links).

## 10. Files changed
`admin-import/config/approved-copy.json`, `admin-import/config/metadata-review.json`, `admin-import/config/program-components.json` (unchanged in this revision), `tests/unit/og-29-draft.test.ts`, this report (the earlier report file was removed). Git-ignored: `workspace/add-og29-config.mts`, `workspace/og29-draft-qa.mts` and `.txt`, `workspace/og-29-legacy.html`, `workspace/prep/OG-29/`.

## 11. Confirmations
No stable ID assigned · no PDF rendered · no protected record created · no Planning Tools membership added · no staging · no deployment · Worker unchanged (`dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`) · live counts unchanged (32 / 64 / 11 / 54 / 57, 0 broken links) · Cloudflare Worker state and Access, route policy, Start Here, programme routes, the related-resource engine and the claim registry untouched.

## 12. Owner decisions still required
1. Approve the copy, including the drafted cover subtitle and the Where Next wording. 2. Accept the body length (2,379 characters). 3. Supply the title-free cover image, or approve a named image workflow. 4. Then, as separate approvals: render, stable ID and staging, deployment.

## 13. Readiness for the next separate stage
**Ready for Stage 10.22B — OG-29 final render and visual QA**, once you approve the copy and supply or approve the cover (no ID, staging or deployment unless separately approved). Not started.

> **Superseded in part (2026-10-14):** the owner ruled the final cover subtitle is "...clear actions and owners." (not "...next steps."). Where this report says otherwise, the Stage 10.22B-CORRECTION report (section 14) is current.

