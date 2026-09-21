import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import AdmZip from "adm-zip";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { checksum, scanSources } from "@/admin-import/scanner/scan";
import { detectFileType, extractText, unspace } from "@/admin-import/parsers/index";
import { classify, detectLegacy, detectOgCode, slugify } from "@/admin-import/mappers/classify";
import { groupDuplicates, stringSimilarity, textSimilarity } from "@/admin-import/dedupe/group";
import type { Candidate } from "@/admin-import/types";
import type { TextBundle } from "@/admin-import/mappers/classify";

/**
 * The importer is tested against a small synthetic tree, never real OffGrid056 content: fast, repeatable, and it
 * cannot disturb anything that matters.
 */
let root: string;

const LEGACY_HTML = `<!doctype html><html><head><title>OG-08 Water Storage Calculator</title>
<style>body{background:#1A2332;color:#C9A227;font-family:'Playfair Display',serif}</style></head>
<body><h1>Water Storage Calculator</h1><p>Work out how many litres your household needs. Rainwater tank sizing,
storage containers and rotation. This is one of the 5 Pillars of preparedness.</p></body></html>`;

const CURRENT_MD = `# Energy Backup Guide

Power cuts, generators, solar and batteries. Keeping the lights on with a torch, a lantern and a power bank.
Energy planning for the household. Outage, blackout, inverter, panel.`;

beforeAll(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "og-importer-test-"));
  const write = (rel: string, data: string | Buffer) => {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, data);
    return full;
  };

  write("programme/OG-08_Water_Storage_Calculator.html", LEGACY_HTML);
  write("programme/OG-08_Water_Storage_Calculator.txt", "Water storage calculator: litres, rainwater, tank, storage, rotation, household needs.");
  write("guides/OG-22_Energy_Backup_Guide.md", CURRENT_MD);
  write("guides/copy/OG-22_Energy_Backup_Guide.md", CURRENT_MD); // exact duplicate in another folder
  write("guides/OG-22_Energy_Backup_Guide_v2.md", CURRENT_MD + "\n\nRevised with an extra paragraph about fuel storage safety.");
  write("misc/README.md", "# Index\n\nOG-01, OG-02, OG-08, OG-22 are listed here."); // an index, not a resource
  write("misc/note.txt", "Nothing much here.");
  write("misc/artwork.png", Buffer.from("89504e470d0a1a0a0000000d49484452000001000000008008060000", "hex"));

  // A DOCX and an XLSX are ZIPs: built here so both parsers are proven without shipping binary fixtures.
  const docx = new AdmZip();
  docx.addFile("word/document.xml", Buffer.from("<w:document><w:body><w:p><w:r><w:t>Pantry rotation worksheet for food storage</w:t></w:r></w:p></w:body></w:document>"));
  write("misc/food-pantry.docx", docx.toBuffer());

  const xlsx = new AdmZip();
  xlsx.addFile("xl/sharedStrings.xml", Buffer.from("<sst><si><t>Water storage calculator litres per person</t></si></sst>"));
  xlsx.addFile("xl/worksheets/sheet1.xml", Buffer.from("<worksheet/>"));
  write("misc/water-calculator.xlsx", xlsx.toBuffer());

  const pack = new AdmZip();
  pack.addFile("read-me.txt", Buffer.from("bundle"));
  write("misc/starter-pack.zip", pack.toBuffer());
});

afterAll(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

const scanOptions = {
  ignore: { folders: [], filenames: [], extensions: [] },
  limits: { maxTextBytesPerFile: 200000, textExtractionSkipOver: 50_000_000 },
};

async function scanFixture() {
  return scanSources([{ label: "fixtures", path: root, enabled: true }], scanOptions);
}

describe("scanner", () => {
  it("finds every file and records size, date, type and checksum", async () => {
    const { entries, summary } = await scanFixture();
    expect(entries.length).toBe(11);
    expect(summary.files).toBe(11);
    for (const e of entries) {
      expect(e.source.sizeBytes).toBeGreaterThan(0);
      expect(e.source.checksum.startsWith("sha256:")).toBe(true);
      expect(Number.isNaN(Date.parse(e.source.modified))).toBe(false);
    }
  });

  it("honours ignore rules", async () => {
    const { entries } = await scanSources([{ label: "fixtures", path: root, enabled: true }], {
      ...scanOptions,
      ignore: { folders: ["copy"], filenames: ["note.txt"], extensions: [".png"] },
    });
    const names = entries.map((e) => e.source.filename);
    expect(names).not.toContain("note.txt");
    expect(names).not.toContain("artwork.png");
    expect(entries.filter((e) => e.source.folder.includes("copy"))).toHaveLength(0);
  });

  it("leaves every source file exactly as it found it", async () => {
    const before = new Map<string, { sum: string; mtime: number }>();
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
    for (const f of walk(root)) before.set(f, { sum: checksum(f), mtime: fs.statSync(f).mtimeMs });

    await scanFixture();

    for (const [f, state] of before) {
      expect(fs.existsSync(f)).toBe(true);
      expect(checksum(f)).toBe(state.sum); // content unchanged
      expect(fs.statSync(f).mtimeMs).toBe(state.mtime); // not even the timestamp moved
    }
  });

  it("produces a stable checksum, and the same one for identical files", () => {
    const a = path.join(root, "guides/OG-22_Energy_Backup_Guide.md");
    const b = path.join(root, "guides/copy/OG-22_Energy_Backup_Guide.md");
    expect(checksum(a)).toBe(checksum(a));
    expect(checksum(a)).toBe(checksum(b));
  });
});

describe("file type detection", () => {
  it("reads the real type from the file, not the extension", () => {
    const mislabelled = path.join(root, "misc/pretend.pdf");
    fs.writeFileSync(mislabelled, LEGACY_HTML);
    expect(detectFileType(mislabelled, ".pdf")).toBe("html");
    fs.rmSync(mislabelled);
  });

  it("tells DOCX, XLSX and a plain ZIP apart", () => {
    expect(detectFileType(path.join(root, "misc/food-pantry.docx"), ".docx")).toBe("docx");
    expect(detectFileType(path.join(root, "misc/water-calculator.xlsx"), ".xlsx")).toBe("xlsx");
    expect(detectFileType(path.join(root, "misc/starter-pack.zip"), ".zip")).toBe("zip");
  });

  it("reads text out of DOCX and XLSX", async () => {
    const docx = await extractText(path.join(root, "misc/food-pantry.docx"), "docx", 100000);
    expect(docx.text.toLowerCase()).toContain("pantry rotation");
    const xlsx = await extractText(path.join(root, "misc/water-calculator.xlsx"), "xlsx", 100000);
    expect(xlsx.text.toLowerCase()).toContain("litres per person");
  });

  it("rejoins letter-spaced PDF headings", () => {
    expect(unspace("W A T E R  S T O R A G E Calculator")).toBe("WATER STORAGE Calculator");
    expect(unspace("normal words stay as they are")).toBe("normal words stay as they are");
  });
});

describe("OG code detection", () => {
  it("finds codes in filenames, including bonus codes", () => {
    expect(detectOgCode("OG-08_Water_Storage_Calculator.html", "").value).toBe("OG-08");
    expect(detectOgCode("OG-B15_Bonus_Sheet.pdf", "").value).toBe("OG-B15");
    expect(detectOgCode("OG_30_Upgrade.pdf", "").value).toBe("OG-30");
    expect(detectOgCode("OG-08_Water_Storage_Calculator.html", "").confidence).toBe("HIGH");
  });

  it("is not fooled by the brand name or by dates", () => {
    expect(detectOgCode("OG056-HRG_IMG-01_cover.jpg", "").value).toBeNull();
    expect(detectOgCode("OffGrid056_Guide.pdf", "").value).toBeNull();
    expect(detectOgCode("report OG-2026 summary.pdf", "").value).toBeNull();
  });

  it("treats a document listing many codes as an index, not a resource", () => {
    const result = detectOgCode("README.md", "Contents: OG-01, OG-02, OG-08 and OG-22 are all included.");
    expect(result.value).toBeNull();
    expect(result.evidence[0]).toContain("index");
  });
});

describe("classification", () => {
  const classifyFixture = async (filename: string) => {
    const { entries, texts } = await scanFixture();
    const entry = entries.find((e) => e.source.filename === filename)!;
    return classify(entry, texts.get(entry.candidateId) as TextBundle);
  };

  it("infers a resource type with evidence", async () => {
    const c = await classifyFixture("OG-08_Water_Storage_Calculator.html");
    expect(c.inferred.resourceType.value).toBe("worksheet");
    expect(c.inferred.tags).toContain("calculator"); // owner decision D9-6
    expect(c.inferred.resourceType.evidence.join(" ")).toMatch(/filename|title/);
  });

  it("infers a foundation with confidence and evidence", async () => {
    const water = await classifyFixture("OG-08_Water_Storage_Calculator.html");
    expect(water.inferred.foundation.value).toBe("water");
    // "water" itself is an everyday word here, so it is deliberately demoted: the supporting words (litres,
    // rainwater, tank) carry it to MEDIUM, and a person still confirms. Only distinctive vocabulary reaches HIGH.
    expect(water.inferred.foundation.confidence).toBe("MEDIUM");
    expect(water.inferred.foundation.evidence.length).toBeGreaterThan(0);

    const energy = await classifyFixture("OG-22_Energy_Backup_Guide.md");
    expect(energy.inferred.foundation.value).toBe("energy");
  });

  it("never guesses a foundation for artwork", async () => {
    const art = await classifyFixture("artwork.png");
    expect(art.inferred.foundation.value).toBeNull();
    expect(art.inferred.resourceType.value).toBeNull();
    expect(art.status).toBe("NEEDS_REVIEW");
  });

  it("flags index and internal documents for review instead of importing them", async () => {
    const readme = await classifyFixture("README.md");
    expect(readme.status).toBe("NEEDS_REVIEW");
    expect(readme.materialKind).toBe("internal"); // internal material can never reach READY_TO_IMPORT
    expect(readme.importNotes).not.toBe("");
  });

  it("makes a slug from a title", () => {
    expect(slugify("Water Storage Calculator")).toBe("water-storage-calculator");
    expect(slugify("Air & Moisture: the basics")).toBe("air-and-moisture-the-basics");
  });
});

describe("legacy branding detection", () => {
  it("finds legacy colours, typography and terminology", () => {
    const { legacyIssues, migrationActions } = detectLegacy({ text: LEGACY_HTML, raw: LEGACY_HTML, meta: {} });
    const issues = legacyIssues.map((i) => i.issue).join(" | ");
    expect(issues).toContain("#1A2332");
    expect(issues).toContain("#C9A227");
    expect(issues.toLowerCase()).toContain("playfair display");
    expect(issues).toMatch(/5 Pillars/i);
    expect(migrationActions.join(" ")).toMatch(/Five Foundations/);
  });

  it("does not mistake ordinary words for legacy typography", () => {
    const { legacyIssues } = detectLegacy({ text: "In winter, an interruption to the internal supply matters.", raw: "", meta: {} });
    expect(legacyIssues).toHaveLength(0);
  });

  it("leaves current-brand material alone", () => {
    const { legacyIssues } = detectLegacy({ text: "Colours #A8CF20 and #35551A with Bebas Neue and Montserrat.", raw: "", meta: {} });
    expect(legacyIssues).toHaveLength(0);
  });
});

describe("owner rulings (Stage 9.3 approval)", () => {
  const entryFor = (filename: string, extras: Partial<import("@/admin-import/types").InventoryEntry["source"]> = {}) => ({
    candidateId: "cand-test",
    source: {
      path: `C:\\src\\${filename}`,
      folder: "C:\\src",
      sourceLabel: "Work: active project",
      filename,
      extension: path.extname(filename),
      sizeBytes: 1000,
      modified: "2026-05-01T00:00:00.000Z",
      checksum: "sha256:" + "b".repeat(64),
      fileType: "markdown" as const,
      onlineOnly: false,
      misplacedSource: false,
      ...extras,
    },
    textLength: 0,
    textError: null,
  });

  it("ruling 4: never falls back to Planner on body text alone", () => {
    const c = classify(entryFor("Household_Notes.md"), {
      text: "You should plan ahead. A good plan matters. Planning your plan is part of the plan.",
      raw: "",
      meta: {},
    });
    expect(c.inferred.resourceType.value).not.toBe("planner");
    expect(c.reviewFlags).toContain("TYPE_REVIEW");
    expect(c.status).toBe("NEEDS_REVIEW");
  });

  it("ruling 4: keeps Planner when the name says so", () => {
    const c = classify(entryFor("OG-19_Battery_Backup_Planner.md"), { text: "Battery backup planner for outages.", raw: "", meta: {} });
    expect(c.inferred.resourceType.value).toBe("planner");
    expect(c.reviewFlags).not.toContain("TYPE_REVIEW");
  });

  it("ruling 1: business material in a narrowed source is internal, not a resource", () => {
    const c = classify(entryFor("Q3_Sales_Funnel_Plan.md", { narrowCandidacy: true }), {
      text: "Lead generation, ad copy and conversion rates for the campaign.",
      raw: "",
      meta: {},
    });
    expect(c.materialKind).toBe("internal");
    expect(c.status).toBe("NEEDS_REVIEW");
  });

  it("ruling 1: a numbered programme resource still qualifies in a narrowed source", () => {
    const c = classify(entryFor("OG-11_30Day_Pantry_Builder.md", { narrowCandidacy: true }), {
      text: "Pantry rotation, food storage and stock levels for the household.",
      raw: "",
      meta: {},
    });
    expect(c.materialKind).toBe("resource");
    expect(c.inferred.legacyCode.value).toBe("OG-11");
  });

  it("ruling 1: half-evidence is flagged for a person rather than filed either way", () => {
    const c = classify(entryFor("Water_Tank_Notes.md", { narrowCandidacy: true }), {
      text: "Rainwater tanks, litres, storage and filtration for drinking water. ".repeat(6),
      raw: "",
      meta: {},
    });
    expect(c.materialKind).toBe("internal");
    expect(c.reviewFlags).toContain("CANDIDACY_REVIEW");
  });

  it("ruling 3: a household-wide name does not stop the content deciding the foundation", () => {
    const c = classify(entryFor("Home_Resilience_Scorecard.md"), {
      text: "Rainwater tank sizing, litres per person, filtration, purification, storage containers and rotation. ".repeat(8),
      raw: "",
      meta: {},
    });
    expect(c.inferred.foundation.value).toBe("water");
    expect(c.inferred.foundation.confidence).not.toBe("LOW");
  });

  it("ruling 3: keeps General when the content really does span the foundations", () => {
    // One distinctive word per foundation, used equally often, so nothing leads.
    const c = classify(entryFor("Household_Readiness_Plan.md"), {
      text: "ventilation rainwater insulation pantry solar. ".repeat(10),
      raw: "",
      meta: {},
    });
    expect(c.inferred.foundation.value).toBe("general");
  });
});

describe("duplicate grouping", () => {
  const build = async () => {
    const { entries, texts } = await scanFixture();
    const candidates: Candidate[] = entries.map((e) => classify(e, (texts.get(e.candidateId) as TextBundle) ?? { text: "", raw: "", meta: {} }));
    const groups = groupDuplicates(candidates, texts as Map<string, TextBundle>);
    return { candidates, groups };
  };

  it("groups identical files as EXACT and deletes nothing", async () => {
    const { candidates, groups } = await build();
    const exact = groups.find((g) => g.kind === "EXACT");
    expect(exact).toBeDefined();
    expect(exact!.members).toHaveLength(2);
    expect(candidates.every((c) => fs.existsSync(c.source.path))).toBe(true); // nothing removed
  });

  it("groups same-name different-content files as version candidates", async () => {
    const { groups } = await build();
    const versions = groups.filter((g) => g.kind === "VERSION_CANDIDATE");
    expect(versions.length).toBeGreaterThan(0);
  });

  it("never picks a winner: every group is left for a person to decide", async () => {
    const { candidates } = await build();
    expect(candidates.every((c) => c.disposition === null)).toBe(true);
    expect(candidates.every((c) => c.importApproved === false)).toBe(true);
  });

  it("measures filename and text similarity sensibly", () => {
    expect(stringSimilarity("og 08 water storage calculator", "og 08 water storage calculator")).toBe(1);
    expect(stringSimilarity("water storage", "solar power")).toBeLessThan(0.3);
    // Needs at least 20 distinct long words on each side before it will offer an opinion at all.
    const a = `household resilience planning covers water storage rainwater tanks filters purification treatment
      generators solar panels batteries inverters lanterns torches candles heating cooking shelter draughts
      insulation windows doors pantry rotation preserving freezing supplies documents evacuation communication`;
    const b = `unrelated material about spreadsheet formatting invoice numbering payroll deductions quarterly
      reporting depreciation schedules ledger reconciliation auditing statements taxation compliance
      shareholder dividends amortisation valuation forecasting budgeting procurement contracts negotiation`;
    expect(textSimilarity(a, a)).toBe(1);
    expect(textSimilarity(a, b)).toBeLessThan(0.4);
    expect(textSimilarity("too short", "too short")).toBe(0); // no opinion without enough text
  });
});
