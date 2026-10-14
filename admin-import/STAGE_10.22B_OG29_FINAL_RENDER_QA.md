# Stage 10.22B — OG-29 Household Action Plan: cover insertion, NZ/AU render and page-by-page QA

**Render and QA only. PASS, with three items for your confirmation (section 2).** Nothing was staged, deployed, assigned an ID or added to Planning Tools; no protected record was created. The PDFs are in `workspace/prep/OG-29/` only (git-ignored), not in `private-assets`.

LIVE (unchanged): **32 protected resources · 64 market files · Planning Tools 11 · Downloads 54 · My Progress 57 · 0 broken links** · Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` (confirmed 100%). Migration (unchanged): Deployed 32 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 11 = 45.

## 1. Cover asset
- **Source:** `C:\Users\jgate\Downloads\Family Planning Around the Table.png` (the exact file named in the brief, `Household Action Plan Cover.png`, does not exist; this was the single plausible image in Downloads and `workspace/cover-assets/`, saved 14:18 today, identical to the image pasted in chat; the other images present were the two rejected hoop diagrams and the OG-28 cover, none plausible). Provenance: owner-supplied for OG-29, newly created, no embedded text or logo.
- **Dimensions:** 1536 x 1024 PNG (landscape), 2,231,369 bytes. **Source SHA-256:** `1B67D0D6829EFBE19B51D2A1D6EAFE13AAC3940309A91C8033E68DAE8905D359`.
- **Prep copy:** `workspace/prep/OG-29/assets/household-action-plan-cover.png`, SHA-256 identical. **Byte-identical: YES.**
- **Concept QA (passed):** a mixed-age family of four (two adults, two children) at a kitchen table, a blank grid planning board with sticky notes on the wall, notebooks, pens and sticky notes on the table, natural daylight, calm collaborative mood, a clear upper wall, **no readable text, no logos, no OG code, no uniforms, no technical tools, no emergency imagery.** A laptop and a mug sit at the left edge (incidental, not a technical tool). Hands and faces are natural; no duplicated people.
- **Layout (layout only, image not edited):** the image is a full-width band below the title (its sides trimmed slightly so the page width is filled; all four faces, the board and the notes stay whole), on the brand dark background, with the brand band below. A first attempt that faded the image into a cream background was dropped because the PDF viewer used for QA rendered the transparency as a solid pink block; the final layout uses no transparency.
- **Legacy Week 4 reference: removed** (the prepared HTML references only the new image; no Week 4 artwork in either PDF).
- **Title layer:** "Household Action Plan" in Bebas Neue, white on the dark background, once, top left, fully visible, clear of faces and board. **Duplicate title: NO. Cover text defects: NO.**

## 2. Items for your confirmation
This brief's wording differs from your later explicit rulings in three places. I followed the rulings (they are what the draft, the tests and the earlier reports lock) and the brief's own "2,353 characters", which only matches the current draft. Each is a small change if you prefer the brief:
1. **Description:** the brief shows the older "…turn its main resilience decisions into a clear list of actions, owners and next steps." The locked and exact owner description is "A practical worksheet to bring your household decisions together, turn them into a clear list of priority actions and record who will take each action forward."
2. **Where Next:** the brief says three printed rows with res-1026 as a later metadata-only link and metadata order 1027, 1028, 1007, 1026. The owner correction locked **four printed rows** and metadata order **1027, 1028, 1026, 1007** (with the older three-row version the body would not be 2,353 characters).
3. **Apostrophe:** the brief's subtitle uses a typographic apostrophe ("household’s"); the draft and PDFs use the plain one ("household's"). The wording is otherwise the owner's final subtitle ("…clear actions and owners.").

## 3. Rendered files
| | NZ | AU |
|---|---|---|
| Path | `workspace/prep/OG-29/household-action-plan.NZ.pdf` | `workspace/prep/OG-29/household-action-plan.AU.pdf` |
| SHA-256 | `c5ffd4697533fda2874a9ff671fe52123091173be5137eb48ce40c66f22cf27b` | `b3871cdb6b355aa9388b66e3400567706266c9e967b67e67a2dddd01e9411567` |
| Size | 3,418,084 bytes | 3,417,747 bytes |
| Pages | **6**, US Letter portrait | **6**, US Letter portrait |
PDF title in both: **"Household Action Plan — OffGrid056"**; no OG-29 anywhere member-facing. Fonts load (Bebas Neue, Montserrat); no corrupt file, missing image or blank page.

## 4. Page-by-page QA (both markets; viewed and checked by `workspace/og29-pdfqa.mjs`, ALL PASS)
- **p1 cover:** new family image, title once, exact subtitle, "General · Planning", "OffGrid056 Member Library", "Prepare • Adapt • Thrive" in a readable brand band; no clipping, no text over faces.
- **p2:** standing emergency-contact box (NZ 111 / AU 000), What This Plan Is For, How to Use It, Our Plan Details (all six fields render in two columns: Household or property, Date, Our main goal, Our main priority, What we want to improve, Who is involved).
- **p3:** What We Have Decided, four prompts clear with four writing lines each.
- **p4:** Our First Ten Actions: **exactly five columns** (Action, Why it matters, Owner, Target date, Status / Notes), **ten blank unnumbered rows**, headers unclipped, enough writing room, table not split.
- **p5:** When We Will Review It (neutral wording, no cadence) and Notes (nine writing lines).
- **p6:** Where Next (four rows: Before 90-Day Implementation Roadmap, Next Household Responsibility Roster, Also useful 3-Tier Budget Planner, Also useful Priority Lock Worksheet), Where You Are Now (four prompts), and the standing general-disclaimer (NZ and AU wording).
Page numbers 2 to 6 present; no orphan heading, overlap, overflow, footer collision or accidental near-empty page. Pages 3 to 5 are worksheet pages with writing space by design.

## 5. Parity and body counts
NZ and AU body **2,353 characters** each; body HTML **7,611 bytes** each, byte-identical; the extracted text of both PDFs is identical on every page apart from the market-specific standing blocks (2,180 characters of body text compared). No market override.

## 6. Detectors and legacy (`workspace/og29-draft-qa.mts` ALL PASS)
Standing blocks emergency-contact and general-disclaimer only; **technical safety triggers 0**; **regulatory candidates 0, unresolved 0**; **Bucket C 0**; price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply, emergency-period, storage and target-label **0**; legacy-language **0**; content flags **0**; no digits in the body; no exemption, no registry change. Rendered-PDF text contains none of OG-29, any OG code, 30-Day Programme, Week, Day, Tomorrow, "Next:" (the "Where Next" heading is legitimate), OFFGRID056.COM, "past 29 days", monthly, quarterly, or any garden, hoop or other-project wording.

## 7. Related, Planning Tools
Metadata and printed order res-1027, res-1028, res-1026, res-1007 (see section 2 item 2); engine check (real engine, simulated): exactly those four, all "Linked by us"; **no res-0006, res-0008, res-1504 or res-1510 filler**; `lib/related.ts` unchanged. Planning Tools: future YES, not added (live 11).

## 8. Tests and checks (actual exit codes)
Focused `og-29-draft.test.ts` 17 passed, **exit 0** (now also asserts the cover status, the cover hash, the new cover reference and the absence of the Week 4 artwork). Full suite **62 files, 1,689 tests, exit 0**. Lint **exit 0** (0 errors, 58 existing warnings). Typecheck **exit 0**. `import:verify-prep` **exit 0** (OG-29 NZ and AU, 6 pages each). `import:verify-build` **exit 0** (32 records · 64 market files · 0 broken links).

## 9. State and files
Stable ID assigned **NO** (`res-1029` suggested only, unassigned) · protected record **NO** · Planning Tools addition **NO** · render in private-assets **NO** · staging **NO** · deployment **NO** · Worker unchanged · live counts unchanged. Repo changes: `approved-copy.json` and `metadata-review.json` (OG-29 draft entries: cover image reference and status), `og-29-draft.test.ts`, this report. Git-ignored: the cover copy and PDFs under `workspace/prep/OG-29/`, `workspace/add-og29-config.mts`, `workspace/og29-pdfqa.mjs`.

## 10. Verdict and owner decisions
**PASS** (render and QA), pending your confirmation of the three items in section 2. Decisions needed: approve the final cover; approve the NZ PDF; approve the AU PDF; confirm the description, four-row Where Next and apostrophe points; then, as separate approvals, the stable ID, the staging metadata and controlled staging.

## 11. Next stage
**Stage 10.22C — OG-29 stable ID assignment and controlled staging**, after your approvals (not started).
