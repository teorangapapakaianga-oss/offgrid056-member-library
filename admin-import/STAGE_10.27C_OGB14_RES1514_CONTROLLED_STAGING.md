# Stage 10.27C — OG-B14 Local Support Network Planner: stable ID, protected record and controlled staging

**Staged, NOT deployed.** `res-1514` is assigned, the protected record and the two approved Stage 10.27B-R1 PDFs are staged in `private-assets` for the preview build. The live site is unchanged. OG-B14 is recorded as **STAGED**, not LIVE.

## 1. Identity
1. `res-1514` availability: unused before assignment (no private record, demo record, review-config entry, register row, index entry or route used it; the only mentions were the earlier reports and tests that asserted "no ID yet", which this stage replaced).
2. Assigned stable ID: **res-1514**. 3. Title: **Local Support Network Planner**. 4. Slug: `local-support-network-planner`. 5. Canonical route: `/resources/local-support-network-planner/`.
6. Protected record: `private-assets/data-resources/local-support-network-planner.private.json` (SHA-256 `fa4ba4ab…6290`; git-ignored). 7. Schema validation: passes the strict `ResourceSchema` (publication and classification tests, `import:verify-prep`, build).

## 2. Final metadata
8. general / resilience-planning / planning / worksheet; beginner; 30 minutes; description exact ("A practical worksheet to help your household identify trusted local support, record what you may be able to offer, and note where you may want help from others."); tags none; featured and premium false; downloadable; completion available.
9. publicationStatus: **approved** (`status` stays the technical build gate: draft; `releaseChannel` private-preview). 10. reviewStatus (canonical index): NEEDS_ENTITLEMENT_DECISION + NEEDS_METADATA. 11. accessTier: UNDEFINED_OWNER_DECISION. 12. entitlementRequirement: UNDEFINED_OWNER_DECISION. 13. recommendationEligible: false. 14. handoffStatus: INACTIVE. 15. approvedHandoffRoute: null. 16. entitlementContractStatus: NOT_APPROVED.
17. Planning Tools membership: **NO** (collections empty); Planning Tools stays 12. Nothing invented.
18. `res-0009` Household Contacts Template: demo placeholder, unchanged (its built page text is identical to the live baseline). 19. `res-1502`, `res-1028`, `res-1006` and `res-1024` pages: visible text identical to the live baseline.

## 3. Cover and PDFs
20. Cover: **OGB14_COVER_v2** (owner-supplied, title-free, 1055 × 1491 portrait; prep PNG SHA-256 `6DB3ECFC…92CA`, source `69813CE2…0442`). Its hash was re-verified before staging; the staging script refuses any other cover.
21. Approved NZ SHA-256: `56F1B2A872E67F2F564EC59838A9FE0502CFC10364D99C7ABDD6EC07C780211A`. 22. Approved AU SHA-256: `B8DA6FD4833A210CF8D97D39135B81482DCD3C4DFDE6418844CF5C9641751AE8`. Both recomputed from the prep folder and matched the Stage 10.27B-R1 report before staging.
23. Staged NZ: `private-assets/resources/local-support-network-planner.NZ.pdf` (1,567,660 bytes). 24. Staged AU: `…AU.pdf` (1,567,416 bytes). 25. Byte-identical: **YES** (both; also identical inside the staged build).
26. NZ pages: **7**. 27. AU pages: **7**. 28. PDF title "Local Support Network Planner — OffGrid056" (both). 29. Market parity: body identical (3,397 characters); only the standing emergency-contact and disclaimer blocks differ.

## 4. Related
30. Metadata order: res-1502 Household Contacts Sheet · res-1028 Household Responsibility Roster · res-1006 Emergency Readiness Checklist · res-1024 Professional Support Planner (titles checked against the protected records before staging). The printed Where Next shows three rows; res-1024 is metadata only.
31. Staged page: exactly **4** "Linked by us" cards in that order, no duplicates, every link resolves. 32. Automatic fill suppressed: **YES**; `lib/related.ts` unchanged.
33. Slug side-effect: **0 existing pages change** (hard gate; proven with the hypothetical record earlier and again with the real record in the pool, both now permanent tests).

## 5. Publication display
34. Preview badge on the resource page. 35. Tooltip exact ("Approved resource in the protected OffGrid056 preview."), on all 36 protected detail pages. 36. Draft badges: **0**. 37. Listing publication badges: **0**. 38. Canonical route builds. 39. NZ and AU downloads linked to the byte-identical PDFs. 40. Resource page shows title, description, Foundation General, Type Worksheet, Preview, 30 min, Beginner, Planning, four related cards; no Planning Tools label, no OG-B14 text, not listed in Planning Tools or Start Here.

## 6. Governance detectors (no exemptions, no detector change)
41. Technical safety 0. 42. Regulatory unresolved 0. 43. Numeric Bucket C 0. 44. Price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage, target-label all 0. 45. Legacy-language 0. 46. Content flags 0. 47. Privacy: no third-party address, asset, supply, vulnerability, radio, drill or distance field.

## 7. Counts
Staged build (two clean builds, identical apart from the build id; 1,088 files): 48. protected **36**. 49. market files **72**. 50. Planning Tools **12**. 51. Downloads **58**. 52. My Progress **61**. 53. broken links **0**. 54. Bucket C **0**. These came from the actual build and match the anticipated figures. The resource appears automatically only in the Library, Downloads and My Progress listings.
Live (unchanged, baseline = the deployed Stage 10.24D build): 55. protected **35**. 56. market files **70**. 57. Planning Tools **12**. 58. Downloads **57**. 59. My Progress **60**. 60. Worker `baf17c92-4ccf-45fb-aefe-f1ae5565eea6` (100%, confirmed). 61. Worker changed: **NO**.

## 8. Existing-asset integrity
62. Diff against the live baseline: 8 files added (the new page files and two PDFs), 0 removed, 349 existing files changed, 731 identical. Every changed hunk is attributed (listing entries for the new resource, count shifts, the new resource's search-index entry); one hunk was unclassified by the tool and I verified it structurally: the Library lists 62 links against 61, the 61 earlier cards are identical and in the same order, and the new card appears once. No related-card set on any existing page changed.
63. Existing PDFs byte-identical; static assets, route policy, demo mappings and non-library pages unchanged. 64. Staged-build QA (`workspace/staged-qa-b14.mjs`): ALL PASS.

## 9. Unauthenticated protection
Not applicable to a staged build: nothing is deployed, so there is no staged protected route to probe, and no authenticated owner session exists here; I did not fabricate either. The live deployment's Cloudflare Access is untouched.

## 10. Registers, state and repo
CURRENT_STATUS, NEXT_ACTIONS, RESOURCE_REGISTER, the canonical index (json and md) and the review config all say OG-B14 / res-1514 is STAGED, NOT DEPLOYED, live 35 · 70. Migration totals: **Deployed 35 · Staged 1 (OG-B14) · Prepared 0 · Blocked 1 · Merged 1 · Archived 2 · Not started 5 = 45**. Remaining not started: OG-B01, OG-B03, OG-B11, OG-B13, OG-B15. Deployment performed: **NO**. Repo changes: review-config `migrationState`, canonical index, three registers, test updates for the staged state, this report. Git-ignored and not committed: the protected record, the two staged PDFs, generators, QA scripts, build snapshots.

## 11. Final verification
65. Full default-timeout suite: **65 files, 1,755 tests, exit 0**. Lint: **exit 0** (0 errors; 100 warnings, all in git-ignored scratch scripts). Typecheck: **exit 0**. `import:verify-prep`: **exit 0**. `import:verify-build`: **exit 0**. Worker `baf17c92-4ccf-45fb-aefe-f1ae5565eea6` re-checked at 100%.

## 12. Owner decision
Approve **Stage 10.27D — RES-1514 production deployment + live verification** (uploads the exact validated staged build; rollback target `baf17c92-4ccf-45fb-aefe-f1ae5565eea6`). No other decision is needed for deployment.
