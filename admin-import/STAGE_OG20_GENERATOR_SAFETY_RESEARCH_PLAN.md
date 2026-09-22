# FUTURE STAGE — NZ + AU GENERATOR SAFETY RESEARCH (before OG-20)

**Status:** recorded, **NOT started**. This is a research-only stage. It can start only when the owner asks, and OG-20
migration can begin only after the owner approves the result.

## Why

- **OG-20 (Alternative Energy Suitability Check)** mentions generators 14 times. The audit says it covers them
  *"with no carbon monoxide and outdoor-use warning"*.
- The topic detector requires a **`generator-safety`** block, and **no such block exists**.
- **The approved blocks only partly cover it:**
  - The electrical block covers backfeeding and plugging appliances in directly.
  - The carbon-monoxide and indoor-combustion blocks cover part of the hazard.
  - Neither covers generator siting, refuelling or outdoor use.
- **The NZ and AU generator distance** (`figure.generatorDistance`) is still `VERIFY`. **The US figure must not be
  borrowed.**

## Scope (research and draft only)

1. **Sources:** official NZ and AU pages only, read live, **without bypassing bot protection**. Candidates:
   - WorkSafe NZ / Energy Safe
   - Fire and Emergency NZ, Get Ready
   - Energy Safe Victoria
   - NSW Fair Trading / SafeWork
   - state emergency services
2. **Topics:**
   - outdoor use only
   - carbon monoxide, and keeping it away from openings
   - refuelling (engine off, cool)
   - fuel storage
   - no connection to house wiring except through an installed changeover or inlet, by a licensed electrical
     worker (NZ) or licensed electrician (AU)
   - portable RCD / damp conditions
   - noise and neighbours only if an official source covers it
3. **Distances:** state a distance only if an official source for **that market** gives one. Otherwise use
   non-numeric wording, and record the limitation.
4. **Output:**
   - a proposed `generator-safety` block with a separate `marketBody` for NZ and AU, citing the verbatim source for
     each sentence
   - an update to the gas/LPG note only if a generator uses LPG, keeping the gas rule strict
5. **No resource changes, no prep of OG-20, no deployment.**

## Gate

**The owner approves the NZ and AU wording.** Only then is OG-20 prepared, following the standard claims-first
workflow.
