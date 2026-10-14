import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_COMPONENTS } from "@/lib/content/constants";

/**
 * Stage 10.19 — the canonical resource index is a read-only governance document. These tests read it (and, when present, the private records and the register)
 * and never change behaviour: nothing in the application reads the index.
 */
const root = process.cwd();
const idx = JSON.parse(fs.readFileSync(path.join(root, "docs/canonical-resource-index.json"), "utf8")) as {
  controlledValues: Record<string, string[]>;
  resources: Record<string, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};
const md = fs.readFileSync(path.join(root, "docs/CANONICAL_RESOURCE_INDEX.md"), "utf8");
const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");

describe("Stage 10.19 · canonical resource index", () => {
  it("has one record per protected resource, with unique IDs, routes and titles", () => {
    expect(idx.resources).toHaveLength(34); // 33 live + res-1030 staged (Stage 10.23C)
    for (const k of ["stableResourceId", "canonicalRoute", "title"]) expect(new Set(idx.resources.map((r) => r[k] as string)).size, k).toBe(34);
    for (const r of idx.resources) {
      expect(r.stableResourceId).toMatch(/^res-1\d{3}$/);
      expect(r.canonicalRoute).toBe(`/resources/${(r.canonicalRoute as string).split("/")[2]}/`);
    }
  });
  it("carries every schema field", () => {
    const fields = ["stableResourceId", "legacyCode", "title", "resourceType", "foundation", "programComponent", "category", "topic", "shortDescription", "owner", "version", "versionDate", "sourceFile", "sourceLink", "status", "publicationStatus", "releaseChannel", "migrationState", "accessProtection", "firstPublishedToPreview", "visibleBadgeInCurrentBuild", "futureBadgeTooltip", "visibleBadge", "accessTier", "entitlementRequirement", "canonicalRoute", "marketAvailability", "downloadAssets", "reviewStatus", "lastReviewedDate", "collections", "relatedResources", "supersededBy", "withdrawn", "internalOnly", "notes", "recommendationEligible", "handoffStatus", "approvedHandoffRoute", "entitlementContractStatus"];
    for (const r of idx.resources) for (const f of fields) expect(Object.prototype.hasOwnProperty.call(r, f), `${r.stableResourceId} ${f}`).toBe(true);
  });
  it("uses only the controlled Program Component, Foundation and review values", () => {
    expect(idx.controlledValues.programComponent).toEqual([...PROGRAM_COMPONENTS]);
    for (const r of idx.resources) {
      expect(PROGRAM_COMPONENTS, r.stableResourceId).toContain(r.programComponent);
      expect(idx.controlledValues.foundation).toContain(r.foundation);
      for (const f of r.reviewStatus as string[]) expect(idx.controlledValues.reviewStatus).toContain(f);
      expect(r.reviewStatus, `${r.stableResourceId} is not silently verified`).not.toContain("VERIFIED_CURRENT");
    }
  });
  it("never guesses an entitlement: every tier and requirement is UNDEFINED_OWNER_DECISION, and authentication is not entitlement", () => {
    for (const r of idx.resources) { expect(r.accessTier).toBe("UNDEFINED_OWNER_DECISION"); expect(r.entitlementRequirement).toBe("UNDEFINED_OWNER_DECISION"); expect(r.reviewStatus).toContain("NEEDS_ENTITLEMENT_DECISION"); }
  });
  it("keeps the future OS integration fields inactive", () => {
    for (const r of idx.resources) expect([r.recommendationEligible, r.handoffStatus, r.approvedHandoffRoute, r.entitlementContractStatus]).toEqual([false, "INACTIVE", null, "NOT_APPROVED"]);
    expect(JSON.stringify(idx)).not.toMatch(/https?:\/\//i);
  });
  it("exposes no protected body content, local path, Worker ID or credential", () => {
    const all = JSON.stringify(idx) + md;
    expect(all).not.toMatch(/C:[\\/]+Users|\/mnt\/|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|@gmail\.com|api[_-]?key|secret|password/i);
    for (const r of idx.resources) expect(r.shortDescription).toMatch(/^WITHHELD_FROM_PUBLIC_REPOSITORY/);
  });
  it("lists no superseded, withdrawn or internal resource, and every resource is LIVE in the register", () => {
    for (const r of idx.resources) {
      expect([r.supersededBy, r.withdrawn, r.internalOnly]).toEqual([null, false, false]);
      const row = rr.split("\n").find((l) => l.startsWith(`| \`${r.stableResourceId}\` |`));
      expect(row, r.stableResourceId).toBeTruthy();
      expect(row, r.stableResourceId).toMatch(r.stableResourceId === "res-1030" ? /\| STAGED \|$/ : /\| LIVE \|$/);
    }
  });
  it("matches the private resource records when they are present", () => {
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Record<string, any>); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(recs.map((r) => r.id).sort()).toEqual(idx.resources.map((r) => r.stableResourceId).sort());
    for (const rec of recs) {
      const r = idx.resources.find((x) => x.stableResourceId === rec.id)!;
      expect([r.legacyCode, r.title, r.resourceType, r.foundation, r.programComponent, r.category, r.status, r.canonicalRoute]).toEqual([rec.legacyCode, rec.title, rec.resourceType, rec.foundation, rec.programComponent, rec.category, rec.status, `/resources/${rec.slug}/`]);
      expect(r.collections).toEqual(rec.collections ?? []);
      expect(r.relatedResources).toEqual(rec.relatedResources ?? []);
      for (const a of r.downloadAssets as { market: string; route: string; sha256: string | null }[]) {
        expect(a.route, `${rec.id} ${a.market}`).toBe(rec.marketFiles[a.market].fileUrl);
        expect(fs.existsSync(path.join(root, "private-assets", a.route.replace(/^\//, ""))), `${rec.id} ${a.market} file`).toBe(true);
      }
    }
  });
  it("records the Stage 10.19A rulings: status stays the build gate, publicationStatus approved, releaseChannel private-preview, future badge Preview", () => {
    expect(idx.controlledValues.publicationStatus).toEqual(["draft", "review", "approved", "live", "withdrawn", "superseded", "internal"]);
    expect(idx.controlledValues.releaseChannel).toEqual(["private-preview", "members"]);
    expect(idx.controlledValues.status).toEqual(["draft", "published", "archived"]);
    for (const r of idx.resources) {
      expect([r.status, r.publicationStatus, r.releaseChannel, r.migrationState]).toEqual(["draft", "approved", "private-preview", r.stableResourceId === "res-1030" ? "STAGED" : "LIVE"]);
      expect(r.visibleBadge).toBe(r.stableResourceId === "res-1030" ? null : "Preview"); // deployed for the 33 live resources (Stage 10.19C, 10.18D, 10.21D and 10.22D); res-1030 is staged
      expect(r.visibleBadgeInCurrentBuild).toBe("Preview");
      expect(r.futureBadgeTooltip).toBe("Approved resource in the protected OffGrid056 preview.");
      expect(r.futureBadgeTooltip).not.toMatch(/not yet approved|production|paid access|entitle/i);
    }
    expect(idx.resources.find((r) => r.stableResourceId === "res-1019")!.notes.join(" ")).toMatch(/MODEL \/ BADGE SEMANTICS ISSUE/);
  });
  it("records missing owner, version, review and source data explicitly and never fabricates it", () => {
    for (const r of idx.resources) {
      for (const f of ["owner", "version", "versionDate", "lastReviewedDate", "sourceLink"]) expect(r[f], `${r.stableResourceId} ${f}`).toBe("UNKNOWN_EXISTING_RECORD");
      if (r.stableResourceId === "res-1030") expect(r.firstPublishedToPreview).toBeNull(); else expect(r.firstPublishedToPreview).toMatch(/^2026-\d\d-\d\d$/);
      expect(r.reviewStatus).toEqual(expect.arrayContaining(["NEEDS_METADATA", "NEEDS_ENTITLEMENT_DECISION"]));
    }
  });
  it("records the rulings on res-1002, res-1025 and res-1027 / res-1510 as exceptions or tasks, without any record change", () => {
    const by = (id: string) => idx.resources.find((r) => r.stableResourceId === id)!;
    expect(by("res-1002").knownExceptions).toEqual(["KNOWN_LEGACY_NAMING_EXCEPTION"]);
    expect(by("res-1002").downloadAssets[0].route).toBe("/resources/household-risk-identifier.pdf");
    expect(by("res-1025").futureTasks).toEqual(["FT-1025-WORDING-REVIEW"]);
    expect(by("res-1027").knownExceptions).toEqual(["INTENTIONAL_NEAR_DUPLICATE_TITLE"]);
    expect(by("res-1510").knownExceptions).toEqual(["INTENTIONAL_NEAR_DUPLICATE_TITLE"]);
    expect(by("res-1027").title).toBe("90-Day Implementation Roadmap");
    expect(by("res-1510").title).toBe("90-Day Implementation Roadmap (Advanced)");
  });
  it("locks the Library and OS governance rules and defers repository hygiene to a separate stage", () => {
    const g = (idx as unknown as { governance: string[]; rulings: { publicRepositoryHygiene: string } });
    for (const x of ["does not share OS cookies", "does not share OS session tokens", "does not share OS localStorage", "does not share OS household state", "does not depend on OS authentication records", "must not write Library saved, progress or member state", "Entitlement remains a separate future contract", "stable resource ID", "must not guess Library URLs", "must not proxy protected Library content", "Authentication is not entitlement", "remains inactive until that contract is approved"]) expect(g.governance.join(" "), x).toContain(x);
    expect(g.rulings.publicRepositoryHygiene).toMatch(/separate security\/hygiene stage/);
    expect(g.rulings.publicRepositoryHygiene).toMatch(/does not establish that the repository is clean/);
  });  it("is not read by the application or the build", () => {
    for (const dir of ["app", "lib", "components", "tools"]) {
      const walk = (d: string): string[] => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
      for (const f of walk(dir)) if (/\.(ts|tsx|mjs|mts|js)$/.test(f)) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("canonical-resource-index");
    }
  });
});
