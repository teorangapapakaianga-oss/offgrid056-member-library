/** Suppliers & Services and Workshops & Events (docs/ARCHITECTURE.md §5). V1 data is demonstration only. */
import { z } from "zod";
import { FoundationIdSchema } from "./schemas";

export const COUNTRIES = ["NZ", "AU", "US", "CA"] as const;
export const COUNTRY_NAMES: Record<(typeof COUNTRIES)[number], string> = {
  NZ: "New Zealand",
  AU: "Australia",
  US: "United States",
  CA: "Canada",
};
export const SERVICE_TYPES = ["products", "installation", "advice", "assessment", "maintenance", "training"] as const;
export const SERVICE_TYPE_LABELS: Record<(typeof SERVICE_TYPES)[number], string> = {
  products: "Products",
  installation: "Installation",
  advice: "Advice",
  assessment: "Assessment",
  maintenance: "Maintenance",
  training: "Training",
};

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const SupplierSchema = z
  .object({
    id: z.string().regex(/^sup-\d{4}$/),
    slug,
    name: z.string().min(3),
    category: z.string().min(3),
    foundations: z.array(FoundationIdSchema).min(1),
    serviceTypes: z.array(z.enum(SERVICE_TYPES)).min(1),
    country: z.enum(COUNTRIES),
    region: z.string().min(2),
    website: z.url({ protocol: /^https$/ }),
    description: z.string().min(10).max(300),
    isDemo: z.boolean(),
    verifiedDate: z.string().optional(),
  })
  .strict();

export const WorkshopSchema = z
  .object({
    id: z.string().regex(/^wks-\d{4}$/),
    slug,
    title: z.string().min(3),
    startDate: z.iso.datetime({ offset: true }),
    endDate: z.iso.datetime({ offset: true }).optional(),
    timeZone: z.string().min(3),
    mode: z.enum(["online", "in-person", "hybrid"]),
    location: z.string().min(3),
    description: z.string().min(10),
    foundations: z.array(FoundationIdSchema).default([]),
    videoUrl: z.url({ protocol: /^https$/ }).optional(),
    downloads: z
      .array(z.object({ label: z.string(), resourceId: z.string().optional(), fileUrl: z.string().optional() }).strict())
      .default([]),
    relatedResources: z.array(z.string()).default([]),
    isDemo: z.boolean(),
  })
  .strict();

export type Supplier = z.infer<typeof SupplierSchema>;
export type Workshop = z.infer<typeof WorkshopSchema>;
export type CountryCode = (typeof COUNTRIES)[number];
export type ServiceType = (typeof SERVICE_TYPES)[number];
