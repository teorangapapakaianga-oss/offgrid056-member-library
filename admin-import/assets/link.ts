/**
 * Attaching artwork to resources (owner decision 5, Stage 9.3).
 *
 * Cover images, thumbnails and other artwork are never standalone resources. Each one is attached to the
 * resource it belongs to — but only where that is genuinely clear. Anything else is flagged
 * `ASSET_LINK_REVIEW` for a person to decide, because a wrong cover on a resource is worse than a missing one.
 */
import { stringSimilarity } from "../dedupe/group";
import type { Candidate } from "../types";

/**
 * Underscores are word characters, so `\blogo\b` never matches "OffGrid056_Logo.png". Separators become
 * spaces before any word-boundary test — the same trap that once made "OffGrid056" look like an OG code.
 */
const words = (filename: string) => filename.replace(/\.[^.]+$/, "").replace(/[_\-.]+/g, " ");

const stem = (filename: string) =>
  words(filename)
    .toLowerCase()
    .replace(/\b(cover|thumb|thumbnail|image|img|final|out|web|small|large|v\d+)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Below this, a filename resemblance is not good enough to attach artwork to a resource. */
const ATTACH_THRESHOLD = 0.62;

/**
 * Brand and programme artwork: logos, icons, diagrams, patterns, promotional images and week/section covers.
 *
 * These belong to the brand or to a part of the programme, not to any single resource, so there is nothing to
 * attach them to and nothing uncertain about them. Flagging all of them ASSET_LINK_REVIEW would bury the
 * handful of images that genuinely are one resource's artwork and cannot be placed.
 */
const BRAND_ASSET = /\b(logo|wordmark|icon|favicon|diagram|pattern|texture|badge|banner|promo|bundle|watermark|brandmark|palette|swatch|week\s?\d)\b/i;

export function linkAssets(candidates: Candidate[]): { attached: number; needsReview: number; brand: number } {
  const resources = candidates.filter((c) => c.materialKind === "resource");
  let attached = 0;
  let needsReview = 0;
  let brand = 0;

  for (const asset of candidates) {
    if (asset.materialKind !== "asset" || !asset.asset) continue;

    // Brand and programme artwork: nothing to attach, nothing to decide.
    if (BRAND_ASSET.test(words(asset.source.filename))) {
      asset.asset.scope = "brand";
      asset.asset.attachTo = null;
      asset.asset.attachEvidence = ["brand or programme artwork: belongs to the brand, not to one resource"];
      brand++;
      continue;
    }
    asset.asset.scope = "resource";

    // 1. An OG code in the artwork's name is decisive: it belongs to that resource.
    const code = asset.inferred.legacyCode.value;
    if (code) {
      const match = resources.find((r) => r.inferred.legacyCode.value === code);
      if (match) {
        asset.asset.attachTo = match.candidateId;
        asset.asset.attachEvidence = [`both carry the code ${code}`];
        attached++;
        continue;
      }
    }

    // 2. Otherwise the name must clearly resemble one resource, and only one.
    const assetStem = stem(asset.source.filename);
    const scored = resources
      .map((r) => ({ r, score: stringSimilarity(assetStem, stem(r.source.filename)) }))
      .filter((x) => x.score >= ATTACH_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    const clearWinner = scored.length === 1 || (scored.length > 1 && scored[0].score - scored[1].score >= 0.1);
    if (scored.length && clearWinner) {
      asset.asset.attachTo = scored[0].r.candidateId;
      asset.asset.attachEvidence = [`filename ${(scored[0].score * 100) | 0}% like "${scored[0].r.source.filename}"`];
      attached++;
      continue;
    }

    asset.asset.attachTo = null;
    asset.asset.attachEvidence =
      scored.length > 1
        ? [`could belong to ${scored.length} resources (${scored.slice(0, 3).map((s) => s.r.source.filename).join(", ")})`]
        : ["no resource in this scan has a matching name or code"];
    if (!asset.reviewFlags.includes("ASSET_LINK_REVIEW")) asset.reviewFlags.push("ASSET_LINK_REVIEW");
    needsReview++;
  }

  return { attached, needsReview, brand };
}
