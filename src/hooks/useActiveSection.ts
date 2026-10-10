"use client";

import { useEffect, useState } from "react";

/**
 * Scroll spy. Returns the id of the section crossing a thin band just above the middle of
 * the viewport. While `endSentinelId` is on screen (the page is scrolled to the bottom),
 * the last id wins, because a short final section may never reach that band.
 *
 * Pass a stable `ids` array (e.g. a module-level constant) so the observers aren't rebuilt.
 */
export function useActiveSection(ids: readonly string[], endSentinelId?: string) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const inBand = new Set<string>();
    let atEnd = false;

    const update = () => {
      const current = atEnd ? ids[ids.length - 1] : ids.find((id) => inBand.has(id));
      if (current) setActive(current);
    };

    const bandObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        update();
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => bandObserver.observe(section));

    const sentinel = endSentinelId ? document.getElementById(endSentinelId) : null;
    const endObserver = sentinel
      ? new IntersectionObserver(([entry]) => {
          atEnd = entry.isIntersecting;
          update();
        })
      : null;
    if (sentinel) endObserver?.observe(sentinel);

    return () => {
      bandObserver.disconnect();
      endObserver?.disconnect();
    };
  }, [ids, endSentinelId]);

  return active;
}
