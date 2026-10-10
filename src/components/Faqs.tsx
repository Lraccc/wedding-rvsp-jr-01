"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Accordion of frequently asked questions; one answer open at a time. */
export function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faqs" aria-labelledby="faqs-title" className="scroll-mt-nav px-6 py-section">
      <SectionHeading id="faqs-title" eyebrow="Good to Know">
        FAQs
      </SectionHeading>

      <Reveal className="mx-auto mt-12 max-w-2xl divide-y divide-gold/40 border-y border-gold/40">
        {wedding.faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-q${index}`;
          const panelId = `${baseId}-a${index}`;

          return (
            <div key={faq.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.3rem] leading-snug text-wine transition-colors hover:text-crimson sm:text-[1.4rem]"
                >
                  {faq.question}
                  <Plus
                    className={cn(
                      "size-5 shrink-0 text-crimson transition-transform duration-500",
                      isOpen && "rotate-45",
                    )}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pr-10 pb-6 text-[0.98rem] leading-relaxed text-rosewood">
                      {faq.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
