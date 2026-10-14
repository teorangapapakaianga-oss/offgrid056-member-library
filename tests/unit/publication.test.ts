import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PUBLICATION_STATUSES, RELEASE_CHANNELS } from "@/lib/content/constants";
import { PREVIEW_TOOLTIP, isApprovedPublication, publicationBadge } from "@/lib/content/publication";
import { ResourceSchema } from "@/lib/content/schemas";

/**
 * Stage 10.19B — publicationStatus + releaseChannel + the Preview badge.
 * status stays the technical build gate; the badge is computed from publicationStatus + releaseChannel only and fails closed.
 */
const root = process.cwd();
const base = {
  id: "res-9999", slug: "test-resource", title: "Test Resource", description: "A resource used only by the publication tests.", foundation: "general", category: "planning", resourceType: "worksheet",
  difficulty: "beginner", estimatedTime: 10, featured: false, premium: false, isPlaceholder: false, status: "draft", downloadable: false, publishedDate: "2026-10-13", completionAvailable: true,
};
const parse = (extra: Record<string, unknown>) => ResourceSchema.safeParse({ ...base, ...extra });

describe("A · schema", () => {
  it("accepts the approved values and keeps `status` as the build gate", () => {
    expect(PUBLICATION_STATUSES).toEqual(["draft", "review", "approved", "live", "withdrawn", "superseded", "internal"]);
    expect(RELEASE_CHANNELS).toEqual(["private-preview", "members"]);
    for (const p of PUBLICATION_STATUSES) for (const c of RELEASE_CHANNELS) expect(parse({ publicationStatus: p, releaseChannel: c }).success, `${p}/${c}`).toBe(true);
    expect(parse({ status: "published" }).success).toBe(true);
    expect(parse({ status: "approved" }).success).toBe(false); // the build gate does not take publication values
  });
  it("rejects unsupported values", () => {
    for (const bad of ["Approved", "public", "published", "preview", "", "approved ", 1, null]) expect(parse({ publicationStatus: bad, releaseChannel: "private-preview" }).success, String(bad)).toBe(false);
    for (const bad of ["Private-Preview", "public", "preview", "members ", "", 0, null]) expect(parse({ publicationStatus: "approved", releaseChannel: bad }).success, String(bad)).toBe(false);
  });
  it("declares the two fields together or not at all (demo placeholders carry neither)", () => {
    expect(parse({}).success).toBe(true);
    expect(parse({ publicationStatus: "approved" }).success).toBe(false);
    expect(parse({ releaseChannel: "private-preview" }).success).toBe(false);
  });
  it("does not repurpose premium, status or any entitlement field", () => {
    const ok = parse({ publicationStatus: "approved", releaseChannel: "private-preview", premium: false, status: "draft" });
    expect(ok.success).toBe(true);
    expect(parse({ accessTier: "free" }).success).toBe(false); // strict: no entitlement field exists on the record
    expect(parse({ entitlementRequirement: "member" }).success).toBe(false);
  });
});

describe("C · badge logic", () => {
  it("approved + private-preview shows Preview with the exact tooltip", () => {
    expect(publicationBadge({ publicationStatus: "approved", releaseChannel: "private-preview" })).toEqual({ label: "Preview", tooltip: "Approved resource in the protected OffGrid056 preview." });
    expect(PREVIEW_TOOLTIP).toBe("Approved resource in the protected OffGrid056 preview.");
    expect(PREVIEW_TOOLTIP).not.toMatch(/not yet approved for members/i);
  });
  it("fails closed: every other combination, and missing or garbage values, give no badge", () => {
    for (const p of PUBLICATION_STATUSES) for (const c of RELEASE_CHANNELS) {
      const approved = p === "approved" && c === "private-preview";
      expect(publicationBadge({ publicationStatus: p, releaseChannel: c }) !== null, `${p}/${c}`).toBe(approved);
      expect(isApprovedPublication({ publicationStatus: p, releaseChannel: c }), `${p}/${c}`).toBe(approved);
    }
    for (const r of [{}, { publicationStatus: "approved" }, { releaseChannel: "private-preview" }, { publicationStatus: "APPROVED", releaseChannel: "private-preview" }, { publicationStatus: "approved", releaseChannel: "public" }, { publicationStatus: undefined, releaseChannel: undefined }, { publicationStatus: 1, releaseChannel: {} }])
      expect(publicationBadge(r), JSON.stringify(r)).toBeNull();
  });
  it("never shows Draft or the old tooltip for any input", () => {
    for (const p of PUBLICATION_STATUSES) for (const c of RELEASE_CHANNELS) {
      const b = publicationBadge({ publicationStatus: p, releaseChannel: c });
      if (b) { expect(b.label).toBe("Preview"); expect(b.tooltip).not.toMatch(/draft|not yet approved/i); }
    }
  });
});

describe("E · no entitlement coupling", () => {
  it("ignores status, premium, authentication, programme and OS fields entirely", () => {
    const pair = { publicationStatus: "approved", releaseChannel: "private-preview" };
    const noise = [{ status: "draft" }, { status: "published" }, { status: "archived" }, { premium: true }, { premium: false }, { isLoggedIn: true }, { cloudflareAuthenticated: false }, { programmeMember: true }, { osHousehold: "x" }, { entitlementRequirement: "paid" }];
    for (const n of noise) expect(publicationBadge({ ...pair, ...n })).toEqual(publicationBadge(pair));
    for (const n of noise) expect(publicationBadge({ publicationStatus: "draft", releaseChannel: "private-preview", ...n })).toBeNull();
  });
  it("the logic source reads only publicationStatus and releaseChannel", () => {
    const src = fs.readFileSync(path.join(root, "lib/content/publication.ts"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(src).not.toMatch(/\.status\b|premium|cookie|session|localStorage|cloudflare|\bauth|entitle|supabase|railway|resilience-os|programme|household/i);
    expect(src).not.toMatch(/res-\d{4}/); // no resource-specific logic
  });
  it("the badge component and the detail page use the shared logic and never the build gate", () => {
    const comp = fs.readFileSync(path.join(root, "components/resources/badges.tsx"), "utf8");
    expect(comp).toContain("publicationBadge");
    expect(comp).not.toMatch(/DraftBadge|not yet approved for members/);
    const page = fs.readFileSync(path.join(root, "app/resources/[slug]/page.tsx"), "utf8");
    expect(page).toContain("<PublicationBadge");
    expect(page).not.toMatch(/status === "draft"|DraftBadge/);
    expect(page).not.toMatch(/res-1019|battery-backup/);
  });
  it("the resource card (listing) deliberately shows no publication badge", () => {
    const card = fs.readFileSync(path.join(root, "components/resources/resource-card.tsx"), "utf8");
    expect(card).not.toMatch(/PublicationBadge|publicationBadge|DraftBadge/);
  });
});

describe("B and D · the current protected records (when present)", () => {
  const dir = path.join(root, "private-assets/data-resources");
  const recs = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Record<string, unknown>) : [];
  it.skipIf(recs.length === 0)("all 34 protected records (33 live, res-1030 staged) are approved + private-preview, keep status draft and pass the schema and the shared badge logic", () => {
    expect(recs).toHaveLength(34); // 33 live + res-1030 staged (Stage 10.23C)
    for (const r of recs) {
      expect([r.status, r.publicationStatus, r.releaseChannel], String(r.id)).toEqual(["draft", "approved", "private-preview"]);
      expect(ResourceSchema.safeParse(r).success, String(r.id)).toBe(true);
      expect(publicationBadge(r)?.label, String(r.id)).toBe("Preview");
      expect(r.premium, String(r.id)).toBe(false);
    }
  });
  it.skipIf(recs.length === 0)("res-1019 Battery Backup Planner passes through the shared logic, with its route and classification unchanged", () => {
    const r = recs.find((x) => x.id === "res-1019")!;
    expect(r).toMatchObject({ slug: "battery-backup-planner", title: "Battery Backup Planner", foundation: "energy", programComponent: "off-grid-living", category: "backup-energy", resourceType: "planner", status: "draft", publicationStatus: "approved", releaseChannel: "private-preview" });
    expect(publicationBadge(r)).toEqual({ label: "Preview", tooltip: "Approved resource in the protected OffGrid056 preview." });
  });
});

describe("F · runtime scope", () => {
  it("the canonical index stays read-only governance data and no OS, Supabase or Railway reference is introduced into the runtime", () => {
    const walk = (d: string): string[] => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    for (const dir of ["app", "lib", "components"]) for (const f of walk(dir)) {
      if (!/\.(ts|tsx)$/.test(f)) continue;
      const s = fs.readFileSync(path.join(root, f), "utf8");
      expect(s, f).not.toContain("canonical-resource-index");
      expect(s, f).not.toMatch(/offgrid056-resilience-os|supabase|railway/i);
    }
  });
});
