# Stage 10.22C — OG-29 Household Action Plan: stable ID assigned and controlled staging (NOT deployed)

**OG-29 is STAGED, not live.** `res-1029` is assigned; the protected record and the two approved PDFs are in `private-assets`; the staged preview build was produced and validated. No deployment, no Worker change, no live count change. Cloudflare, Supabase, Railway, the OS and entitlement untouched.

LIVE (unchanged): **32 protected resources · 64 market files · 0 broken links · Planning Tools 11 · Downloads 54 · My Progress 57** · Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`.
STAGED build (measured): **33 protected resources · 66 market files · 0 broken links · Planning Tools 12 · Downloads 55 · My Progress 58**.

## One finding for the owner before any deployment
The related-resource engine is unchanged, but it shows automatic "Same topic" cards on any page with fewer than four curated links, filled from the general / planning pool in a fixed order. Adding Household Action Plan to that pool changes the sixth automatic card on **three existing pages**, replacing the demo "Household Contacts Template" with "Household Action Plan":
- `/resources/30-day-action-planner/` (demo placeholder res-0008);
- `/resources/build-your-first-30-day-action-plan/` (demo placeholder res-0006);
- `/resources/90-day-implementation-roadmap-advanced/` (**live protected res-1510**).
The other 59 existing pages' related cards are identical. This is the engine behaving as designed (not a defect), and the new card is relevant, but your brief expected existing related cards to be unchanged, so I am flagging it rather than hiding it. Options at the deployment stage: **accept** it (recommended: no existing resource is edited; the replaced card is a demo placeholder on two pages and, on the Advanced roadmap, one of six automatic cards); or approve giving res-1510 a curated four-link list (an owner-approved change to a live resource, which would be a separate stage).

## Stable ID and collision checks
`res-1029` assigned to OG-29 Household Action Plan (owner-approved). Checked before writing (the staging script refuses on any hit): no protected record with that ID, slug or legacy code; no demo resource with that ID or slug; no route-policy, canonical-index or register entry; no existing route or staged file `household-action-plan`; no collection conflict (Planning Tools only). **0 collisions.** The ID appears only in the staged record, the registers, the canonical index and the tests, never in the review config, the copy or the PDFs.

## Staged record and assets
| | |
|---|---|
| Record | `private-assets/data-resources/household-action-plan.private.json` (git-ignored; sha256 `2e04fc33b0777cc88d3b10a4b05446b236e13355d64e2e91478f4e0f7deab867`) |
| Fields | id res-1029 · slug household-action-plan · legacyCode OG-29 · title and description exactly as approved · general / planning-implementation / planning / worksheet · beginner · 20 min · tags none · collections planning-tools · premium false · **status draft · publicationStatus approved · releaseChannel private-preview** · marketFiles NZ and AU · downloadable · publishedDate 2026-10-14 · relatedResources [res-1027, res-1028, res-1007, res-1026] · completionAvailable true. No guessed field: the strict record schema has no entitlement or OS field. |
| NZ PDF | `private-assets/resources/household-action-plan.NZ.pdf`, 3,416,494 bytes, sha256 `b8a5432752acf97721064e22f150b02768226950a72a7f4afcee19e3db6b5613` (verified against the approved hash before staging; byte-identical to the prep render; the built copy is identical too) |
| AU PDF | `private-assets/resources/household-action-plan.AU.pdf`, 3,416,184 bytes, sha256 `8781aea47ad7a393826dfe1d3e66d1d7fcfada0e8e50469fda1147342a7aab3c` (same checks) |
| Cover | The owner-supplied title-free photograph (`Family Planning Around the Table.png`, prep copy `workspace/prep/OG-29/assets/household-action-plan-cover.png`, 1536 x 1024, sha256 `1B67D0D6829EFBE19B51D2A1D6EAFE13AAC3940309A91C8033E68DAE8905D359`, hash verified before staging, source and prep copy equal) is embedded in both approved PDFs with the template title. A protected resource record has no cover or thumbnail field and no existing resource has a separate cover location, so none was invented. No legacy or other-project image is referenced. |
| Route | `/resources/household-action-plan/` (unique), protected build only |
| Related (explicit, in order) | res-1027 90-Day Implementation Roadmap (before) · res-1028 Household Responsibility Roster (next) · res-1007 Priority Lock Worksheet (also useful) · res-1026 3-Tier Budget Planner (later, metadata only; the PDF prints three rows). `lib/related.ts` unchanged. |

## Staged build validation
Two fresh builds: **identical** after build-id normalisation (1,064 files, 0 differences); the final tree equals the second build. `import:verify-build`: **33 records · 66 market files · 0 broken internal links**; OG-29 NZ and AU read back at 6 pages with the title "Household Action Plan — OffGrid056". Staged-build QA (`workspace/staged-qa29.mjs`): **ALL PASS**: the page builds with the approved title, description and metadata (Worksheet · General · Beginner · 20 min · Planning); no OG-29, `res-1029`, Week or Day wording visible; both PDFs linked; **four related cards, all "Linked by us", in the approved order (res-1027, res-1028, res-1007, res-1026); no "Same topic" cards, no res-0006, res-0008, res-1504 or res-1510**; Planning Tools lists it (**11 → 12**); Start Here, foundations, programme and workshops untouched; programme days 7, 14, 23 and 24 unchanged; protected PDFs **64 → 66** and **all 89 existing PDFs byte-identical**, exactly two added with the approved hashes; stylesheet and all 23 JavaScript chunks identical. **Badge:** 33 of 33 protected detail pages show **Preview** with the exact tooltip "Approved resource in the protected OffGrid056 preview.", **0 Draft badges**, **0 listing publication badges**, 0 occurrences of the old tooltip.

## Counts measured from the builds (live-equivalent baseline vs staged)
Protected market files 64 → **66** (protected resources 32 → **33**) · Planning Tools 11 → **12** · Downloads 54 → **55** (Worksheets 16 → 17) · My Progress 57 → **58** · Library resource links 58 → 59 · broken links 0.

## Build comparison against the live-equivalent baseline
Baseline: a fresh build of the unchanged deployed tree taken before staging (1,056 files, equal to the live deployment). Staged: 1,064 files; **8 added** (six `resources/household-action-plan/` route files and the NZ and AU PDFs), **0 removed**, **339 changed**. Hunk attribution (`workspace/attrib29.mjs`): listing entries 30, counters 208, resource-page payload hunks carrying the one new resource 364, new-resource files 8. The tool left **154 hunks unclassified**, all of which were checked and explained: (a) **1** in `library/index.html`, an alignment artefact: structurally, removing the one new card leaves the listing identical to the baseline apart from the card's own "Save" button label and the embedded page payload; (b) **153** in the three pages named above (res-0008, res-0006, res-1510: 27 in each `index.html` and 6 in each of four payload files), the sixth automatic related card changing from Household Contacts Template to Household Action Plan, with its metadata line (type, description) following it. **0 truly unexplained.** All 59 other resource pages' related cards are identical; no existing PDF, resource copy, stable ID, route, stylesheet or JavaScript chunk changed.

## Claim and safety validation (OG-29 staged)
`workspace/og29-draft-qa.mts` (NZ and AU): **ALL PASS** — technical safety triggers 0 (standing emergency-contact and general-disclaimer only); regulatory candidates 0, unresolved 0; Bucket C 0; price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage and target-label 0; legacy-language 0; content flags 0; NZ and AU body 2,232 characters each, body HTML byte-identical (7,409 bytes). `workspace/og29-pdfqa.mjs`: ALL PASS on both PDFs (6 pages, title, exact curly-apostrophe subtitle, five-column ten-row unnumbered table, three printed Where Next rows, res-1026 not printed, no OG-29, no legacy wording). The whole-library numeric scan test passes. No exemption, no registry change.

## Registers, index and review config
- **Migration state (recalculated from the register):** Deployed 32 · **Staged 1 (OG-29)** · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · **Not started 10** = 45 (OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree; the register carries a `res-1029` row marked STAGED; LIVE stays 32 / 64 with the live Worker unchanged; next action: explicit owner approval to deploy OG-29.
- **Canonical index:** `res-1029` added as a STAGED record (33 records: 32 live, 1 staged) with the full field set, owner / version / dates `UNKNOWN_EXISTING_RECORD`, short description withheld, OS fields inactive, both PDFs with hashes and build presence; **reviewStatus NEEDS_ENTITLEMENT_DECISION and NEEDS_METADATA (not VERIFIED_CURRENT)**; stage 10.22C; next stage 10.22D.
- **Review config:** OG-29 migration state "STAGED, NOT DEPLOYED (Stage 10.22C)". Tests adjusted for staging (records 32 → 33, Not started 11 → 10, Staged 0 → 1, Planning Tools twelve staged members, the OG-29 draft test now expects the staged record); no validator weakened.

## Validation (actual exit codes)
Default-timeout full suite **62 files, 1,689 tests, exit 0**; lint **exit 0** (0 errors, 64 existing warnings, none in application code); typecheck **exit 0**; `import:verify-prep` **exit 0**; `import:verify-build` **exit 0** (33 records · 66 market files · 0 broken links). Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` confirmed unchanged at 100%. Deployment: **NONE**.

## Owner decisions required
1. Explicit approval to deploy OG-29 (a separate stage). 2. A ruling on the three existing pages' automatic related card (accept, recommended, or a separate stage to curate the live Advanced roadmap's list).

## Next stage
**Stage 10.22D — OG-29 controlled deployment and post-deploy QA.** Not started.
