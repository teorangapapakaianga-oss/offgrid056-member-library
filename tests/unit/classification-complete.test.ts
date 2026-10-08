import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_COMPONENTS } from "@/lib/content/constants";
import { ResourceSchema } from "@/lib/content/schemas";
import { PROGRAM_ALIGNMENT_KEYS } from "@/admin-import/pilot/prep";

/**
 * Stage 9.73 — every protected resource carries a Foundation, a Programme Component, a Category and a Type, and has
 * answered the five alignment questions. No resource depends on the old `deployedBeforeClassification` exemption.
 */
const root = process.cwd();
const recDir = path.join(root, "private-assets/data-resources");
const hasPrivate = fs.existsSync(recDir);
const records = hasPrivate
  ? fs.readdirSync(recDir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(recDir, f), "utf8")) as Record<string, unknown> & { legacyCode: string; id: string })
  : [];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources;
const config = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { components: Record<string, unknown>; deployedBeforeClassification: string[]; classificationsDecided: Record<string, string> };

describe.skipIf(!hasPrivate)("Stage 9.73 · classification of every protected resource", () => {
  it("covers all 27 protected resources (the 26 live ones plus OG-07, staged in Stage 9.99)", () => {
    expect(records).toHaveLength(27);
    expect(records.find((r) => r.legacyCode === "OG-03")?.programComponent).toBe("planning-implementation");
    expect(records.find((r) => r.legacyCode === "OG-04")?.programComponent).toBe("resilience-planning");
    expect(records.find((r) => r.legacyCode === "OG-06")?.programComponent).toBe("resilience-emergency");
  });

  it("every record parses against the strict schema, with Foundation, Programme Component, Category and Type", () => {
    for (const r of records) {
      const parsed = ResourceSchema.safeParse(r);
      expect(parsed.success, `${r.legacyCode}: ${parsed.success ? "" : parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`).toBe(true);
      expect(r.foundation, `${r.legacyCode} foundation`).toBeTruthy();
      expect(PROGRAM_COMPONENTS as readonly string[], `${r.legacyCode} programComponent`).toContain(r.programComponent);
      expect(r.category, `${r.legacyCode} category`).toBeTruthy();
      expect(r.resourceType, `${r.legacyCode} type`).toBeTruthy();
    }
  });

  it("every resource has answered all five alignment questions, and the review config agrees with the record", () => {
    for (const r of records) {
      const e = meta[r.legacyCode];
      expect(e, `${r.legacyCode} has a metadata-review entry`).toBeDefined();
      expect(e.programComponent, `${r.legacyCode} review component matches the record`).toBe(r.programComponent);
      const a = (e.programAlignment ?? {}) as Record<string, string>;
      for (const k of PROGRAM_ALIGNMENT_KEYS) expect(a[k]?.trim(), `${r.legacyCode} alignment answer: ${k}`).toBeTruthy();
      expect(a.wordingMatchesRole, `${r.legacyCode} wording must match its role`).toMatch(/^yes\b/i);
    }
  });

  it("applies the owner's eight Stage 9.73 rulings exactly", () => {
    const want: Record<string, string> = {
      "OG-08": "off-grid-living", "OG-17": "off-grid-living", "OG-19": "off-grid-living", "OG-11": "resilience-emergency",
      "OG-13": "resilience-planning", "OG-21": "planning-implementation", "OG-22": "resilience-planning", "OG-B10": "planning-implementation",
    };
    for (const [code, component] of Object.entries(want)) expect(records.find((r) => r.legacyCode === code)?.programComponent, code).toBe(component);
  });

  it("applies the earlier locked rulings, and does not make a resource advanced-future merely for being advanced", () => {
    for (const [code, component] of Object.entries(config.classificationsDecided)) {
      const r = records.find((x) => x.legacyCode === code);
      if (r) expect(r.programComponent, code).toBe(component);
    }
    const advanced = records.filter((r) => r.programComponent === "advanced-future").map((r) => r.legacyCode).sort();
    // Stage 9.73A (owner): advanced-future is reserved for integrated whole-property, multi-system or specialist architecture.
    expect(advanced).toEqual(["OG-B12"]);
    expect(records.find((r) => r.legacyCode === "OG-B07")?.programComponent, "OG-B07 is an advanced single-system solar resource").toBe("off-grid-living");
    expect(records.find((r) => r.legacyCode === "OG-B10")?.programComponent).toBe("planning-implementation");
  });

  it("Stage 9.73A: the ten confirmations are recorded as owner rulings, and nothing is still marked 'owner to confirm'", () => {
    const ten: Record<string, string> = {
      "OG-27": "planning-implementation", "OG-25": "planning-implementation", "OG-B04": "planning-implementation",
      "OG-18": "off-grid-living", "OG-20": "off-grid-living", "OG-09": "off-grid-living", "OG-10": "off-grid-living", "OG-B08": "off-grid-living",
      "OG-15": "resilience-planning", "OG-02": "resilience-planning",
    };
    for (const [code, component] of Object.entries(ten)) {
      expect(records.find((r) => r.legacyCode === code)?.programComponent, code).toBe(component);
      expect(config.classificationsDecided[code], `${code} recorded as decided`).toBe(component);
      expect(meta[code].programComponentStatus, code).toMatch(/OWNER RULING 2026-10-07 \(Stage 9\.73A\)/);
    }
    for (const r of records) expect(String(meta[r.legacyCode]?.programComponentStatus ?? ""), `${r.legacyCode} status`).not.toMatch(/owner to confirm/i);
  });

  it("Stage 9.73A: OG-B07 is recorded as an owner correction, and OG-22 as an explicit override of the budgeting rule", () => {
    expect(meta["OG-B07"].programComponentStatus).toMatch(/CORRECTION/);
    expect(meta["OG-22"].programComponentStatus).toMatch(/EXPLICIT OVERRIDE of the general budgeting rule/);
    expect(records.find((r) => r.legacyCode === "OG-22")?.programComponent).toBe("resilience-planning");
    expect(records.find((r) => r.legacyCode === "OG-B12")?.programComponent).toBe("advanced-future");
  });

  it("the exemption list is empty: no resource depends on it", () => {
    expect(config.deployedBeforeClassification).toEqual([]);
  });
});

describe("Stage 9.73 · the component vocabulary is unchanged", () => {
  it("is exactly the five locked components", () => {
    expect(Object.keys(config.components).sort()).toEqual(["advanced-future", "off-grid-living", "planning-implementation", "resilience-emergency", "resilience-planning"]);
    expect([...PROGRAM_COMPONENTS].sort()).toEqual(Object.keys(config.components).sort());
  });
});
