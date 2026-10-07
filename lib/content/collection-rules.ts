import type { CollectionId } from "./constants";

/**
 * Where the Five Foundations page points a member who is not sure which foundation to start with (Stage 9.87, owner Option B).
 *
 * The page is shared with the public demo build, so the pointer is gated twice: it needs the PRIVATE PREVIEW build, and it needs
 * the real Home Resilience Scorecard (a non-placeholder, in the build) to exist. Either condition missing returns null and the
 * page renders exactly as it did before. The link is the scorecard's own route, never a demo route.
 */
export function scorecardPointerHref(
  options: { privatePreview: boolean },
  scorecard: { slug: string; isPlaceholder: boolean } | undefined,
): string | null {
  if (!options.privatePreview || !scorecard || scorecard.isPlaceholder) return null;
  return `/resources/${scorecard.slug}/`;
}

/**
 * Who is listed in a collection page (Start Here, Planning Tools).
 *
 * The membership rule is unchanged: a resource is in a collection when its `collections` include it
 * (docs/ARCHITECTURE.md §1). Stage 9.78B adds one narrow option for the PRIVATE PREVIEW: a page that is a collection of REAL
 * working resources (Planning Tools; Start Here since Stage 9.87) can hide demonstration placeholders, so the protected library
 * does not present a placeholder as a normal member resource. The public demo build is not the private preview, so it keeps listing them.
 * Nothing is deleted and nothing explicit changes: a placeholder is still reachable on its own route and through the programme,
 * the workshops and any resource that names it.
 */
export function inCollection(
  r: { collections?: readonly string[]; isPlaceholder: boolean },
  collection: CollectionId,
  options: { hidePlaceholders?: boolean; privatePreview: boolean },
): boolean {
  if (!(r.collections ?? []).includes(collection)) return false;
  if (options.hidePlaceholders && options.privatePreview && r.isPlaceholder) return false;
  return true;
}
