# OG-19 — BATTERY BACKUP PLANNER · DEPLOYED TO PRIVATE PREVIEW (#11)

**Status:** OG-19 is live in the private preview as the **11th** protected draft resource.

- **Worker version:** `e175bc11`
- **Access:** still on all traffic
- **Changes applied:** all 17 approved changes plus the required power/surge note
- **Metadata:** as ruled
- **Rollback:** `6954a621`

**Date:** 22 September 2026

---

## 1. Final power / surge wording

It sits directly under the Step 2 scenario table, in a standard info box, and is the same in NZ and AU:

> **ENERGY (KWH) IS NOT THE SAME AS POWER (KW)**
> This planner sizes **energy**: how much the battery can store and use over time, measured in kilowatt-hours (kWh).
> **Power** is different: it is how much the battery and inverter can deliver at any one moment, measured in
> kilowatts (kW). If the appliances you run at the same time need more power than the system can deliver, it cannot
> supply them all — even when the battery is full. Some appliances, especially those with motors, pumps or
> compressors such as fridges and water pumps, can need more power for a moment when they start. Before you choose a
> system, check its continuous power output and its surge (starting) rating against the appliances you plan to run
> together, using the manufacturer's specifications or a qualified installer.

**The note contains no numbers:** no kW values, surge multipliers, start currents or inverter sizes. A test enforces
this.

## 2. Source basis (read directly this stage)

| Point | AU | NZ |
|---|---|---|
| kWh = stored energy; kW = power at a moment | **energy.gov.au, Batteries**: *"Battery capacity is the amount of energy which can be stored in a battery, measured in kilowatt-hours (kWh)."* · *"The rated power output is the amount of electrical power the battery can output, measured in kilowatts (kW)."* **Solar Victoria**, *How does a solar battery system work?* (updated 10 Apr 2025): power output *"determines how many appliances you can run off the battery at once"*. | **EECA**, *Guide to understanding on-farm solar quotes*: *"Capacity determines how much energy can be stored; power determines how fast it can charge/discharge."* |
| Loads can exceed what the system delivers | **energy.gov.au**: loads that draw *"more power than your battery's maximum power output"* mean *"your battery will be unable to provide all the power"*; *"avoid overloading the battery inverter"*. | No NZ household page found. The EECA guide above implies it, but does not state it. |
| Surge / starting power of motors, pumps and compressors | **No official source found.** | **No official source found.** |

**Source limitations:**

- **Surge and starting power: no official source in either market.** I checked energy.gov.au (Batteries; Inverters),
  YourHome, Solar Victoria (backup power; battery guide; how batteries work), NSW, EECA (home solar planning; the
  residential best-practice page and its purchasing checklist), and the EECA on-farm guide. None of them addresses it.
  So, as you allowed, that sentence uses accurate wording with no numbers, and it sends members to the
  manufacturer's specifications or a qualified installer.
- **NZ kWh/kW source is EECA's on-farm guide.** It is an official EECA page, but written for farms. The distinction
  it states is general, so I used it rather than invent NZ wording. EECA's home solar page does not cover kW.

## 3. Final NZ PDF

| Check | Result |
|---|---|
| File | `battery-backup-planner.NZ.pdf` |
| Pages | 7 |
| Title | Battery Backup Planner — OffGrid056 |
| Emergency numbers | 111 only (no 000 or 112) |
| Cross-market terms | none: no "licensed electrician", no "DIY electrical work is illegal", no SES, no eskies, no AU timings |
| Electrical wording | "licensed electrical worker"; the homeowner-wiring rule |
| Food safety | Get Ready + MPI; **no fridge or freezer timing**; no "less than 24 hours" |
| Removed figures and products | **none present**: 0.8/0.5, 20%, × 0.6/1.2/2.4, lifespans, 80–95%/50%/100%, $ figures, Cost/kWh, 13.5, Powerwall, Aquion, "10-year", "uninsulated", "survival tool", "certified" |
| Legacy navigation · tokens · VERIFY · OG codes · browser-error page | none |
| Changes | all 17 applied, plus the note |
| Tables | load table whole on page 3; scenario table and note on page 4; comparison table whole on page 5 |

## 4. Final AU PDF

| Check | Result |
|---|---|
| File | `battery-backup-planner.AU.pdf` |
| Pages | 7 |
| Title | Battery Backup Planner — OffGrid056 |
| Emergency numbers | 000 + 112 only (no 111) |
| Cross-market terms | none: no "electrical worker", no homeowner-wiring rule, no Civil Defence, no MPI, no "illegal in NZ" |
| Electrical wording | "licensed electrician — DIY electrical work is illegal" |
| Food safety | approved NSW Food Authority timings only |
| Other checks | the same as NZ: no removed figures or products; no legacy navigation, tokens, VERIFY, OG codes or browser error; all changes applied; tables intact |

**Checks run:**

- `import:verify-prep`: 22/22 files pass, **including the strengthened check** that every recorded change was applied.
- `import:verify-build` on the exact build: **11 records, 22 files, 0 broken links**.
- The OG-19 PDFs in the build are **byte-identical** to the checked PDFs.
- **Record status:** draft.

**The two PDFs were re-rendered before the checks passed.** After I added the note, the verifier flagged that the
rendered PDFs didn't contain it yet: prep had rewritten the HTML, but the PDFs were still the earlier render. I
re-rendered both, and verification then passed.

**Visible OG codes: none.** `legacyCode: "OG-19"` exists only in the page's internal data payload, not in visible
text. Every live resource has the same field (for example `OG-11`).

## 5. Deployment result

**Success.** `wrangler deploy` finished cleanly.

**Local preview, before deploying:**

| Check | Result |
|---|---|
| Before a market is chosen | no download offered |
| NZ chosen | NZ file only |
| AU chosen | AU file only |
| Metadata on the page | "intermediate" and "45 min" shown |
| Visible OG code | none |

**After deploying**, every unauthenticated request was redirected (302) to the Access login at `odd-surf-0ad6`. That
included `/`, `/downloads/`, the OG-19 page, both OG-19 PDFs, and an OG-11 PDF.

## 6. Worker version

**`e175bc11-067e-4e3f-90b4-ec0cbebcae9f`**

## 7. OG-19 route

`/resources/battery-backup-planner/` (behind Access)

## 8. Protected resource count

**11** draft resources: OG-02, OG-11, OG-15, **OG-19**, OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B07, OG-B10.

**The ten earlier resources are unchanged.** Their PDFs were not re-rendered and their records were not edited.

## 9. Tests

**260 passed** (256 + 4). Lint and typecheck clean.

**The four new tests guard OG-19's approved copy:**

1. It records all 18 changes, each owner-approved.
2. None of the removed figures or products can come back.
3. The power/surge note keeps its required points and contains no digits.
4. The NZ and AU licensing wording stays in its own market.

**Other status:**

| Check | Result |
|---|---|
| `--real` | refused |
| OG-19 files in git | 0 |
| `private-assets/` files tracked in git | 0 |
| Staged files left in `public/` | 0 |

## 10. Rollback

**`6954a621`** (ten resources). Its private files are backed up locally in
`workspace/backups/private-assets-6954a621` (git-ignored). Earlier versions stay in the deployment history.

## 11. Next recommended resource

**OG-18, Solar Power 101 Workbook** (energy).

**Why OG-18:**

- It is the foundation that OG-B07 (the solar worksheet) and OG-19 (the battery planner) build on.
- Its known safety needs are batteries-and-electrical and working-at-height (roof). Both are already owner-approved
  for NZ and AU.
- So it can go claims-first, like OG-19, without new safety research up front.

**Why not OG-20 yet:** OG-20 (Alternative Energy Suitability Check) is the natural companion, but it is listed under
the **generator** safety block. It would need a full generator, CO and indoor-combustion check against its actual
passages, and its resource type is still unresolved. I'd take it after OG-18.

**Stopped. No other resource prepared.**
