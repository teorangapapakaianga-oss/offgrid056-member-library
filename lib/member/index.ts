"use client";
/**
 * Member state: the ONLY way UI reads member data (docs/ARCHITECTURE.md §7).
 *
 * STAGE 3 STUB: returns an empty, read-only state so the UI can be built and reviewed.
 * Stage 4 replaces the internals with the MemberStore interface + LocalMemberStore (localStorage),
 * without changing the hook's return shape used by components.
 */
import { useSyncExternalStore } from "react";

export interface MemberState {
  saved: Record<string, string>; // resourceId → ISO date saved
  completed: Record<string, string>; // resourceId → ISO date completed
  recent: { id: string; at: string }[];
  programme: { days: Record<string, { completed: boolean; completedAt?: string; notes?: string }> };
}

export const EMPTY_MEMBER_STATE: MemberState = { saved: {}, completed: {}, recent: [], programme: { days: {} } };

export interface MemberView {
  /** false during the static render and first paint; member panels show skeletons until true */
  ready: boolean;
  state: MemberState;
  completedIds: ReadonlySet<string>;
}

const EMPTY_SET: ReadonlySet<string> = new Set();
const noop = () => () => {};

export function useMemberState(): MemberView {
  const ready = useSyncExternalStore(noop, () => true, () => false);
  return { ready, state: EMPTY_MEMBER_STATE, completedIds: EMPTY_SET };
}
