# DEMO-ONLY DEPLOYMENT — LIVE — AWAITING ACCESS

**Deployed:** demo/placeholder content only. **OG-02 is NOT deployed and returns 404.**
**Access is not yet configured, so the demo content is currently public** — the approved order.
**Date:** 21 September 2026

---

## 1. Wrangler version pinned

**`wrangler` 4.135.0** — exact, in `devDependencies`. Pinned rather than ranged so a deployment cannot change
underneath us.

This time it was added deliberately. The earlier autoconfig attempt added it as a side effect together with a
reformatted `package.json`; that was reverted before anything was kept.

---

## 2. Files changed

| File | Change |
|---|---|
| `package.json` | **+2 / −1 lines** — one dependency added, existing formatting preserved |
| `package-lock.json` | +9,570 / −8,582 lines |
| `wrangler.jsonc` | new — Workers static-assets configuration |
| `docs/SETUP.md` | the tests-and-builds concurrency rule (previous commit) |

### The lockfile churn — checked, not assumed

You said not to accept unrelated package churn, so I compared the two lockfiles package by package rather
than trusting the line count:

```
packages before 541   after 601   (+60)
EXISTING packages with a changed version: 0
packages removed: 0
packages added: 60  — all within wrangler's own tree
```

**Nothing existing moved.** The large line count is npm rewriting the file's layout, not dependency drift.

---

## 3. Workers configuration

`wrangler.jsonc` — static assets only. **No Worker script, no server-side code.**

```jsonc
{
  "name": "og056-preview",
  "compatibility_date": "2026-09-21",
  "assets": {
    "directory": "./out",
    "not_found_handling": "404-page"
  },
  "workers_dev": true,
  "observability": { "enabled": true }
}
```

**`404-page`, deliberately not `single-page-application`.** SPA handling would serve `index.html` for any
missing path — so a mistyped resource URL would render the dashboard and look like it worked. This site is
genuinely multi-page; a missing page should say so.

The file carries a warning in its comments: `wrangler deploy` uploads **whatever is currently in `out/`**, so
the build you ran last decides what is published.

---

## 4. Locked V1 build comparison

| | Files | Size | JS |
|---|---:|---:|---:|
| Baseline (before wrangler) | 800 | 20.03 MB | 956 KB |
| **After wrangler added** | **800** | **20.03 MB** | **956 KB** |

Unchanged. Also verified after a clean `npm ci` into an empty `node_modules`.

---

## 5. Demo-only deployment result

Eleven checks ran against `out/` immediately before upload — **all passed**:

```
PASS  800 locked V1 files          PASS  no importer code
PASS  OG-02 absent                 PASS  no local paths (C:\Users, OneDrive)
PASS  OG-02 download absent        PASS  no secrets/tokens
PASS  no "Household Risk..." text  PASS  noindex active (123 pages)
PASS  no private-assets            PASS  robots.txt present
                                   PASS  404 page present
```

```
✨ Success! Uploaded 555 files (245 already uploaded)
Deployed og056-preview triggers
Current Version ID: 2fab3d88-92a6-4a6d-b03a-fd1a0a710446
```

Cloudflare confirms it live at 100% traffic, deployed by `teorangapapakaianga@gmail.com`.

### Verified against the live site

| Check | Result |
|---|---|
| Library loads | ✅ "Member Resource Library \| OffGrid056", heading "Welcome back" |
| `robots.txt` | ✅ `User-agent: *` / `Disallow: /` — all crawlers blocked site-wide |
| Demo resource | ✅ serves, and states *"This is placeholder content used to build and test the Member Resource Library. It is not a final OffGrid056 resource."* |
| **OG-02 page** | ✅ **HTTP 404** |
| **OG-02 download** | ✅ **HTTP 404** |
| "Household Risk Identifier" anywhere | ✅ absent |

---

## 6. Worker project name

**`og056-preview`**

---

## 7. workers.dev URL

**https://og056-preview.offgrid056-member-library.workers.dev**

On the default `workers.dev` domain, no branded subdomain, per your ruling.

> The first request after deployment failed TLS handshake for about a minute while the certificate was issued.
> That is normal for a new workers.dev hostname and resolved on its own.

---

## 8. Cloudflare Access — exact steps

**Good news that changes the plan slightly, in your favour.** Cloudflare added Worker-level Access in August
2026. Rather than protecting a hostname, you can protect **the Worker itself**, which covers "its routes,
Custom Domains, `workers.dev` hostname, and previews" — so nothing needs keeping in sync when a custom domain
is added later, and preview URLs are covered too.

### Recommended: protect the Worker

1. Cloudflare dashboard → **Workers & Pages**
2. Select **`og056-preview`**
3. Open the **Access** tab
4. Click **Protect this Worker behind Access**
5. Traffic scope: choose **All traffic** (not "Previews only" — the whole preview must be gated)
6. Policy — choose one:
   - **Cloudflare account** — allows members of your Cloudflare account to sign in. **Simplest for owner-only,
     and my recommendation for the pilot**: it is exactly one person, you, with no list to maintain.
   - **Email domain** — allows anyone with a verified address at a domain. **Not suitable here**: it is
     broader than an explicit allow-list, and you ruled out wildcard/domain access.
7. Review **session duration** (24 hours is a sensible default)
8. Click **Apply Access**

### If you want an explicit email allow-list instead

Worker-level protection offers account or email-domain policies. For a named list of individual addresses
with **one-time PIN**, create a hostname application:

1. **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**
2. Application domain: `og056-preview.offgrid056-member-library.workers.dev`, path `*`
3. Policy: **Allow** → Include → **Emails** → your explicit addresses
4. Identity: **One-time PIN** (emailed code, expires after 10 minutes)
5. Session duration: 24 hours
6. Save

Prerequisite for either route: **Zero Trust must be enabled on the account**, and you need permission to manage
Workers and Access applications.

### One limitation worth knowing

Worker-level Access policies **do not currently support WebSocket connections**. This site uses none, so it
does not affect us — noting it in case that changes.

---

## 9. Confirmation: OG-02 remains unexposed

- **Not built** into the deployed artefact — the demo build has no route, no download, no mention.
- **Not reachable** — both its page and its PDF return **404** on the live site, verified after deployment.
- **Not in GitHub** — the record and both PDFs live in git-ignored `private-assets/` and are untracked.
- It will be deployed **only** after you confirm Access is active, and I will re-verify the gate blocks an
  unauthenticated request before uploading it.

---

## 10. Test results

| Check | Result |
|---|---|
| `npm ci` from empty `node_modules` | clean, 0 vulnerabilities |
| Tests | **202 passed, 0 failed** (9 files) |
| Lint | clean |
| Production build | 800 files, 20.03 MB, 956 KB JS — unchanged |
| Static routes | ✅ home, demo resource, robots.txt, 404 |
| Broken assets | none — 555 files uploaded, site renders |
| OG-02 in production build | absent |
| OG-02 in preview build | present (built earlier, not deployed) |
| `admin-import` in member build | absent |
| Secrets / local paths in output | none |

Tests and builds were run **sequentially**, per the rule now documented in `docs/SETUP.md`.

---

## 11. Current risk, stated plainly

**The demo site is publicly reachable right now.** That is the order you approved — demo first, gate second —
and it holds only placeholder content that says so on every page, with `robots.txt` disallowing all crawlers.
But until Access is applied, anyone with the URL can open it.

---

## What I need from you

1. **Apply Access** using §8, then tell me it is active.
2. I will **verify the gate** blocks an unauthenticated request.
3. **Only then** I will build with `OG056_INCLUDE_DRAFTS=1` and deploy OG-02 behind the gate.

**Stopped, as instructed. OG-02 not deployed.**
