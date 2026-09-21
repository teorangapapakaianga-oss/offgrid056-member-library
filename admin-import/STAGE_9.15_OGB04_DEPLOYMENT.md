# OG-B04 DEPLOYED TO THE PRIVATE PREVIEW

The protected preview now has all four Group-A resources approved so far: **OG-02, OG-B04, OG-B10 and OG-25**.
They are all drafts and all behind Cloudflare Access.

**Worker version:** `619b70d5-a292-431f-ad24-b7ae6849eabc` (previously `419662ea`)
**Date:** 22 September 2026

---

## OG-B04 metadata, final

| Field | Value |
|---|---|
| Resource ID | res-1504 |
| Title | Monthly Planning Challenge Template |
| Description | Reusable monthly challenge framework (from the document's header line) |
| Category | planning |
| Type | planner |
| Estimated time | 15 min (owner-approved) |
| Difficulty | **beginner — OWNER-APPROVED CLASSIFICATION, not source-derived** |
| Status | draft |

The source does not state a difficulty. The recorded reason for your classification: 2 pages, about 15
minutes, a short-answer planning activity, no technical content, no specialist knowledge needed.

---

## 1. Worker version

`619b70d5-a292-431f-ad24-b7ae6849eabc`

## 2. OG-B04 route

`/resources/monthly-planning-challenge-template/`

Its files:

- `/resources/monthly-planning-challenge-template.NZ.pdf`
- `/resources/monthly-planning-challenge-template.AU.pdf`

## 3. NZ result

- An NZ member gets the **NZ file only**, on both the resource page and the Downloads page.
- The NZ PDF contains **111** and no 000 or 112.

## 4. AU result

- An AU member gets the **AU file only**, on both the resource page and the Downloads page.
- The AU PDF contains **000 and 112** and no 111.

## With no market chosen

**No download** for any of the four resources. The Downloads page shows *Choose your market* for each of them,
and each resource page shows the chooser.

The Draft badge shows on all four resource pages.

## Content checks (OG-B04, both PDFs)

| Check | NZ | AU |
|---|---|---|
| All 7 approved changes present (plus the unchanged *Share findings*) | 8/8 | 8/8 |
| Old Skool / posting wording left | none | none |
| Unresolved tokens | 0 | 0 |
| External links | none | none |
| Browser-error page | no (2 pages, real content) | no (2 pages, real content) |
| `import:verify-prep` | ✓ | ✓ |

`import:verify-prep` passes on all 6 prepared PDFs.

---

## 5. Access protection

Checked without signing in. All returned **302 → Cloudflare Access login**, with `auth_status: NONE`:

- `/`
- `/downloads/`
- `/resources/monthly-planning-challenge-template/`
- `monthly-planning-challenge-template.NZ.pdf`
- `monthly-planning-challenge-template.AU.pdf`
- `household-risk-identifier.pdf`
- `90-day-implementation-roadmap-advanced.NZ.pdf`
- `project-support-brief-template.AU.pdf`

## 6. Tests

**224 passed** (10 files). Lint and typecheck clean.

## 7. Rollback status

**Available.** The previous version, `419662ea` (OG-02, OG-B10 and OG-25), is still in the deployment history.
To restore it:

```
node_modules\.bin\wrangler.cmd rollback 419662ea-48aa-4fae-b619-abddd56af23e
```

## 8. Protected preview contents

| Code | Resource | Difficulty | Time |
|---|---|---|---|
| OG-02 | Household Risk Identifier | beginner (pilot record) | 20 |
| OG-B04 | Monthly Planning Challenge Template | beginner (owner-approved) | 15 |
| OG-B10 | 90-Day Implementation Roadmap (Advanced) | advanced (source-supported) | 30 |
| OG-25 | Project Support Brief Template | intermediate (owner-approved) | 45 |

All four are drafts, market-aware (NZ/AU) and behind Access.

---

## Security

- **Public GitHub:** no real resource committed. The four private records and eight PDFs sit in
  `private-assets/`, which is git-ignored. The build staged them and then removed them (12 files).
- **`--real`:** still refused.

**Stopped. No further Group-A resources prepared or deployed.**
