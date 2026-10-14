# Stage 10.23B — OG-30 Long-Term Direction Planner: cover insertion, NZ/AU final render and visual QA

**For owner review only.** No stable ID (res-1030 stays SUGGESTED / UNASSIGNED), no protected record, no staging, no deployment. OG-30 stays Not started. Live is unchanged: **33 protected resources · 66 market files · Planning Tools 12 · Downloads 55 · My Progress 58 · 0 broken links** · Worker `4b864fb7-6736-46e5-b918-39f92ab37128` (confirmed 100%) · rollback `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`. Migration: Deployed 33 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 10 = 45.

## 1. Cover asset
1. Source: `Downloads\OG30_Long-Term-Direction-Planner_Cover_v1.png` (an identical copy exists as `Family Planning by the Garden Window (1).png`; same bytes, so no ambiguity about which file).
2. 1536 × 1024 PNG, 2,436,427 bytes, SHA-256 `23DAB88CEBD189911CA0FEDAB0B8FA4381AC157C20FF07644B805DABD1FFF0FD`. Prep copy (`workspace/prep/OG-30/assets/long-term-direction-planner-cover.png`) is byte-identical.
3. Inspected: a couple and their teenage child at a table by a large window, writing in notebooks with planning papers; hills and a garden outside; **no text, logos, OG code, solar, batteries, tools or survival imagery**. Garden and raised beds are incidental background, in line with the approved concept.
4. Layout: full-width photo band on the dark brand cover with the template title in warm white above it; brand band below. The legacy Week 4 artwork is absent from HTML and PDFs.

## 2. Rendered files (git-ignored, `workspace/prep/OG-30/`)
5. NZ PDF: 4,075,119 bytes, SHA-256 `eca257980ea8b3cd439a0947f07d2e42e5aa18d7f1592452b941a3f5cd1cbcbe`.
6. AU PDF: 4,074,987 bytes, SHA-256 `a29643746bbeecdcf0229426de1928b930cf36e4796c0b982c6782a0c9d413ff`.
7. **9 pages each**, US Letter portrait. (The 10.23A draft did not state a page count; the Notes section now sits on its own page, page 8, with 16 lines.)
8. PDF title: "Long-Term Direction Planner — OffGrid056".
9. Brand fonts embedded (copied into the prep folder; `import:verify-prep` passes).

## 3. Page-by-page QA (NZ and AU viewed; no clipping, no orphan headings, no stranded fields)
10. p1 cover: title once, exact subtitle "…where you want your household’s resilience plans to go next." (curly apostrophe), chip "General · Advanced Future", label, strapline; all three faces and the garden view intact.
11. p2: emergency-contact box, What This Worksheet Is For with How to Use It, Where We Are Now (six fields).
12. p3: Directions We Are Considering, Direction A.
13. p4: Directions B and C.
14. p5: Our Chosen Direction (five fields).
15. p6: Our First Project (six fields).
16. p7: When We Will Revisit It (four fields).
17. p8: Notes (16 lines).
18. p9: Where Next (three rows), Where You Are Now, general disclaimer.
19. Page numbers 2 to 9 present; running header on every inside page; NZ/AU differ only in the standing emergency-contact and disclaimer wording.

## 4. Copy locks
20. Body copy unchanged from Stage 10.23A. **3,437 characters each market** (identical). HTML **13,028 bytes each**, byte-identical; the increase from 12,371 is the cover image tag and the Notes page wrapper, not copy.
21. Subtitle exact; chip exact; description exact (see metadata).
22. Direction A, B and C each carry a name field and five prompts; no Direction D; no scores or ranking.
23. Where Next prints exactly three rows (Before 90-Day Implementation Roadmap · Next Off-Grid System Architecture Planner · Also useful 3-Tier Budget Planner); res-1021 is metadata only and not printed.
24. Standing blocks only: emergency-contact and general-disclaimer; technical safety triggers 0.

## 5. Metadata
25. Title Long-Term Direction Planner; slug `long-term-direction-planner`; general / advanced-future / planning / worksheet; intermediate; 30 minutes.
26. Related order res-1027, res-1512, res-1026, res-1021.
27. Planning Tools: **NO** (collections empty; live stays 12).
28. `coverStatus` now "OWNER-SUPPLIED 2026-10-14 (Stage 10.23B)" with the cover hash.
29. Governance to apply at staging (unchanged): status draft; publicationStatus approved; releaseChannel private-preview; accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED.

## 6. Detectors and automated QA
30. Draft QA (`workspace/og30-draft-qa.mts`): **ALL PASS** after the cover and layout edits.
31. PDF QA (`workspace/og30-pdfqa.mjs`): **ALL PASS** for NZ and AU (page count, title, cover embedded at 1536 × 1024, subtitle, sections, standing blocks, Where Next, page numbers, body identical across markets).
32. Numeric Bucket C **0** (two candidates: the live title "90-Day Implementation Roadmap" and the disclaimer block). Price, payback, warranty, payment, survival, supply, emergency-period, storage, target-label, regulatory, legacy-language and content-flag findings all **0**. No digits in the body.
33. No detector weakened, no exemption, no registry entry added.

## 7. Related cards and slug
34. Engine check (real `lib/related.ts`, unchanged): the four curated links give exactly four "Linked by us" cards, no automatic fill.
35. Slug simulation (`workspace/og30-slugsim.mts`, hypothetical record at its true file-name position): **0 existing pages change** with `long-term-direction-planner`. Control `future-direction-planner` would change 3 (res-0008, res-1510, res-0006).

## 8. Tests and repo
36. Focused `tests/unit/og-30-draft.test.ts`: **17 passed, exit 0**.
37. Full default-timeout suite: **63 files, 1,706 tests, exit 0**.
38. Lint exit 0 (0 errors, 66 existing warnings). Typecheck exit 0. `import:verify-prep` exit 0. `import:verify-build` exit 0 (33 records · 66 market files · 0 broken links).
39. Committed: the OG-30 cover updates in `approved-copy.json` and `metadata-review.json`, `og-30-draft.test.ts` and this report. Git-ignored: generator, QA scripts, prep HTML/PDF/cover, screenshots.

## 9. Not done (as instructed)
40. Stable ID NO · protected record NO · Planning Tools NO · staging NO · deployment NO · entitlement, OS handoff, Cloudflare, Supabase, Railway and unrelated resources untouched · Worker unchanged.

## 10. Owner decisions required next
41. Approve the cover as used (photo band layout).
42. Approve the NZ PDF.
43. Approve the AU PDF.
44. Approve assigning stable ID res-1030.
45. Approve the staging metadata (section 5).
46. Approve controlled staging (Stage 10.23C), then separately deployment (Stage 10.23D).

## 11. Next stage
**Stage 10.23C — OG-30 stable ID and controlled staging**, only after the approvals above. Not started.
