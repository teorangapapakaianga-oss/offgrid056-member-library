# PRIVATE PREVIEW — OG-B10 AND OG-25 DEPLOYED · OG-B04 HELD

**Date:** 22 September 2026 · commit `26a34e9` · Worker version `419662ea`
**Private preview only, behind Cloudflare Access. Nothing published.**

---

## Summary of what changed from the plan

| | Plan | Outcome |
|---|---|---|
| OG-B10 | deploy | ✅ **deployed** |
| OG-25 | deploy | ✅ **deployed** |
| OG-B04 | deploy after wording update | ⏸ **held** — two more community instructions found (§1) |
| — | — | 🔧 **a live market leak found and fixed** (§2) |

---

## 1. OG-B04 accountability wording

### The three you approved — applied and verified

| Original (exact) | Replacement (exact) |
|---|---|
| Weekly check-in day (when will you post progress?) | Weekly check-in day (when will you share progress with the Member Community or your support person?) |
| What you will share (photo, score, question, win) | What you will share at each check-in (photo, score, question, win) |
| Accountability partner (tag someone in community) | Accountability partner (someone from the Member Community, or a household member, friend or support person) |

Each matched exactly once. Verified present in both NZ and AU PDFs (the labels print in capitals, which is the
document's styling). No platform named, no link added, the Member Community concept kept.

### Why OG-B04 is held: two more instructions

Reading the rebuilt PDF turned up two further instructions that also require an active community. Both are
checkboxes in the **Weekly Breakdown** section, not among the three you listed:

| Original (exact) | Proposed replacement |
|---|---|
| □ Post insight in community | □ Share an insight (Member Community or support person) |
| □ Post results in community | □ Share results (Member Community or support person) |

A third checkbox, *"□ Share findings"*, does not assume a platform and I would leave it as it is.

You asked for exact wording before finalising if the changes went beyond the three instructions. They do, so
**neither change is applied and OG-B04 has not been deployed.** Approve these two and it is ready to go.

---

## 2. A market leak found in the live preview — and fixed

**The Member Downloads page was giving every member OG-02's New Zealand PDF, whatever their market.**

The resource page resolved markets correctly, but the Downloads page listed every resource by its default
`fileUrl` — and OG-02 still had one, pointing at the NZ file. An Australian member choosing *Download* there
would have received the 111 version. It was only reachable behind Access, but it broke the fail-closed rule you
approved, and deploying three more market-specific resources would have multiplied it.

**The fix is structural, not a patch to one page.** A resource with `marketFiles` may no longer also carry a
default `fileUrl` — the schema now rejects the combination. With no default file, no page that reads `fileUrl`
directly can leak one country's version.

The Downloads page now resolves the member's own market:

| Member's market | What the Downloads page offers |
|---|---|
| none chosen | **no file** — "Choose your market", linking to the resource page |
| New Zealand | the NZ file only |
| Australia | the AU file only |

One V1 test changed because `fileUrl` is now optional. It was **tightened, not weakened**: it now asserts that
every demo download has a file before checking where it points.

**Latent, not live:** programme days and workshops also read `fileUrl` directly. None of them references a real
resource today (checked), so nothing leaks. When programme days are linked to real resources, they will need the
same market handling.

---

## 3. Deployment result

```
✨ Success! Uploaded 514 files (310 already uploaded)
Current Version ID: 419662ea-48aa-4fae-b619-abddd56af23e
```

The pre-deploy gate ran 17 checks against the built output — **all passed** — including that OG-B04 was **not**
in the build, no Skool reference anywhere, Draft badges present, no unresolved tokens, and no importer code,
local paths or secrets.

---

## 4. Routes

| Resource | Route |
|---|---|
| OG-02 → `res-1002` | `/resources/household-risk-identifier/` |
| OG-B10 → `res-1510` | `/resources/90-day-implementation-roadmap-advanced/` |
| OG-25 → `res-1025` | `/resources/project-support-brief-template/` |
| OG-B04 → `res-1504` | *not deployed* |

---

## 5. NZ / AU resolution — tested in the built site, before upload

Tested on **both** the resource pages and the Member Downloads page:

| | Downloads page | Resource page | Note shown |
|---|---|---|---|
| **No market** | no files — "Choose your market" | chooser, no file | — |
| **NZ** — OG-02 | `household-risk-identifier.pdf` | same | "This version is for New Zealand" |
| **NZ** — OG-B10 | `…roadmap-advanced.NZ.pdf` | same | "This version is for New Zealand" |
| **NZ** — OG-25 | `…brief-template.NZ.pdf` | same | "This version is for New Zealand" |
| **AU** — OG-02 | `household-risk-identifier.AU.pdf` | same | "This version is for Australia" |
| **AU** — OG-B10 | `…roadmap-advanced.AU.pdf` | same | "This version is for Australia" |
| **AU** — OG-25 | `…brief-template.AU.pdf` | same | "This version is for Australia" |

**Every surface offers exactly one file, and never the other country's.** Draft badge present on all three
pages.

---

## 6. Direct PDF protection

Every request below, unauthenticated, returned **302 → `cdn-cgi/access/login`**, `auth_status: NONE`:

- all three resource routes
- `90-day-implementation-roadmap-advanced.AU.pdf`
- `project-support-brief-template.NZ.pdf`
- `household-risk-identifier.AU.pdf`

The OG-B04 route also returns 302. That is correct gate behaviour — Access covers every path whether or not the
file exists — so it cannot prove absence from outside. Absence is proved by the build check instead.

---

## 7. Verification

| Check | Result |
|---|---|
| `npm run import:verify-prep` | ✅ all 6 PDFs pass — correct emergency numbers, no error pages, no tokens, safety blocks present |
| NZ = 111 only / AU = 000 + 112 only | ✅ every file |
| Unintended external links | none |
| Layout | page counts unchanged |
| Approved `estimatedTime` present | ✅ 30 (OG-B10), 45 (OG-25) |
| Draft badge | ✅ all three pages |
| Real content in GitHub | ✅ none — `private-assets` untracked |
| `--real` | ✅ still refused |

---

## 8. Rollback

Three versions retained:

| Version | Contents |
|---|---|
| `2fab3d88` | demo only |
| `c4c83892` | demo + OG-02 |
| **`419662ea`** (live) | demo + OG-02 + OG-B10 + OG-25 |

Dashboard → Workers & Pages → `og056-preview` → Deployments → select a version → Rollback.

---

## 9. Tests

**224 passed, 0 failed.** Lint and typecheck clean. Tests were run on their own, not alongside a build, per the
documented rule.

---

## 10. Remaining owner decisions

1. **Approve the two OG-B04 checkbox changes** (§1). OG-B04 is then ready to deploy.
2. **Confirm difficulty.** This was never reviewed and was defaulting to *beginner*, which was plainly wrong for
   a resource titled *(Advanced)*. For the preview I set:
   - **OG-B10 → advanced** — taken from its own title
   - **OG-25 → intermediate** — a judgement; the document states no level
   - **OG-B04 → beginner** — not yet deployed
3. **The Downloads-page fix changed locked V1 behaviour** — only for market-specific resources; demo resources
   behave exactly as before. Worth your explicit sign-off since it touches V1 code.

**Stopped. The next Group-A resources have not been prepared or deployed.**
