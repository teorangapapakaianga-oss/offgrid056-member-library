# DEPLOYED: OG-22 + OG-26, AND FIVE TITLE CORRECTIONS · 8 PROTECTED RESOURCES · OG-27 HELD

The private preview is now **version `2aa8a131`**, with **eight protected draft resources**:

- OG-22 and OG-26 deployed together, and the dependency resolves.
- All eight resources carry the PDF title standard.
- **OG-27 is prepared in its final form but not deployed.** One AU wording decision is left.

**Date:** 22 September 2026

---

## 1. Deployment result

**Successful.** It was checked before deployment on the exact build that shipped, and afterwards against the live
Worker.

| | |
|---|---|
| New | **OG-22** Resilience Product Wishlist, **OG-26** 3-Tier Budget Planner (same build) |
| Title corrections | OG-B04, OG-15, OG-B07, OG-25, OG-B10 (teaching content unchanged) |
| Unchanged | OG-02 (already on the standard) |
| Not deployed | **OG-27** — no page and no files in the build |
| Build | 24 private files staged (8 records, 16 PDFs), removed after the build; none left in `public/` |

## 2. Worker version

**`2aa8a131-b342-4037-b3a8-76457a1d462d`**

## 3. Protected resources

**Eight**, all drafts, all behind Access:

1. OG-02
2. OG-B04
3. OG-B10
4. OG-25
5. OG-15
6. OG-B07
7. **OG-22**
8. **OG-26**

## 4. OG-22 route

`/resources/resilience-product-wishlist/` · files `…/resilience-product-wishlist.NZ.pdf` and `.AU.pdf`

## 5. OG-26 route

`/resources/3-tier-budget-planner/` · files `…/3-tier-budget-planner.NZ.pdf` and `.AU.pdf`

## 6. NZ/AU market resolution

Tested in the browser on the deployed build: 9 surfaces (Downloads plus eight resource pages) × 3 states.

| State | Result |
|---|---|
| **No market** | **no file anywhere**; Downloads shows "Choose your market" ×8; each page shows the chooser |
| **NZ** | NZ file only on every surface; **0 AU files offered** |
| **AU** | AU file only on every surface; **0 NZ files offered** |
| Draft badge | on all 8 resource pages, in every state |

**27 / 27 combinations correct.**

**The exact-build verifier** (new, below) read back every one of the 16 market files the Worker serves:

| Market | Result |
|---|---|
| NZ | 111 only · Civil Defence |
| AU | 000 + 112 · SES · no NZ-only content |
| Both | zero tokens, no VERIFY markers, no browser-error pages · none of the removed wording · no OG codes in text · **0 broken internal links** |

## 7. Dependency and link verification

| Check | Result |
|---|---|
| OG-26 text names OG-22 | *"Start with the MUST items from your Resilience Product Wishlist."* — NZ and AU |
| OG-26 redefines MUST | no; the definition is only in OG-22, unchanged |
| OG-22 page | shows **3-Tier Budget Planner** under "Linked by us" |
| OG-26 page | shows **Resilience Product Wishlist** under "Linked by us" |
| Build validator | accepted both links; each resource exists in the same build |
| Links to OG-27 | **none**, as intended |

## 8. PDF titles — all eight resources

Read from the PDFs **in the deployment build**, NZ and AU identical:

| Resource | PDF title |
|---|---|
| OG-02 | Household Risk Identifier — OffGrid056 |
| OG-B04 | Monthly Planning Challenge Template — OffGrid056 |
| OG-B10 | 90-Day Implementation Roadmap (Advanced) — OffGrid056 |
| OG-25 | Project Support Brief Template — OffGrid056 |
| OG-15 | Warm Home Scorecard — OffGrid056 |
| OG-B07 | Solar Planning Deep Worksheet — OffGrid056 |
| OG-22 | Resilience Product Wishlist — OffGrid056 |
| OG-26 | 3-Tier Budget Planner — OffGrid056 |

**No legacy OG code appears in any title or any document text.** Codes remain only in `legacyCode` and the audit
metadata.

## 9. Access protection

**27 / 27 addresses → 302 to the Cloudflare Access login**, unauthenticated:

- the home page and Downloads
- all eight resource pages
- all sixteen PDFs (OG-02's NZ file is `household-risk-identifier.pdf`)
- OG-27's would-be page

## 10. Tests

**252 passed** (251 + 1). Lint and typecheck clean. `import:verify-prep`: 18 / 18 prepared PDFs.

**New:**

- **`npm run import:verify-build`** checks the **exact deployment build** in `out/`, not the workspace copies.
  - It reads every market file named in every private record.
  - It checks the title standard, emergency numbers, agencies, NZ-only content in AU, removed wording, OG codes,
    tokens and draft status.
  - It checks every internal link on the Downloads and resource pages.
  - It exits non-zero on any problem. Written for this deployment's pre-check, now part of the toolkit.
- **Audit safety notes can now be answered.** OG-26's source-level notes ("covers stored drinking water … with no
  potability warning") were treated as permanent blockers, even with the answering block present.
  - A note now clears only when its topic's block is included.
  - **Gas stays strict:** it needs the gas-and-LPG block, which has not been through NZ/AU verification.
  - **This was hidden while OG-26 was "blocked":** lifting the block after deployment exposed it. OG-26 itself was
    correct throughout, since it carried every answering block; the rule was wrong. Fixed and tested.

## 11. Rollback

**`d1644b97`**, the previous six-resource version, is retained in the deployment history. The private files for it
are also backed up locally. `619b70d5` is still further back.

## 12. OG-27 — final readiness

**Prepared in final form. Not deployed.** Its dependency is resolved: OG-22 and OG-26 are live and verified.

| Required | Status |
|---|---|
| Link to Resilience Product Wishlist | ✅ `relatedResources` res-1022 (OG-27 uses its *"Tier 1 (Essential) MUST items"*) |
| Link to 3-Tier Budget Planner | ✅ res-1026, plus the in-text references *"Confirm the budget tier you chose in the 3-Tier Budget Planner"* and *"Compare actual spend to your 3-Tier Budget Planner budget"* |
| NZ/AU wording | ✅ NZ: *"Submit any building consents."* · AU: *"Submit any required permits or approvals."* (your ruling) |
| PDF title | ✅ 90-Day Implementation Roadmap — OffGrid056 |
| Legacy OG navigation | ✅ none |
| Unsupported figures | ✅ none; the food-reserve planning target is in Week 2 |
| Page count | 9 (NZ and AU), as approved |

**Status: PREVIEW_WITH_PROPOSED_COPY**, because of **one AU proposal you have not seen.** The same Week 5 row's
deliverable column also uses the NZ term:

| Where | NZ | AU (proposed) |
|---|---|---|
| Week 5 deliverable | All pros booked, consents lodged | **All pros booked, permits or approvals lodged** |

Your ruling covered the Week 5 sentence, not this column, so I have not applied it. Once it is decided, OG-27 is
**READY_AFTER_FINAL_VALIDATION**.

**At OG-27's deployment:** add res-1027 to OG-26's record, so OG-26 links forward to it.

---

## Found while building the verifier: live OG-25 has NZ-only terms in its AU file

The AU file of **OG-25** (live since Stage 9.20) contains two New Zealand planning and council terms in its
attachments checklist. They are the same class of issue as your OG-27 ruling.

| Where | Now (NZ and AU) | Proposed for AU only |
|---|---|---|
| Attachments checklist | Building consent or **resource consent** documents | **Building, planning or development approval documents** |
| Attachments checklist | Council file number or **property folder** | **Council or property records** |

*Resource consent* is an NZ Resource Management Act term, and a *property file/folder* is an NZ council concept. The
NZ file is unchanged.

These are **proposals only**. OG-25 is live and locked, and its preview shows PREVIEW_WITH_PROPOSED_COPY until you
decide.

**OG-B10's** *"Consent / permit lead times"* already covers both markets and is left as it is.

---

## Remaining owner decisions

1. **OG-27 AU deliverable:** *"consents lodged"* → *"permits or approvals lodged"*. Then approve OG-27's deployment.
2. **OG-25 AU attachments checklist:** the two proposals above. They would go out in OG-27's deployment if approved.

**Stopped. OG-27 not deployed.**
