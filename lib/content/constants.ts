/**
 * Content vocabulary: the fixed lists and their types.
 *
 * Plain values on purpose. The browser needs these (filters, badges, thumbnails), and this module must not pull
 * in the validation library, which would add about 390 KB of JavaScript to every page. `schemas.ts` builds the
 * build-time schemas from exactly these lists, so the two can never disagree.
 */

export const FOUNDATION_IDS = ["air", "water", "shelter", "food", "energy", "general"] as const;
export const FIVE_FOUNDATIONS = ["air", "water", "shelter", "food", "energy"] as const;
export const RESOURCE_TYPE_IDS = [
  "guide", "workbook", "checklist", "planner", "assessment", "worksheet", "video",
  "tutorial", "template", "supplier-resource", "workshop", "programme", "download-pack",
] as const;
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const COLLECTION_IDS = ["start-here", "planning-tools"] as const;
export const FILE_FORMATS = ["PDF", "XLSX", "DOCX", "ZIP", "PNG"] as const;
export const COUNTRIES = ["NZ", "AU", "US", "CA"] as const;
export const SERVICE_TYPES = ["products", "installation", "advice", "assessment", "maintenance", "training"] as const;

export type FoundationId = (typeof FOUNDATION_IDS)[number];
export type FiveFoundationId = (typeof FIVE_FOUNDATIONS)[number];
export type ResourceTypeId = (typeof RESOURCE_TYPE_IDS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type CollectionId = (typeof COLLECTION_IDS)[number];
export type FileFormat = (typeof FILE_FORMATS)[number];
export type CountryCode = (typeof COUNTRIES)[number];
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const COUNTRY_NAMES: Record<CountryCode, string> = {
  NZ: "New Zealand",
  AU: "Australia",
  US: "United States",
  CA: "Canada",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  products: "Products",
  installation: "Installation",
  advice: "Advice",
  assessment: "Assessment",
  maintenance: "Maintenance",
  training: "Training",
};

/** The shapes the browser works with. The build-time schemas in `schemas.ts` produce exactly these. */
export interface Category {
  slug: string;
  name: string;
  description: string;
  /** a resource of these types joins this category automatically, as well as its own topical category */
  matchTypes?: ResourceTypeId[];
}

export interface Foundation {
  id: FoundationId;
  name: string;
  order: number;
  icon: string;
  description: string;
  categories: Category[];
}

export interface ResourceType {
  id: ResourceTypeId;
  label: string;
  plural: string;
  action: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  foundation: FoundationId;
  /** resource ids, in the order the member should work through them */
  steps: string[];
}

export interface Supplier {
  id: string;
  slug: string;
  name: string;
  category: string;
  foundations: FoundationId[];
  serviceTypes: ServiceType[];
  country: CountryCode;
  region: string;
  website: string;
  description: string;
  isDemo: boolean;
  /** when OffGrid056 last checked this listing; not required for demonstration entries */
  verifiedDate?: string;
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  endDate?: string;
  timeZone: string;
  mode: "online" | "in-person" | "hybrid";
  location: string;
  description: string;
  foundations: FoundationId[];
  /** booking happens on an external site; absent means no booking button is shown */
  bookingUrl?: string;
  bookingLabel?: string;
  videoUrl?: string;
  downloads: { label: string; resourceId?: string; fileUrl?: string }[];
  relatedResources: string[];
  isDemo: boolean;
}
