import type { Difficulty, FoundationId, ResourceTypeId } from "@/lib/content/constants";
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
 * Only ever seen in a preview build, where drafts are loaded alongside published resources
 * (`OG056_INCLUDE_DRAFTS=1`). A production build never loads a draft, so this never renders there.
 *
 * Without it an imported, unreviewed resource looks exactly like approved content, which is a poor thing to
 * hand someone who is reviewing it.
 */
export function DraftBadge() {
  return (
    <span className={`${pill} bg-og-charcoal text-og-green`} title="Draft: imported but not yet approved for members">
      Draft
    </span>
  );
}
