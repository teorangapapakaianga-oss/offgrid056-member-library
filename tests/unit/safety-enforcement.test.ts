import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareResource, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";

/**
 * Stage 9.58 — the legacy source is evidence; the migrated member-facing output is the enforcement target.
 *
 * Until this stage a resource could be held for a safety block because of a sentence migration had already
 * removed: the member-facing file said nothing about the topic, and nothing in the pipeline noticed. The risk of
 * fixing that is the opposite failure — safety teaching quietly disappearing — so the two rules run together:
 * enforcement reads the output, and a topic that leaves must be accounted for or preparation fails.
 */
const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];

/** A fixture that teaches nothing on its own, so each test controls exactly one topic. */
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
      foundation: { value: "shelter", confidence: "MEDIUM", evidence: [] },
      resourceType: { value: "planner", confidence: "MEDIUM", evidence: [] },
      legacyIssues: [],
      legacyTerminology: [],
      safetyNotes: [],
    } as unknown as PrepInputs["item"],
    sourceHtml: doc("<p>Work through the questions below.</p>"),
    blocks,
    markets,
    launchMarkets: ["NZ", "AU"],
    outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-enforce-")),
    ...extra,
  });
}

const GAS_TEACHING_BODY =
  "<p>Have your gas heater serviced by a licensed gasfitter. Never use a gas heater overnight. Keep the gas heater clear of curtains.</p>";
const GAS_NARRATIVE_BODY =
  "<p>Plan your solid fuel system for when the power goes out and the gas stops flowing. When the grid fails in winter, electric heaters stop. Gas supplies can be disrupted.</p>";
const OGB09_TABLE_BODY =
  "<table><tr><td>Flued gas</td><td>$1,500-$4,000</td><td>80-90%</td><td>No (gas supply)</td></tr>" +
  "<tr><td>Flued gas</td><td>$1,500-$4,000</td><td>80-90%</td><td>No (gas supply)</td></tr></table>";

describe("Stage 9.58 · enforcement reads the migrated output", () => {
  it("1. legacy taught gas, migration removed it, removal recorded → no gas block required", () => {
    const r = prep({
      sourceSafetyTopics: ["gas-and-lpg"],
      safetyTopicDispositions: {
        "gas-and-lpg": { disposition: "REMOVED", reason: "the appliance comparison was cut in migration", approvedBy: "owner", approvedOn: "2026-10-05" },
      },
    });
    expect(r.safety.outputTopics).not.toContain("gas-and-lpg");
    expect(r.safety.missingRequired).toEqual([]);
    expect(r.safety.removedTopics.every((t) => t.accounted)).toBe(true);
    expect(r.safety.removedTopics[0].disposition).toBe("REMOVED");
    expect(r.markets.every((m) => m.publishable)).toBe(true);
  });

  it("2. legacy taught gas, migration removed it, NOTHING recorded → preparation fails", () => {
    const r = prep({ sourceSafetyTopics: ["gas-and-lpg"] });
    expect(r.safety.removedTopics.some((t) => !t.accounted)).toBe(true);
    expect(r.safety.missingRequired).toContain("gas-and-lpg");
    for (const m of r.markets) {
      expect(m.publishable).toBe(false);
      expect(m.problems.join(" ")).toContain("SAFETY_TOPIC_REMOVED_WITHOUT_RECORD");
    }
    expect(r.importReadiness).not.toBe("READY_AFTER_FINAL_VALIDATION");
  });

  it("2b. a disposition cannot be used to hide teaching that is still there", () => {
    // The record only accounts for a topic the output no longer teaches. If it still teaches it, the block is
    // required regardless of what anyone wrote down.
    const r = prep({
      sourceHtml: doc(GAS_TEACHING_BODY),
      sourceSafetyTopics: ["gas-and-lpg"],
      safetyTopicDispositions: { "gas-and-lpg": { disposition: "REMOVED", reason: "claimed, but untrue" } },
    });
    expect(r.safety.outputTopics).toContain("gas-and-lpg");
    expect(r.safety.missingRequired).toContain("gas-and-lpg");
    expect(r.markets.every((m) => !m.publishable)).toBe(true);
  });

  it("3. the migrated output still teaches gas → gas block required", () => {
    const r = prep({ sourceHtml: doc(GAS_TEACHING_BODY), sourceSafetyTopics: ["gas-and-lpg"] });
    expect(r.safety.outputTopics).toContain("gas-and-lpg");
    expect(r.safety.missingRequired).toContain("gas-and-lpg");
    expect(r.markets.every((m) => !m.publishable)).toBe(true);
  });

  it("4. the output introduces teaching the legacy source never had → block still required", () => {
    // The old architecture could not see this at all: the audit had nothing to report, so nothing was required.
    const r = prep({ sourceHtml: doc(GAS_TEACHING_BODY), sourceSafetyTopics: [] });
    expect(r.safety.sourceTopics).toEqual([]);
    expect(r.safety.outputTopics).toContain("gas-and-lpg");
    expect(r.safety.missingRequired).toContain("gas-and-lpg");
  });

  it("5. a narrative gas-supply reference requires nothing", () => {
    const r = prep({ sourceHtml: doc(GAS_NARRATIVE_BODY), sourceSafetyTopics: [] });
    expect(r.safety.outputTopics).not.toContain("gas-and-lpg");
    expect(r.safety.missingRequired).toEqual([]);
  });

  it("6. table-shaped gas teaching in the output requires the block", () => {
    const r = prep({ sourceHtml: doc(OGB09_TABLE_BODY), sourceSafetyTopics: [] });
    expect(r.safety.outputTopics).toContain("gas-and-lpg");
    expect(r.safety.missingRequired).toContain("gas-and-lpg");
  });

  it("7. OG-17's two narrative sentences require no gas block, even declared as a source topic", () => {
    const r = prep({ sourceHtml: doc(GAS_NARRATIVE_BODY), sourceSafetyTopics: ["gas-and-lpg"] });
    // The topic left the member-facing text, so it needs accounting — but it is not required.
    expect(r.safety.outputTopics).not.toContain("gas-and-lpg");
    expect(r.safety.removedTopics.map((t) => t.topic)).toContain("gas-and-lpg");
  });
});

describe("Stage 9.58 · the two automatic dispositions", () => {
  it("a topic whose block is still carried needs no written record", () => {
    const r = prep({
      sourceHtml: doc("<p>Keep a torch handy.</p>"),
      sourceSafetyTopics: ["carbon-monoxide"],
      extraSafetyBlocks: ["carbon-monoxide"],
    });
    const record = r.safety.removedTopics.find((t) => t.topic === "carbon-monoxide")!;
    expect(record.accounted).toBe(true);
    expect(record.disposition).toBe("REPLACED_BY_BLOCK");
    expect(r.safety.missingRequired).toEqual([]);
  });

  it("a topic covered by an owner-approved exemption needs no written record, and keeps the owner's reason", () => {
    const r = prep({
      sourceHtml: doc("<p>Keep a torch handy.</p>"),
      sourceSafetyTopics: ["food-safety-power-cut"],
      safetyExemptions: [
        { block: "food-safety-power-cut", reason: "appliance reference only", approvedBy: "owner", approvedOn: "2026-09-22", allowedMentions: [] },
      ],
    });
    const record = r.safety.removedTopics.find((t) => t.topic === "food-safety-power-cut")!;
    expect(record.accounted).toBe(true);
    expect(record.disposition).toBe("OWNER_APPROVED_REMOVAL");
    expect(record.reason).toBe("appliance reference only");
    expect(record.approvedBy).toBe("owner");
    expect(r.safety.missingRequired).toEqual([]);
  });
});

describe("Stage 9.58 · the live library", () => {
  it("8. every deployed resource keeps its block requirements, and every removal is accounted for", () => {
    const report = path.join(process.cwd(), "workspace/prep/prep-report.json");
    if (!fs.existsSync(report)) return; // prep output is a working artefact, not committed
    const results = JSON.parse(fs.readFileSync(report, "utf8")) as {
      legacyCode: string;
      safety: {
        blocks: string[];
        sourceTopics: string[];
        outputTopics: string[];
        removedTopics: { topic: string; accounted: boolean; disposition?: string }[];
        missingRequired: string[];
      };
      markets: { code: string; publishable: boolean }[];
    }[];
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.safety.missingRequired, r.legacyCode).toEqual([]);
      expect(r.markets.every((m) => m.publishable), r.legacyCode).toBe(true);
      for (const t of r.safety.removedTopics) {
        expect(t.accounted, `${r.legacyCode}: ${t.topic} left the member-facing text unaccounted for`).toBe(true);
      }
      // Nothing the output teaches may be missing its block — the fail-closed half of the ruling.
      for (const topic of r.safety.outputTopics) {
        const answered = r.safety.blocks.includes(topic) || r.safety.blocks.some((b) => (blocks[b]?.answers ?? []).includes(topic));
        expect(answered, `${r.legacyCode}: output teaches ${topic}`).toBe(true);
      }
    }
  });
});
