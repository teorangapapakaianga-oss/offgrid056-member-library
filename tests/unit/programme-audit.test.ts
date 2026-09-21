import { describe, expect, it } from "vitest";
import { auditProgramme, proposedResourceId } from "@/admin-import/audit/programme";
import type { Candidate, DuplicateGroup } from "@/admin-import/types";

/**
 * Stage 9.5 is an audit: it reads and reports. These tests pin the judgements the report makes, especially the
 * ones where being wrong would send someone to change something they should not.
 */
function file(code: string, type: "pdf" | "html", id: string, extra: Partial<Candidate> = {}): Candidate {
  return {
    candidateId: id,
    source: {
      path: `C:\\programme\\${type === "pdf" ? "PDFs" : "HTML_Source"}\\${code}_Thing.${type}`,
      folder: `C:\\programme\\${type === "pdf" ? "PDFs" : "HTML_Source"}`,
      sourceLabel: "30-Day Programme",
      filename: `${code}_Thing.${type}`,
      extension: `.${type}`,
      sizeBytes: 1024,
      modified: "2026-05-01T00:00:00.000Z",
      checksum: `sha256:${id}`,
      fileType: type,
      onlineOnly: false,
      misplacedSource: false,
    },
    textLength: 500,
    textError: null,
    status: "CLASSIFIED",
    materialKind: "resource",
    reviewFlags: [],
    inferred: {
      title: { value: `${code} Thing`, confidence: "HIGH", evidence: [] },
      resourceType: { value: "worksheet", confidence: "HIGH", evidence: ["fixture"] },
      foundation: { value: "water", confidence: "HIGH", evidence: ["fixture"] },
      secondaryFoundations: [],
      category: { value: "water-storage", confidence: "HIGH", evidence: [] },
      legacyCode: { value: code, confidence: "HIGH", evidence: [] },
      estimatedTime: { value: 10, confidence: "MEDIUM", evidence: [] },
      difficulty: { value: "beginner", confidence: "MEDIUM", evidence: [] },
      tags: [],
    },
    legacyBranding: false,
    legacyIssues: [],
    migrationActions: [],
    duplicateGroup: null,
    duplicateKind: null,
    duplicateOf: [],
    pairedWith: null,
    contentMismatch: false,
    disposition: null,
    importNotes: "",
    importApproved: false,
    importedAt: null,
    ...extra,
  };
}

const pairFor = (code: string) => [file(code, "pdf", `${code}-pdf`), file(code, "html", `${code}-html`)];

const run = (candidates: Candidate[], texts: Record<string, string> = {}, groups: DuplicateGroup[] = []) =>
  auditProgramme(candidates, texts, groups);

describe("proposed resource ids", () => {
  it("keeps OG codes out of the permanent id, in the library's own format", () => {
    expect(proposedResourceId("OG-01")).toBe("res-1001");
    expect(proposedResourceId("OG-30")).toBe("res-1030");
    expect(proposedResourceId("OG-B01")).toBe("res-1501");
    expect(proposedResourceId("OG-B15")).toBe("res-1515");
  });

  it("gives every code a unique id, with core and bonus ranges apart", () => {
    const codes = [...Array(30)].map((_, i) => `OG-${String(i + 1).padStart(2, "0")}`).concat([...Array(15)].map((_, i) => `OG-B${String(i + 1).padStart(2, "0")}`));
    const ids = codes.map(proposedResourceId);
    expect(new Set(ids).size).toBe(45);
    for (const id of ids) expect(id).toMatch(/^res-\d{4}$/);
  });
});

describe("inventory", () => {
  it("separates core days from bonus resources", () => {
    const a = run([...pairFor("OG-01"), ...pairFor("OG-B01")]);
    expect(a.totals.core).toBe(1);
    expect(a.totals.bonus).toBe(1);
    expect(a.items.find((i) => i.legacyCode === "OG-B01")!.kind).toBe("bonus");
  });

  it("derives the day from the core numbering, and prefers what the document says", () => {
    const a = run(pairFor("OG-08"), { "OG-08-pdf": "Asset OG-08 | Day 12 water storage" });
    expect(a.items[0].day).toBe(12); // the document wins over the numbering

    const b = run(pairFor("OG-08"));
    expect(b.items[0].day).toBe(8);
  });

  it("reports missing days rather than renumbering around them", () => {
    const a = run([...pairFor("OG-01"), ...pairFor("OG-03")]);
    expect(a.dayGaps).toContain(2);
    expect(a.dayGaps).not.toContain(1);
  });

  it("takes its metadata from the PDF, the member-facing artefact", () => {
    const [pdf, html] = pairFor("OG-08");
    html.inferred.foundation = { value: "energy", confidence: "HIGH", evidence: ["the html disagrees"] };
    const a = run([pdf, html]);
    expect(a.items[0].foundation.value).toBe("water");
    expect(a.items[0].pairStatus).toBe("pair");
  });

  it("notices when a resource has no re-skin source or no member artefact", () => {
    const a = run([file("OG-01", "pdf", "a"), file("OG-02", "html", "b")]);
    const pdfOnly = a.items.find((i) => i.legacyCode === "OG-01")!;
    const htmlOnly = a.items.find((i) => i.legacyCode === "OG-02")!;
    expect(pdfOnly.pairStatus).toBe("pdf only");
    expect(pdfOnly.reskinGroup).toBe("C");
    expect(htmlOnly.readiness).toBe("NEEDS_OWNER_DECISION");
  });
});

describe("terminology", () => {
  it("treats the framework's old name as safe to replace", () => {
    const a = run(pairFor("OG-05"), { "OG-05-pdf": "The 5 Pillars Quick Reference explains the 5 Pillars." });
    const finding = a.terminology.find((t) => t.term.includes("5 Pillars"))!;
    expect(finding.safeToReplace).toBe(true);
    expect(finding.proposal).toContain("Five Foundations");
    expect(finding.hits).toBe(2);
  });

  it("refuses to promise a safe swap for a bare 'pillar' where buildings are discussed", () => {
    const a = run(pairFor("OG-15"), { "OG-15-pdf": "Check the pillars, piles and bearers under the subfloor for rot." });
    const finding = a.terminology.find((t) => t.term.includes("on its own"))!;
    expect(finding.safeToReplace).toBe(false);
    expect(finding.why).toMatch(/building structure/);
    expect(a.items[0].legacyTerminology.join(" ")).toMatch(/check each/);
  });

  it("flags country-specific references as market variants, not as terminology to fix", () => {
    const a = run(pairFor("OG-18"), { "OG-18-pdf": "EECA grants and the Healthy Homes standard apply. Civil Defence advises this." });
    const labels = a.terminology.map((t) => t.term);
    expect(labels).toContain("EECA");
    expect(labels).toContain("Healthy Homes");
    expect(labels).toContain("Civil Defence");
    for (const t of a.terminology.filter((x) => ["EECA", "Healthy Homes", "Civil Defence"].includes(x.term))) {
      expect(t.safeToReplace).toBe(false);
    }
  });

  it("does not mistake a thousands separator for an emergency number", () => {
    const a = run(pairFor("OG-08"), { "OG-08-pdf": "Store 1,000 litres of water. A 2,000 litre tank costs $3,000." });
    expect(a.terminology.some((t) => t.term.includes("emergency"))).toBe(false);
    expect(a.contentGaps.some((g) => g.gap.includes("No emergency number"))).toBe(true);
  });

  it("recognises a real emergency instruction", () => {
    const a = run(pairFor("OG-06"), { "OG-06-pdf": "In a serious emergency, call 111 immediately." });
    expect(a.contentGaps.some((g) => g.gap.includes("No emergency number"))).toBe(false);
  });
});

describe("safety gaps", () => {
  it("ignores a passing mention", () => {
    const a = run(pairFor("OG-01"), { "OG-01-pdf": "Tick the box if you own a generator." });
    expect(a.items[0].safetyNotes).toHaveLength(0);
  });

  it("flags a topic that is actually taught but carries no warning", () => {
    const a = run(pairFor("OG-19"), {
      "OG-19-pdf": "A generator needs fuel. Size the generator for the load. Start the generator monthly. Store generator fuel safely.",
    });
    expect(a.items[0].safetyNotes.join(" ")).toMatch(/generators.*carbon monoxide/);
    expect(a.items[0].reskinGroup).toBe("B");
  });

  it("is satisfied when the warning is present", () => {
    const a = run(pairFor("OG-19"), {
      "OG-19-pdf": "A generator needs fuel. Size the generator. Never run a generator indoors: carbon monoxide kills.",
    });
    expect(a.items[0].safetyNotes).toHaveLength(0);
  });
});

describe("migration groups and readiness", () => {
  it("puts colour-and-font-only problems in group A", () => {
    const [pdf, html] = pairFor("OG-20");
    pdf.legacyIssues = [{ issue: "legacy navy #1A2332", evidence: "colour appears" }];
    const a = run([pdf, html], { "OG-20-pdf": "Plain copy with nothing else wrong." });
    expect(a.items[0].reskinGroup).toBe("A");
    expect(a.items[0].readiness).toBe("READY_AFTER_RESKIN");
  });

  it("puts copy problems in group B ahead of brand-only ones", () => {
    const [pdf, html] = pairFor("OG-21");
    pdf.legacyIssues = [{ issue: "legacy navy #1A2332", evidence: "colour appears" }];
    const a = run([pdf, html], { "OG-21-pdf": "This covers the 5 Pillars framework." });
    expect(a.items[0].reskinGroup).toBe("B");
    expect(a.items[0].readiness).toBe("NEEDS_CONTENT_REVIEW");
  });

  it("sends a disagreeing pair to the owner rather than choosing", () => {
    const [pdf, html] = pairFor("OG-22");
    pdf.contentMismatch = true;
    const a = run([pdf, html]);
    expect(a.items[0].reskinGroup).toBe("C");
    expect(a.items[0].readiness).toBe("NEEDS_OWNER_DECISION");
  });

  it("never marks anything ready to import", () => {
    const a = run([...pairFor("OG-01"), ...pairFor("OG-02")], {});
    for (const item of a.items) {
      expect(item.readiness).not.toBe("READY_TO_IMPORT");
    }
    expect(Object.keys(a.readiness)).not.toContain("READY_TO_IMPORT");
  });
});

describe("duplicate recommendations", () => {
  it("recommends keeping both halves of a clean pair", () => {
    const groups: DuplicateGroup[] = [
      { groupId: "dup-001", kind: "VERSION_CANDIDATE", members: ["OG-08-pdf", "OG-08-html"], reason: "pair", pdfHtmlPair: true, autoResolved: true },
    ];
    const a = run(pairFor("OG-08"), {}, groups);
    expect(a.duplicateGroups[0].recommendation).toBe("KEEP");
  });

  it("recommends archiving byte-identical copies, never deleting", () => {
    const groups: DuplicateGroup[] = [
      { groupId: "dup-002", kind: "EXACT", members: ["OG-08-pdf", "OG-08-html"], reason: "identical" },
    ];
    const a = run(pairFor("OG-08"), {}, groups);
    expect(a.duplicateGroups[0].recommendation).toBe("ARCHIVE");
    expect(a.duplicateGroups[0].why).toMatch(/nothing is deleted/i);
  });
});
