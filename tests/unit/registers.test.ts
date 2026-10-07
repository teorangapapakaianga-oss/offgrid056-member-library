import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Stage 9.83A — the three programme registers must agree with each other about the live and staged state, and must stay clean
 * (no truncated paths, control characters or broken encoding). Reads the committed markdown only.
 */
const root = process.cwd();
const names = ["CURRENT_STATUS", "NEXT_ACTIONS", "RESOURCE_REGISTER"] as const;
const text = Object.fromEntries(names.map((n) => [n, fs.readFileSync(path.join(root, "internal/member-programme", `${n}.md`), "utf8")])) as Record<(typeof names)[number], string>;
const LIVE_WORKER = "89333107-7c0a-4bdb-8229-f2b5241a9e05";
const ROLLBACK = "e63141a1-380a-4770-a125-9fd7a15d0bdb";

describe("Stage 9.83A · register hygiene", () => {
  for (const n of names) {
    it(`${n}: no control characters, mojibake or truncated paths`, () => {
      expect(text[n]).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
      expect(text[n]).not.toContain("â€");
      expect(text[n]).not.toMatch(/(^|[^a])dmin-import/);
    });

    it(`${n}: every referenced file exists and every Worker id is a complete known one`, () => {
      const files = [...new Set([...text[n].matchAll(/(?:admin-import|internal)\/[A-Za-z0-9_.\-/]+\.(?:md|json)/g)].map((m) => m[0]))];
      for (const f of files) expect(fs.existsSync(path.join(root, f)), f).toBe(true);
      const known = new Set([LIVE_WORKER, ROLLBACK, "7de9641f-df4c-4cab-8e84-055c0861879d", "db2fd12a-955e-47c4-b3c9-d174e3da85d8", "fa23ec74-85d2-4d91-b484-3f037ccbe38b", "1922f7ba-a0b3-4a7b-ba01-593b3df6a160"]);
      for (const w of text[n].match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) ?? []) expect(known.has(w), w).toBe(true);
    });
  }
});

describe("Stage 9.83A · the registers agree on the current state", () => {
  for (const n of names) {
    it(`${n}: live 24 protected / 48 market files, staged 25 / 50, the live Worker and the rollback target`, () => {
      expect(text[n]).toMatch(/\b24 protected/);
      expect(text[n]).toMatch(/\b48 market files/);
      expect(text[n]).toMatch(/\b25 protected/);
      expect(text[n]).toMatch(/\b50 market files/);
      expect(text[n]).toContain(LIVE_WORKER);
      expect(text[n]).toContain(ROLLBACK);
    });

    it(`${n}: OG-04 is staged and not deployed, and deployment needs the owner's approval`, () => {
      expect(text[n]).toMatch(/STAGED, NOT DEPLOYED|Staged, not deployed/);
      expect(text[n]).toMatch(/approval/);
      expect(text[n]).not.toMatch(/OG-04[^\n]{0,80}\b(is|are) (now )?live\b/i);
    });
  }

  it("the resource register counts the 45 legacy resources: 24 live + 1 staged + 1 blocked + 19 not started", () => {
    const rr = text.RESOURCE_REGISTER;
    expect(24 + 1 + 1 + 19).toBe(45);
    expect(rr).toMatch(/\*\*Deployed \/ LIVE\*\*[^\n]*\*\*24\*\*/);
    expect(rr).toMatch(/\*\*Staged, not deployed\*\*[^\n]*\*\*1\*\* \(OG-04\)/);
    expect(rr).toMatch(/\*\*Blocked\*\*[^\n]*\*\*1\*\*/);
    expect(rr).toMatch(/\*\*Not started\*\*[^\n]*\*\*19\*\*/);
    expect(rr).toContain("## Deployed — LIVE (24)");
    expect(rr).toContain("## Not started (19)");
  });

  it("OG-04 is registered as res-1004 with the locked classification, staged, in Planning Tools", () => {
    const row = text.RESOURCE_REGISTER.split("\n").find((l) => l.startsWith("| `res-1004` |"))!;
    expect(row).toContain("| OG-04 | Property Type Review | general | resilience-planning | planning | worksheet | planning-tools | **STAGED, NOT DEPLOYED** |");
    const deployed = text.RESOURCE_REGISTER.split("## Deployed")[1].split("## Staged")[0];
    expect(deployed).not.toContain("| OG-04 |");
  });

  it("every protected record that exists is in the classification table with its own classification, when the private records are present", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; legacyCode: string; title: string; foundation: string; programComponent: string; category: string; resourceType: string });
    expect(recs).toHaveLength(25);
    for (const r of recs) {
      const row = text.RESOURCE_REGISTER.split("\n").find((l) => l.startsWith(`| \`${r.id}\` |`));
      expect(row, r.id).toBeTruthy();
      expect(row, r.id).toContain(`| ${r.legacyCode} | ${r.title} | ${r.foundation} | ${r.programComponent} | ${r.category} | ${r.resourceType} |`);
    }
  });
});
