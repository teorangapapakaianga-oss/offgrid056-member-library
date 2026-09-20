"use client";
/**
 * React access to member state. Components use these hooks and never touch storage directly
 * (docs/ARCHITECTURE.md §7). Swapping `LocalMemberStore` for a server-backed store is the only change needed
 * when accounts arrive.
 */
import { useCallback, useSyncExternalStore } from "react";
import { LocalMemberStore, INITIAL_VIEW, type MemberStore } from "./store";
import type { MemberView } from "./types";

export * from "./types";
export { mergeStates } from "./store";
export type { MemberStore } from "./store";

/** One store for the whole app, so every view updates together the moment something changes. */
export const memberStore: MemberStore = new LocalMemberStore();

const getServerSnapshot = () => INITIAL_VIEW;

export function useMemberState(): MemberView {
  return useSyncExternalStore(
    useCallback((listener: () => void) => memberStore.subscribe(listener), []),
    () => memberStore.getSnapshot(),
    getServerSnapshot,
  );
}

export function useSaved(resourceId: string) {
  const { ready, savedIds } = useMemberState();
  const saved = savedIds.has(resourceId);
  return { ready, saved, toggle: () => memberStore.setSaved(resourceId, !saved) };
}

export function useCompletion(resourceId: string) {
  const { ready, completedIds } = useMemberState();
  const completed = completedIds.has(resourceId);
  return { ready, completed, toggle: () => memberStore.setCompleted(resourceId, !completed) };
}

export function useProgrammeDay(day: number) {
  const { ready, state } = useMemberState();
  const entry = state.programme.days[String(day)];
  return {
    ready,
    completed: entry?.completed ?? false,
    notes: entry?.notes ?? "",
    setCompleted: (v: boolean) => memberStore.setDayCompleted(day, v),
    setNotes: (v: string) => memberStore.setDayNotes(day, v),
  };
}
