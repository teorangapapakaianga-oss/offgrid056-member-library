# DEPLOYED: OG-11 — 30-DAY PANTRY BUILDER · TEN PROTECTED RESOURCES

The private preview is now **version `6954a621`**, with **ten protected draft resources**. OG-11 went out with the
approved NZ and AU food-safety wording. The nine existing resources are unchanged.

**Date:** 22 September 2026

---

## 1. Deployment result

**Successful.** It was checked on the exact build before deployment and against the live Worker after.

| | |
|---|---|
| New | **OG-11** 30-Day Pantry Builder (worksheet · food · pantry-resilience · beginner · 30 min · draft) |
| Unchanged | all nine existing resources: no re-render, no record change (OG-11 needed no build linkage) |
| Build | 30 private files staged (10 records, 20 PDFs), removed after the build; none left in `public/` |

## 2. Worker version

**`6954a621-5b10-4aa4-b388-3bf9a00b5544`**

## 3. OG-11 route

`/resources/30-day-pantry-builder/` · files `…/30-day-pantry-builder.NZ.pdf` and `.AU.pdf`

## 4. Protected resources

**Ten**, all drafts:

1. OG-02
2. OG-B04
3. OG-B10
4. OG-25
5. OG-15
6. OG-B07
7. OG-22
8. OG-26
9. OG-27
10. **OG-11**

## 5. NZ result

`import:verify-build` on the exact deployment build, plus the Stage 9.26 read-back:

| Check | Result |
|---|---|
| Emergency number | **111 only** |
| AU timing ("about four hours", "at least 24 hours", "Eskies") | **none** |
| Tasting advice | **none** |
| *"less than 24 hours"* / *"less than 4 days"* | **none** |
| Invalid shelf lives (2–5 years, 1–2 years), calories (2,000 cal, 60,000 calories), *"under 20°C"*, *"every 3 months"*, *"in 10 weeks"* | **none** |
| Unresolved tokens / VERIFY text | 0 / 0 |
| Food block | the approved NZ wording: Get Ready order plus MPI doors, refreeze and discard; no timings |
| Baseline | *"at least three days (Get Ready)"*, with 30 days as OffGrid056's goal |

## 6. AU result

| Check | Result |
|---|---|
| Emergency numbers | **000 + 112 only** |
| Food timing | the approved NSW Food Authority guidance only |
| NZ-only wording (Trade Me, EECA, Warmer Kiwi Homes, Civil Defence, licensed electrical worker, NZD, NZ planning terms) | **none** |
| Baseline | varies by state (Get Ready Qld three days; NSW Food Authority up to 14 days), with 30 days as OffGrid056's goal |

**Both files:**

- PDF title *"30-Day Pantry Builder — OffGrid056"*
- Draft
- no visible OG-11 code
- no browser-error page
- no old programme navigation
- 6 pages
- rows and boxes intact

## 7. Access protection

**32 / 32 addresses → 302 to the Cloudflare Access login**, unauthenticated: the home page, Downloads, all ten
resource pages, and all twenty PDFs.

## 8. Downloads page and routing

Tested in the browser on the deployed build: Downloads plus ten resource pages, across three states.

| State | Result |
|---|---|
| **No market** | **0 files**; Downloads shows "Choose your market" ×10 |
| **NZ** | exactly one NZ file on each of the 10 pages and 10 on Downloads; **0 AU files** |
| **AU** | exactly one AU file on each of the 10 pages and 10 on Downloads; **0 NZ files** |
| Draft | on all 10 pages, in every state |

**33 / 33 combinations correct.**

## 9. Tests

**254 passed.** Lint and typecheck clean.

- **`import:verify-build`:** **10 records, 20 files, 0 broken links**, verified.
- `--real`: refused.
- Real resources in public GitHub: **0**.

**Verifier strengthened** so this stage's checks run on every future deployment:

- OG-11's removed figures, and the invalid NZ figures *"less than 24 hours"* / *"less than 4 days"*, can never ship
  again.
- **AU-only timing can never appear in an NZ file.**
- Tasting advice is rejected in both markets.

The nine previously live resources still pass under the stricter rules.

## 10. Rollback

**`87d2301c`** (nine resources) is retained in the deployment history. Its private files are backed up locally.

---

## 11. OG-19 — preparation recommendation (not started)

**OG-19 — Battery Backup Planner.** A planner in the energy foundation, and next in the Group-A order.

A read-only count of the audited source, done to size the work:

| | |
|---|---|
| Required safety blocks | **batteries and electrical** (39 battery mentions) and **food safety in a power cut** (6 fridge/freezer mentions). **Both are already verified and owner-approved for NZ and AU.** |
| Generators | 2 mentions: below the threshold that requires the generator block. The standard lists OG-19 among "generator-specific" resources, though, so the text needs reading. If it teaches generator use, the **never-bring-it-inside** and **carbon monoxide** blocks (both approved) should be added. The generator-distance figure stays unused and `VERIFY`. |
| **Claims — the main work** | **12 kWh figures and 10 percentages.** These are likely battery sizing, depth of discharge and efficiency. Expect a sizeable VERIFY / REWRITE / REMOVE table, like OG-26's sizing figures, which you ruled on. |
| NZ vs AU | any fridge-timing wording must follow the OG-11 rule: **NZ gets no timings** (MPI publishes none); AU uses NSW's. The electrical block already differs correctly between the markets. |
| Readiness blockers expected | claims and legacy navigation, not safety sourcing |

**Suggested approach:** the same workflow as OG-11 (audit → metadata → legacy → safety → NZ/AU → claims → re-skin →
PDF → verify), returning a claim table for the kWh and percentage figures before anything is rewritten.

**Stopped. OG-19 not prepared or deployed.**
