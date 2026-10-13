import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { BackToInvitation } from "@/components/BackToInvitation";
import { CompilationPlayer } from "@/components/CompilationPlayer";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

const { couple, greetings } = wedding;

export const metadata: Metadata = {
  title: `${greetings.heading} · ${couple.groom} & ${couple.bride}`,
  description: `Video greetings for ${couple.groom} & ${couple.bride} from their family and friends.`,
};

/** The couple's page for the combined video, opened from their menu (see CoupleMenu). */
export default function GreetingsWatchPage() {
  return (
    <>
      <BackToInvitation />
      <main className="px-6 pt-8 pb-section">
        <SectionHeading
          as="h1"
          id="watch-title"
          eyebrow="From your family and friends"
          icon={
            <Heart
              className="mx-auto mb-4 size-5 text-gold"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          }
        >
          {greetings.heading}
        </SectionHeading>
        <div className="mt-12">
          <CompilationPlayer src={greetings.compilationUrl} />
        </div>
      </main>
      <Footer />
    </>
  );
}
