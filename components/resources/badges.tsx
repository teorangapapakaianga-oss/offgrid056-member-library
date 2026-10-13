import type { Difficulty, FoundationId, ResourceTypeId } from "@/lib/content/constants";
import { publicationBadge } from "@/lib/content/publication";
import { getFoundation, getResourceType } from "@/lib/content/taxonomy";
import { DIFFICULTY_LABELS } from "@/lib/format";
import { FOUNDATION_STYLES } from "@/lib/foundation-style";

const pill = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide leading-5";

export function FoundationBadge({ foundation }: { foundation: FoundationId }) {
  const f = getFoundation(foundation);
  const s = FOUNDATION_STYLES[foundation];
  return (
    <span className={`${pill} ${s.surface} ${s.ink} ${s.ring}`}>
      <span className="sr-only">Foundation: </span>
      {f.name}
    </span>
  );
}

export function ResourceTypeBadge({ type }: { type: ResourceTypeId }) {
  return (
    <span className={`${pill} bg-white text-og-charcoal ring-1 ring-og-graphite/30`}>
      <span className="sr-only">Type: </span>
      {getResourceType(type).label}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const level = { beginner: 1, intermediate: 2, advanced: 3 }[difficulty];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-og-taupe">
      <span aria-hidden="true" className="inline-flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`size-1.5 rounded-full ${i <= level ? "bg-og-deep" : "bg-og-taupe/30"}`} />
        ))}
      </span>
      <span className="sr-only">Difficulty: </span>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

export function NewBadge() {
  return <span className={`${pill} bg-og-green text-og-charcoal`}>New</span>;
}

export function FeaturedBadge() {
  return <span className={`${pill} bg-og-deep text-og-white`}>Featured</span>;
}

export function DemoBadge() {
  return (
    <span className={`${pill} border border-dashed border-og-taupe bg-og-white text-og-taupe`} title="Placeholder content: the final resource will be added later">
      Demo
    </span>
  );
}

/**
 * The publication badge (Stage 10.19B). Computed from publicationStatus + releaseChannel only (see lib/content/publication.ts): an approved resource in
 * the protected preview shows "Preview". It never reads the technical `status` gate, `premium`, authentication or entitlement, and a missing, unrecognised
 * or not-yet-approved combination renders nothing (fail closed) instead of a guessed badge.
 */
export function PublicationBadge({ publicationStatus, releaseChannel }: { publicationStatus?: string; releaseChannel?: string }) {
  const badge = publicationBadge({ publicationStatus, releaseChannel });
  if (!badge) return null;
  return (
    <span className={`${pill} bg-og-charcoal text-og-green`} title={badge.tooltip}>
      {badge.label}
    </span>
  );
}
