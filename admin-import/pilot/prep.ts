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
import { reskinHtml, summariseChanges } from "../reskin/reskin";
import { resolveForMarket, publishable, type CoreResource, type MarketProfile, type SafetyBlock } from "../markets/resolve";
import { injectSafetyChecked } from "./run";
import { ResourceSchema } from "@/lib/content/schemas";
import { getFoundation } from "@/lib/content/taxonomy";
import type { ProgrammeItem } from "../audit/programme";

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
  safety: { blocks: string[]; exposure: string[] };
  markets: { code: string; publishable: boolean; problems: string[]; emergencyNumber: string }[];
  validation: { ok: boolean; issues: string[] };
  importReadiness:
    | "READY_AFTER_METADATA"
    | "READY_AFTER_METADATA_AND_COPY_APPROVAL"
    | "NEEDS_OWNER_METADATA"
    | "NEEDS_OWNER_COPY"
    | "NEEDS_CONTENT_REVIEW";
  /** owner-approved copy changes, and whether each was applied */
  copyChanges: CopyChangeResult[];
  estimatedTime: number | null;
  files: string[];
}

/** Platform and channel references that do not belong in a member library resource. */
const PLATFORM_REFERENCES = /\b(skool|facebook group|discord|patreon|whatsapp group|telegram)\b/gi;

const clean = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

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
}

export interface CopyChangeResult {
  where: string;
  from: string;
  to: string;
  matched: number;
  applied: boolean;
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
    results.push({ where: c.where, from: c.from, to: c.to, matched, applied });
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
}

export function prepareResource(inputs: PrepInputs): PrepResult {
  const { item, sourceHtml, blocks, markets, launchMarkets, outDir, copyChanges = [] } = inputs;

  // 1. re-skin (brand + terminology, context-aware), then any owner-approved copy changes
  const skinned = reskinHtml(sourceHtml, { strapline: "Prepare • Adapt • Thrive" });
  const { changes, warnings } = skinned;
  const copy = applyCopyChanges(skinned.html, copyChanges);
  const reskinned = copy.html;

  // 2. what the document says about itself
  const described = describeFromHtml(sourceHtml);
  const title = described.title ?? item.title;
  const slug = slugify(title);

  // 3. terminology beyond the framework phrase — checked on the MIGRATED html, so an approved copy change that
  //    removed a reference clears it, while anything still left in the member-facing document is still caught.
  const otherFindings: string[] = [];
  for (const m of new Set(reskinned.match(PLATFORM_REFERENCES) ?? [])) {
    otherFindings.push(`references "${m}" — a platform outside the member library; confirm before publishing`);
  }
  for (const r of copy.results.filter((x) => !x.applied)) {
    otherFindings.push(`approved copy change (${r.where}) was NOT applied: expected the original wording once, found it ${r.matched} time(s)`);
  }

  // 4. market resolution, with the standard blocks for a Group-A resource
  const resource: CoreResource = {
    id: item.proposedResourceId,
    legacyCode: item.legacyCode,
    slug,
    title,
    description: described.description ?? "",
    body: "",
    safetyBlocks: ["general-disclaimer", "emergency-contact"],
  };

  fs.mkdirSync(outDir, { recursive: true });
  const files: string[] = [];
  const marketResults: PrepResult["markets"] = [];

  for (const code of launchMarkets) {
    const profile = markets.find((m) => m.code === code);
    if (!profile) continue;
    const resolved = resolveForMarket(resource, profile, blocks);
    const gate = publishable(resolved, ["emergency-contact"]);
    const injected = injectSafetyChecked(
      reskinned,
      resolved.safety.map((s) => ({ id: s.id, title: s.title, body: s.body, severity: s.severity })),
    );
    const withSafety = injected.html;
    // A safety block that could not be placed is a blocker, not a warning: the member would never see it.
    const unplaced = injected.unplaced.map((id) => `safety block "${id}" could not be placed in this layout`);
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

  // 5. validation against the real library schema
  const foundation = item.foundation.value ?? "general";
  const record: Record<string, unknown> = {
    id: item.proposedResourceId,
    slug,
    legacyCode: item.legacyCode,
    title,
    description: described.description ?? "",
    learningObjectives: [],
    foundation: foundation,
    // Owner-approved (2026-09-22) for the General planning resources prepared so far. Other foundations still
    // fall back to their first category, which remains a placeholder for review.
    category: foundation === "general" ? "planning" : (getFoundation(foundation as never).categories[0]?.slug ?? "planning"),
    resourceType: item.resourceType.value ?? "worksheet",
    difficulty: "beginner",
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
    relatedResources: [],
    completionAvailable: true,
  };
  const parsed = ResourceSchema.safeParse(record);

  // 6. readiness
  const legacyIssues = item.legacyIssues.map((i) => i.issue);
  const copyApplied = copy.results.length > 0 && copy.results.every((r) => r.applied);
  const importReadiness: PrepResult["importReadiness"] = !described.description
    ? "NEEDS_OWNER_COPY"
    : otherFindings.length || item.safetyNotes.length
      ? "NEEDS_CONTENT_REVIEW"
      : typeof inputs.estimatedTime !== "number"
        ? "NEEDS_OWNER_METADATA"
        : copyApplied
          ? "READY_AFTER_METADATA_AND_COPY_APPROVAL"
          : "READY_AFTER_METADATA";

  return {
    legacyCode: item.legacyCode,
    proposedResourceId: item.proposedResourceId,
    slug,
    title,
    description: described.description,
    descriptionSource: described.source,
    foundation: item.foundation.value,
    resourceType: item.resourceType.value,
    reskin: { changes: summariseChanges(changes), warnings },
    branding: { legacyIssues: legacyIssues.length, issues: legacyIssues },
    terminology: { frameworkPhrase: item.legacyTerminology.length, barePillar: 0, otherFindings },
    safety: { blocks: resource.safetyBlocks, exposure: item.safetyNotes },
    markets: marketResults,
    validation: {
      ok: parsed.success,
      issues: parsed.success ? [] : parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
    },
    importReadiness,
    copyChanges: copy.results,
    estimatedTime: typeof inputs.estimatedTime === "number" ? inputs.estimatedTime : null,
    files,
  };
}
