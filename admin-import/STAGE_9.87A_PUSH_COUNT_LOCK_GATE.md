# Stage 9.87A — push recovery, count lock and deployment gate

**Date:** 8 October 2026 · **NOT DEPLOYED.** Live is unchanged: 25 protected resources · 50 market files · Worker `65437c37-b731-4851-b67e-5b0fae79fe12` (100%) · rollback `89333107-7c0a-4bdb-8229-f2b5241a9e05`. Staged resources: none. No application code, record, PDF, route policy or Access setting was changed in this stage; only the three registers, one test file and this report.

## 1 · Push

Retried `471456c` unchanged (no amend, no new commit). **Succeeded:** `9c4e24f..471456c  main -> main`, exit code 0. Branch **main**, remote **origin** (`https://github.com/teorangapapakaianga-oss/offgrid056-member-library.git`); `main` and `origin/main` are in step. The first two attempts had failed with a GitHub-side Internal Server Error; the third went through with no workaround.

## 2 · Verified migration-state counts, now locked

| State | Count |
|---|---|
| Deployed | 25 |
| Staged | 0 |
| Prepared | 0 |
| Blocked | 1 (OG-16) |
| Merged / No standalone resource | 1 (OG-05) |
| Not started | 18 |
| **Total** | **45** |

Re-counted from the register's tables and the 25 protected records: every record is in the Deployed table, no code appears twice, and all 45 legacy codes (OG-01 to OG-30, OG-B01 to OG-B15) are accounted for. The old "Prepared 1 / Blocked 0" expectation no longer appears as an open question in any register; the earlier stage notes that mention it are labelled as earlier notes.

## 3 · OG-16 (not touched)

**Grant Eligibility Insulation Planner — Blocked on grants research:** NZ programmes; AU state and territory schemes (the register's own wording). It has no protected record, no prep, no config entry. Not researched, not unblocked, not migrated.

## 4 · Lint and typecheck (real exit codes)

- `npm run lint`: **exit code 0**
- `npx tsc --noEmit`: **exit code 0**

On the scratch scripts: the premise needs a correction. The git-ignored `workspace/` scripts are **not** outside ESLint's scan: the config ignores only `.next`, `out`, `build` and `next-env.d.ts`, so ESLint lints all **184** files in `workspace/` (0 errors, 0 warnings). What I did last stage was remove the `.cjs` scratch scripts from `workspace/` (0 remain) so that nothing there fails lint; the `.mts` and `.mjs` scripts pass. I have not changed the ESLint configuration. If you would rather exclude `workspace/` from linting, that is a one-line config change for you to approve.

## 5 · Build identity: the deployable build is the accepted Stage 9.87 code

- `git diff 471456c` over `app/`, `lib/`, `components/`, `data/` and `admin-import/audit/` is **empty**: the code that builds is exactly commit `471456c`. (The working-tree changes in this stage are the registers and a test.)
- The preview was rebuilt from that code: 1,000 files, `import:verify-build` records 25 · market files 50 · broken internal links 0. A second rebuild produced an identical normalised manifest (1,000 of 1,000 files identical), so the build is reproducible.

**Exact deployable manifest diff against the deployed tree (Stage 9.84):** 1,000 files in each; **989 identical, 10 changed pages, and one stylesheet swapped**:

| Change | Files |
|---|---|
| protected `/foundations/` (the pointer) | `foundations/index.html`, `index.txt`, `__next._full.txt`, `__next.foundations/__PAGE__.txt`, `__next.foundations.__PAGE__.txt` |
| protected `/start-here/` (OG-01 and OG-02 only) | `start-here/index.html`, `index.txt`, `__next._full.txt`, `__next.start-here/__PAGE__.txt`, `__next.start-here.__PAGE__.txt` |
| content-hashed CSS chunk | `3ytlj4gr2kfr3.css` removed, `1jqqdx_8vailb.css` added; the only rule difference is **one unused Tailwind utility added** (`.ordinal`); no rule removed |
| JavaScript chunks | none added, none removed (names identical) |
| PDFs | **0 changed** (75 deployed PDFs compared); every `private-assets/` file also byte-identical to the deployed state |
| all other pages (every resource page, library, Planning Tools, programme, demo routes) | identical, apart from the renamed stylesheet reference that the normalisation accounts for |

Counting the stylesheet reference in every page, the raw (un-normalised) manifest differs in 877 pages; each of those differs only in that CSS file name. **No unrelated resource page changed in content.**

## 6 · OG-05

**5 Pillars Quick Reference: MERGED / NO STANDALONE RESOURCE.** No res-ID, no PDFs, no standalone deployment. Unchanged. It is a register-only state, in the Merged section of `RESOURCE_REGISTER.md` and in all three registers' current-state statement.

## 7 · Protected Start Here

Confirmed in the deployable build: exactly **Step 1 OG-01 Home Resilience Scorecard (res-1001)** and **Step 2 OG-02 Household Risk Identifier (res-1002)**, no Step 3, no "DEMONSTRATION ENTRY". The deployed Start Here showed those two plus six demo placeholders; **res-0001, res-0002, res-0003, res-0004, res-0005 and res-0006** are hidden from the protected listing only. They are not deleted: each still has its own route in the build, the demo learning path, the demo workshop, programme day 3 and res-0004's page are byte-identical to the deployed ones, and no route was rerouted.

## 8 · Five Foundations pointer

Confirmed wording in the protected build: "Not sure which foundation to start with? The Home Resilience Scorecard helps you identify your three priority foundations." It links `/resources/home-resilience-scorecard/` (the protected `res-1001`, not a demo route). The pointer is gated at build time on the private preview AND on the real scorecard being in the build. **Public/demo page: unchanged.** A public build made from the code before and after: **800 files, 800 identical, 0 differences** (re-run this stage); the public Foundations page contains no pointer and the public Start Here still lists the demo placeholders.

## 9 · Detector families (both active, no exemptions)

- **A. Survival / deprivation durations** ("N days without water", "N hours in extreme cold"): active, 33 tests.
- **B. Duration-of-supply targets** ("a 7-day food supply", "enough food for 14 days"): active, 51 tests; negated, question, example, member-blank and label sentences stay ordinary.
- Whole live library re-scanned with both: 25 resources, both markets, **431 candidates, Bucket C 0, no sentence caught by either rule**. No exemption was added.

## 10 · Register consistency

`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live **25 protected resources and 50 market files**; staged resources **none**; migration-state counts **25 deployed · 0 staged · 0 prepared · 1 blocked · 1 merged · 18 not started**; OG-05 **merged / no standalone**; Worker **`65437c37-b731-4851-b67e-5b0fae79fe12`**; rollback **`89333107-7c0a-4bdb-8229-f2b5241a9e05`**; the navigation cleanup is "built, not deployed (not a resource)" and needs explicit approval. Paths valid, no truncated paths, no control characters, no mojibake, well-formed ids (all checked by `tests/unit/registers.test.ts`, 25 tests, including two new ones for the count lock and OG-16). The changes this stage: the "As at" lines, the count-lock wording in `CURRENT_STATUS.md`, a Stage 9.87A note in `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md`, and the Stage 9.87 note's open count question relabelled as resolved.

## 11 · Validation (exit codes)

| Check | Exit code | Result |
|---|---|---|
| `npm run lint` | **0** | PASS (184 files in `workspace/` also linted: 0 errors, 0 warnings) |
| `npx tsc --noEmit` | **0** | PASS |
| full test suite | **0** | **904 passed**, 41 files (902 at Stage 9.87, plus 2 new register tests) |
| register consistency tests | 0 | 25 passed |
| Start Here, Five Foundations pointer and collection/listing tests | 0 | 24 passed |
| demo/protected separation and route-policy tests | 0 | 38 passed |
| numeric detector tests (incl. the survival and supply families) | 0 | 128 passed |
| content-flag, prep and OG-05 disposition tests | 0 | 130 passed |
| regression run (`workspace/regress.mts`) | 0 | 0 market problems, 0 other findings, 0 content flags, 0 price findings, 0 safety-removal findings |
| whole-library numeric scan | 0 | 431 candidates across 25 resources; **Bucket C 0** |
| public-build comparison | n/a | 800 files, 800 identical, **0 differences** |
| `import:verify-build` | 0 | 25 records, 50 market files, 0 broken internal links |
| Cloudflare Access probe | 0 | 41 routes probed, 41 redirected to Access, 0 answered 200 |
| live Worker | n/a | `65437c37-b731-4851-b67e-5b0fae79fe12` at 100% (unchanged) |

Price scan: 0 detections. Market, safety and legacy-language scans pass (inside the regression run and the prep tests). Bucket C = **0**.

## 12 · Readiness to deploy the Stage 9.87 navigation cleanup

**Ready, awaiting your explicit approval.** What would deploy is the verified 1,000-file build above. Expected live effect: protected `/start-here/` shows OG-01 and OG-02 only; protected `/foundations/` gains the one pointer sentence; nothing else changes. The immediate rollback target after the deployment would be the current Worker `65437c37-b731-4851-b67e-5b0fae79fe12`, then `89333107-7c0a-4bdb-8229-f2b5241a9e05` and the older versions. **Stopped before deployment.**
