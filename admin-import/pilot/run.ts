/**
 * Stage 9.6D — one resource, end to end.
 *
 *   audit → safety → terminology → re-skin → market variants → validation → draft import → private preview
 *
 * Everything lands in `workspace/pilot/`. The programme source is read only; the member library is not touched
 * (the import goes to a sandbox), and nothing is published.
 */
import fs from "node:fs";
import path from "node:path";
import { reskinHtml, summariseChanges } from "../reskin/reskin";
import { resolveForMarket, publishable, type CoreResource, type MarketProfile, type SafetyBlock } from "../markets/resolve";
import { ResourceSchema } from "@/lib/content/schemas";

export interface PilotInputs {
  /** the legacy HTML source (read only) */
  sourceHtml: string;
  sourcePath: string;
  resource: CoreResource;
  blocks: Record<string, SafetyBlock>;
  libraryRecord: Record<string, unknown>;
  markets: MarketProfile[];
  launchMarkets: string[];
}

export interface MarketOutput {
  market: string;
  html: string;
  safety: { id: string; title: string; body: string }[];
  unresolvedTokens: string[];
  publishable: boolean;
  problems: string[];
}

export interface PilotResult {
  legacyCode: string;
  changeLog: string[];
  reskinWarnings: string[];
  markets: MarketOutput[];
  /** field-by-field differences between the launch markets */
  differences: { field: string; values: Record<string, string> }[];
  validation: { ok: boolean; issues: string[] };
  record: Record<string, unknown> | null;
}

/**
 * Put the approved safety blocks into the document.
 *
 * The emergency block goes at the top of the content, where someone skimming in a hurry will see it. The
 * disclaimer goes at the end, where it belongs. Neither is merged into the teaching copy.
 */
export function injectSafety(html: string, blocks: { id: string; title: string; body: string; severity?: string }[]): string {
  const style = `
<style>
  .og-safety { border-radius: 10px; padding: 14px 18px; margin: 0 0 18px; font-size: 13px; line-height: 1.55; }
  .og-safety h3 { font-family: 'Bebas Neue', Impact, sans-serif; font-weight: 400; letter-spacing: .02em; font-size: 17px; margin: 0 0 6px; }
  .og-safety.critical { background: #F6DDD7; border: 1px solid #E0B3A8; color: #6D2416; }
  .og-safety.standard { background: #F1EFE6; border: 1px solid #D8D4C6; color: #242720; margin-top: 26px; }
  .og-safety strong { font-weight: 700; }
</style>`.trim();

  const block = (b: { id: string; title: string; body: string; severity?: string }) => {
    const cls = b.severity === "CRITICAL" ? "critical" : "standard";
    const body = b.body.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n+/g, "<br>");
    return `<div class="og-safety ${cls}" data-block="${b.id}"><h3>${b.title}</h3><p style="margin:0">${body}</p></div>`;
  };

  const critical = blocks.filter((b) => b.severity === "CRITICAL").map(block).join("\n");
  const standard = blocks.filter((b) => b.severity !== "CRITICAL").map(block).join("\n");

  let out = html.replace("</head>", `${style}\n</head>`);
  // Critical blocks go immediately inside the content, before the first teaching element.
  out = out.replace(/(<div class="content">)/, `$1\n${critical}`);
  // The disclaimer closes the document.
  out = out.replace(/(<\/div>\s*<\/body>)/, `\n${standard}\n$1`);
  return out;
}

export function runPilot(inputs: PilotInputs): PilotResult {
  // 1. re-skin (terminology happens inside: context-aware, framework phrase only)
  const { html: reskinned, changes, warnings } = reskinHtml(inputs.sourceHtml, { strapline: "Prepare • Adapt • Thrive" });

  // 2. market variants, each with its own resolved safety wording
  const markets: MarketOutput[] = [];
  for (const code of inputs.launchMarkets) {
    const profile = inputs.markets.find((m) => m.code === code);
    if (!profile) continue;
    const resolved = resolveForMarket(inputs.resource, profile, inputs.blocks);
    const gate = publishable(resolved, ["emergency-contact"]);
    const withSafety = injectSafety(
      reskinned,
      resolved.safety.map((s) => ({ id: s.id, title: s.title, body: s.body, severity: s.severity })),
    );
    markets.push({
      market: code,
      html: withSafety,
      safety: resolved.safety.map((s) => ({ id: s.id, title: s.title, body: s.body })),
      unresolvedTokens: resolved.unresolvedTokens,
      publishable: gate.ok,
      problems: gate.problems,
    });
  }

  // 3. what actually differs between the launch markets
  const differences = diffMarkets(inputs, inputs.launchMarkets);

  // 4. validate the library record the member site would receive
  const record = {
    ...inputs.libraryRecord,
    featured: false,
    premium: false,
    isPlaceholder: false,
    downloadable: true,
    fileUrl: `/resources/${inputs.libraryRecord.slug}.pdf`,
    fileFormat: "PDF",
    fileSizeBytes: 550000,
    publishedDate: new Date().toISOString().slice(0, 10),
    relatedResources: [],
    completionAvailable: true,
    status: "draft", // owner decision D9-7
  };
  const parsed = ResourceSchema.safeParse(record);

  return {
    legacyCode: inputs.resource.legacyCode,
    changeLog: summariseChanges(changes),
    reskinWarnings: warnings,
    markets,
    differences,
    validation: {
      ok: parsed.success,
      issues: parsed.success ? [] : parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
    },
    record: parsed.success ? record : null,
  };
}

/** Field-by-field: what a member in one launch market sees that a member in the other does not. */
function diffMarkets(inputs: PilotInputs, codes: string[]): PilotResult["differences"] {
  const profiles = codes.map((c) => inputs.markets.find((m) => m.code === c)).filter(Boolean) as MarketProfile[];
  if (profiles.length < 2) return [];

  const fields: { field: string; get: (m: MarketProfile) => string | undefined }[] = [
    { field: "emergency number", get: (m) => m.emergency.number },
    { field: "emergency alternatives", get: (m) => m.emergency.alternatives.join(", ") || "—" },
    { field: "emergency accessibility", get: (m) => m.emergency.accessibility },
    { field: "emergency management agency", get: (m) => m.agencies.emergencyManagement?.name },
    { field: "fire service", get: (m) => m.agencies.fire?.name },
    { field: "food safety authority", get: (m) => m.agencies.foodSafety?.name },
    { field: "gas regulator", get: (m) => m.agencies.gasRegulator?.name },
    { field: "trade registration", get: (m) => m.agencies.tradeRegistration?.name },
    { field: "units", get: (m) => m.units },
    { field: "water per person", get: (m) => m.figures.waterPerPersonPerDay },
    { field: "water for three days", get: (m) => m.figures.waterThreeDays },
    { field: "fridge without power", get: (m) => m.figures.fridgeWithoutPower },
    { field: "freezer without power", get: (m) => m.figures.freezerWithoutPower },
    { field: "gas certificate", get: (m) => m.figures.gasCertificate },
    { field: "term: emergency management", get: (m) => m.terms.emergencyManagement },
    { field: "term: electrician", get: (m) => m.terms.electrician },
    { field: "term: gasfitter", get: (m) => m.terms.gasfitter },
    { field: "official water guidance", get: (m) => m.links.storingWater },
    { field: "official gas guidance", get: (m) => m.links.gasWork },
    { field: "official food guidance", get: (m) => m.links.foodInEmergencies },
  ];

  const out: PilotResult["differences"] = [];
  for (const f of fields) {
    const values: Record<string, string> = {};
    for (const p of profiles) values[p.code] = f.get(p) ?? "—";
    const distinct = new Set(Object.values(values));
    if (distinct.size > 1) out.push({ field: f.field, values });
  }
  return out;
}

/** Write the pilot's outputs. Only ever inside the workspace. */
export function writePilot(result: PilotResult, outDir: string): string[] {
  fs.mkdirSync(outDir, { recursive: true });
  const written: string[] = [];
  for (const m of result.markets) {
    const file = path.join(outDir, `household-risk-identifier.${m.market}.html`);
    fs.writeFileSync(file, m.html, "utf8");
    written.push(file);
  }
  // The rendered HTML is written as its own file per market, so the JSON summary carries everything else.
  const summary = { ...result, markets: result.markets.map((m) => ({ ...m, html: `household-risk-identifier.${m.market}.html` })) };
  fs.writeFileSync(path.join(outDir, "pilot-result.json"), JSON.stringify(summary, null, 1), "utf8");
  written.push(path.join(outDir, "pilot-result.json"));
  return written;
}
