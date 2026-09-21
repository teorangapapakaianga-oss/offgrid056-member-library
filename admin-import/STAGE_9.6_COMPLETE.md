# STAGE 9.6 — COMPLETE (A, B, C, D) — OWNER REVIEW

**Launch markets updated to New Zealand + Australia.** US and CA architecture intact, deliberately not resolved.
**Nothing published. `--real` still disabled. `data/` and `public/` untouched.**
**Date:** 21 September 2026

---

## 1. NZ + AU safety completion — all gaps closed

Every outstanding value for both launch markets has been verified against an official source. Nothing guessed.

### New Zealand

| Gap | Verified |
|---|---|
| **Gasfitting** | Gasfitting is **restricted work**, legal only for a currently **licensed or certifying gasfitter**; doing it without a licence **is illegal**. Covers pipework, appliances, flues, alterations. Since 1 July 2013 all gasfitting requires certification and a **Gas Safety Certificate**. Administered by the **PGDB**. |
| **Food in a power cut** | Fridge: usable if power was off **less than 24 hours**. Freezer: **less than 4 days if full**. Thawed food may be kept if it stays cold. Discard past Use-By; check smell, colour, texture; do not use damaged tins. |
| **Water / emergency** | Already verified: **3 litres** per person per day, **9 litres** for three days, 21 for a week. Emergency **111** — free, works with no credit, 111 TXT service. |

### Australia

| Gap | Verified |
|---|---|
| **Stored drinking water** | **"Pack 10 litres of drinking water per person at a minimum"** for a three-day period, with a three-day food plan. |
| **Gasfitting** | A **licence is required** for any gas work (NSW: *Gas & Electricity (Consumer Safety) Act 2017*), regardless of value or property type. The gasfitter **must give you a compliance certificate**. Regulation is **state-based**. |
| **Food in a power cut** | Fridge: **about 4 hours** closed; discard perishables left unrefrigerated **more than 4 hours**. Freezer: **about 24 hours** closed. **Do not refreeze** thawed food. **Never taste** suspect food. |
| **Emergency** | **000**, plus **112** from a mobile, **106** TTY via the National Relay Service. |

### The finding that justifies the whole architecture

**NZ and AU power-cut food guidance differ by a factor of six.** NZ says a fridge is usable under 24 hours;
NSW says discard perishables after 4. Quoting one country's figure to the other's members would contradict
their own food authority on a food-safety question. A test now asserts those two values are never equal.

**Still `VERIFY`, by design:** generator distance for NZ/AU/CA (only the US 20-foot figure is confirmed), and
all US/CA values. Each behaves as missing — token stays visible, `publishable()` returns false.

---

## 2. Market architecture — unchanged, now populated

Core content + market overrides, exactly as ruled. **45 resources remain 45 documents.** NZ and AU share the
same core wherever the teaching is universal; only the market profile differs.

NZ-specific references are **kept, not deleted**: EECA, Healthy Homes, Civil Defence, R-values and litres live
in the NZ profile as valid NZ content and are simply absent from others.

---

## 3. Pilot — OG-02 rendered twice, NZ vs AU

One core resource. **19 fields differ.** Both markets publishable.

| Field | New Zealand | Australia |
|---|---|---|
| Emergency number | **111** | **000** |
| Alternatives | — | **112** from a mobile |
| Accessibility | 111 TXT service | 106 TTY via the NRS |
| Emergency management | Civil Defence (NEMA) | your State Emergency Service (SES) |
| Fire service | Fire and Emergency New Zealand | your state fire service |
| Food safety authority | New Zealand Food Safety (MPI) | your state food authority |
| Gas regulator | WorkSafe New Zealand | your state gas safety regulator |
| Trade registration | PGDB | your state licensing authority |
| Water per person | 3 litres | at least 10 litres for three days |
| Water for three days | 9 litres per person | 10 litres per person, minimum |
| Fridge without power | less than 24 hours | about 4 hours, door closed |
| Freezer without power | less than 4 days, if full | about 24 hours, if closed |
| Gas certificate | a Gas Safety Certificate | a compliance certificate |
| Term: emergency management | Civil Defence | State Emergency Service |
| Term: electrician | licensed electrical worker | licensed electrician |
| Term: gasfitter | licensed or certifying gasfitter | licensed gasfitter |
| Official water guidance | getready.govt.nz | getready.qld.gov.au |
| Official gas guidance | worksafe.govt.nz | fairtrading.nsw.gov.au |
| Official food guidance | mpi.govt.nz | foodauthority.nsw.gov.au |

**Rendered proof** (`workspace/pilot/comparison/safety_NZ.png`, `safety_AU.png`):

> **NZ:** "In an emergency, call **111** now. Calls are free and work on a mobile even with no credit… 111 TXT
> service… Guidance for your area: Civil Defence (NEMA)."
>
> **AU:** "In an emergency, call **000** now. You can also dial **112** from a mobile… **106** TTY via the
> National Relay Service. Guidance for your area: your State Emergency Service (SES)."

The disclaimer resolves too: NZ says "a licensed electrical worker or licensed or certifying gasfitter";
AU says "a licensed electrician or licensed gasfitter".

**The underlying resource is one document.** `res-1002`, one HTML source, one library record.

---

## 4. 9.6C — Group-A re-skin: all 11 done

`npm run import:reskin` → `workspace/reskin/`. **Source files were not modified.**

| OG | Slug | Changes |
|---|---|---:|
| OG-02 | household-risk-identifier | 84 |
| OG-11 | 30day-pantry-builder | 130 |
| OG-15 | warm-home-scorecard | 72 |
| OG-19 | battery-backup-planner | 95 |
| OG-22 | resilience-product-wishlist | 55 |
| OG-25 | project-support-brief-template | 55 |
| OG-27 | 90day-implementation-roadmap | 59 |
| OG-B04 | monthly-planning-challenge-template | 25 |
| OG-B07 | solar-planning-deep-worksheet | 61 |
| OG-B10 | 90day-roadmap-advanced | 25 |
| OG-B11 | building-consent-navigator | 54 |

Applied: legacy navy/gold/orange/slate → Deep Green, Resilience Green, Earth Taupe, Graphite; Playfair Display
→ Bebas Neue; Inter → Montserrat, served **locally** (the legacy files called Google Fonts); custom properties
renamed so `--navy` no longer holds a green; `Prepare • Adapt • Thrive` strapline.

### Three judgements worth your sign-off

1. **Semantic colours were deliberately NOT re-branded.** The risk matrix's red / amber / green carry meaning —
   urgent, plan, monitor. Turning them into brand greens would destroy what the member reads them for.
2. **The cover image was broken in every source file.** They pointed at `/mnt/agents/output/…`, a path from the
   generation environment that exists nowhere else — so the original PDFs were built with a **missing cover**
   (visible as alt text in the before screenshot). Now repointed and verified present.
3. **Headings were scaled ×1.18.** Bebas Neue is condensed where Playfair Display is wide, so same-size
   headings landed visibly lighter and flattened the hierarchy. Caught by comparing the before/after renders.

### Before / after

`workspace/reskin/comparison/` — OG-02 and OG-15, before and after. The before shows navy, gold, serif
headings and a **broken cover**; the after shows the current brand, working cover, and preserved content.

---

## 5. 9.6D — one resource, end to end

`npm run import:pilot`:

```
audit → safety → terminology → re-skin → market variants → validation → draft import → private preview
```

| Step | Result |
|---|---|
| Audit | OG-02, Group A, general / worksheet, both HIGH |
| Terminology | context-aware; framework phrase only |
| Re-skin | 84 changes, 0 warnings |
| Market variants | NZ and AU, **both publishable**, 0 unresolved tokens |
| Validation | **PASSES the member library's own `ResourceSchema`** |
| Draft import | created `workspace/pilot/library/data/resources/household-risk-identifier.json`, **status: draft** |
| Private preview | served on **127.0.0.1:3811**, both variants rendered and verified in-browser |

The preview is local only and was never published. The member library was not touched: the import went to a
sandbox under `workspace/`.

---

## 6. Air content gap

Recorded as a programme-development finding, as ruled. **Nothing was reclassified into Air.** OG-13 remains the
only Air resource, and the gap is to be filled by writing new Air resources for the current framework.

---

## 7. Test count

**202 tests pass, 0 failures** (9 files) — up from 179.

| Suite | Tests |
|---|---:|
| V1 member library | 58 (unchanged) |
| Importer | 30 |
| Admin review workflow | 33 |
| Import engine | 22 |
| Programme audit | 21 |
| Market resolution | 16 |
| **Re-skin + safety injection (new)** | **22** |

The new tests pin what the re-skin must **not** do: never modify its input, never touch semantic status
colours, never change a bare "pillar", never scale body copy, and always preserve teaching content word for
word. Plus: `VERIFY` behaves as missing, and NZ and AU food-safety figures are never equal.

Two tests failed during this stage and were **my own stale assertions**, not code faults: they asserted
Australia had unverified figures, which stopped being true once I completed the AU research. Updated to assert
against a genuinely unverified field instead.

`npm run lint` clean. Member build unchanged: **800 files, 20.03 MB, 956 KB JS.**

---

## 8. Remaining owner decisions

1. **Approve the safety standard** now that NZ and AU are complete — and confirm **who signs off the CRITICAL
   blocks**. I can draft and cite; I should not be the approver of safety advice.
2. **Generator distance for NZ and AU.** The only safety figure still `VERIFY` for the launch markets. The US
   CPSC says 20 feet; I have not found an NZ or AU official equivalent. Options: cite CPSC explicitly as a US
   source, or commission the local figure.
3. **Australian state variance.** AU guidance is state-based, not national. Currently presented as "your state
   emergency service / food authority" with QLD and NSW sources linked. Confirm that is acceptable for launch,
   or whether AU needs per-state profiles (a bigger job).
4. **The broken cover images** were broken in the original programme build, so the existing PDFs shipped
   without covers. Confirm you want the re-skinned PDFs regenerated with the covers restored.
5. **Approve the 11 Group-A re-skins**, then whether to proceed to Group B (34 resources, which need the
   safety and copy work, not just presentation).
6. **Where does the private deployment live?** Still unanswered, and it is now the blocker for anything beyond
   a local preview. The public repository is not a suitable home for member resources.

---

## 9. Not done, by instruction

- **No bulk re-skinning** beyond Group A.
- **`--real` still disabled**; no real batch import.
- **Nothing published**; the only deployment was a local preview on 127.0.0.1.
- **US and CA** left unresolved, architecture intact.
