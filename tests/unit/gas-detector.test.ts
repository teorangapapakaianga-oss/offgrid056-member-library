import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { safetyExposureFor, fuelTeachingSignals } from "@/admin-import/audit/group-a";
import { fuelSafetyFindings } from "@/admin-import/pilot/prep";

/**
 * Stage 9.57 — the gas topic detector must read what a document DOES, not count a word.
 *
 * The old rule was `\bgas\b` three times with no teaching condition. It demanded a gas safety block from OG-17, a
 * solid-fuel planner whose only gas content is "the gas stops flowing" and "Gas supplies can be disrupted" — mains
 * gas as an example of something that fails in an outage. The same rule would have let a document teach entirely
 * in compounds ("refill the LPG cylinder, check the regulator") without ever requiring a block.
 */
const requiresGas = (text: string) => safetyExposureFor(text).includes("gas-and-lpg");

/** OG-17's gas content, verbatim. Both sentences, which is all of it. */
const OG17_NARRATIVE =
  "Plan your solid fuel system for when the power goes out and the gas stops flowing. " +
  "Why Solid Fuel Matters: when the grid fails in winter, electric heaters stop. Gas supplies can be disrupted. " +
  "But a wood burner with a dry wood supply keeps burning. Solid fuel is the original off-grid heating.";

/** OG-B09's heating comparison row, verbatim — a table that teaches without a verb in sight. */
const OGB09_TABLE =
  "Heat pump $3,000-$6,000 Low 300-400% No Primary heating, most efficient " +
  "Wood burner $2,000-$5,000 Low 65-85% Yes Backup + ambiance " +
  "Flued gas $1,500-$4,000 Moderate 80-90% No (gas supply) Quick heat, no power needed " +
  "Panel / convection $100-$500 High 100% No Supplementary, small rooms";

describe("Stage 9.57 · narrative gas does not demand a safety block", () => {
  it("1. a supply-disruption narrative does not trigger", () => {
    expect(requiresGas(OG17_NARRATIVE)).toBe(false);
    expect(fuelTeachingSignals(OG17_NARRATIVE)).toEqual([]);
  });

  it("2. repeating the narrative does not trigger — the count is not the test", () => {
    expect(requiresGas([OG17_NARRATIVE, OG17_NARRATIVE, OG17_NARRATIVE].join(" "))).toBe(false);
  });

  it("10. 'gas supply' on its own is never enough", () => {
    const text = "Mains gas supply may fail. The gas supply is not guaranteed. Check your gas supply arrangements.";
    expect(requiresGas(text)).toBe(false);
    expect(fuelTeachingSignals(text)).toEqual([]);
  });

  it("10b. a fuel listed among options is not teaching", () => {
    // OG-B12 and OG-26 both do this, and both are live. Naming a fuel among alternatives is planning, not gas advice.
    const text =
      "Storage: lithium battery bank, generator fuel reserve (diesel/petrol/LPG). " +
      "Fuel: firewood, LPG, or diesel. Blackwater: composting toilet, septic tank, or biogas digester.";
    expect(requiresGas(text)).toBe(false);
  });

  it("10c. does not read 'fireplace' as an instruction about a gas heater", () => {
    // Word boundaries: `plac(e)` matched inside **fire**place**, which made a checklist row teach gas. OG-15 is live.
    const text = "Backup heating exists (fireplace, wood burner, gas heater, portable). Alternative heat source: fireplace, wood burner, gas heater, or camping stove.";
    expect(fuelTeachingSignals(text)).toEqual([]);
  });
});

describe("Stage 9.57 · actionable gas content does demand a block", () => {
  it("3. a gas heater instruction triggers", () => {
    const text = "Have your gas heater serviced by a licensed gasfitter. Never use a gas heater overnight. Keep the gas heater clear of curtains.";
    expect(requiresGas(text)).toBe(true);
  });

  it("4. an LPG cylinder instruction triggers", () => {
    const text = "Store the LPG cylinder upright and outdoors. Check the LPG cylinder valve before you connect it. Refill an LPG cylinder only at an approved station.";
    expect(requiresGas(text)).toBe(true);
  });

  it("5. gas leak guidance triggers", () => {
    const text = "If you suspect a gas leak, turn off the gas appliance. Open doors and windows. Do not operate any gas fitting until it is checked.";
    expect(requiresGas(text)).toBe(true);
  });

  it("6. servicing and gasfitter advice triggers", () => {
    const text = "Only a licensed gasfitter may install a gas cooker. Ask the gasfitter for a certificate. A gasfitter must service the gas water heater.";
    expect(requiresGas(text)).toBe(true);
  });

  it("7. table-shaped teaching is recognised, with no instruction verb anywhere", () => {
    // Stage 9.56 named this the likely false negative. An appliance beside a price and an efficiency band is a
    // comparison, and comparing is teaching — even though the row contains no verb at all.
    expect(fuelTeachingSignals(OGB09_TABLE).length).toBeGreaterThan(0);
    // The teaching signal is one half; the topic still has to be present enough to matter. In the real OG-B09 the
    // table is read from both the HTML and the PDF, which is how it reaches the threshold — test 12 proves that.
    expect(requiresGas(`${OGB09_TABLE} ${OGB09_TABLE}`)).toBe(true);
  });

  it("8. a patio heater triggers — the approved block names it, so the detector must see it", () => {
    const text = "Never bring a patio heater indoors. A patio heater is for outdoor use. Store the patio heater under cover.";
    expect(requiresGas(text)).toBe(true);
    expect(fuelSafetyFindings(`<p>${text}</p>`).join(" ")).toContain("GAS_SAFETY_REQUIRED");
  });

  it("9. propane, butane and camping stoves trigger", () => {
    const text = "Connect the propane cylinder carefully. A butane cartridge cooker is for outdoor use. Ventilate when you use a camping stove with a propane cylinder.";
    expect(requiresGas(text)).toBe(true);
    for (const term of ["propane", "butane", "camping stove"]) {
      expect(fuelSafetyFindings(`<p>Use a ${term} outdoors only.</p>`).join(" "), term).toContain("GAS_SAFETY_REQUIRED");
    }
  });
});

describe("Stage 9.57 · the two resources this was built for", () => {
  const root = process.cwd();
  const workspace = path.join(root, "workspace/text/extracted.json");
  const read = (code: string): string | null => {
    if (!fs.existsSync(workspace)) return null;
    const store = JSON.parse(fs.readFileSync(workspace, "utf8")) as Record<string, unknown>;
    const texts = ("texts" in store ? (store as { texts: Record<string, string> }).texts : store) as Record<string, string>;
    const candidates = JSON.parse(fs.readFileSync(path.join(root, "workspace/candidates.json"), "utf8")) as {
      candidateId: string;
      source: { filename: string };
    }[];
    const joined = candidates
      .filter((c) => c.source.filename.startsWith(`${code}_`))
      .map((c) => texts[c.candidateId] ?? "")
      .join("\n");
    return joined || null;
  };

  it("11. OG-17 does not require a gas block, and keeps its solid-fuel and fire requirements", () => {
    const text = read("OG-17");
    if (!text) return; // the extracted-text store is a workspace artefact, not committed
    const exposure = safetyExposureFor(text);
    expect(exposure, "gas").not.toContain("gas-and-lpg");
    expect(exposure, "solid fuel is the whole point of this resource").toContain("solid-fuel-heating");
    expect(exposure, "fire").toContain("fire-and-emergency");
    expect(fuelTeachingSignals(text), "OG-17 teaches nothing about gas").toEqual([]);
  });

  it("12. OG-B09 still requires a gas block", () => {
    const text = read("OG-B09");
    if (!text) return;
    expect(safetyExposureFor(text)).toContain("gas-and-lpg");
    expect(fuelTeachingSignals(text).length).toBeGreaterThan(0);
  });

  it("13. no live resource trips the widened fuel check", () => {
    // The real invariant, taken from prep's own report: the fuel check runs on each resource's OWN text, before
    // the safety blocks are injected. (Run after injection it would fire on the approved blocks' own wording —
    // the CO block names gas heaters — which is exactly why prep checks before.)
    const report = path.join(root, "workspace/prep/prep-report.json");
    if (!fs.existsSync(report)) return;
    const results = JSON.parse(fs.readFileSync(report, "utf8")) as {
      legacyCode: string;
      markets: { code: string; problems: string[] }[];
      terminology: { otherFindings: string[] };
    }[];
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.terminology.otherFindings.filter((f) => f.includes("GAS_SAFETY_REQUIRED")), r.legacyCode).toEqual([]);
      for (const m of r.markets) {
        expect(m.problems.filter((p) => p.includes("GAS_SAFETY_REQUIRED")), `${r.legacyCode}/${m.code}`).toEqual([]);
      }
    }
  });
});
