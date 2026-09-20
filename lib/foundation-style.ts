/**
 * Foundation colour treatments (owner decision D1): the six locked brand colours only, no new colours.
 * Every foundation is always shown with its icon and name too, so nothing relies on colour alone.
 */
import type { FoundationId } from "@/lib/content/constants";

export interface FoundationStyle {
  /** thumbnail / badge surface */
  surface: string;
  /** text on that surface */
  ink: string;
  /** hairline so light surfaces stay visible on white cards */
  ring: string;
  /** subtle hatch colour for placeholder thumbnails (rgba) */
  hatch: string;
}

export const FOUNDATION_STYLES: Record<FoundationId, FoundationStyle> = {
  air: { surface: "bg-og-white", ink: "text-og-deep", ring: "ring-1 ring-og-deep/40", hatch: "rgba(53,85,26,0.10)" },
  water: { surface: "bg-og-deep", ink: "text-og-white", ring: "", hatch: "rgba(244,242,234,0.08)" },
  shelter: { surface: "bg-og-graphite", ink: "text-og-white", ring: "", hatch: "rgba(244,242,234,0.12)" },
  food: { surface: "bg-og-taupe", ink: "text-og-white", ring: "", hatch: "rgba(244,242,234,0.10)" },
  energy: { surface: "bg-og-green", ink: "text-og-charcoal", ring: "", hatch: "rgba(17,19,15,0.08)" },
  // Charcoal with a Resilience Green hatch, kept visibly different from Shelter's graphite + warm-white hatch.
  general: { surface: "bg-og-charcoal", ink: "text-og-white", ring: "", hatch: "rgba(168,207,32,0.20)" },
};
