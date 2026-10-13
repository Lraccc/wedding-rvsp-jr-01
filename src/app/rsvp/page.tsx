import type { Metadata } from "next";
import { MailOpen } from "lucide-react";
import { BackToInvitation } from "@/components/BackToInvitation";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

const { couple, date, rsvp } = wedding;

export const metadata: Metadata = {
  title: `RSVP · ${couple.groom} & ${couple.bride}`,
  description: `Let ${couple.groom} & ${couple.bride} know if you can celebrate with them on ${date.display}. Please respond on or before ${rsvp.deadline}.`,
};

/**
 * The RSVP form, opened from the RSVP section of the invitation. Like /greetings, it skips
 * SiteShell: no envelope intro and no background music.
 */
export default function RsvpPage() {
  return (
    <>
      <BackToInvitation />
      <main className="px-6 pt-8 pb-section">
        <SectionHeading
          as="h1"
          id="rsvp-title"
          eyebrow="Kindly Respond"
          icon={
            <MailOpen
              className="mx-auto mb-4 size-6 text-gold"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          }
        >
          RSVP
        </SectionHeading>

        <div className="mx-auto mt-8 max-w-xl text-center">
          <p className="font-serif text-[1.35rem] leading-relaxed text-balance text-crimson italic">
            {rsvp.tagline}
          </p>
          <p className="mt-3 text-[1rem] leading-relaxed text-balance text-wine">{rsvp.intro}</p>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-label-lg tracking-label text-wine uppercase">
          Please respond on or before{" "}
          <span className="font-semibold text-crimson">{rsvp.deadline}</span>
        </p>

        <div className="mt-8">
          {rsvp.cloudinary.cloudName ? (
            <RsvpForm />
          ) : (
            <div className="text-center">
              <ButtonLink href={rsvp.formUrl}>Open the RSVP form</ButtonLink>
            </div>
          )}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center font-serif text-[1.3rem] leading-relaxed text-balance text-rosewood italic">
          {rsvp.closing}
        </p>
      </main>
      <Footer linkToGuestList />
    </>
  );
}
