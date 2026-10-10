"use client";

import { useCallback, useSyncExternalStore } from "react";
import { daysUntil, subscribeToMidnight } from "@/lib/countdown";

const serverSnapshot = () => null;

/**
 * Days from the visitor's local date until `isoDate`, refreshed at midnight.
 * Returns null during prerendering and hydration so server and client HTML match.
 */
export function useDaysUntil(isoDate: string) {
  const getSnapshot = useCallback(() => daysUntil(isoDate, new Date()), [isoDate]);
  return useSyncExternalStore(subscribeToMidnight, getSnapshot, serverSnapshot);
}
