import Image from "next/image";
import { wedding } from "@/config/wedding";
import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";

/** Screen 6: the wedding hashtag, the shared Drive link and a full-width photo. */
export function Hashtag() {
  const { hashtag } = wedding;

  return (
    <section aria-labelledby="hashtag-title" className="pt-section">
      <Reveal className="px-6 text-center">
        <h2
          id="hashtag-title"
          className="font-serif text-[clamp(1.3rem,6.4vw,3.6rem)] leading-tight font-medium tracking-[0.02em] break-words text-espresso"
        >
          {hashtag.tag}
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-serif text-[1.3rem] leading-relaxed text-rose italic">
          {hashtag.message}
        </p>
        <ButtonLink href={hashtag.driveUrl} className="mt-9">
          Upload Photos
        </ButtonLink>
      </Reveal>

      <Reveal rise={0} className="mt-16 sm:mt-20">
        <Image
          src={hashtag.photo.src}
          alt={hashtag.photo.alt}
          width={hashtag.photo.width}
          height={hashtag.photo.height}
          sizes="100vw"
          style={{ objectPosition: hashtag.photo.position }}
          className="h-auto max-h-[88svh] w-full bg-linen object-cover"
        />
      </Reveal>
    </section>
  );
}
