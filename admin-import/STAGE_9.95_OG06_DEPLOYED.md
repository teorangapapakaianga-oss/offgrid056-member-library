## Stage 9.95 — OG-06 Emergency Readiness Checklist deployed

**Date:** 8 October 2026 · **Deployed on the owner's explicit approval**, including approval of the existing "Same topic" suggestion behaviour for this deployment.

## Deployment
| | |
|---|---|
| Result | **Success.** 591 assets uploaded (417 already present); `og056-preview` and its triggers deployed. |
| New Worker ID | `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` (100%) |
| Immediate rollback | `2fb0663d-a7da-4acf-ba4c-957886b21631` (the Stage 9.88 deployment) |
| Older versions retained | `65437c37-b731-4851-b67e-5b0fae79fe12` → `89333107-7c0a-4bdb-8229-f2b5241a9e05` → `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | the exact Stage 9.94 validated build: clean working tree, `out/` raw byte-identical to the validated staged rebuild (1008 of 1008), both OG-06 PDF hashes verified immediately before upload, and a snapshot of the uploaded tree taken first (identical to `out/`) |
| LIVE now | **26 protected resources · 52 market files · 1,008 files · 0 broken links · Bucket C 0** |
| Staged | none |

To roll back, point the Worker at `2fb0663d-a7da-4acf-ba4c-957886b21631`. As in earlier deployments, Access protects every page, so content was verified on the snapshot of the exact tree uploaded, and the live Worker was checked for the version, the 100% split and the Access redirects.

## Previous live tree (Stage 9.88) against the new live tree
Compared file by file, with the build id and content-hashed chunk names normalised.

| | |
|---|---|
| Files before / after | 1,000 / 1,008 |
| Added | 9: the 8 OG-06 files (route output and two PDFs) and one stylesheet file |
| Removed | 1: the previous stylesheet file |
| Changed | **299**: 24 listing/payload pages (new res-1006 card, +1 counters) and 275 same-topic suggestion payloads; identical structure to the Stage 9.94 attribution |
| Unexplained | **0** |

Every JavaScript chunk is unchanged. **Stylesheet:** the file name changed because one unused utility rule was added, `.border-collapse`. The OG-06 draft copy committed in Stage 9.91 (`approved-copy.json`) contains the text `border-collapse` in an inline table style, and Tailwind's source scan turned it into a utility. No page uses the class (0 pages), and no rule was removed. It is the same kind of harmless addition as the `.ordinal` rule recorded in Stage 9.88.

## OG-06 live
`/resources/emergency-readiness-checklist/` resolves in the deployed tree. Title "Emergency Readiness Checklist"; the approved description exactly; Foundation General, Type Checklist, Beginner, 20 min, Draft, Topic Planning. No visible `res-1006`, no visible `OG-06`, no "72", no "hour", no safety section, no quantity or duration claim. Download links to the NZ and AU PDFs are present. Related resources in the approved order: Household Risk Identifier, Property Type Review, Water Storage Calculator, 30-Day Pantry Builder, Healthy Home Air Audit, Battery Backup Planner (no Warm Home Scorecard, i.e. no res-1015). Record: general / resilience-emergency / planning / checklist / beginner / 20 / draft / collections none.

## PDFs
- NZ `6a892f0dcb8afba650418f381d97c6440bc8a5e2c22097cfd71af7ae1b98b171`; AU `dd0cf256810ffde0cc5c1a09ec5e934699ea2c890b0f3b2d6f4295a2358f6aba`; both match the approved hashes in the deployed tree.
- All 50 previously live protected PDFs are byte-identical to the previous deployment; 52 protected PDFs now live.

## Same-topic suggestions (owner-approved behaviour)
Identical to the validated Stage 9.94 result: res-1006 is inserted into the capped six-item lists on 55 resource pages (25 protected, 30 demo placeholder); 121 tail entries are displaced, **all demo placeholders** (Household Contacts Template, Household Resilience Assessment, Five Foundations Overview, and one demo path-step entry). **No protected resource was displaced.** The algorithm, ranking and segregation were not touched.

## Navigation and policy
Start Here (OG-01 and OG-02 only), Planning Tools (the same set), the programme (day 6 → res-0011), Five Foundations, workshops, learning paths, collections, demo routes: **0 files changed** in each. `route-policy.json` unchanged. Cloudflare Access settings untouched.

## Access probe (unauthenticated)
25 routes probed, **25 redirected (302) to Cloudflare Access, 0 answered 200**: library, the OG-06 route, the OG-06 NZ and AU PDFs, Start Here, Planning Tools, OG-01, OG-02, OG-04, the programme, programme day 6 (two URL forms), a demo route, an unknown protected route, the home page, downloads, Five Foundations, saved, progress, three other protected PDFs, a data path, a chunk path and `robots.txt`.

## Detectors (live, 26 resources / 52 market files)
Numeric candidates **433**; survival-duration 0; supply-duration 0; emergency-period 0; price findings 0; content flags 4 (already-live OG-09 AU and OG-13 NZ, unchanged); legacy-language and market scans: no hit in OG-06 (the programme labels and "000" thousands separators found elsewhere are in already-live resources, unchanged); **Bucket C 0**. No exemption was added.

## Migration state (45 legacy resources)
Deployed **26** · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged / No standalone 1 (OG-05) · Not started 17 = 45. OG-06 DEPLOYED; OG-16 BLOCKED; OG-05 MERGED / NO STANDALONE RESOURCE.

## Registers
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 26 / 52; staged none; 0 broken links; OG-06 `res-1006` DEPLOYED; the counts above; Worker `5d88271b…`; rollback `2fb0663d…`; next action = the next legacy-resource audit. Historical notes and old reports were not rewritten.

## Validation (exit codes)
See the stage return: lint 0 · typecheck 0 · full tests 0 · register, built-output, route-separation, numeric and content-flag suites 0 · `import:verify-prep` 0 · `import:verify-build` 0 (records 26 · market files 52 · broken internal links 0) · Bucket C 0.
