# OG-B04 FINAL WORDING APPLIED · DIFFICULTY NEEDS YOUR DECISION

**OG-B04 is not deployed.** Its wording is final and verified, but it has no difficulty level, and the library
cannot accept a resource without one. You ruled that I must not invent one, so it is one decision from
deployment.

**Nothing was deployed this stage.** The live preview is unchanged at version `419662ea`.
**Date:** 22 September 2026

---

## 1. OG-B04 final wording

Seven approved changes, each matched **exactly once**, applied to the migrated document only:

| Where | Original | Final |
|---|---|---|
| Header | OffGrid056 **Skool** Community \| Reusable monthly challenge framework | OffGrid056 **Member** Community \| Reusable monthly challenge framework |
| Footer | OFFGRID056.COM \| **SKOOL** COMMUNITY MONTHLY CHALLENGE | OFFGRID056.COM \| **MEMBER** COMMUNITY MONTHLY CHALLENGE |
| Weekly check-in | Weekly check-in day (when will you post progress?) | Weekly check-in day (when will you share progress with the Member Community or your support person?) |
| What to share | What you will share (photo, score, question, win) | What you will share at each check-in (photo, score, question, win) |
| Accountability partner | Accountability partner (tag someone in community) | Accountability partner (someone from the Member Community, or a household member, friend or support person) |
| Insight checkbox | □ Post insight in community | □ Share an insight (Member Community or support person) |
| Results checkbox | □ Post results in community | □ Share results (Member Community or support person) |

**Unchanged, as you ruled:** *□ Share findings*.

**Verified in both the NZ and AU PDFs:** all eight final phrases present (including the unchanged *Share
findings*), and **none** of the old wording left — no Skool, no "post progress", no "tag someone", no "Post
insight in community", no "Post results in community".

---

## 2. OG-B04 difficulty — recommendation

**The document states no level.** I searched its visible text for *beginner, intermediate, advanced,
difficulty, level, skill* and *experience*: zero matches. So nothing in the source supports a difficulty.

**Recommendation: beginner.** Two pages, fifteen minutes, short reflective answers, and a reusable monthly
template with nothing technical in it. If you approve it, it will be recorded as an
**OWNER-APPROVED CLASSIFICATION, not source-derived** — the same standing as OG-25.

It is recorded as `NEEDS_OWNER_REVIEW` in `config/metadata-review.json`. The prep pipeline now **refuses** to
build a record without a reviewed difficulty, and reports `NEEDS_OWNER_METADATA`.

### Why the default is gone

The prep pipeline used to set every resource to *beginner* unless told otherwise. That default is how
*90-Day Implementation Roadmap (Advanced)* ended up labelled beginner. It has been removed: a difficulty now
comes only from a reviewed value, and without one validation fails on purpose.

### Difficulty now recorded, with where each came from

| Resource | Difficulty | Standing |
|---|---|---|
| OG-B10 | advanced | **Source-supported** — its own title reads *90-Day Implementation Roadmap (Advanced)* |
| OG-25 | intermediate | **Owner-approved classification** — not source-derived |
| OG-B04 | *unset* | **NEEDS_OWNER_REVIEW** — recommendation: beginner |

One thing I checked so the OG-25 record stays honest: its only use of the word *level* is a form field,
*"Target Resilience Level (Days of autonomy desired)"*. That is about the member's household, not the document's
difficulty. A plain search would have mistaken it for a stated level, so the record says so explicitly.

---

## 3. Downloads-page fix — verified

Tested against the deployed build (the same artefact that is live), in three market states, across both the
Downloads page and each resource page:

| Market | Downloads page | Resource pages | Chooser shown |
|---|---|---|---|
| **none** | no files — "Choose your market" on all three | no files | ✅ yes |
| **NZ** | NZ file for each of the three | NZ file for each | no |
| **AU** | AU file for each of the three | AU file for each | no |

**18 of 18 combinations correct.** Every surface offers exactly one file, never the other country's, and nothing
before a market is chosen. The stricter content rule — no default file alongside per-market files — is in place
and locked, as approved.

---

## 4. Deployment result

**No deployment this stage.** OG-B04 is held on its difficulty, and nothing else changed, so there was nothing to
deploy.

## 5. Worker version

**`419662ea-48aa-4fae-b619-abddd56af23e`** — unchanged, containing OG-02, OG-B10 and OG-25.

---

## 6. Market-resolution results

| Resource | NZ member | AU member | No market |
|---|---|---|---|
| OG-02 | `household-risk-identifier.pdf` | `household-risk-identifier.AU.pdf` | no file |
| OG-B10 | `…roadmap-advanced.NZ.pdf` | `…roadmap-advanced.AU.pdf` | no file |
| OG-25 | `…brief-template.NZ.pdf` | `…brief-template.AU.pdf` | no file |
| OG-B04 | *not deployed* | *not deployed* | — |

Draft badge shown on all three deployed resources in every market state.

OG-B04's own files are ready and verified: NZ contains 111 only, AU contains 000 and 112 only.

---

## 7. Direct PDF protection

All returned **302 → `cdn-cgi/access/login`**, `auth_status: NONE`, unauthenticated:

- `/downloads/`
- `household-risk-identifier.pdf`
- `90-day-implementation-roadmap-advanced.NZ.pdf`
- `project-support-brief-template.AU.pdf`

---

## 8. Tests

**224 passed, 0 failed.** Lint and typecheck clean. `npm run import:verify-prep` passes on all six prepared PDFs,
page counts unchanged.

| Check | Result |
|---|---|
| Real content in GitHub | none — three private records (OG-02, OG-B10, OG-25), all untracked |
| `--real` | still refused |

---

## 9. Remaining owner decisions

1. **OG-B04 difficulty.** Approve *beginner* as an owner-approved classification, choose another level, or keep
   it held. **Approving it is the only thing between OG-B04 and deployment** — its wording, PDFs and checks are
   all done.

**Stopped. No further Group-A resources prepared or deployed.**
