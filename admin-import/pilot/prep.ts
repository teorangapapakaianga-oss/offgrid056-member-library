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
import { resolveForMarket, publishable, type CoreResource, type MarketCode, type MarketProfile, type SafetyBlock } from "../markets/resolve";
import { injectSafetyChecked, SAFETY_NOTES_MARKER } from "./run";
import { ResourceSchema } from "@/lib/content/schemas";
import { getFoundation } from "@/lib/content/taxonomy";
import type { ProgrammeItem } from "../audit/programme";
import { fireTeachingSignals, safetyExposureFor, safetyTopicMentions, treatmentTeachingSignals } from "../audit/group-a";
import { isRegisteredClaim, treatmentFindings, type TreatmentRegistry } from "../audit/treatment";
import { numericBlockingFindings, type NumericRegistry } from "../audit/numeric";
import { priceFindings, type PriceCandidate, type PriceRecord } from "../audit/price";

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
    // Stage 9.57 added: propane, butane, mains/reticulated gas, patio heater, camping stove/cooker, flued gas,
    // gas leak/meter/line/fitting, and the two cylinder valve types. Stage 9.56's detector audit found every one of
    // them invisible here — "patio heater" most sharply, because the approved indoor-combustion block names it
    // while a resource could write it and pass. Still compound-only: a bare "cylinder" or "regulator" would catch
    // OG-10's tanks and OG-19's electrical gear, and "gas supply" is narrative (the OG-17 pattern).
    //
    // "gasfitter" is deliberately NOT here, though it IS a gas-teaching signal for the topic detector. Telling a
    // member to use a licensed gasfitter is the one piece of gas wording that is already approved, universal
    // across all eight Australian jurisdictions and New Zealand, and printed in the general disclaimer on all 20
    // live resources. Blocking on it would make the library's own standing safety sentence a blocker.
    pattern:
      /\b(LPG|LP gas|natural gas|mains gas|reticulated gas|biogas|propane|butane|gas[- ]powered|gas[- ]fuelled|gas[- ]fired|dual[- ]fuel|tri[- ]fuel|unflued|(?:un)?flued gas|cabinet heaters?|patio heaters?|camping (?:stoves?|cookers?)|LCC27|POL valves?|gas[- ](heaters?|heating|appliances?|cookers?|cooktops?|hobs?|stoves?|ovens?|fires?|fireplaces?|bottles?|cylinders?|water heaters?|hot water|barbecues?|bbqs?|lamps?|lanterns?|burners?|rings?|fridges?|refrigerators?|leaks?|meters?|lines?|fittings?))\b/i,
    why: "no NZ/AU gas or LPG guidance is approved",
  },
  { code: "FUEL_GUIDANCE_REQUIRED", pattern: /\bdiesel\b/i, why: "the approved generator guidance covers petrol only" },
];

/**
 * Gas teaching → the SET of blocks it needs (Stage 9.62A owner ruling).
 *
 * The general block is the floor under every gas topic, and it is NOT enough on its own: it does not satisfy
 * cylinder, unflued-heater, leak-response or installation teaching. Each specific topic needs the general block AND
 * its own. Detection comes first; the set follows from what was detected; every block in the set must then be
 * available for the market. Nothing is inferred backwards from a block being present.
 */
export const GAS_BLOCK_SET: Record<string, string[]> = {
  "gas-and-lpg": ["gas-and-lpg-general"],
  "unflued-gas-heating": ["gas-and-lpg-general", "unflued-gas-heating"],
  "gas-cylinder-safety": ["gas-and-lpg-general", "gas-cylinder-safety"],
  "gas-leak-response": ["gas-and-lpg-general", "gas-leak-response"],
  "gas-installation-and-servicing": ["gas-and-lpg-general", "gas-installation-and-servicing"],
};

/** The union of the sets for the detected gas topics. A gas FUEL finding with no detected topic is generic gas teaching. */
export function requiredGasBlocks(detectedTopics: string[], gasFuelFinding: boolean): string[] {
  const topics = detectedTopics.filter((t) => t in GAS_BLOCK_SET);
  if (gasFuelFinding && topics.length === 0) topics.push("gas-and-lpg");
  return [...new Set(topics.flatMap((t) => GAS_BLOCK_SET[t]))];
}

/**
 * Whether one gas block can be relied on in a market. It must be carried, be a real block, not be a proposal in this
 * resource, not be pending owner approval for the market, and have its OWN wording for that market. A block with no
 * market body resolves to the unverified sentinel and so fails closed; a pending block never satisfies anything.
 */
export function gasBlockAvailability(
  id: string,
  market: string,
  blocks: Record<string, SafetyBlock>,
  carried: string[],
  proposed: string[],
): { available: boolean; reason?: string } {
  const block = blocks[id];
  if (!block) return { available: false, reason: "no such block exists" };
  if (!carried.includes(id)) return { available: false, reason: "not carried by this resource" };
  if (proposed.includes(id)) return { available: false, reason: "wording is still a proposal for this resource" };
  if ((block.pendingOwnerApproval ?? []).includes(market as MarketCode)) {
    return { available: false, reason: `wording is built but PENDING OWNER APPROVAL for ${market}` };
  }
  if (!block.marketBody?.[market as MarketCode]?.trim()) {
    return { available: false, reason: `no verified ${market} wording: the block FAILS CLOSED in ${market}` };
  }
  return { available: true };
}

/**
 * What happened to a safety topic that the legacy source taught and the migrated resource does not (Stage 9.58).
 *
 * The architecture ruling is that the **migrated member-facing output** is what safety enforcement reads, because
 * a member cannot be endangered by a sentence they will never see. The cost of that ruling is that teaching could
 * disappear without anyone noticing, so the balancing rule is this record: a topic may leave, but somebody has to
 * say why.
 */
export type SafetyTopicDispositionKind =
  | "REMOVED"
  | "REWRITTEN"
  | "REPLACED_BY_BLOCK"
  | "NON_TEACHING_CONTEXT"
  | "OWNER_APPROVED_REMOVAL";

export interface SafetyTopicDisposition {
  disposition: SafetyTopicDispositionKind;
  reason: string;
  approvedBy?: string;
  approvedOn?: string;
}

/** A reviewed, resource-specific exception for one exact piece of text (Stage 9.36 ruling 3). */
export interface FuelExemption {
  code: string;
  context: string;
  classification: string;
  reason: string;
  reviewedOn: string;
  approvalRef: string;
}

/** The five questions every migrated resource must answer before it is rendered (Stage 9.64B). */
export const PROGRAM_ALIGNMENT_KEYS = ["foundation", "programComponent", "resilienceRole", "guidanceKind", "wordingMatchesRole"] as const;

/** Whether a resource has what the programme-alignment rule asks of it. Fail closed: an unanswered question is a gap. */
export function programAlignmentGaps(inputs: { programComponent?: string | null; programAlignment?: Partial<Record<string, string>> | null }): string[] {
  const gaps: string[] = [];
  if (!inputs.programComponent) gaps.push("no programme component assigned");
  for (const key of PROGRAM_ALIGNMENT_KEYS) if (!inputs.programAlignment?.[key]?.trim()) gaps.push(`alignment question unanswered: ${key}`);
  return gaps;
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

/**
 * Whether an exemption still holds for this member-facing HTML, and what breaks it if not.
 *
 * Two things break it. A mention of the topic that the owner did not review — the general rule — and, for the
 * water-treatment block, any sign that the resource has started *teaching* treatment: an efficacy claim, a dose, a
 * boil time, a rating, a method comparison (Stage 9.43 ruling 9). The second test exists because treatment teaching
 * can be written without ever using one of the topic words: "the cartridge removes bacteria" names no method.
 */
export function exemptionHolds(exemption: SafetyExemption, html: string): { holds: boolean; unexpected: string[] } {
  const full = clean(html.replace(/<style[\s\S]*?<\/style>/gi, " "));
  let text = full;
  for (const allowed of exemption.allowedMentions) text = text.split(allowed).join(" ");
  const unexpected = safetyTopicMentions(text, exemption.block);
  if (exemption.block === "water-treatment") {
    for (const signal of treatmentTeachingSignals(text)) unexpected.push(`teaches treatment: "${signal}"`);
  }
  // The same rule for fire: an exemption that covers hazard *labels* must lapse on fire *instructions*, including
  // ones that never use the word ("plan two exits", "defensible space"). The ambiguous ones are judged against the
  // document as a whole — including the reviewed labels — so "escape routes" in a document that never mentions fire
  // stays an access instruction, while the same words beside "Fire in the home" are fire-escape teaching.
  if (exemption.block === "fire-and-emergency") {
    for (const signal of fireTeachingSignals(text, full)) unexpected.push(`teaches fire safety: "${signal}"`);
  }
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
  /** the programme component (Stage 9.64B), or null when none was assigned */
  programComponent: string | null;

  reskin: { changes: string[]; warnings: string[] };
  branding: { legacyIssues: number; issues: string[] };
  terminology: { frameworkPhrase: number; barePillar: number; otherFindings: string[] };
  safety: {
    blocks: string[];
    exposure: string[];
    /** safety topics detected in the LEGACY SOURCE — migration evidence, not the enforcement target */
    sourceTopics: string[];
    /** safety topics detected in the MIGRATED member-facing output — what enforcement actually reads */
    outputTopics: string[];
    /** legacy topics the migrated text no longer teaches, and what happened to each */
    removedTopics: {
      topic: string;
      market: string;
      accounted: boolean;
      disposition?: SafetyTopicDispositionKind;
      reason?: string;
      approvedBy?: string;
      approvedOn?: string;
    }[];
    /** blocks this resource's migrated output requires (plus any unaccounted removal) */
    required: string[];
    /** required blocks that are not in the resource: the resource cannot be published while any remain */
    missingRequired: string[];
    /** blocks inserted as proposals, awaiting owner approval for this resource */
    proposed: string[];
    /** owner-approved exemptions, and whether each still held in every market */
    exemptions: { block: string; reason: string; holds: boolean; unexpected: string[] }[];
    /** owner-approved, resource-scoped sentence removals, and whether each applied */
    trims: { block: string; market: string; reason: string; applied: boolean }[];
    /** Gas/LPG teaching → the required block set per market, and which blocks of it are unavailable (Stage 9.62A) */
    gas: { market: string; topics: string[]; required: string[]; unavailable: { id: string; reason: string }[] }[];
  };
  /**
   * Prices (Stage 9.61). `inOutput` is what the member-facing text carries and what each disposition is;
   * `legacyOnly` is what the legacy source carried and migration removed — evidence, never blocking.
   */
  prices: {
    inOutput: (PriceCandidate & { market: string; disposition?: PriceRecord["disposition"] })[];
    legacyOnly: PriceCandidate[];
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
const NOTE_ANSWERED_BY: { topic: RegExp; block: string; anyOf: string[][] }[] = [
  { topic: /^covers generators\b/, block: "generator-safety", anyOf: [["generator-safety", "carbon-monoxide"], ["indoor-combustion", "carbon-monoxide"]] },
  { topic: /^covers solid fuel heating\b/, block: "solid-fuel-heating", anyOf: [["solid-fuel-heating"]] },
  // The note reads "…with no ventilation and certified-installer warning", so it needs both the general gas block
  // and the installation block. `gas-and-lpg-general` answers the detector's `gas-and-lpg` through `answers`.
  { topic: /^covers gas appliances\b/, block: "gas-and-lpg", anyOf: [["gas-and-lpg-general", "gas-installation-and-servicing"]] },
  { topic: /^covers batteries and inverters\b/, block: "batteries-and-electrical", anyOf: [["batteries-and-electrical"]] },
  { topic: /^covers stored drinking water\b/, block: "stored-drinking-water", anyOf: [["stored-drinking-water"]] },
];

/**
 * Audit notes the migrated resource has not answered.
 *
 * A note says what the SOURCE document taught without a warning, so it is the same kind of evidence as
 * `sourceSafetyTopics` and Stage 9.58's ruling applies to it too: pass `outputTopics` and a note about a topic the
 * member-facing text no longer teaches is answered. It cannot let anything through — a topic the output DOES teach
 * is in `requiredSafety`, and a removal nobody has accounted for fails the market before this is reached.
 *
 * Omitting `outputTopics` keeps the original behaviour, so existing callers and tests are unaffected.
 */
export function unansweredSafetyNotes(notes: string[], blocks: string[], outputTopics?: string[]): string[] {
  return notes.filter((note) => {
    const rule = NOTE_ANSWERED_BY.find((r) => r.topic.test(note));
    if (!rule) return true;
    if (rule.anyOf.some((set) => set.every((b) => blocks.includes(b)))) return false;
    return !outputTopics || outputTopics.includes(rule.block);
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

/**
 * The member-facing text, as the safety topic detectors need to read it: **one line per table ROW**, not per cell.
 *
 * `visibleText` ends a line at every `</td>`, which is right for flagging legacy copy but wrong here. The gas rule
 * built at Stage 9.57 recognises a comparison table by an appliance sitting beside a price — "Flued gas |
 * $1,500–$4,000 | 80–90%" — and it deliberately refuses to look across a line break, because PDF-extracted text
 * puts unrelated rows next to each other. Split cell by cell, that row becomes four lines and the appliance never
 * meets its figure, so the table teaching that Stage 9.57 proved on the audit's text would have been invisible on
 * the migrated output this stage makes the enforcement target. Rows still end a line, so nothing bleeds between
 * them.
 */
export function memberFacingText(html: string): string {
  return visibleText(html.replace(/<\/(td|th)>/gi, " "));
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
  /** programme component (Stage 9.64B): off-grid-living | resilience-planning | resilience-emergency | planning-implementation | advanced-future */
  programComponent?: string | null;
  /**
   * The five alignment answers every migration must give BEFORE rendering (Stage 9.64B): which foundation, which
   * component, how it supports resilience / independence / off-grid living, what KIND of guidance it is, and whether the
   * wording matches that role. When `programComponentRequired` is set, a missing component or an incomplete answer holds
   * the resource at NEEDS_OWNER_METADATA.
   */
  programAlignment?: Partial<Record<(typeof PROGRAM_ALIGNMENT_KEYS)[number], string>> | null;
  programComponentRequired?: boolean;
  /**
   * Owner-approved placement of the TOPIC safety blocks (Stage 9.68A). "safety-notes" puts them at the resource's own
   * labelled Safety Notes marker instead of before the content; unset keeps the default. The emergency block and the
   * disclaimer never move. A resource that asks for it but whose copy lacks the marker is flagged, and its blocks are
   * placed by default — never dropped.
   */
  safetyBlockPlacement?: "safety-notes" | null;
  category?: string | null;
  /** topic safety blocks beyond the disclaimer and emergency block */
  extraSafetyBlocks?: string[];
  /**
   * Safety topics detected in the **legacy source** (the audit's extracted PDF + HTML text).
   *
   * This is migration evidence, not the enforcement target. Until Stage 9.58 it was both, which meant a resource
   * could be held for a safety block because of a sentence that migration had already removed — the member-facing
   * file said nothing about the topic, and nothing in the pipeline noticed. What it is used for now is removal
   * accountability: every topic here that is NOT in the migrated output has to be accounted for.
   */
  sourceSafetyTopics?: string[];
  /** @deprecated Stage 9.58 renamed this to `sourceSafetyTopics`. Accepted so existing callers keep working. */
  requiredSafety?: string[];
  /**
   * How a legacy safety topic that no longer appears in the member-facing output was dealt with.
   *
   * Two dispositions are established automatically and need no record: the resource still carries that topic's
   * block, or it holds an owner-approved exemption from it. Anything else must be written down here, or
   * preparation fails — a safety topic may leave a resource, but it may not leave quietly.
   */
  safetyTopicDispositions?: Record<string, SafetyTopicDisposition>;
  /**
   * What accounts for each member-facing price (Stage 9.61).
   *
   * `currency` is excluded from numeric blocking and the figure-needs-source flag matches only `%` and `°C`, so
   * until this stage a price passed every gate in the pipeline. Every price in the migrated text now needs a
   * recorded disposition — REMOVE, CURRENT-SOURCE-REQUIRED or OWNER-APPROVED-LIVE-PRICE — or preparation fails.
   * An empty or missing list approves nothing.
   */
  priceDispositions?: PriceRecord[];
  /** ids of blocks whose wording is still a proposal */
  proposedBlockIds?: string[];
  /** old product and platform names to flag (config/legacy-terms.json) */
  legacyTerms?: LegacyTerms;
  /**
   * An owner-approved title, replacing the one read from the document's cover. The slug, the route and the default
   * PDF title all follow it, so a rename stays in one piece. The document's own cover and running header are changed
   * by approved copy changes, which is what keeps the page and the record saying the same thing.
   */
  title?: string | null;
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
  /**
   * The owner-approved water-treatment claims (config/treatment-sources.json). Every numeric or efficacy treatment
   * claim in a market's file must match an entry for that market, and contaminated-source guidance must carry that
   * market's limitation. Without a registry the gates cannot run, so the checks are reported as unavailable rather
   * than silently passed.
   */
  treatmentRegistry?: TreatmentRegistry;
  /**
   * Owner-approved numeric claims outside treatment (config/numeric-claims.json). It carries its own mode: in
   * "blocking" mode an unexplained figure fails the market; in "report-only" it changes nothing here. Without a
   * registry nothing is approved, so a blocking build cannot be passed by leaving the file out.
   */
  numericRegistry?: NumericRegistry;
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
  const title = inputs.title ?? described.title ?? item.title;
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
  const collectFlags = (html: string, market: string) => {
    for (const f of findContentFlags(html, item.legacyCode, inputs.legacyTerms)) {
      // A figure that matches an approved treatment claim for this market already carries its source, with the
      // authority and date recorded in the registry. Every other figure is still flagged for the owner.
      if (
        f.kind === "figure-needs-source" &&
        inputs.treatmentRegistry &&
        isRegisteredClaim(f.text, market, inputs.treatmentRegistry)
      ) {
        continue;
      }
      const key = `${f.kind}|${f.text}`;
      if (!flagSeen.has(key)) {
        flagSeen.add(key);
        contentFlags.push(f);
      }
    }
  };

  // 4. market resolution, with the standard blocks plus this resource's topic blocks
  const safetyBlocks = ["general-disclaimer", "emergency-contact", ...(inputs.extraSafetyBlocks ?? [])];
  const sourceTopics = inputs.sourceSafetyTopics ?? inputs.requiredSafety ?? [];
  // A requirement is met by the block with that id, or by an included block that declares it in `answers` — the
  // approved `fire-and-smoke-alarms` wording answers the detector's "fire-and-emergency". Only blocks this resource
  // actually carries are consulted, so declaring an answer can satisfy a requirement but never suppress one.
  const answered = new Set(safetyBlocks.flatMap((id) => [id, ...(blocks[id]?.answers ?? [])]));
  // Exemptions are still judged against what the LEGACY source taught, so a reviewed exemption keeps running its
  // lapse test even once output-derived enforcement would not have asked for the block at all. Defence in depth:
  // the exemption can only ever let something through that the output check has already cleared.
  const lacking = sourceTopics.filter((b) => !answered.has(b));
  // An exemption is checked against each market's final wording; a block stays required wherever it fails.
  const exemptions = (inputs.safetyExemptions ?? []).filter((e) => lacking.includes(e.block));
  const dispositions = inputs.safetyTopicDispositions ?? {};
  const removalRecords: PrepResult["safety"]["removedTopics"] = [];
  const outputTopicsSeen = new Set<string>();
  const priceCandidates: PrepResult["prices"]["inOutput"] = [];
  const legacyPriceEvidence: PriceCandidate[] = [];
  const exemptionResults = new Map(exemptions.map((e) => [e.block, { block: e.block, reason: e.reason, holds: true, unexpected: [] as string[] }]));
  const missing = new Set(launchMarkets.length ? [] : lacking);
  const trims: PrepResult["safety"]["trims"] = [];
  const gasSets: PrepResult["safety"]["gas"] = [];
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
    collectFlags(marketHtml, code);
    // Checked on the resource's own text, before the safety blocks go in (the CO block names LPG heaters).
    // GAS_SAFETY_REQUIRED means "no gas guidance is approved" (Stage 9.62A): it is satisfied only by the REQUIRED GAS
    // BLOCK SET for what this market's text actually teaches, with EVERY block in that set available and approved
    // for this market. Presence of the general block alone releases nothing. Any unavailable block (pending, no
    // market wording, not carried) leaves the finding in place AND adds its own problem, so the resource fails
    // closed. Diesel is a different fuel and is never released here.
    const rawFuelFindings = fuelSafetyFindings(marketHtml, inputs.fuelExemptions ?? []);
    const gasFuelFinding = rawFuelFindings.some((f) => f.startsWith("GAS_SAFETY_REQUIRED"));
    const gasTopicsTaught = safetyExposureFor(memberFacingText(marketHtml)).filter(
      // a topic the owner has exempted for this resource is only dropped if the exemption still holds
      (t) => t in GAS_BLOCK_SET && !(exemptions.some((e) => e.block === t) && exemptionHolds(exemptions.find((e) => e.block === t)!, marketHtml).holds),
    );
    const gasSet = requiredGasBlocks(gasTopicsTaught, gasFuelFinding);
    const gasUnavailable = gasSet.flatMap((id) => {
      const a = gasBlockAvailability(id, code, blocks, safetyBlocks, proposed);
      return a.available ? [] : [{ id, reason: a.reason ?? "unavailable" }];
    });
    gasSets.push({ market: code, topics: gasTopicsTaught, required: gasSet, unavailable: gasUnavailable });
    const gasProblems = gasUnavailable.map(
      (u) => `GAS_BLOCK_SET_UNSATISFIED (${code}): this resource's gas teaching requires "${u.id}" (${gasSet.join(" + ")}), but it is unavailable — ${u.reason}`,
    );
    const fuelFindings = rawFuelFindings.filter((f) => !(f.startsWith("GAS_SAFETY_REQUIRED") && gasUnavailable.length === 0));
    for (const finding of fuelFindings) if (!otherFindings.includes(finding)) otherFindings.push(finding);
    for (const u of gasUnavailable) if (!safetyBlocks.includes(u.id)) missing.add(u.id);
    for (const problem of gasProblems) if (!otherFindings.includes(problem)) otherFindings.push(problem);
    // Prices, on the resource's OWN text and before the blocks go in (Stage 9.58/9.61). No approved block carries
    // a price; if one ever does, that block owns it and the resource is not asked to dispose of it.
    const prices = priceFindings(marketHtml, {
      market: code,
      records: inputs.priceDispositions ?? [],
      legacyHtml: sourceHtml,
    });
    for (const c of prices.output) priceCandidates.push({ market: code, ...c.candidate, disposition: c.record?.disposition });
    for (const c of prices.legacyOnly) {
      if (!legacyPriceEvidence.some((p) => p.figure === c.figure)) legacyPriceEvidence.push(c);
    }
    for (const finding of prices.problems) if (!otherFindings.includes(finding)) otherFindings.push(finding);
    // --- the two-layer safety check (Stage 9.58) -----------------------------------------------------------
    // Layer B: what this market's MEMBER-FACING text actually teaches, read before the safety blocks go in, so a
    // block's own wording can never create a requirement (the CO block names gas heaters).
    const outputTopics = safetyExposureFor(memberFacingText(marketHtml));
    for (const t of outputTopics) outputTopicsSeen.add(t);
    // Layer A: a legacy topic that is no longer taught has to be accounted for. Two dispositions are established
    // by the resource itself; anything else must be written down, or the topic stays required and the market fails.
    const unaccounted: string[] = [];
    for (const topic of sourceTopics.filter((t) => !outputTopics.includes(t))) {
      if (removalRecords.some((r) => r.topic === topic && r.market === code)) continue;
      const exemption = exemptions.find((e) => e.block === topic);
      const recorded = dispositions[topic];
      const disposition = answered.has(topic)
        ? { disposition: "REPLACED_BY_BLOCK" as const, reason: `the resource still carries the "${topic}" block, so the member still gets that safety wording` }
        : exemption
          ? { disposition: "OWNER_APPROVED_REMOVAL" as const, reason: exemption.reason, approvedBy: exemption.approvedBy, approvedOn: exemption.approvedOn }
          : recorded;
      removalRecords.push({ topic, market: code, accounted: !!disposition, ...(disposition ?? {}) });
      if (!disposition) unaccounted.push(topic);
    }
    for (const topic of unaccounted) {
      trimProblems.push(
        `SAFETY_TOPIC_REMOVED_WITHOUT_RECORD (${code}): the legacy source teaches "${topic}" and the migrated text does not, with no block carried, no exemption and no recorded disposition. Record one of REMOVED, REWRITTEN, REPLACED_BY_BLOCK, NON_TEACHING_CONTEXT or OWNER_APPROVED_REMOVAL, or restore the block.`,
      );
    }
    // Enforcement reads the output, plus any removal nobody has accounted for — fail closed, never fail silent.
    const marketRequired = [...new Set([...outputTopics, ...unaccounted])];
    const marketMissing = marketRequired.filter((b) => {
      if (answered.has(b)) return false;
      const exemption = exemptions.find((e) => e.block === b);
      if (!exemption) return true;
      const check = exemptionHolds(exemption, marketHtml);
      const result = exemptionResults.get(b)!;
      result.holds &&= check.holds;
      result.unexpected.push(...check.unexpected.filter((u) => !result.unexpected.includes(u)));
      return !check.holds;
    });
    for (const b of marketMissing) missing.add(b);
    if (inputs.safetyBlockPlacement === "safety-notes" && !marketHtml.includes(SAFETY_NOTES_MARKER)) {
      trimProblems.push(`SAFETY_PLACEMENT_MARKER_MISSING (${code}): the resource asked for its safety blocks at the Safety Notes marker, but the copy has no marker. The blocks were placed by default, not dropped; restore the marker or remove the placement setting.`);
    }
    const injected = injectSafetyChecked(
      marketHtml,
      resolved.safety.map((s) => ({ id: s.id, title: s.title, body: s.body, severity: s.severity })),
      inputs.safetyBlockPlacement === "safety-notes" ? { topicBlockMarker: SAFETY_NOTES_MARKER } : {},
    );
    const withSafety = injected.html;
    // Treatment claims are checked on the finished market file — the resource's own text AND its safety blocks —
    // so a block's own figures are held to the same registry, and a figure that belongs to the other market fails
    // here rather than in review. With no registry, nothing is approved and every claim fails: that is the point.
    const treatmentRegistry = inputs.treatmentRegistry ?? { claims: [] };
    const treatment = treatmentFindings(withSafety, code, treatmentRegistry);
    for (const finding of treatment) if (!otherFindings.includes(finding)) otherFindings.push(finding);
    // Numeric claims outside treatment (Stage 9.50). Blocking only when the registry says so, and only in the
    // categories this activation covers; a missing registry approves nothing, exactly as treatment's does.
    const numeric = numericBlockingFindings(withSafety, {
      resource: item.legacyCode,
      market: code,
      registry: inputs.numericRegistry ?? { claims: [], mode: "report-only" },
      treatment: treatmentRegistry,
    });
    for (const finding of numeric) if (!otherFindings.includes(finding)) otherFindings.push(finding);
    // A safety block that could not be placed is a blocker, not a warning: the member would never see it.
    const unplaced = [
      ...trimProblems,
      ...fuelFindings,
      ...gasProblems,
      ...prices.problems,
      ...treatment,
      ...numeric,
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
    ...(inputs.programComponent ? { programComponent: inputs.programComponent } : {}),
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
    : otherFindings.length ||
        unansweredSafetyNotes(item.safetyNotes, safetyBlocks, [...outputTopicsSeen]).length ||
        contentFlags.length ||
        missingRequired.length
      ? "NEEDS_CONTENT_REVIEW"
      : proposed.length
        ? "NEEDS_SAFETY_APPROVAL"
      : !parsed.success ||
          categoryIssues.length ||
          typeof inputs.estimatedTime !== "number" ||
          !inputs.difficulty ||
          (inputs.programComponentRequired && programAlignmentGaps(inputs).length)
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
    programComponent: inputs.programComponent ?? null,
    reskin: { changes: summariseChanges(changes), warnings },
    branding: { legacyIssues: legacyIssues.length, issues: legacyIssues },
    terminology: { frameworkPhrase: item.legacyTerminology.length, barePillar: 0, otherFindings },
    safety: {
      blocks: resource.safetyBlocks,
      exposure: item.safetyNotes,
      sourceTopics,
      outputTopics: [...outputTopicsSeen],
      removedTopics: removalRecords,
      required: [...new Set([...outputTopicsSeen, ...removalRecords.filter((r) => !r.accounted).map((r) => r.topic)])],
      missingRequired,
      proposed,
      exemptions: [...exemptionResults.values()],
      trims,
      gas: gasSets,
    },
    prices: { inOutput: priceCandidates, legacyOnly: legacyPriceEvidence },
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
