# MARKET SELECTION + GROUP-A EXPANSION PREP — OWNER REVIEW

**Nothing deployed. No additional Group-A resource deployed. `--real` still disabled.**
**Date:** 21 September 2026 · commit `6c2c0c9`

---

## 1. Market-selection architecture

The member chooses. **Nothing is inferred** — no IP lookup, no locale sniffing, no silent switching. A test
asserts that the stored value contains only a market code and a timestamp, and that the words `lat`, `lon`,
`geo`, `ip`, `coords` and `timezone` appear nowhere in it.

| Piece | What it does |
|---|---|
| `lib/member/market.ts` | The markets on offer (NZ, AU) and the planned ones (US, CA). Plain types, browser-safe. |
| `MarketIndicator` | The quiet line in the sidebar: *Market: New Zealand · Change*. |
| `MarketChooser` | The first-visit prompt, shown where market-dependent content would be. |
| `MarketGate` | Wraps anything that cannot be shown safely until a market is known. |
| `MarketDownload` | Picks the member's file, and only theirs. |

### Fail-closed, in three distinct ways

1. **No market chosen** → the download panel shows the chooser instead of a file. Verified in the browser:
   with storage cleared, the page offered **zero** download links.
2. **Market chosen, no file for it** → "Not available for *market* yet… We would rather show you nothing than
   show you another country's answer."
3. **A required market field unverified** → `publishable()` returns false and the token stays visible, as
   built in 9.6B.

---

## 2. Storage and schema impact

**`schemaVersion` is unchanged, deliberately.** Bumping it would make every existing member's state "unknown
version" and reset their progress — a far worse outcome than one absent field.

```ts
market?: { code: "NZ" | "AU"; at: string } | null;
```

| Concern | Handling |
|---|---|
| Old V1 state with no `market` key | Migration fills it as `null`; validation accepts its absence. **Verified: `recovered: false`, saved progress intact.** |
| Invalid stored value | Rejected by validation (`state.market.code`), document recovered rather than half-trusted. |
| Extra keys smuggled in | Rejected — a `lat` alongside `code` fails the check. |
| Backup / restore | Flows through automatically; a backup made before markets existed restores fine. |
| Merge (two devices) | **New rule 7**, shaped exactly like rule 6: the newest deliberate choice wins, and a side that never chose can never unset one that did. Compared as instants, so a different time zone does not win on string order. |
| Stage 4 rules | Untouched. A test asserts rule 1 (earliest date wins) still holds while rule 7 applies. |

---

## 3. UI

Screenshots attached:

| # | What |
|---|---|
| 1 | First visit — chooser in the download panel, no file offered |
| 2 | NZ selected — NZ download + "This version is for **New Zealand**" |
| 3 | AU selected — AU download + "This version is for **Australia**" |

The chooser explains itself: *"Choose your market so OffGrid056 can show the correct emergency numbers, safety
guidance and local resources"*, and states plainly that it is kept in this browser only, is not an account,
and that location is never detected or stored.

---

## 4–5. OG-02 switching results

| | NZ selected | AU selected |
|---|---|---|
| Download served | `household-risk-identifier.pdf` | `household-risk-identifier.AU.pdf` |
| Note shown | "This version is for New Zealand" | "This version is for Australia" |
| Stored state | `{ code: "NZ", at: … }` | `{ code: "AU", at: … }` |
| Indicator | Market: New Zealand | Market: Australia |

Switching was done through the interface itself — the sidebar's **Change** control — not by editing storage.
**Only one file is ever offered.** Persistence survives reload.

---

## 6. Backup and restore

- A backup taken with a market carries it, and restores it.
- A backup made **before** markets existed restores cleanly, with the market simply unset.
- Merging an old backup into a device that has since chosen a market **cannot unset it**.

---

## 7. Test results

**224 tests pass, 0 failures.** Lint and typecheck clean.

| Suite | Tests |
|---|---:|
| V1 member library | 58 (unchanged) |
| **Market selection (new)** | **20** |
| Re-skin + safety injection | 24 (2 new) |
| Importer, admin review, engine, audit, market resolution | 122 |

The 20 market tests cover every area you listed: first-visit, NZ, AU, switching, persistence, backup, restore,
merge, invalid stored value, old V1 state without the field — plus "no location is ever collected".

**Cloudflare Access is untouched and still protects everything** — verified again after this work: the root
returns `302 → cdn-cgi/access/login`, `auth_status: NONE`. **No market preference can leak into GitHub**: it
lives only in the member's browser, and `git status` is clean.

### One honest note on the production build

| | Files | Total | JS |
|---|---:|---:|---:|
| Before | 800 | 20.03 MB | 956 KB |
| After | 800 | **20.41 MB** | **868 KB** |

File count identical, OG-02 still absent, no private download. But the size moved: **+0.38 MB overall, −88 KB
of JavaScript**. The cause is that the market indicator is a client component in the sidebar, and the sidebar
renders on every page, so every page's RSC payload changed and the chunks were reorganised.

That is a direct consequence of the visible indicator you asked for, not a regression — but it does mean the
build is **no longer byte-identical to locked V1**, and you should know that rather than discover it. If you
would rather keep the build untouched, the indicator can move to the dashboard and resource pages only.

---

## 8. Group-A prep — OG-B04, OG-B10, OG-25

Prepared, **not deployed**. Each has migrated HTML and a PDF **per market**, in `workspace/prep/`.

| | OG-B04 | OG-B10 | OG-25 |
|---|---|---|---|
| Proposed id | `res-1504` | `res-1510` | `res-1025` |
| Title | Monthly Planning Challenge Template | 90-Day Implementation Roadmap (Advanced) | Project Support Brief Template |
| Description | "Reusable monthly challenge framework" | "Automated milestone tracking, budget burn-down, dependency mapping" | "Day 25 — A professional brief anyone can understand" |
| Source of description | the document's own header | the document's own header | the document's own cover subtitle |
| Foundation / type | general / planner | general / planner | general / template |
| Legacy brand issues | 5 | 5 | 5 |
| Re-skin changes | 16 kinds | 16 kinds | 19 kinds |
| NZ | publishable · **111** | publishable · **111** | publishable · **111** |
| AU | publishable · **000** | publishable · **000** | publishable · **000** |
| Validation | passes | passes | passes |
| **Readiness** | **NEEDS_CONTENT_REVIEW** | READY_AFTER_METADATA | READY_AFTER_METADATA |

**No member-facing copy was invented.** Every title and description was taken from the document itself; where
one is missing, the prep reports `MISSING — owner must write it` rather than filling it in.

Verified by parsing the six generated PDFs: each contains its own market's emergency number, **none contains
the other's**, zero unresolved tokens, and both safety blocks present.

### Two findings

1. **A real safety bug, found by doing this work.** `injectSafety` only matched `<div class="content">`, which
   the *bonus* templates do not have — so the emergency block was **silently dropped from OG-B04 and OG-B10**.
   Their first PDFs contained **no emergency number at all**. It now falls back to the top of `<body>`,
   `injectSafetyChecked` reports any block it could not place, and an unplaced block **blocks publication**
   instead of passing quietly. Two regression tests cover it. Had this not been caught, the same failure would
   have applied to every bonus resource in Group B.
2. **OG-B04 references a "Skool Community"** — a platform outside the member library. Flagged
   `NEEDS_CONTENT_REVIEW`; it needs your decision before it can be imported.

---

## 9. Owner decisions required

1. **The build is no longer byte-identical to V1** (§7). Accept the +0.38 MB for a sidebar indicator on every
   page, or move the indicator to fewer pages?
2. **OG-B04's Skool reference** — remove it, replace it with the member library, or keep it?
3. **Categories are placeholders.** The audit does not settle a category, so each prepped resource uses its
   foundation's first one. They need your confirmation before import.
4. **Estimated times are a flat 20 minutes** for the three prepped resources — the documents do not state one.
5. **US and CA** remain designed-for but unverified. Nothing to do now; confirm they stay that way until
   NZ/AU launch is done.
6. **Deploy the three prepped resources to the private preview?** They are ready; nothing has been deployed.

**Stopped before deploying any additional Group-A resource.**
