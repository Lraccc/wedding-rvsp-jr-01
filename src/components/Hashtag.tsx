import { Camera, Gem, Heart } from "lucide-react";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Screen 6: how guests share their photos with the wedding hashtag, then a full-width photo. */
export function Hashtag() {
  const { hashtag, couple } = wedding;

  return (
    <section aria-labelledby="hashtag-title" className="pt-section">
      <div className="px-6 text-center">
        <SectionHeading
          id="hashtag-title"
          eyebrow={hashtag.eyebrow}
          icon={
            <Camera
              className="mx-auto mb-4 size-6 text-gold"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          }
        >
          {hashtag.heading}
        </SectionHeading>

        <Reveal className="mx-auto mt-8 max-w-3xl">
          <p className="font-serif text-[1.3rem] leading-relaxed text-balance text-rosewood italic">
            {hashtag.intro}
          </p>
          {/* A compact list on phones; three columns from the small breakpoint up. */}
          <ol className="mx-auto mt-10 grid w-fit gap-5 sm:w-auto sm:grid-cols-3 sm:gap-6">
            {hashtag.steps.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-4 text-left sm:flex-col sm:gap-3 sm:text-center"
              >
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/60 font-serif text-xl text-crimson lining-nums"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="max-w-56 text-[0.95rem] leading-relaxed text-wine">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-12">
          <Gem className="mx-auto size-5 text-gold" strokeWidth={1.25} aria-hidden="true" />
          <p className="mt-3 font-serif text-[clamp(1.3rem,6.4vw,3rem)] leading-tight font-medium tracking-[0.02em] break-words text-crimson">
            {hashtag.tag}
          </p>
          <p className="mx-auto mt-6 max-w-xl font-serif text-[1.3rem] leading-relaxed text-rosewood italic">
            {hashtag.closing}
          </p>
          <p className="mt-8 font-serif text-lg text-rosewood italic">{hashtag.signOff}</p>
          <p className="mt-1 inline-flex items-center gap-2 font-script text-[clamp(2rem,7vw,2.6rem)] leading-tight text-crimson">
            {couple.groom} &amp; {couple.bride}
            <Heart
              className="size-4 shrink-0 fill-current text-gold"
              strokeWidth={0}
              aria-hidden="true"
            />
          </p>
        </Reveal>
      </div>

      <Reveal rise={0} className="mt-16 sm:mt-20">
        <Image
          src={hashtag.photo.src}
          alt={hashtag.photo.alt}
          width={hashtag.photo.width}
          height={hashtag.photo.height}
          sizes="100vw"
          style={{ objectPosition: hashtag.photo.position }}
          className="h-auto max-h-[88svh] w-full bg-champagne object-cover"
        />
      </Reveal>
    </section>
  );
}
