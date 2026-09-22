/**
 * Group-A migration preparation (Stage 9.10B).
 *
 * Takes a resource through the same chain as the OG-02 pilot — re-skin, market resolution, safety blocks,
 * validation — and writes the result to `workspace/prep/`. **It deploys nothing and imports nothing.**
 *
 * The difference from the pilot is that the record is derived from the document itself rather than hand
 * written: title and description come out of the source HTML, so no member-facing copy is invented here. Where
 * a document does not carry a usable description, that is reported as something the owner must write, not
 * filled in with something plausible.
 */
import fs from "node:fs";
import path from "node:path";
import { keepSmallTablesTogether, reskinHtml, summariseChanges } from "../reskin/reskin";
import { resolveForMarket, publishable, type CoreResource, type MarketProfile, type SafetyBlock } from "../markets/resolve";
import { injectSafetyChecked } from "./run";
import { ResourceSchema } from "@/lib/content/schemas";
import { getFoundation } from "@/lib/content/taxonomy";
import type { ProgrammeItem } from "../audit/programme";
import { safetyTopicMentions } from "../audit/group-a";

/**
 * An owner-approved, resource-specific exemption from a block the topic detector requires. It holds only while
 * every mention of the topic in the member-facing text is one of `allowedMentions`: add any other mention — food
 * guidance to a resource exempted from the food block, say — and the block is required again.
 */
export interface SafetyExemption {
  block: string;
  reason: string;
  approvedBy: string;
  approvedOn: string;
  allowedMentions: string[];
}

/**
 * An owner-approved, resource-specific removal of one exact sentence from a shared block in one market, so a point
 * is not said twice (OG-20: the CO block's alarm sentence, already in the generator block). The shared block is not
 * changed. If the sentence is no longer in the block exactly once, the market is blocked rather than guessed at.
 */
export interface SafetyBlockTrim {
  block: string;
  market: string;
  removeSentence: string;
  reason: string;
  approvedBy: string;
  approvedOn: string;
}

/**
 * Fuels and appliances no approved guidance covers, in a resource's own text (the safety blocks are not part of it).
 * Each holds the resource in every market until NZ/AU guidance is researched and approved (owner rulings, Stage
 * 9.33–9.36):
 * - gas fuels (LPG, natural gas, biogas, dual-fuel) and gas appliances (gas heater, cooker, bottle, unflued heater…);
 * - diesel — the approved generator block covers petrol generators only.
 * There is no phrase exemption. An existing, reviewed mention is let through only by a FuelExemption recorded for that
 * one resource and that exact context (OG-15 and OG-26 name a gas heater in a list); any other mention still holds it.
 */
const FUEL_CHECKS: { code: string; pattern: RegExp; why: string }[] = [
  {
    code: "GAS_SAFETY_REQUIRED",
    pattern:
      /\b(LPG|LP gas|natural gas|biogas|gas[- ]powered|gas[- ]fuelled|gas[- ]fired|dual[- ]fuel|tri[- ]fuel|unflued|cabinet heaters?|gas[- ](heaters?|heating|appliances?|cookers?|cooktops?|hobs?|stoves?|ovens?|fires?|fireplaces?|bottles?|cylinders?|water heaters?|hot water|barbecues?|bbqs?|lamps?|lanterns?|burners?|rings?|fridges?|refrigerators?))\b/i,
    why: "no NZ/AU gas or LPG guidance is approved",
  },
  { code: "FUEL_GUIDANCE_REQUIRED", pattern: /\bdiesel\b/i, why: "the approved generator guidance covers petrol only" },
];

/** A reviewed, resource-specific exception for one exact piece of text (Stage 9.36 ruling 3). */
export interface FuelExemption {
  code: string;
  context: string;
  classification: string;
  reason: string;
  reviewedOn: string;
  approvalRef: string;
}

export function fuelSafetyFindings(html: string, exemptions: FuelExemption[] = []): string[] {
  const text = clean(html.replace(/<style[\s\S]*?<\/style>/gi, " "));
  return FUEL_CHECKS.flatMap(({ code, pattern, why }) => {
    let own = text;
    for (const e of exemptions.filter((x) => x.code === code)) {
      // Only the exact reviewed text, and only once: reworded or repeated, it is checked like anything else.
      if (own.split(e.context).length === 2) own = own.replace(e.context, " ");
    }
    const m = own.match(pattern);
    return m ? [`${code}: "${m[0]}" — ${why}`] : [];
  });
}

/** Whether an exemption still holds for this member-facing HTML, and what breaks it if not. */
export function exemptionHolds(exemption: SafetyExemption, html: string): { holds: boolean; unexpected: string[] } {
  let text = clean(html.replace(/<style[\s\S]*?<\/style>/gi, " "));
  for (const allowed of exemption.allowedMentions) text = text.split(allowed).join(" ");
  const unexpected = safetyTopicMentions(text, exemption.block);
  return { holds: unexpected.length === 0, unexpected };
}

export interface PrepResult {
  legacyCode: string;
  proposedResourceId: string;
  slug: string;
  title: string;
  description: string | null;
  descriptionSource: "cover subtitle" | "header line" | "MISSING — owner must write it";
  foundation: string | null;
  resourceType: string | null;

  reskin: { changes: string[]; warnings: string[] };
  branding: { legacyIssues: number; issues: string[] };
  terminology: { frameworkPhrase: number; barePillar: number; otherFindings: string[] };
  safety: {
    blocks: string[];
    exposure: string[];
    /** blocks the audit says this resource's topics require */
    required: string[];
    /** required blocks that are not in the resource: the resource cannot be published while any remain */
    missingRequired: string[];
    /** blocks inserted as proposals, awaiting owner approval for this resource */
    proposed: string[];
    /** owner-approved exemptions, and whether each still held in every market */
    exemptions: { block: string; reason: string; holds: boolean; unexpected: string[] }[];
    /** owner-approved, resource-scoped sentence removals, and whether each applied */
    trims: { block: string; market: string; reason: string; applied: boolean }[];
  };
  /** legacy programme, product and cross-reference text that may not belong in the current library */
  contentFlags: ContentFlag[];
  markets: { code: string; publishable: boolean; problems: string[]; emergencyNumber: string }[];
  validation: { ok: boolean; issues: string[] };
  importReadiness:
    /** everything approved and applied: only the final validation (verify-prep, build) stands before deployment */
    | "READY_AFTER_FINAL_VALIDATION"
    /** held until another resource it depends on is in the library */
    | "BLOCKED_BY_RESOURCE_DEPENDENCY"
    /** rendered with unapproved copy so the owner can review it; never deployable as it stands */
    | "PREVIEW_WITH_PROPOSED_COPY"
    | "NEEDS_OWNER_METADATA"
    | "NEEDS_OWNER_COPY"
    | "NEEDS_SAFETY_APPROVAL"
    | "NEEDS_CONTENT_REVIEW";
  /** owner-approved copy changes, and whether each was applied */
  copyChanges: CopyChangeResult[];
  estimatedTime: number | null;
  /** the library record's publication state — always "draft" out of prep */
  recordStatus: string;
  pdfTitle: string;
  blockedBy: { dependency: string; reason?: string } | null;
  relatedResources: string[];
  files: string[];
}

/** Platform and channel references that do not belong in a member library resource. */
const PLATFORM_REFERENCES = /\b(skool|facebook group|discord|patreon|whatsapp group|telegram)\b/gi;

const clean = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export type ContentFlagKind =
  | "day-complete"
  | "next-link"
  | "previous-link"
  | "programme-sequencing"
  | "product-name"
  | "platform-name"
  | "cross-reference"
  | "figure-needs-source"
  | "health-claim";

export interface ContentFlag {
  /** LEGACY_PROGRAMME_CONTEXT: made sense only inside the old linear programme or offer. NEEDS_SOURCE: a claim to verify. */
  code: "LEGACY_PROGRAMME_CONTEXT" | "NEEDS_SOURCE";
  kind: ContentFlagKind;
  text: string;
}

export interface LegacyTerms {
  productNames: string[];
  platformNames: string[];
}

/**
 * The audit notes when a SOURCE document teaches a hazardous topic without a warning ("covers stored drinking
 * water (6 mentions) with no potability and treatment warning"). A note is answered once the migrated resource
 * carries the safety block(s) for that topic — until then it holds the resource. Gas needs the gas-and-LPG
 * block, which has not been verified for NZ and AU, so a gas note cannot yet be answered.
 */
// Each rule lists the combinations of blocks that answer it; any one complete combination does. A resource that
// teaches generator use answers the generator note with the generator block (plus carbon monoxide); one that only
// mentions a generator in passing can still answer it with the generic outdoor-appliance block.
const NOTE_ANSWERED_BY: { topic: RegExp; anyOf: string[][] }[] = [
  { topic: /^covers generators\b/, anyOf: [["generator-safety", "carbon-monoxide"], ["indoor-combustion", "carbon-monoxide"]] },
  { topic: /^covers solid fuel heating\b/, anyOf: [["solid-fuel-heating"]] },
  { topic: /^covers gas appliances\b/, anyOf: [["gas-and-lpg"]] },
  { topic: /^covers batteries and inverters\b/, anyOf: [["batteries-and-electrical"]] },
  { topic: /^covers stored drinking water\b/, anyOf: [["stored-drinking-water"]] },
];

export function unansweredSafetyNotes(notes: string[], blocks: string[]): string[] {
  return notes.filter((note) => {
    const rule = NOTE_ANSWERED_BY.find((r) => r.topic.test(note));
    return !rule || !rule.anyOf.some((set) => set.every((b) => blocks.includes(b)));
  });
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Text that belonged to the 30-Day Programme or an old product, and may not survive into the current library.
 *
 * These are flags for the owner, not edits: some are teaching content in disguise ("Tier 1 (Essential)" is a
 * budget tier the member chose, not a product), so nothing here changes the document.
 */
const CONTENT_FLAG_PATTERNS: { code: ContentFlag["code"]; kind: ContentFlagKind; pattern: RegExp }[] = [
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "day-complete", pattern: /\bDay \d{1,2} Complete\b/g },
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "next-link", pattern: /\bNext:\s[^\n]+/g },
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "next-link", pattern: /\bTomorrow\b[^\n.]*/g },
  // A navigation label ("Previous: OG-13 …", "Back to OG-13"), not the word in ordinary use ("Previous reports").
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "previous-link", pattern: /\b(?:Previous|Back to)\s*:\s[^\n]*|\bBack to OG-B?\d{2}\b[^\n]*/g },
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "programme-sequencing", pattern: /\b(?:OffGrid056 )?30-Day Programme\b[^\n|]*/g },
  // The programme's week headings use a dash ("Week 4 — Action Plan & Pathway"). A colon is a resource's own
  // teaching structure ("Week 1: Learn" in a monthly template) and is not flagged.
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "programme-sequencing", pattern: /\bWeek \d\s*[—–]\s*[A-Z][^|\n]*/g },
  // The programme ran Day 1 to Day 30. A 90-day roadmap's own "Day 90 — retrospective" is the member's plan, not
  // programme sequencing, so higher day numbers are not flagged.
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "programme-sequencing", pattern: /\bDay (?:[1-9]|[12]\d|30)\s*[—–]\s*[^\n|]*/g },
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "programme-sequencing", pattern: /\bAsset OG-B?\d{2}[^\n]*/g },
  { code: "LEGACY_PROGRAMME_CONTEXT", kind: "programme-sequencing", pattern: /\bTier \d\b(?=[^\n]*(?:Bonus|Asset|member))|(?:Bonus Asset|Asset)\s*\|\s*Tier \d/g },
  { code: "NEEDS_SOURCE", kind: "figure-needs-source", pattern: /[^\n.]*\b\d+(?:[–-]\d+)?\s?(?:%|°C)[^\n.]*/g },
  { code: "NEEDS_SOURCE", kind: "health-claim", pattern: /[^\n.]*\b(?:hypothermia|survival)\b[^\n.]*/gi },
];

const DEFAULT_LEGACY_TERMS: LegacyTerms = { productNames: ["Action Plan Plus", "Bonus Asset"], platformNames: ["Skool"] };

/** Visible text of a document, one line per block element. */
export function visibleText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<(br|\/p|\/div|\/h\d|\/li|\/tr|\/td|\/th)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rarr;/g, "→")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

export function findContentFlags(html: string, ownCode: string, terms: LegacyTerms = DEFAULT_LEGACY_TERMS): ContentFlag[] {
  const text = visibleText(html);
  const flags: ContentFlag[] = [];
  const seen = new Set<string>();
  const add = (code: ContentFlag["code"], kind: ContentFlagKind, raw: string) => {
    const t = raw.trim();
    const key = `${kind}|${t}`;
    if (t && !seen.has(key)) {
      seen.add(key);
      flags.push({ code, kind, text: t });
    }
  };
  for (const { code, kind, pattern } of CONTENT_FLAG_PATTERNS) {
    for (const m of text.matchAll(pattern)) {
      // A bare "100%" is a table's total row (the "% of Budget" column sums to it), not a claim to source.
      if (kind === "figure-needs-source" && /^100\s?%$/.test(m[0].trim())) continue;
      add(code, kind, m[0]);
    }
  }
  // Old offer and platform names, from config so the owner can extend the list without a code change.
  for (const [kind, names] of [["product-name", terms.productNames], ["platform-name", terms.platformNames]] as const) {
    for (const name of names) {
      for (const m of text.matchAll(new RegExp(`[^\\n]*\\b${escape(name)}\\b[^\\n]*`, "gi"))) add("LEGACY_PROGRAMME_CONTEXT", kind, m[0]);
    }
  }
  // References to other programme resources, which may not exist in the library.
  for (const m of text.matchAll(/\bOG-B?\d{2}\b/g)) if (m[0] !== ownCode) add("LEGACY_PROGRAMME_CONTEXT", "cross-reference", m[0]);
  return flags;
}

/**
 * Some covers print the programme code in the title ("OG-25 Project Support Brief Template"). The code belongs
 * in `legacyCode`, not in the member-facing title or the slug, so it is stripped here.
 */
const stripCode = (title: string) => title.replace(/^OG[-_ ]?B?\d{2,3}\s*[-–—:]?\s*/i, "").trim();

/**
 * Title and description, taken from the document.
 *
 * Two layouts exist in the programme: day resources have a cover page with a title and subtitle, and the
 * bonus templates have a plain header with a heading and one line beneath it. Both are read; neither is
 * invented.
 */
export function describeFromHtml(html: string): { title: string | null; description: string | null; source: PrepResult["descriptionSource"] } {
  const coverTitle = html.match(/class="cover-title">([\s\S]*?)<\/h1>/)?.[1];
  const coverSubtitle = html.match(/class="cover-subtitle">([\s\S]*?)<\/p>/)?.[1];
  if (coverTitle && coverSubtitle) {
    return { title: stripCode(clean(coverTitle.replace(/<br\s*\/?>/g, " "))), description: clean(coverSubtitle), source: "cover subtitle" };
  }

  const headerTitle = html.match(/<div class="header">[\s\S]*?<h1>([\s\S]*?)<\/h1>/)?.[1];
  const headerLine = html.match(/<div class="header">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/)?.[1];
  if (headerTitle) {
    // "OffGrid056 Skool Community | Reusable monthly challenge framework" — the useful half is after the pipe.
    const afterPipe = headerLine?.includes("|") ? headerLine.split("|").pop() : headerLine;
    const description = afterPipe ? clean(afterPipe) : null;
    return { title: stripCode(clean(headerTitle)), description, source: description ? "header line" : "MISSING — owner must write it" };
  }

  return { title: null, description: null, source: "MISSING — owner must write it" };
}

const slugify = (title: string) =>
  title.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** An owner-approved change to a resource's wording, recorded in config/approved-copy.json. */
export interface ApprovedCopyChange {
  where: string;
  from: string;
  to: string;
  expectedMatches: number;
  approvedBy: string;
  approvedOn: string;
  reason: string;
  /** markets this change applies to; omitted means every market (a genuine market variant sets this) */
  markets?: string[];
}

export interface CopyChangeResult {
  where: string;
  from: string;
  to: string;
  matched: number;
  applied: boolean;
  /** markets the change applies to; absent means all */
  markets?: string[];
  /** true when the change is an unapproved proposal rendered for review only */
  proposed?: boolean;
}

/**
 * Apply approved copy changes to the migrated HTML — never to the source.
 *
 * A change is applied only when it matches exactly as many times as the owner approved. If the source has
 * drifted (the sentence was edited, or now appears twice), the change is refused and reported, because
 * applying it anyway would put approved-looking wording somewhere nobody approved it.
 */
export function applyCopyChanges(html: string, changes: ApprovedCopyChange[]): { html: string; results: CopyChangeResult[] } {
  let out = html;
  const results: CopyChangeResult[] = [];
  for (const c of changes) {
    const matched = out.split(c.from).length - 1;
    const applied = matched === c.expectedMatches;
    if (applied) out = out.split(c.from).join(c.to);
    results.push({ where: c.where, from: c.from, to: c.to, matched, applied, ...(c.markets ? { markets: c.markets } : {}) });
  }
  return { html: out, results };
}

export interface PrepInputs {
  item: ProgrammeItem;
  sourceHtml: string;
  blocks: Record<string, SafetyBlock>;
  markets: MarketProfile[];
  launchMarkets: string[];
  outDir: string;
  /** owner-approved wording changes for this resource, if any */
  copyChanges?: ApprovedCopyChange[];
  /** owner-reviewed estimate in minutes; null means "not supported by the document — leave unset" */
  estimatedTime?: number | null;
  /** owner-reviewed difficulty; null means "no source support and no owner decision yet" */
  difficulty?: string | null;
  /** reviewed foundation, type and category. Without one, only a HIGH-confidence audit value is used. */
  foundation?: string | null;
  resourceType?: string | null;
  category?: string | null;
  /** topic safety blocks beyond the disclaimer and emergency block */
  extraSafetyBlocks?: string[];
  /** blocks this resource's topics require (from the Group-A analysis) */
  requiredSafety?: string[];
  /** ids of blocks whose wording is still a proposal */
  proposedBlockIds?: string[];
  /** old product and platform names to flag (config/legacy-terms.json) */
  legacyTerms?: LegacyTerms;
  /** an owner-approved library description, replacing the one read from the document */
  description?: string | null;
  /** an owner-specified PDF title (the title bar); defaults to "<title> — OffGrid056". Never carries a legacy code. */
  pdfTitle?: string | null;
  /** unapproved copy changes, rendered only so the owner can review the result; they hold the resource */
  proposedCopy?: ApprovedCopyChange[];
  /** library links to resources this one depends on or leads to (ids; each must exist in the same build) */
  relatedResources?: string[];
  /** another resource this one cannot be published without */
  blockedBy?: { dependency: string; reason?: string } | null;
  /** owner-approved exemptions from detector-required blocks, for this resource only */
  safetyExemptions?: SafetyExemption[];
  /** owner-approved removals of a duplicated sentence from a shared block, for this resource only */
  safetyBlockTrims?: SafetyBlockTrim[];
  /** reviewed exceptions to the fuel checks, for this resource and exact context only */
  fuelExemptions?: FuelExemption[];
}

export function prepareResource(inputs: PrepInputs): PrepResult {
  const { item, sourceHtml, blocks, markets, launchMarkets, outDir, copyChanges = [] } = inputs;
  const proposedCopy = inputs.proposedCopy ?? [];

  // 1. re-skin (brand + terminology, context-aware), then copy changes. Changes without `markets` apply to every
  //    market here; market-specific ones (a genuine market variant) are applied per market below. Proposed changes
  //    are applied after approved ones and marked, so a preview can be reviewed but never mistaken for approved.
  const skinned = reskinHtml(sourceHtml, { strapline: "Prepare • Adapt • Thrive" });
  const { changes, warnings } = skinned;
  const shared = (list: ApprovedCopyChange[]) => list.filter((c) => !c.markets?.length);
  const approvedShared = applyCopyChanges(skinned.html, shared(copyChanges));
  const proposedShared = applyCopyChanges(approvedShared.html, shared(proposedCopy));
  const copy = {
    html: proposedShared.html,
    results: [...approvedShared.results, ...proposedShared.results.map((r) => ({ ...r, proposed: true }))],
  };

  // 2. what the document says about itself
  const described = describeFromHtml(sourceHtml);
  // An owner-approved description replaces the document's own, which may carry legacy text ("Day 25 — …").
  const description = inputs.description ?? described.description;
  const title = described.title ?? item.title;
  const slug = slugify(title);

  // The <title> becomes the PDF's title bar. Owner standard (2026-09-22): "<Resource Title> — OffGrid056", never
  // the legacy code ("OG-15 Warm Home Scorecard — OffGrid056"), which stays in `legacyCode`.
  const pdfTitle = inputs.pdfTitle ?? `${title} — OffGrid056`;
  const titleTag = `<title>${escapeHtml(pdfTitle)}</title>`;
  // Replace the source's title, or add one: a document without <title> prints with no title at all.
  const reskinned = /<title>[\s\S]*?<\/title>/i.test(copy.html)
    ? copy.html.replace(/<title>[\s\S]*?<\/title>/i, titleTag)
    : copy.html.replace(/<head>/i, `<head>${titleTag}`);

  // 3. terminology beyond the framework phrase — checked on the MIGRATED html, so an approved copy change that
  //    removed a reference clears it, while anything still left in the member-facing document is still caught.
  const otherFindings: string[] = [];
  for (const m of new Set(reskinned.match(PLATFORM_REFERENCES) ?? [])) {
    otherFindings.push(`references "${m}" — a platform outside the member library; confirm before publishing`);
  }
  const unapplied = (r: CopyChangeResult) =>
    `${r.proposed ? "proposed" : "approved"} copy change (${r.where}${r.markets ? ` · ${r.markets.join("/")}` : ""}) was NOT applied: expected the original wording, found it ${r.matched} time(s)`;
  for (const r of copy.results.filter((x) => !x.applied)) otherFindings.push(unapplied(r));
  // Flags are collected from every market's final text below, so a market-only change clears its own flags only.
  const flagSeen = new Set<string>();
  const contentFlags: ContentFlag[] = [];
  const collectFlags = (html: string) => {
    for (const f of findContentFlags(html, item.legacyCode, inputs.legacyTerms)) {
      const key = `${f.kind}|${f.text}`;
      if (!flagSeen.has(key)) {
        flagSeen.add(key);
        contentFlags.push(f);
      }
    }
  };

  // 4. market resolution, with the standard blocks plus this resource's topic blocks
  const safetyBlocks = ["general-disclaimer", "emergency-contact", ...(inputs.extraSafetyBlocks ?? [])];
  const requiredSafety = inputs.requiredSafety ?? [];
  const lacking = requiredSafety.filter((b) => !safetyBlocks.includes(b));
  // An exemption is checked against each market's final wording; a block stays required wherever it fails.
  const exemptions = (inputs.safetyExemptions ?? []).filter((e) => lacking.includes(e.block));
  const exemptionResults = new Map(exemptions.map((e) => [e.block, { block: e.block, reason: e.reason, holds: true, unexpected: [] as string[] }]));
  const missing = new Set(launchMarkets.length ? [] : lacking);
  const trims: PrepResult["safety"]["trims"] = [];
  const proposed = safetyBlocks.filter((b) => (inputs.proposedBlockIds ?? []).includes(b));
  const resource: CoreResource = {
    id: item.proposedResourceId,
    legacyCode: item.legacyCode,
    slug,
    title,
    description: description ?? "",
    body: "",
    safetyBlocks,
  };

  fs.mkdirSync(outDir, { recursive: true });
  const files: string[] = [];
  const marketResults: PrepResult["markets"] = [];

  for (const code of launchMarkets) {
    const profile = markets.find((m) => m.code === code);
    if (!profile) continue;
    const resolved = resolveForMarket(resource, profile, blocks);
    const trimProblems: string[] = [];
    for (const t of (inputs.safetyBlockTrims ?? []).filter((x) => x.market === code)) {
      const s = resolved.safety.find((b) => b.id === t.block);
      const found = s ? s.body.split(t.removeSentence).length - 1 : 0;
      if (s && found === 1) s.body = s.body.replace(t.removeSentence, "").replace(/ {2,}/g, " ").replace(/ +\n/g, "\n").replace(/\n +/g, "\n").trim();
      else trimProblems.push(`scoped trim of "${t.block}" (${code}) could not be applied: the sentence is in the block ${found} time(s) — check the shared wording`);
      trims.push({ block: t.block, market: code, reason: t.reason, applied: !!s && found === 1 });
    }
    const gate = publishable(resolved, ["emergency-contact"]);
    // This market's own wording: approved market changes, then proposed ones.
    const forMarket = (list: ApprovedCopyChange[]) => list.filter((c) => c.markets?.includes(code));
    const approvedMarket = applyCopyChanges(reskinned, forMarket(copyChanges));
    const proposedMarket = applyCopyChanges(approvedMarket.html, forMarket(proposedCopy));
    const marketResultsCopy = [...approvedMarket.results, ...proposedMarket.results.map((r) => ({ ...r, proposed: true }))];
    copy.results.push(...marketResultsCopy);
    for (const r of marketResultsCopy.filter((x) => !x.applied)) otherFindings.push(unapplied(r));
    // Print layout that edits markup runs only after every copy change, so no approved change is disturbed.
    const marketHtml = keepSmallTablesTogether(proposedMarket.html);
    collectFlags(marketHtml);
    // Checked on the resource's own text, before the safety blocks go in (the CO block names LPG heaters).
    const fuelFindings = fuelSafetyFindings(marketHtml, inputs.fuelExemptions ?? []);
    for (const finding of fuelFindings) if (!otherFindings.includes(finding)) otherFindings.push(finding);
    const marketMissing = lacking.filter((b) => {
      const exemption = exemptions.find((e) => e.block === b);
      if (!exemption) return true;
      const check = exemptionHolds(exemption, marketHtml);
      const result = exemptionResults.get(b)!;
      result.holds &&= check.holds;
      result.unexpected.push(...check.unexpected.filter((u) => !result.unexpected.includes(u)));
      return !check.holds;
    });
    for (const b of marketMissing) missing.add(b);
    const injected = injectSafetyChecked(
      marketHtml,
      resolved.safety.map((s) => ({ id: s.id, title: s.title, body: s.body, severity: s.severity })),
    );
    const withSafety = injected.html;
    // A safety block that could not be placed is a blocker, not a warning: the member would never see it.
    const unplaced = [
      ...trimProblems,
      ...fuelFindings,
      ...injected.unplaced.map((id) => `safety block "${id}" could not be placed in this layout`),
      // A topic the resource teaches without its safety block is a blocker in every market.
      ...marketMissing.map((id) =>
        exemptionResults.has(id)
          ? `safety block "${id}" is required again: the exemption no longer holds (new mention: ${exemptionResults.get(id)!.unexpected.join(", ")})`
          : `safety block "${id}" is required by this resource's topics but not included`,
      ),
    ];
    const file = path.join(outDir, `${slug}.${code}.html`);
    fs.writeFileSync(file, withSafety, "utf8");
    files.push(file);
    marketResults.push({
      code,
      publishable: gate.ok && unplaced.length === 0,
      problems: [...gate.problems, ...unplaced],
      emergencyNumber: profile.emergency.number,
    });
  }

  const missingRequired = [...missing];

  // 5. validation against the real library schema
  // No fallbacks. A reviewed value wins; otherwise only a HIGH-confidence audit inference is used; otherwise the
  // field is left out, validation fails, and the resource waits for the owner. A silent "general", "planner"
  // or first-category default would put a resource somewhere nobody decided.
  const foundation = inputs.foundation ?? (item.foundation.confidence === "HIGH" ? item.foundation.value : null);
  const resourceType = inputs.resourceType ?? (item.resourceType.confidence === "HIGH" ? item.resourceType.value : null);
  const category = inputs.category ?? null;
  const record: Record<string, unknown> = {
    id: item.proposedResourceId,
    slug,
    legacyCode: item.legacyCode,
    title,
    description: description ?? "",
    learningObjectives: [],
    ...(foundation ? { foundation } : {}),
    ...(category ? { category } : {}),
    ...(resourceType ? { resourceType } : {}),
    // Never defaulted. A silent "beginner" is how a resource titled "(Advanced)" was once mislabelled. Only a
    // reviewed value is used; without one the field is left out and validation fails on purpose.
    ...(inputs.difficulty ? { difficulty: inputs.difficulty } : {}),
    // Only an owner-reviewed estimate is used. When the document does not support one, the field is left out,
    // validation fails on purpose, and the resource cannot be imported until someone decides.
    ...(typeof inputs.estimatedTime === "number" ? { estimatedTime: inputs.estimatedTime } : {}),
    tags: [],
    featured: false,
    premium: false,
    isPlaceholder: false,
    status: "draft",
    downloadable: true,
    fileUrl: `/resources/${slug}.pdf`,
    fileFormat: "PDF",
    publishedDate: new Date().toISOString().slice(0, 10),
    relatedResources: inputs.relatedResources ?? [],
    completionAvailable: true,
  };
  const parsed = ResourceSchema.safeParse(record);
  const categoryIssues =
    foundation && category && !getFoundation(foundation as never)?.categories.some((c) => c.slug === category)
      ? [`category: "${category}" is not a category of the ${foundation} foundation`]
      : [];

  // 6. readiness
  const legacyIssues = item.legacyIssues.map((i) => i.issue);
  // Every approved copy change must have applied; one that did not is already an `otherFindings` blocker.
  // A resource that depends on another, not-yet-published resource is held whatever else is true of it.
  const importReadiness: PrepResult["importReadiness"] = inputs.blockedBy
    ? "BLOCKED_BY_RESOURCE_DEPENDENCY"
    : copy.results.some((r) => r.proposed) || (inputs.safetyBlockTrims ?? []).some((t) => t.approvedBy !== "owner")
    ? "PREVIEW_WITH_PROPOSED_COPY"
    : !description
    ? "NEEDS_OWNER_COPY"
    : otherFindings.length || unansweredSafetyNotes(item.safetyNotes, safetyBlocks).length || contentFlags.length || missingRequired.length
      ? "NEEDS_CONTENT_REVIEW"
      : proposed.length
        ? "NEEDS_SAFETY_APPROVAL"
      : !parsed.success || categoryIssues.length || typeof inputs.estimatedTime !== "number" || !inputs.difficulty
        ? "NEEDS_OWNER_METADATA"
        : "READY_AFTER_FINAL_VALIDATION";

  return {
    legacyCode: item.legacyCode,
    proposedResourceId: item.proposedResourceId,
    slug,
    title,
    description,
    descriptionSource: described.source,
    foundation,
    resourceType,
    reskin: { changes: summariseChanges(changes), warnings },
    branding: { legacyIssues: legacyIssues.length, issues: legacyIssues },
    terminology: { frameworkPhrase: item.legacyTerminology.length, barePillar: 0, otherFindings },
    safety: { blocks: resource.safetyBlocks, exposure: item.safetyNotes, required: requiredSafety, missingRequired, proposed, exemptions: [...exemptionResults.values()], trims },
    contentFlags,
    markets: marketResults,
    validation: {
      ok: parsed.success && categoryIssues.length === 0,
      issues: [
        ...(parsed.success ? [] : parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)),
        ...categoryIssues,
      ],
    },
    importReadiness,
    copyChanges: copy.results,
    estimatedTime: typeof inputs.estimatedTime === "number" ? inputs.estimatedTime : null,
    recordStatus: String(record.status),
    pdfTitle,
    blockedBy: inputs.blockedBy ?? null,
    relatedResources: inputs.relatedResources ?? [],
    files,
  };
}
