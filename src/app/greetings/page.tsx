import type { Metadata } from "next";
import { Video } from "lucide-react";
import { BackToInvitation } from "@/components/BackToInvitation";
import { Footer } from "@/components/Footer";
import { GreetingRecorder } from "@/components/GreetingRecorder";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

const { couple, greetings } = wedding;

export const metadata: Metadata = {
  title: `${greetings.heading} · ${couple.groom} & ${couple.bride}`,
  description: greetings.intro,
};

/**
 * Where guests record or upload a video greeting. It skips SiteShell on purpose: no envelope
 * intro, and no background music to bleed into the recording.
 */
export default function GreetingsPage() {
  return (
    <>
      <BackToInvitation />
      <main className="px-6 pt-8 pb-section">
        <SectionHeading
          as="h1"
          id="greetings-title"
          eyebrow={greetings.eyebrow}
          icon={
            <Video
              className="mx-auto mb-4 size-6 text-gold"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          }
        >
          {greetings.heading}
        </SectionHeading>
        <p className="mx-auto mt-8 max-w-2xl text-center font-serif text-[1.3rem] leading-relaxed text-balance text-rosewood italic">
          {greetings.intro}
        </p>
        <div className="mt-10">
          {greetings.cloudinary.cloudName ? (
            <GreetingRecorder />
          ) : (
            <p className="text-center text-[0.95rem] text-rosewood">
              Video greetings open soon. Please check back closer to the wedding.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
