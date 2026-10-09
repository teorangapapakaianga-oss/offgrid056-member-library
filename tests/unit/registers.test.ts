import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Stages 9.83A and 9.84 — the three programme registers must agree with each other about the live state, and must stay clean
 * (no truncated paths, control characters or broken encoding). Reads the committed markdown only.
 *
 * Current state (Stage 10.14): LIVE 29 protected resources · 58 market files (OG-12 res-1012 and OG-14 res-1014 deployed); STAGED (not deployed) OG-23 res-1023 = 30 / 60; OG-07 (res-1007), OG-06 (res-1006) and OG-04 live (Stage 9.84); the protected
 * navigation cleanup (Start Here, Five Foundations pointer) DEPLOYED (Stage 9.88); OG-05 merged / no standalone resource.
 */
const root = process.cwd();
const names = ["CURRENT_STATUS", "NEXT_ACTIONS", "RESOURCE_REGISTER"] as const;
const text = Object.fromEntries(names.map((n) => [n, fs.readFileSync(path.join(root, "internal/member-programme", `${n}.md`), "utf8")])) as Record<(typeof names)[number], string>;
const LIVE_WORKER = "61f3bcf8-c4df-4d52-a060-b760bfbabc26";
const ROLLBACK = "b7091068-bbee-4ac5-9f8b-1e9f7cb47b28";
const OLDER = ["e1b31486-afbe-4849-9702-a54e51114717", "8834be25-0110-4355-94a5-93b9943f792d", "5d88271b-6f06-4be8-9fd9-6b73fa4a002a", "2fb0663d-a7da-4acf-ba4c-957886b21631", "65437c37-b731-4851-b67e-5b0fae79fe12", "89333107-7c0a-4bdb-8229-f2b5241a9e05", "e63141a1-380a-4770-a125-9fd7a15d0bdb", "7de9641f-df4c-4cab-8e84-055c0861879d", "db2fd12a-955e-47c4-b3c9-d174e3da85d8", "fa23ec74-85d2-4d91-b484-3f037ccbe38b", "1922f7ba-a0b3-4a7b-ba01-593b3df6a160"];
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
    it(`${n}: live 29 protected / 58 market files, the live Worker and the immediate rollback`, () => {
      const c = current(n);
      expect(c).toMatch(/\b29 protected/);
      expect(c).toMatch(/\b58 market files/);
      expect(c).toContain(LIVE_WORKER);
      expect(c).toContain(ROLLBACK);
    });

    it(`${n}: OG-04, OG-06 (res-1006) and OG-07 (res-1007) are live, OG-12 (res-1012) and OG-14 (res-1014) are live, OG-23 (res-1023) is staged and not deployed, and the current-state statement carries no stale counts`, () => {
      const c = current(n);
      expect(c).toMatch(/OG-04[^\n]*(is live|live as protected resource #25|is deployed|deployed as protected resource #25|is live as)/);
      expect(c).toMatch(/STAGED, NOT DEPLOYED(:\*\*|:|\s*=)?\s*(\*\*)?\s*OG-23 Supplier Comparison Worksheet \(`res-1023`\)/);
      expect(c).toMatch(/OG-14 Water, Food and Air Household Snapshot \(`res-1014`\) is live as protected resource #29/);
      expect(c).toMatch(/OG-12 Pantry Rotation Tracker \(`res-1012`\) is live as protected resource #28/);
      expect(c).toMatch(/OG-07 Priority Lock Worksheet (?:\(`res-1007`\) )?is live as protected resource #27/);
      expect(c).toMatch(/OG-06 Emergency Readiness Checklist (?:\(`res-1006`\) )?is live as protected resource #26(?: \(`res-1006`)?/);
      expect(c).toMatch(/OG-11 correction deployed \(Stage 10\.02B\)/);
      expect(c).toMatch(/explicit owner approval to deploy OG-23/);
      expect(c).not.toMatch(/explicit owner approval to deploy OG-14/);
      expect(c).not.toMatch(/explicit owner approval to deploy OG-12/);
      expect(c).not.toMatch(/Pending content revision/);
      expect(c).not.toMatch(/\b26 protected resources, 52|\b25 protected resources, 50|\b24 protected|\b48 market files|24 live|OG-04[^\n]{0,60}(is|are) (still )?staged/i);
      expect(c).not.toMatch(/Worker `(?:b7091068|e1b31486|8834be25|5d88271b|2fb0663d|65437c37|89333107)[^`]*` \(100%\)/); // the previous Workers are rollbacks, not the live one
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

    it(`${n}: states that the navigation cleanup is DEPLOYED (Stage 9.88), that no resource is staged, and no longer says it awaits approval`, () => {
      const c = current(n);
      expect(c).toMatch(/Navigation cleanup: DEPLOYED \(Stage 9\.88\)/);
      expect(c).toMatch(/OG-01 and OG-02 only/);
      expect(c).not.toMatch(/Built, not deployed|Deploying the navigation cleanup needs|awaiting (?:the owner's )?approval/i);
    });
  }

  it("the owner-locked counts (Stage 9.87A) are the operational counts: no register still carries the old Prepared 1 / Blocked 0 expectation as an open question", () => {
    for (const n of names) {
      const c = current(n);
      expect(c, n).not.toMatch(/Prepared 1\b|Blocked 0\b|discrepancy for the owner|confirmation of the Prepared/i);
    }
    const cs = current("CURRENT_STATUS");
    expect(cs).toMatch(/Deployed 29 · Staged 1 \(OG-23\) · Prepared 0 · Blocked 1 \(OG-16[^)]*\) · Merged \/ No standalone resource 1 \(OG-05\) · Not started 13 = 45/);
    expect(text.RESOURCE_REGISTER).toMatch(/The owner locked the verified migration-state counts/);
    expect(text.NEXT_ACTIONS).toMatch(/Stage 9\.87A note\.\*\* The owner locked the verified 45-resource migration-state counts/);
    expect(text.RESOURCE_REGISTER).toContain("## Stage 9.87A note");
  });

  it("OG-16 is the one Blocked resource, still blocked on grants research, and is not in any other state", () => {
    const rr = text.RESOURCE_REGISTER;
    const blocked = rr.split("## Blocked")[1].split("## Merged / No standalone resource")[0];
    expect(blocked).toMatch(/\| OG-16 \| Grant Eligibility Insulation Planner \| \*\*grants research\*\* — NZ programmes; AU state and territory schemes \|/);
    expect((blocked.match(/^\| OG-/gm) ?? []).length).toBe(1);
    expect(rr.split("## Not started (13)")[1].split("## Route clashes")[0]).not.toMatch(/\| OG-16 \|/);
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const codes = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => (JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string }).legacyCode);
      expect(codes).not.toContain("OG-16"); // not migrated
    }
  });

  it("the resource register counts the 45 legacy resources: 29 live + 1 staged + 0 prepared + 1 blocked + 1 merged + 13 not started", () => {
    const rr = text.RESOURCE_REGISTER;
    expect(29 + 1 + 0 + 1 + 1 + 13).toBe(45);
    expect(rr).toMatch(/\*\*Deployed \/ LIVE\*\*[^\n]*\*\*29\*\*/);
    expect(rr).toMatch(/\*\*Staged, not deployed\*\*[^\n]*\*\*1\*\* \(OG-23\)/);
    expect(rr).toMatch(/\*\*Prepared\*\*[^\n]*\*\*0\*\*/);
    expect(rr).toMatch(/\*\*Blocked\*\*[^\n]*\*\*1\*\*/);
    expect(rr).toMatch(/\*\*Merged \/ No standalone resource\*\*[^\n]*\*\*1\*\* \(OG-05\)/);
    expect(rr).toMatch(/\*\*Not started\*\*[^\n]*\*\*13\*\*/);
    expect(rr).toContain("## Deployed — LIVE (29)");
    expect(rr).toContain("## Staged, not deployed (1)");
    expect(rr).toContain("## Merged / No standalone resource (1)");
    expect(rr).toContain("## Not started (13)");
  });

  it("the table rows agree with the counts, and OG-05 sits only in the Merged section", () => {
    const rr = text.RESOURCE_REGISTER;
    const rows = (a: string, b: string) => [...rr.split(a)[1].split(b)[0].matchAll(/^\| \*{0,2}(OG-[B0-9]+)\*{0,2} \|/gm)].map((m) => m[1]);
    const deployed = rows("## Deployed", "## Staged");
    const staged = rows("## Staged", "## Prepared");
    const blocked = rows("## Blocked", "## Merged / No standalone resource");
    const merged = rows("## Merged / No standalone resource", "## Not started");
    const notStarted = rows("## Not started", "## Route clashes");
    expect([deployed.length, staged.length, blocked.length, merged.length, notStarted.length]).toEqual([29, 1, 1, 1, 13]);
    expect(deployed).toContain("OG-06");
    expect(deployed).toContain("OG-07");
    expect(staged).toEqual(["OG-23"]);
    expect(deployed).toContain("OG-14");
    expect(deployed).toContain("OG-12");
    expect(merged).toEqual(["OG-05"]);
    expect([...deployed, ...staged, ...blocked, ...notStarted]).not.toContain("OG-05");
    expect(new Set([...deployed, ...staged, ...blocked, ...merged, ...notStarted]).size).toBe(45);
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

  it("every protected record that exists is in the classification table with its own classification; 29 are LIVE and res-1023 is STAGED (30 records), when the private records are present", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; legacyCode: string; title: string; foundation: string; programComponent: string; category: string; resourceType: string });
    expect(recs).toHaveLength(30);
    for (const r of recs) {
      const row = text.RESOURCE_REGISTER.split("\n").find((l) => l.startsWith(`| \`${r.id}\` |`));
      expect(row, r.id).toBeTruthy();
      expect(row, r.id).toContain(`| ${r.legacyCode} | ${r.title} | ${r.foundation} | ${r.programComponent} | ${r.category} | ${r.resourceType} |`);
      expect(row, r.id).toMatch(r.id === "res-1023" ? /\| STAGED \|$/ : /\| LIVE \|$/);
    }
  });
});
