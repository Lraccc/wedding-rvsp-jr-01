"use client";

import { AnimatePresence, motion, type PanInfo, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/config/wedding";
import { useIsClient } from "@/hooks/useIsClient";

type LightboxProps = {
  photos: Photo[];
  index: number | null;
  onChange: (index: number | null) => void;
};

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 500;

const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction: number) => ({ x: direction * -80, opacity: 0, transition: { duration: 0.3 } }),
};

const controlClass =
  "grid size-11 place-items-center rounded-full bg-white/10 text-paper backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-paper";

function trapFocus(event: KeyboardEvent, container: HTMLElement | null) {
  const focusable = container?.querySelectorAll<HTMLElement>("button:not([disabled])");
  if (!focusable || focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Full-screen photo viewer: arrow keys, swipe, Escape to close, focus kept inside. */
export function Lightbox({ photos, index, onChange }: LightboxProps) {
  const isClient = useIsClient();
  const [direction, setDirection] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;

  // Move focus into the viewer, then back to the thumbnail that opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => opener?.focus({ preventScroll: true });
  }, [isOpen]);

  if (!isClient) return null;

  const photo = index === null ? null : photos[index];

  const show = (step: number) => {
    if (index === null) return;
    setDirection(step);
    onChange((index + step + photos.length) % photos.length);
  };

  const close = () => onChange(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") close();
    else if (event.key === "ArrowRight") show(1);
    else if (event.key === "ArrowLeft") show(-1);
    else if (event.key === "Tab") trapFocus(event, dialogRef.current);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) show(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) show(-1);
  };

  return createPortal(
    <AnimatePresence>
      {photo && index !== null ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          data-scroll-lock=""
          onKeyDown={onKeyDown}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink/92 px-3 py-16 backdrop-blur-sm"
        >
          <div
            className="relative h-[min(78svh,56rem)] w-[min(94vw,72rem)]"
            onClick={(event) => event.stopPropagation()}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={photo.src}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="94vw"
                  draggable={false}
                  className="pointer-events-none object-contain select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <p
            className="mt-5 text-center text-label tracking-label text-paper/80 uppercase"
            aria-live="polite"
          >
            {index + 1} / {photos.length}
            <span className="sr-only">: {photo.alt}</span>
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close photo viewer"
            className={`${controlClass} absolute top-4 right-4`}
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              show(-1);
            }}
            aria-label="Previous photo"
            className={`${controlClass} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              show(1);
            }}
            aria-label="Next photo"
            className={`${controlClass} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}
          >
            <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
