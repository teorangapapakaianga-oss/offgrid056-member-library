import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import { visibleText } from "@/admin-import/pilot/prep";

/**
 * Stage 9.56 — Australia has no national household gas rule, and the library must not pretend otherwise.
 *
 * Research at Stages 9.55 and 9.56 read all eight Australian jurisdictions live. Three publish a gas servicing
 * interval and the three differ (NSW: annually, and only for gas water heaters; Victoria: every two years; WA: every
 * two years, or annually over ten years old). Five publish none at all. The jurisdictions also give at least four
 * different instructions about electrical switches during a gas leak.
 *
 * Until a jurisdiction-aware architecture exists, the rule these tests enforce is simple: **no Australian gas
 * figure without the state it came from, and no Australian gas interval at all.** New Zealand's own figures are
 * unaffected — they are national there, and verified.
 */
const root = process.cwd();
const blocks = topicBlocks.blocks as Record<string, { marketBody?: Record<string, string> }>;
const bodyOf = (id: string, market: "NZ" | "AU") => blocks[id].marketBody?.[market] ?? "";

/** A duration attached to servicing, checking or inspecting — the shape of a servicing interval. */
const SERVICING_INTERVAL =
  /\b(?:servic\w+|check\w*|inspect\w*|maintain\w*)\b[^.]{0,80}\b(?:every|at least)\s+(?:\d+|one|two|three|six|ten|twelve)[\s-]*(?:year|month|week)/i;

describe("Stage 9.56 · no nationalised Australian gas interval", () => {
  it("1. states no gas servicing interval in any AU block body", () => {
    for (const [id, block] of Object.entries(blocks)) {
      const au = block.marketBody?.AU;
      if (!au || !/\b(gas|LPG)\b/i.test(au)) continue;
      expect(au, `${id} (AU)`).not.toMatch(/at least every two years/i);
      expect(au, `${id} (AU): a gas servicing interval needs a jurisdiction, and Australia has no national one`).not.toMatch(SERVICING_INTERVAL);
    }
  });

  it("2. tells an Australian member that the interval depends on where they live", () => {
    expect(bodyOf("carbon-monoxide", "AU")).toMatch(/servicing intervals differ between states and territories/);
    expect(bodyOf("carbon-monoxide", "AU")).toMatch(/licensed gasfitter/);
    expect(bodyOf("indoor-combustion", "AU")).toMatch(/your state or territory's energy safety regulator/);
  });

  it("3. leaves New Zealand's own verified intervals alone", () => {
    // NZ is a single national jurisdiction and Health NZ publishes this figure, so it stays.
    expect(bodyOf("indoor-combustion", "NZ")).toMatch(/serviced by a qualified person at least once a year/);
    // And NZ must not acquire Australian wording in the process.
    for (const id of ["carbon-monoxide", "indoor-combustion"]) {
      expect(bodyOf(id, "NZ"), `${id} (NZ)`).not.toMatch(/state or territory|NSW|Queensland|Victoria/);
    }
  });

  it("4. keeps every prepared AU file free of a gas interval figure", () => {
    const dir = path.join(root, "workspace/prep");
    if (!fs.existsSync(dir)) return; // prep output is a working artefact, not committed
    for (const code of fs.readdirSync(dir)) {
      const folder = path.join(dir, code);
      if (!fs.statSync(folder).isDirectory()) continue;
      for (const file of fs.readdirSync(folder).filter((f) => f.endsWith(".AU.html"))) {
        const text = visibleText(fs.readFileSync(path.join(folder, file), "utf8"));
        expect(text, `${code}/${file}`).not.toMatch(/at least every two years/i);
        for (const sentence of text.split(/(?<=\.)\s+/).filter((s) => /\b(gas|LPG|gasfitter)\b/i.test(s))) {
          expect(sentence, `${code}/${file}: gas interval`).not.toMatch(
            /\b(?:every|at least)\s+(?:\d+|one|two|three|six|ten|twelve)[\s-]*(?:year|month|week)/i,
          );
        }
      }
    }
  });

  it("5. records why the figure went, so it cannot quietly come back", () => {
    for (const id of ["carbon-monoxide", "indoor-combustion"]) {
      const block = topicBlocks.blocks[id as keyof typeof topicBlocks.blocks] as { changeRule?: string; verification?: Record<string, string> };
      expect(block.changeRule, `${id}: changeRule`).toMatch(/without naming the state or territory it comes from/);
      expect(block.verification?.AU, `${id}: AU verification`).toMatch(/CORRECTED 2026-10-05/);
    }
  });
});
