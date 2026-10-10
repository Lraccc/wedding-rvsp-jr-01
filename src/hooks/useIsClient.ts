"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False while prerendering and hydrating, true once running in the browser. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
