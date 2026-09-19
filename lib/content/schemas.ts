/**
 * Content schemas: the single definition of every content shape (docs/ARCHITECTURE.md §3).
 * TypeScript types are inferred from these, so validation and types cannot drift apart.
 * Pure module: safe to import from client components (types) and from Node tooling.
 */
import { z } from "zod";

export const FOUNDATION_IDS = ["air", "water", "shelter", "food", "energy", "general"] as const;
export const FIVE_FOUNDATIONS = ["air", "water", "shelter", "food", "energy"] as const;
export const RESOURCE_TYPE_IDS = [
  "guide", "workbook", "checklist", "planner", "assessment", "worksheet", "video",
  "tutorial", "template", "supplier-resource", "workshop", "programme", "download-pack",
] as const;
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const COLLECTION_IDS = ["start-here", "planning-tools"] as const;
export const FILE_FORMATS = ["PDF", "XLSX", "DOCX", "ZIP", "PNG"] as const;

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lower-case words separated by hyphens");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/, "ISO 8601 date");
const localOrAbsoluteUrl = z.string().refine((s) => s.startsWith("/") || /^https:\/\//.test(s), "must start with / or https://");

export const FoundationIdSchema = z.enum(FOUNDATION_IDS);
export const ResourceTypeIdSchema = z.enum(RESOURCE_TYPE_IDS);
export const DifficultySchema = z.enum(DIFFICULTIES);

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

export type FoundationId = z.infer<typeof FoundationIdSchema>;
export type FiveFoundationId = (typeof FIVE_FOUNDATIONS)[number];
export type ResourceTypeId = z.infer<typeof ResourceTypeIdSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Foundation = z.infer<typeof FoundationSchema>;
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
export type LearningPath = z.infer<typeof LearningPathSchema>;
