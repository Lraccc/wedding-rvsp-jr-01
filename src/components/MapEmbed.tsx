"use client";

import { useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRef } from "react";

type MapEmbedProps = {
  src: string;
  title: string;
};

/**
 * Google Maps iframe that is only created once the guest scrolls near it. The browser's own
 * lazy loading starts ~1,250px early, which would pull ~400 KB of Maps scripts on page load.
 */
export function MapEmbed({ src, title }: MapEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isNear = useInView(ref, { once: true, margin: "300px 0px" });

  return (
    <div
      ref={ref}
      className="relative mt-7 aspect-[13/10] w-full max-w-[390px] overflow-hidden rounded-lg border border-gold/50 bg-champagne shadow-card"
    >
      <MapPin
        className="absolute top-1/2 left-1/2 size-6 -translate-1/2 text-gold"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      {isNear ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="relative size-full border-0"
        />
      ) : null}
    </div>
  );
}
