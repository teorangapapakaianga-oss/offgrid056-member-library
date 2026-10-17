# Member Library: Sign Out (controlled staging) and My Account (architecture assessment)

**Nothing is deployed.** The live Worker is still `2954cb67-1d7c-486f-845e-3be7b3f5fac5`. The Sign Out control is built and tested in the working tree (commit shown in the final message); the My Account part is an assessment only: no account, database, subscription, entitlement or payment code was written. The 38 resource records, approved assets, Cloudflare Access configuration, disabled automatic builds and the separate Resilience OS are untouched.

---

## PART 1. SIGN OUT: controlled staging

### 1.1 What Cloudflare documents (read from the official Zero Trust "Session management" page)
- Two supported endpoints: `<your-application-domain>/cdn-cgi/access/logout` and `<your-team-name>.cloudflareaccess.com/cdn-cgi/access/logout`.
- **Scope:** the page states the action "revokes the user's session across all applications"; end users cannot sign out of one application only. The application-domain endpoint also deletes the application's authorisation cookie at once; previously issued tokens stop being accepted within about 20 to 30 seconds. A `returnTo` parameter is not documented, so none is used.
- Access handles `/cdn-cgi/access/*` itself, before any Library file is served. An unauthenticated GET to the live logout path returns HTTP 200 from Access (the Library has no such file), which confirms the endpoint is live on this hostname.

### 1.2 What was built
- **`lib/member/access.ts`:** `ACCESS_LOGOUT_PATH = "/cdn-cgi/access/logout"`, a relative path on the application's own hostname (no team name or identity in the repository).
- **`components/member/sign-out.tsx`:** a visible 44 px **Sign out** button with a sign-out icon. It opens an inline confirmation: "Sign out of OffGrid056? This ends your secure Cloudflare Access sign-in. Access signs you out of **every application protected by the same login**, so you may need to sign in again elsewhere too. Your saved items and progress stay in this browser." Buttons: **Sign out now** (a plain link to the Access logout path) and **Cancel** (focus moves to Cancel when it opens, Esc cancels, focus returns to Sign out).
- **Placement:** top of the desktop sidebar (above the navigation, so it is visible without scrolling) and top of the tablet/phone Menu drawer.
- **Safeguards by design:** a plain `<a>`, never the router's link component (which can prefetch: a prefetched logout would sign the member out without a click); the logout link exists only inside the confirmation, so it is in **no** static HTML or page payload (verified: 0 of the built files); no client-side simulated logout, no cookie or storage manipulation, and the member's local data is deliberately not cleared. A new `signOut` icon was added to the icon set. Nothing else was changed.

### 1.3 Test report
| Check | Result |
|---|---|
| Endpoint is Cloudflare's documented path | PASS (unit test pins the exact path; relative; no `cloudflareaccess.com` or secret in the module) |
| Real navigation, not simulated | PASS: clicking "Sign out now" in the browser pane navigated to `/cdn-cgi/access/logout` (it returns "not found" on the local test server, which is not Cloudflare, as expected); code contains no storage, cookie, fetch or location manipulation (test) |
| Never prefetched or auto-followed | PASS: not in the navigation data, not rendered until the confirmation opens, 0 static files contain it, plain anchor (tests) |
| Confirmation wording | PASS: states that all Access-protected applications are signed out, and that saved items and progress stay in this browser |
| Local member data preserved | PASS: seeded saved resource and market survived clicking "Sign out now" (the browser-local store is untouched) |
| Desktop (1024 px) | PASS: exactly one visible control, fully in view at the top of the sidebar (44 px tall); confirmation opens; Cancel focused; Esc closes and returns focus |
| Tablet (768 px) and phone (375 px) | PASS: no sidebar; the control is not on the page itself but is the first item in the Menu drawer, fully in view; confirmation opens; Cancel focused; no horizontal scroll |
| Existing Library functionality | PASS: two clean builds identical (1,108 files); **all 161 pages' visible text equals the live build apart from the two added "Sign out" labels** (sidebar and drawer); all 105 PDF/DOCX files byte-identical; `import:verify-build` exit 0 (38 records · 76 market files · 0 broken links); full suite **71 files, 1,807 tests, exit 0** (8 new); lint 0 errors; typecheck 0; `import:verify-prep` 0 |
| **Actual sign-out, cookie clearing and re-authentication** | **NOT TESTED** (the only environment with Access is the protected hostname and I have no session; the local server cannot emulate Access) |

**Owner test after any approved deployment (use a private window):** sign in; open Menu or the sidebar; Sign out → Sign out now; expect the Access logout page, then the next Library URL to redirect to the Access login; sign in again; confirm saved items, progress and country are still there and the PDFs/DOCX open. Note for the test: Access ends the session for every application behind the same login, including any other OffGrid056 or personal app protected by this Access team.

### 1.4 Decisions and deployment
1. Confirm the wording (it says plainly that other protected applications are signed out too).
2. Shared devices: sign-out leaves saved items and progress in that browser (they are not an account). Optional later: offer "also remove this browser's saved data".
3. Deployment (not executed): the Stage 11.0K procedure (clean tree, two identical builds, verifier, one `wrangler deploy`, unauthenticated probes, then the owner's signed-in test). Rollback target `2954cb67-1d7c-486f-845e-3be7b3f5fac5`. Needs your explicit approval.

---

## PART 2. MY ACCOUNT: architecture assessment (no implementation)

### 2.1 Audit: what exists today
**Authenticated identity, profile, membership, subscription, billing or entitlement functionality: none.** Evidence: no login, account, profile, subscription, payment or token code in `app`, `components`, `lib` or `tools`; no server, API route, database or Worker script (`wrangler.jsonc`: a static-assets Worker with no script); README and `docs/ARCHITECTURE.md`: "V1 has no login, no database and no server". The Library cannot even see who is signed in: Cloudflare Access authenticates at the edge, but the static site receives no identity.

| Area | What exists | Where it lives |
|---|---|---|
| Sign-in | **Cloudflare Access on the whole hostname** (authentication only; who may enter is set in the Access policy, outside the repository) | Cloudflare edge |
| Sign-out | the new control (staged, not deployed) | Access endpoint |
| Country (market) | chosen by the member, never inferred | **browser-local** (`og056.member.v1`) |
| Saved resources, completed, recently viewed, where-you-left-off, 30-Day Programme progress and notes, reserved assessments | full model, versioned, keyed by permanent resource id, cross-tab sync, backup file, restore (merge or replace), "start again" | **browser-local only**; nothing leaves the browser except a backup the member downloads |
| Store design | `MemberStore` interface with `LocalMemberStore`; the architecture says a server-backed store can replace it "without changing a single component"; `mergeStates` already defines the merge rules for a first sign-in | code ready as the swap point |
| Governance metadata | per resource: `accessTier` and `entitlementRequirement` = UNDEFINED_OWNER_DECISION, `recommendationEligible` false, `handoffStatus` INACTIVE, `approvedHandoffRoute` null, `entitlementContractStatus` NOT_APPROVED; a legacy `premium` flag that is **not** an entitlement | canonical index (documentation; nothing reads it) |
| Downloads | 76 PDFs and 4 DOCX are **static assets**: any signed-in Access user can fetch any file URL; **per-member download permission is impossible today** | Workers static assets |
| Existing roadmap | `docs/ARCHITECTURE.md` §14: accounts via Supabase Auth (or Clerk), `RemoteMemberStore` with Postgres row-level security, entitlement checks with gated files from private storage via signed URLs, Skool/CRM webhooks, all explicitly "not built in V1" | design only |

**Browser-local versus authenticated backend:** everything the member sees remembered is browser-local and tied to the browser profile, not to a person (two people on one browser share it; a new device starts empty). There is **no** authenticated backend functionality of any kind.

### 2.2 Recommended minimal My Account architecture
**Principles:** keep the static, fast, cacheable Library; add a small account/entitlement API beside it; local-first progress (works signed-out and offline); one identity per person across OffGrid056 apps but **separate data stores** for the Library and the Resilience OS (no merging; an explicit scoped hand-off only, as the governance fields already anticipate); store the minimum personal data.

| Capability | Recommendation |
|---|---|
| **Identity and secure sign-in/out** | One OffGrid056 identity provider for both apps (the architecture doc already names Supabase Auth, "which fits your other projects"; the OS owner should confirm what the OS uses). Passwordless email link or one-time code first, optional social sign-in later; session in an httpOnly, Secure, SameSite cookie; sign-out revokes that session. **Cloudflare Access:** keep it as the staging/admin gate and as the current private-preview wall. For a **commercial** member base, Access is a poor identity system (membership lists live in Access policies, and Zero Trust plans have a per-seat model with a free-seat cap: *verify current limits and pricing before relying on it*), so plan to move member authentication into the app and keep Access for admin. If the owner prefers to stay on Access for a small founding cohort, the Worker can validate the `Cf-Access-Jwt-Assertion` token (issuer = team domain, audience = the application's AUD tag, keys from the team's `/cdn-cgi/access/certs`, per Cloudflare's documented method) and use the verified email as the identity. |
| **Member profile and country preference** | Minimal profile: stable member id, email, optional display name, country (NZ or AU, member-chosen: same rule as today), created/updated times. Country moves from the browser to the profile when signed in, with the browser value as the fallback when signed out. |
| **Membership status and access tiers** | Tables `plans` (tiers), `memberships` (member, plan, status: active, past_due, cancelled, expired; period end; source), `entitlements` (member, key, valid from/to, source) and a per-resource `required_entitlement` (finally filling the existing UNDEFINED_OWNER_DECISION fields). Tier names, which resources sit in which tier, and the founding/legacy-offer mapping are **owner decisions** (the existing QuickStart Guide, Free Guide, $5 E-Pack and Independence Blueprint offers need an explicit mapping). |
| **Subscription and billing** | A hosted billing provider (Stripe Checkout and Customer Portal is the usual fit; the owner chooses): no card data ever touches the Library; webhooks (signature-verified, idempotent) update `memberships`/`entitlements`; GST/tax handled by the provider for NZ and AU; the legacy-offer buyers (Skool/CRM) enter through the same webhook-to-entitlement path described in the architecture doc. |
| **Saved resources and synchronised progress** | Implement the planned `RemoteMemberStore` behind the existing interface: local-first, background sync, the existing `mergeStates` rules on first sign-in (earliest dates kept, newest notes win, nothing removed), versioned schema, last-write-wins per field with timestamps, export and delete. Explicit consent text before the first upload; the browser-only mode stays available for anyone who never signs in. |
| **Member-specific download permissions** | Move PDFs and DOCX out of public static assets into private storage (for example R2 or the chosen platform's equivalent) and serve them only through an authenticated endpoint that checks the entitlement and then streams or issues a short-lived signed URL; log downloads; the direct URL then fails for anyone without the entitlement. Until then, every file is available to every signed-in user. |
| **Account security and privacy** | Data minimisation (email, optional name, country, plan, progress); consent records; export and delete my data; no member data in the public repository or logs; secrets only in the platform's secret store; rate limiting and bot protection on sign-in; webhook signature checks; audit log of entitlement changes; role separation for admin; align with the NZ Privacy Act 2020 and Australian Privacy Principles (breach process, retention, overseas storage disclosure). |
| **Library and Resilience OS** | One identity, two data stores. Use the already-defined governance fields (`recommendationEligible`, `approvedHandoffRoute`, `entitlementContractStatus`) for an explicit, scoped, owner-approved hand-off; never share cookies, local storage or databases. |

### 2.3 Phased path (each phase needs its own approval)
1. **Decisions (no code):** identity provider; tier and offer matrix; billing provider; where the Library API runs; privacy position (data location, retention).
2. **Foundations:** a small API (a Worker, or the chosen platform) with a read-only "who am I" endpoint, a staging environment separate from production, secrets and schema migrations.
3. **Profile and country; sign-in and sign-out** wired to the identity provider.
4. **Entitlements and gated downloads** (private storage, authenticated download endpoint); fills the UNDEFINED access tiers.
5. **Progress sync** (`RemoteMemberStore`, merge on first sign-in).
6. **Billing and webhooks;** pricing pages and customer portal.
7. **Retire the Access wall for members** (keep it for admin and staging).

### 2.4 Risks and notes
- **Today's download exposure:** any Access-authenticated user can fetch any file; the hidden-URL approach is not a permission system. This is the main reason entitlements require a server layer, not just metadata.
- **Cloudflare Access sign-out affects other apps** protected by the same login (documented): important for the OS and any other Access-protected app.
- **Cost and limits** of Access seats must be checked before any member scale-up (not verified here).
- **Deployment model:** the Library is a static export on Cloudflare Workers assets with automatic builds disabled; adding an API means adding server code and secrets, and a deployment path that includes the private assets (never an automatic cloud build of the current repository, which would publish a demo-only site).
- The `/cdn-cgi/access/get-identity` endpoint (browser-readable identity) exists in Cloudflare Access but was **not confirmed in the documentation pages I read**; check before using it for a "Signed in as" label.

### 2.5 Smallest recommended next action
A one-page owner decision on **identity and hosting**: (a) which identity provider the Library and the OS will share; (b) whether the paid member product will leave the Access wall; (c) where the Library API and private file storage will run. Nothing should be built until those three are decided. Optional, low-risk step meanwhile: deploy the staged Sign Out control (after your approval and the Stage 11.0K procedure).

## Preserved
38 resource records and approved assets unchanged (byte-identical PDFs/DOCX, same counts); Cloudflare Access configuration and disabled automatic builds untouched; no database, account, subscription, entitlement or payment code; separate Resilience OS untouched.
