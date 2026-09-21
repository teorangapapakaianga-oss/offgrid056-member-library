# PRIVATE PREVIEW DEPLOYED — OG-02 BEHIND ACCESS

**OG-02 (`res-1002`) is deployed and reachable only after Cloudflare Access authentication.**
**Nothing is publicly reachable. Nothing real is in GitHub.**
**Date:** 21 September 2026

---

## 1. Deployment result

```
✨ Success! Uploaded 490 files (318 already uploaded)
Deployed og056-preview triggers
Current Version ID: c4c83892-3a60-47f5-b03c-5244a8bb4e12
```

Built with `npm run build:preview`, which sets `OG056_INCLUDE_DRAFTS=1`, stages the private record and its two
downloads, builds, and removes them again. **808 files, 20.98 MB.**

### The gate, verified by me before I deployed anything real

I did not take the deployment on trust. Before uploading the real resource I requested the root
unauthenticated and got:

```
302 Found → https://odd-surf-0ad6.cloudflareaccess.com/cdn-cgi/access/login/…
"auth_status":"NONE"
```

Only then did I build and deploy the preview.

### Pre-deploy gate

Ten checks, all passed. One initially failed — **and it was my check that was wrong, not the build**:

> `no unresolved VERIFY tokens` — FAIL

The pattern matched `{{` inside minified Next.js framework code (`function f(e,t){{let t=…}`). Re-checked with
the resolver's real token syntax `{{ word.word }}` and the literal sentinel as a word:

```
HTML/JS:  no market token left unresolved · no literal VERIFY sentinel
NZ PDF:   unresolved tokens 0 · VERIFY 0 · emergency number 111
AU PDF:   unresolved tokens 0 · VERIFY 0 · emergency number 000
```

I would rather report a check I had to correct than quietly loosen it until it went green.

---

## 2. Worker version

| | Version | Contents |
|---|---|---|
| Previous | `2fab3d88-92a6-4a6d-b03a-fd1a0a710446` | demo-only, no OG-02 |
| **Current** | **`c4c83892-3a60-47f5-b03c-5244a8bb4e12`** | demo + OG-02 draft |

Worker: **`og056-preview`** · URL: **https://og056-preview.offgrid056-member-library.workers.dev**

---

## 3. OG-02 route

**`/resources/household-risk-identifier/`**

Requires authentication — **302 → Access login**, `auth_status: NONE`.

---

## 4–5. NZ and AU rendering results

Both market variants resolve completely, with no token left unresolved:

| | New Zealand | Australia |
|---|---|---|
| Emergency number | **111** | **000** |
| Alternative | — | **112** from a mobile |
| Accessibility | 111 TXT service | 106 TTY via the NRS |
| Agency | Civil Defence (NEMA) | your State Emergency Service (SES) |
| Trades wording | licensed electrical worker / licensed or certifying gasfitter | licensed electrician / licensed gasfitter |
| Unresolved tokens | **0** | **0** |

Rendered text, NZ:

> **In an emergency, call 111 now.** Calls are free and work on a mobile even with no credit… 111 TXT service
> for people who are deaf or cannot speak on the phone. Guidance for your area: Civil Defence (NEMA).

Rendered text, AU:

> **In an emergency, call 000 now.** You can also dial 112 from a mobile, which reaches the same service…
> 106 TTY via the National Relay Service. Guidance for your area: your State Emergency Service (SES).

Confirmed inside the deployed PDFs by parsing them back: the NZ file contains 111 and not 000/112; the AU file
contains 000 and 112 and not 111.

**One thing to be precise about:** the member site itself does not yet switch markets. It is one build, and the
resource's download points at the NZ variant; the AU variant is deployed alongside it as
`household-risk-identifier.AU.pdf`. Wiring market selection into the site is separate work, not yet done, and
I have not implied otherwise.

---

## 6. Direct PDF protection result

Both downloads are behind the gate — a direct link does not bypass it:

| Asset | Result |
|---|---|
| `/resources/household-risk-identifier.pdf` (NZ) | **302 → Access login**, `auth_status: NONE` |
| `/resources/household-risk-identifier.AU.pdf` (AU) | **302 → Access login**, `auth_status: NONE` |

This is why Worker-level Access was the right choice: it covers every asset on the hostname, not just page
routes.

---

## 7. Rollback result

Two deployments are retained, both by your account:

```
2026-09-21T07:54:18Z  2fab3d88-…  demo-only
2026-09-21T08:44:30Z  c4c83892-…  demo + OG-02   (100% of traffic)
```

**To roll back to demo-only:** Cloudflare dashboard → Workers & Pages → `og056-preview` → Deployments →
select `2fab3d88` → Rollback. Or locally:

```bash
npm run build          # demo-only, no drafts
npx wrangler deploy
```

**To remove OG-02 entirely:** delete `private-assets/data-resources/household-risk-identifier.private.json`.
Nothing in `data/` or git changes.

---

## 8. Screenshots

| # | What | File |
|---|---|---|
| 1 | Dashboard | `workspace/pilot/deployed/1_dashboard.png` |
| 2 | **OG-02 page with the Draft badge** | `workspace/pilot/deployed/2_og02_page.png` |
| 3 | NZ version — emergency block | `workspace/pilot/deployed/4_emergency_NZ.png` |
| 4 | AU version — emergency block | `workspace/pilot/deployed/4_emergency_AU.png` |
| 5 | Full NZ / AU documents | `workspace/pilot/deployed/3_market_NZ.png`, `3_market_AU.png` |

**These are rendered from the same build that was deployed, served locally.** I cannot screenshot the
authenticated live site, because that needs your Cloudflare sign-in and I will not log into your account. If
you want live authenticated screenshots, take them from your own session and I will check anything you want
checked.

The Draft badge is visible beside GENERAL and WORKSHEET, and visually distinct from the DEMO badges on the
placeholder resources.

---

## 9. Safety confirmations

| Requirement | Result |
|---|---|
| Root requires authentication | ✅ 302 → Access |
| OG-02 route requires authentication | ✅ 302 → Access |
| OG-02 PDF requires authentication | ✅ 302 → Access (both NZ and AU) |
| Draft badge visible | ✅ |
| NZ rendering resolves | ✅ 111 / Civil Defence, 0 unresolved |
| AU rendering resolves | ✅ 000 / 112 / SES, 0 unresolved |
| No unresolved VERIFY tokens | ✅ in HTML, JS and both PDFs |
| No real artefact in GitHub | ✅ working tree clean; `private-assets` untracked; no `household-risk-identifier` tracked; `data/resources` still 30 demo records |
| Rollback available | ✅ previous version retained |
| No importer/admin code exposed | ✅ no `admin-import`, `workspace/`, `reskin` or local paths in the build |
| noindex + robots.txt | ✅ 123 pages, `Disallow: /` |

---

## 10. What has not been done

- **No other Group-A resource deployed.** OG-02 only, as instructed.
- **`--real` still disabled.** The import engine has still never written to the real library.
- **Nothing published.** The only route in is your Access login.

**Stopped for your review.**
