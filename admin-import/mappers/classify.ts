/**
 * Classifier: turns an inventory entry into a candidate, with a value, a confidence and the evidence behind
 * every inference (Stage 9.1 §6).
 *
 * Nothing here is presented as certain, and nothing is auto-approved: LOW confidence means a person decides.
 */
import rules from "../config/inference-rules.json";
import legacyBrand from "../config/legacy-brand.json";
import { foundations as taxonomy, getFoundation } from "@/lib/content/taxonomy";
import type { Difficulty, FoundationId, ResourceTypeId } from "@/lib/content/constants";
import type { AssetRole, Candidate, Confidence, Inference, InventoryEntry, LegacyFinding, MaterialKind } from "../types";

export interface TextBundle {
  text: string;
  raw: string;
  meta: Record<string, unknown>;
}

const EMPTY_TEXT: TextBundle = { text: "", raw: "", meta: {} };

const none = <T>(): Inference<T> => ({ value: null, confidence: "LOW", evidence: [] });

/** Two or more independent strong signals = HIGH; one strong or several weak = MEDIUM; otherwise LOW. */
function scoreToConfidence(strongSignals: number, weakSignals: number, margin: number): Confidence {
  if (strongSignals >= 2 && margin >= 1.5) return "HIGH";
  if (strongSignals >= 1 || weakSignals >= 3) return "MEDIUM";
  return "LOW";
}

const normalise = (s: string) => s.toLowerCase().replace(/[_\-.]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * OG-01 … OG-45 and bonus codes OG-B01 … OG-B15.
 *
 * The separator is required, so the brand name itself ("OffGrid056", "OG056-HRG") is never mistaken for a code,
 * and a date like "OG-2026" is rejected. A document that lists many codes is an index, not the resource.
 */
export function detectOgCode(filename: string, text: string): Inference<string> {
  // The separator is required, and the boundaries are explicit: "OG-01_Home" matches, "OffGrid056" and
  // "OG056-HRG" do not (no separator), and "OG-2026" is rejected by the range check below.
  const pattern = /(?<![0-9A-Za-z])OG[-_ ](B?\d{2,3})(?![0-9A-Za-z])/gi;
  const valid = (raw: string) => {
    const numeric = Number(raw.replace(/^B/i, ""));
    if (raw.length > 3) return null; // OG-2026 and similar
    if (!Number.isFinite(numeric) || numeric < 1 || numeric > 99) return null;
    return `OG-${/^B/i.test(raw) ? "B" : ""}${String(numeric).padStart(2, "0")}`;
  };

  for (const m of filename.matchAll(pattern)) {
    const code = valid(m[1].toUpperCase());
    if (code) return { value: code, confidence: "HIGH", evidence: [`filename contains "${m[0]}"`] };
  }

  const inText = [...text.slice(0, 20000).matchAll(pattern)].map((m) => valid(m[1].toUpperCase())).filter(Boolean) as string[];
  const distinct = [...new Set(inText)];
  if (distinct.length > 2) {
    return { value: null, confidence: "LOW", evidence: [`document lists ${distinct.length} different OG codes: this looks like an index, not one resource`] };
  }
  if (distinct.length === 1) return { value: distinct[0], confidence: "MEDIUM", evidence: [`document text contains "${distinct[0]}"`] };
  return none<string>();
}

/** Title from the document itself where possible, otherwise a tidied filename. */
export function inferTitle(entry: InventoryEntry, bundle: TextBundle): Inference<string> {
  const metaTitle = (bundle.meta.title as string | undefined)?.trim();
  const h1 = (bundle.meta.h1 as string | undefined)?.trim();
  if (metaTitle && metaTitle.length > 3) return { value: metaTitle, confidence: "HIGH", evidence: ["document title"] };
  if (h1 && h1.length > 3) return { value: h1, confidence: "HIGH", evidence: ["first heading"] };

  const cleaned = entry.source.filename
    .replace(/\.[^.]+$/, "")
    .replace(/^OG[-_]?B?\d{2,3}[-_ ]*/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { value: cleaned || null, confidence: cleaned ? "MEDIUM" : "LOW", evidence: ["derived from the filename"] };
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

interface Scored {
  key: string;
  score: number;
  strong: number;
  weak: number;
  evidence: string[];
  /** keywords that matched in the filename or title, where the strongest signals come from */
  nameWords: string[];
}

/**
 * Keyword scoring. What a file is *called* matters far more than how often a word appears inside it, so the
 * filename and title carry the most weight and body text is capped.
 *
 * Words in `GENERIC` ("home", "house", "energy" in prose) appear everywhere in this material, so they only ever
 * count as weak evidence and never make a foundation HIGH on their own.
 */
const GENERIC = new Set(["home", "house", "household", "property", "power", "energy", "water", "food", "plan", "guide", "resilience"]);

/**
 * Words that describe the *whole household* rather than one foundation (owner decision 1, Stage 9.3).
 *
 * A broad scorecard called "Home Resilience Scorecard" is not a Shelter resource just because it says "home".
 * When a foundation's only claim on the filename or title comes from words in this set, the resource is treated
 * as cross-cutting and filed under General. A genuinely foundation-specific name — "Healthy Home **Air** Audit",
 * "**Water** Security Assessment", "**Energy** Backup Assessment" — still wins its own foundation.
 */
const BROAD_SCOPE = new Set([
  "home", "house", "household", "property", "family", "whanau", "overall", "whole",
  "resilience", "readiness", "ready", "preparedness", "prepared", "emergency", "plan", "planning", "general",
]);

function scoreKeywords(
  map: Record<string, string[]>,
  haystacks: { filename: string; folder: string; title: string; text: string },
  /** demote everyday words: useful when picking a foundation, harmful when picking a resource type
   *  (a file called "…Guide.pdf" really is a guide) */
  demoteGeneric = false,
): Scored[] {
  const results: Scored[] = [];
  for (const [key, words] of Object.entries(map)) {
    let score = 0;
    let strong = 0;
    let weak = 0;
    const evidence: string[] = [];
    const nameWords: string[] = [];
    for (const word of words) {
      const w = word.toLowerCase();
      const generic = demoteGeneric && GENERIC.has(w);
      if (haystacks.filename.includes(w) || haystacks.title.includes(w)) nameWords.push(w);
      if (haystacks.filename.includes(w)) {
        score += generic ? 2 : 6;
        if (generic) weak++;
        else strong++;
        evidence.push(`filename contains "${word}"`);
      }
      if (haystacks.title.includes(w)) {
        score += generic ? 2 : 5;
        if (generic) weak++;
        else strong++;
        evidence.push(`title contains "${word}"`);
      }
      if (haystacks.folder.includes(w)) {
        score += generic ? 1 : 2;
        weak++;
        evidence.push(`folder name contains "${word}"`);
      }
      const inText = haystacks.text.split(w).length - 1;
      if (inText > 0) {
        const capped = Math.min(inText, generic ? 2 : 4);
        score += capped;
        if (!generic && capped >= 3) strong++;
        else weak++;
        evidence.push(`text mentions "${word}" ${inText}×`);
      }
    }
    if (score > 0) results.push({ key, score, strong, weak, evidence: evidence.slice(0, 4), nameWords: [...new Set(nameWords)] });
  }
  return results.sort((a, b) => b.score - a.score);
}

export function classify(entry: InventoryEntry, bundle: TextBundle = EMPTY_TEXT): Candidate {
  const filename = normalise(entry.source.filename);
  const folder = normalise(entry.source.folder.split(/[\\/]/).slice(-2).join(" "));
  const text = bundle.text.toLowerCase().slice(0, 200000);
  const legacyCode = detectOgCode(entry.source.filename, bundle.text);
  const title = inferTitle(entry, bundle);
  const haystacks = { filename, folder, title: normalise(title.value ?? ""), text };

  // --- resource type -------------------------------------------------------------------------------------
  let resourceType: Inference<ResourceTypeId>;
  const isCalculator = rules.calculatorKeywords.some((k) => filename.includes(k) || haystacks.title.includes(k));
  const typeScores = scoreKeywords(rules.resourceTypes as Record<string, string[]>, haystacks);
  if (entry.source.fileType === "video") {
    resourceType = { value: "video", confidence: "HIGH", evidence: ["the file itself is a video"] };
  } else if (entry.source.fileType === "image") {
    resourceType = { value: null, confidence: "LOW", evidence: ["an image on its own is not a resource: it is usually artwork for one"] };
  } else if (entry.source.fileType === "zip") {
    resourceType = { value: "download-pack", confidence: "MEDIUM", evidence: ["the file is an archive of several files"] };
  } else if (typeScores.length) {
    const top = typeScores[0];
    const margin = top.score / Math.max(1, typeScores[1]?.score ?? 0);
    resourceType = {
      value: top.key as ResourceTypeId,
      confidence: scoreToConfidence(top.strong, top.weak, margin),
      evidence: top.evidence,
    };
  } else {
    resourceType = none<ResourceTypeId>();
  }
  // Calculators become worksheets with a calculator tag (owner decision D9-6).
  const tags: string[] = [];
  if (isCalculator) {
    tags.push("calculator");
    if (!resourceType.value || resourceType.value === "worksheet") {
      resourceType = { value: "worksheet", confidence: resourceType.confidence === "LOW" ? "MEDIUM" : resourceType.confidence, evidence: [...resourceType.evidence, "calculator → worksheet with a calculator tag (decision D9-6)"] };
    }
  }

  // --- foundation ----------------------------------------------------------------------------------------
  const foundationScores = scoreKeywords(rules.foundations as Record<string, string[]>, haystacks, true);
  let foundation: Inference<FoundationId> = none<FoundationId>();
  const secondaryFoundations: FoundationId[] = [];
  if (entry.source.fileType === "image") {
    // Artwork belongs to whatever resource uses it; guessing a foundation from a filename helps nobody.
    foundation = { value: null, confidence: "LOW", evidence: ["an image is artwork: its foundation follows the resource it belongs to"] };
  } else if (foundationScores.length) {
    const top = foundationScores[0];
    const second = foundationScores[1];
    const margin = top.score / Math.max(1, second?.score ?? 0);
    const specific = foundationScores.filter((s) => s.key !== "general");
    const crossCutting = specific.filter((s) => s.score >= top.score * 0.6).length >= 3;

    if (crossCutting) {
      // Several foundations score alike: this covers the whole framework rather than one part of it.
      foundation = {
        value: "general",
        confidence: "MEDIUM",
        evidence: [`${specific.length} foundations score similarly (${specific.slice(0, 3).map((s) => `${s.key} ${s.score}`).join(", ")}): treated as cross-cutting`],
      };
      secondaryFoundations.push(...(specific.slice(0, 3).map((s) => s.key) as FoundationId[]));
    } else if (top.key !== "general" && top.nameWords.length > 0 && top.nameWords.every((w) => BROAD_SCOPE.has(w))) {
      // Owner decision 1: the name only claims this foundation through whole-household words ("home",
      // "resilience", "readiness"). That is a broad household resource, not a foundation-specific one.
      foundation = {
        value: "general",
        confidence: "MEDIUM",
        evidence: [`the name only matches "${top.key}" through whole-household words (${top.nameWords.join(", ")}): filed under General (owner decision 1)`],
      };
    } else {
      foundation = { value: top.key as FoundationId, confidence: scoreToConfidence(top.strong, top.weak, margin), evidence: top.evidence };
      for (const s of foundationScores.slice(1, 3)) {
        if (s.score >= top.score * 0.5 && s.key !== "general") secondaryFoundations.push(s.key as FoundationId);
      }
    }
  }

  // --- category ------------------------------------------------------------------------------------------
  let category: Inference<string> = none<string>();
  if (foundation.value) {
    const hints = (rules.categoryHints as Record<string, Record<string, string[]>>)[foundation.value] ?? {};
    const catScores = scoreKeywords(hints, haystacks);
    const valid = new Set(getFoundation(foundation.value).categories.map((c) => c.slug));
    const best = catScores.find((c) => valid.has(c.key));
    if (best) {
      category = { value: best.key, confidence: best.strong >= 1 ? "MEDIUM" : "LOW", evidence: best.evidence };
    } else {
      const fallback = getFoundation(foundation.value).categories[0];
      category = { value: fallback?.slug ?? null, confidence: "LOW", evidence: ["no category keyword matched: first category of the foundation suggested"] };
    }
  }

  // --- difficulty and time -------------------------------------------------------------------------------
  const diffScores = scoreKeywords(rules.difficultyHints as Record<string, string[]>, haystacks);
  const difficulty: Inference<Difficulty> = diffScores.length
    ? { value: diffScores[0].key as Difficulty, confidence: "LOW", evidence: diffScores[0].evidence }
    : { value: "beginner", confidence: "LOW", evidence: ["no signal: beginner assumed, please check"] };

  const words = bundle.text ? bundle.text.split(/\s+/).length : 0;
  const estimatedTime: Inference<number> = words
    ? { value: Math.max(5, Math.round(words / rules.wordsPerMinute / 5) * 5), confidence: "LOW", evidence: [`${words.toLocaleString()} words ÷ ${rules.wordsPerMinute} wpm`] }
    : none<number>();

  // --- legacy branding -----------------------------------------------------------------------------------
  const { legacyIssues, migrationActions } = detectLegacy(bundle);

  // --- what kind of material is this? --------------------------------------------------------------------
  const { materialKind, notes, reviewFlags } = classifyMaterial(entry, legacyCode, bundle);
  const asset =
    materialKind === "asset"
      ? { role: assetRole(entry.source.filename), scope: "resource" as const, attachTo: null, attachEvidence: [] as string[] }
      : undefined;

  return {
    ...entry,
    status: materialKind === "resource" ? "CLASSIFIED" : "NEEDS_REVIEW",
    materialKind,
    ...(asset ? { asset } : {}),
    reviewFlags,
    inferred: { title, resourceType, foundation, secondaryFoundations, category, legacyCode, estimatedTime, difficulty, tags },
    legacyBranding: legacyIssues.length > 0,
    legacyIssues,
    migrationActions,
    duplicateGroup: null,
    duplicateKind: null,
    duplicateOf: [],
    pairedWith: null,
    contentMismatch: false,
    disposition: null,
    importNotes: notes,
    importApproved: false,
    importedAt: null,
  };
}

/**
 * Internal and source-only material (owner decision 3). These are never library resources: READMEs, brand
 * plans, manifests, build output and navigation/index pages are working files, and treating one as a resource
 * would put project internals in front of members.
 */
/**
 * Matched against the filename with separators turned into spaces, because `\b` does not fire after an
 * underscore: `^readme\b` never matches "README_FONTS.md". Anchored at the start so a genuine resource whose
 * title happens to contain one of these words — "OG-13_Healthy_Home_Air_Audit.pdf" — is not caught.
 */
const INTERNAL_FILENAME =
  /^(readme|read me|manifest|changelog|version|brand plan|brand pack|package|package lock|index|license|licence|notes?|sitemap|robots|env|tsconfig|makefile|components?|partials?|gate\d*|stage\d*|qa|audit|asset production|delivery|instructions?|spec|prompt|template)\b/i;
const INTERNAL_FOLDER = /(^|[\\/])(_build|_source|_source_deliveries|build|dist|scripts?|tools?|templates?|working|wip|drafts?|\.git)([\\/]|$)/i;

/**
 * Business and marketing documents. These are how the business is run, not what members are taught: a sales
 * system or a persona study would be an odd thing to find in a resilience library. Matched anywhere in the
 * name, because they are rarely first ("OFFGRID056_SALES_SYSTEM.md").
 *
 * Flagged as internal rather than rejected, so the owner can still override any individual one.
 */
const INTERNAL_BUSINESS =
  /\b(business strategy|delivery model|sales system|sales page|funnel|personas?|voice guide|positioning|objections?|pricing|marketing|offer validation|customer journey|customer problems|brand pack|style guide|launch plan|content (plan|system|creator)|campaign\d*|copywriting|carousel|showcase|newsletter|ad copy|post copy|social|seo|competitor|register)\b/i;

function assetRole(filename: string): AssetRole {
  const n = filename.toLowerCase();
  if (/\bthumb(nail)?\b/.test(n)) return "thumbnail";
  if (/\bcover\b/.test(n)) return "coverImage";
  return "supportingAsset";
}

function classifyMaterial(
  entry: InventoryEntry,
  legacyCode: Inference<string>,
  bundle: TextBundle,
): { materialKind: MaterialKind; notes: string; reviewFlags: string[] } {
  const { filename, folder, fileType } = entry.source;
  const flags: string[] = [];

  // Artwork: attached to a resource, never a resource (owner decision 5).
  if (fileType === "image") {
    return {
      materialKind: "asset",
      notes: "Supporting visual asset: attach it to the resource it belongs to. It must not be imported as a resource on its own.",
      reviewFlags: flags,
    };
  }

  // A ZIP is a source or support package, never a separate library item (owner decision 2). Where it looks
  // like it holds several distinct resources, that is flagged rather than guessed at.
  if (fileType === "zip") {
    const names = ((bundle.meta.sample as string[]) ?? []).concat(bundle.text.split(/\s+/).slice(0, 400));
    const codes = new Set(names.map((n) => detectOgCode(n, "").value).filter(Boolean));
    if (codes.size > 1) flags.push("PACKAGE_CONTENTS_REVIEW");
    return {
      materialKind: "package",
      notes:
        codes.size > 1
          ? `Source or support package holding ${codes.size} different OG codes: it may contain several separate resources. Review before anything is taken from it.`
          : "Source or support package: retained as provenance, not imported as a library item (owner decision 2).",
      reviewFlags: flags,
    };
  }

  // Fonts, stylesheets and scripts are build material by definition.
  if (fileType === "font" || fileType === "style" || fileType === "code") {
    return { materialKind: "internal", notes: `Build material (${fileType}), not content.`, reviewFlags: flags };
  }

  const isIndex = legacyCode.evidence.some((e) => e.includes("looks like an index"));
  // Leading ordering prefixes ("00_", "01-") and leading underscores ("_components.html") are stripped first,
  // or they would defeat the start-of-name anchor.
  const spacedName = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_\-.]+/g, " ")
    .replace(/^[\d\s]+/, "")
    .trim();
  const isBusiness = INTERNAL_BUSINESS.test(spacedName);
  if (INTERNAL_FILENAME.test(spacedName) || INTERNAL_FOLDER.test(folder) || isIndex || isBusiness) {
    return {
      materialKind: "internal",
      notes: isIndex
        ? "Lists many resources: an index or contents page, not a resource itself."
        : isBusiness
          ? "Business or marketing document (how the business is run), not member teaching material."
          : "Internal or source material (working file, build output or navigation page), not a member resource.",
      reviewFlags: flags,
    };
  }

  return { materialKind: "resource", notes: "", reviewFlags: flags };
}

/** Legacy colours, typography and terminology. Detected only: the source file is never changed. */
export function detectLegacy(bundle: TextBundle): { legacyIssues: LegacyFinding[]; migrationActions: string[] } {
  const haystack = `${bundle.raw}\n${bundle.text}`.toLowerCase();
  const issues: LegacyFinding[] = [];
  const actions = new Set<string>();

  for (const c of legacyBrand.colours) {
    if (haystack.includes(c.hex.toLowerCase())) {
      issues.push({ issue: `${c.name} ${c.hex}`, evidence: `colour ${c.hex} appears in the file` });
      actions.add(legacyBrand.migrationActions.colours);
    }
  }
  for (const font of legacyBrand.typography) {
    // Whole words only, and short names like "Inter" must appear as a font reference — otherwise "winter",
    // "interruption" and "internal" would every time look like legacy typography.
    const name = font.toLowerCase();
    const wholeWord = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    const looksLikeFontUse = new RegExp(`(font-family|font:|typeface|@font-face|fonts\\.googleapis)[^;{}]{0,80}\\b${name}\\b`);
    const hit = name.length <= 6 ? looksLikeFontUse.test(haystack) : wholeWord.test(haystack);
    if (hit) {
      issues.push({ issue: `legacy typography: ${font}`, evidence: `font "${font}" referenced` });
      actions.add(legacyBrand.migrationActions.typography);
    }
  }
  for (const t of legacyBrand.terminology) {
    const m = haystack.match(new RegExp(t.pattern, "i"));
    if (m) {
      issues.push({ issue: t.issue, evidence: `text contains "${m[0]}"` });
      actions.add(legacyBrand.migrationActions.terminology);
    }
  }
  for (const logo of legacyBrand.logoFilenames) {
    if (haystack.includes(logo.toLowerCase())) {
      issues.push({ issue: "legacy logo reference", evidence: `references "${logo}"` });
      actions.add(legacyBrand.migrationActions.logo);
    }
  }
  return { legacyIssues: issues, migrationActions: [...actions] };
}

export const foundationNames = Object.fromEntries(taxonomy.map((f) => [f.id, f.name]));
