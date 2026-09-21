# PRIVATE PREVIEW — DEPLOYMENT PREPARATION

**Status: prepared and verified locally. NOT DEPLOYED — blocked on one step only you can take.**
**Date:** 21 September 2026

---

## The blocker, first

Deploying needs `wrangler login`, which opens a browser and signs in to **your** Cloudflare account. **I will
not authenticate as you** — signing into accounts on your behalf is a line I don't cross, whoever asks.

Configuring Cloudflare Access is the same: it happens in your Cloudflare dashboard, under your login.

So everything up to that point is done and verified. **Two commands and one dashboard task remain**, in §9.

---

## 1. Pages project name

**`og056-preview`** — proposed, not yet created.

Chosen to be unmistakably a preview, and separate from any future `og056-members` production project so a
preview deployment can never become the live site by accident.

---

## 2. Private preview URL

**Not yet issued.** After the deploy it will be **`https://og056-preview.pages.dev`**.

Per your ruling this stays on the default `*.pages.dev` domain — no branded OffGrid056 subdomain, which keeps
the pilot undiscoverable and avoids tying the temporary architecture to the production domain.

---

## 3. Access policy summary (designed, not yet applied)

| Setting | Value |
|---|---|
| Application type | Self-hosted |
| Application domain | `og056-preview.pages.dev` |
| Path | `*` — the **entire** site, including downloads, JSON and assets |
| Policy | **Allow** |
| Rule | **Emails** → an explicit list you provide |
| Identity provider | **One-time PIN** (emailed code, expires after 10 minutes) |
| Session duration | 24 hours (suggested) |

No wildcard domains, no "anyone with the link", no public bypass. The gate covers everything — there is no
route that serves a file without passing it.

---

## 4. Allow-list status

**Empty — awaiting your addresses.** Owner-only to start, as ruled. I have deliberately not guessed at an
email address to seed it with.

---

## 5. Deployment result

**Not deployed.** The artefact is built and verified locally; nothing has been uploaded anywhere. The only
preview that has existed is `127.0.0.1`, on this machine.

---

## 6. Resource validation result

`res-1002` — Household Risk Identifier:

```
Content validation passed.
Content: 31 resources (30 published, 30 placeholder/demo) · 3 learning paths
```

| Check | Result |
|---|---|
| Schema | Passes the member library's own `ResourceSchema` |
| Status | **draft** — per owner decision D9-7 |
| Download | 291 KB PDF, 5 pages, generated from the re-skinned HTML |
| NZ PDF content | contains **111** · not 000, not 112 |
| AU PDF content | contains **000** and **112** · not 111 |
| Renders | Title, badges, description, 20 min, Beginner, Planning, Open/Download, Mark as complete, What you will learn |
| noindex | Active — `noindex, nofollow` on the resource page |

**Owner-approved classifications recorded:** OG-22 → Worksheet, OG-B11 → Guide.

---

## 7. How real content stays out of the public repository

This needed more care than expected, and I changed the approach twice.

**The problem:** `public/` is copied wholesale into every build. A member PDF left there would be in *every*
build, including a production one. And a resource record sitting in `data/` without its download makes content
validation fail.

**The mechanism now:**

```
private-assets/                      ← git-ignored, never committed
  resources/*.pdf                    → staged into public/resources/ for the preview build only
  data-resources/*.private.json      → staged into data/resources/ for the preview build only
```

`npm run build:preview` stages both, builds with `OG056_INCLUDE_DRAFTS=1`, then removes them again — including
if the build fails, via an exit handler. A plain `npm run build` sees neither.

**Proven:**

| | Files | Size | OG-02 route | Private PDF | Draft badge |
|---|---:|---:|---|---|---|
| `npm run build` (production) | **800** | **20.03 MB** | absent | absent | absent |
| `npm run build:preview` | 808 | 20.98 MB | present | served | present |

After the preview build: `public/resources` 0 files, `data/resources` back to 30 records, `git status` clean.
**The production build is byte-for-byte the locked V1 baseline.**

### Two changes to locked V1 code — both need your sign-off

1. **`lib/content/repository.ts`** — `getResources()` now also returns drafts when `OG056_INCLUDE_DRAFTS=1`.
   Production sets nothing, so its behaviour is unchanged.
2. **A `Draft` badge** on the resource detail page, rendered only when `status === "draft"`. Without it an
   unreviewed import is indistinguishable from approved content — a poor thing to hand someone who is
   reviewing it. A production build never loads a draft, so it never renders there.

---

## 8. Confirmation: no real member content in the public repository

**Verified.**

- **0** real member records tracked. `data/resources` holds **30 records, all `isPlaceholder: true`**.
- **0** real downloads tracked. The 25 PDFs in `public/resources/<foundation>/` are the V1 demonstration
  placeholders from Stage 5 — 40 KB, one page each, stating *"DEMONSTRATION ENTRY … It contains no OffGrid056
  guidance."*
- `household-risk-identifier.private.json`, its two PDFs and the whole of `private-assets/` are **ignored and
  untracked**.
- `res-1002` appears in the repository **only** in these stage reports, as a proposed identifier — never as
  member content.

---

## 9. What remains — two commands and one dashboard task

**Step 1 — you authenticate** (once):

```bash
npx wrangler login
```

**Step 2 — I build and deploy** (or you run it):

```bash
npm run build:preview
npx wrangler pages project create og056-preview --production-branch main
npx wrangler pages deploy out --project-name og056-preview
```

**Step 3 — you configure Access, before sharing the URL:**
Cloudflare dashboard → **Zero Trust → Access → Applications → Add → Self-hosted** → domain
`og056-preview.pages.dev`, path `*` → policy **Allow / Emails / your addresses** → identity **One-time PIN**.

> **Sequencing matters.** A Pages deployment is live the moment it uploads, and Access is configured
> afterwards — so there is a window where the URL is reachable by anyone who knows it. Two ways to close it:
> **(a)** deploy the *production* build first (demo content only, no member material), configure Access,
> confirm the gate, then deploy the preview build; or **(b)** accept a short window with an unguessable URL.
> **I recommend (a)** — it costs one extra deploy and means no real resource is ever exposed, even briefly.

---

## 10. Rollback

| Level | How | Speed |
|---|---|---|
| **Deployment** | Cloudflare Pages keeps every deployment: "Rollback to this deployment" in the dashboard | immediate |
| **Take it down entirely** | Delete the Pages project, or set the Access policy to allow nobody | immediate |
| **Build** | `git checkout <sha> && npm ci && npm run build` — output is reproducible from any commit | minutes |
| **The draft import** | Delete `private-assets/data-resources/household-risk-identifier.private.json`. Nothing in `data/` or git changes | immediate |
| **Content** | The import engine backs up any replaced record before writing; nothing has been replaced | — |

**The pilot is fully reversible.** The real library still has 30 resources and no `household-risk-identifier`
record. 7 audit-log entries record what the pilot did.

---

## 11. Screenshots

Provided, from the local preview build:

| # | Screenshot | File |
|---|---|---|
| 1 | Dashboard | `workspace/pilot/preview/1_dashboard.png` |
| 2 | **OG-02 resource page, with the Draft badge** | `workspace/pilot/preview/2_og02_resource.png` |
| 3 | NZ market rendering (111, TXT service, Civil Defence) | `workspace/pilot/comparison/safety_NZ.png` |
| 4 | AU market rendering (000, 112, 106 NRS, SES) | `workspace/pilot/comparison/safety_AU.png` |

**The login gate cannot be screenshotted yet** — it does not exist until Access is configured against a real
deployment. It is the first thing I will capture once you have done step 1, and I will verify the gate blocks
an unauthenticated request before anything else is deployed.

---

## 12. Verification

| Check | Result |
|---|---|
| Tests | **202 passed, 0 failed** (9 files) |
| Lint | clean |
| Production build | **800 files, 20.03 MB, 956 KB JS — the locked baseline** |
| Preview build | 808 files, 20.98 MB, staging cleaned up, `git status` clean |
| noindex | active |
| Public repo | no real member content |
| Draft reversible | yes |

One thing worth recording honestly: during an intermediate run, **2 tests failed once** while a build was
writing to `out/` concurrently. They did not reproduce across four subsequent runs under both flag states, and
I could not identify a cause. Noting it rather than leaving it unsaid.

---

## 13. Decisions needed

1. **Run `npx wrangler login`**, then tell me and I will deploy.
2. **The allow-list email addresses.**
3. **Deploy order** — my recommendation is production-build-first so no real resource is ever exposed, even
   briefly (§9).
4. **Approve the two V1 changes** — the drafts flag and the Draft badge (§7).

**Nothing deployed. No remaining Group-A resources migrated. `--real` still disabled.**
