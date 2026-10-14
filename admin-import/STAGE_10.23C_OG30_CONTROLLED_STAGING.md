# Stage 10.23C — OG-30 Long-Term Direction Planner: stable ID, protected record and controlled staging

**Staged, NOT deployed.** `res-1030` is assigned, the protected record and the two approved Stage 10.23B PDFs are staged in `private-assets` for the preview build. The live site is unchanged. OG-30 is recorded as **STAGED**, not LIVE.

## 1. Identity
1. `res-1030` availability: unused before assignment (no private record, no demo record, no review-config, register, index or route used it; the only mentions were the audit's "unassigned" notes and the "no ID yet" assertions this stage replaced).
2. Assigned stable ID: **res-1030**. 3. Title: **Long-Term Direction Planner**. 4. Slug: `long-term-direction-planner`. 5. Canonical route: `/resources/long-term-direction-planner/`.
6. Protected record: `private-assets/data-resources/long-term-direction-planner.private.json` (1,143 bytes, SHA-256 `45ac9e77…bac1`; git-ignored). 7. Schema validation: passes the strict `ResourceSchema` (classification and publication tests, `import:verify-prep`, build).

## 2. Final metadata
8. general / advanced-future / planning / worksheet; intermediate; 30 minutes; description exact (owner wording); tags none; featured/premium false; downloadable.
9. publicationState (`publicationStatus`): **approved** (`status` stays the technical build gate: draft; `releaseChannel` private-preview).
10. reviewStatus (canonical index): NEEDS_ENTITLEMENT_DECISION + NEEDS_METADATA. 11. accessTier: UNDEFINED_OWNER_DECISION. 12. entitlementRequirement: UNDEFINED_OWNER_DECISION. 13. recommendationEligible: false. 14. handoffStatus: INACTIVE. 15. approvedHandoffRoute: null. 16. entitlementContractStatus: NOT_APPROVED.
17. Planning Tools membership: **NO** (collections empty). Nothing invented.

## 3. PDFs
18. NZ prep source: `workspace/prep/OG-30/long-term-direction-planner.NZ.pdf`. 19. AU prep source: `…AU.pdf`.
20. Approved NZ SHA-256: `eca257980ea8b3cd439a0947f07d2e42e5aa18d7f1592452b941a3f5cd1cbcbe`. 21. Approved AU SHA-256: `a29643746bbeecdcf0229426de1928b930cf36e4796c0b982c6782a0c9d413ff`. Both matched the Stage 10.23B report before staging.
22. Staged NZ: `private-assets/resources/long-term-direction-planner.NZ.pdf`. 23. Staged AU: `…AU.pdf` (existing naming convention; the script refuses to overwrite).
24. Staged NZ SHA-256: `eca25798…cbcbe` (4,075,119 bytes). 25. Staged AU SHA-256: `a2964374…413ff` (4,074,987 bytes).
26. Byte-identical NZ: **YES**. 27. Byte-identical AU: **YES** (also identical inside the staged build).
28. NZ pages: **9**. 29. AU pages: **9**. 30. PDF title: "Long-Term Direction Planner — OffGrid056" (both). 31. Market parity: body identical; only the standing blocks differ. Draft QA and PDF QA ALL PASS on the prep files, which are these bytes.

## 4. Related
32. Metadata order: res-1027 (90-Day Implementation Roadmap), res-1512 (Off-Grid System Architecture Planner), res-1026 (3-Tier Budget Planner), res-1021 (Home Energy & Shelter Upgrade Plan); each title confirmed against the live record before staging. The printed PDF Where Next keeps three rows; res-1021 is metadata only.
33. Related-card result (staged page): exactly **4** "Linked by us" cards in that order, no duplicates, every internal link resolves. 34. Auto-fill suppression: **YES**, 0 automatic cards; `lib/related.ts` unchanged.
35. Slug side-effect: **0 existing pages change** (hard gate passed; control slug `future-direction-planner` would change 3). Confirmed again after the staged build: related cards on existing pages are unchanged.

## 5. Publication display
36. Preview badge: present on the resource page; tooltip exact ("Approved resource in the protected OffGrid056 preview."). 37. Tooltip: exact on all 34 protected detail pages. 38. Draft badges: **0**. 39. Incorrect listing badges: **0** (listings show no publication badge, as before). 40. Canonical route: builds and resolves (checked in the browser on a local copy of the staged build). 41. NZ download: linked, byte-identical PDF. 42. AU download: same. 43. Unresolved market: the page asks "Which market are you in?" and offers the download only after a market is chosen (existing behaviour, unchanged).
Resource page shows: title, exact description, Foundation General, Type Worksheet, Topic Planning, Intermediate, 30 min, Preview, four related cards; no Planning Tools label and no OG-30 text.

## 6. Governance detectors (prepared files, no exemptions, no detector change)
44. Technical safety **0**. 45. Regulatory candidates **0**, unresolved **0**. 46. Numeric Bucket C **0**. 47. Price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, emergency-period, storage, target-label: all **0**. 48. Legacy-language **0**. 49. Content flags **0**.

## 7. Counts
Staged build (two clean builds, byte-identical to each other, 1,072 files): 50. protected **34**. 51. market files **68**. 52. Planning Tools **12**. 53. Downloads **56** (55 → 56). 54. My Progress **59** (58 → 59). 55. broken links **0**. These came from the actual build and match the anticipated figures.
Live (unchanged): 56. protected **33**. 57. market files **66**. 58. Planning Tools **12**. 59. Downloads **55**. 60. My Progress **58**. 61. broken links **0**. 62. Worker `4b864fb7-6736-46e5-b918-39f92ab37128` (100%, confirmed). 63. Worker changed: **NO**.

## 8. Existing-asset integrity (baseline = the deployed OG-29 build)
64. Existing-page diff: 8 files added (the new resource's page files and two PDFs), 0 removed, 339 existing files changed, 725 identical. Every changed hunk is attributed: 24 listing entries for the new resource, 176 count shifts (Downloads 55 → 56 and the Worksheets filter count 17 → 18, My Progress 58 → 59, listing placeholder counters), 315 on resource pages (the new resource's search-index entry and pointer shifts), and 1 hunk the tool left unclassified, which I checked structurally: the Library listing has 60 links against 59, all 59 earlier cards are byte-identical and in the same order, and the new card appears once. No related-card set on any existing page changed.
65. Existing PDFs: all 91 earlier PDFs (66 protected + 25 demo) byte-identical. 66. Static assets: stylesheet byte-identical; all 23 JavaScript chunk names identical. Programme, Start Here, Foundations, Planning Tools, workshops, learning paths, packs, videos, suppliers and brand pages: 0 changed files. 67. Route policy and demo mappings: unchanged (demo placeholder routes still present).

## 9. Tests and checks
68. Focused OG-30 test (record, hashes, governance): pass. 69–70. Full default-timeout suite: see section 11. 71. Lint, 72. typecheck, 73. `import:verify-prep`, 74. `import:verify-build` (34 records · 68 market files · 0 broken links): see section 11.
Unauthenticated protection test: **not applicable to a staged build** (nothing is deployed, so there is no staged protected route to probe) and no authenticated owner session exists here; I did not fabricate one. The live deployment's Cloudflare Access is untouched.

## 10. Registers, state and repo
75. Register consistency: CURRENT_STATUS, NEXT_ACTIONS, RESOURCE_REGISTER, the canonical index (json and md) and the review config all say OG-30 / res-1030 is STAGED, NOT DEPLOYED, live 33 · 66. 76. Migration totals: **Deployed 33 · Staged 1 (OG-30) · Prepared 0 · Blocked 1 · Merged 1 · Not started 9 = 45**.
77. Deployment performed: **NO**.
78. Repo changes: review-config `migrationState`; canonical index json and md; the three registers; test updates for the staged state (OG-30, canonical index, registers, classification, publication and the earlier per-resource register tests); this report. Git-ignored and not committed: the protected record, the two staged PDFs, the generators, QA scripts and build snapshots.
79–80. Commit and push: see the final message.
81. Blockers: none.
Note for the classification rule: OG-30 is the second `advanced-future` resource (owner-approved in Stage 10.23A), so the classification test now expects OG-30 and OG-B12.

## 11. Final verification
69. Focused and shared staging tests (OG-30 record and hashes, canonical index, registers, classification, publication, Planning Tools, per-resource register tests): all pass. 70. Full default-timeout suite: **63 files, 1,706 tests, exit 0**. 71. Lint: **exit 0** (0 errors; the warning count rose from 66 to 72 only because of the git-ignored workspace scripts added this stage; no tracked file has a new warning). 72. Typecheck: **exit 0**. 73. `import:verify-prep`: **exit 0**. 74. `import:verify-build`: **exit 0** (34 records · 68 market files · 0 broken internal links). Worker re-checked after the run: `4b864fb7-6736-46e5-b918-39f92ab37128` at 100%.

## 12. Owner decisions required
82. (a) Approve Stage 10.23D, the controlled deployment of res-1030 (uploads the exact validated staged build; rollback target `4b864fb7-6736-46e5-b918-39f92ab37128`). (b) Nothing else is pending for OG-30; entitlement and OS handoff stay undecided and inactive.
83. Recommended next stage: **Stage 10.23D — OG-30 controlled deployment + post-deploy QA**, only on your separate approval.
