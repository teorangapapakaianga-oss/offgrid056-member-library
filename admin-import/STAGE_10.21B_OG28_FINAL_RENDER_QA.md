# Stage 10.21B — OG-28 final render and visual QA: HOLD — COVER ASSET BLOCKER

**No final PDF was rendered.** No owner-supplied OG-28 cover image exists, so the render stops before the final PDF, as the brief requires. No stable ID, no protected record, no staging, no deployment. Live is unchanged: **31 protected resources · 62 market files · Planning Tools 10 · Downloads 53 · My Progress 56 · 0 broken links** · Worker `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`.

## 1. COVER_ASSET_BLOCKER
- Searched the repository workspace (`workspace/cover-assets`, `workspace/prep`, `workspace/pilot/assets`) and the user's Downloads, Desktop and Pictures for images changed in the last three days.
- The only plausible candidate is `C:\Users\jgate\Downloads\Sunlit Home Planning Meeting.png` (1055 x 1491, SHA-256 `6A04DA34E396793330BFCAD377BBF829EB8365CA2D16358C06E4E024EDE53068`). It is the **Professional Support Planner cover already live as res-1024** (the image is visually identical to `workspace/cover-assets/professional-support-cover.webp`). It shows two adults with plans and a clipboard, not a household responsibility chart. It was not used.
- The legacy Week 4 stand-in was not used for any deliverable.
- **File needed:** an owner-supplied OG-28 cover, ideally 1055 x 1491 (or any portrait image of that ratio), PNG, JPG or WebP, placed in `workspace/cover-assets/` (suggested name `household-responsibility-roster-cover.png`), matching the approved concept: a household around a kitchen or dining table with a paper responsibility chart or sticky notes, natural daylight, calm domestic setting, mixed ages if practical, people seen from the side or back, with no logos, uniforms, tools, medical equipment, certification cards, survival imagery, panic, robots, neon or OG code.

## 2. What was completed without the cover
- **Layout preparation (layout-only; no wording changed).** A first layout check (rendered to the session scratchpad, never to `workspace/prep` or `private-assets`) showed two accidental near-empty pages: page 3 held only "Review note:" and page 7 only "Check-in notes:" (10 pages). The cause was the writing-line height. The generator style (`workspace/add-og28-config.mts`, `.worksheet-line`) changed from 38px to 31px, which regenerated `admin-import/config/approved-copy.json` (style only) and re-prepped the HTML. Result: **8 pages in NZ and AU** with no spill, no orphaned heading and no clipped row.
- **Layout-check page results (NZ and AU, stand-in cover only; the cover page is not assessed):** p2 emergency-contact box, What This Roster Is For, How to Use It, Our Household (all four fields, Review note on the page); p3 Areas We Look After (six rows); p4 Our Responsibility Roster (eight rows, five columns); p5 Our Regular Check-In (six prompts and notes, one page); p6 If Someone Is Unavailable (five prompts); p7 Change Log and Notes (seven rows and other notes); p8 Where Next (Before Priority Lock Worksheet, Next 90-Day Implementation Roadmap, Also useful Emergency Readiness Checklist, no Later), Where You Are Now, general-disclaimer block, footer and page numbers present. No blank page. The pages that look short (p3, p6, p7) are worksheet pages with blank writing space by design.
- The cover checks (title and subtitle readability, safe crop, face and text collision, logos, print readability) and the final page-by-page QA on the real PDFs are **not done** until the cover exists.
- PDF title is set in the HTML to "Household Responsibility Roster — OffGrid056" (verified in the prepared files); it is checked on the PDFs after the final render.

## 3. NZ / AU parity (prepared files)
Body text **2,983 characters** in each market; body HTML **8,686 bytes** in each market, byte-identical. No market override. Only the standing blocks differ (emergency-contact and general-disclaimer).

## 4. Detectors on the current prepared input
`workspace/og28-draft-qa.mts`: **ALL PASS**. Technical safety triggers 0 (standing blocks only: emergency-contact, general-disclaimer); regulatory candidates 0, unresolved 0; numeric Bucket C 0; price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage and target-label 0; legacy-language 0; content flags 0. No exemption added.

## 5. Automatic related-card investigation (read-only; `lib/related.ts` unchanged)
- **Trigger rule:** the automatic fill is skipped only when a protected resource has **four or more** explicit related links (`CURATED_RELATED_MIN = 4`). OG-28 has three, so after the three curated links the engine fills up to a **limit of 6 cards** in this order: 1) same foundation AND same category ("Same topic"); 2) same learning path (OG-28 has none); 3) shared tags (OG-28 has none); 4) same foundation ("Same foundation"). Within each step the order is the repository listing order.
- **Simulation** (real engine, the 31 protected plus 26 listed demo records, as the preview build sees them; OG-28 as general / planning):
  1. res-1007 Priority Lock Worksheet — Linked by us
  2. res-1027 90-Day Implementation Roadmap — Linked by us
  3. res-1006 Emergency Readiness Checklist — Linked by us
  4. **res-1026 3-Tier Budget Planner — Same topic** (general / planning)
  5. **res-0008 30-Day Action Planner — Same topic** (general / planning, a demonstration record)
  6. **res-1510 90-Day Implementation Roadmap (Advanced) — Same topic** (general / planning)
- **Why selected:** they are the first three records, in repository order, in the general / planning category that were not already linked. res-0008 is a demonstration placeholder and res-1510 is the Advanced roadmap that sits beside res-1027; both are your call. Note that a fourth curated link would suppress all three. Nothing was changed.

## 6. Governance and counts
Prepared (not written to a record): status draft; publicationStatus approved; releaseChannel private-preview; accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED. Stable ID: **SUGGESTED / UNASSIGNED** (`res-1028`); assigned NO; protected record NO; staging NO; render of final PDFs NO; deployment NO. Planning Tools future disposition YES (live 10, expected 11).

## 7. Validation
Default-timeout full suite **61 files, 1,672 tests, all passed**; lint **0 errors** (47 existing warnings); typecheck **0**; `import:verify-prep` **0**; `import:verify-build` **0** (31 records · 62 market files · 0 broken internal links).

## 8. Owner decisions still required
1. Supply the OG-28 cover image (or approve a named image workflow). 2. Then approve a re-run of this stage to render the final NZ and AU PDFs and complete the cover and page-by-page QA. 3. Decide on the automatic related cards (accept the three above, add a fourth curated link, or ask for a rule change). 4. Later, separately: future staging metadata, stable ID assignment, staging and deployment.

## 9. Next stage
Resume **Stage 10.21B** once the cover is in `workspace/cover-assets/`. Not started further; nothing staged.
