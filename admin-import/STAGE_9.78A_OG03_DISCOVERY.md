# Stage 9.78A — OG-03 discovery check and navigation correction

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Staged and verified. NOT deployed.** Live is unchanged: 23 protected resources · 46 market files · Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb` at 100% (rollback chain retained; 41 of 41 unauthenticated routes still redirect to Cloudflare Access). No approved PDF, copy, safety block, route policy or related link was changed.

## 1 · Why OG-03 was absent from Planning Tools
The Planning Tools page lists exactly the resources whose `collections` include `planning-tools` (`app/planning-tools/page.tsx`; stated as the membership rule in `docs/ARCHITECTURE.md` §1: "Planning Tools — `collections` includes `planning-tools`"). OG-03 was staged with `collections: none` (the metadata locked in Stage 9.76 / 9.77), so it was never eligible. **This is not specific to OG-03:** no protected resource carries that collection. Before this stage the page listed only four demo placeholders (`res-0005`, `0006`, `0008`, `0009`); the other general planning resources — the 3-Tier Budget Planner, 90-Day Implementation Roadmap and its Advanced version, Project Support Brief Template, Resilience Product Wishlist and Monthly Planning Challenge Template — are absent from it too.

## 2 · How members navigate to Planning & Implementation
**They cannot, by component.** `programComponent` is stored on every record but is read by **no page, filter, search field, navigation item or listing** (it exists only in the schema and constants). There is no "Planning & Implementation" page. What exists:
- **Sidebar / drawer:** *Library*: Dashboard, Start Here, All Resources · *Five Foundations*: Air, Water, Shelter, Food, Energy · *Tools & Programme*: **Planning Tools**, Learning Paths, 30-Day Programme, Resource Packs, Videos & Tutorials, Member Downloads · *Directory* · *My Library*: Saved, My Progress. The mobile bar has Home, Library, Programme, Saved.
- **Planning Tools** is the closest "planning area": its page header reads "Planners, templates and assessments that work across every foundation".
- **A `general` resource has no foundation page** (only the five foundations do; `general` is "a filter value, not a sixth foundation"). Its routes are: All Resources (filters: Foundation incl. General, Type, Difficulty, Time, Status; plus search over title, tags, category, foundation, type and description), the dashboard, Member Downloads, collections, related links, learning paths and the programme.
So before this stage OG-03 was reachable through All Resources (filter Foundation = General, Type = Worksheet, or search), the dashboard and Member Downloads, and as an automatic "same topic" suggestion on its planning neighbours' pages — but **not through any planning area.**

## 3 · The correction (the smallest that uses existing architecture)
**OG-03's `collections` is now `["planning-tools"]`.** That is an existing, documented collection (`COLLECTION_IDS = ["start-here", "planning-tools"]`); **no new collection, category, filter or taxonomy was introduced** and none is needed, so there was no reason to report first. Only OG-03 changed.
Exact changes:
1. `private-assets/data-resources/household-spending-capacity-check.private.json` (git-ignored): `collections: []` → `["planning-tools"]`. **This is the only file that changed in `private-assets/`** (73 files before and after; every other hash identical; both PDFs still byte-identical to the approved renders: NZ `D0197F05…58ADB65`, AU `4811FD4E…01A9C`).
2. `admin-import/config/metadata-review.json` (OG-03 entry): `collections` and a recorded status "owner-directed navigation correction (Stage 9.78A)"; journey-role note.
3. `tests/unit/og-03-draft.test.ts`: expects the collection, plus three new tests (existing collection only, no new taxonomy, six related links and the Advanced roadmap only in the PDF).
Not touched: the approved PDFs, copy, safety blocks, `route-policy.json`, the six related links (`res-1001, 1002, 1022, 1026, 1027, 1025`; `res-1510` is still named only in the PDFs' Where Next table and is not in the record's related list), code or any other record.

## 4 · Result in the built site
- **Planning Tools** now lists its four demo placeholders **plus OG-03, exactly once** (5 entries; nothing else added or removed). The page links to OG-03, and OG-03's page carries the sidebar link back to `/planning-tools/`.
- OG-03 is **not** in Start Here (that remains the entry-assessment collection) and not on any of the five foundation pages; it is still listed once in the library, on the home page and in Member Downloads.
- **Data-level proof** (decoding the embedded payloads): Planning Tools 4 → 5 entries, library 49 → 50, downloads 45 → 46; in each, the new list is the old list plus `res-1003`, and **every existing entry is deep-equal**.
- All earlier checks still hold: demo/protected separation and route-policy regression ALL PASS (the demo placeholders appear in the same 79 files; days 2/9/11/13/29 still point at the demo placeholders; no demo card in any listing); all 46 already-deployed PDFs are byte-identical to the deployed bytes.

## 5 · Staged manifest diff (deployed tree → staged build)
984 → **992** files · **added 8** (the OG-03 page set and its two PDFs) · removed 0 · existing PDFs changed 0 · changed text files **294** (59 pages + 235 payloads) · identical 690. Every difference is attributed: OG-03 appearing in the listing data and in its own card/row, numbers that rose by one, an inserted entry in item-index lists, build noise, and — for the Planning Tools payload files — the React Server Component row renumbering that follows the page gaining one card, proved at data level as above. (One more file than the 9.78 staging diff: the Planning Tools page.)

## 6 · Validation
**739 tests passing** (736 + 3) · lint clean · typecheck clean · `import:verify-prep` and `import:verify-build` verified (**24 records · 48 market files · 0 broken links**; both OG-03 PDFs 9 pages) · 24 / 24 ready, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · OG-03 staged-build QA, release/route-policy QA, draft scans and PDF QA (built and staged copies) all PASS.

## 7 · A wider finding for your decision (not changed, outside "only a necessary correction")
The same gap affects the other protected planning tools. After this stage Planning Tools shows **one** protected resource (OG-03) beside the demo placeholders, while OG-26 3-Tier Budget Planner, OG-27 90-Day Implementation Roadmap, OG-B10 its Advanced version, OG-25 Project Support Brief Template, OG-22 Resilience Product Wishlist and OG-B04 Monthly Planning Challenge Template — the rest of the Planning & Implementation family — are not listed there. Giving them `planning-tools` is the same one-line, record-only change (no PDF or copy change) but it alters **live** records, so it would ship in a deployment. Decide: (a) tag those six too, so the page shows the whole planning journey (my recommendation); (b) leave them and treat OG-03 as the only tagged one; or (c) also add a member-facing way to browse by programme component, which would be a new navigation feature (a new page or filter), not an existing mechanism, and is not proposed here.

## 8 · Readiness to deploy
**Ready on your explicit approval.** A deployment would carry the corrected OG-03 record (one extra collection value) with the rest of the OG-03 release; counts after deploy would be 24 / 48 / 0 broken links / Bucket C 0 and 992 files. Rollback stays `e63141a1…` then `7de9641f…` and older. Not deployed.
