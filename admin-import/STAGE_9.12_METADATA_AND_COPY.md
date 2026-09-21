# METADATA + APPROVED COPY — OG-B04, OG-B10, OG-25

**Nothing deployed.** Awaiting your approval of the estimated times.
**Date:** 22 September 2026

---

## 1. Estimated time — proposed, per resource

Measured from each document rather than guessed, and rounded to your scale. Each estimate assumes a first
pass **with the needed information to hand**; none includes time spent gathering quotes or measurements.

| Resource | **Proposed** | Pages | Words | Fill-in fields | What the member actually does |
|---|---:|---:|---:|---:|---|
| **OG-B04** Monthly Planning Challenge | **15 min** | 2 | 164 | 9 + 16 checkboxes | nine short reflective answers — month, theme, why it matters, check-in day, baseline, target |
| **OG-B10** 90-Day Roadmap (Advanced) | **30 min** | 3 | 184 | 24 + 12 checkboxes | budget burn-down with arithmetic (days 30/60/90, a 10–20% contingency), phases, dependency mapping |
| **OG-25** Project Support Brief | **45 min** | 6–7 | 425 | 24 labelled fields | a brief for a tradesperson: scope of works, commercial terms, evaluation criteria |

**The reasoning, briefly:**

- **OG-B04 — 15 min.** About a minute to read, then short answers of a line or two. It is reused monthly, so
  this is per month.
- **OG-B10 — 30 min.** Short to read but the most thinking *per field*: budget figures need working out, and
  mapping dependencies means reasoning about the order of actions. It is labelled Advanced and assumes a plan
  already exists.
- **OG-25 — 45 min.** The longest document and the most demanding writing. A scope of works and commercial
  terms are real work. **If the member does not yet know what they want done, it will take longer** — that
  preparation is not in the estimate.

All three documents supported an estimate, so none is left unset. The values are recorded in
`config/metadata-review.json` as **proposed**, with the evidence beside each.

---

## 2. OG-B04 wording — applied

Both approved changes applied to the **migrated** HTML only. The original source file is untouched.

| Where | Before | After | Matched |
|---|---|---|---|
| Header line | OffGrid056 **Skool** Community \| Reusable monthly challenge framework | OffGrid056 **Member** Community \| Reusable monthly challenge framework | ✅ exactly once |
| Footer | OFFGRID056.COM \| **SKOOL** COMMUNITY MONTHLY CHALLENGE | OFFGRID056.COM \| **MEMBER** COMMUNITY MONTHLY CHALLENGE | ✅ exactly once |

- No other teaching copy was altered.
- `OFFGRID056.COM` kept. No link added.
- Recorded in `config/approved-copy.json` with your approval date and reason.

**Built so it cannot misfire:** a change applies only if the original wording matches exactly as many times as
you approved. If the source is later edited and the sentence changes or appears twice, the change is refused
and flagged — approved-looking wording will never land somewhere nobody approved it.

---

## 3. Rebuilt NZ / AU validation

| | Pages | NZ = 111 only | AU = 000 / 112 only | Tokens | Skool | New links | Validation |
|---|---:|---|---|---:|---|---:|---|
| OG-B04 NZ | 2 | ✅ | — | 0 | none | 0 | ✅ |
| OG-B04 AU | 2 | — | ✅ | 0 | none | 0 | ✅ |
| OG-B10 NZ | 3 | ✅ | — | 0 | none | 0 | ✅ |
| OG-B10 AU | 3 | — | ✅ | 0 | none | 0 | ✅ |
| OG-25 NZ | 7 | ✅ | — | 0 | none | 0 | ✅ |
| OG-25 AU | 6 | — | ✅ | 0 | none | 0 | ✅ |

- **No layout break:** every page count matches the pre-change baseline exactly.
- **"Member Community" is present** in both OG-B04 files; **"Skool" appears in none** of the six.
- **No new external dependency:** zero links added relative to the source; fonts served locally.
- Both safety blocks present in all six.

### A near-miss worth telling you about

The first rebuild of **OG-B04's NZ PDF was wrong**: 1 page, 172 characters, no emergency number. Reading it back
showed it was **Chrome's own "This site can't be reached" page** — it had rendered before the local server was
listening. The HTML was perfect; the PDF was an error page that looked like any other PDF.

Re-rendered and re-verified. More importantly, it is now a permanent gate:

```
npm run import:verify-prep
```

It reads every prepared PDF back and fails if it finds a browser error page, suspiciously little text,
unresolved tokens, a missing safety block, or the wrong market's emergency number. **It exits non-zero on
failure** — and I proved that by feeding it an Australian PDF labelled as New Zealand, which it rejected:
*"NZ file without 111; NZ file contains an Australian number."*

---

## 4. Final import readiness

| Resource | Readiness | Blocking on |
|---|---|---|
| **OG-B04** → `res-1504` | **READY_AFTER_METADATA_AND_COPY_APPROVAL** | your approval of 15 min |
| **OG-B10** → `res-1510` | **READY_AFTER_METADATA** | your approval of 30 min |
| **OG-25** → `res-1025` | **READY_AFTER_METADATA** | your approval of 45 min |

Category `planning` applied to all three, as approved.

---

## 5. Confirmations

| Check | Result |
|---|---|
| Tests | **224 passed**, 0 failed |
| Lint / typecheck | clean |
| Access blocks unauthenticated traffic | ✅ `302 → cdn-cgi/access/login`, `auth_status: NONE` |
| OG-02 the only real resource deployed | ✅ live version still `c4c83892` |
| No new real resource in GitHub | ✅ `private-assets` holds OG-02 only; nothing real tracked; `data/resources` 30 demo |
| `--real` disabled | ✅ refused |

---

## 6. Remaining owner decisions

1. **Approve the three estimated times** — 15, 30 and 45 minutes.
2. **OG-B04's Community Engagement section** — a finding outside the two lines you approved, so I have **not**
   changed it. It still asks members to:
   - *"Weekly check-in day (when will you post progress?)"*
   - *"What you will share (photo, score, question, win)"*
   - *"Accountability partner (tag someone in community)"*

   These assume a community platform where members post and tag each other. With "Skool" removed, "Member
   Community" now names something that may not exist yet. If there is no member community in place, these
   three fields describe an activity nobody can do. Options: keep them for a community you plan to run, reword
   them as personal accountability, or leave OG-B04 until the community exists.
3. **Then approve deployment** of the three to the private preview. Nothing has been deployed.

**Stopped before deployment.**
