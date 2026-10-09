# Stage 10.13 — OG-23 owner copy approval applied; STOPPED before rendering (cover asset blocker)

**No PDF was rendered.** The cover asset could not be produced through an established, approved workflow, and the brief says to stop before rendering and report the blocker in that case. Nothing was staged or deployed; no res-ID was assigned; Planning Tools is unchanged; the registers, migration counts, protected records, routes, `lib/related.ts`, the site CSS and application source (no diff), the Worker and Access are untouched.

LIVE: **29 protected resources · 58 market files · 0 broken links** · Worker `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · rollback `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28`. Migration state (unchanged): Deployed 29 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 14 = 45.

## 1. The blocker
The owner-approved cover is a new, realistic natural-light scene (a household or project owner comparing three separate supplier quote sheets at a table, with a notebook and pen; non-identifiable person; no logos, no AI look, no certification graphics, no programme wording), "using the established approved image-generation / cover-asset workflow" and with no watermarked stock image.
- **No such workflow exists in the project.** The repository holds no image-generation tooling, script, configuration or recorded procedure (searched `tools/`, `admin-import/`, `internal/`, `package.json` and the memory notes). Every prepared resource uses one of the four legacy programme cover artworks (Week 1 to Week 4, inventoried at Stage 9.2 and treated as artwork); OG-12 and OG-14 reused those. None shows supplier quotes.
- **This session has no image-generation capability**, and no existing approved image fits the concept. Drawing the scene in HTML or SVG, or reusing a stock image, would not meet the brief ("realistic", "no AI imagery", no watermarked stock), so I did not improvise a substitute.
- The prepared draft still references the old stand-in (`Week4_ActionPlanPathway_Cover.jpg`, which is also not present in the workspace's OG-23 assets folder), so a render now would print a wrong or missing cover.

**What unblocks it (the owner's choice):** (a) supply the approved cover image file (a photograph or an image made through the owner's own workflow), placed in the project for this resource; or (b) name the established workflow or tool and how it should be run from this environment; or (c) approve a stated interim image (for example an existing cover) for the render, to be replaced later. Rendering resumes immediately once one of these is settled.

## 2. Owner-approved changes applied (all independent of the cover)
- **Related resources, exact order:** Resilience Product Wishlist (`res-1022`), Project Support Brief Template (`res-1025`), 3-Tier Budget Planner (`res-1026`), 90-Day Implementation Roadmap (`res-1027`), recorded as OWNER-APPROVED 2026-10-09 (Stage 10.13); four explicit links invoke the existing curated-related rule later; `lib/related.ts` is not changed.
- **Where Next:** Before or alongside: Resilience Product Wishlist; Before or alongside: Project Support Brief Template; Also useful: 3-Tier Budget Planner; Next: 90-Day Implementation Roadmap; the approved concise descriptions; no internal IDs; no OG-24, Day 24 or Tomorrow wording.
- **Questions of my own:** kept, with more member writing space (five lines instead of three) and no added instruction.
- **Closer-look prompts:** the seven approved prompts unchanged; they are now drawn as dashed-outline prompt cards (a layout rule inside the prepared PDF HTML only) so they read as the member's own prompts, in addition to the existing sentence "A tick is a prompt for a follow-up question, not a conclusion about a supplier." This styling has not yet been checked visually, because nothing was rendered.
- **Statuses:** questions, comparison, closer-look and follow-up sections, and the related list, are recorded OWNER-APPROVED 2026-10-09 (Stage 10.13); the cover is recorded PENDING with the approved concept and this blocker; the migration note reads "COPY APPROVED, cover asset pending, NOT rendered".
- **Unchanged and re-verified:** the 15 approved questions in their five groups, the A/B/C comparison rows (exactly the ten approved), the four follow-up fields, Where You Are Now, the standing blocks, the title, the locked metadata (general / planning-implementation / planning / worksheet / beginner / 30 minutes / draft / planning-tools) and the description. Planning Tools membership is not changed (metadata only).

## 3. Checks that can be done without a render
- **Prep:** both markets publishable, standing emergency-contact and general-disclaimer blocks only, PDF title "Supplier Comparison Worksheet — OffGrid056".
- **Draft QA (NZ and AU, ALL PASS):** price 0; ordinary numeric Bucket C 0; survival, supply, emergency-period, storage-duration, target-label (forward and reverse), payback, warranty, payment, regulatory, multiplier, comparative, outcome and assurance 0; technical safety triggers 0; legacy language 0; content flags 0; market-neutral; NZ and AU body identical (4,396 characters each).
- **Live gate (29 resources / 58 files):** Bucket C **0**; payback, warranty, payment and regulatory unresolved 0; the OG-10 NZ and OG-13 AU claims still resolve narrowly through their registry entries; no new exemption.
- **Registry regression:** the six registry tests pass; neither entry was altered or broadened.

## 4. Validation (actual exit codes)
`npm run lint` **0** (0 errors, warnings only in git-ignored workspace scripts); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 54 files, **1,523 tests** (1,522 + 1 new draft test); `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 29 · market files 58 · broken links 0). Registry, claim-detector, numeric, price, target-label, reverse-target, outcome, assurance, content-flag, built-output, related-resource, register and route-separation suites are all inside the run.

## 5. Not done (blocked by the cover)
NZ and AU PDF render, every page-image visual check (layout, comparison column readability, writing space, checkbox visibility, the prompt cards, cover), PDF text and metadata verification, rendered-text detector QA and the PDF hashes. These follow the cover decision.
