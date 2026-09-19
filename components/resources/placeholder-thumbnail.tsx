import type { FoundationId, ResourceTypeId } from "@/lib/content/schemas";
import { getFoundation, getResourceType } from "@/lib/content/taxonomy";
import { FOUNDATION_STYLES } from "@/lib/foundation-style";

/** General resources use the tool icon that best matches their type. */
function iconFor(foundation: FoundationId, type: ResourceTypeId): string {
  if (foundation !== "general") return getFoundation(foundation).icon;
  if (type === "assessment") return "/icons/og-icon-assessment.svg";
  if (type === "checklist") return "/icons/og-icon-checklist.svg";
  if (type === "planner" || type === "template" || type === "worksheet") return "/icons/og-icon-planning.svg";
  return "/icons/og-icon-review.svg";
}

/**
 * Branded placeholder thumbnail (owner decision C): foundation colour treatment + foundation icon + resource type,
 * with an "IMAGE TO COME" tag so it is obvious final imagery will be added later. No image file is needed.
 */
export function PlaceholderThumbnail({
  foundation,
  type,
  className = "",
  size = "card",
}: {
  foundation: FoundationId;
  type: ResourceTypeId;
  className?: string;
  size?: "card" | "hero";
}) {
  const s = FOUNDATION_STYLES[foundation];
  const hero = size === "hero";
  return (
    <div
      className={`relative flex aspect-[16/9] items-center overflow-hidden ${s.surface} ${s.ink} ${className}`}
      style={{ backgroundImage: `repeating-linear-gradient(135deg, ${s.hatch} 0 2px, transparent 2px 14px)` }}
      role="img"
      aria-label={`Placeholder image: ${getFoundation(foundation).name} ${getResourceType(type).label.toLowerCase()}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, tiny local SVG */}
      <img
        src={iconFor(foundation, type)}
        alt=""
        width={hero ? 96 : 56}
        height={hero ? 96 : 56}
        className={`${hero ? "ml-8 size-24" : "ml-5 size-14"} shrink-0`}
        loading="lazy"
      />
      <div className={`${hero ? "ml-6" : "ml-4"} min-w-0 pr-4`}>
        <p className={`font-display leading-none ${hero ? "text-4xl" : "text-2xl"}`}>{getResourceType(type).label}</p>
        <p className={`mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-80`}>{getFoundation(foundation).name}</p>
      </div>
      <span className="absolute right-2 bottom-2 rounded-sm border border-current/40 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] opacity-80">
        Image to come
      </span>
    </div>
  );
}
