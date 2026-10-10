"use client";

import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { useEffect, useRef } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useIntro } from "@/hooks/useIntro";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";
import { PAGE_END_ID } from "@/lib/ids";
import { iconButtonClass } from "@/lib/ui";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "entourage", label: "Entourage" },
  { id: "photos", label: "Photos" },
  { id: "attire", label: "Attire Guide" },
  { id: "faqs", label: "FAQs" },
  { id: "rsvp", label: "RSVP" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/** Floating header: replay-intro button on the left, pill navigation in the middle. */
export function Nav() {
  const { isIntroOpen, replayIntro } = useIntro();
  const isClient = useIsClient();
  const active = useActiveSection(SECTION_IDS, PAGE_END_ID);
  const listRef = useRef<HTMLUListElement>(null);

  // On narrow screens the pill scrolls sideways; keep the active link in view.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({
      left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <motion.header
      data-reveal=""
      inert={isClient && isIntroOpen}
      initial={{ opacity: 0, y: -16 }}
      animate={isIntroOpen ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: isIntroOpen ? 0 : 0.5 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start gap-2 px-3 pt-3 sm:gap-4 sm:px-5 sm:pt-4"
    >
      <button
        type="button"
        onClick={replayIntro}
        aria-label="Replay the envelope intro"
        title="Replay the envelope"
        className={iconButtonClass}
      >
        <MailOpen className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
      </button>

      <nav
        aria-label="Sections"
        className="pointer-events-auto mx-auto min-w-0 rounded-full bg-taupe p-1 shadow-soft"
      >
        <ul
          ref={listRef}
          className="relative no-scrollbar flex overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,black_14px,black_calc(100%-14px),transparent)] md:[mask-image:none]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  data-section={item.id}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative block rounded-full px-3 py-2 text-[0.625rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-300 sm:px-4 sm:text-label sm:tracking-[0.24em]",
                    "after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-center after:bg-ink after:transition-transform after:duration-500 sm:after:inset-x-4",
                    isActive
                      ? "text-ink after:scale-x-100"
                      : "text-espresso-deep after:scale-x-0 hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Keeps the pill centered; the music toggle is fixed in this corner. */}
      <span className="size-10 shrink-0" aria-hidden="true" />
    </motion.header>
  );
}
