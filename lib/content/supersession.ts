/**
 * One route per resource, even while demo placeholders and real resources share the library.
 *
 * The public repo carries demonstration placeholders (Stage 5). Some real, private resources migrated later have the
 * same canonical route — the placeholder "Water Storage Calculator" and the real OG-08 both resolve to
 * /resources/water-storage-calculator/. The rule, for every such case rather than one at a time (owner rulings,
 * Stage 9.38):
 *
 * - PRIVATE PREVIEW: a real resource supersedes the demo placeholder on its route. The placeholder is dropped, and
 *   everything that pointed at it (related links, learning paths, programme days, workshops) points at the real
 *   resource instead — one card, one route, one download.
 * - ANY OTHER BUILD: a real resource sharing a placeholder's route is an error. Real records are only ever staged
 *   into the preview, so this should not happen; if it does, the build stops rather than choosing.
 * - Two real resources, or two placeholders, on one route: always an error. Nothing is resolved silently.
 */
export interface RoutedResource {
  id: string;
  slug: string;
  isPlaceholder: boolean;
}

export class RouteCollisionError extends Error {}

export function resolveRouteCollisions<T extends RoutedResource>(
  resources: T[],
  options: { preview: boolean },
): { resources: T[]; aliases: Map<string, string> } {
  const bySlug = new Map<string, T[]>();
  for (const r of resources) bySlug.set(r.slug, [...(bySlug.get(r.slug) ?? []), r]);

  const dropped = new Set<T>();
  const aliases = new Map<string, string>();
  for (const [slug, group] of bySlug) {
    if (group.length < 2) continue;
    const real = group.filter((r) => !r.isPlaceholder);
    const placeholders = group.filter((r) => r.isPlaceholder);
    const ids = group.map((r) => r.id).join(", ");
    if (real.length > 1) throw new RouteCollisionError(`route /resources/${slug}/ is claimed by more than one real resource (${ids})`);
    if (real.length === 0) throw new RouteCollisionError(`route /resources/${slug}/ is claimed by more than one placeholder (${ids})`);
    if (!options.preview)
      throw new RouteCollisionError(`route /resources/${slug}/ is claimed by a real resource and a placeholder (${ids}) outside the private preview`);
    for (const p of placeholders) {
      dropped.add(p);
      aliases.set(p.id, real[0].id);
    }
  }
  return { resources: resources.filter((r) => !dropped.has(r)), aliases };
}

/** The id to use for a reference, after supersession. */
export const aliasOf = (aliases: Map<string, string>) => (id: string) => aliases.get(id) ?? id;
