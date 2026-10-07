# Stage 9.88 — protected navigation cleanup deployed

**Date:** 8 October 2026 · **Deployed on the owner's explicit approval. Only the approved protected/member changes were made.**

## Deployment

| | |
|---|---|
| Result | **Success.** 585 assets uploaded (415 already present); `og056-preview` and its triggers deployed. |
| New Worker ID | `2fb0663d-a7da-4acf-ba4c-957886b21631` (100%) |
| Immediate rollback | `65437c37-b731-4851-b67e-5b0fae79fe12` (the Stage 9.84 deployment) |
| Older versions retained | `89333107-7c0a-4bdb-8229-f2b5241a9e05` → `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | the validated Stage 9.87 build, exactly. Before uploading: `HEAD` was a documentation-only descendant of `471456c` (`git diff 471456c` over `app/`, `lib/`, `components/`, `data/` and `admin-import/audit/` was empty, working tree clean); `out/` was not rebuilt from altered source; its normalised manifest matched the previously validated one (1,000 of 1,000 files identical); `import:verify-build` records 25 · market files 50 · broken internal links 0. |
| LIVE now | **25 protected resources · 50 market files · 1,000 files · 0 broken links · Bucket C 0** |
| Staged | none |

To roll back, point the Worker at `65437c37-b731-4851-b67e-5b0fae79fe12`. As in earlier deployments, Access protects every page, so content was verified on a snapshot of the exact tree uploaded (compared file by file with `out/`: identical) and the live Worker was checked for the version, the 100% split and the Access redirects.

## Manifest: deployed tree against the previous live deployment (Stage 9.84)

Build id and content-hashed chunk names normalised.

| | |
|---|---|
| Files before / after | 1,000 / 1,000 |
| **Added** | 1: `_next/static/chunks/1jqqdx_8vailb.css` |
| **Removed** | 1: `_next/static/chunks/3ytlj4gr2kfr3.css` (replaced by the file above) |
| **Changed** | 10: the five `/foundations/` files and the five `/start-here/` files |
| **Unchanged** | 989 (including every resource page, library, Planning Tools, programme, demo route and PDF) |
| **Unexplained differences** | **0** |

The five `/foundations/` files are `index.html`, `index.txt`, `__next._full.txt` and the two `__PAGE__.txt` payloads; the five `/start-here/` files are the same set. The replaced stylesheet differs by **one added, unused Tailwind utility** (`.ordinal`) and no removed rule; no JavaScript chunk was added or removed. (Every page also names the new stylesheet file; the normalisation accounts for that.)

**PDF regression: 0 changed** (75 PDFs compared with the previous deployment). OG-04's two PDFs still have the approved hashes (NZ `C39C3D56…`, AU `A1E4EF42…`).

## Protected Start Here

Exactly two entries: **Step 1 OG-01 Home Resilience Scorecard (res-1001)** and **Step 2 OG-02 Household Risk Identifier (res-1002)**; no Step 3, no "DEMONSTRATION ENTRY". The previous deployment showed those two plus six demo placeholders; **res-0001, res-0002, res-0003, res-0004, res-0005 and res-0006** are hidden from the protected Start Here only. None was deleted or rerouted: each still has its own route in the deployed tree.

## Protected Five Foundations pointer

"Not sure which foundation to start with? The Home Resilience Scorecard helps you identify your three priority foundations." It links `/resources/home-resilience-scorecard/`, which is the protected `res-1001` (not the demo route). The five foundation cards are intact; no ranking interaction was added.

## Public / demo

**Unchanged.** A public build made from the pre-change code and from the deployed code: **800 files, 800 identical, 0 differences**. The public Foundations page has no pointer; the public Start Here still lists the demo placeholders; no protected resource is in the public build.

## res-0004, programme day 3, demo workshop and demo routes

All unchanged: res-0004's page, programme day 3 (still demo content pointing at res-0004), the demo learning path `start-here` and the demo workshop `demo-five-foundations-intro` are byte-identical to the previous deployment (chunk names aside). The separated demo routes and the six placeholders' own routes are still built. `route-policy.json` is unchanged.

## Access

All 41 unauthenticated routes redirect to Cloudflare Access, none answered 200. Specific probes, all redirected: the library, Start Here, Five Foundations, OG-01 and OG-02 pages, OG-01's and OG-02's PDFs, Planning Tools, OG-04's page, res-0004's page, programme day 3, the demo workshop, a demo route and an unknown route. Access settings were not changed.

## Resource system, OG-05, migration states, detectors

- **Unchanged:** protected resource count (25), market-file count (50), every record and PDF, Planning Tools (the same eight, no demo placeholder), the library listing (51 entries, each deep-equal), OG-01, OG-04, OG-02's legacy filename, the programme routes.
- **OG-05:** MERGED / NO STANDALONE RESOURCE: no res-ID, no PDFs, no standalone route or deployment.
- **Migration states (unchanged, total 45):** Deployed 25 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 18.
- **Detectors:** the survival-duration and supply-duration rules stay in admin tooling (no live change). Whole live library: 431 candidates, **Bucket C 0**, no exemption added.

## Register post-deploy state

`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` now agree: **live 25 protected resources · 50 market files; staged none; navigation cleanup DEPLOYED (Stage 9.88); OG-05 MERGED / NO STANDALONE RESOURCE; migration counts 25 / 0 / 0 / 1 / 1 / 18; Worker `2fb0663d-a7da-4acf-ba4c-957886b21631`; rollback `65437c37-b731-4851-b67e-5b0fae79fe12`.** The current-state statements no longer say anything is built-but-not-deployed or awaiting approval. Historical stage notes were not rewritten; the earlier notes' "waiting on the owner" lines are relabelled as resolved or superseded. `future-tasks.json` records the pointer task as deployed in Stage 9.88.

## Validation (exit codes)

| Check | Exit code | Result |
|---|---|---|
| `npm run lint` (configuration unchanged; `workspace/` is still linted) | **0** | PASS |
| `npx tsc --noEmit` | **0** | PASS |
| full test suite | **0** | **904 passed**, 41 files |
| register consistency tests | 0 | 25 passed (updated to the Stage 9.88 state) |
| Start Here, Five Foundations gating and collection/listing tests | 0 | 24 passed |
| demo/protected separation and route-policy tests | 0 | 38 passed |
| numeric detector tests (registry, ownership, survival, supply, OG-01 audit) | 0 | 128 passed |
| content-flag, prep and OG-05 disposition tests | 0 | 130 passed |
| regression run (price, market, safety and legacy-language checks) | 0 | 0 market problems, 0 other findings, 0 content flags, 0 price findings, 0 safety-removal findings |
| whole-library numeric scan | 0 | 431 candidates across 25 resources; **Bucket C 0** |
| public-build comparison | n/a | 800 files, 800 identical, **0 differences** |
| `import:verify-build` | 0 | 25 records, 50 market files, 0 broken internal links |
| Cloudflare Access probe | 0 | 41 routes probed, 41 redirected to Access, 0 answered 200 |
| live Worker | n/a | `2fb0663d-a7da-4acf-ba4c-957886b21631` at 100% |

Lint and typecheck are PASS because their exit codes are 0, not because of blank output. The ESLint configuration was not changed and `workspace/` was not excluded.

## Unexpected differences

None in the deployed tree. Two things worth knowing, neither a product difference:
- the stale Planning Tools QA script from Stage 9.83 (`qa-planning-tools-og04.mts`) reports three failures when pointed at this comparison, because it still expects the Stage 9.83 starting state (Planning Tools of seven, OG-04 not yet in the library, eight Start Here entries before). Its real equivalents pass in the Stage 9.87 QA run above: Planning Tools unchanged (the same eight), the library identical, Start Here two entries.
- a local rebuild of the preview after the deployment differs from the uploaded tree in one file (`resources/home-resilience-scorecard/index.html`) only by the position of a Next.js `next-size-adjust` meta tag in the head (same length; a known, nondeterministic build artefact). It is not what was deployed: the uploaded tree matched the validated manifest exactly.

## Readiness for the next legacy resource audit

**Ready.** Nothing is staged, no register is out of date, and the Stage 9.87 work is fully deployed and verified. The next legacy resource to audit is the owner's choice.

**Stopped after post-deploy QA.**
