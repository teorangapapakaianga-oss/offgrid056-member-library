"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
let cached: Date | null = null;

/**
 * Current time, available only in the browser (null during the static render).
 * Date-relative UI ("New", upcoming workshops) must never be baked in at build time.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(
    subscribe,
    () => (cached ??= new Date()),
    () => null,
  );
}
