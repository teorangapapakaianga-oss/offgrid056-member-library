# Stage 10.20 — scan-heavy test harness hardening

**Test harness only.** No runtime, resource, PDF, route, Cloudflare, Supabase, Railway, OS or entitlement change; no deployment. Live is unchanged: **31 protected resources · 62 market files · Planning Tools 10 · Downloads 53 · My Progress 56 · 0 broken links** · Worker `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`.

## 1. Profile (evidence, before any change)
| Test | Alone | In the full suite | Default limit |
|---|---|---|---|
| `numeric.test.ts` > "leaves the whole live library green: every prepared file has zero blocking findings" | 2.8 s (file 4.4 s) | **4,954 ms** (46 ms from failing); it failed at 5,058 ms in Stage 10.18D | 5 s |
| `importer.test.ts` > "infers a foundation with confidence and evidence" | 2.6 s | **4,119 ms** (failed at 5.1–5.2 s in earlier runs) | 5 s |
| the other nine scan-using importer tests | 1.15–1.6 s each | 1.7–2.8 s | 5 s |
Importer file alone 15.8 s; in the suite 23.4 s. Across the suite: 11 tests over 1 s, 4 over 2.5 s, max 4,954 ms.

## 2. Confirmed cause
- **Importer:** the tests use a small synthetic tree in the temp folder (not the OneDrive archive; my earlier description of this was wrong). Every `scanSources` call starts a **PowerShell process** to spot OneDrive placeholders (`admin-import/scanner/scan.ts`, `offlineFiles`); measured at about **1.3 s per spawn** (6 s cold). Each of ten tests scans once (the foundation test twice), so each costs 1.2–2.6 s alone and 1.7–4.1 s when the suite's parallel workers compete for CPU.
- **Numeric:** the test runs every detector over all 62 prepared HTML files; CPU-bound, 2.8 s alone, about 5 s under load, and it grows with each resource added.
Both are expected scan-heavy work, not logic faults.

## 3. Change (the smallest safe fix)
`tests/unit/importer.test.ts` and `tests/unit/numeric.test.ts` only. An explicit **per-test timeout of 20,000 ms** on the ten importer tests that scan and on the one whole-library numeric test, using the vitest options form `it(name, { timeout }, fn)`, each with a short comment saying why. 20 s covers the worst observed 4.95 s (and a 6 s cold PowerShell start twice over) and still catches a genuine hang. **Global timeout changed: NO. Assertions changed: NO. Scan scope changed: NO. Retries added: NO. Skips added: NO.** Logic failures still fail normally and at once; only the time allowed for the expected scan work is wider. Diff: 2 test files, +18 / −11 lines.

## 4. Other scan-heavy tests (candidates only; nothing else changed)
`import-engine.test.ts` (22 tests, slowest 147 ms) NORMAL; `air-blocks`, `gas-architecture`, `gas-detector`, `gas-wording`, `og17-claims`, `price-gate`, `safety-enforcement`, `built-output`, `og-03-audit`: NORMAL (slowest under 0.7 s). **POTENTIAL_FUTURE_TIMEOUT (watch):** `og-01-draft` "has no numeric Bucket C, no price, no gas, in either market" (985 ms) and `og-b09-claims-first` "has 0 unsupported R-values…" (984 ms): per-resource detector runs, about 5× below the limit and not growing with the library. The whole-library numeric test is the one that scales and is now covered. A future change could cache the OneDrive probe or run the importer scan once per describe; that would alter test structure, so it was not done here.

## 5. Validation (default timeout; the 30-second override was not used)
Affected files: `importer.test.ts` and `numeric.test.ts`: 57 of 57 passed. **Default full suite run #1: 60 files, 1,656 tests, all passed (exit 0); run #2: all passed; run #3: all passed.** (Slowest tests across the three runs: numeric 4.2–4.4 s, importer foundation 3.5–3.7 s; all pass with their wider bound.) Lint **0**; typecheck **0**; `import:verify-prep` **0**; `import:verify-build` **0** (31 records · 62 market files · 0 broken internal links).

## 6. Integrity and runtime check
Files changed: the two test files and this report; **0 runtime or build files**. `out/` is byte-identical (1,048 of 1,048) to the deployed tree; the 62 market files, Planning Tools (10 resources), stable IDs, routes and PDF hashes are unchanged; the live Worker is still `3e53c3a7…` at 100%; nothing deployed.

## Verdict and next stage
**PASS.** Recommended next work: return to the migration roadmap with the **OG-28 legacy-resource audit and preparation** (on your instruction; not started).
