# Stage 9.87 — OG-05 merge closeout, protected Start Here cleanup, Five Foundations pointer, supply-duration detector

**Date:** 8 October 2026 · **Built and validated in the staged build; NOT DEPLOYED.** Live is unchanged: 25 protected resources · 50 market files · Worker `65437c37-b731-4851-b67e-5b0fae79fe12` (100%) · immediate rollback `89333107-7c0a-4bdb-8229-f2b5241a9e05`. No OG-05 resource, res-ID or PDF was created. Staged resources: none.

## Needs the owner first — register-count discrepancy

The brief expected the 45-resource accounting **Deployed 25 · Staged 0 · Prepared 1 · Blocked 0 · Merged 1 · Not started 18**. The data does not support Prepared 1 and Blocked 0, so I did not force them. Counted from the register's own tables and the protected records (`workspace/count-register.mjs`): **Deployed 25 · Staged 0 · Prepared 0 · Blocked 1 (OG-16, still blocked on grants research) · Merged / No standalone resource 1 (OG-05) · Not started 18 = 45**. Every record is in the Deployed table, no code appears twice, and all 45 legacy codes (OG-01 to OG-30, OG-B01 to OG-B15) are accounted for. I recorded these verified counts and the OG-05 state, and flagged the difference in the three registers. If you meant a resource to be Prepared (and OG-16 unblocked), tell me which and why and I will change it; the counts are one line each.

## Correction to earlier reports — lint

My reports for Stages 9.83 to 9.86 said "lint clean". That was wrong. I read only the last line of the lint output, which was blank, and `eslint` was in fact failing from Stage 9.83: it scans the git-ignored `workspace/` folder, where my scratch `.cjs` scripts use `require()`. The shipped code was not affected (only `workspace/` scripts failed), but the claim was not verified. This stage I moved the finished scratch scripts out of `workspace/`, converted the two I still use to ES modules, fixed one unused-variable warning, and checked the **exit code**: `npm run lint` exits 0 and `npx eslint` exits 0.

## 1 · OG-05 final migration-state record

**5 Pillars Quick Reference → MERGED / NO STANDALONE RESOURCE.** A register-only state, recorded in `RESOURCE_REGISTER.md` (new "Merged / No standalone resource" section, with the state-table row), `CURRENT_STATUS.md` and `NEXT_ACTIONS.md`, and in `future-tasks.json` (`og-05-merged-conceptually`). It is **not** a protected-resource status value (a test checks that neither the schema nor the constants contain it). The OG-05 row's note says: no res-ID assigned; no NZ or AU PDFs exist; no standalone migration is planned; the ranking concept is already handled by OG-01 ("Your Three Priority Foundations"); the unsafe and unsupported legacy claims were NOT CARRIED. Nothing says OG-05 is awaiting migration (a test checks this).

## 2 · Final 45-resource migration-state counts

Deployed 25 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 18 = 45 (see the discrepancy above).

## 3 · Five Foundations pointer wording (Option B)

> Not sure which foundation to start with? **The Home Resilience Scorecard** helps you identify your three priority foundations.

The words are the owner's, with "The Home Resilience Scorecard" as the link text (a house-style capital after the question mark; no change of meaning). It links `/resources/home-resilience-scorecard/`, the protected scorecard `res-1001`, never the demo route. No ranking interaction, no new member data, no OG-01 change.

## 4 · How the protected-member gating is achieved

The page is shared with the public/demo build, so the pointer is gated twice at **build time**, in `app/foundations/page.tsx` through `scorecardPointerHref` in `lib/content/collection-rules.ts`:
1. `isPrivatePreview()` must be true (the private preview build sets `OG056_INCLUDE_DRAFTS=1`; the public build does not); and
2. the real scorecard `res-1001` must exist in that build and not be a placeholder (`getResourceById("res-1001")`, which only returns draft resources in the private preview).

If either fails the function returns `null` and the page returns the **same element tree as before** (the page is built from three shared elements, so the public output is not even structurally different). The site is a static export, so the public files simply contain no pointer. **Proof:** I built the public/demo site from the code before the change and after it and compared every file (build id and content-hashed chunk names normalised): **800 files, 800 identical, 0 differences**. (An earlier, simpler version that used an inline conditional changed 5 Five Foundations files in the public build through the page payload; I restructured it so the public output stays byte-identical.)

## 5 · The six demo placeholders removed from protected Start Here

Read from the deployed Start Here (not from memory): res-0001 **Welcome to OffGrid056** · res-0002 **How to Use the Resource Library** · res-0003 **Household Resilience Guide** · res-0004 **Five Foundations Overview** · res-0005 **Household Resilience Assessment** · res-0006 **Build Your First 30-Day Action Plan**. Each is a demo placeholder with `collections` containing `start-here`. They are hidden from the protected Start Here listing only (the same rule as Planning Tools, `inCollection(…, { hidePlaceholders: true })`). They are not deleted, and their own routes, the programme, the demo workshop and the demo learning path are untouched.

## 6 · Final protected Start Here contents

Exactly two, in order: **Step 1 Home Resilience Scorecard (OG-01, res-1001)** and **Step 2 Household Risk Identifier (OG-02, res-1002)**. These are the only protected resources whose records carry `collections: ["start-here"]` (checked against all 25 records); nothing else legitimately belongs there. The footer link to the Five Foundations is kept. OG-01 comes before OG-02 by the existing file-name tie-break, as it did before; a test pins it.

## 7 · Public/demo Start Here

**Unchanged.** The public build comparison above covers `/start-here/`: byte-identical, and it still lists all six demo placeholders (it contains "Welcome to OffGrid056").

## 8 · res-0004

Unchanged: still the published demo placeholder "Five Foundations Overview" (collection start-here, no related resources), no protected counterpart, **no route-policy entry** (no collision exists; the policy file is unchanged and still separates exactly OG-01, OG-08, OG-10 and OG-13's demos). Its own page in the staged build is byte-identical to the deployed page.

## 9 · Programme day 3

Unchanged: still demo content ("Placeholder action") pointing at `res-0004` as resource and worksheet. Its built page is identical to the deployed page, and so are the demo learning path `start-here` and the demo workshop `demo-five-foundations-intro`. The OG-05 merge creates no missing protected programme step. Regression tests pin all of this (`tests/unit/start-here-foundations.test.ts`).

## 10 · Supply-duration detector rule (`admin-import/audit/numeric.ts`, `supplyTargets`)

A duration bound to a supply noun is a factual preparedness target and is now **C_NEEDS_SOURCE** ("a supply-duration target…"). It reads four wordings: **"N-day / N-week supply"** with optional modifiers (food, drinking water, household water, fuel, non-perishable, emergency …) and a supply noun (supply, supplies, stockpile, stock, rations, reserve); **"N days of food / water / fuel / firewood / emergency supplies"** (including "7+ days of non-perishable food stored and accessible"); **"enough/sufficient food, water or fuel for / to last N days or weeks"**; and **"supply lasting N days"**. Singular and plural day, week and month, a plus sign, digits and spelled-out numbers.

Context decides: it is **not** a target when the sentence is **negated or reassuring** ("do not need", "no need", "never", "rather than"), a **question**, an **example** ("for example", "such as"), a **member's own choice or blank** ("choose", "write", "your own", "____"); and the compact "N-day supply" form also needs an **asserting word** beside it (minimum, at least, enough, should, keep, store, per person, disruption …), so a bare label such as "14-Day Supply" stays a label. It runs after the sourced-claim, safety-block, treatment-owned and structural checks, so approved wording is unaffected, and the Stage 9.86 survival rule is untouched. It names no resource.

## 11 · Positive detector tests (`tests/unit/numeric-supply.test.ts`)

Each of 14 patterns is run with 2, 7, 14 and 30, in NZ and AU: N-day food supply · N-day non-perishable supply minimum · N-day (drinking) water supply · N-day household water supply · N-day fuel supply · N-week food supply · N days of non-perishable food · N days of drinking water · N days of firewood · N days of emergency supplies · supply lasting N days · enough food for N days · enough drinking water for N days · enough fuel to last N weeks. Plus the singular and plural of day, week and month and "7+ days"; spelled-out numbers (seven-day, three days, fourteen days, two weeks, thirty-day); the exact matched text is pinned for four examples; and the recorded gap from Stage 9.67 ("7+ days of non-perishable food stored and accessible") is now a candidate that needs a source.

## 12 · Negative detector tests

Not flagged: resource titles ("30-Day Pantry Builder", "90-Day Implementation Roadmap", "The 30-Day Pantry Builder helps you plan."); programme names ("30-Day Programme", "OffGrid056 30-Day Programme"); schedules and durations ("This is a 10-minute worksheet.", "Complete this in 7 days.", "Day 7", "Week 3", "Review your plan in 2 weeks."); deadlines ("Allow 14 days for delivery of your fuel supply.", "Order your firewood by Friday, within 7 days."); planning language ("Plan 7 days of meals.", "Your 30-day plan starts on Monday.", "Set a 14-day goal…"); bare labels ("14-Day Supply", "3-day / 7-day / 14-day / 30-day"); reassurance ("You do not need to buy 30 days of food in one shop." — the live OG-11 sentence — "You don't need a 14-day food supply to start.", "There is no need to store 30 days of water at once."); questions, examples, and member-entered blanks ("My target food supply (7 days, 14 days, 30 days): ____", "Write your own…", "Choose your supply…"). Also: OG-11's reassurance stays D_NOT_A_CLAIM exactly as before; New Zealand's approved three-litre baseline stays A_ALREADY_SOURCED; the survival rule still fires. The two tests in `og-01-audit.test.ts` that recorded the gap were updated: the supply phrase is now C, the OG-11 reassurance still D, and the legacy OG-01 source now lists "7+ days" as a third blocked figure (it is not in the migrated OG-01).

## 13 · Whole-library scan

The hardened detector (both new rules) was run over **all 25 live resources in both markets**: 431 numeric candidates, **Bucket C 0**, and **0 sentences caught by either the survival rule or the supply rule**. So no legitimate unresolved live claim exists and no exemption was added. (During Stage 9.86 the survival rule's first version flagged one live readiness question; that was narrowed, not exempted.)

## 14 · Bucket C

**0** across the live library. Regression run: 0 market problems, 0 content flags, 0 price findings, 0 safety-removal findings.

## 15 · Register consistency

`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree on: live 25 protected resources and 50 market files; staged resources none; OG-05 MERGED / NO STANDALONE RESOURCE; Worker `65437c37-b731-4851-b67e-5b0fae79fe12`; immediate rollback `89333107-7c0a-4bdb-8229-f2b5241a9e05`. They also say the navigation cleanup is "built, not deployed (not a resource)" and that deploying it needs explicit approval, so "staged: none" is not confused with the pending code change. `tests/unit/registers.test.ts` (23 tests) checks counts, table rows (25 / 1 / 1 / 18, all 45 codes unique), the Worker and rollback ids, paths, encoding and the OG-05 wording. Earlier stage notes' "waiting on the owner" lines are relabelled as resolved or superseded.

## 16 · Tests

**902 passing** (41 files; 829 at Stage 9.86, so +73): 51 supply-duration detector tests, the Start Here / Five Foundations / nothing-else-moved tests, and the extended register tests. Lint exits 0 and typecheck exits 0 (both checked by exit code). Run: numeric detector tests, content-flag tests, register consistency tests, Start Here listing tests, demo/protected separation and route-policy regression, price, numeric, market, safety and legacy-language scans. One full run earlier in the stage had timeouts in `importer.test.ts` while the machine was short of memory (about 1.4 GB free); those tests pass on a rerun and I changed neither them nor any timeout.

## 17 · Exact files changed

Code and content: `app/start-here/page.tsx`, `app/foundations/page.tsx`, `lib/content/collection-rules.ts`, `admin-import/audit/numeric.ts`, `admin-import/config/future-tasks.json`.
Tests: `tests/unit/numeric-supply.test.ts` (new), `tests/unit/start-here-foundations.test.ts` (new), `tests/unit/registers.test.ts`, `tests/unit/og-05-disposition.test.ts`, `tests/unit/og-01-audit.test.ts`, `tests/unit/og-01-draft.test.ts` (the deferred-task status), `tests/unit/planning-tools-collection.test.ts`.
Registers and report: `internal/member-programme/CURRENT_STATUS.md`, `NEXT_ACTIONS.md`, `RESOURCE_REGISTER.md`, and this report.
Not changed: OG-01 and every protected record, PDF and `private-assets/` file (0 differences against the deployed state; all 75 deployed PDFs byte-identical), OG-04, res-0004, programme day 3, demo routes, `route-policy.json`, Cloudflare Access, OG-02's legacy filename.

## 18 · Unexpected differences

None in the build. Staged build against the deployed tree: 1,000 files each; exactly **10 changed files** — the five `/foundations/` files (the pointer) and the five `/start-here/` files (the cleanup) — plus one new content-hashed CSS chunk. Everything else is identical, including every PDF. Public build: 0 differences.

## 19 · Readiness to deploy the navigation / detector cleanup

**Ready, pending your approval and your answer on the register counts.** What would deploy is the staged build (1,000 files, 25 records, 50 market files, 0 broken links, Bucket C 0): the protected Start Here change and the Five Foundations pointer. The detector changes are admin tooling and do not deploy. Rollback target: `65437c37-b731-4851-b67e-5b0fae79fe12` after the new deployment (the current Worker), then `89333107-7c0a-4bdb-8229-f2b5241a9e05` and the older versions. Nothing has been deployed, and the Access probe still redirects every route.

**Stopped before deployment.**
