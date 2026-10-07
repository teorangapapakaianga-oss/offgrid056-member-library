# Stage 9.89 — tooling hygiene and build reproducibility gate

**Date:** 8 October 2026 · **Tooling only. Nothing deployed, nothing staged, no live content, PDF, record, navigation, route policy, register count or Access setting changed.** Live: 25 protected resources · 50 market files · 0 broken links · Worker `2fb0663d-a7da-4acf-ba4c-957886b21631` (100%) · rollback `65437c37-b731-4851-b67e-5b0fae79fe12`. The migration-state counts are untouched: Deployed 25 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 18 = 45.

## Verdict

1. The stale QA script is retired and its durable coverage now lives in the test suite.
2. The head/meta difference is **harmless equivalent serialisation, variable between builds, and fully understood**. Repeated clean builds of the same source produce identical semantic content, routes, metadata values, resource data and asset references. The STOP rule did not trigger.

## A · The stale QA script

| | |
|---|---|
| Path | `workspace/qa-planning-tools-og04.mts` (git-ignored scratch; generated in Stage 9.83 from `workspace/qa-planning-tools.mts`, written in Stage 9.78B) |
| What it asserted | a **delta**, not a state: "the deployed Planning Tools lists exactly seven protected resources", "the library gains only `res-1004` and nothing else changes", "Start Here is unchanged (eight entries)". It was designed to compare the Stage 9.83 staged build with the Stage 9.79 deployment. |
| Why it is stale | OG-04 is now deployed, so "before" already has eight Planning Tools entries and no library change is pending; and the Stage 9.88 deployment deliberately changed Start Here from eight entries to two. It reports 3 failures that only reflect its old starting state. |
| Referenced elsewhere | no code, test or `package.json` script imports it. It was named only in historical reports (the Stage 9.78B report names `qa-planning-tools.mts`; the Stage 9.88 report names `-og04`), which are left as written. |
| Equivalent current coverage | partly. `tests/unit/planning-tools-collection.test.ts` pins the record-level membership (eight, with ids and titles) and the listing rule, and `start-here-foundations.test.ts` the Start Here rule. But the **built-output** checks — each member appears exactly once on the built page and in every payload file, no demo placeholder in the listing, exact titles — existed **only** in the scripts, so unique coverage did exist. |

**Decision: migrate the unique coverage, then retire.** I ported it into a new, state-based test (below), and moved the stage-specific scripts out of the routine path. Nothing was weakened: the new test asserts the same properties, derived from the protected records instead of a stage's starting state.

### Replacement coverage: `tests/unit/built-output.test.ts` (14 tests)

Derived from `private-assets/data-resources` and the built `out/`, never from a hard-coded stage. It is skipped unless `out/` is the private-preview build of the current records (so the public build and a checkout without private assets skip it); run `npm run build:preview` first to exercise it. It checks: one page per protected record, every market file present, all records draft, unique ids and slugs; Foundation, Programme Component, Category and Type in every protected page's data; no private PDF in `public/`; **Planning Tools lists exactly the planning-tools members, each once on the page and in all four payload files, none a placeholder, titles exact**; **Start Here lists exactly the start-here members, none a placeholder, no "DEMONSTRATION ENTRY"**; the Five Foundations pointer and its link; each protected resource once in the library; all four demo/protected pairs (protected route serves the protected resource, demo route serves the placeholder, no protected PDF on the demo page, programme days, demo resources and demo workshop still name the demo placeholders); programme day 3, res-0004 and the demo Five Foundations workshop still demo; no separated demo placeholder in any listing; the private water-basics path; the 404.

### Scripts retired (moved to `workspace/archive/stage-qa/`, each with an ARCHIVED header, otherwise unchanged)

`qa-planning-tools.mts` (9.78B), `qa-planning-tools-og04.mts` (9.83), `qa-build-og03.mts` (9.78A), `qa-release.mts` (9.73/9.78), `qa-release-og04.mts` (9.83) and `qa-start-here.mts` (9.87). I ran every stage-specific QA script against the current build first: `qa-build-og03.mts` (1 failure: expects Planning Tools of four demo placeholders plus OG-03) and `qa-release.mts` (4 failures: expects 24 records and 48 market files) fail for the same reason; `qa-release-og04.mts` and `qa-start-here.mts` are one-release delta gates that would fail the same way once their release is deployed. `qa-build.mts` and `qa-build-og01.mts` assert states, still pass (exit 0) and stay. After this, **no routine QA command reports a failure merely because it expects a historical starting state**: the routine commands are `npm test`, lint, typecheck, `import:verify-prep`, `import:verify-build` and the two state-based scripts. The `workspace/` folder is git-ignored scratch, so these moves do not appear in git; the ESLint configuration is unchanged and still lints `workspace/` (it passes).

## B · Build reproducibility

Seven builds of the same source (HEAD `17c7847`; `app/`, `lib/`, `components/` and `data/` identical to the accepted Stage 9.87 code), each a full `npm run build:preview` with `out/` removed first:

| Build | Mode | Files |
|---|---|---|
| clean-A, clean-B, clean-C | `.next` and `out/` both deleted first (clean cache) | 1,000 each |
| inc-1, inc-2 | incremental (`.next` kept) | 1,000 each |
| inc-3 | public build first, then incremental preview (the Stage 9.87A routine) | 1,000 |
| stress-1 | incremental, with 8 CPU-bound jobs on 4 logical processors | 1,000 |

**Clean-build comparison #1 (clean-A vs clean-B) and #2 (clean-B vs clean-C), plus clean-A vs clean-C:**

| | A vs B | B vs C | A vs C |
|---|---|---|---|
| total files | 1,000 / 1,000 | 1,000 / 1,000 | 1,000 / 1,000 |
| **byte-for-byte, raw** | 120 identical | 120 identical | 120 identical |
| paths present in only one tree | 3 | 3 | 3 |
| **with only the Next build id normalised** | **1,000 identical, 0 changed** | **1,000 identical, 0 changed** | **1,000 identical, 0 changed** |

Why raw is only 120: Next generates a **random build id** for every build (`next.config.ts` sets no `generateBuildId`), and it is part of the static asset path (`_next/static/<id>/…`, 3 files by path) and of the text of most pages. The build id is the only thing that differs in the clean builds. Normalising it makes the whole tree identical. The same holds for the three incremental builds: clean-C vs inc-1, inc-1 vs inc-2, inc-2 vs inc-3 and clean-C vs inc-3 are **1,000 of 1,000 identical** after build id normalisation. Hash-named JavaScript and CSS chunk files are identical in name and content across all builds. This stage's source differs from the deployed tree only by nothing: the current build matches the deployed Stage 9.88 tree in all 1,000 files.

## C · The meta/head difference

**Exact path(s) seen:** one page per affected build, differing by builds: `resources/30-day-action-planner/index.html` (a public rebuild, Stage 9.87), `resources/home-resilience-scorecard/index.html` (the preview rebuild after the Stage 9.88 deployment), and, reproduced now under load, `resources/demo-home-resilience-scorecard/index.html` (stress-1).

**Exact semantic difference (stress-1 vs clean-C, 30 head tags each):** the same 30 head tags in both pages (same multiset), the same values; the single tag `<meta name="next-size-adjust" content=""/>` is tag #23 (before `theme-color`) in one build and tag #29 (after `apple-touch-icon`, before the page scripts) in the other, so 7 positions differ by one place. Remove that one tag from each page and **the pages are byte-identical**; the `<body>` is byte-identical; the page's RSC payload (`index.txt`) is byte-identical; page length is identical (122,604 characters).

**Source:** Next.js 16.3.5 itself, `node_modules/next/dist/server/app-render/app-render.js` (line 1219): the framework renders `<meta name="next-size-adjust" content="">` into the page head whenever the app uses font size adjustment, and our `app/layout.tsx` loads Bebas Neue and Montserrat through `next/font/local`. Where React places that meta among the other head tags depends on when the page's asynchronously resolved metadata (title, description, theme colour, icons) reaches React's head collection, which is **timing-dependent**. Not application content, a template or a page of ours.

**Semantic impact: none.** It is an empty-valued marker meta addressed by name; nothing in Next's browser code (`dist/client`) or build code reads it, no value changes, and meta tags carry no order-dependent behaviour. Titles, descriptions, robots, icons and the scripts are unchanged and in the same relative order.

**Deterministic or variable? Variable.** It did not occur in 6 of the 7 builds above, appeared in the one built under CPU load, and appeared twice before in rebuilds made when the machine was short of memory. It affects at most one page per build (about 1 in 1,000 files) and never the content or payload.

**Can it be made deterministic without changing visible behaviour?** Not in our source. The only application-side switch is `adjustFontFallback: false` on the two `next/font/local` calls, which removes the tag but changes the fonts' fallback metrics (a visible behaviour change), so I did not make it. Making the *raw* output reproducible would also need a fixed `generateBuildId` in `next.config.ts`; that is a config change for the owner to approve and is not needed for correctness. **Decision: record it as understood and harmless; no application change.**

**Tooling now copes with it:** `workspace/compare-builds.mjs` ignores that one tag when comparing (raw output of the strict `repro-compare.mjs` still reports it, and prints "also ignoring the position of next-size-adjust: 0 differing"); `workspace/manifest-norm.mts` gained an opt-in `CANON_HEAD=1` for the same purpose (the default is unchanged, so earlier manifests stay comparable). Routine comparisons no longer report a false difference for it.

## Validation (exit codes)

| Check | Exit code | Result |
|---|---|---|
| `npm run lint` (configuration unchanged) | **0** | PASS |
| `npx tsc --noEmit` | **0** | PASS |
| full test suite | **0** | **918 passed**, 42 files (904 plus the 14 new built-output tests) |
| built-output (state-based) tests | 0 | 14 passed (ran, not skipped: `out/` is the preview build) |
| register consistency tests | 0 | 25 passed |
| collection, Start Here and Five Foundations gating tests | 0 | 24 passed |
| demo/protected separation and route-policy tests | 0 | 38 passed |
| numeric detector tests | 0 | 128 passed |
| content-flag, prep and OG-05 tests | 0 | 130 passed |
| whole-library numeric scan | 0 | 431 candidates across 25 resources; **Bucket C 0** |
| `import:verify-build` | 0 | 25 records, 50 market files, 0 broken internal links |
| Cloudflare Access probe | 0 | 41 routes probed, 41 redirected, 0 answered 200 |
| live Worker | n/a | `2fb0663d-a7da-4acf-ba4c-957886b21631` at 100% (unchanged) |

## Files changed

Tracked (committed): `tests/unit/built-output.test.ts` (new), this report. Nothing else under git changed; no register, resource, PDF, route or navigation file was touched.
Git-ignored scratch under `workspace/` (not in the commit): the six scripts moved to `workspace/archive/stage-qa/`; `compare-builds.mjs` and `manifest-norm.mts` updated; new `repro-compare.mjs`, `head-diff.mjs`, `meta-census.mjs`, `clean-build.ps1`, `inc-build.ps1`, `archive-stage-qa.mjs`.

## Readiness to begin the OG-06 claims-first audit

**Ready.** Both ambiguities are resolved: no routine QA command expects a historical state, and the build output is reproducible apart from one understood, harmless head-tag ordering. Stopped before OG-06.
