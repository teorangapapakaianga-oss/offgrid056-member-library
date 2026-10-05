import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareResource, visibleText, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import numericRegistryFile from "@/admin-import/config/numeric-claims.json";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";
import { loadNumericRegistry, numericBlockingFindings } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";

/**
 * Stage 9.59 — OG-17's claims, and the one gate that does not catch them.
 *
 * Percentage is held out of numeric blocking by the Stage 9.50 activation, so a bare efficiency band would pass
 * that gate silently. The backstop is prep's own `figure-needs-source` content flag, which blocks readiness. These
 * tests prove the backstop rather than assuming it, and hold OG-17's removed claims out of the prepared files.
 */
const root = process.cwd();
const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];

const doc = (body: string) => `<!DOCTYPE html><html><head></head><body>
<div class="cover-page">
  <div class="cover-label">OffGrid056</div>
  <h1 class="cover-title">Heating Planner</h1>
  <p class="cover-subtitle">A worksheet for planning your heating.</p>
</div>
<div class="content"><h2>Plan</h2>${body}</div></body></html>`;

function prep(extra: Partial<PrepInputs> = {}) {
  return prepareResource({
    item: {
      legacyCode: "OG-99",
      proposedResourceId: "res-1099",
      title: "Heating Planner",
      foundation: { value: "shelter", confidence: "HIGH", evidence: [] },
      resourceType: { value: "planner", confidence: "HIGH", evidence: [] },
      legacyIssues: [],
      legacyTerminology: [],
      safetyNotes: [],
    } as unknown as PrepInputs["item"],
    sourceHtml: doc("<p>Work through the questions below.</p>"),
    blocks,
    markets,
    launchMarkets: ["NZ", "AU"],
    outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-og17-")),
    description: "A planner.",
    foundation: "shelter",
    resourceType: "planner",
    category: "heating",
    difficulty: "intermediate",
    estimatedTime: 25,
    proposedBlockIds: [],
    ...extra,
  });
}

describe("Stage 9.59 · the percentage backstop", () => {
  it("1. percentage is still excluded from numeric blocking — the gate does NOT catch it", () => {
    expect(numericRegistryFile.blockingExcludes).toContain("percentage");
    const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
    const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
    const findings = numericBlockingFindings(
      '<div class="content"><p>A modern wood burner runs at 65-85% efficiency.</p></div>',
      { resource: "OG-17", market: "NZ", registry, treatment },
    );
    expect(findings, "the numeric gate is silent on percentages, by the Stage 9.50 activation").toEqual([]);
  });

  it("2. but an unsupported % figure still fails readiness, through the content-flag system", () => {
    const r = prep({ sourceHtml: doc("<p>A modern wood burner runs at 65-85% efficiency.</p>") });
    const flags = r.contentFlags.filter((f) => f.kind === "figure-needs-source");
    expect(flags.length, "figure-needs-source must fire on a bare percentage").toBeGreaterThan(0);
    expect(flags.some((f) => f.text.includes("65-85%"))).toBe(true);
    expect(r.importReadiness, "a content flag blocks readiness").toBe("NEEDS_CONTENT_REVIEW");
  });

  it("3. and the same document without the percentage is ready", () => {
    const r = prep({ sourceHtml: doc("<p>A modern wood burner is more efficient than an open fire.</p>") });
    expect(r.contentFlags).toEqual([]);
    expect(r.importReadiness).toBe("READY_AFTER_FINAL_VALIDATION");
  });

  it("4. a PRICE has no gate at all — neither numeric blocking nor the content flag catches it", () => {
    // Stated plainly because it is easy to assume otherwise. `currency` is excluded from numeric blocking by the
    // Stage 9.50 activation, and the figure-needs-source flag matches only % and °C — not "$". A price is removed
    // by an approved copy change and proved absent by inspection (test 5), not by a gate.
    const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
    const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
    expect(numericRegistryFile.blockingExcludes).toContain("currency");
    expect(
      numericBlockingFindings('<div class="content"><p>A modern wood burner costs $2,000-$5,000 installed.</p></div>', {
        resource: "OG-17",
        market: "NZ",
        registry,
        treatment,
      }),
    ).toEqual([]);
    const r = prep({ sourceHtml: doc("<p>A modern wood burner costs $2,000-$5,000 installed.</p>") });
    expect(r.contentFlags.filter((f) => f.kind === "figure-needs-source")).toEqual([]);
    expect(r.importReadiness, "nothing stops it — this is why price removal is verified by assertion").toBe(
      "READY_AFTER_FINAL_VALIDATION",
    );
  });
});

describe("Stage 9.59 · OG-17's removed claims stay removed", () => {
  const dir = path.join(root, "workspace/prep/OG-17");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".html")) : [];

  it("5. neither prepared market file carries a price, a percentage or a removed claim", () => {
    if (!files.length) return; // prep output is a working artefact, not committed
    for (const file of files) {
      const html = fs.readFileSync(path.join(dir, file), "utf8");
      // The resource's OWN text: the injected blocks legitimately carry their own sourced figures, including the
      // AU alarm block's "every 12 months" battery interval. These assertions are about OG-17's claims.
      const text = visibleText(html.replace(/<div class="og-safety[\s\S]*?<\/div>\s*<\/div>/gi, " "));
      expect(text, `${file}: prices`).not.toMatch(/\$\s?\d/);
      expect(text, `${file}: percentages`).not.toMatch(/\d\s?%/);
      for (const gone of [
        "Replace unit if over 5 years old",
        "kills more people than grid failures",
        "Every installation needs a building consent",
        "within 3 metres of the burner",
        "within 1 metre",
        "every 12 months",
        "6–8 cubic metres",
        "3-Metre Rule",
        "prices are lowest",
        "ultimate resilience heating",
        "Day 17",
        "OG-17",
        "30-Day Programme",
        "Week 3",
      ]) {
        expect(text, `${file}: ${gone}`).not.toContain(gone);
      }
    }
  });

  it("6. no universal consent rule survives, and the member is sent to their local authority", () => {
    if (!files.length) return;
    for (const file of files) {
      const text = visibleText(fs.readFileSync(path.join(dir, file), "utf8"));
      expect(text, `${file}`).not.toMatch(/needs a building consent|consent is required|no consent needed/i);
      expect(text, `${file}: routing`).toMatch(/local authority/);
    }
  });

  it("7. gas is not reintroduced: the resource's own text names no gas appliance or fuel", () => {
    if (!files.length) return;
    for (const file of files) {
      const html = fs.readFileSync(path.join(dir, file), "utf8");
      // Strip the injected safety blocks — the approved CO block legitimately names gas appliances.
      const own = visibleText(html.replace(/<div class="og-safety[\s\S]*?<\/div>\s*<\/div>/gi, " "));
      expect(own, `${file}`).not.toMatch(/\b(LPG|propane|butane|gas heater|gas supply|gas stops flowing)\b/i);
    }
  });

  it("8b. carries no currency in any form, in either market", () => {
    // Stage 9.60. Written as the shapes a price actually takes, because nothing in the pipeline gates on them:
    // currency is excluded from numeric blocking and the figure-needs-source flag matches only % and °C.
    if (!files.length) return;
    for (const file of files) {
      const text = visibleText(fs.readFileSync(path.join(dir, file), "utf8"));
      expect(text, `${file}: $`).not.toMatch(/\$/);
      expect(text, `${file}: currency codes`).not.toMatch(/\b(NZD|AUD|USD|CAD)\b/);
      expect(text, `${file}: dollars in words`).not.toMatch(/\b\d[\d,]*\s?dollars\b/i);
      // The dollar sign is required: "from 1 January 2027" is Queensland's alarm deadline, not a price.
      expect(text, `${file}: from $…`).not.toMatch(/\bfrom\s+\$\s?\d/i);
    }
  });

  it("8c. records the owner-approved metadata, with every inferred field marked", () => {
    const meta = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as {
      resources: Record<string, Record<string, string | number>>;
    };
    const og17 = meta.resources["OG-17"];
    expect(og17.foundation).toBe("shelter");
    expect(og17.category).toBe("heating");
    expect(og17.difficulty).toBe("intermediate");
    expect(og17.estimatedTime).toBe(25);
    expect(og17.recordStatus).toBe("draft");
    for (const field of ["foundationBasis", "categoryBasis", "difficultyBasis", "timeBasis"]) {
      expect(og17[field], field).toBe("OWNER-APPROVED / INFERRED");
    }
    // The category must be one the taxonomy already held — no slug was added for this resource.
    const taxonomy = JSON.parse(fs.readFileSync(path.join(root, "data/taxonomy/foundations.json"), "utf8")) as {
      foundations: { id: string; categories: { slug: string }[] }[];
    };
    const shelter = taxonomy.foundations.find((f) => f.id === "shelter")!;
    expect(shelter.categories.map((cat) => cat.slug)).toContain("heating");
  });

  it("8. solid fuel and fire safety are not weakened by the gas classification", () => {
    const report = path.join(root, "workspace/prep/prep-report.json");
    if (!fs.existsSync(report)) return;
    const r = (JSON.parse(fs.readFileSync(report, "utf8")) as {
      legacyCode: string;
      safety: { blocks: string[]; sourceTopics: string[]; outputTopics: string[]; missingRequired: string[]; removedTopics: { accounted: boolean }[] };
    }[]).find((x) => x.legacyCode === "OG-17");
    if (!r) return;
    expect(r.safety.outputTopics, "the migrated text still teaches solid fuel").toContain("solid-fuel-heating");
    expect(r.safety.outputTopics, "and still teaches fire safety").toContain("fire-and-emergency");
    expect(r.safety.outputTopics, "but not gas").not.toContain("gas-and-lpg");
    expect(r.safety.blocks).toContain("solid-fuel-heating");
    expect(r.safety.blocks).toContain("fire-and-smoke-alarms");
    expect(r.safety.blocks, "carried deliberately for the CO alarm step").toContain("carbon-monoxide");
    expect(r.safety.missingRequired).toEqual([]);
    expect(r.safety.removedTopics.every((t) => t.accounted)).toBe(true);
  });
});
