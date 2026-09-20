# Changelog

## V1 — 20 September 2026 · RELEASE READY (demo / private deployment)

Built in eight stages, each approved by the owner before the next began.

### Stage 1 — Project audit
Environment, existing assets and deployment options checked. Owner decided the project location, the stack, the
placeholder approach, local-first version control, and that the legacy 30-Day Programme would not be imported yet.

### Stage 2 — Architecture (approved)
Information architecture, routes, data schemas, component layers, storage abstraction, search and filter design,
responsive and accessibility targets, deployment and the migration path to accounts. Decisions D1–D10 recorded.

### Stage 3 — UI system (approved and locked)
App shell with a desktop sidebar, tablet drawer and mobile bottom bar; member dashboard; library with search and
filters; five foundation pages and 33 category pages; resource cards and badges; branded placeholder thumbnails;
empty states; breadcrumbs. Search handles typos and NZ/AU vs US/CA spellings. Filter state lives in the URL.

### Stage 4 — Member functionality (approved and locked)
Saved resources, completion tracking, recently viewed, Five Foundations progress, recommended next step, the
30-Day Programme with per-day completion and notes, and backup/restore. One versioned browser record
(`og056.member.v1`), corrupt-data recovery, an in-memory fallback when storage is blocked, and cross-tab updates.
**Locked field-level merge rules** with a regression test each.

### Stage 5 — Resource system (approved and locked)
Full resource detail; downloads with format, size (read from the file) and updated date; click-to-play video for
YouTube, Vimeo and direct files; reusable related-resource logic; learning paths; programme-linked resources and
worksheets; the supplier directory; the workshop system; and the Member Download Centre.

### Stage 6 — Mobile, accessibility and UX hardening (approved and locked)
Confirmed **Start Again** control; external workshop booking. Three narrow-screen bugs fixed. First-load
JavaScript cut by about 38 % (schema library kept out of the browser) and fonts by 158 KB. 72 page audits at
three widths: 0 contrast failures, 0 interface issues.

### Stage 7 — Final QC (approved)
Full release audit: build, routes, member state, resource system, responsive, accessibility, performance and
release safety — all passing. V1 documentation written.

### Stage 8 — Delivery packaging
This package.

## Notable decisions along the way

- Foundations are distinguished using the six locked brand colours only, never a new colour.
- "New" is worked out in the member's browser, so a static build never shows a stale badge.
- Progress is keyed on permanent resource ids, so renaming a resource never loses anyone's progress.
- Merge is the default restore; Replace is the clearly labelled destructive option.
- No booking engine: workshops link out to an external booking page.
- Demonstration content is marked everywhere, including inside the placeholder PDFs.

## Not in V1 (by design)

Authentication, paid-access enforcement, server or database syncing, quizzes, certificates, comments, reminders,
bookings inside the library, CRM or Skool integration, and the real OffGrid056 resource library.
