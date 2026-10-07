# Stage 9.78 — OG-03 staged as protected resource #24

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Staged and verified. NOT deployed.** No PDF was regenerated or rewritten. The live site is unchanged: **23 protected resources · 46 market files**, Worker **`e63141a1-380a-4770-a125-9fd7a15d0bdb`** (100%), rollback chain `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a…` → `fa23ec74…` → `1922f7ba…` retained; an unauthenticated probe of 41 live routes still redirects every one to Cloudflare Access.

## 1 · Staged asset paths and hashes (all under the git-ignored `private-assets/`)
| Path | Bytes | SHA-256 |
|---|---|---|
| `private-assets/data-resources/household-spending-capacity-check.private.json` | 1,144 | `FCB40DB3A5AC9596DCB4B93FD7C96B1B966475DA1221F5E3D93F872D7E657820` |
| `private-assets/resources/household-spending-capacity-check.NZ.pdf` | 283,976 | `D0197F0539C1FA553592997E99BC7645073D09E2CCA3F55855393596C58ADB65` |
| `private-assets/resources/household-spending-capacity-check.AU.pdf` | 283,712 | `4811FD4E59BDAA19C4FF5062C93404C529E6DDA1BEAE54D77B2A2F20F1801A9C` |
Both PDFs are **byte-identical to the approved Stage 9.77 renders** (hash and size equal, in `private-assets/` and in the built `out/`). **Nothing else in `private-assets/` changed:** the file list and hashes before (70 files) and after (73 files) differ by exactly these three additions. A pre-staging copy is kept at `workspace/backups/private-assets-e63141a1` (git-ignored). Nothing OG-03 is tracked in git.

## 2 · Resource metadata (record `res-1003`)
`res-1003` · `household-spending-capacity-check` · **Household Spending Capacity Check** · foundation `general` · programme component `planning-implementation` · category `planning` · type `worksheet` · difficulty `beginner` · 15 minutes · status **`draft`** · collections **none** · tags none · NZ and AU market files, no default file · not a placeholder · downloadable · legacy code OG-03.
**Description (the approved Stage 9.76A text, verbatim; the record and the built page data both match it exactly):** *A practical worksheet to help households understand what they can realistically allocate toward resilience and off-grid improvements while protecting essential household needs.*
The staging script checks every value against the owner's locked list and refuses to run if any differs.

## 3 · Counts
| | Live (deployed) | Staged build |
|---|---|---|
| Protected resources | **23** | **24** |
| Market files | **46** | **48** |
| Broken internal links | 0 | **0** |
| Bucket C | 0 | **0** |
| Files in the built site | 984 | 992 |

## 4 · Related-resource checks
`res-1001` Home Resilience Scorecard · `res-1002` Household Risk Identifier · `res-1022` Resilience Product Wishlist · `res-1026` 3-Tier Budget Planner · `res-1027` 90-Day Implementation Roadmap · `res-1025` Project Support Brief Template — each resolves to a private record **with exactly the expected title**, appears in OG-03's page data, and has its route in the built site. **`res-1510`** (90-Day Implementation Roadmap (Advanced)) resolves to the Advanced Roadmap, its route exists, and it is named as the later-stage option in the worksheet's Where Next. I read "keep res-1510 as the later-stage Advanced Roadmap" as *keep it in the journey*, so the record's related list stays at the six approved ids and does not include it; say if you want it added as a seventh related link.

## 5 · Route checks
`/resources/household-spending-capacity-check/` exists exactly once; there is **no `demo-` route and no demo, public or other resource with that slug or id** (checked in the public data and in the built site), so **no `route-policy.json` entry was needed and none was added**. The route policy is unchanged and still pins `supersedes` empty and `separateDemo` to the four approved pairs. **Demo/protected regression on the staged build: ALL PASS** — the four protected routes still serve their protected records; the four demo placeholders still appear only on their own routes, the programme and workshop pages and the demo pages that name them (79 files, unchanged from the deployment); programme days 2, 9, 11, 13 and 29 still point at the demo placeholders; no demo card appears in any listing. OG-03 is listed on the home page, the library and the downloads page (a general resource has no foundation page, like OG-01 and OG-26), once in the library; it is **not** in Start Here or Planning tools (collections: none) and on none of the five foundation pages.

## 6 · PDF and safety checks (run on the staged copy and on the built copy: both PASS)
9 pages in NZ and in AU, **portrait throughout** (612 × 792 on every page), no blank page; PDF title "Household Spending Capacity Check — OffGrid056" with no legacy code; the approved savings wording (and none of the old wording); the four approved planning positions with the "not levels, ratings or financial assessments" statement; the financial note **exactly once**; emergency block first and disclaimer last, each once; **no extra safety block** (no electrical, fire/smoke, carbon-monoxide, gas, generator, solid-fuel or water block); no price, currency, percentage or legacy wording; the Where Next sequence exactly as approved with the Advanced roadmap labelled a later-stage option; NZ and AU worksheet bodies identical (3,955 characters each); NZ carries 111 and AU carries 000/112, neither carries the other's wording. HTML-draft scans also pass: price 0, Bucket C 0, market, safety, legacy-language and OG-26 overlap.

## 7 · Staged manifest diff (the currently deployed tree vs the staged build; build id normalised)
984 → **992** files · **added 8** · **removed 0** · existing PDFs changed **0** · changed text files **289** (58 pages + 231 payloads) · identical **695**.
- **Added 8** = the OG-03 route (`index.html`, `index.txt` and four `__next` payloads) and its two PDFs. Nothing else is added.
- **Every one of the 289 changed text files is attributed at content level (NO UNEXPLAINED DIFFERENCE)** with the same method as the earlier releases: each changed page differs only by (a) OG-03 appearing in the library data (289 files), including the new listing card and the new downloads row removed as whole blocks, (b) a number that rose by one with it (the downloads tabs "All 45 → 46" and "General 9 → 10" and the "46 files" status, and list indexes), (c) one inserted entry in the library's item-index list (later indexes shifted by one), or (d) Next.js build-markup noise. These are the same pages that changed when OG-01 was added: the home page, library, downloads, progress, saved and every resource page that embeds the resource listing.

## 8 · Validation
**736 tests passing** · lint clean · typecheck clean · `import:verify-prep` verified (OG-03 NZ and AU included) · `import:verify-build` verified (**24 records · 48 market files · 0 broken internal links**, both OG-03 PDFs 9 pages with the correct title) · 24 / 24 ready, 0 market problems, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · price, numeric, market and safety validation and the legacy-language scan pass · route-policy and demo/protected tests pass · staged-build QA ALL PASS · release QA ALL PASS (all 46 already-deployed PDFs byte-identical to the deployed bytes in `out/` and `private-assets/`; only OG-03's two PDFs are new).
One test changed: `classification-complete.test.ts` pinned "23 protected resources"; it now says 24 (the 23 live plus OG-03) and also pins OG-03's component. Git changes this stage: that test, this report and the registers; no config change.

## 9 · Live state — confirmed unchanged
Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb` at 100%; 23 live protected resources and 46 market files (the staged counts above exist only in this working tree and the local build); no deployment was run; unauthenticated probe: 41 of 41 routes redirect to Cloudflare Access.

## 10 · Readiness for deployment
**Ready on your explicit approval.** What deployment would do: one `wrangler deploy` of the 992-file build as a new Worker version; the existing 984 files re-upload as usual with a new build id; the new content is the OG-03 page set and two PDFs; the library, home, downloads and listing pages show OG-03 once. Rollback: the current `e63141a1…` (then `7de9641f…` and the older versions), retained. Post-deploy QA would repeat the Stage 9.74 set: Access probe, uploaded-tree hashes (the two PDFs byte-identical), routes, counts (24 / 48 / 0 broken links / Bucket C 0), full validation. Not deployed.
