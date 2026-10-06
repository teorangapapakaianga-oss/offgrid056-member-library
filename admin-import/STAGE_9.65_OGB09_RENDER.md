# Stage 9.65 — OG-B09 render, PDF QA and programme-component rulings

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Nothing deployed. OG-B09 is NOT added as protected resource #22.** The protected-preview PDFs are in the working folder (`workspace/prep/OG-B09/`, git-ignored); nothing has been staged into `private-assets/` and the Worker is unchanged.

## 1. PDFs

| | NZ | AU |
|---|---|---|
| File | `resilient-heating-and-insulation-upgrade-checklist.NZ.pdf` | `…AU.pdf` |
| Size / pages | 383,976 bytes · **8 pages** | 381,236 bytes · **8 pages** |
| Rendered | headless Chrome, fresh (timestamps checked, not sizes) | same |
| `import:verify-prep` | ✓ verified | ✓ verified |
| Automated QA | **69 / 69 checks pass** (both markets) | |

Page map (both): 1 cover · 2 emergency + electrical safety blocks, purpose, insulation guidance · 3 audit table + R-value fields · **4–5 heating comparison (landscape)** · 6 notes box + questions · 7 decision worksheet, closing, disclaimer · 8 gas block + wood-burner block (NZ: gas, wood; AU: gas core, wood).

## 2. Table layout decision

**Own landscape section, split logically across two landscape pages** — the first option on your list. The current PDF architecture supports it cleanly: Chrome honours a named `@page`, so the comparison prints on US-letter **landscape** sheets (the PDF has both 612×792 and 792×612 pages) while everything else stays portrait.

- Page 4: heading, the "compare by what it depends on" introduction, the header row, and the first three options (heat pump / reverse-cycle air conditioner, wood burner, flued gas).
- Page 5: the header row **repeated**, then panel/convection, underfloor electric, central ducted.
- Fixed column widths (the two long outage / household columns get the room); type size **11.5 px — not reduced** below the document's normal table size.
- The notes box starts a fresh portrait page; worksheet boxes are now kept whole across page breaks.

First attempts and what was corrected: (a) the table broke 5 rows / 1 row and left the heading alone on an otherwise empty page — fixed by allowing the table to flow and forcing the logical break; (b) the "Your Decision" worksheet box split across two pages with a clipped border — fixed by keeping worksheet boxes together.

## 3. PDF QA findings

| Check | Result |
|---|---|
| No clipping / overflow | ✓ read page by page as images: all eight columns inside the page, no cut text, member boxes complete |
| Table readability | ✓ landscape, 11.5 px, header repeated |
| Headings / page breaks | ✓ no orphan heading; no split worksheet box; no blank page (every page > 40 characters) |
| NZ / AU separation | ✓ NZ: "call 111", "Heat pump", "your council", NZ gas body, no 000 / reverse-cycle. AU: "call 000", "Reverse-cycle air conditioner (heat pump)" **once** (no later reference), "state or territory building authority", AU gas core, no 111 / "New Zealand" |
| Safety blocks | ✓ emergency, electrical, gas (general), wood burners, disclaimer — each present **exactly once**; no other gas block |
| Duplicated safety paragraphs | ✓ none (every block sentence appears once in the PDF text) |
| Legacy R-values / prices / percentages / 2008 | ✓ 0 / 0 / 0 / 0 |
| Legacy hype ("most efficient", "Quick heat", "Backup heat and atmosphere", "Luxury", "know exactly") | ✓ none |
| Member-entry fields | ✓ Your Quote / Your Estimated Running Cost / Your Notes, six R-value lines, five-room audit, decision lines — all visible |
| Related resources visible | **Not in the PDF, by design.** Related links are library metadata shown on the resource page (`relatedResources` = res-1015, res-1017, res-1019, res-1021, all present in the library). They can only be seen in the app after deployment; the data is validated, the page is not yet |
| Title / metadata | ✓ "Resilient Heating & Insulation Upgrade Checklist" on the cover, running header and PDF title; shelter · resilience-planning · insulation · checklist · beginner · 30 minutes · draft |

One thing I got wrong and corrected: my first QA pass reported three "duplicate safety block" failures that were **false positives** (a heading and a sentence sharing the same words). The check now counts blocks in the HTML and repeated sentences in the PDF text; it passes.

**A validator fix, reported.** `import:verify-prep` expected the comparison section's CSS text in the PDF, because the landscape `@page` rule travels in a `<style>` block inside the approved change. CSS is never printed, so the verifier now drops `<style>` blocks before comparing wording. It still fails if any real word is missing.

## 4. Programme-component rulings recorded (`program-components.json`)

- **Budgeting.** Primary output = budget, financial allocation, roadmap, action plan, implementation schedule or project allocation → **planning-implementation**. resilience-planning only when budgeting is a supporting element in a broader household resilience assessment. Decided: **OG-26 = planning-implementation**; **OG-03 = planning-implementation** (its primary output is matching a household budget to an action pathway; its legacy text is also tied to programme tiers and prices, which its migration must remove).
- **System architecture.** off-grid-living = practical entry/intermediate resources that help a household understand, choose or establish independent systems; advanced-future = advanced, integrated, whole-property, multi-system, expert-level or later-stage. **OG-B12 = advanced-future; OG-B07 = advanced-future.** Basic or intermediate solar, battery, water and energy resources are **not** moved to advanced-future for being technical (tested: OG-18, OG-19, OG-20, OG-B08 and OG-10 have no advanced-future decision).
- **OG-B09 = resilience-planning**, as before.
- These are recorded decisions only; no live resource record was changed.

## 5. The 21 live resources — scheduled, not performed

The explicit exemption list (`deployedBeforeClassification`, 21 codes) is **unchanged**. A scheduled migration task, `classify-the-21-live-resources`, is recorded for the **next normal deployment**: classify all 21; validate each foundation; assign each a component; keep each valid category and type; run the full library regression; and **empty the exemption only once every live resource has valid component metadata — not before.** Status: NOT STARTED (tested).

## 6. OG-B09 metadata, blocks, copy

Unchanged from your rulings. Title Resilient Heating & Insulation Upgrade Checklist · shelter · resilience-planning · insulation · checklist · beginner · 30 minutes · draft. Blocks: `general-disclaimer`, `emergency-contact`, `gas-and-lpg-general`, `solid-fuel-heating`, `batteries-and-electrical` — none suppressed. Related resources approved as before.

## 7. Validation

| Check | Result |
|---|---|
| Numeric (both markets) | **Bucket C = 0**; 0 R-values, 0 prices, 0 percentages in the PDFs |
| Gas detector | `gas-and-lpg-general` only, both markets (the only "gas requirement" in the 22-resource run is OG-B09's own) |
| Solid-fuel / electrical detectors | both required by OG-B09's text, both carried |
| Price detector | 0 prices (six legacy prices recorded as removed) |
| Market validation | both markets publishable; separated |
| PDF verification | OG-B09 NZ and AU verified; all prepared files verified |
| Existing library | **21 / 21 READY · 42 / 42 market files · Bucket C = 0 · 0 findings** (the 22-resource run shows 22 ready, 44 files) |
| lint / typecheck | clean / clean |
| Tests | **637 passing** (633 → 637: +4 ruling tests) |
| `private-assets/` | 64 files, none modified (newest 07:26, the OG-17 deploy) · Worker unchanged `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |

## 8. Readiness for protected resource #22

**Ready**, subject to your approval of the PDFs as rendered. Steps still to do, each on your word: stage the two PDFs and the record into `private-assets/` (`build:preview`), add OG-B09 as protected resource #22 (status draft, behind Cloudflare Access), `import:verify-build`, deploy with a retained rollback. One thing the preview cannot show you today: the **related-resource links on the resource page** — they will be visible only after deployment, so check them then.

## 9. Owner decision still required

1. Approve the two PDFs (open them from `workspace/prep/OG-B09/`).
2. Approve staging, protected resource #22 and the deployment (and the rollback arrangement) — separate decisions.
3. Nothing else is outstanding from Stage 9.65.
