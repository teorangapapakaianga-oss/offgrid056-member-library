import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { keepSmallTablesTogether, reskinHtml } from "@/admin-import/reskin/reskin";
import { findContentFlags, fuelSafetyFindings, prepareResource, unansweredSafetyNotes, type PrepInputs } from "@/admin-import/pilot/prep";
import profilesFile from "@/admin-import/markets/profiles.json";
import pilotSpec from "@/admin-import/pilot/og-02.json";
import topicBlocks from "@/admin-import/config/safety-blocks.json";
import type { MarketProfile, SafetyBlock } from "@/admin-import/markets/resolve";
import { safetyExposureFor } from "@/admin-import/audit/group-a";

/**
 * Stage 9.16. Group-A batch 2 hardening: no silent metadata fallbacks, required safety blocks enforced, legacy
 * programme text flagged, and the cover title no longer covering its label.
 */
const DOC = `<!DOCTYPE html><html><head><style>.cover-label { position: absolute; bottom: 155px; } .cover-title { position: absolute; bottom: 75px; font-size: 45px; }</style></head><body>
<div class="cover-page">
  <div class="cover-label">OffGrid056 30-Day Programme</div>
  <h1 class="cover-title">OG-27 90-Day Implementation Roadmap</h1>
  <p class="cover-subtitle">Turn your plan into phased action with deadlines</p>
</div>
<div class="content"><h2>Plan</h2><p>Install the solar inverter and batteries.</p>
<p>Next: OG-28 Household Responsibility Roster &rarr;</p></div></body></html>`;

const blocks = { ...pilotSpec.safetyBlocks, ...topicBlocks.blocks } as unknown as Record<string, SafetyBlock>;
const markets = profilesFile.markets as unknown as MarketProfile[];

function item(overrides: Record<string, unknown> = {}) {
  return {
    legacyCode: "OG-27",
    proposedResourceId: "res-1027",
    title: "90 Day Implementation Roadmap",
    foundation: { value: "shelter", confidence: "MEDIUM", evidence: [] },
    resourceType: { value: "planner", confidence: "MEDIUM", evidence: [] },
    legacyIssues: [],
    legacyTerminology: [],
    safetyNotes: [],
    ...overrides,
  } as unknown as PrepInputs["item"];
}

function prep(extra: Partial<PrepInputs> = {}) {
  return prepareResource({
    item: item(),
    sourceHtml: DOC,
    blocks,
    markets,
    launchMarkets: ["NZ", "AU"],
    outDir: fs.mkdtempSync(path.join(os.tmpdir(), "og056-prep-")),
    ...extra,
  });
}

describe("cover layout", () => {
  it("stacks label, title and subtitle in one column so a long title cannot cover the label", () => {
    const { html } = reskinHtml(DOC);
    expect(html).toMatch(/<div class="cover-text"><div class="cover-label">[\s\S]*<h1 class="cover-title">[\s\S]*<p class="cover-subtitle">[\s\S]*<\/p><\/div>/);
    expect(html).toContain(".cover-text > .cover-label, .cover-text > .cover-title, .cover-text > .cover-subtitle { position: static");
  });

  it("leaves the centred cover design alone, which already stacks in normal flow", () => {
    const centred = DOC.replace(/<style>[^<]*<\/style>/, "<style>.cover-page { display: flex; flex-direction: column; align-items: center; } .cover-label { font-size: 11px; }</style>");
    const { html } = reskinHtml(centred);
    expect(html).not.toContain('class="cover-text"');
  });

  it("keeps table rows whole across printed pages, and only where there are tables", () => {
    const withTable = DOC.replace("<h2>Plan</h2>", "<h2>Plan</h2><table><tr><td>Week 2</td><td>Long cell</td></tr></table>");
    expect(reskinHtml(withTable).html).toContain("tr { break-inside: avoid; page-break-inside: avoid; }");
    expect(reskinHtml(DOC).html).not.toContain("break-inside: avoid");
  });

  it("keeps small tables whole but lets tall tables break between rows", () => {
    const rows = (n: number) => Array.from({ length: n }, (_, i) => `<tr><td>Row ${i}</td></tr>`).join("");
    const doc = `<table class="calc-table">${rows(8)}</table><table>${rows(14)}</table>`;
    const html = keepSmallTablesTogether(doc);
    expect(html).toContain('<table class="calc-table og-keep-together">');
    expect((html.match(/og-keep-together"/g) ?? []).length).toBe(1); // the 14-row table is left alone
    expect(keepSmallTablesTogether(html)).toBe(html); // idempotent
    expect(reskinHtml(DOC.replace("<h2>Plan</h2>", `<h2>Plan</h2>${doc}`)).html).toContain("table.og-keep-together { break-inside: avoid;");
  });

  it("marks tables only after copy changes, so an approved whole-table change still matches", () => {
    const table = `<table class="calc-table"><tr><td>Old</td></tr></table>`;
    const r = prep({
      sourceHtml: DOC.replace("<h2>Plan</h2>", `<h2>Plan</h2>${table}`),
      copyChanges: [{ where: "table", from: table, to: `<table class="calc-table"><tr><td>New</td></tr></table>`, expectedMatches: 1, approvedBy: "owner", approvedOn: "2026-09-22", reason: "test" }],
    });
    expect(r.copyChanges[0].applied).toBe(true);
    const out = fs.readFileSync(r.files[0], "utf8");
    expect(out).toContain('<table class="calc-table og-keep-together"><tr><td>New</td></tr></table>');
  });

  it("keeps short callout boxes whole and headings with their text, but not large section containers", () => {
    const withBox = DOC.replace("<h2>Plan</h2>", '<h2>Plan</h2><div class="warning-box"><div class="warning-title">Trap</div><p>Text</p></div><div class="worksheet-box">x</div>');
    const html = reskinHtml(withBox).html;
    expect(html).toContain(".warning-box { break-inside: avoid; page-break-inside: avoid; }");
    expect(html).toContain("h2, h3, .warning-title, .info-box-title, .tip-title { break-after: avoid;");
    expect(html).not.toMatch(/\.worksheet-box[^{]*\{\s*break-inside/);
    expect(reskinHtml(DOC).html).not.toContain(".warning-box");
  });

  it("changes no cover wording", () => {
    const { html } = reskinHtml(DOC);
    for (const text of ["OffGrid056 30-Day Programme", "OG-27 90-Day Implementation Roadmap", "Turn your plan into phased action with deadlines"]) {
      expect(html).toContain(text);
    }
  });
});

describe("content flags", () => {
  it("flags programme structure, next-step links, product tiers and other resources", () => {
    const flags = findContentFlags(
      `<p>OffGrid056 30-Day Programme</p><p>Day 27 Complete</p><p>Next: OG-28 Roster &rarr;</p><p>Bonus Asset | Tier 3</p><p>for Action Plan Plus members</p>`,
      "OG-27",
    );
    const kinds = flags.map((f) => f.kind);
    expect(kinds).toContain("programme-sequencing");
    expect(kinds).toContain("day-complete");
    expect(kinds).toContain("next-link");
    expect(kinds).toContain("product-name");
    expect(flags).toContainEqual({ code: "LEGACY_PROGRAMME_CONTEXT", kind: "cross-reference", text: "OG-28" });
    expect(flags.filter((f) => f.kind !== "figure-needs-source").every((f) => f.code === "LEGACY_PROGRAMME_CONTEXT")).toBe(true);
  });

  it("flags previous-step links and the old product and platform names from config", () => {
    const terms = { productNames: ["Resilience Action Plan Community"], platformNames: ["Skool", "Kajabi"] };
    const flags = findContentFlags(
      `<p>Previous: OG-13 Heat Loss Map</p><p>Join the Resilience Action Plan Community</p><p>Post it on Kajabi</p>`,
      "OG-14",
      terms,
    );
    expect(flags.map((f) => f.kind)).toEqual(expect.arrayContaining(["previous-link", "product-name", "platform-name", "cross-reference"]));
  });

  it("does not flag the resource's own code, and flags unsourced figures and health claims", () => {
    const flags = findContentFlags(`<p>Asset code OG-27</p><p>Lowering by 1°C saves 10% on heating.</p><p>Hypothermia is a threat.</p>`, "OG-27");
    expect(flags.some((f) => f.kind === "cross-reference")).toBe(false);
    expect(flags.some((f) => f.kind === "figure-needs-source")).toBe(true);
    expect(flags.some((f) => f.kind === "health-claim")).toBe(true);
  });

  it("does not flag a resource's own weekly structure or the ordinary word 'previous'", () => {
    const flags = findContentFlags(`<p>Week 1: Learn</p><p>Week 2: Assess</p><p>Previous reports or assessments</p>`, "OG-B04");
    expect(flags).toEqual([]);
  });

  it("does not flag a roadmap's own day milestones beyond the 30-day programme", () => {
    const flags = findContentFlags(`<p>Day 90 — retrospective and next 90 days</p><p>Day 60 Remaining</p><p>Next week, review the plan.</p>`, "OG-B10");
    expect(flags).toEqual([]);
    expect(findContentFlags(`<p>Day 25 — A professional brief</p>`, "OG-25").map((f) => f.kind)).toEqual(["programme-sequencing"]);
  });

  it("does not flag a budget table's 100% total, but still flags a percentage claim", () => {
    expect(findContentFlags(`<table><tr><td>GRAND TOTAL</td><td>100%</td></tr></table>`, "OG-22")).toEqual([]);
    expect(findContentFlags(`<p>Add 15% contingency.</p>`, "OG-26").map((f) => f.kind)).toEqual(["figure-needs-source"]);
  });

  it("finds nothing in plain teaching copy", () => {
    expect(findContentFlags(`<p>Check the roof for loose tiles after a storm.</p>`, "OG-01")).toEqual([]);
  });
});

describe("prepareResource: no silent metadata", () => {
  it("does not fall back to a foundation, type or category when the audit is only MEDIUM confidence", () => {
    const r = prep({ estimatedTime: 30, difficulty: "intermediate" });
    expect(r.foundation).toBeNull();
    expect(r.resourceType).toBeNull();
    expect(r.validation.ok).toBe(false);
    expect(r.validation.issues.join(" ")).toMatch(/foundation|category|resourceType/);
  });

  it("uses reviewed values when given", () => {
    const r = prep({ foundation: "general", resourceType: "planner", category: "planning", estimatedTime: 30, difficulty: "intermediate" });
    expect(r.foundation).toBe("general");
    expect(r.resourceType).toBe("planner");
    expect(r.validation.ok).toBe(true);
  });

  it("rejects a category that does not belong to the foundation", () => {
    const r = prep({ foundation: "energy", resourceType: "worksheet", category: "planning", estimatedTime: 30, difficulty: "advanced" });
    expect(r.validation.ok).toBe(false);
    expect(r.validation.issues.join(" ")).toContain('"planning" is not a category of the energy foundation');
  });
});

describe("required safety for any resource", () => {
  it("is computed from the text alone, so a Group-B resource is not waved through with no required blocks", () => {
    const text = "Rainwater tank. Water storage (200L). Drinking water filter. Solar panel. Battery (10kWh). Inverter. Wood burner. Chimney. Flue.";
    expect(safetyExposureFor(text)).toEqual(expect.arrayContaining(["stored-drinking-water", "batteries-and-electrical", "solid-fuel-heating"]));
    expect(safetyExposureFor("Score each room from 1 to 5.")).toEqual([]);
  });
});

describe("audit safety notes", () => {
  it("are answered only by the safety block for their topic, and gas cannot yet be answered", () => {
    const notes = [
      "covers stored drinking water (6 mentions) with no potability and treatment warning",
      "covers batteries and inverters (4 mentions) with no licensed electrician warning for fixed wiring",
      "covers gas appliances (3 mentions) with no ventilation and certified-installer warning",
    ];
    expect(unansweredSafetyNotes(notes, [])).toHaveLength(3);
    expect(unansweredSafetyNotes(notes, ["stored-drinking-water", "batteries-and-electrical", "indoor-combustion"])).toEqual([notes[2]]);
    expect(unansweredSafetyNotes(["covers something new (3 mentions) with no warning"], ["stored-drinking-water"])).toHaveLength(1);
  });
});

describe("prepareResource: resource-specific safety exemptions (Stage 9.30)", () => {
  const EXEMPT = {
    block: "food-safety-power-cut", reason: "appliance/load reference only", approvedBy: "owner", approvedOn: "2026-09-22", allowedMentions: ["Fridge / freezer"],
  };
  const withRow = DOC.replace("<h2>Plan</h2>", "<h2>Plan</h2><table><tr><td>Fridge / freezer</td><td>___ kWh</td></tr></table>");

  it("holds while the only mention is the allowed appliance row", () => {
    const r = prep({ sourceHtml: withRow, requiredSafety: ["food-safety-power-cut"], safetyExemptions: [EXEMPT] });
    expect(r.safety.missingRequired).toEqual([]);
    expect(r.safety.exemptions).toEqual([{ block: "food-safety-power-cut", reason: "appliance/load reference only", holds: true, unexpected: [] }]);
    expect(r.markets.every((m) => m.publishable)).toBe(true);
  });

  it("lapses, and requires the block again, when food guidance is added", () => {
    const withGuidance = withRow.replace("</div></body>", "<p>Keep the freezer closed during a power cut.</p></div></body>");
    const r = prep({ sourceHtml: withGuidance, requiredSafety: ["food-safety-power-cut"], safetyExemptions: [EXEMPT] });
    expect(r.safety.missingRequired).toEqual(["food-safety-power-cut"]);
    expect(r.safety.exemptions[0].holds).toBe(false);
    for (const m of r.markets) expect(m.problems.join(" ")).toContain("exemption no longer holds");
  });

  it("applies only to the resource that carries it: the detector still requires the block elsewhere", () => {
    const r = prep({ sourceHtml: withRow, requiredSafety: ["food-safety-power-cut"] });
    expect(r.safety.missingRequired).toEqual(["food-safety-power-cut"]);
    expect(r.markets.every((m) => !m.publishable)).toBe(true);
  });

  it("is recorded for OG-18 only, with the owner's reason and allowed mention", () => {
    const meta = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources as Record<string, { safetyExemptions?: typeof EXEMPT[] }>;
    const holders = Object.entries(meta).filter(([, m]) => m.safetyExemptions?.length).map(([code]) => code);
    expect(holders).toEqual(["OG-18"]);
    expect(meta["OG-18"].safetyExemptions).toMatchObject([{ block: "food-safety-power-cut", reason: "appliance/load reference only; no food-safety teaching", allowedMentions: ["Fridge / freezer"] }]);
  });
});

describe("prepareResource: safety", () => {
  it("blocks every market when a required safety block is missing", () => {
    const r = prep({ requiredSafety: ["batteries-and-electrical"] });
    expect(r.safety.missingRequired).toEqual(["batteries-and-electrical"]);
    for (const m of r.markets) {
      expect(m.publishable).toBe(false);
      expect(m.problems.join(" ")).toContain("batteries-and-electrical");
    }
    expect(r.importReadiness).toBe("NEEDS_CONTENT_REVIEW");
  });

  it("resolves the electrical block to each market's own licence name and number", () => {
    const r = prep({ requiredSafety: ["batteries-and-electrical"], extraSafetyBlocks: ["batteries-and-electrical"] });
    expect(r.safety.missingRequired).toEqual([]);
    const nz = fs.readFileSync(r.files.find((f) => f.endsWith(".NZ.html"))!, "utf8");
    const au = fs.readFileSync(r.files.find((f) => f.endsWith(".AU.html"))!, "utf8");
    expect(nz).toContain("licensed electrical worker");
    expect(nz).not.toContain("licensed electrician");
    expect(au).toContain("licensed electrician");
    expect(au).not.toContain("licensed electrical worker");
    expect(nz).toContain("call 111");
    expect(au).toContain("call Triple Zero (000)");
    for (const html of [nz, au]) expect(html).not.toMatch(/\{\{[^}]+\}\}/);
  });

  it("fails closed in a market that has no verified wording of its own", () => {
    const r = prep({ launchMarkets: ["NZ", "AU", "US"], extraSafetyBlocks: ["batteries-and-electrical"] });
    const us = r.markets.find((m) => m.code === "US")!;
    expect(us.publishable).toBe(false);
    expect(us.problems.join(" ")).toContain("safety.notVerifiedForMarket");
    expect(r.markets.filter((m) => m.code !== "US").every((m) => m.publishable)).toBe(true);
  });

  it("keeps every topic block's NZ and AU wording free of the other market's number", () => {
    for (const block of Object.values(topicBlocks.blocks) as { id: string; marketBody: Record<string, string> }[]) {
      expect(block.marketBody.NZ, block.id).not.toMatch(/\b000\b|\b112\b|Triple Zero/);
      expect(block.marketBody.AU, block.id).not.toMatch(/\b111\b/);
    }
  });

  it("gives the PDF the member-facing title, never the legacy code", () => {
    const withTitle = DOC.replace("<!DOCTYPE html><html><head>", "<!DOCTYPE html><html><head><title>OG-27 90-Day Implementation Roadmap — OffGrid056</title>");
    const r = prep({ sourceHtml: withTitle });
    const html = fs.readFileSync(r.files[0], "utf8");
    expect(html).toContain("<title>90-Day Implementation Roadmap — OffGrid056</title>");
    expect(html).not.toMatch(/<title>[^<]*OG-27/);
    expect(r.legacyCode).toBe("OG-27"); // kept for migration and audit history
  });

  it("is ready after final validation once metadata, content, safety and copy are all approved", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const r = prep({
      sourceHtml: clean,
      foundation: "general",
      resourceType: "planner",
      category: "planning",
      estimatedTime: 30,
      difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"],
      requiredSafety: ["batteries-and-electrical"],
      proposedBlockIds: [],
    });
    expect(r.importReadiness).toBe("READY_AFTER_FINAL_VALIDATION");
    expect(r.recordStatus).toBe("draft");
  });

  it("holds a resource that depends on one not yet in the library, whatever else is approved", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const r = prep({
      sourceHtml: clean,
      foundation: "general",
      resourceType: "planner",
      category: "planning",
      estimatedTime: 30,
      difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"],
      requiredSafety: ["batteries-and-electrical"],
      proposedBlockIds: [],
      blockedBy: { dependency: "OG-26 / 3-Tier Budget Planner" },
    });
    expect(r.validation.ok).toBe(true);
    expect(r.importReadiness).toBe("BLOCKED_BY_RESOURCE_DEPENDENCY");
    expect(r.blockedBy?.dependency).toBe("OG-26 / 3-Tier Budget Planner");
  });

  it("gives every PDF the standard title '<Resource Title> — OffGrid056'", () => {
    const withTitle = DOC.replace("<!DOCTYPE html><html><head>", "<!DOCTYPE html><html><head><title>OG-27 anything</title>");
    const r = prep({ sourceHtml: withTitle });
    expect(r.pdfTitle).toBe("90-Day Implementation Roadmap — OffGrid056");
  });

  it("applies a market-specific change in that market only", () => {
    const change = { where: "costs", from: "Install the solar inverter", to: "Install the solar inverter (AU wording)", expectedMatches: 1, approvedBy: "owner", approvedOn: "2026-09-22", reason: "test", markets: ["AU"] };
    const r = prep({ copyChanges: [change] });
    const nz = fs.readFileSync(r.files.find((f) => f.endsWith(".NZ.html"))!, "utf8");
    const au = fs.readFileSync(r.files.find((f) => f.endsWith(".AU.html"))!, "utf8");
    expect(au).toContain("Install the solar inverter (AU wording)");
    expect(nz).not.toContain("(AU wording)");
    expect(r.copyChanges.find((c) => c.markets?.includes("AU"))?.applied).toBe(true);
  });

  it("renders proposed copy for review but never lets it count as ready", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const proposal = { where: "plan", from: "<h2>Plan</h2>", to: "<h2>Your plan</h2>", expectedMatches: 1, approvedBy: "NOT APPROVED — proposal", approvedOn: "", reason: "test" };
    const r = prep({
      sourceHtml: clean, foundation: "general", resourceType: "planner", category: "planning", estimatedTime: 30, difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"], requiredSafety: ["batteries-and-electrical"], proposedBlockIds: [], proposedCopy: [proposal],
    });
    expect(fs.readFileSync(r.files[0], "utf8")).toContain("<h2>Your plan</h2>");
    expect(r.copyChanges.find((c) => c.where === "plan")?.proposed).toBe(true);
    expect(r.importReadiness).toBe("PREVIEW_WITH_PROPOSED_COPY");
  });

  it("uses an owner-specified PDF title when one is given", () => {
    const r = prep({ pdfTitle: "90-Day Implementation Roadmap — OffGrid056" });
    expect(fs.readFileSync(r.files[0], "utf8")).toContain("<title>90-Day Implementation Roadmap — OffGrid056</title>");
  });

  it("holds a resource whose topic blocks are still proposals", () => {
    const clean = DOC.replace(/<p>Next:[^<]*<\/p>/, "").replace("OffGrid056 30-Day Programme", "OffGrid056").replace("OG-27 ", "");
    const r = prep({
      sourceHtml: clean,
      foundation: "general",
      resourceType: "planner",
      category: "planning",
      estimatedTime: 30,
      difficulty: "intermediate",
      extraSafetyBlocks: ["batteries-and-electrical"],
      requiredSafety: ["batteries-and-electrical"],
      proposedBlockIds: ["batteries-and-electrical"],
    });
    expect(r.contentFlags).toEqual([]);
    expect(r.safety.proposed).toEqual(["batteries-and-electrical"]);
    expect(r.importReadiness).toBe("NEEDS_SAFETY_APPROVAL");
  });
});

/**
 * Stage 9.28. OG-19's approved copy: the removed battery figures must never come back through a later edit, and the
 * power/surge note the owner made a condition of deployment must stay — without any invented kW or surge numbers.
 */
describe("OG-19 approved copy", () => {
  const approved = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/approved-copy.json"), "utf8")) as {
    changes: Record<string, { where: string; to: string; approvedBy: string; markets?: string[] }[]>;
  };
  const og19 = approved.changes["OG-19"] ?? [];

  it("records all 17 reviewed changes plus the power/surge note, all owner-approved", () => {
    expect(og19).toHaveLength(18);
    expect(og19.every((c) => c.approvedBy === "owner")).toBe(true);
  });

  it("reintroduces none of the removed figures or products", () => {
    const to = og19.map((c) => c.to).join("\n");
    for (const s of ["Powerwall", "Aquion", "13.5", "0.8 for", "0.5 for", "20%", "× 0.6", "× 1.2", "× 2.4", "10–15", "80–95", "50%", "100%", "Cost/kWh", "10-year", "illegal in NZ", "survival tool"])
      expect(to, s).not.toContain(s);
  });

  it("keeps the power/surge note, with no kW value or multiplier", () => {
    const note = og19.find((c) => /power \/ surge note/.test(c.where));
    expect(note?.markets).toBeUndefined();
    const text = note!.to.replace(/<[^>]+>/g, " ");
    for (const s of ["kilowatt-hours (kWh)", "kilowatts (kW)", "motors, pumps or compressors", "continuous power output", "surge (starting) rating", "manufacturer's specifications or a qualified installer"])
      expect(text).toContain(s);
    // Only the planner's own formula carries digits; the note itself states no numbers.
    expect(text.slice(text.indexOf("Energy (kWh) is not"))).not.toMatch(/\d/);
  });

  it("keeps the NZ and AU licensing wording in their own markets (OG-19)", () => {
    const nz = og19.filter((c) => c.markets?.includes("NZ")).map((c) => c.to).join("\n");
    const au = og19.filter((c) => c.markets?.includes("AU")).map((c) => c.to).join("\n");
    expect(nz).toContain("licensed electrical worker");
    expect(nz).not.toContain("licensed electrician");
    expect(au).toContain("licensed electrician");
    expect(au).not.toContain("electrical worker");
  });
});

/**
 * Stage 9.30. OG-18's copy changes, wherever they currently sit (proposed until the owner approves them): the
 * removed solar figures stay out, each market keeps its own terms, and the OG-19 backup rule is carried forward.
 */
describe("OG-18 copy changes", () => {
  type Change = { where: string; from: string; to: string; markets?: string[] };
  const load = (f: string) => (JSON.parse(fs.readFileSync(path.resolve(`admin-import/config/${f}`), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-18"];
  const og18 = load("approved-copy.json") ?? load("proposed-copy.json") ?? [];
  const forMarket = (m: string) => og18.filter((c) => !c.markets || c.markets.includes(m)).map((c) => c.to.replace(/<[^>]+>/g, " ")).join("\n");
  const metadata = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources["OG-18"];

  it("reintroduces none of the removed figures, prices or programme navigation", () => {
    const to = og18.map((c) => c.to).join("\n");
    for (const s of ["1,400", "6,500", "Auckland", "4 peak sun hours", "÷ 4", "× 1.5", "winter buffer", "$1,800", "$6,000", "$8,000", "7–10 years", "Offset", "OG-19", "Day 18", "Tomorrow", "Next:", "free, infinite"])
      expect(to, s).not.toContain(s);
  });

  it("keeps each market's own terms", () => {
    const nz = forMarket("NZ");
    const au = forMarket("AU");
    expect(nz).toContain("licensed electrical worker");
    expect(nz).toContain("power company");
    expect(nz).not.toMatch(/licensed electrician|feed-in tariff|Permits, approvals/);
    expect(au).toContain("licensed electrician");
    expect(au).toContain("feed-in tariff");
    expect(au).not.toMatch(/electrical worker|power company|Consents and|30–45|New Zealand|\bNZ\b/);
  });

  it("never says solar panels alone give backup power", () => {
    for (const m of ["NZ", "AU"]) {
      const text = forMarket(m);
      expect(text).toContain("only if the system is designed to provide backup power");
      expect(text).toContain("Solar panels on their own will not power your home during a grid outage");
    }
  });

  it("replaces the absolute 'any No is solvable' with the owner's wording", () => {
    const to = og18.map((c) => c.to).join("\n");
    expect(to).not.toContain("solvable");
    expect(to).toContain('A "No" does not necessarily rule solar out — discuss the constraint with a qualified installer.');
  });

  it("uses only the two approved safety blocks it needs", () => {
    expect(metadata.safetyBlocks).toEqual(["batteries-and-electrical", "working-at-height"]);
    expect(metadata.safetyBlocks).not.toContain("food-safety-power-cut");
  });
});

/**
 * Stage 9.32. OG-21 was the programme's Week 3 summary. Its changes (proposed until approved) must leave no programme
 * navigation or legacy code behind, name only resources the library has, and stay market-neutral.
 */
describe("OG-21 copy changes", () => {
  type Change = { where: string; from: string; to: string; markets?: string[] };
  const load = (f: string) => (JSON.parse(fs.readFileSync(path.resolve(`admin-import/config/${f}`), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-21"];
  const og21 = load("approved-copy.json") ?? load("proposed-copy.json") ?? [];
  const to = og21.map((c) => c.to.replace(/<[^>]+>/g, " ")).join("\n");
  const meta = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources;

  it("leaves no programme navigation, legacy code or old framework word", () => {
    for (const s of ["Week 3", "Week 4", "Days 1", "Day 21", "OG-03", "OG-2", "Pillar", "Next:", "fortress", "executing", "declared tier"]) expect(to, s).not.toContain(s);
  });

  it("names only resources that are in the library", () => {
    for (const title of ["Warm Home Scorecard", "Solar Power 101 Workbook", "Battery Backup Planner", "3-Tier Budget Planner", "Resilience Product Wishlist", "Project Support Brief Template", "90-Day Implementation Roadmap"])
      expect(to).toContain(title);
    expect(to).not.toMatch(/supplier questions|Alternative Energy Suitability/);
  });

  it("is market-neutral: no market-only change and no agency, programme or licence term", () => {
    expect(og21.every((c) => !c.markets)).toBe(true);
    expect(to).not.toMatch(/New Zealand|Australia|EECA|Warmer Kiwi|licensed electric/);
  });

  it("uses only the solid-fuel and electrical blocks the audit found", () => {
    expect(meta["OG-21"].safetyBlocks).toEqual(["batteries-and-electrical", "solid-fuel-heating"]);
  });

  it("queues OG-18 as a related resource on OG-B07, OG-19 and OG-26 (Stage 9.31)", () => {
    for (const code of ["OG-B07", "OG-19", "OG-26"]) expect(meta[code].relatedResources, code).toContain("res-1018");
  });
});

/**
 * Stage 9.34. The generator block (owner rulings, Stage 9.33): each market says only what its own official sources
 * support, no distance anywhere, and where it is present the electrical block stops repeating it.
 */
describe("generator safety block", () => {
  const gen = (topicBlocks.blocks as Record<string, { marketBody: Record<string, string> }>)["generator-safety"];
  const nz = gen.marketBody.NZ;
  const au = gen.marketBody.AU;
  const html = (r: ReturnType<typeof prep>, m: string) => fs.readFileSync(r.files.find((f) => f.endsWith(`.${m}.html`))!, "utf8");

  it("keeps the distance non-numeric and leaves out the US rule and workplace petrol limits", () => {
    for (const body of [nz, au]) {
      expect(body).not.toMatch(/\d+\s*(m|metres?|feet|ft)\b|20[- ]foot|\b20 metres|50 litres/i);
      expect(body).toMatch(/well-ventilated/);
      expect(body).toMatch(/garage/);
    }
  });

  it("uses each market's own sources: NZ has the 10-minute cool-down and no rain or lead rules; AU the reverse", () => {
    expect(nz).toContain("at least 10 minutes");
    expect(nz).toContain("licensed electrical worker");
    expect(nz).toContain("changeover switch");
    expect(nz).not.toMatch(/rain|carport|veranda|extension lead|licensed electrician|carbon monoxide alarm/i);
    expect(au).not.toMatch(/\d+ minutes|electrical worker/);
    for (const s of ["licensed electrician", "dedicated generator inlet", "changeover switch", "do not use it in rain", "do not cover it", "extension leads", "battery-operated carbon monoxide alarm"])
      expect(au).toContain(s);
  });

  it("is petrol-only: nothing about LPG or gas generators", () => {
    expect(nz + au).not.toMatch(/LPG|gas generator|dual.fuel/i);
  });

  it("trims the electrical block's generator lines only where the generator block is present", () => {
    const withGen = prep({ extraSafetyBlocks: ["generator-safety", "batteries-and-electrical"] });
    const without = prep({ extraSafetyBlocks: ["batteries-and-electrical"] });
    expect(html(withGen, "NZ")).not.toContain("Never connect a generator to your house wiring unless");
    expect(html(withGen, "AU")).not.toContain("Never power the house by plugging a generator");
    expect(html(withGen, "NZ")).toContain("Solar panels, home batteries and inverters must be installed by a licensed electrical worker");
    // Every other resource keeps the full electrical wording.
    expect(html(without, "NZ")).toContain("Never connect a generator to your house wiring unless");
    expect(html(without, "AU")).toContain("Never power the house by plugging a generator");
  });

  it("answers a generator audit note with the generator block and carbon monoxide, or the old outdoor-appliance pair", () => {
    const note = "covers generators (14 mentions) with no carbon monoxide and outdoor-use warning";
    expect(unansweredSafetyNotes([note], ["generator-safety", "carbon-monoxide"])).toEqual([]);
    expect(unansweredSafetyNotes([note], ["indoor-combustion", "carbon-monoxide"])).toEqual([]);
    expect(unansweredSafetyNotes([note], ["generator-safety"])).toEqual([note]);
  });

  it("keeps a decision-flowchart box whole when printing", () => {
    const { html: skinned } = reskinHtml(DOC.replace("<h2>Plan</h2>", '<h2>Plan</h2><div class="flow-box"><h4>Q1</h4><p>YES</p></div>'));
    expect(skinned).toMatch(/\.flow-box[^{]*\{ break-inside: avoid/);
  });
});

describe("OG-20 copy changes", () => {
  type Change = { where: string; from: string; to: string; markets?: string[] };
  const load = (f: string) => (JSON.parse(fs.readFileSync(path.resolve(`admin-import/config/${f}`), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-20"];
  const og20 = load("approved-copy.json") ?? load("proposed-copy.json") ?? [];
  const forMarket = (m: string) => og20.filter((c) => !c.markets || c.markets.includes(m)).map((c) => c.to.replace(/<[^>]+>/g, " ")).join("\n");
  const meta = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources["OG-20"];

  it("drops every unsourced figure and rule of thumb", () => {
    const to = og20.map((c) => c.to).join("\n");
    for (const s of ["50–70%", "4 m/s", "10m", "kW", "$", "years", "Any location", "generator shed", "Test monthly", "Keep fuel fresh", "Most reliable", "seamless", "Day 20", "Next:", "OG-2"])
      expect(to, s).not.toContain(s);
  });

  it("names each market's electrical licence and permission terms", () => {
    expect(forMarket("NZ")).toContain("licensed electrical worker");
    expect(forMarket("NZ")).not.toMatch(/licensed electrician|Permits or approvals/);
    expect(forMarket("AU")).toContain("licensed electrician");
    expect(forMarket("AU")).toContain("Permits or approvals needed");
    expect(forMarket("AU")).not.toMatch(/electrical worker|Consents/);
  });

  it("uses the generator block, carbon monoxide and electrical — not the generic outdoor-appliance block", () => {
    expect(meta.safetyBlocks).toEqual(["generator-safety", "carbon-monoxide", "batteries-and-electrical"]);
    expect(meta.approvedSafetyBlocks).toEqual(meta.safetyBlocks);
  });

  it("records the CO alarm de-duplication for OG-20's AU file only (Stage 9.34 ruling 6)", () => {
    const all = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources as Record<string, { safetyBlockTrims?: { block: string; market: string; approvedBy: string }[] }>;
    // Owner-approved trims only; a later resource may carry one as a proposal (OG-B12, Stage 9.36).
    const approvedTrims = Object.entries(all).filter(([, m]) => m.safetyBlockTrims?.some((t) => t.approvedBy === "owner")).map(([code]) => code).sort();
    // OG-20 (Stage 9.34) and OG-B12 (Stage 9.36), each approved for its own AU file.
    expect(approvedTrims).toEqual(["OG-20", "OG-B12"]);
    expect(meta.safetyBlockTrims).toMatchObject([{ block: "carbon-monoxide", market: "AU" }]);
  });
});

describe("prepareResource: scoped block trims and gas generators (Stage 9.34)", () => {
  const coAu = (topicBlocks.blocks as Record<string, { marketBody: Record<string, string> }>)["carbon-monoxide"].marketBody.AU;
  const ALARM = "Consider a carbon monoxide alarm near bedrooms and rooms with gas heaters; NSW Health advises choosing one that meets the US (UL2034) or European (EN50291) standard.";
  const trim = { block: "carbon-monoxide", market: "AU", removeSentence: ALARM, reason: "duplicate", approvedBy: "owner", approvedOn: "2026-09-22" };
  const html = (r: ReturnType<typeof prep>, m: string) => fs.readFileSync(r.files.find((f) => f.endsWith(`.${m}.html`))!, "utf8");

  it("removes the sentence from that market's block only, keeping the rest of the block", () => {
    expect(coAu).toContain(ALARM);
    const r = prep({ extraSafetyBlocks: ["carbon-monoxide"], safetyBlockTrims: [trim] });
    expect(html(r, "AU")).not.toContain("Consider a carbon monoxide alarm near bedrooms");
    expect(html(r, "AU")).toContain("Poisons Information Centre");
    expect(html(r, "AU")).toContain("Have gas heaters checked by a licensed gasfitter");
    expect(html(r, "NZ")).toContain("consider installing carbon monoxide alarms");
    expect(r.safety.trims).toEqual([{ block: "carbon-monoxide", market: "AU", reason: "duplicate", applied: true }]);
    // Another resource without the trim keeps the canonical sentence.
    expect(html(prep({ extraSafetyBlocks: ["carbon-monoxide"] }), "AU")).toContain("Consider a carbon monoxide alarm near bedrooms");
  });

  it("blocks the market rather than guess when the shared wording has changed", () => {
    const r = prep({ extraSafetyBlocks: ["carbon-monoxide"], safetyBlockTrims: [{ ...trim, removeSentence: "A sentence that is not in the block." }] });
    const au = r.markets.find((m) => m.code === "AU")!;
    expect(au.publishable).toBe(false);
    expect(au.problems.join(" ")).toContain("scoped trim");
    expect(r.markets.find((m) => m.code === "NZ")!.publishable).toBe(true);
  });

  it("fails closed with GAS_SAFETY_REQUIRED when generator content runs on gas", () => {
    for (const text of ["Run an LPG generator outside.", "A dual-fuel generator can use petrol or gas.", "Standby generators can run on natural gas."]) {
      const r = prep({ sourceHtml: DOC.replace("<h2>Plan</h2>", `<h2>Plan</h2><p>${text}</p>`) });
      expect(r.markets.every((m) => !m.publishable), text).toBe(true);
      expect(r.terminology.otherFindings.join(" "), text).toContain("GAS_SAFETY_REQUIRED");
      expect(r.importReadiness).not.toBe("READY_AFTER_FINAL_VALIDATION");
    }
  });

  it("does not trip on a petrol generator, or on the CO block's own mention of LPG heaters", () => {
    const r = prep({ sourceHtml: DOC.replace("<h2>Plan</h2>", "<h2>Plan</h2><p>Run a petrol generator outside.</p>"), extraSafetyBlocks: ["carbon-monoxide"] });
    expect(r.terminology.otherFindings.join(" ")).not.toContain("GAS_SAFETY_REQUIRED");
    expect(r.markets.every((m) => m.publishable)).toBe(true);
  });
});

/**
 * Stage 9.36. Fuels no approved guidance covers hold a resource wherever they appear in its own text — OG-B12's gas
 * and diesel lines are the cases — while the options lists already approved in OG-15 and OG-26 ("gas heater") stay as
 * they are.
 */
describe("fuel checks (Stage 9.36)", () => {
  it("holds OG-B12's original gas and diesel lines", () => {
    expect(fuelSafetyFindings("<p>Storage: Lithium battery bank, generator fuel reserve (diesel/petrol/LPG).</p>").join(" ")).toMatch(/GAS_SAFETY_REQUIRED[\s\S]*FUEL_GUIDANCE_REQUIRED/);
    expect(fuelSafetyFindings("<p>Fuel: Firewood, LPG, or diesel (store safely, rotate stock).</p>")).toHaveLength(2);
    expect(fuelSafetyFindings("<p>Blackwater: Composting toilet, septic tank with leach field, or biogas digester.</p>").join(" ")).toContain("GAS_SAFETY_REQUIRED");
    expect(fuelSafetyFindings("<p>Compost returns nutrients. Biogas provides cooking fuel.</p>").join(" ")).toContain("GAS_SAFETY_REQUIRED");
  });

  // Stage 9.36 ruling 3: no phrase exemption. "Gas heater" trips the check everywhere; OG-15 and OG-26 pass only
  // through a reviewed exemption for their own exact text.
  const meta = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources as Record<string, { fuelExemptions?: Parameters<typeof fuelSafetyFindings>[1] }>;
  const OG15 = "<td>12. Backup heating exists (fireplace, wood burner, gas heater, portable)</td>";
  const OG26 = "<td>Emergency heating (gas heater / thermal blankets)</td>";

  it("detects gas appliances — there is no global 'gas heater' exemption", () => {
    for (const s of [OG15, OG26, "<p>Run the gas heater with a window open.</p>", "<p>Use an unflued cabinet heater.</p>", "<p>Cook on the gas cooktop.</p>"])
      expect(fuelSafetyFindings(s).join(" "), s).toContain("GAS_SAFETY_REQUIRED");
    expect(fuelSafetyFindings("<p>Firewood — keep a dry store and rotate stock.</p>")).toEqual([]);
    expect(fuelSafetyFindings("<p>Current power / water / gas bills (last 12 months)</p>")).toEqual([]);
  });

  it("lets OG-15 and OG-26 through only by their own reviewed exact-context exemptions", () => {
    expect(fuelSafetyFindings(OG15, meta["OG-15"].fuelExemptions)).toEqual([]);
    expect(fuelSafetyFindings(OG26, meta["OG-26"].fuelExemptions)).toEqual([]);
    // Each exemption covers only its own resource's text …
    expect(fuelSafetyFindings(OG26, meta["OG-15"].fuelExemptions)).not.toEqual([]);
    // … and not new gas teaching added beside it, nor a reworded version of it.
    expect(fuelSafetyFindings(OG15 + "<p>Light the gas heater and leave it on overnight.</p>", meta["OG-15"].fuelExemptions)).not.toEqual([]);
    expect(fuelSafetyFindings("<td>Emergency heating (gas heater / blankets)</td>", meta["OG-26"].fuelExemptions)).not.toEqual([]);
    const holders = Object.entries(meta).filter(([, m]) => m.fuelExemptions?.length).map(([code]) => code).sort();
    expect(holders).toEqual(["OG-15", "OG-26"]);
  });

  it("blocks both markets when diesel appears", () => {
    const r = prep({ sourceHtml: DOC.replace("<h2>Plan</h2>", "<h2>Plan</h2><p>Keep a diesel reserve.</p>") });
    expect(r.markets.every((m) => !m.publishable)).toBe(true);
    expect(r.terminology.otherFindings.join(" ")).toContain("FUEL_GUIDANCE_REQUIRED");
  });

  it("holds a resource while a scoped trim is still a proposal", () => {
    const ALARM = "Consider a carbon monoxide alarm near bedrooms and rooms with gas heaters; NSW Health advises choosing one that meets the US (UL2034) or European (EN50291) standard.";
    const base = { block: "carbon-monoxide", market: "AU", removeSentence: ALARM, reason: "duplicate", approvedOn: "" };
    const ready = { extraSafetyBlocks: ["carbon-monoxide"], difficulty: "beginner", estimatedTime: 10, foundation: "shelter", resourceType: "planner", category: "household-resilience", description: "d" };
    expect(prep({ ...ready, safetyBlockTrims: [{ ...base, approvedBy: "NOT APPROVED — proposal" }] }).importReadiness).toBe("PREVIEW_WITH_PROPOSED_COPY");
    expect(prep({ ...ready, safetyBlockTrims: [{ ...base, approvedBy: "owner" }] }).importReadiness).not.toBe("PREVIEW_WITH_PROPOSED_COPY");
  });

  it("keeps each safety block whole when printing", () => {
    const html = fs.readFileSync(prep({ extraSafetyBlocks: ["stored-drinking-water"] }).files[0], "utf8");
    expect(html).toMatch(/\.og-safety \{[^}]*break-inside: avoid/);
  });
});

describe("OG-B12 copy changes", () => {
  type Change = { where: string; from: string; to: string; markets?: string[] };
  const load = (f: string) => (JSON.parse(fs.readFileSync(path.resolve(`admin-import/config/${f}`), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-B12"];
  const ogb12 = load("approved-copy.json") ?? load("proposed-copy.json") ?? [];
  const forMarket = (m: string) => ogb12.filter((c) => !c.markets || c.markets.includes(m)).map((c) => c.to.replace(/<[^>]+>/g, " ")).join("\n");
  const meta = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources["OG-B12"];

  it("drops unsourced figures, installation detail, legacy tiers and codes", () => {
    const to = ogb12.map((c) => c.to).join("\n");
    for (const s of ["10-30kWh", "20,000L", "1,000L", "100L", "3+ years", "230V", "48V", "Tier 4", "Bonus", "30-Day", "OG-B12", "Humanure", "burning", "Closed loop", "Brand"]) expect(to, s).not.toContain(s);
  });

  it("introduces no gas or diesel content of its own (Option A)", () => {
    for (const m of ["NZ", "AU"]) expect(fuelSafetyFindings(forMarket(m)), m).toEqual([]);
  });

  it("keeps each market's licence and approval terms", () => {
    expect(forMarket("NZ")).toContain("licensed electrical worker");
    expect(forMarket("NZ")).not.toMatch(/licensed electrician|Permits or Approvals|water rules that apply/);
    expect(forMarket("AU")).toContain("licensed electrician");
    expect(forMarket("AU")).toMatch(/Permits or Approvals Needed/);
    expect(forMarket("AU")).not.toMatch(/electrical worker|with consent/);
  });

  it("carries the OG-19 rule: power output and capacity are separate, and backup must be asked about", () => {
    expect(forMarket("NZ")).toContain("a separate check from battery capacity (kWh)");
    expect(forMarket("NZ")).toContain("Can the system supply backup power during an outage?");
  });

  it("uses the five approved blocks its text triggers, with the owner-approved AU CO trim", () => {
    expect(meta.safetyBlocks).toEqual(["generator-safety", "carbon-monoxide", "batteries-and-electrical", "solid-fuel-heating", "stored-drinking-water"]);
    expect(meta.safetyBlockTrims).toMatchObject([{ block: "carbon-monoxide", market: "AU", approvedBy: "owner" }]);
    expect([meta.foundation, meta.category, meta.difficulty, meta.estimatedTime]).toEqual(["general", "planning", "advanced", 60]);
  });

  it("names canning only as a method: no times, temperatures, pressures or recipes", () => {
    const to = ogb12.map((c) => c.to).join("\n");
    expect(to).not.toMatch(/\d+\s*(minutes|min|°|degrees|kPa|psi)|recipe|shelf life/i);
  });
});

/**
 * Stage 9.38. OG-08's calculator must use each market's own approved drinking-water figure — NZ: 3 L per person per
 * day for at least three days; AU: 10 L per person for three days — and label longer periods as optional planning.
 */
describe("OG-08 water calculator", () => {
  type Change = { where: string; from: string; to: string; markets?: string[] };
  const load = (f: string) => (JSON.parse(fs.readFileSync(path.resolve(`admin-import/config/${f}`), "utf8")) as { changes: Record<string, Change[]> }).changes["OG-08"];
  const og08 = load("approved-copy.json") ?? load("proposed-copy.json") ?? [];
  const forMarket = (m: string) =>
    og08.filter((c) => !c.markets || c.markets.includes(m)).map((c) => c.to.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/ ([.,:;])/g, "$1")).join("\n");
  const formulas = (m: string) => [...forMarket(m).matchAll(/People × \d+ L(?: × \d+ days| × \d+ ÷ 3)?/g)].map((x) => x[0]);

  it("uses the NZ rate of 3 L per person per day, never 10 L", () => {
    expect(formulas("NZ")).toEqual(["People × 3 L × 3 days", "People × 3 L × 7 days", "People × 3 L × 14 days", "People × 3 L × 30 days"]);
    expect(forMarket("NZ")).toContain("at least 3 litres of drinking water per person per day, for at least three days");
    expect(forMarket("NZ")).not.toMatch(/10 ?L\b|10 litres/);
  });

  it("uses the AU figure of 10 L per person for three days — not per day — and scales it openly", () => {
    expect(formulas("AU")).toEqual(["People × 10 L", "People × 10 L × 7 ÷ 3", "People × 10 L × 14 ÷ 3", "People × 10 L × 30 ÷ 3"]);
    expect(forMarket("AU")).toContain("at least 10 litres of drinking water per person for three days");
    expect(forMarket("AU")).not.toMatch(/per person per day|3 L ×|civil defence|Civil Defence/);
    // The scaled rows equal the three-day figure per three days: 10 L × days ÷ 3.
    for (const [days, litres] of [[7, 70 / 3], [14, 140 / 3], [30, 100]] as const) expect(10 * days / 3).toBeCloseTo(litres);
  });

  it("labels the official baseline and the optional extended storage in both markets", () => {
    for (const m of ["NZ", "AU"]) {
      expect(forMarket(m)).toContain("OFFICIAL EMERGENCY BASELINE");
      expect(forMarket(m)).toContain("optional extended resilience storage");
      expect(forMarket(m)).toContain("Round each total up to the next whole litre");
    }
  });

  it("keeps treatment out of the calculator and drops the unsourced figures", () => {
    const to = og08.map((c) => c.to).join("\n");
    expect(to).not.toMatch(/bleach|drops|boil/i);
    for (const s of ["50–70%", "10 litres per person per day", "50 litres", "20L", "200L", "1000L", "IBC", "6–12 months", "Dark + cool + sealed", "Day 8", "Next:", "OG-09"]) expect(to, s).not.toContain(s);
  });

  it("uses only the approved drinking-water block", () => {
    const meta = JSON.parse(fs.readFileSync(path.resolve("admin-import/config/metadata-review.json"), "utf8")).resources;
    expect(meta["OG-08"].safetyBlocks).toEqual(["stored-drinking-water"]);
    expect(meta["OG-26"].futureWordingReview.status).toMatch(/^QUEUED/);
  });
});
