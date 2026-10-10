"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useIntro } from "@/hooks/useIntro";

/*
 * Hand-drawn line-art vine in a 140 × 900 box. The stem hugs the outer edge; branches,
 * leaves, flowers and dots reach inward. Each layer is merged into a single path (sorted
 * top to bottom) so the browser lays out a few shapes instead of hundreds, and the
 * stroke-drawing animation still travels down the vine.
 */
const STEM = "M22-10C40 70 6 130 24 210S44 340 20 420 2 540 28 620 46 760 22 840 14 900 26 920";

const BRANCHES =
  "M21 130C40 118 58 106 80 84M36 290C58 296 76 310 100 304M34 360C50 346 60 328 62 306M6 500C30 512 56 516 84 498M16 580C38 566 52 552 72 556M43 705C64 714 84 732 102 726M30 812C48 800 60 782 62 758";

const TENDRILS =
  "M62 306c5-8 15-6 14 3-1 7-10 8-11 2-1-4 4-6 6-3M8 462c-8-6-4-16 4-15 6 1 6 8 1 9M62 758c5-8 15-6 14 3-1 7-10 8-11 2-1-4 4-6 6-3";

/** [x, y, angle in degrees (0 points right), length] */
const LEAVES: Array<[number, number, number, number]> = [
  [27, 47, -40, 24],
  [23, 100, 25, 20],
  [66, 99, -60, 16],
  [52, 110, 15, 17],
  [38, 121, -70, 18],
  [19, 170, -55, 22],
  [25, 222, 30, 22],
  [56, 297, -45, 18],
  [72, 306, 40, 17],
  [88, 308, -30, 16],
  [38, 330, -20, 20],
  [46, 346, 0, 16],
  [21, 410, 35, 22],
  [8, 470, -35, 20],
  [28, 510, 40, 18],
  [64, 512, 30, 16],
  [46, 514, -35, 18],
  [6, 540, 20, 22],
  [50, 557, 25, 15],
  [34, 569, -60, 17],
  [20, 600, -45, 22],
  [42, 688, -25, 20],
  [60, 714, -40, 18],
  [78, 727, 35, 17],
  [92, 729, -20, 15],
  [40, 772, 35, 22],
  [44, 800, 10, 16],
  [18, 862, -40, 22],
];

/** [x, y, scale, rotation] */
const FLOWERS: Array<[number, number, number, number]> = [
  [103, 303, 1, 10],
  [87, 496, 0.9, -15],
  [105, 724, 1, 20],
];

/** [x, y, angle the bud points to] */
const BUDS: Array<[number, number, number]> = [
  [29, 28, -70],
  [81, 83, -40],
  [73, 556, -10],
];

/** [x, y, radius] */
const DOTS: Array<[number, number, number]> = [
  [70, 70, 1.4],
  [58, 90, 1],
  [92, 96, 1.1],
  [52, 262, 1],
  [114, 290, 1.3],
  [119, 305, 0.9],
  [111, 318, 1],
  [73, 330, 1.2],
  [97, 484, 1.4],
  [66, 486, 1],
  [101, 509, 1],
  [86, 546, 1.1],
  [83, 571, 0.9],
  [60, 630, 0.9],
  [48, 642, 1.2],
  [113, 711, 1.3],
  [117, 738, 1],
  [74, 745, 1.1],
  [96, 747, 1],
  [50, 872, 0.9],
  [36, 882, 1.1],
];

type Point = [number, number];

/** Rotates, scales and moves local shape points into the vine's coordinate space. */
function place(points: Point[], x: number, y: number, angle: number, scale = 1) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians) * scale;
  const sin = Math.sin(radians) * scale;
  return points.map(([px, py]) => {
    const tx = x + px * cos - py * sin;
    const ty = y + px * sin + py * cos;
    return `${Math.round(tx * 10) / 10} ${Math.round(ty * 10) / 10}`;
  });
}

function leaf(x: number, y: number, angle: number, l: number) {
  const [start, c1, c2, tip, c3, c4, end, vein, veinCtrl, veinEnd] = place(
    [
      [0, 0],
      [l * 0.3, -l * 0.3],
      [l * 0.72, -l * 0.26],
      [l, 0],
      [l * 0.72, l * 0.26],
      [l * 0.3, l * 0.3],
      [0, 0],
      [l * 0.12, 0],
      [l * 0.5, -l * 0.04],
      [l * 0.84, 0],
    ],
    x,
    y,
    angle,
  );
  return `M${start}C${c1} ${c2} ${tip}C${c3} ${c4} ${end}ZM${vein}Q${veinCtrl} ${veinEnd}`;
}

/** Teardrop pointing "up" in local space (-90°). */
const TEARDROP: Point[] = [
  [0, 0],
  [-3.6, -3.4],
  [-3.2, -9.6],
  [0, -11.5],
  [3.2, -9.6],
  [3.6, -3.4],
  [0, 0],
];

function teardrop(x: number, y: number, angle: number, scale = 1) {
  const [start, c1, c2, tip, c3, c4, end] = place(TEARDROP, x, y, angle, scale);
  return `M${start}C${c1} ${c2} ${tip}C${c3} ${c4} ${end}Z`;
}

function bud(x: number, y: number, pointsTo: number) {
  const angle = pointsTo + 90;
  const [base, l1, l2, l3, r1, r2, r3] = place(
    [
      [0, 0],
      [-2.5, -1.5],
      [-4, -4],
      [-4.2, -6.5],
      [2.5, -1.5],
      [4, -4],
      [4.2, -6.5],
    ],
    x,
    y,
    angle,
  );
  return `${teardrop(x, y, angle, 0.95)}M${base}C${l1} ${l2} ${l3}M${base}C${r1} ${r2} ${r3}`;
}

const dot = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const LEAF_PATH = LEAVES.map(([x, y, angle, length]) => leaf(x, y, angle, length)).join("");
const PETAL_PATH = FLOWERS.map(([x, y, scale, rotation]) =>
  [0, 72, 144, 216, 288].map((petal) => teardrop(x, y, rotation + petal, scale)).join(""),
).join("");
const BUD_PATH = BUDS.map(([x, y, angle]) => bud(x, y, angle)).join("");
const DOT_PATH = [
  ...FLOWERS.map(([x, y, scale]) => dot(x, y, 1.8 * scale)),
  ...DOTS.map(([x, y, r]) => dot(x, y, r)),
].join("");

/** [path, delay (s), duration (s)] for each stroked layer. */
const STROKES: Array<[string, number, number]> = [
  [STEM, 0, 2.8],
  [BRANCHES, 0.3, 2.6],
  [LEAF_PATH, 0.5, 3],
  [TENDRILS, 0.9, 2.4],
  [BUD_PATH, 0.8, 2.4],
  [PETAL_PATH, 1, 2.4],
];

function makeVariants(reduceMotion: boolean): { stroke: Variants; fill: Variants } {
  const instant = { duration: 0 };
  // Reset only after a replayed envelope has faded in over the page.
  const reset = { duration: 0, delay: 0.7 };
  return {
    stroke: {
      hidden: { pathLength: 0, opacity: 0, transition: reset },
      visible: ([delay, duration]: [number, number]) => ({
        pathLength: 1,
        opacity: 1,
        transition: reduceMotion
          ? instant
          : {
              pathLength: { delay, duration, ease: "easeInOut" },
              opacity: { delay, duration: 0.2 },
            },
      }),
    },
    fill: {
      hidden: { opacity: 0, transition: reset },
      visible: { opacity: 1, transition: reduceMotion ? instant : { delay: 1.6, duration: 1 } },
    },
  };
}

function Vine({ className }: { className?: string }) {
  const { isIntroOpen } = useIntro();
  const { stroke, fill } = makeVariants(useReducedMotion() ?? false);

  return (
    <motion.svg
      viewBox="0 0 140 900"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      animate={isIntroOpen ? "hidden" : "visible"}
      className={className}
    >
      {STROKES.map(([d, delay, duration]) => (
        <motion.path key={d} d={d} variants={stroke} custom={[delay, duration]} />
      ))}
      <motion.path d={DOT_PATH} fill="currentColor" stroke="none" variants={fill} />
    </motion.svg>
  );
}

const vineSize =
  "h-[min(94svh,60rem)] w-auto opacity-80 max-lg:h-[80svh] max-lg:opacity-60 max-sm:h-[56svh] max-sm:opacity-30";

/** Line-art vines fixed to the left and right edges, behind the content. */
export function FloralDecor() {
  const [isMounted, setIsMounted] = useState(false);

  // The vines stay hidden behind the envelope at first, so keep them off the critical path.
  useEffect(() => {
    const show = () => setIsMounted(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(show, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(show, 800);
    return () => clearTimeout(id);
  }, []);

  if (!isMounted) return null;

  return (
    <div aria-hidden="true" className="text-rose-light">
      <div className="pointer-events-none fixed inset-y-0 left-0 z-0 flex items-center">
        <Vine className={vineSize} />
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-0 z-0 flex -scale-x-100 items-center">
        <Vine className={vineSize} />
      </div>
    </div>
  );
}
