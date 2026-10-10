import { Suspense } from "react";
import { AttireGuide } from "@/components/AttireGuide";
import { Countdown } from "@/components/Countdown";
import { Entourage } from "@/components/Entourage";
import { Faqs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hashtag } from "@/components/Hashtag";
import { Hero } from "@/components/Hero";
import { ImportantNotes } from "@/components/ImportantNotes";
import { Rsvp } from "@/components/Rsvp";
import { SiteShell } from "@/components/SiteShell";
import { VenueMap } from "@/components/VenueMap";
import { wedding } from "@/config/wedding";
import { daysUntil } from "@/lib/countdown";

// Evaluated at build time; the countdown recomputes it in each visitor's browser.
const daysAtBuild = daysUntil(wedding.date.iso, new Date());

export default function Home() {
  return (
    <SiteShell>
      {/*
        Nothing here suspends. The boundary lets React hydrate the page in small chunks after
        the envelope is interactive, instead of one long task that delays the first paint.
      */}
      <Suspense>
        <main>
          <div id="home" className="scroll-mt-nav">
            <Hero />
            <Countdown initialDays={daysAtBuild} />
            <VenueMap />
            <ImportantNotes />
            <Hashtag />
          </div>
          <Entourage />
          <Gallery />
          <AttireGuide />
          <Faqs />
          <Rsvp />
        </main>
        <Footer />
      </Suspense>
    </SiteShell>
  );
}
