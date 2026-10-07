import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Stages 9.83A and 9.84 — the three programme registers must agree with each other about the live state, and must stay clean
 * (no truncated paths, control characters or broken encoding). Reads the committed markdown only.
 *
 * Current state (Stage 9.84): OG-04 is live as protected resource #25 → 25 protected resources · 50 market files; nothing staged.
 */
const root = process.cwd();
const names = ["CURRENT_STATUS", "NEXT_ACTIONS", "RESOURCE_REGISTER"] as const;
const text = Object.fromEntries(names.map((n) => [n, fs.readFileSync(path.join(root, "internal/member-programme", `${n}.md`), "utf8")])) as Record<(typeof names)[number], string>;
const LIVE_WORKER = "65437c37-b731-4851-b67e-5b0fae79fe12";
const ROLLBACK = "89333107-7c0a-4bdb-8229-f2b5241a9e05";
const OLDER = ["e63141a1-380a-4770-a125-9fd7a15d0bdb", "7de9641f-df4c-4cab-8e84-055c0861879d", "db2fd12a-955e-47c4-b3c9-d174e3da85d8", "fa23ec74-85d2-4d91-b484-3f037ccbe38b", "1922f7ba-a0b3-4a7b-ba01-593b3df6a160"];
/** The statement of the CURRENT state at the top of each register: from "As at" to the first stage note, section or rule. */
const current = (n: (typeof names)[number]) => { const t = text[n]; const a = t.indexOf("**As at:**"); const rest = t.slice(a); const e = rest.search(/\n> \*\*Stage|\n## |\n---/); return e < 0 ? rest : rest.slice(0, e); };

describe("Stage 9.84 · register hygiene", () => {
  for (const n of names) {
    it(`${n}: no control characters, mojibake or truncated paths`, () => {
      expect(text[n]).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
      expect(text[n]).not.toContain("â€");
      expect(text[n]).not.toMatch(/(^|[^a])dmin-import/);
    });

    it(`${n}: every referenced file exists and every Worker id is a complete known one`, () => {
      const files = [...new Set([...text[n].matchAll(/(?:admin-import|internal)\/[A-Za-z0-9_.\-/]+\.(?:md|json)/g)].map((m) => m[0]))];
      for (const f of files) expect(fs.existsSync(path.join(root, f)), f).toBe(true);
      const known = new Set([LIVE_WORKER, ROLLBACK, ...OLDER]);
      for (const w of text[n].match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) ?? []) expect(known.has(w), w).toBe(true);
    });
  }
});

describe("Stage 9.84 · the registers agree on the current state", () => {
  for (const n of names) {
    it(`${n}: live 25 protected / 50 market files, the live Worker and the immediate rollback`, () => {
      const c = current(n);
      expect(c).toMatch(/\b25 protected/);
      expect(c).toMatch(/\b50 market files/);
      expect(c).toContain(LIVE_WORKER);
      expect(c).toContain(ROLLBACK);
    });

    it(`${n}: OG-04 is live, nothing is staged, and the current-state statement carries no stale counts`, () => {
      const c = current(n);
      expect(c).toMatch(/OG-04[^\n]*(is live|live as protected resource #25|is deployed|deployed as protected resource #25|is live as)/);
      expect(c).toMatch(/STAGED, NOT DEPLOYED(:\*\*|:|\s*=)?\s*(\*\*)?\s*none/i);
      expect(c).not.toMatch(/\b24 protected|\b48 market files|24 live|OG-04[^\n]{0,60}(is|are) (still )?staged/i);
      expect(c).not.toMatch(/Worker `89333107[^`]*` \(100%\)/); // the previous Worker is the rollback, not the live one
    });
  }

  for (const n of names) {
    it(`${n}: OG-05 is MERGED / NO STANDALONE RESOURCE, and is not described as awaiting migration`, () => {
      const c = current(n);
      expect(c).toMatch(/OG-05/);
      expect(c).toContain("MERGED / NO STANDALONE RESOURCE");
      expect(c).toMatch(/No res-ID/);
      expect(c).not.toMatch(/OG-05[^.\n]{0,100}\b(awaiting migration|is (?:still )?not started|to be migrated|will be migrated|pending migration)\b/i);
    });

    it(`${n}: states that the Stage 9.87 navigation cleanup is built and NOT deployed, and that no resource is staged`, () => {
      const c = current(n);
      expect(c).toMatch(/Built, not deployed \(not a resource\)/);
      expect(c).toMatch(/explicit approval/);
    });
  }

  it("the owner-locked counts (Stage 9.87A) are the operational counts: no register still carries the old Prepared 1 / Blocked 0 expectation as an open question", () => {
    for (const n of names) {
      const c = current(n);
      expect(c, n).not.toMatch(/Prepared 1\b|Blocked 0\b|discrepancy for the owner|confirmation of the Prepared/i);
    }
    const cs = current("CURRENT_STATUS");
    expect(cs).toMatch(/Deployed 25 · Staged 0 · Prepared 0 · Blocked 1 \(OG-16\) · Merged \/ No standalone resource 1 \(OG-05\) · Not started 18 = 45/);
    expect(cs).toMatch(/locked by the owner in Stage 9\.87A/);
    expect(text.NEXT_ACTIONS).toMatch(/Stage 9\.87A note\.\*\* The owner locked the verified 45-resource migration-state counts/);
    expect(text.RESOURCE_REGISTER).toContain("## Stage 9.87A note");
  });

  it("OG-16 is the one Blocked resource, still blocked on grants research, and is not in any other state", () => {
    const rr = text.RESOURCE_REGISTER;
    const blocked = rr.split("## Blocked")[1].split("## Merged / No standalone resource")[0];
    expect(blocked).toMatch(/\| OG-16 \| Grant Eligibility Insulation Planner \| \*\*grants research\*\* — NZ programmes; AU state and territory schemes \|/);
    expect((blocked.match(/^\| OG-/gm) ?? []).length).toBe(1);
    expect(rr.split("## Not started (18)")[1].split("## Route clashes")[0]).not.toMatch(/\| OG-16 \|/);
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const codes = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => (JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string }).legacyCode);
      expect(codes).not.toContain("OG-16"); // not migrated
    }
  });

  it("the resource register counts the 45 legacy resources: 25 live + 0 staged + 0 prepared + 1 blocked + 1 merged + 18 not started", () => {
    const rr = text.RESOURCE_REGISTER;
    expect(25 + 0 + 0 + 1 + 1 + 18).toBe(45);
    expect(rr).toMatch(/\*\*Deployed \/ LIVE\*\*[^\n]*\*\*25\*\*/);
    expect(rr).toMatch(/\*\*Staged, not deployed\*\*[^\n]*\*\*0\*\*/);
    expect(rr).toMatch(/\*\*Prepared\*\*[^\n]*\*\*0\*\*/);
    expect(rr).toMatch(/\*\*Blocked\*\*[^\n]*\*\*1\*\*/);
    expect(rr).toMatch(/\*\*Merged \/ No standalone resource\*\*[^\n]*\*\*1\*\* \(OG-05\)/);
    expect(rr).toMatch(/\*\*Not started\*\*[^\n]*\*\*18\*\*/);
    expect(rr).toContain("## Deployed — LIVE (25)");
    expect(rr).toContain("## Staged, not deployed (0)");
    expect(rr).toContain("## Merged / No standalone resource (1)");
    expect(rr).toContain("## Not started (18)");
  });

  it("the table rows agree with the counts, and OG-05 sits only in the Merged section", () => {
    const rr = text.RESOURCE_REGISTER;
    const rows = (a: string, b: string) => [...rr.split(a)[1].split(b)[0].matchAll(/^\| \*{0,2}(OG-[B0-9]+)\*{0,2} \|/gm)].map((m) => m[1]);
    const deployed = rows("## Deployed", "## Staged");
    const blocked = rows("## Blocked", "## Merged / No standalone resource");
    const merged = rows("## Merged / No standalone resource", "## Not started");
    const notStarted = rows("## Not started", "## Route clashes");
    expect([deployed.length, blocked.length, merged.length, notStarted.length]).toEqual([25, 1, 1, 18]);
    expect(merged).toEqual(["OG-05"]);
    expect([...deployed, ...blocked, ...notStarted]).not.toContain("OG-05");
    expect(new Set([...deployed, ...blocked, ...merged, ...notStarted]).size).toBe(45);
  });

  it("the merged state is register-only: no protected resource carries it, and no record or schema has the value", () => {
    expect(text.RESOURCE_REGISTER).toMatch(/\*\*not\*\* a protected-resource status value/);
    const schema = fs.readFileSync(path.join(root, "lib/content/schemas.ts"), "utf8") + fs.readFileSync(path.join(root, "lib/content/constants.ts"), "utf8");
    expect(schema).not.toMatch(/MERGED|NO STANDALONE/i);
  });

  it("OG-04 is registered as live res-1004 with the locked classification, in Planning Tools", () => {
    const rr = text.RESOURCE_REGISTER;
    const row = rr.split("\n").find((l) => l.startsWith("| `res-1004` |"))!;
    expect(row).toContain("| OG-04 | Property Type Review | general | resilience-planning | planning | worksheet | planning-tools | LIVE |");
    expect(rr.split("## Deployed")[1].split("## Staged")[0]).toContain("| OG-04 | Property Type Review | general / worksheet |");
    expect(rr).not.toContain("**STAGED, NOT DEPLOYED** |");
  });

  it("every protected record that exists is in the classification table with its own classification and state LIVE, when the private records are present", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; legacyCode: string; title: string; foundation: string; programComponent: string; category: string; resourceType: string });
    expect(recs).toHaveLength(25);
    for (const r of recs) {
      const row = text.RESOURCE_REGISTER.split("\n").find((l) => l.startsWith(`| \`${r.id}\` |`));
      expect(row, r.id).toBeTruthy();
      expect(row, r.id).toContain(`| ${r.legacyCode} | ${r.title} | ${r.foundation} | ${r.programComponent} | ${r.category} | ${r.resourceType} |`);
      expect(row, r.id).toMatch(/\| LIVE \|$/);
    }
  });
});
