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

/**
 * Stage 9.73 (owner ruling): demo content and protected member content stay explicitly separated. A real resource never
 * replaces a placeholder merely because both want the same route. Every clash needs an explicit, owner-approved entry:
 *
 * - `supersedes`: placeholder id → the one real id that may replace it (the Stage 9.38/9.39 behaviour, kept only for the
 *   clashes already resolved and live). The placeholder is dropped and its references follow the real resource.
 * - `separateDemo`: placeholder id → the real id it clashes with. The real resource keeps the route; the placeholder
 *   stays a placeholder on a `demo-` route of its own, and nothing that references it is redirected. A separated
 *   placeholder is also UNLISTED (`separated` in the result): it is hidden from library, Start Here and browsing
 *   listings so the protected library shows the real resource, not a duplicate card, while it stays reachable on its
 *   own route and through explicit references (programme days, related links).
 *
 * A clash with no entry (or an entry naming a different real id) is an error, so the build stops rather than choosing.
 */
export interface RoutePolicy {
  supersedes: Record<string, string>;
  separateDemo: Record<string, string>;
}

/** The route a separated demo placeholder lives on, so it can never share an address with a real resource. */
export const demoSlug = (slug: string) => `demo-${slug}`;

export function resolveRouteCollisions<T extends RoutedResource>(
  resources: T[],
  options: { preview: boolean; policy?: RoutePolicy },
): { resources: T[]; aliases: Map<string, string>; separated: Set<string> } {
  const policy: RoutePolicy = options.policy ?? { supersedes: {}, separateDemo: {} };
  const bySlug = new Map<string, T[]>();
  for (const r of resources) bySlug.set(r.slug, [...(bySlug.get(r.slug) ?? []), r]);

  const dropped = new Set<T>();
  const renamed = new Map<T, string>();
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
      if (policy.supersedes[p.id] === real[0].id) {
        dropped.add(p);
        aliases.set(p.id, real[0].id);
      } else if (policy.separateDemo[p.id] === real[0].id) {
        renamed.set(p, demoSlug(p.slug));
      } else {
        throw new RouteCollisionError(
          `route /resources/${slug}/ is claimed by the real resource ${real[0].id} and the placeholder ${p.id}, and no owner-approved resolution is recorded for that pair (lib/content/route-policy.json). A real resource does not replace demo content by default.`,
        );
      }
    }
  }
  const kept = resources.filter((r) => !dropped.has(r)).map((r) => (renamed.has(r) ? { ...r, slug: renamed.get(r)! } : r));
  const slugs = new Set<string>();
  for (const r of kept) {
    if (slugs.has(r.slug)) throw new RouteCollisionError(`route /resources/${r.slug}/ is still claimed more than once after separating demo content`);
    slugs.add(r.slug);
  }
  return { resources: kept, aliases, separated: new Set([...renamed.keys()].map((p) => p.id)) };
}

/** The id to use for a reference, after supersession. */
export const aliasOf = (aliases: Map<string, string>) => (id: string) => aliases.get(id) ?? id;

/**
 * The same rule for learning paths (Stage 9.47).
 *
 * A pathway is data, not a route, but it has the same problem: the public repository carries a demonstration
 * "Water Basics" path built on placeholders, while the private preview has four real water resources to walk
 * through. A private path file (`*.private.json`, staged into `data/learning-paths/` for the preview build only)
 * supersedes the demonstration path of the same id — in the preview, and nowhere else.
 *
 * Nothing here is water-specific: any private path supersedes the demo path with its id.
 */
export interface CollidablePath {
  id: string;
  /** true when this came from a `*.private.json` file staged for the preview */
  isPrivate: boolean;
}

export class PathCollisionError extends Error {}

export function resolveLearningPathCollisions<T extends CollidablePath>(paths: T[], options: { preview: boolean }): T[] {
  const byId = new Map<string, T[]>();
  for (const p of paths) byId.set(p.id, [...(byId.get(p.id) ?? []), p]);

  const dropped = new Set<T>();
  for (const [id, group] of byId) {
    if (group.length < 2) continue;
    const priv = group.filter((p) => p.isPrivate);
    const demo = group.filter((p) => !p.isPrivate);
    if (priv.length > 1) throw new PathCollisionError(`learning path "${id}" is defined by more than one private file`);
    if (priv.length === 0) throw new PathCollisionError(`learning path "${id}" is defined by more than one demonstration file`);
    if (!options.preview)
      throw new PathCollisionError(`learning path "${id}" is defined by a private file and a demonstration file outside the private preview`);
    for (const d of demo) dropped.add(d);
  }
  return paths.filter((p) => !dropped.has(p));
}
