"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { wedding, type Photo } from "@/config/wedding";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const WIDE_SCREEN = "(min-width: 1024px)";

function subscribeToWidth(onChange: () => void) {
  const query = window.matchMedia(WIDE_SCREEN);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getColumnCount = () => (window.matchMedia(WIDE_SCREEN).matches ? 3 : 2);
const getServerColumnCount = () => 2;

/**
 * Masonry layout: each photo goes into the column that is currently shortest, so the columns
 * end at similar heights and the photos still read left to right in their configured order.
 */
function toColumns(photos: Photo[], count: number) {
  const columns = Array.from({ length: count }, () => ({
    height: 0,
    items: [] as Array<{ photo: Photo; index: number }>,
  }));
  photos.forEach((photo, index) => {
    const shortest = columns.reduce((best, column) =>
      column.height < best.height ? column : best,
    );
    shortest.items.push({ photo, index });
    // Height relative to column width, plus roughly one gap.
    shortest.height += photo.height / photo.width + 0.05;
  });
  return columns.map((column) => column.items);
}

/** Masonry photo grid; each photo opens in a lightbox. */
export function Gallery() {
  const photos = wedding.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const columnCount = useSyncExternalStore(subscribeToWidth, getColumnCount, getServerColumnCount);

  return (
    <section
      id="photos"
      aria-labelledby="photos-title"
      className="scroll-mt-nav px-4 py-section sm:px-6"
    >
      <SectionHeading id="photos-title" eyebrow="Our Story">
        Photos
      </SectionHeading>

      <div className="mx-auto mt-14 flex max-w-6xl items-start gap-3 sm:gap-4">
        {toColumns(photos, columnCount).map((items, column) => (
          <ul key={column} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
            {items.map(({ photo, index }) => (
              <li key={photo.src}>
                <Reveal delay={column * 0.08}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    aria-label={`View photo ${index + 1} of ${photos.length}: ${photo.alt}`}
                    className="group block w-full cursor-zoom-in overflow-hidden rounded-md bg-champagne shadow-card"
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <Lightbox photos={photos} index={openIndex} onChange={setOpenIndex} />
    </section>
  );
}
