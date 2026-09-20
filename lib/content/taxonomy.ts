/**
 * Taxonomy lookups (foundations, categories, resource types).
 *
 * Small, fixed data that the browser needs, so this module stays free of the validation library. The taxonomy
 * files are validated at build time by `tools/validate-content.ts`, which fails the build if they are wrong.
 */
import foundationsJson from "@/data/taxonomy/foundations.json";
import typesJson from "@/data/taxonomy/resource-types.json";
import type { Category, Foundation, FoundationId, ResourceType, ResourceTypeId } from "./constants";

export const foundations: Foundation[] = (foundationsJson.foundations as Foundation[]).slice().sort((a, b) => a.order - b.order);

export const fiveFoundations = foundations.filter((f) => f.id !== "general");

export const resourceTypes: ResourceType[] = typesJson.resourceTypes as ResourceType[];

const foundationById = new Map(foundations.map((f) => [f.id, f]));
const typeById = new Map(resourceTypes.map((t) => [t.id, t]));

export function getFoundation(id: FoundationId): Foundation {
  const f = foundationById.get(id);
  if (!f) throw new Error(`Unknown foundation "${id}"`);
  return f;
}

export function getResourceType(id: ResourceTypeId): ResourceType {
  const t = typeById.get(id);
  if (!t) throw new Error(`Unknown resource type "${id}"`);
  return t;
}

export function getCategory(foundation: FoundationId, slug: string): Category | undefined {
  return foundationById.get(foundation)?.categories.find((c) => c.slug === slug);
}

/** A resource belongs to a category by its own `category`, or automatically via the category's matchTypes. */
export function inCategory(
  r: { foundation: FoundationId; category: string; resourceType: ResourceTypeId },
  foundation: FoundationId,
  category: Category,
): boolean {
  if (r.foundation !== foundation) return false;
  return r.category === category.slug || (category.matchTypes?.includes(r.resourceType) ?? false);
}
