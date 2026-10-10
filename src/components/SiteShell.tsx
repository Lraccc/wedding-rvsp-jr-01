"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { wedding } from "@/config/wedding";
import { AudioProvider } from "@/hooks/useAudio";
import { IntroContext } from "@/hooks/useIntro";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";
import { MAIN_TITLE_ID } from "@/lib/ids";
import { Envelope } from "./Envelope";
import { FloralDecor } from "./FloralDecor";
import { MusicToggle } from "./MusicToggle";
import { Nav } from "./Nav";

/**
 * Client wrapper around the static page content: owns the envelope intro state,
 * background music, and the fixed UI (vines, header, music toggle).
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [isReplay, setIsReplay] = useState(false);
  // The page is fully covered by the envelope, so it isn't rendered until the letter is out.
  const [isContentRendered, setIsContentRendered] = useState(false);
  const hasRevealed = useRef(false);
  const isClient = useIsClient();

  // The first time, land on the section a shared link points to (e.g. /#rsvp).
  const revealPage = () => {
    const { hash } = window.location;
    const target = !hasRevealed.current && hash ? document.getElementById(hash.slice(1)) : null;
    hasRevealed.current = true;
    if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
    else document.getElementById(MAIN_TITLE_ID)?.focus({ preventScroll: true });
  };

  const closeIntro = useCallback(() => setIsIntroOpen(false), []);
  const replayIntro = useCallback(() => {
    setIsReplay(true);
    setIsIntroOpen(true);
  }, []);

  const intro = useMemo(
    () => ({ isIntroOpen, closeIntro, replayIntro }),
    [isIntroOpen, closeIntro, replayIntro],
  );

  return (
    <MotionConfig reducedMotion="user">
      <AudioProvider src={wedding.music.src} volume={wedding.music.volume}>
        <IntroContext value={intro}>
          <FloralDecor />
          <Nav />
          <MusicToggle />

          <AnimatePresence initial={false} onExitComplete={revealPage}>
            {isIntroOpen ? (
              <Envelope
                key="intro"
                isReplay={isReplay}
                onLetterOut={() => setIsContentRendered(true)}
                onOpened={closeIntro}
                onCovered={() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                  setIsContentRendered(false);
                }}
              />
            ) : null}
          </AnimatePresence>

          {/* Until hydration the content stays interactive, so the page still works without JS. */}
          <div
            className={cn("relative z-10", !isContentRendered && "content-deferred")}
            inert={isClient && isIntroOpen}
          >
            {children}
          </div>
        </IntroContext>
      </AudioProvider>
    </MotionConfig>
  );
}
