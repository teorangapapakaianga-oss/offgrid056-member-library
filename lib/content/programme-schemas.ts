/** 30-Day Resilience Programme content shapes (docs/ARCHITECTURE.md §4). V1 content is placeholder data. */
import { z } from "zod";
import { FoundationIdSchema } from "./schemas";

export const ProgrammeSchema = z
  .object({
    id: z.literal("30-day-resilience"),
    title: z.string(),
    overview: z.string(),
    isPlaceholder: z.boolean(),
    weeks: z
      .array(z.object({ number: z.number().int().min(1).max(5), title: z.string(), days: z.array(z.number().int().min(1).max(30)).min(1) }).strict())
      .min(1),
  })
  .strict();

export const ProgrammeDaySchema = z
  .object({
    day: z.number().int().min(1).max(30),
    week: z.number().int().min(1).max(5),
    title: z.string(),
    foundation: FoundationIdSchema,
    objective: z.string(),
    action: z.string(),
    estimatedTime: z.number().int().positive().max(480),
    resourceIds: z.array(z.string()),
    worksheet: z.object({ label: z.string(), resourceId: z.string().optional(), fileUrl: z.string().optional() }).strict().optional(),
    notesEnabled: z.boolean(),
    isPlaceholder: z.boolean(),
  })
  .strict();

export type Programme = z.infer<typeof ProgrammeSchema>;
export type ProgrammeDay = z.infer<typeof ProgrammeDaySchema>;
