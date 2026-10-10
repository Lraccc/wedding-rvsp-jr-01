"use client";

import { createContext, useContext } from "react";

type IntroControls = {
  /** True while the envelope covers the page. */
  isIntroOpen: boolean;
  /** Called by the envelope once its opening sequence has finished. */
  closeIntro: () => void;
  /** Shows the sealed envelope again. */
  replayIntro: () => void;
};

export const IntroContext = createContext<IntroControls | null>(null);

export function useIntro() {
  const controls = useContext(IntroContext);
  if (!controls) throw new Error("useIntro must be used inside <SiteShell>.");
  return controls;
}
