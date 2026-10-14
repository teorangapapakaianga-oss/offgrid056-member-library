import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanPrices } from "@/admin-import/audit/price";
import { assuranceClaims, comparativePerformanceClaims, emergencyPeriodTargets, isSurvivalClaimSentence, multiplierClaims, outcomeClaims, paybackNorms, paymentNorms, regulatoryAssertions, storageDurationClaims, supplyTargets, targetLabelDurations, warrantyNorms } from "@/admin-import/audit/numeric";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { memberFacingText } from "@/admin-import/pilot/prep";
import { COLLECTION_IDS, PROGRAM_COMPONENTS } from "@/lib/content/constants";
import { relatedResources } from "@/lib/related";
import type { ResourceSummary } from "@/lib/content/summaries";

/**
 * Stage 10.24A — OG-B02 Household Contacts Sheet: the rewrite draft (owner ruling: REWRITE BEFORE MIGRATION).
 *
 * Read from the committed review config (no private file needed, except where noted). The draft is NOT owner-approved copy, NOT rendered, NOT staged and NOT live, and it has no resource ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-B02"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-B02"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Sheet content (rebuilt)")!;
const allNew = content.to;
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const PRIV = "This sheet does not ask for account numbers, policy numbers, passwords or access codes.";
const text = newText.replace(PRIV, " ").replace(/OffGrid056/g, "OffGrid").replace(/Emergency Readiness Checklist/g, "Live Title A").replace(/Water, Food and Air Household Snapshot/g, "Live Title B").replace(/Household Responsibility Roster/g, "Live Title C");

describe("Stage 10.24A · OG-B02 locked metadata", () => {
  it("is the owner's rewritten sheet: general / resilience-emergency / planning / worksheet, beginner, 20 minutes, draft, in no collection", () => {
    expect(meta).toMatchObject({ title: "Household Contacts Sheet", foundation: "general", programComponent: "resilience-emergency", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 20, recordStatus: "draft", collections: [], tags: [], proposedSlug: "household-contacts-sheet" });
    expect(pc.classificationsDecided["OG-B02"]).toBe("resilience-emergency");
    expect(PROGRAM_COMPONENTS).toContain("resilience-emergency");
    expect(COLLECTION_IDS).toContain("planning-tools");
    expect(String(meta.collectionsStatus)).toMatch(/Planning Tools = NO/);
  });
  it("carries the owner's description exactly, with the curly apostrophe", () => {
    expect(meta.description).toBe("A practical worksheet to keep your household’s key contact details together so they are easier to find when routines are disrupted.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-14 \(Stage 10\.24A\)/);
  });
  it("assigns no resource ID, creates no protected record, no PDF and no staged file; the suggested ID is recorded nowhere", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1502");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string; slug: string });
      expect(recs.filter((r) => r.legacyCode === "OG-B02" || r.id === "res-1502" || r.slug === "household-contacts-sheet")).toEqual([]);
      expect(recs).toHaveLength(34);
    }
    const pdfs = path.join(root, "private-assets/resources");
    if (fs.existsSync(pdfs)) expect(fs.readdirSync(pdfs).filter((f) => /household-contacts-sheet/.test(f))).toEqual([]);
    expect(String(meta.migrationState)).toMatch(/Migration state stays Not started/);
    expect(String(meta.coverStatus)).toMatch(/^PENDING/);
    expect(String(meta.coverStatus)).toContain("OGB02_COVER_v1 — Household Contacts Sheet");
    expect(String(meta.coverStatus)).toContain("OGB02_Household-Contacts-Sheet_Cover_v1.png");
    expect(allNew).not.toMatch(/<img /);
  });
  it("has the owner-approved four curated related links in the metadata order, with the exact canonical titles", () => {
    expect(meta.relatedResources).toEqual(["res-1006", "res-1014", "res-1028", "res-1024"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Emergency Readiness Checklist", "Water, Food and Air Household Snapshot", "Household Responsibility Roster", "Professional Support Planner"]);
  });
  it("answers the five programme-alignment questions and carries the standing blocks only", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    expect(meta.safetyTopicDispositions).toEqual({});
  });
});

describe("Stage 10.24A · OG-B02: the engine, the slug and the demo placeholder", () => {
  const dir = path.join(root, "private-assets/data-resources");
  type R = { id: string; slug: string; title: string; foundation: string; category: string; tags: string[]; relatedResources: string[]; learningPath?: string; isPlaceholder: boolean };
  const have = fs.existsSync(dir);
  const files: [string, R][] = [];
  if (have) {
    for (const f of fs.readdirSync(path.join(root, "data/resources")).filter((x) => x.endsWith(".json"))) files.push([f, JSON.parse(fs.readFileSync(path.join(root, "data/resources", f), "utf8")) as R]);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".private.json"))) files.push([f, { tags: [], isPlaceholder: false, ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) } as R]);
  }
  const policy = JSON.parse(fs.readFileSync(path.join(root, "lib/content/route-policy.json"), "utf8")) as { separateDemo: Record<string, string> };
  const unlisted = new Set(Object.keys(policy.separateDemo));
  const summary = (r: R) => ({ id: r.id, slug: r.slug, title: r.title, foundation: r.foundation, category: r.category, tags: r.tags ?? [], isPlaceholder: r.isPlaceholder }) as unknown as ResourceSummary;
  const cards = (entries: [string, R][]) => {
    const resources = [...entries].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([, r]) => r);
    const listed = resources.filter((r) => !unlisted.has(r.id)).map(summary);
    const out = new Map<string, string>();
    for (const r of resources) {
      const named = new Set(r.relatedResources);
      const all = [...listed, ...resources.filter((x) => named.has(x.id) && !listed.some((l) => l.id === x.id)).map(summary)];
      const cur = { id: r.id, foundation: r.foundation, category: r.category, tags: r.tags ?? [], learningPath: r.learningPath, relatedResources: r.relatedResources };
      out.set(r.id, JSON.stringify(relatedResources({ current: cur, all }).map((c) => [c.reason, c.resource.id])));
    }
    return out;
  };
  const mk = (slug: string): [string, R] => [`${slug}.private.json`, { id: "res-hypothetical", slug, title: "Household Contacts Sheet", foundation: "general", category: "planning", tags: [], relatedResources: meta.relatedResources as string[], isPlaceholder: false }];
  it.skipIf(!have)("the real engine gives exactly four 'Linked by us' cards and no automatic fill, in the approved order", () => {
    const out = JSON.parse(cards([...files, mk("household-contacts-sheet")]).get("res-hypothetical")!) as [string, string][];
    expect(out).toEqual([["Linked by us", "res-1006"], ["Linked by us", "res-1014"], ["Linked by us", "res-1028"], ["Linked by us", "res-1024"]]);
  });
  it.skipIf(!have)("the slug household-contacts-sheet changes the related cards on 0 existing pages (hard gate); the control slug emergency-contacts-sheet would change several", () => {
    const base = cards(files);
    const changed = (slug: string) => [...base].filter(([id, v]) => cards([...files, mk(slug)]).get(id) !== v).map(([id]) => id);
    expect(changed("household-contacts-sheet")).toEqual([]);
    expect(changed("emergency-contacts-sheet").length).toBeGreaterThan(0);
  });
  it("the demo placeholder res-0009 Household Contacts Template is unchanged and still a demo entry, and the route policy is untouched", () => {
    const demo = JSON.parse(fs.readFileSync(path.join(root, "data/resources/household-contacts-template.json"), "utf8")) as Record<string, unknown>;
    expect(demo).toMatchObject({ id: "res-0009", slug: "household-contacts-template", title: "Household Contacts Template", resourceType: "template", estimatedTime: 10, isPlaceholder: true, status: "published", collections: ["planning-tools"], relatedResources: [], fileUrl: "/resources/general/household-contacts-template.pdf", updatedDate: "2026-09-19" });
    expect(Object.keys(policy.separateDemo).sort()).toEqual(["res-0007", "res-0013", "res-0015", "res-0016"]);
    expect(fs.readFileSync(path.join(root, "lib/content/route-policy.json"), "utf8")).not.toContain("res-0009");
  });
});

describe("Stage 10.24A · OG-B02 draft copy: contacts only, privacy-minimised, market-neutral", () => {
  it("has no price, currency, percentage, figure, duration, period or fixed cadence (no yearly, no 12 months)", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect([...text.matchAll(/\d+/g)].map((m) => m[0])).toEqual([]);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?|yearly|daily|weekly|monthly|quarterly|annual(?:ly)?|indefinite)\b/i);
    expect(text).not.toMatch(/12 months/i);
  });
  it("is clean under every claim family, sentence by sentence", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("carries none of the legacy, privacy-risk, medical, kit, agency, legal or absolute wording", () => {
    for (const re of [/Week\b|\bDay\b/, /30[- ]Day/i, /\bOG-\d|\bOG-B\d|res-\d{4}/, /OFFGRID056\.COM|\/mnt\//i, /Civil Defence|\bpolice\b|\bNEMA\b|\bSES\b|emergency management|council|WorkSafe/i, /policy number|account number|\bmeter\b|passwords?\b|access codes?|alarm|lockbox|gate code|login|credential|security (?:answer|question)/i, /medical conditions?|allerg|medications?|dosage|diagnos|prescription|treatment/i, /emergency kit|torch|batter|first aid|water storage|pantry|rally point/i, /\b(?:legal|legally|illegal|unlawful|required|must|licensed|certified|registered|approved|inspection|consent|permit|permitted|regulations?|compliance|compliant|authority)\b/i, /guarantee|\bensures?\b|\balways\b|\bnever\b|ready for anything|fully prepared|emergency-ready|\bsafe\b|protected|\bsurviv\w*|panic|urgent/i, /\b(?:111|000|112|911|106)\b/]) expect(text, String(re)).not.toMatch(re);
  });
  it("states the privacy limits once, in the member-facing note, and asks for no account, policy, password or access-code detail", () => {
    expect((newText.match(/does not ask for account numbers, policy numbers, passwords or access codes/g) ?? []).length).toBe(1);
    expect(newText).toContain("A completed sheet may include personal information");
    expect(newText).toContain("it does not replace emergency-service or professional advice");
  });
  it("teaches no technical or emergency action and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
    expect(allNew).not.toMatch(/data-block/);
  });
  it("is market-neutral: no agency, fixed emergency number or jurisdiction-specific term in the body", () => {
    expect(text).not.toMatch(/\b(NZ|New Zealand|Kiwi|Aotearoa|Australia\w*)\b|\b(111|000|112|106)\b|\bNEMA\b|\bSES\b|WorkSafe|\bABN\b|\bACN\b/i);
  });
});

describe("Stage 10.24A · OG-B02 draft copy: the owner's structure", () => {
  it("has the new title, chip, subtitle and strapline, and no legacy title or footer", () => {
    expect(allNew).toContain("Household Contacts<br>Sheet");
    expect(allNew).toContain("General · Resilience Emergency");
    expect(allNew).toContain("OffGrid056 Member Library");
    expect(allNew).toContain("Prepare • Adapt • Thrive");
    expect(allNew).toContain("A calm, simple place to keep your household’s key contact details together.");
    expect(allNew).not.toMatch(/OG-B02|Emergency Contacts &|Info Sheet|OFFGRID056\.COM|UPDATE THIS SHEET/i);
    expect(ac.find((c) => c.where === "Page title")!.to).toBe("<title>Household Contacts Sheet — OffGrid056</title>");
  });
  it("has the sections in the approved order", () => {
    const order = ["About This Sheet", "Our Household", "People We Can Contact", "Health & Support Contacts", "Home & Essential Service Contacts", "Other Useful Contacts", "Where We Keep Important Information", "Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has exactly the six household fields, with the address optional and nothing mandatory or sensitive", () => {
    for (const l of ["Household name or reference:", "Household address (optional):", "Main household contact:", "Main household contact phone:", "Backup household contact:", "Backup household contact phone:"]) expect(newText).toContain(l);
    expect((newText.match(/Household address/g) ?? []).length).toBe(1);
    expect(newText).not.toMatch(/Household address:|date of birth|ownership|identification|ID number/i);
  });
  it("has the people table, the contact-only health rows with the two open prompts, the service rows, other contacts and location-only prompts", () => {
    expect(newText).toMatch(/Name\s+Relationship \/ role\s+Phone\s+Other contact detail\s+Notes/);
    for (const x of ["Health clinic or medical practice", "Pharmacy", "Other support contact", "Who should be told about important health information?", "Where does our household keep important health information?", "Electricity or energy provider", "Water contact or provider (if relevant)", "Internet or communications provider", "Property manager or landlord (if relevant)", "Insurer contact", "Trusted trades or service contact", "Where we keep important household documents:", "Where we keep health information:", "Where we keep insurance information:", "Where we keep other useful household information:", "Notes:"]) expect(newText).toContain(x);
    expect(newText).toContain("This section records who to contact. It does not need any health details.");
    expect(newText).toContain("Write down where things are kept, not what they say.");
  });
  it("removes the Emergency Kit Location section entirely", () => {
    expect(newText).not.toMatch(/Emergency Kit|Water Storage|Food \/ Pantry|Torches|First Aid Kit|Radio \/ Communication/i);
  });
  it("points on in the approved order with exactly three printed rows and no Later or Professional Support row", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"), newText.indexOf("Where You Are Now"));
    const order = ["Emergency Readiness Checklist", "Water, Food and Air Household Snapshot", "Household Responsibility Roster"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toMatch(/Before[\s\S]*Next[\s\S]*Also useful/);
    expect((next.match(/Also useful/g) ?? []).length).toBe(1);
    expect(next).not.toMatch(/\bLater\b|Professional Support/);
  });
  it("closes with a short summary of what the household now has, with no guarantee or readiness claim", () => {
    const closing = newText.slice(newText.lastIndexOf("Where You Are Now"));
    expect(closing).toContain("key contacts gathered together");
    expect(closing).not.toMatch(/ready|prepared|safe|protected|guarantee|complete(?:d)? yourself/i);
  });
  it("is concise: the body is within the 2,000 to 3,200 character target", () => {
    const body = newText.replace(/\s+/g, " ").trim();
    expect(body.length).toBeGreaterThan(2000);
    expect(body.length).toBeLessThan(3200);
  });
});
