import { ExternalLink } from "lucide-react";
import { wedding } from "@/config/wedding";
import { MapEmbed } from "./MapEmbed";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Screen 4: ceremony and reception with embedded Google Maps. */
export function VenueMap() {
  return (
    <section aria-labelledby="venue-title" className="px-6 py-section">
      <SectionHeading id="venue-title">Venue Map</SectionHeading>

      <div className="mx-auto mt-14 grid max-w-5xl divide-y divide-gold/40 md:grid-cols-2 md:divide-x md:divide-y-0">
        {wedding.venues.map((venue, index) => (
          <Reveal
            key={venue.label}
            delay={index * 0.12}
            // Subgrid rows keep names, addresses and maps level across columns of any text length.
            className="row-span-5 grid grid-rows-subgrid justify-items-center py-12 text-center first:pt-0 last:pb-0 md:px-8 md:py-0 lg:px-12"
          >
            <div className="flex flex-col items-center">
              <p className="text-label tracking-label text-rosewood uppercase">{venue.label}</p>
              {venue.placeholder ? (
                <p className="mt-3 rounded-full border border-dashed border-gold bg-champagne px-3.5 py-1 text-label tracking-label text-rosewood uppercase">
                  Sample location only
                </p>
              ) : null}
            </div>
            <h3 className="mt-3 max-w-sm font-serif text-[1.65rem] leading-snug font-medium text-wine">
              {venue.name}
            </h3>
            <p className="mt-2 text-sm tracking-wide text-rosewood">{venue.address}</p>

            <MapEmbed src={venue.mapEmbedUrl} title={`Map of ${venue.name}`} />

            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 border-b border-gold pb-1 text-label tracking-label text-crimson uppercase transition-colors hover:border-crimson hover:text-garnet"
            >
              Open in Google Maps
              <ExternalLink className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
