import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ResourceSchema } from "@/lib/content/schemas";

/**
 * Stage 9.83 — OG-04 Property Type Review is STAGED as protected resource #25 (private-assets only; not deployed).
 * Skipped where the private assets are absent (they are git-ignored).
 */
const root = process.cwd();
const rec = path.join(root, "private-assets/data-resources/property-type-review.private.json");
const sha = (f: string) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex").toUpperCase();

describe.skipIf(!fs.existsSync(rec))("Stage 9.83 · OG-04 staged record and PDFs", () => {
  const r = JSON.parse(fs.readFileSync(rec, "utf8")) as Record<string, unknown>;

  it("is res-1004 with the locked metadata, as a draft, and passes the strict schema", () => {
    expect(ResourceSchema.safeParse(r).success).toBe(true);
    expect(r).toMatchObject({ id: "res-1004", slug: "property-type-review", legacyCode: "OG-04", title: "Property Type Review", foundation: "general", programComponent: "resilience-planning", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 15, status: "draft", collections: ["planning-tools"], isPlaceholder: false, tags: [] });
    expect(r.description).toBe("A worksheet to record your property situation, because it shapes what you can change, what may need permission and what to check first, before you make resilience or off-grid changes.");
  });

  it("carries exactly the six approved related resources, not the 3-Tier Budget Planner or the 90-Day Roadmap", () => {
    expect(r.relatedResources).toEqual(["res-1001", "res-1002", "res-1022", "res-1003", "res-1020", "res-1512"]);
  });

  it("has a unique id and slug among the protected records and the demo data", () => {
    const dir = path.join(root, "private-assets/data-resources");
    const all = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; slug: string });
    expect(all.filter((x) => x.id === "res-1004")).toHaveLength(1);
    expect(all.filter((x) => x.slug === "property-type-review")).toHaveLength(1);
    expect(fs.existsSync(path.join(root, "data/resources/property-type-review.json"))).toBe(false);
  });

  it("stages the two approved Stage 9.82A PDFs byte-identically (full SHA-256)", () => {
    expect(sha(path.join(root, "private-assets/resources/property-type-review.NZ.pdf"))).toBe("C39C3D561573E1816AD1C43DDC4B2F3EED2CE086D40EEEB4DC5C437E004CF96E");
    expect(sha(path.join(root, "private-assets/resources/property-type-review.AU.pdf"))).toBe("A1E4EF42DE129671BDEA6A7D8E03B8EA4CA6B32749E51A0488205CE67D5C0F7E");
  });

  it("keeps the PDFs out of public/", () => {
    expect(fs.existsSync(path.join(root, "public/resources/property-type-review.NZ.pdf"))).toBe(false);
    expect(fs.existsSync(path.join(root, "public/resources/property-type-review.AU.pdf"))).toBe(false);
  });
});
