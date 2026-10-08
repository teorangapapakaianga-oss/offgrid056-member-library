# Stage 9.98 — OG-07 owner approval, PDF render and visual QA

Resource: **Priority Lock Worksheet** (narrowed). Status draft. **Nothing staged, nothing deployed**; registers, migration counts and the live site are unchanged (live 26 protected · 52 market files · 0 broken links; Worker `5d88271b-6f06-4be8-9fd9-6b73fa4a002a`; rollback `2fb0663d-a7da-4acf-ba4c-957886b21631`).

## Approved and recorded
Title, NARROW, general / planning-implementation / planning / worksheet / beginner / 15 minutes / draft / collections none, the description exactly, the four-column table, the three reflection prompts, the commitment section (no witness, with the not-a-formal-agreement note), the five related resources (res-1001, 1002, 1003, 1026, 1027; not res-1004 or res-1006) and the Where Next order. The copy text is exactly as drafted in Stage 9.97; only the metadata statuses changed to OWNER-APPROVED (Stage 9.98).

**Layout-only changes after the first render** (no wording changed, no writing area shrunk): the priority-table cells were enlarged (Foundation 3 lines, First Action 4, Done By 3, line height 40 px), each reflection prompt got 3 writing lines (was 2), the commitment got 4 lines (was 3), and the closing box starts the last page so that it sits with the disclaimer (as in OG-06) instead of leaving a page that held only the disclaimer.

## Return items
1. **NZ PDF:** rendered, 8 pages, 236,655 bytes; all 31 checks pass.
2. **AU PDF:** rendered, 8 pages, 236,422 bytes; all 31 checks pass.
3. **SHA-256:** NZ `9480a6e2e7eb58223ed1ac8aee3a3a38b1850baa12f34884fa04c2799c5ac7f5`; AU `71bbc930ad86912eaece09e247ab47f7d74b8fa77d5ad7f163bbaabd77614ced`.
4. **Page count:** 8 in both markets.
5. **Orientation:** portrait, MediaBox 612 × 792 on every page.
6. **Cover:** shared OffGrid056 cover, "General · Planning" chip, title "Priority Lock Worksheet", the approved subtitle, no dark shadow panel, no legacy code; identical NZ and AU.
7. **Priority table:** page 4, columns exactly Priority, Foundation, First Action, Done By; rows 1, 2 and 3 each with generous writing lines; First Action is the widest column; the foundation key line sits under the table; no budget, cost or score column. Readable and usable.
8. **Reflection space:** page 5, three prompts with three full-width writing bands each; Step 1 on page 3 has 3, 2, 2 and 2 bands.
9. **Commitment:** page 6, "My first commitment:" with four bands, then Name or signature, Date, and the note "This is a personal planning worksheet, not a formal agreement." Uncluttered; no witness field.
10. **Signature and date:** a tall (56 px) signature band and a full-width date band; adequate.
11. **Where Next order:** Home Resilience Scorecard, Household Risk Identifier, Household Spending Capacity Check ("before this, if you have not yet"); 3-Tier Budget Planner ("Next"); 90-Day Implementation Roadmap ("Then"). Page 7.
12. **PDF metadata:** title "Priority Lock Worksheet — OffGrid056" (em dash), producer and creation date present, no legacy code.
13. **NZ/AU separation:** the body is identical (same characters in both); the standing blocks differ only: NZ has 111, 111 TXT and Civil Defence (NEMA) and the NZ tradesperson wording; AU has 000, 112, 106 TTY, SES and the AU tradesperson wording; no cross-market leakage.
14. **Safety:** emergency-contact block first on page 2 and general-disclaimer last (page 8, after the closing box), each once; no technical block; the rendered text raises no safety topic.
15. **Numeric:** Bucket C **0**; one non-claim candidate (the live title "90-Day"); the only digits are page, step and row numbers, 056 and the emergency numbers.
16. **Multiplier / comparative:** 0 and 0 on the rendered text in both markets.
17. **Legacy language:** none of Week 1, Day 7, 30-Day Programme, Asset OG-07, OG-01 to OG-06 codes, OFFGRID056.COM, Pillar, 72-hour, Resilience Score /100, budget tier, 5-pillar framework, "2–3x", "more progress than most people make in a year" (live titles aside). No OG-07 or res-id appears in the PDF text or bytes.
18. **Price:** 0 (no currency symbol, percentage, NZD or AUD).
19. **CSS / build noise:** none. A full `build:preview` with the OG-07 draft content in `approved-copy.json` gives the **same stylesheet** (`04x21r3261sq4.css`, identical bytes and name to the deployed one), the **same 23 JavaScript chunk names**, and a whole tree that is **identical to the deployed snapshot after build-id normalisation (1,008 of 1,008)**. No new rule, no removed rule, no JavaScript change. (After Stage 9.91 a single unused `.border-collapse` rule had appeared; it is already in the deployed stylesheet, and the OG-07 draft added nothing.)
20. **Tests:** 1,106 passed across 46 files; the 314-test targeted run (multiplier, survival, supply, emergency-period, built-output, register, route-separation and OG-07 draft suites) passes.
21. **Lint exit code:** 0. **Typecheck exit code:** 0. Live Bucket C: 0 (hardened rules over all 26 live resources; no performance candidate).
22. **Temporary label:** `res-1007` exists only in the generated, git-ignored prep report; it is not assigned and appears in no config, record, route, register or PDF.
23. **Readiness to stage OG-07:** ready, subject to your approval to stage and to your assignment of the resource ID. Nothing from QA is outstanding.

## Visual QA (all 16 pages viewed as images)
No clipping, overflow, orphan heading or blank page. Page 2 and page 7 are about half empty by design (each step starts on its own page and the standing blocks sit at the ends), which keeps the writing areas uncluttered. Page 8 holds the closing box and the disclaimer.

## Validation (exit codes)
lint 0 · typecheck 0 · full tests 0 (1,106) · targeted suites 0 (314) · draft QA 0 · PDF QA 0 (31 checks per market) · live-library scan 0, Bucket C 0 · `import:verify-build` 0 (records 26 · market files 52 · broken internal links 0).
