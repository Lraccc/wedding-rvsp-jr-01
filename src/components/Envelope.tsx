"use client";

import { motion, useAnimate, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useAudio } from "@/hooks/useAudio";
import { WaxSeal } from "./WaxSeal";

type Phase = "closed" | "opening" | "open";

type EnvelopeProps = {
  /** Called as soon as the letter has risen, about a second before `onOpened`. */
  onLetterOut?: () => void;
  /** Called once the letter has risen and lingered; the parent then fades the intro away. */
  onOpened: () => void;
  /** Called when a replayed intro has fully covered the page. */
  onCovered?: () => void;
  /** True when the guest brought the intro back, as opposed to the first page load. */
  isReplay?: boolean;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.55, 0, 0.9, 0.45] as const;

/** How far the letter rises, as a share of its own height. It must stay below the pocket's V. */
const LETTER_RISE = "-43.6%";

/** The sealed envelope sits this much higher (share of its height) and settles as it opens. Matches globals.css. */
const CLOSED_LIFT = "-14%";

const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: {
    opacity: 0,
    scale: 1.06,
    y: -24,
    transition: { duration: 0.95, ease: [0.4, 0, 0.2, 1] },
  },
};

const HIDDEN = { opacity: 0 } as const;

/** Shrinks the script names on the letter for longer names so they stay inside its border. */
const LETTER_NAMES_STYLE = {
  fontSize: `${Math.min(8.4, 165 / `${wedding.couple.groom} & ${wedding.couple.bride}`.length)}cqw`,
};

const part = (name: string) => `[data-part="${name}"]`;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function Envelope({ onLetterOut, onOpened, onCovered, isReplay = false }: EnvelopeProps) {
  const { envelope, couple, date } = wedding;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [phase, setPhase] = useState<Phase>("closed");
  const hasStarted = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const audio = useAudio();
  const titleId = useId();

  useEffect(() => {
    if (isReplay) buttonRef.current?.focus({ preventScroll: true });
  }, [isReplay]);

  async function open() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    setPhase("opening");

    // Must run synchronously inside the click so mobile browsers allow the audio.
    if (!audio.isMutedByGuest && !audio.isPlaying) audio.play({ fadeInMs: 2400 });

    if (reduceMotion) {
      animate(part("hint"), { opacity: 0 }, { duration: 0.2 });
      await animate(part("seal"), { opacity: 0 }, { duration: 0.3 });
      animate(part("body"), { rotate: 0, y: "0%" }, { duration: 0 });
      animate(part("flap"), { rotateX: 180, zIndex: 1 }, { duration: 0 });
      animate(part("flap-front"), { opacity: 0 }, { duration: 0 });
      animate(part("flap-inner"), { opacity: 1 }, { duration: 0 });
      await animate(part("letter"), { y: LETTER_RISE }, { duration: 0 });
      setPhase("open");
      onLetterOut?.();
      await wait(900);
      onOpened();
      return;
    }

    // 1. The seal is pressed, cracks along a hairline, and its halves fall away.
    animate(part("hint"), { opacity: 0, y: 6 }, { duration: 0.35 });
    await animate(
      part("seal"),
      { scale: [1, 0.92, 1.04, 1] },
      { duration: 0.42, ease: "easeInOut" },
    );
    await animate(part("crack"), { strokeDashoffset: [1, 0] }, { duration: 0.18, ease: "easeOut" });
    animate(part("seal-whole"), { opacity: 0 }, { duration: 0 });
    animate(part("crack"), { opacity: 0 }, { duration: 0.2, delay: 0.08 });
    animate(
      part("seal-left"),
      { x: ["0%", "-38%"], y: ["0%", "26%"], rotate: [0, -26], opacity: [1, 1, 0] },
      { duration: 0.7, ease: EASE_IN },
    );
    animate(
      part("seal-right"),
      { x: ["0%", "38%"], y: ["0%", "34%"], rotate: [0, 22], opacity: [1, 1, 0] },
      { duration: 0.7, ease: EASE_IN },
    );

    // 2. The envelope straightens and settles while the flap folds back around its top edge.
    animate(
      part("body"),
      { rotate: [-2, 0], y: [CLOSED_LIFT, "0%"] },
      { duration: 1.1, ease: EASE_OUT },
    );
    await wait(280);
    await animate(part("flap"), { rotateX: [0, 90] }, { duration: 0.42, ease: EASE_IN });
    // Edge-on now: from here on the flap shows its inner face and sits behind the letter.
    animate(part("flap"), { zIndex: 1 }, { duration: 0 });
    animate(part("flap-front"), { opacity: 0 }, { duration: 0 });
    animate(part("flap-inner"), { opacity: 1 }, { duration: 0 });
    await animate(part("flap"), { rotateX: [90, 180] }, { duration: 0.48, ease: EASE_OUT });

    // 3. The letter slides up, but only partway out of the pocket.
    await animate(part("letter"), { y: ["0%", LETTER_RISE] }, { duration: 1.05, ease: EASE_OUT });
    setPhase("open");
    onLetterOut?.();

    // 4. Linger for a beat, then hand over to the site.
    await wait(1000);
    onOpened();
  }

  return (
    <motion.div
      ref={scope}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-intro=""
      data-scroll-lock=""
      variants={overlay}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={(definition) => {
        if (definition === "visible" && isReplay) onCovered?.();
      }}
      className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto overscroll-contain bg-cream bg-[radial-gradient(ellipse_at_50%_55%,#fffdf9_0%,#faf8f5_55%,#f1e9df_100%)]"
    >
      <div className="flex min-h-full flex-col items-center px-5 pt-[max(3.5rem,8svh)] pb-10">
        <p
          id={titleId}
          className="text-center font-script text-[clamp(2.75rem,9.5vw,4.75rem)] leading-[1.15] text-espresso"
        >
          {envelope.title}
        </p>

        <div className="envelope-scene flex w-full flex-1 flex-col items-center">
          <span className="envelope-headroom" aria-hidden="true" />
          <button
            ref={buttonRef}
            type="button"
            onClick={open}
            data-state={phase}
            aria-disabled={phase !== "closed"}
            aria-label="Open the invitation"
            className="envelope-trigger"
          >
            <span className="envelope-lift">
              <span className="envelope-wiggle">
                <span className="envelope" data-part="body" aria-hidden="true">
                  <span className="envelope-back" />

                  <span className="envelope-letter" data-part="letter">
                    <span className="absolute inset-[3.2cqw] rounded-[1px] border border-taupe/70" />
                    <span className="absolute inset-[4.4cqw] rounded-[1px] border border-taupe/35" />
                    <span className="absolute inset-x-0 top-[6.6cqw] flex flex-col items-center text-center">
                      <span className="text-[1.9cqw] font-medium tracking-[0.42em] text-rose uppercase">
                        {envelope.letterGreeting}
                      </span>
                      <span
                        className="mt-[1.2cqw] font-script leading-[1.05] text-espresso"
                        style={LETTER_NAMES_STYLE}
                      >
                        {couple.groom} &amp; {couple.bride}
                      </span>
                      <span className="mt-[1cqw] font-serif text-[2.5cqw] tracking-[0.3em] text-rose">
                        {date.short}
                      </span>
                    </span>
                  </span>

                  <EnvelopePocket />

                  <span className="envelope-flap" data-part="flap">
                    <EnvelopeFlap />
                  </span>

                  <span className="envelope-seal" data-part="seal">
                    <span data-part="seal-whole">
                      <WaxSeal monogram={couple.monogram} className="size-full" />
                    </span>
                    <span data-part="seal-left" className="seal-half-left" style={HIDDEN}>
                      <WaxSeal monogram={couple.monogram} className="size-full" />
                    </span>
                    <span data-part="seal-right" className="seal-half-right" style={HIDDEN}>
                      <WaxSeal monogram={couple.monogram} className="size-full" />
                    </span>
                    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
                      <path
                        data-part="crack"
                        d="M51 3 47 14 53 27 46 41 54 55 47 70 52 84 49 97"
                        fill="none"
                        stroke="#1b130e"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                        pathLength={1}
                        strokeDasharray="1"
                        strokeDashoffset="1"
                      />
                    </svg>
                  </span>
                </span>
              </span>
            </span>
          </button>

          <span data-part="hint" className="envelope-hint block" aria-hidden="true">
            <span className="block animate-pulse-soft text-label tracking-wide-xl text-rose uppercase">
              {envelope.prompt}
            </span>
          </span>
          <span className="flex-1" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

const FLAP_PATH = "M6 0H294Q300 0 300 4L163 109.5Q150 120 137 109.5L0 4Q0 0 6 0Z";
const FLAP_EDGE = "M0 4 137 109.5Q150 120 163 109.5L300 4";
const FLAP_LINER = "M15.4 7H284.6L165.2 99Q150 108.5 134.8 99Z";

/**
 * Soft shadow along an edge, built from stacked translucent strokes. SVG blur filters look the
 * same but are slow to rasterize without a GPU, which delays the first paint in Lighthouse.
 */
function EdgeShadow({ d, dy, strength = 1 }: { d: string; dy: number; strength?: number }) {
  return (
    <g
      transform={`translate(0 ${dy})`}
      fill="none"
      stroke="#46382f"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} strokeWidth="6" strokeOpacity={0.045 * strength} />
      <path d={d} strokeWidth="3.6" strokeOpacity={0.06 * strength} />
      <path d={d} strokeWidth="1.6" strokeOpacity={0.09 * strength} />
    </g>
  );
}

function EnvelopeFlap() {
  const id = useId();
  const front = `${id}-front`;
  const inner = `${id}-inner`;

  return (
    <svg
      viewBox="0 0 300 120"
      preserveAspectRatio="none"
      className="block size-full"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ece2" />
          <stop offset="1" stopColor="#eadfd1" />
        </linearGradient>
        <linearGradient id={inner} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3ad97" />
          <stop offset="1" stopColor="#d7c6b3" />
        </linearGradient>
      </defs>
      <path data-part="flap-inner" d={FLAP_PATH} fill={`url(#${inner})`} style={HIDDEN} />
      <g data-part="flap-front">
        <EdgeShadow d={FLAP_EDGE} dy={2.4} strength={1.6} />
        <path d={FLAP_PATH} fill={`url(#${front})`} />
        <path d={FLAP_LINER} fill="none" stroke="#a88b7d" strokeOpacity="0.4" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

function EnvelopePocket() {
  const id = useId();
  const left = `${id}-left`;
  const right = `${id}-right`;
  const bottom = `${id}-bottom`;
  const clip = `${id}-clip`;

  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="none"
      className="envelope-pocket"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={left} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ebdfd0" />
          <stop offset="1" stopColor="#dccbb7" />
        </linearGradient>
        <linearGradient id={right} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#ebdfd0" />
          <stop offset="1" stopColor="#dccbb7" />
        </linearGradient>
        <linearGradient id={bottom} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e6d8c7" />
          <stop offset="1" stopColor="#efe5d9" />
        </linearGradient>
        <clipPath id={clip}>
          <rect width="300" height="200" rx="6" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <EdgeShadow d="M0 0 144 103Q151 107 144 111M300 0 156 103Q149 107 156 111" dy={-1.2} />
        <path d="M0 0 144 103Q151 107 144 111L0 200Z" fill={`url(#${left})`} />
        <path d="M300 0 156 103Q149 107 156 111L300 200Z" fill={`url(#${right})`} />
        <EdgeShadow d="M0 200 139 105Q150 96 161 105L300 200" dy={-1.2} />
        <path d="M0 200 139 105Q150 96 161 105L300 200Z" fill={`url(#${bottom})`} />
      </g>
    </svg>
  );
}
