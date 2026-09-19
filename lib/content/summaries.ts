/**
 * ResourceSummary: the slim shape sent to the browser for cards, search and filters.
 * Long text (summary, objectives) stays on the detail page.
 */
import type { Difficulty, FoundationId, Resource, ResourceTypeId } from "./schemas";
import { getCategory } from "./taxonomy";

export interface ResourceSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  foundation: FoundationId;
  category: string;
  categoryName: string;
  resourceType: ResourceTypeId;
  difficulty: Difficulty;
  estimatedTime: number;
  tags: string[];
  collections: string[];
  order: number;
  featured: boolean;
  /** Manual "New" override; when absent, "New" is worked out in the browser from publishedDate. */
  newOverride: boolean | null;
  isPlaceholder: boolean;
  downloadable: boolean;
  hasVideo: boolean;
  completionAvailable: boolean;
  thumbnail: { src: string; alt: string } | null;
  publishedDate: string;
}

export function toSummary(r: Resource): ResourceSummary {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    foundation: r.foundation,
    category: r.category,
    categoryName: getCategory(r.foundation, r.category)?.name ?? r.category,
    resourceType: r.resourceType,
    difficulty: r.difficulty,
    estimatedTime: r.estimatedTime,
    tags: r.tags,
    collections: r.collections ?? [],
    order: r.order ?? 999,
    featured: r.featured,
    newOverride: r.new ?? null,
    isPlaceholder: r.isPlaceholder,
    downloadable: r.downloadable,
    hasVideo: Boolean(r.videoUrl) || r.resourceType === "video" || r.resourceType === "tutorial",
    completionAvailable: r.completionAvailable,
    thumbnail: r.thumbnail ?? null,
    publishedDate: r.publishedDate,
  };
}
