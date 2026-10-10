"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/cn";
import { iconButtonClass } from "@/lib/ui";

/** Speaker button in the top-right corner, shown on the envelope and on the site. */
export function MusicToggle() {
  const { isPlaying, isAvailable, toggle } = useAudio();
  if (!isAvailable) return null;

  const Icon = isPlaying ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Background music"
      aria-pressed={isPlaying}
      title={isPlaying ? "Pause music" : "Play music"}
      className={cn(iconButtonClass, "fixed top-3 right-3 z-[60] sm:top-4 sm:right-5")}
    >
      {isPlaying ? (
        <span
          className="absolute inset-0 animate-ring rounded-full border border-gold"
          aria-hidden="true"
        />
      ) : null}
      <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
