"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "./ButtonLink";

/** Plays the combined greetings video, or explains that it isn't ready yet. */
export function CompilationPlayer({ src }: { src: string }) {
  const [isMissing, setIsMissing] = useState(false);

  return (
    <div className="mx-auto max-w-4xl text-center">
      {isMissing ? (
        <p className="mx-auto max-w-xl rounded-photo border border-gold/50 bg-paper p-6 text-[0.95rem] leading-relaxed text-rosewood shadow-card">
          The video isn&apos;t ready yet. Greetings are put together every few hours, so please
          check back soon.
        </p>
      ) : (
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          onError={() => setIsMissing(true)}
          className="aspect-video w-full rounded-photo bg-ink shadow-photo"
        />
      )}
      <ButtonLink href={src} className="mt-8">
        <Download className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Download the video
      </ButtonLink>
    </div>
  );
}
