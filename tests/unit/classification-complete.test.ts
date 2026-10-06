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
  it("covers all 23 protected resources", () => {
    expect(records).toHaveLength(23);
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
    expect(advanced).toEqual(["OG-B07", "OG-B12"]);
    expect(records.find((r) => r.legacyCode === "OG-B10")?.programComponent).toBe("planning-implementation");
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
