# Stage 9.92 — OG-06 owner approval, PDF render and visual QA

Resource: **Emergency Readiness Checklist** (narrowed). Status draft. Nothing staged, nothing deployed, registers and migration counts unchanged.

## Approved and recorded
Title, NARROW disposition, metadata (general / resilience-emergency / planning / checklist / beginner / 20 minutes / draft / no collections), description, twelve checklist areas, four location fields, meeting-place wording, related resources (res-1002, 1004, 1008, 1011, 1013, 1019; res-1015 not added), safety dispositions (electrical, food-safety, fire all REMOVED, owner-approved 2026-10-08) and the shared cover. Only `metadata-review.json` changed; the copy is identical to Stage 9.91.

## Return items
1. **NZ PDF:** rendered, 8 pages, 251,985 bytes. All 28 checks pass.
2. **AU PDF:** rendered, 8 pages, 251,778 bytes. All 28 checks pass.
3. **SHA-256 (full):**
   - NZ `6a892f0dcb8afba650418f381d97c6440bc8a5e2c22097cfd71af7ae1b98b171`
   - AU `dd0cf256810ffde0cc5c1a09ec5e934699ea2c890b0f3b2d6f4295a2358f6aba`
4. **Page count:** 8 in both markets.
5. **Orientation:** portrait, MediaBox 612 × 792 on every page.
6. **Cover QA:** shared OffGrid056 cover, house image in frame, "General · Planning" chip, title "Emergency Readiness Checklist", no dark shadow panel, no legacy code. Identical NZ/AU.
7. **Checklist usability:** twelve tick boxes in three groups (p3: Water and Food, Health; p4: Light/Warmth/Staying in Touch, People and Paperwork). Boxes are large, each item sits on its own band, no group split across pages, no orphan headings.
8. **Notes space:** every group has two full-width writing bands; Step 3 has 3 + 2 + 1 + 3. No space was reduced.
9. **Location fields:** four labels exactly as approved, two writing bands each, helper text on the first and last.
10. **Meeting place:** approved wording exact; two-band writing area on page 5.
11. **Where Next order:** Home Resilience Scorecard, Household Risk Identifier (before this); Property Type Review (next); Water Storage Calculator, 30-Day Pantry Builder, Battery Backup Planner, Healthy Home Air Audit (when you want to go further). res-1015 absent.
12. **PDF metadata:** title "Emergency Readiness Checklist — OffGrid056", producer and creation date present, no legacy code in the title.
13. **NZ/AU separation:** NZ has only 111 / Civil Defence (NEMA) / "licensed electrical worker or licensed or certifying gasfitter"; AU has only 000 / 112 / 106 TTY / SES / "licensed electrician or licensed gasfitter". The body (4,298 characters) is identical across markets.
14. **Safety:** standing blocks only. The emergency-contact block is first on page 2 and the general-disclaimer is last on page 8, each once. No technical block. The only gas/wiring wording is in the standing disclaimer.
15. **Numeric / detectors on rendered text:** Bucket C 0 (one D_NOT_A_CLAIM: "30-Day" in a resource name), price claims 0, no quantity, duration or emergency-period figures, safety exposure none in the body. Whole live library re-scan: 433 candidates across 26 resources, Bucket C 0. Detectors were not weakened. The PDF scan excludes the letter-spaced cover brand line ("O F F G R I D 0 5 6") and the two standing blocks, which are fixed safety text.
16. **Legacy language:** none. No 72-hour wording, no OG code, no Week/Day/Skool/pillar/Kiwi/EECA, no currency.
17. **Temporary `res-1006` label:** appeared only in internal, git-ignored prep or audit output: `workspace/prep/prep-report.json` (generated), `workspace/reports/programme-audit.json` and `STAGE_9.5_PROGRAMME_AUDIT.md` (old Stage 9.5 proposals). One tracked sentence in the Stage 9.91 report was neutralised in this stage. It is absent from both PDFs, their metadata, every config, `private-assets`, `out/`, routes and registers. It is not assigned. The real ID is assigned only at staging.
18. **Tests:** 995 passed (44 files).
19. **Lint exit code:** 0.
20. **Typecheck exit code:** 0.
21. **Bucket C:** 0 (live library and OG-06 PDFs). Also: full test run exit 0, `import:verify-prep` exit 0 and includes OG-06 AU and NZ.
22. **Readiness to stage OG-06:** ready subject to your approval. Nothing outstanding from QA. Staging needs a separate instruction.

## Observation for the owner (not a defect)
Page 2 and the last page are about half empty because each step starts on its own page and the standing blocks sit at the ends. This keeps the writing areas uncluttered, so I left it.

Live state unchanged: Worker `2fb0663d-a7da-4acf-ba4c-957886b21631`, 25 protected resources, 50 market files, rollback `65437c37-b731-4851-b67e-5b0fae79fe12`.
