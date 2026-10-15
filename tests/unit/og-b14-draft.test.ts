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
 * Stage 10.27A — OG-B14 Local Support Network Planner: the rewrite draft (owner ruling: REWRITE BEFORE MIGRATION, privacy-minimised).
 *
 * Read from the committed review config (no private file needed, except where noted). The draft is NOT owner-approved copy, NOT rendered, NOT staged and NOT live, and it has no resource ID.
 */
const root = process.cwd();
const ac = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/approved-copy.json"), "utf8")) as { changes: Record<string, { where: string; from: string; to: string }[]> }).changes["OG-B14"];
const meta = (JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/metadata-review.json"), "utf8")) as { resources: Record<string, Record<string, unknown>> }).resources["OG-B14"];
const pc = JSON.parse(fs.readFileSync(path.join(root, "admin-import/config/program-components.json"), "utf8")) as { classificationsDecided: Record<string, string> };
const content = ac.find((c) => c.where === "Planner content (rebuilt)")!;
const allNew = ac.map((c) => c.to).join("\n");
const newText = memberFacingText(`<div class="content">${allNew}</div>`);
const sentences = newText.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
const PRIV = "Use a first name or a role where you can, and leave out home addresses, property details and private circumstances.";
const text = newText.replace(PRIV, " ").replace(/OffGrid056/g, "OffGrid").replace(/Household Contacts Sheet/g, "Live Title A").replace(/Household Responsibility Roster/g, "Live Title B").replace(/Emergency Readiness Checklist/g, "Live Title C");

describe("Stage 10.27A · OG-B14 locked metadata", () => {
  it("is the owner's rewritten planner: general / resilience-planning / planning / worksheet, beginner, 30 minutes, draft, in no collection", () => {
    expect(meta).toMatchObject({ title: "Local Support Network Planner", foundation: "general", programComponent: "resilience-planning", category: "planning", resourceType: "worksheet", difficulty: "beginner", estimatedTime: 30, recordStatus: "draft", collections: [], tags: [], proposedSlug: "local-support-network-planner" });
    expect(pc.classificationsDecided["OG-B14"]).toBe("resilience-planning");
    expect(PROGRAM_COMPONENTS).toContain("resilience-planning");
    expect(COLLECTION_IDS).toContain("planning-tools");
    expect(String(meta.collectionsStatus)).toMatch(/Planning Tools = NO/);
  });
  it("carries the owner's description exactly", () => {
    expect(meta.description).toBe("A practical worksheet to help your household identify trusted local support, record what you may be able to offer, and note where you may want help from others.");
    expect(String(meta.descriptionStatus)).toMatch(/^OWNER-APPROVED 2026-10-15 \(Stage 10\.27A\)/);
  });
  it("assigns no resource ID, creates no protected record, no PDF and no staged file; the suggested ID is recorded nowhere in config", () => {
    for (const f of ["admin-import/config/approved-copy.json", "admin-import/config/metadata-review.json", "admin-import/config/program-components.json", "admin-import/config/future-tasks.json"]) expect(fs.readFileSync(path.join(root, f), "utf8"), f).not.toContain("res-1514");
    const dir = path.join(root, "private-assets/data-resources");
    if (fs.existsSync(dir)) {
      const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { legacyCode: string; id: string; slug: string });
      expect(recs.filter((r) => r.legacyCode === "OG-B14" || r.id === "res-1514" || r.slug === "local-support-network-planner")).toEqual([]);
      expect(recs).toHaveLength(35);
    }
    const pdfs = path.join(root, "private-assets/resources");
    if (fs.existsSync(pdfs)) expect(fs.readdirSync(pdfs).filter((f) => /local-support-network-planner/.test(f))).toEqual([]);
    expect(String(meta.migrationState)).toMatch(/Migration state stays Not started/);
    expect(String(meta.coverStatus)).toMatch(/^OWNER-SUPPLIED 2026-10-15 \(Stage 10\.27B\)/);
    expect(String(meta.coverStatus)).toContain("OGB14_COVER_v1 — Local Support Network Planner");
    expect(String(meta.coverStatus)).toContain("961D42A7DB856DD92CA012952454E4F0464C015632B100B3CA2CC2963540C4E3");
    expect(String(meta.coverStatus)).toContain("C84AAC7CDAD7B380F4E25117E3641516DA5A1CE4FBCC2DA3F7E09E37A63D1B1A");
    expect(allNew).toContain('<img src="assets/local-support-network-planner-cover.png" class="cover-img"');
    expect((allNew.match(/<img /g) ?? []).length).toBe(1);
    expect(allNew.replace(/<style>[\s\S]*?<\/style>/, "")).not.toMatch(/Week4|Week 4 Cover|Cover\.jpg|OG30_|long-term-direction-planner-cover|household-contacts-sheet-cover/);
  });
  it("Stage 10.27B: the cover is distinct from the OG-30 and OG-B02 covers (prep images, when present)", async () => {
    const mine = path.join(root, "workspace/prep/OG-B14/assets/local-support-network-planner-cover.png");
    const others = [path.join(root, "workspace/prep/OG-30/assets/long-term-direction-planner-cover.png"), path.join(root, "workspace/prep/OG-B02/assets/household-contacts-sheet-cover.png")];
    if (![mine, ...others].every((f) => fs.existsSync(f))) return;
    const sharp = (await import("sharp")).default;
    const grey = async (f: string) => sharp(f).resize(64, 43, { fit: "fill" }).removeAlpha().greyscale().raw().toBuffer();
    const a = await grey(mine);
    for (const o of others) {
      const b = await grey(o);
      let d = 0; for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]);
      expect(d / a.length, path.basename(o)).toBeGreaterThan(25); // a re-encoded copy of the same picture differs by about 4; this cover differs by about 60 to 70
    }
  }, 30000);
  it("Stage 10.27B: the rendered NZ and AU PDFs in the git-ignored prep folder (when present) are the approved renders: 7 pages, exact title, one cover, identical body text", async () => {
    const dir = path.join(root, "workspace/prep/OG-B14");
    const nz = path.join(dir, "local-support-network-planner.NZ.pdf"), au = path.join(dir, "local-support-network-planner.AU.pdf");
    if (!fs.existsSync(nz) || !fs.existsSync(au)) return;
    const { PDFParse } = await import("pdf-parse");
    const texts: string[] = [];
    for (const f of [nz, au]) {
      const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(f)) });
      const { pages = [] } = await parser.getText();
      expect(pages).toHaveLength(7);
      const per = pages.map((p: { text?: string }) => (p.text ?? "").replace(/\s+/g, " ").trim());
      expect((per[0].match(/Local Support Network Planner/g) ?? []).length).toBe(1);
      expect(per[0]).toContain("A calm, practical way to think about the local support around your household.");
      expect(per.join(" ")).not.toMatch(/OG-B14|Tier 4|Asset Map|Potential Needs|Relationship Status|\bUHF\b|\bHAM\b|annual drill|check-in time|500\s?m|not legal contracts|Rural Fire|Fire and Emergency/i);
      expect(per.join(" ")).not.toMatch(/Professional Support/);
      texts.push([per[1].slice(per[1].indexOf("What This Planner Is For")), ...per.slice(2, 6), per[6].slice(0, per[6].indexOf("Before you start"))].join(" | "));
    }
    expect(texts[0]).toBe(texts[1]);
  }, 30000);
  it("has the owner-approved four curated related links in the metadata order, with the exact canonical titles", () => {
    expect(meta.relatedResources).toEqual(["res-1502", "res-1028", "res-1006", "res-1024"]);
    const dir = path.join(root, "private-assets/data-resources");
    if (!fs.existsSync(dir)) return;
    const titles = new Map(fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => { const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string }; return [r.id, r.title] as const; }));
    expect((meta.relatedResources as string[]).map((id) => titles.get(id))).toEqual(["Household Contacts Sheet", "Household Responsibility Roster", "Emergency Readiness Checklist", "Professional Support Planner"]);
  });
  it("answers the five programme-alignment questions and carries the standing blocks only (the legacy fire-and-emergency topic is recorded REMOVED)", () => {
    const a = meta.programAlignment as Record<string, string>;
    for (const k of ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"]) expect(a[k]?.trim(), k).toBeTruthy();
    expect(meta.safetyBlocks).toEqual([]);
    expect(meta.approvedSafetyBlocks).toEqual([]);
    const d = meta.safetyTopicDispositions as Record<string, { disposition: string; approvedBy: string }>;
    expect(Object.keys(d)).toEqual(["fire-and-emergency"]);
    expect(d["fire-and-emergency"]).toMatchObject({ disposition: "REMOVED", approvedBy: "owner" });
  });
});

describe("Stage 10.27A · OG-B14: the engine and the slug", () => {
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
  const mk = (slug: string): [string, R] => [`${slug}.private.json`, { id: "res-hypothetical", slug, title: "Local Support Network Planner", foundation: "general", category: "planning", tags: [], relatedResources: meta.relatedResources as string[], isPlaceholder: false }];
  it.skipIf(!have)("the real engine gives exactly four 'Linked by us' cards and no automatic fill, in the approved order", () => {
    const out = JSON.parse(cards([...files, mk("local-support-network-planner")]).get("res-hypothetical")!) as [string, string][];
    expect(out).toEqual([["Linked by us", "res-1502"], ["Linked by us", "res-1028"], ["Linked by us", "res-1006"], ["Linked by us", "res-1024"]]);
  });
  it.skipIf(!have)("the slug local-support-network-planner changes the related cards on 0 existing pages (hard gate); the legacy-style control slug would change several", () => {
    const base = cards(files);
    const changed = (slug: string) => [...base].filter(([id, v]) => cards([...files, mk(slug)]).get(id) !== v).map(([id]) => id);
    expect(changed("local-support-network-planner")).toEqual([]);
    expect(changed("community-resilience-network-builder").length).toBeGreaterThan(0);
  });
  it("the other resources named in the draft are untouched: the demo placeholder res-0009 and the route policy", () => {
    const demo = JSON.parse(fs.readFileSync(path.join(root, "data/resources/household-contacts-template.json"), "utf8")) as Record<string, unknown>;
    expect(demo).toMatchObject({ id: "res-0009", slug: "household-contacts-template", isPlaceholder: true, updatedDate: "2026-09-19" });
    expect(Object.keys(policy.separateDemo).sort()).toEqual(["res-0007", "res-0013", "res-0015", "res-0016"]);
  });
});

describe("Stage 10.27A · OG-B14 draft copy: household-centred, privacy-minimised, market-neutral", () => {
  it("has no price, currency, percentage, figure, distance, duration, period, cadence or target count", () => {
    expect(scanPrices(content.to)).toEqual([]);
    expect(newText).not.toMatch(/[$€£]|\d\s?%|\/\s?\d/);
    expect([...text.matchAll(/\d+/g)].map((m) => m[0])).toEqual([]);
    expect(text).not.toMatch(/\b(?:hours?|days?|weeks?|months?|years?|yearly|daily|weekly|monthly|quarterly|annual(?:ly)?|indefinite|metres?|kilometres?|km|density)\b|walking distance/i);
  });
  it("is clean under every claim family, sentence by sentence", () => {
    for (const [name, fn] of [["survival", (s: string) => isSurvivalClaimSentence(s)], ["supply", (s: string) => supplyTargets(s).length > 0], ["emergency-period", (s: string) => emergencyPeriodTargets(s).length > 0], ["storage", (s: string) => storageDurationClaims(s).length > 0], ["target-label", (s: string) => targetLabelDurations(s).length > 0], ["payback", (s: string) => paybackNorms(s).length > 0], ["warranty", (s: string) => warrantyNorms(s).length > 0], ["payment", (s: string) => paymentNorms(s).length > 0], ["regulatory", (s: string) => regulatoryAssertions(s).length > 0], ["multiplier", (s: string) => multiplierClaims(s).length > 0], ["comparative", (s: string) => comparativePerformanceClaims(s).length > 0], ["outcome", (s: string) => outcomeClaims(s).length > 0], ["assurance", (s: string) => assuranceClaims(s).length > 0]] as const)
      expect(sentences.filter((s) => fn(s)), name).toEqual([]);
  });
  it("carries none of the legacy, third-party, security, radio, drill, agency, legal or absolute wording", () => {
    for (const re of [/OG-B?\d|res-\d{4}/, /Tier 4|Bonus|30[- ]Day|\bWeek\b|\bDay\b/i, /OFFGRID056\.COM|\/mnt\//i, /500\s?m|2\s?km|walking distance/i, /\bUHF\b|\bCB\b|\bHAM\b|frequenc|\bchannel\b|\bradio\b/, /\bdrills?\b|scenario|debrief|coordinator|participants|check-?in/i, /not legal|contracts?|mutual aid|agreements|(?<!formal )agreement/i, /civil defence|emergency management|fire and emergency|rural fire|\bpolice\b|\bcouncil\b|\bmarae\b|neighbourhood support|community patrol|medical centre|hardware|farm supply|\bvet\b|\bschool\b/i, /\baddress(?:es)?\b|\bstreet\b|\bassets?\b|equipment|supplies|\bstock\b|potential needs|vulnerab|medical|generator|\bfuel\b|livestock|access codes?|alarm|passwords?|security/i, /\b(?:legal|legally|illegal|unlawful|required|must|licensed|certified|registered|approved|inspection|consent|permit|permitted|regulations?|compliance|compliant|authority)\b/i, /guarantee|\bensures?\b|\balways\b|\bnever\b|fully supported|emergency-ready|\bsafe\b|\bsecure\b|protected|\bsurviv\w*|panic|urgent|no household is an island|will provide/i]) expect(text, String(re)).not.toMatch(re);
  });
  it("states the privacy limits once, in the member-facing note, and asks the member to record only what the other person has agreed to share", () => {
    expect((newText.match(/leave out home addresses, property details and private circumstances/g) ?? []).length).toBe(1);
    expect(newText).toContain("Only record contact details or personal information that the other person has agreed to share.");
    expect(newText).toContain("Keep your completed copy somewhere that suits your household.");
    expect(newText).toContain("it is not for recording sensitive information about other households");
  });
  it("teaches no technical or emergency action and raises no topic block", () => {
    expect(safetyExposureFor(newText)).toEqual([]);
    expect(allNew).not.toMatch(/data-block/);
  });
  it("is market-neutral: no agency, fixed emergency number or jurisdiction-specific term in the body", () => {
    expect(text).not.toMatch(/\b(NZ|New Zealand|Kiwi|Aotearoa|Australia\w*)\b|\b(111|000|112|106)\b|\bNEMA\b|\bSES\b|WorkSafe|\bABN\b|\bACN\b/i);
  });
});

describe("Stage 10.27A · OG-B14 draft copy: the owner's structure", () => {
  it("has the new title, chip, subtitle and strapline, and no legacy title or framing", () => {
    expect(allNew).toContain("Local Support<br>Network Planner");
    expect(allNew).toContain("General · Resilience Planning");
    expect(allNew).toContain("OffGrid056 Member Library");
    expect(allNew).toContain("A calm, practical way to think about the local support around your household.");
    expect(allNew).not.toMatch(/OG-B14|Tier 4|Community Resilience Network Builder|30-Day Programme|Week4|Week 4/i);
  });
  it("has the sections in the approved order", () => {
    const order = ["What This Planner Is For", "Our Household Support Priorities", "People & Roles We Already Know", "What Our Household Can Offer", "Where We May Want Help", "Local Groups & Services", "Gaps We Want to Work On", "Next Conversation or Connection", "Notes", "Where Next", "Where You Are Now"];
    let from = 0; const at: number[] = [];
    for (const o of order) { const p = newText.indexOf(o, from); at.push(p); if (p >= 0) from = p + o.length; }
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
  });
  it("has the member-centred priorities, optional-contact people table, offer, help-wanted, group, gap and next-connection fields", () => {
    for (const x of ["What kinds of support matter most to us:", "Where we already feel well connected:", "Where another trusted contact could help:", "Support we prefer to handle ourselves:", "What would make our local network more useful:", "Skills we may be comfortable sharing:", "Practical help we might be able to offer:", "Information or local knowledge we may be able to share:", "Times or situations when we may not be available:", "Boundaries we want to keep clear:", "Tasks we may want help thinking through:", "Skills we do not have:", "Support we may want to find locally:", "Questions we may need to ask:", "Situations where an extra trusted contact could help:", "Support area we want to strengthen:", "What is missing:", "Who or what we could look for:", "One small next step:", "Person, group or service we may contact:", "Why we want to connect:", "A question we want to ask:", "What we want to understand better:", "Our next step:", "Notes:"]) expect(newText).toContain(x);
    expect(newText).toMatch(/Name \/ role\s+How we know them\s+Type of support\s+Contact detail \(optional\)\s+Notes/);
    expect(newText).toMatch(/Organisation \/ role\s+Why it may be useful\s+Contact detail\s+Notes/);
    for (const k of ["Community group", "Local service", "Support organisation", "Local business", "Volunteer or community contact", "Other"]) expect(newText).toContain(k);
    expect(newText).toContain("This section is about your own household only.");
    expect(newText).toContain("nothing here is a promise");
  });
  it("has no neighbour address, other-household asset, vulnerability, potential-needs, radio, drill, distance or check-in field", () => {
    expect(newText).not.toMatch(/Address \/ Name|Key Assets|Potential Needs|Relationship Status|Contact Method|Radio|Drill|Proposed Drill|check-?in|physical message|500|walking distance/i);
  });
  it("points on in the approved order with exactly three printed rows and no Later or Professional Support row", () => {
    const next = newText.slice(newText.lastIndexOf("Where it fits"), newText.indexOf("Where You Are Now"));
    const order = ["Household Contacts Sheet", "Household Responsibility Roster", "Emergency Readiness Checklist"];
    const at = order.map((o) => next.indexOf(o));
    expect(at.every((p, i) => p >= 0 && (i === 0 || p > at[i - 1]))).toBe(true);
    expect(next).toMatch(/Before[\s\S]*Next[\s\S]*Also useful/);
    expect((next.match(/Also useful/g) ?? []).length).toBe(1);
    expect(next).not.toMatch(/\bLater\b|Professional Support/);
  });
  it("closes with a short summary of what the household now has, with no guarantee or readiness claim", () => {
    const closing = newText.slice(newText.lastIndexOf("Where You Are Now"));
    expect(closing).toContain("a clearer view of the local support around your household");
    expect(closing).not.toMatch(/ready|prepared|safe|secure|protected|guarantee|fully supported/i);
  });
  it("is concise: the body is within the 2,800 to 4,000 character target", () => {
    const body = newText.replace(/\s+/g, " ").trim();
    expect(body.length).toBeGreaterThan(2800);
    expect(body.length).toBeLessThan(4000);
  });
});
