# CONTROLLED OWNER REVIEW — OG-B04, OG-B10, OG-25

**Nothing deployed. Awaiting your approval.**
**Date:** 21 September 2026

---

## The one thing that needs your words, not your tick

### OG-B04 — the Skool references, exactly as they appear

There are **two**, both in OG-B04. Neither OG-B10 nor OG-25 mentions Skool at all.

**Occurrence 1 — the header line beneath the title**

```html
<div class="header">
  <h1>Monthly Planning Challenge Template</h1>
  <p>OffGrid056 Skool Community | Reusable monthly challenge framework</p>
</div>
```

> **Original:** `OffGrid056 Skool Community | Reusable monthly challenge framework`
> **Proposed:** `OffGrid056 Member Community | Reusable monthly challenge framework`

**Occurrence 2 — the page footer**

```html
<div class="footer"> OFFGRID056.COM | SKOOL COMMUNITY MONTHLY CHALLENGE </div>
```

> **Original:** `OFFGRID056.COM | SKOOL COMMUNITY MONTHLY CHALLENGE`
> **Proposed:** `OFFGRID056.COM | MEMBER COMMUNITY MONTHLY CHALLENGE`

**What these changes do and do not do**

- Only the words `Skool Community` / `SKOOL COMMUNITY` change. Everything else in both lines is untouched.
- **No link is added.** There is no approved destination, so none is invented.
- **No new external platform is introduced.** "Member Community" is neutral and does not name a product.
- `OFFGRID056.COM` is kept: it is your own domain, not an external platform.

**Not yet applied.** OG-B04 stays `NEEDS_CONTENT_REVIEW` until you approve the wording.

A note on the alternative: I considered "OffGrid056 Member Resource Library", but the line describes a
*community* running a monthly challenge, not a library of documents. "Member Community" keeps the meaning.
If the monthly challenge no longer runs anywhere, the honest fix is to cut the clause rather than rename it —
say the word and I will propose that version instead.

---

## Per-resource review

### OG-B04 → `res-1504`

| # | | |
|---|---|---|
| 1 | Final migrated title | **Monthly Planning Challenge Template** |
| 2 | Resource type | planner |
| 3 | Foundation | general |
| 4 | NZ PDF | ✅ 2 pages · contains **111** · does not contain 000 · 0 unresolved tokens |
| 5 | AU PDF | ✅ 2 pages · contains **000** · does not contain 111 · 0 unresolved tokens |
| 6 | Safety blocks inserted | `general-disclaimer`, `emergency-contact` — both verified present in both PDFs |
| 7 | Terminology changes | none (no "5 Pillars", no bare "pillar") |
| 8 | Market token changes | `{{emergency.number}}`, `{{emergency.accessibility}}`, `{{agency.emergencyManagement}}`, `{{term.electrician}}`, `{{term.gasfitter}}`, `{{market.name}}` — all resolved in both markets |
| 9 | Branding changes | 5 legacy issues fixed: navy → Deep Green, gold → Resilience Green, orange → Earth Taupe, Playfair Display → Bebas Neue, Inter → Montserrat (served locally). 16 kinds of change. |
| 10 | Content-review flags | ⚠ **2 × Skool reference** (above) |
| 11 | Exact copy changes | **None applied.** Two proposed, awaiting your approval. |
| 12 | Validation | ✅ passes `ResourceSchema` |
| 13 | Import readiness | **NEEDS_CONTENT_REVIEW** |

### OG-B10 → `res-1510`

| # | | |
|---|---|---|
| 1 | Final migrated title | **90-Day Implementation Roadmap (Advanced)** |
| 2 | Resource type | planner |
| 3 | Foundation | general |
| 4 | NZ PDF | ✅ 3 pages · **111** · no 000 · 0 unresolved tokens |
| 5 | AU PDF | ✅ 3 pages · **000** · no 111 · 0 unresolved tokens |
| 6 | Safety blocks inserted | `general-disclaimer`, `emergency-contact` — verified in both |
| 7 | Terminology changes | none |
| 8 | Market token changes | same six tokens, all resolved |
| 9 | Branding changes | 5 legacy issues fixed; 16 kinds of change |
| 10 | Content-review flags | none |
| 11 | Exact copy changes | **none** — not a word of teaching content was altered |
| 12 | Validation | ✅ passes |
| 13 | Import readiness | **READY_AFTER_METADATA** |

### OG-25 → `res-1025`

| # | | |
|---|---|---|
| 1 | Final migrated title | **Project Support Brief Template** (the legacy code was stripped from the cover title) |
| 2 | Resource type | template |
| 3 | Foundation | general |
| 4 | NZ PDF | ✅ 7 pages · **111** · no 000 · 0 unresolved tokens |
| 5 | AU PDF | ✅ 6 pages · **000** · no 111 · 0 unresolved tokens |
| 6 | Safety blocks inserted | `general-disclaimer`, `emergency-contact` — verified in both |
| 7 | Terminology changes | `.cover-pillar` → `.cover-foundation` (a CSS class, not member-visible copy) |
| 8 | Market token changes | same six tokens, all resolved |
| 9 | Branding changes | 5 legacy issues fixed; 19 kinds of change; **broken cover image repointed**; footer strapline → `Prepare • Adapt • Thrive` |
| 10 | Content-review flags | none |
| 11 | Exact copy changes | **none** |
| 12 | Validation | ✅ passes |
| 13 | Import readiness | **READY_AFTER_METADATA** |

> **Why NZ is 7 pages and AU is 6:** the NZ emergency block is longer (it carries the free-call and 111 TXT
> wording), which pushes one line onto another page. Content is otherwise identical.

---

## Confirmations

| Check | Result |
|---|---|
| **All 224 tests pass** | ✅ 10 files, 0 failures |
| **Access blocks unauthenticated traffic** | ✅ `302 → cdn-cgi/access/login`, `auth_status: NONE`, checked just now |
| **OG-02 is the only real resource deployed** | ✅ live version is still `c4c83892`; nothing deployed since |
| **No additional real resource in GitHub** | ✅ `private-assets` untracked · `workspace` untracked · `data/resources` still **30 demo records** · only **1** private record exists, OG-02's · working tree clean |
| **`--real` remains disabled** | ✅ *"Refused: --real would write into the member library."* |

The three prepared resources live only in `workspace/prep/`, which is git-ignored. They are **not** in
`private-assets/`, so they cannot be picked up by a preview build even by accident.

---

## What is waiting on you

1. **Approve the two OG-B04 wording changes** (or tell me to cut the clause instead).
2. **Confirm the placeholder metadata** for all three — category (`planning`, the first for General) and
   estimated time (a flat 20 minutes; none of the documents state one).
3. **Then say the word** and I will apply the approved copy change, re-generate OG-B04's PDFs, stage all three
   into `private-assets/`, and deploy them to the private preview behind Access.

**Stopped before deploying OG-B04, OG-B10 or OG-25.**
