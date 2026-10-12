import { wedding } from "@/config/wedding";
import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Rsvp() {
  const { rsvp } = wedding;

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-title"
      className="flex min-h-[70svh] scroll-mt-nav flex-col justify-center px-6 py-section"
    >
      <SectionHeading id="rsvp-title" eyebrow="Kindly Respond">
        RSVP
      </SectionHeading>

      <Reveal className="mx-auto mt-8 max-w-xl text-center">
        <p className="font-serif text-[1.35rem] leading-relaxed text-rosewood italic">
          {rsvp.message}
        </p>
        <p className="mt-6 text-label-lg tracking-label text-wine uppercase">
          Please respond on or before{" "}
          <span className="font-semibold text-crimson">{rsvp.deadline}</span>
        </p>
        <ButtonLink href="/rsvp" className="mt-9">
          RSVP Here
        </ButtonLink>
      </Reveal>
    </section>
  );
}
