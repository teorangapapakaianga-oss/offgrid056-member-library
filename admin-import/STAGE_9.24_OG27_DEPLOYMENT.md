# DEPLOYED: OG-27 + CORRECTED OG-25 AU · NINE PROTECTED RESOURCES

The private preview is now **version `87d2301c`**, with **nine protected draft resources**. The **OG-22 → OG-26 →
OG-27** chain is complete and linked in both directions. OG-25's Australian file no longer carries New Zealand
planning terms.

**Date:** 22 September 2026

---

## 1. Deployment result

**Successful.** It was checked on the exact build before deployment and against the live Worker after.

| | |
|---|---|
| New | **OG-27** 90-Day Implementation Roadmap |
| Updated | **OG-25 AU PDF** (two AU-only wording changes) · **OG-26 record** (forward link to OG-27) |
| Unchanged | everything else, including OG-25's NZ PDF |
| Build | 27 private files staged (9 records, 18 PDFs), removed after the build; none left in `public/` |

## 2. Worker version

**`87d2301c-372d-4607-b1be-0be1a6f6f6c7`**

## 3. OG-27 route

`/resources/90-day-implementation-roadmap/` · files `…/90-day-implementation-roadmap.NZ.pdf` and `.AU.pdf`

## 4. Protected resources

**Nine**, all drafts:

1. OG-02
2. OG-B04
3. OG-B10
4. OG-25
5. OG-15
6. OG-B07
7. OG-22
8. OG-26
9. **OG-27**

## 5. Dependency links

| Page | Linked by us (shown first under "Related resources") |
|---|---|
| Resilience Product Wishlist (OG-22) | 3-Tier Budget Planner |
| 3-Tier Budget Planner (OG-26) | Resilience Product Wishlist · **90-Day Implementation Roadmap** |
| 90-Day Implementation Roadmap (OG-27) | 3-Tier Budget Planner · Resilience Product Wishlist |

**In the text, both markets:**

- OG-26: *"Start with the MUST items from your Resilience Product Wishlist."*
- OG-27: *"Confirm the budget tier you chose in the 3-Tier Budget Planner"* and *"Compare actual spend to your 3-Tier
  Budget Planner budget."*

No OG codes appear anywhere in the text. The build validator accepted every link.

## 6. NZ / AU resolution

Tested in the browser on the deployed build: Downloads plus nine resource pages, across three states.

| State | Result |
|---|---|
| **No market** | **0 files offered**; Downloads shows "Choose your market" ×9 |
| **NZ** | exactly one NZ file on each of the 9 pages and 9 on Downloads; **0 AU files** |
| **AU** | exactly one AU file on each of the 9 pages and 9 on Downloads; **0 NZ files** |
| Draft | on all 9 pages, in every state |

**30 / 30 combinations correct.**

**OG-27 checks:**

| Check | NZ | AU |
|---|---|---|
| Week 5 approvals | *"Submit any building consents."* | *"Submit any required permits or approvals."* |
| Week 5 deliverable | *"All pros booked, consents lodged"* | *"All pros booked, permits or approvals lodged"* |
| Emergency numbers / agency / licence | 111 · Civil Defence · licensed electrical worker | 000 + 112 · SES · licensed electrician |
| Other market's values | none | none (no NZ planning terms) |
| Tokens / VERIFY | 0 / 0 | 0 / 0 |
| Old OG navigation · unsupported figures | none · none | none · none |
| Draft | yes | yes |
| PDF title | 90-Day Implementation Roadmap — OffGrid056 | the same |
| **Table rows intact** | **15 / 15** | **15 / 15** |
| Pages | 9 (approved layout) | 9 |

**How "rows intact" was checked:** every table row's text must appear in the PDF with **no page break inside it**.

## 7. Corrected OG-25 AU

| Attachments checklist | NZ (unchanged) | AU (now live) |
|---|---|---|
| consents | Building consent or resource consent documents | **Building, planning or development approval documents** |
| council records | Council file number or property folder | **Council or property records** |

- **AU file:** no "resource consent", no "property folder", and no other NZ planning or council term.
- **NZ file:** keeps its NZ terminology.
- Both files: 9 / 9 table rows intact, 6 pages, and no other teaching content changed.

## 8. Access protection

**29 / 29 addresses → 302 to the Cloudflare Access login**, unauthenticated: the home page, Downloads, all nine
resource pages, and all eighteen PDFs.

## 9. Tests and validation

**252 passed.** Lint and typecheck clean.

- `import:verify-prep`: 18 / 18.
- **`import:verify-build` on the exact deployment build:**
  - **9 records**
  - **18 market files**
  - **0 broken internal links**
  - verified
- `--real`: refused.
- Real resources in public GitHub: **0**.

**Verifier strengthened.** Its list of NZ-only terms that must never reach an AU file now includes *building
consents*, *consents lodged*, *resource consent* and *property folder*.

**Gas safety stays strict (your ruling 5).** A gas note is answered only by the gas-and-LPG block, which has not been
verified for NZ or AU, so no resource needing it can be publishable. None of the nine deployed resources carries a
gas note. That is why all nine were ready.

## 10. Rollback

**`2aa8a131`** (eight resources) is retained in the deployment history. Its private files are backed up locally.
`d1644b97` is still further back.

## 11. Next recommended resource

**OG-11 — 30-Day Pantry Builder.** It is next in the Group-A migration order.

| | |
|---|---|
| Type / foundation | worksheet / food |
| Safety | needs **food safety in a power cut**. The standard's block was never taken through the Stage 9.17–9.18 live NZ/AU verification, so it needs that first. |
| Market fields | *fridge without power*: official NZ and AU figures are already in the profiles, but should be re-checked live |
| **Watch point** | its **"30-day" pantry target** is the same kind of universal food-quantity figure you ruled against for OG-26 and OG-27's four-week supply. Expect a planning-target rewrite decision. |

**The other two Group-A resources are harder, so I suggest leaving them until after OG-11:**

- **OG-19, Battery Backup Planner:** needs the electrical block (approved) and the food block.
- **OG-B11, Building Consent Navigator:** built around NZ building consents, so its AU variant is substantial. It
  needs four safety blocks, including fire-and-emergency, which is not yet verified.

Also note that **OG-23** (Supplier Question Bank), **OG-24** and **OG-29** all reference OG-22, which is now live, so
they can link to it when they are migrated.

**Stopped for owner review. Nothing further prepared or deployed.**
