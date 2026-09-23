import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  blockingFindings,
  loadNumericRegistry,
  numericBlockingFindings,
  scanNumericClaims,
  type NumericCandidate,
  type NumericRegistry,
} from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.48 — numeric claim discovery, in REPORT-ONLY mode.
 *
 * The rules being proved are the ones that stop a registry becoming a rubber stamp: treatment keeps its own claims,
 * a market's figure does not travel, a state's figure does not become national, a resource's figure does not
 * legitimise the same number somewhere else, and the same number in a different context is a different claim.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const empty = { claims: [] };

const scan = (text: string, market: string, resource: string, reg = registry): NumericCandidate[] =>
  scanNumericClaims(`<div class="content"><p>${text}</p></div>`, { resource, market, registry: reg, treatment });
const bucketOf = (text: string, market: string, resource: string, reg = registry) => scan(text, market, resource, reg).map((c) => c.bucket);

describe("treatment keeps its own claims", () => {
  it("defers a bleach ratio to the treatment registry rather than judging it here", () => {
    const found = scan("Add 5 drops of plain, unperfumed household bleach to 1 litre of water and stand for 30 minutes.", "NZ", "OG-09");
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((c) => c.bucket === "E_TREATMENT_OWNED")).toBe(true);
    expect(found[0].claimId).toBe("nz-bleach-treatment-dose");
  });

  it("defers an unregistered treatment figure too, instead of offering a second opinion", () => {
    const found = scan("Boil the water for seven minutes before drinking.", "NZ", "OG-09");
    expect(found.map((c) => c.bucket)).toContain("E_TREATMENT_OWNED");
    expect(found.find((c) => c.bucket === "E_TREATMENT_OWNED")?.claimId).toBe("treatment-context");
  });

  it("holds no duplicate of a treatment figure in the numeric registry", () => {
    const treatmentIds = new Set(treatment.claims.map((c) => c.id));
    for (const claim of registry.claims) {
      expect(treatmentIds.has(claim.id), claim.id).toBe(false);
      expect(claim.category, claim.id).not.toBe("treatment");
    }
  });
});

describe("a figure does not travel", () => {
  it("does not let New Zealand's storage baseline explain the same words in an Australian file", () => {
    expect(bucketOf("Store at least 3 litres of drinking water per person per day.", "NZ", "OG-08")).toContain("A_ALREADY_SOURCED");
    expect(bucketOf("Store at least 3 litres of drinking water per person per day.", "AU", "OG-08")).toContain("C_NEEDS_SOURCE");
  });

  it("keeps a state figure state-labelled: NSW's 1 mm screen fails without its attribution", () => {
    const withLabel = "Fit fine insect-proof screens on all inlets — NSW Health gives 1 mm as an example.";
    const without = "Fit fine insect-proof screens on all inlets, about 1 mm.";
    expect(bucketOf(withLabel, "AU", "OG-B08")).toContain("A_ALREADY_SOURCED");
    expect(bucketOf(without, "AU", "OG-B08")).toContain("C_NEEDS_SOURCE");
    // And it is not a New Zealand figure at all.
    expect(bucketOf(withLabel, "NZ", "OG-B08")).toContain("C_NEEDS_SOURCE");
  });

  it("keeps an approved figure to the resource it was approved for", () => {
    const sentence = "NZ published planning guidance (Building Performance, MBIE) — examples: a tank of 500 litres plus, or at least 30,000 litres as a sole supply.";
    expect(bucketOf(sentence, "NZ", "OG-10")).toContain("A_ALREADY_SOURCED");
    expect(bucketOf(sentence, "NZ", "OG-B08")).toContain("C_NEEDS_SOURCE");
  });
});

describe("context decides, not the number", () => {
  it("does not let the screen's 1 mm approve a structural clearance of 1 mm", () => {
    expect(bucketOf("Leave a 1 mm clearance between the tank and the retaining wall. NSW Health.", "AU", "OG-B08")).toContain("C_NEEDS_SOURCE");
  });

  it("does not let a tank stand's 30cm approve 30cm of anything else", () => {
    expect(bucketOf("MBIE says the stand must be over 30cm and under one metre.", "NZ", "OG-B08")).toContain("A_ALREADY_SOURCED");
    expect(bucketOf("Keep 30cm of clear space behind the pump.", "NZ", "OG-B08")).toContain("C_NEEDS_SOURCE");
  });
});

describe("formulas, blanks and furniture", () => {
  it("reads the fixed value inside a formula as a claim, and the variables as structure", () => {
    expect(bucketOf("People × 3 L × 3 days", "NZ", "OG-08")).toContain("A_ALREADY_SOURCED");
    expect(scan("Gap = Need − Have", "NZ", "OG-08")).toEqual([]);
  });

  it("does not treat a member's planning horizon as an asserted figure", () => {
    for (const text of ["14-Day Supply", "Target to close first (3-day / 7-day / 14-day / 30-day)", "48-hour off-grid test using only permanent systems.", "Weekly check-in day (when will you share progress?)"]) {
      expect(bucketOf(text, "NZ", "OG-27"), text).not.toContain("C_NEEDS_SOURCE");
    }
  });

  it("ignores dates, emergency numbers, resource codes and standards", () => {
    for (const text of [
      "In an emergency, call 111 now.",
      "Reviewed 15 January 2026 by the owner.",
      "See OG-10 for the collection figures.",
      "Look for certification to AS/NZS 4348 or ANSI/NSF 53.",
    ]) {
      expect(bucketOf(text, "NZ", "OG-02"), text).not.toContain("C_NEEDS_SOURCE");
    }
  });
});

/**
 * Stage 9.49 — the one Bucket C finding, resolved. Three days is Get Ready Queensland's figure, and the wording now
 * says so; an unattributed or nationalised version of the same sentence must still fail.
 */
describe("OG-08's Australian three-day figure", () => {
  const attributed = "Get Ready Queensland advises storing drinking water for three days. Check your own state or territory emergency service for the advice that applies where you live.";

  it("passes when it is attributed to Queensland", () => {
    expect(bucketOf(attributed, "AU", "OG-08")).toContain("A_ALREADY_SOURCED");
    expect(blockingFindings(scan(attributed, "AU", "OG-08"))).toEqual([]);
  });

  it("fails when the same figure is presented as national Australian guidance", () => {
    for (const national of [
      "The Australian official baseline is drinking water for three days.",
      "The national baseline is drinking water for three days.",
      "Australia's baseline is drinking water for three days.",
    ]) {
      expect(bucketOf(national, "AU", "OG-08"), national).toContain("C_NEEDS_SOURCE");
    }
  });

  it("fails without the Queensland attribution — the exact sentence Stage 9.48 found", () => {
    const before = "The official baseline is drinking water for three days; your state or territory emergency service may advise more for your area.";
    expect(bucketOf(before, "AU", "OG-08")).toContain("C_NEEDS_SOURCE");
  });

  it("does not validate New Zealand, even attributed", () => {
    expect(bucketOf(attributed, "NZ", "OG-08")).toContain("C_NEEDS_SOURCE");
  });

  it("does not carry over to another Australian resource on its own", () => {
    expect(bucketOf(attributed, "AU", "OG-10")).toContain("C_NEEDS_SOURCE");
    // OG-11's three days is food, and has its own Queensland entry.
    const food = "Official emergency advice varies by state — from food for at least three days (Get Ready Queensland) to supplies for up to 14 days (NSW Food Authority).";
    expect(bucketOf(food, "AU", "OG-11")).toContain("A_ALREADY_SOURCED");
    expect(bucketOf(food, "AU", "OG-08")).toContain("C_NEEDS_SOURCE");
  });

  it("is what the live OG-08 copy actually says", () => {
    const changes = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as {
      changes: Record<string, { where: string; to: string; markets?: string[] }[]>;
    }).changes["OG-08"];
    const au = changes.find((c) => c.where === "Step 1 — needs table (AU)")!;
    expect(au.markets).toEqual(["AU"]);
    expect(au.to).toContain("Get Ready Queensland advises storing drinking water for three days.");
    expect(au.to).not.toContain("The official baseline is drinking water for three days");
    expect(au.to).not.toMatch(/Australian official baseline|national baseline|Australia's baseline/);
    // The NZ change is untouched: its figure is Get Ready's, not Queensland's.
    const nz = changes.find((c) => c.where === "Step 1 — needs table (NZ)")!;
    expect(nz.to).toContain("People × 3 L × 3 days");
    expect(nz.to).not.toMatch(/Queensland/);
  });
});

describe("blocking mode (Stage 9.50)", () => {
  const blocking: NumericRegistry = { ...registry, mode: "blocking", blockingExcludes: registry.blockingExcludes ?? [] };
  const findings = (text: string, market: string, resource: string, reg: NumericRegistry = blocking) =>
    numericBlockingFindings(`<div class="content"><p>${text}</p></div>`, { resource, market, registry: reg, treatment });

  it("is the active mode, and is wired into preparation", () => {
    const config = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/numeric-claims.json"), "utf8"));
    expect(config.mode).toBe("blocking");
    expect(config.blockingExcludes).toEqual(["percentage", "currency"]);
    const prep = fs.readFileSync(path.join(root, "admin-import/pilot/prep.ts"), "utf8");
    expect(prep).toContain("numericBlockingFindings");
  });

  it("passes a known sourced claim, and fails an unregistered one", () => {
    expect(findings("Store at least 3 litres of drinking water per person per day.", "NZ", "OG-08")).toEqual([]);
    const unregistered = findings("Keep the tank at least 4 metres from the boundary.", "NZ", "OG-B08");
    expect(unregistered.length).toBe(1);
    expect(unregistered[0]).toContain("UNSOURCED_NUMERIC_CLAIM (NZ)");
    expect(unregistered[0]).toContain("4 metres");
  });

  it("fails the wrong market, the wrong resource and a missing jurisdiction label", () => {
    expect(findings("Store at least 3 litres of drinking water per person per day.", "AU", "OG-08").length).toBe(1);
    expect(findings("NZ published planning guidance (Building Performance, MBIE) — at least 30,000 litres as a sole supply.", "NZ", "OG-B08").length).toBe(1);
    expect(findings("Fit fine insect-proof screens on all inlets, about 1 mm.", "AU", "OG-B08").length).toBe(1);
    expect(findings("Fit fine insect-proof screens on all inlets — NSW Health gives 1 mm as an example.", "AU", "OG-B08")).toEqual([]);
  });

  it("never blocks structure, member inputs or treatment figures", () => {
    // B: a standard's number. D: a planning horizon. E: a bleach ratio.
    expect(findings("Look for certification to AS/NZS 4348 or ANSI/NSF 53.", "AU", "OG-B08")).toEqual([]);
    expect(findings("Target to close first (3-day / 7-day / 14-day / 30-day)", "NZ", "OG-08")).toEqual([]);
    expect(findings("Add 5 drops of plain, unperfumed household bleach to 1 litre of water.", "NZ", "OG-09")).toEqual([]);
  });

  it("holds percentages and currency out of this first activation, while still detecting them", () => {
    const percent = "A collection efficiency of 90% is typical for this roof.";
    expect(findings(percent, "NZ", "OG-10")).toEqual([]);
    // Still found and classified — it simply does not block yet.
    expect(bucketOf(percent, "NZ", "OG-10")).toContain("C_NEEDS_SOURCE");
    expect(blockingFindings(scan(percent, "NZ", "OG-10")).length).toBe(1);
  });

  it("blocks everything factual when the registry is empty or missing", () => {
    const sourced = "Store at least 3 litres of drinking water per person per day.";
    expect(findings(sourced, "NZ", "OG-08", { claims: [], mode: "blocking" }).length).toBe(1);
    // A registry left in report-only cannot be used to slip a figure through prep unnoticed either: prep passes the
    // real config, and the real config is blocking.
    expect(findings(sourced, "NZ", "OG-08", { claims: [], mode: "report-only" })).toEqual([]);
  });

  it("leaves the whole live library green: every prepared file has zero blocking findings", () => {
    const prepDir = path.join(root, "workspace/prep");
    if (!fs.existsSync(prepDir)) return; // the prepared workspace is local and git-ignored
    const problems: string[] = [];
    for (const dir of fs.readdirSync(prepDir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
      for (const file of fs.readdirSync(path.join(prepDir, dir.name)).filter((f) => f.endsWith(".html"))) {
        const market = file.includes(".NZ.") ? "NZ" : "AU";
        const html = fs.readFileSync(path.join(prepDir, dir.name, file), "utf8");
        problems.push(...numericBlockingFindings(html, { resource: dir.name, market, registry: blocking, treatment }));
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("report-only behaviour, still available", () => {
  it("changes nothing when the registry says report-only", () => {
    const reportOnly = { ...registry, mode: "report-only" as const };
    expect(
      numericBlockingFindings('<div class="content"><p>Keep the tank at least 4 metres from the boundary.</p></div>', {
        resource: "OG-B08",
        market: "NZ",
        registry: reportOnly,
        treatment,
      }),
    ).toEqual([]);
  });

  it("approves nothing with an empty registry — which is what blocking mode enforces", () => {
    const sourced = "Store at least 3 litres of drinking water per person per day.";
    expect(bucketOf(sourced, "NZ", "OG-08", empty)).toContain("C_NEEDS_SOURCE");
    expect(blockingFindings(scan(sourced, "NZ", "OG-08", empty)).length).toBeGreaterThan(0);
    // With the seeded registry the same sentence is explained, and blocking mode would pass it.
    expect(blockingFindings(scan(sourced, "NZ", "OG-08"))).toEqual([]);
  });

  it("records a source, an authority, a date and limitations for every seeded claim", () => {
    expect(registry.claims.length).toBeGreaterThan(0);
    for (const claim of registry.claims) {
      expect(claim.market, claim.id).toMatch(/^(NZ|AU)$/);
      expect(claim.owningResources.length, claim.id).toBeGreaterThan(0);
      expect(claim.source.length, claim.id).toBeGreaterThan(0);
      expect(claim.authority.length, claim.id).toBeGreaterThan(0);
      expect(claim.sourceDate.length, claim.id).toBeGreaterThan(0);
      expect(claim.limitations.length, claim.id).toBeGreaterThan(0);
      expect(claim.status, claim.id).toMatch(/OWNER-APPROVED/);
    }
  });
});
