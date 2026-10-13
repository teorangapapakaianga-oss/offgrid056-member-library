/**
 * Publication governance (Stage 10.19B).
 *
 * Five concepts that must stay separate (owner ruling, Stage 10.19A):
 *   status                 the technical / build-state gate (draft, published, archived): decides whether a build loads the record
 *   publicationStatus      editorial / publication governance state
 *   releaseChannel         environment / audience state
 *   accessProtection       whether access protection exists (Cloudflare Access): authentication, never read here
 *   entitlementRequirement whether a member is entitled to a resource: not implemented, never read here
 *
 * The visible badge is computed from publicationStatus + releaseChannel ONLY. It does not read `status`, `premium`, authentication, the migration
 * state, programme membership or anything from the OffGrid056 OS. Pure and browser-safe (no validation library).
 */
import { PUBLICATION_STATUSES, RELEASE_CHANNELS } from "./constants";

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];

export interface PublicationBadgeSpec {
  label: "Preview";
  tooltip: string;
}

/** The exact owner-approved tooltip for an approved resource in the protected preview. */
export const PREVIEW_TOOLTIP = "Approved resource in the protected OffGrid056 preview.";

/**
 * The owner-approved combinations. Only these map to a badge; nothing else is given a public-facing meaning.
 * A combination that is not listed here, including every combination of recognised values the owner has not yet approved, shows NO badge (fail closed).
 */
const APPROVED_BADGES: readonly { publicationStatus: PublicationStatus; releaseChannel: ReleaseChannel; badge: PublicationBadgeSpec }[] = [
  { publicationStatus: "approved", releaseChannel: "private-preview", badge: { label: "Preview", tooltip: PREVIEW_TOOLTIP } },
];

/** The visible badge for a resource, or null. Missing, unrecognised or not-yet-approved combinations return null: no badge, never a guessed one. */
export function publicationBadge(r: { publicationStatus?: unknown; releaseChannel?: unknown }): PublicationBadgeSpec | null {
  const hit = APPROVED_BADGES.find((x) => x.publicationStatus === r.publicationStatus && x.releaseChannel === r.releaseChannel);
  return hit ? hit.badge : null;
}

/** True when the pair is an owner-approved combination (used by the build-time validator, which fails a real resource that is not). */
export function isApprovedPublication(r: { publicationStatus?: unknown; releaseChannel?: unknown }): boolean {
  return publicationBadge(r) !== null;
}
