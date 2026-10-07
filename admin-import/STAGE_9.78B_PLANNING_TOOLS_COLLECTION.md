# Stage 9.78B — Complete the Planning Tools collection

**Date:** 7 October 2026 · **Status:** STAGED, NOT DEPLOYED. Live is unchanged: 23 protected resources, 46 market files, Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb` (100%), rollback chain `7de9641f…` → `db2fd12a…` → `fa23ec74…` → `1922f7ba…`.

A listing correction only. No new collection, no navigation feature, no change to PDFs, member copy, safety blocks, route policy, titles, Program Components or related links.

## What changed

1. **Six protected resources gained the existing `planning-tools` collection** (OG-03 already had it from 9.78A). `collections: ["planning-tools"]` only; nothing else on any record changed.
2. **The protected Planning Tools page hides demo placeholders** (`lib/content/collection-rules.ts`, `app/planning-tools/page.tsx`, `isPrivatePreview()` in `lib/content/repository.ts`). The rule applies in the private preview only; the public demo build still lists them. No demo resource, file or route was deleted or edited.
3. Tests: `tests/unit/planning-tools-collection.test.ts` (11). `admin-import/config/metadata-review.json` records the owner direction for each entry.

## Findings

**1. The four demo placeholders removed from protected Planning Tools**

| id | title |
|---|---|
| res-0005 | Household Resilience Assessment |
| res-0006 | Build Your First 30-Day Action Plan |
| res-0008 | 30-Day Action Planner |
| res-0009 | Household Contacts Template |

(res-0007 was already hidden as OG-01's separated demo.) All four still resolve on their own routes (`/resources/<slug>/`), are still named by the programme days, workshop and demo resources that reference them, and are still listed in Start Here and the library where they were listed before (outside this stage's scope).

**2. Protected resources now in Planning Tools (each exactly once)**

| code | id | title | Program Component |
|---|---|---|---|
| OG-03 | res-1003 | Household Spending Capacity Check | planning-implementation |
| OG-22 | res-1022 | Resilience Product Wishlist | resilience-planning |
| OG-25 | res-1025 | Project Support Brief Template | planning-implementation |
| OG-26 | res-1026 | 3-Tier Budget Planner | planning-implementation |
| OG-27 | res-1027 | 90-Day Implementation Roadmap | planning-implementation |
| OG-B04 | res-1504 | Monthly Planning Challenge Template | planning-implementation |
| OG-B10 | res-1510 | 90-Day Implementation Roadmap (Advanced) | planning-implementation |

**3. Final Planning Tools count: 7** (was 4, all demo placeholders).

**4. Program Components unchanged** for every resource in the library (deep-equal against the deployed tree). OG-22 stays `resilience-planning`.

**5. PDFs byte-identical.** All 71 PDFs in the deployed tree and all 73 in the 9.78A staged build compare equal in `out/` (0 differ); the 46 deployed market PDFs are unchanged; the only new PDFs are OG-03's two approved files. The 9.78B build changed 0 PDFs relative to 9.78A.

**6. Staged manifest diff.**
- vs the 9.78A staged build: 992 files both, 0 added, 0 removed, 294 text files changed. Attribution: 289 differ only in a `collections` key (added to the six resources' summaries and records, including the payload back-reference to it); 5 are the Planning Tools page set. 0 unexplained (`workspace/explain-9-78b.mts`).
- vs the deployed tree: 984 → 992 files, 8 added (OG-03's route files and two PDFs), 0 removed.

**7. Tests: 750 passing** (34 files; 739 → 750 with the 11 new). Lint clean, typecheck clean.

**8. Bucket C: 0.**

**9. Live baseline confirmed.** `wrangler deployments list`: Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb` at 100%. The unauthenticated Access probe redirected 41 of 41 routes to Cloudflare Access; none answered 200.

**10. Readiness to deploy OG-03 as protected resource #24: READY, awaiting explicit owner approval.** Staged build verified: 24 records, 48 market files, 0 broken links; the demo and programme routes are intact. `rollback` = `e63141a1…` (current live), then the existing chain.

## QA performed (all pass)

- OG-03 appears exactly once; each of the six added resources appears exactly once (page link and data); no demo placeholder in protected Planning Tools (data or links); every entry is a real resource; all five payload files agree (`workspace/qa-planning-tools.mts`).
- Library: only OG-03 added, nothing removed; exactly six summaries changed, each only in `collections`; no other collection assignment changed anywhere.
- Start Here: 8 entries before and after, each deep-equal. Programme days 2, 9, 11, 13, 29 still reference the demo placeholders. One route per resource; no new `demo-` route; no protected/demo collision; `route-policy.json` untouched.
- `import:verify-prep` all files verified; `import:verify-build` 24 / 48 / 0; regression: 0 content, price and safety-removal findings; release QA: all PASS (40 candidate PDFs byte-identical, 46 deployed PDFs byte-identical).

## Candidates reported, NOT added

Other protected resources that are not in Planning Tools under the current taxonomy. None was added; each needs an owner decision.

- **OG-01 Home Resilience Scorecard** and **OG-02** — Start Here assessments (`resilience-planning`); they are already in Start Here and are assessments rather than planning tools in the owner's list.
- **OG-B12** — a general planner, `advanced-future`; a later-stage resource.

## Deferred

Program Component browsing / filtering remains an unbuilt owner decision. Not built in this stage.
