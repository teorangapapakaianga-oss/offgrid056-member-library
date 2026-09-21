/**
 * Content schemas: the build-time definition of every content shape (docs/ARCHITECTURE.md §3).
 *
 * Only build-time code imports this module (the repository, the validator): it pulls in the validation library,
 * which must never reach the browser. The vocabulary itself lives in `constants.ts`, and the types below are the
 * same types the browser uses, so the two cannot drift apart.
 */
import { z } from "zod";
import { MARKET_CODES } from "@/lib/member/market";
import {
  COLLECTION_IDS,
  COUNTRIES,
  DIFFICULTIES,
  FILE_FORMATS,
  FIVE_FOUNDATIONS,
  FOUNDATION_IDS,
  RESOURCE_TYPE_IDS,
  SERVICE_TYPES,
} from "./constants";

export * from "./constants";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lower-case words separated by hyphens");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/, "ISO 8601 date");
const localOrAbsoluteUrl = z.string().refine((s) => s.startsWith("/") || /^https:\/\//.test(s), "must start with / or https://");

export const FoundationIdSchema = z.enum(FOUNDATION_IDS);
export const ResourceTypeIdSchema = z.enum(RESOURCE_TYPE_IDS);
export const DifficultySchema = z.enum(DIFFICULTIES);
export { FIVE_FOUNDATIONS, COUNTRIES, SERVICE_TYPES };

export const ResourceSchema = z
  .object({
    id: z.string().regex(/^res-\d{4}$/, 'format "res-0001"'),
    slug,
    legacyCode: z.string().optional(),
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(220),
    summary: z.string().optional(),
    learningObjectives: z.array(z.string()).default([]),
    foundation: FoundationIdSchema,
    category: slug,
    resourceType: ResourceTypeIdSchema,
    difficulty: DifficultySchema,
    estimatedTime: z.number().int().positive().max(24 * 60),
    tags: z.array(z.string()).default([]),
    collections: z.array(z.enum(COLLECTION_IDS)).optional(),
    order: z.number().int().optional(),
    featured: z.boolean(),
    new: z.boolean().optional(),
    premium: z.boolean(),
    isPlaceholder: z.boolean(),
    status: z.enum(["draft", "published", "archived"]),
    thumbnail: z.object({ src: localOrAbsoluteUrl, alt: z.string().min(3) }).optional(),
    fileUrl: localOrAbsoluteUrl.optional(),
    fileFormat: z.enum(FILE_FORMATS).optional(),
    fileSizeBytes: z.number().int().positive().optional(),
    /**
     * Market-specific downloads, where the guidance itself differs by country.
     *
     * `fileUrl` above stays the default for a resource that is the same everywhere. When `marketFiles` is
     * present, the member is shown the file for THEIR market and no other — never a choice between two
     * countries' emergency guidance, and never a fallback to the wrong one.
     */
    marketFiles: z
      .record(
        z.enum(MARKET_CODES),
        z.object({
          fileUrl: localOrAbsoluteUrl,
          fileFormat: z.enum(FILE_FORMATS),
          fileSizeBytes: z.number().int().positive().optional(),
        }),
      )
      .optional(),
    externalUrl: z.url({ protocol: /^https$/ }).optional(),
    videoUrl: z.url({ protocol: /^https$/ }).optional(),
    downloadable: z.boolean(),
    publishedDate: isoDate,
    updatedDate: isoDate.optional(),
    relatedResources: z.array(z.string()).default([]),
    learningPath: z.string().optional(),
    packItems: z.array(z.string()).optional(),
    completionAvailable: z.boolean(),
  })
  .strict()
  .superRefine((r, ctx) => {
    if (r.downloadable && !r.fileUrl) ctx.addIssue({ code: "custom", path: ["fileUrl"], message: "downloadable resources need a fileUrl" });
    if (r.fileUrl && !r.fileFormat) ctx.addIssue({ code: "custom", path: ["fileFormat"], message: "fileUrl needs a fileFormat" });
    if (r.resourceType === "download-pack" && !r.packItems?.length) ctx.addIssue({ code: "custom", path: ["packItems"], message: "a download-pack needs packItems" });
  });

export const CategorySchema = z.object({
  slug,
  name: z.string(),
  description: z.string(),
  matchTypes: z.array(ResourceTypeIdSchema).optional(),
});

export const FoundationSchema = z.object({
  id: FoundationIdSchema,
  name: z.string(),
  order: z.number().int(),
  icon: z.string(),
  description: z.string(),
  categories: z.array(CategorySchema).min(1),
});

export const ResourceTypeSchema = z.object({
  id: ResourceTypeIdSchema,
  label: z.string(),
  plural: z.string(),
  action: z.string(),
});

export const LearningPathSchema = z.object({
  id: slug,
  title: z.string(),
  description: z.string(),
  foundation: FoundationIdSchema,
  steps: z.array(z.string()).min(1),
});

export type Resource = z.infer<typeof ResourceSchema>;
export type LearningPath = z.infer<typeof LearningPathSchema>;
