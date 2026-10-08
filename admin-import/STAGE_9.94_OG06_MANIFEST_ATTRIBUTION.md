# Stage 9.94 — OG-06 pre-deploy manifest attribution gate

**Result: READY TO DEPLOY (not deployed).** Every changed output file is attributed; unexplained = 0.

LIVE: 25 protected · 50 market files · 0 broken links (Worker `2fb0663d-a7da-4acf-ba4c-957886b21631`, rollback `65437c37-b731-4851-b67e-5b0fae79fe12`). STAGED: 26 · 52 · 0 broken links.

## 1. Builds compared (same source state, nothing edited between them)
- **A BASELINE:** the three OG-06 assets withheld (record, NZ PDF, AU PDF); 25 records.
- **B STAGED:** the exact staged assets present (restored hashes verified equal); 26 records. Built twice (B1, B2).

## 2. Complete manifest diff (every file, no sampling)
| | Baseline | Staged |
|---|---|---|
| Total files | **1000** | **1008** |

| Comparison | Added | Removed | Changed | Identical |
|---|---|---|---|---|
| **Strict raw** (nothing normalised) | 11 | 3 | 877 byte-changed | 120 |
| **Normalised** (build id and the `next-size-adjust` tag only) | **8** | **0** | **299 semantically changed** | **701** |

The raw difference is almost entirely the build id, which is embedded in nearly every file and names one folder (3 files added, 3 removed, all identical after the id is normalised). The approved `next-size-adjust` ordering variation did not occur in these builds.

## 3. Attribution (structural, every changed file)
Method: each text output is decomposed into resource items (cards, table rows, resource objects, pointers to them, keyed list elements, plain id lists, flight placeholder pointers) and a **skeleton**. The skeleton must be identical between baseline and staged except for +1 counters. Every item list must equal the baseline list with res-1006 inserted and at most one tail item displaced, and every surviving item must be byte-identical (content, order, reasons). A negative control (tampered copies: an edited title, Start Here text, a card label) was flagged G each time, so the check is not lenient.

| Cause | Files carrying it |
|---|---|
| **A** res-1006 card/listing entry (library, downloads, home, saved, progress payloads) | **24** |
| **B** resource-count increase 25 → 26 (library/downloads/progress counters, listing placeholder pointers) | **7** (these files also carry A) |
| **C** market-file count 50 → 52 | **0** (no page displays it; the site never states a market-file count) |
| **D** same-topic suggestion data now includes res-1006 | **275** |
| **E** direct OG-06 route, page and PDFs | **8** added |
| **F** build-id artefacts | **3 added + 3 removed raw; 0 after normalisation** |
| **G** other | **0** |

24 (A) + 275 (D) = 299 changed files; every one has a cause; no changed file is unattributed.

**Exact added files (normalised):** `resources/emergency-readiness-checklist/` {`index.html`, `index.txt`, `__next._full.txt`, `__next._tree.txt`, `__next.resources.$d$slug.__PAGE__.txt`, `__next.resources/$d$slug/__PAGE__.txt`} and `resources/emergency-readiness-checklist.NZ.pdf` / `.AU.pdf`. No unrelated route was added; nothing was removed.

### Finding to be aware of (category D, expected by the existing dynamic logic)
The "Same topic" suggestion list on a resource page is capped at six. Where res-1006 qualifies it is inserted (usually fifth) and the **last entry drops off**. This happens on 55 resource pages (25 protected and 30 demo placeholder pages) and displaces **121 tail entries, all demo placeholders**: Household Contacts Template (res-0009), Household Resilience Assessment (res-0005), Five Foundations Overview (res-0004), and one path-step entry on the demo Build Your First 30-Day Action Plan page. On protected pages 66 of those displacements are a demo placeholder suggestion replaced by res-1006. No protected resource is ever displaced. Protected resources already propagated into demo pages' suggestions before this stage (for example res-1026, res-1510 and res-1027 on the demo 30-Day Action Planner), so this is existing behaviour, not a new coupling. If you would rather demo pages never suggest protected resources, that is a separate decision and not part of this deploy.

## 4. Content-level result
No existing resource copy, title, description, safety block, market wording, route, collection, Start Here, Planning Tools, programme or demo page content changed. The only differences are (A) the new card, (B) +1 counters, (D) the new suggestion and the displaced tail entry. Surviving items are byte-identical.

## 5. Navigation and policy invariants
Files changed under `/start-here`, `/planning-tools`, `/programme` (day 6 → res-0011), `/foundations` (Five Foundations), `/workshops`, `/learning-paths`, `/packs`, `/videos`, `/suppliers`, `/brand`: **0**. Demo routes: all four `demo-*` pages exist and differ only by category D. `route-policy.json` and `data/` are unchanged since Stage 9.73B (git).

## 6. PDFs and record
- 50 live PDFs byte-identical (protected PDFs 50 in the baseline, 52 staged); exactly two added.
- NZ `6a892f0dcb8afba650418f381d97c6440bc8a5e2c22097cfd71af7ae1b98b171`; AU `dd0cf256810ffde0cc5c1a09ec5e934699ea2c890b0f3b2d6f4295a2358f6aba` (unchanged).
- Record `emergency-readiness-checklist.private.json` (sha256 `4c979efd068cd5db94d60207c5c8dd8f613087315888b6d8a06e7247d8fac214`) matches the locked metadata: id res-1006, title, general / resilience-emergency / planning / checklist / beginner / 20 min / draft / collections none, the approved description, related res-1002, 1004, 1008, 1011, 1013, 1019 in order, no res-1015.

## 7. Registers
Unchanged this stage and in agreement: live 25 / 50; staged 26 / 52; Deployed 25 · Staged 1 · Prepared 0 · Blocked 1 · Merged 1 · Not started 17 = 45; OG-06 res-1006 STAGED; OG-16 BLOCKED; OG-05 MERGED / NO STANDALONE; same Worker and rollback; next action explicit deployment approval (register tests pass).

## 8. Detectors, separately
| Set | Numeric candidates | Survival-duration | Supply-duration | Emergency-period | Price | Content flags | Bucket C |
|---|---|---|---|---|---|---|---|
| **A. True live (25 / 50)** | 431 | 0 | 0 | 0 | 0 | 4 | **0** |
| **B. Staged (26 / 52)** | 433 | 0 | 0 | 0 | 0 | 4 | **0** |

The 4 content flags are in already-live OG-09 (AU) and OG-13 (NZ), identical in both sets; OG-06 adds none.

## 9. Reproducibility
Staged build 1 vs staged build 2: strict raw differs only by build id; **normalised 1008/1008 identical, 0 semantic differences**. Staged build 2 equals the current `out/` (1008 identical). Structural diff of B1 vs B2: 0 changed.

## 10. Validation (exit codes)
lint **0** · typecheck **0** · full tests **0** (995 passed, 44 files) · built-output, register, route-separation and the three numeric-detector suites **0** (203 tests) · `import:verify-prep` **0** · `import:verify-build` **0** (records 26 · market files 52 · broken internal links 0) · Bucket C **0**.

## 11. Recommendation
**READY TO DEPLOY**, on your explicit approval. Nothing was deployed and no Access or Worker setting was touched.
