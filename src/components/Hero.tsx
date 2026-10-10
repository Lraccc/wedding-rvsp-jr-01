"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { useIntro } from "@/hooks/useIntro";
import { MAIN_TITLE_ID } from "@/lib/ids";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Reset only after a replayed envelope has faded in over the page. */
const RESET = { duration: 0, delay: 0.7 };

const sequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 22, transition: RESET },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

const photo: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.98, transition: RESET },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.3, ease: EASE } },
};

/** Screen 2: the formal invitation wording, the couple's names and their portrait. */
export function Hero() {
  const { isIntroOpen } = useIntro();
  const { hero, couple } = wedding;

  return (
    <section aria-labelledby={MAIN_TITLE_ID} className="px-6 pt-32 pb-section sm:pt-36">
      <motion.div
        variants={sequence}
        initial="hidden"
        animate={isIntroOpen ? "hidden" : "visible"}
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <motion.p
          data-reveal=""
          variants={rise}
          className="max-w-xs text-label tracking-label text-rose uppercase sm:max-w-none"
        >
          {hero.blessing}
        </motion.p>

        <motion.p
          data-reveal=""
          variants={rise}
          className="mt-8 text-label-lg tracking-wide-xl text-espresso uppercase"
        >
          {hero.intro}
        </motion.p>

        <motion.h1
          data-reveal=""
          variants={rise}
          id={MAIN_TITLE_ID}
          tabIndex={-1}
          className="mt-3 font-script text-[clamp(3.75rem,12vw,7.5rem)] leading-[1.05] font-normal outline-none"
        >
          <span className="block">
            <span className="text-gradient bg-linear-to-b from-ink via-espresso-deep to-espresso drop-shadow-[0_3px_5px_rgb(70_56_48/0.18)]">
              {couple.groom}
            </span>
          </span>{" "}
          <span className="block text-[0.42em] leading-[1.3] text-rose-light">and</span>{" "}
          <span className="block">
            <span className="text-gradient bg-linear-to-b from-rose via-rose-light to-[#b9a091] drop-shadow-[0_3px_5px_rgb(70_56_48/0.14)]">
              {couple.bride}
            </span>
          </span>
        </motion.h1>

        <motion.p
          data-reveal=""
          variants={rise}
          className="mt-7 max-w-xs text-label tracking-label text-rose uppercase sm:max-w-xl"
        >
          {hero.invitation}
        </motion.p>

        <motion.figure data-reveal="" variants={photo} className="mt-14 w-full max-w-[500px]">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            width={hero.photo.width}
            height={hero.photo.height}
            sizes="(max-width: 560px) 92vw, 500px"
            loading="eager"
            className="h-auto w-full rounded-photo bg-linen shadow-photo"
          />
        </motion.figure>
      </motion.div>
    </section>
  );
}
