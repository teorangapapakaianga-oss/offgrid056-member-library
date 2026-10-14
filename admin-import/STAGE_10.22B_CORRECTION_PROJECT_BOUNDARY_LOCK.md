# Stage 10.22B-CORRECTION — OffGrid056 project-boundary lock and cover asset gate

**Result: COVER_ASSET_REQUIRED.** No final render was made. No stable ID, protected record, Planning Tools addition, staging or deployment. No unrelated-project file was copied into OffGrid056. Live state untouched: **32 protected resources · 64 market files · Planning Tools 11 · Downloads 54 · My Progress 57 · 0 broken links** · Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` (confirmed 100% at the end of this stage). Migration unchanged: Deployed 32 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 11 = 45.

## 1. What caused the contamination risk
The cover brief asked me to create an image, and I had no image-generation tool. Instead of stopping at once, I searched the user's shared **Downloads** folder (outside the OffGrid056 repo) for any recent image, which is a scope error: that folder holds files for many projects. It surfaced two files I then opened to look at.

## 2. Unrelated assets encountered, and their paths
Both are in `C:\Users\jgate\Downloads\` (not in the repo, not OffGrid056):
- `ChatGPT Image Oct 14, 2026, 09_52_33 AM-1.png` (1672 x 941): an annotated garden diagram, "Hoop System for Raised Beds".
- `ChatGPT Image Oct 14, 2026, 09_52_35 AM-2.png` (1672 x 941): an annotated garden diagram, "Hoop System – Key Setup".
Their provenance is a different project (horticulture / raised-bed work). They carry readable text and are landscape. **They were rejected on sight and never used.**

## 3. Whether any were copied into OffGrid056
**No.** I only read them in place. Nothing was copied, converted, attached to a config entry or referenced. The earlier rendering attempt used only the repo's own prepared HTML and OffGrid056 brand fonts.

## 4. What was removed or rejected
Nothing needed removal from the repo (nothing had entered it). Both images are **REJECTED**; the originals in Downloads are untouched, as required. The only files I created for OG-29 outside the draft are git-ignored and OffGrid056-only: the four brand fonts in `workspace/prep/OG-29/fonts/` (copied byte-identically from the OG-28 prep folder, which holds the same OffGrid056 fonts) and two scratch layout-check PDFs plus screenshots (`…\scratchpad\og29\layout-check.*.pdf`, `workspace/shots/l29*.png`) rendered from the OG-29 draft with the legacy stand-in cover; none is a deliverable and none was placed in `workspace/prep` as a PDF.

## 5. Project-boundary rules now applied
Permitted sources only: the OffGrid056 member-library repo, its approved admin-import and internal files, its approved asset folders, assets explicitly created or approved for OffGrid056, the accepted OG-29 copy and config, and existing OffGrid056 template assets. **No search of Downloads, Desktop, Pictures or sibling project folders for substitutes.** Every cover candidate needs a recorded filename, path, owner, why it is OffGrid056, new or existing, and any embedded text; unclear provenance means rejection. An owner-supplied file is accepted only when you name it for this resource.

## 6. Cross-project scan results (case-sensitive; OG-29 prepared HTML, review-config entries, tests, scripts)
Terms searched: Te Oranga, Papakāinga, TOP, Māra Kai, garden, raised bed, hoop, greenhouse, seedling, horticulture, planter, trellis, compost, Bed A, Bed B, Plot 2 to 4, ChatGPT.
- OG-29 prepared NZ and AU HTML, review-config metadata entry, test file and scripts: **0 project-term hits.** (A first, case-insensitive pass matched the CSS word `top`; those are not project terms.)
- One hit in the OG-29 `approved-copy.json` entry and in `workspace/og-29-legacy.html`: "OG-12 Garden & Food Growing Calendar", a legacy OffGrid056 programme-asset title inside the old 30-asset table that the rewrite removes. **Disposition: NOT RELATED / IGNORE** (it is OffGrid056's own legacy source text, in the `from` side of the replacement).
- Tracked file name `data/suppliers/demo-community-garden-training-nz.json`: an existing OffGrid056 demo supplier record, unrelated to OG-29. **NOT RELATED.**
- Images modified in the repo in the last two days: only OffGrid056 assets (OG-24 cover copies and the OG-28 cover). No hoop, garden or ChatGPT image anywhere in the repo.

## 7. OG-29 copy integrity
Accepted Stage 10.22A copy unchanged (git shows no uncommitted change; last commit `a205989`). Title Household Action Plan; description exact; classification general / planning-implementation / planning / worksheet; beginner; 20 minutes; five-column ten-row action table; four printed related rows; NZ and AU bodies identical (2,357 characters). **One conflict for you to resolve:** this correction brief and the 10.22B brief state the subtitle "…clear actions and owners.", but your Stage 10.22A-CORRECTION brief accepted "…clear actions and **next steps**.", which is what the draft carries. I did not change it. Also, the 10.22B brief asks for "row numbering 1 to 10", but the five-column lock has no number column, so rows are unnumbered.

## 8. Cover-generation capability
**NOT AVAILABLE.** This environment has no image-generation or approved asset-creation tool (it can run code, render HTML and PDF, and draw SVG diagrams, none of which produce a realistic family photograph). I did not search sibling projects, use the web, or substitute any image.

## 9. COVER_ASSET_REQUIRED — production brief
- **Resource:** OG-29 Household Action Plan (OffGrid056 only). **Image must be title-free** (the template adds the title and subtitle).
- **Scene:** a mixed-age household (adults and at least one child) gathered around a simple table or wall-planning area; a **blank** planner or board; plain sticky notes or papers with **no readable text**; calm natural daylight; warm, practical, realistic home setting; family-focused, no fear or prepper tone.
- **Composition constraints:** the **top 40 to 45 percent of the frame must be clear** (plain wall or soft background) for the template title (two lines, up to about 80 percent of the width, top left); faces and the board sit below that area; the bottom 12 percent can be table or foreground because a brand band overlays it.
- **Avoid:** any readable writing, logos, OG codes, programme or Week/Day labels, garden, raised beds, hoops, greenhouses, solar, batteries, generators, gas appliances, electrical work, tools, regulated uniforms, certification badges, weapons, military styling, robots, AI or neon motifs, and any other project's motifs.
- **Dimensions and format:** portrait, **1055 x 1491 pixels** (the size of the OG-28 cover), **PNG** (WebP or high-quality JPG also acceptable); one image.
- **Target OffGrid056 path:** `workspace/cover-assets/household-action-plan-cover.png` (git-ignored; then copied to `workspace/prep/OG-29/assets/household-action-plan-cover.png`). Please tell me the exact file name or path you want used so provenance is explicit.
- **Template constraints:** the cover page is US Letter portrait; the image fills the page width at the top, cropped by layout from the bottom (about 20 percent) with a 128 px brand band below carrying the label, subtitle and strapline; the title is Bebas Neue, brand deep green, about 62 px, at top left. The legacy Week 4 image reference stays in the prepared HTML until your cover is supplied and is replaced at that point; it must not appear in any final render.

## 10. Validation (actual exit codes)
Focused `og-29-draft.test.ts`: 17 passed, **exit 0**. Full unit suite: 62 files, 1,689 tests, **exit 0**. Lint: **exit 0** (0 errors, 58 existing warnings). Typecheck: **exit 0**. `import:verify-prep` and `import:verify-build` were **not re-run** in this stage (no source or config changed since Stage 10.22A-CORRECTION, where both exited 0); I skipped them rather than expand tool use after your interruption. Project-isolation checks (section 6 and the confirmations below): done.

## 11. Files changed
This report only. No config, test, PDF, record, route or detector file changed in this stage.

## 12. Confirmations
No stable ID assigned (suggested `res-1029` stays unassigned) · no PDF rendered · no protected record · no Planning Tools addition (live 11) · no staging · no deployment · Worker unchanged · live counts unchanged · no cross-project asset used or copied.

## 13. Recommended next step
Supply a title-free OG-29 cover (or approve an image workflow) and confirm which subtitle to print ("next steps" as accepted, or "owners"). Then resume **Stage 10.22B** (cover insertion, cover CSS, NZ and AU render, page-by-page QA), still with no ID, record, staging or deployment.

## 14. Owner rulings after this stage (2026-10-14)
1. **Final subtitle (exact):** "A calm, practical worksheet for turning your household's decisions into clear actions and owners." This supersedes the earlier "…clear actions and next steps" version. The draft source (`approved-copy.json` cover-subtitle entry), the test and the prepared NZ and AU HTML now carry it (verified in both prepared files). Body copy is unchanged (NZ and AU 2,353 characters each, body HTML 7,611 bytes each, byte-identical; the measured count includes the cover subtitle, so it fell by four characters because owners is four characters shorter than next steps).
2. **Action table:** stays exactly five columns (Action, Why it matters, Owner, Target date, Status / Notes) with ten blank, visually unnumbered rows; no number column.
3. **Cover:** still **COVER_ASSET_REQUIRED**. A title-free OG-29 cover will be supplied separately; no substitute is to be sought, and no search of Downloads, Desktop, sibling or unrelated project folders will be made. Final rendering stays on hold. No PDF exists in `workspace/prep/OG-29` (0 PDFs).
Re-validation after the subtitle change (actual exit codes): draft QA ALL PASS (0); focused OG-29 tests 17 passed (0); full suite 62 files, 1,689 tests (0); lint (0, 0 errors); typecheck (0); `import:verify-prep` (0); `import:verify-build` (0; 32 records · 64 market files · 0 broken links). Live state unchanged; Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`.

> **Superseded in part (Stage 10.22B.1):** the description is the owner's older sentence ("…turn its main resilience decisions into a clear list of actions, owners and next steps."), the related metadata order is 1027, 1028, 1007, 1026, the printed Where Next has three rows (res-1026 is metadata only) and the subtitle uses the curly apostrophe (household’s). See `STAGE_10.22B_OG29_FINAL_RENDER_QA.md` section 14.
