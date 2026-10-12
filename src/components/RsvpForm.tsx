"use client";

import { CircleCheck, Send } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { uploadText } from "@/lib/cloudinary";
import { cn } from "@/lib/cn";
import { NAME_SEPARATOR, RSVP_TAG } from "@/lib/guestList";
import { fieldClass, secondaryButtonClass } from "@/lib/ui";
import { buttonClass } from "./ButtonLink";

type Answer = "yes" | "no";

type Step = "form" | "sending" | "sent";

/** `names`: only spaces were typed. `send`: the upload failed. */
type Problem = "names" | "send";

const sentAtFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  dateStyle: "long",
  timeStyle: "short",
});

/** The questions from the couple's Google Form. Each response is saved to Cloudinary as text. */
export function RsvpForm() {
  const { rsvp } = wedding;
  const { questions } = rsvp;

  const [step, setStep] = useState<Step>("form");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [names, setNames] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);
  const thankYouRef = useRef<HTMLParagraphElement>(null);
  const baseId = useId();

  // The form is replaced by the thank-you, so move focus there for screen readers.
  useEffect(() => {
    if (step === "sent") thankYouRef.current?.focus();
  }, [step]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer) return;

    const attendees = names
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    if (attendees.length === 0) {
      setProblem("names");
      return;
    }

    setProblem(null);
    setStep("sending");
    try {
      await uploadText({
        ...rsvp.cloudinary,
        text: toText(answer, attendees),
        fileName: `${slugify(attendees[0])}-${answer === "yes" ? "attending" : "not-attending"}.txt`,
        context: { attending: answer, names: attendees.join(`${NAME_SEPARATOR} `) },
        tags: [RSVP_TAG, answer === "yes" ? "attending" : "not-attending"],
      });
      setStep("sent");
    } catch (uploadError) {
      console.error(uploadError);
      setProblem("send");
      setStep("form");
    }
  }

  function startOver() {
    setAnswer(null);
    setNames("");
    setProblem(null);
    setStep("form");
  }

  if (step === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-photo border border-gold/50 bg-paper p-6 text-center shadow-card sm:p-8">
        <CircleCheck className="mx-auto size-10 text-gold" strokeWidth={1.25} aria-hidden="true" />
        <p
          ref={thankYouRef}
          tabIndex={-1}
          className="mt-4 font-serif text-[1.4rem] leading-snug text-crimson italic outline-none"
        >
          {answer === "yes" ? rsvp.thankYou.yes : rsvp.thankYou.no}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/" className={buttonClass()}>
            Back to the invitation
          </Link>
          <button type="button" onClick={startOver} className={secondaryButtonClass}>
            Send another RSVP
          </button>
        </div>
      </div>
    );
  }

  const options: { value: Answer; label: string }[] = [
    { value: "yes", label: questions.yes },
    { value: "no", label: questions.no },
  ];

  return (
    <form
      onSubmit={send}
      className="mx-auto max-w-xl rounded-photo border border-gold/50 bg-paper p-6 shadow-card sm:p-8"
    >
      <fieldset disabled={step === "sending"} className="space-y-7">
        <fieldset>
          <legend className="text-label tracking-label text-rosewood uppercase">
            {questions.attend} <RequiredMark />
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-[2px] border px-4 py-3 text-[1rem] text-wine transition-colors duration-300",
                  answer === option.value
                    ? "border-crimson bg-champagne"
                    : "border-gold/60 bg-ivory hover:bg-champagne/50",
                )}
              >
                <input
                  type="radio"
                  name={`${baseId}-attend`}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={() => setAnswer(option.value)}
                  required
                  className="size-4 shrink-0 accent-crimson"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block" htmlFor={`${baseId}-names`}>
          <span className="text-label tracking-label text-rosewood uppercase">
            {questions.names}: <RequiredMark />
          </span>
          <textarea
            id={`${baseId}-names`}
            value={names}
            onChange={(event) => setNames(event.target.value)}
            required
            maxLength={500}
            rows={3}
            autoComplete="name"
            placeholder="e.g. Juan Dela Cruz"
            aria-describedby={`${baseId}-names-hint`}
            className={cn(fieldClass, "resize-y")}
          />
          <span id={`${baseId}-names-hint`} className="mt-2 block text-[0.9rem] text-rosewood">
            One name per line, if you are answering for more than one guest.
          </span>
        </label>
      </fieldset>

      <div className="mt-8 flex justify-center">
        <button type="submit" disabled={step === "sending"} className={buttonClass()}>
          <Send className="size-4" strokeWidth={1.5} aria-hidden="true" />
          {step === "sending" ? "Sending…" : "Send RSVP"}
        </button>
      </div>

      {problem === "names" ? (
        <p role="alert" className="mt-6 text-center text-[0.95rem] leading-relaxed text-ruby">
          Please write the complete name of each attendee.
        </p>
      ) : null}

      {problem === "send" ? (
        <p role="alert" className="mt-6 text-center text-[0.95rem] leading-relaxed text-ruby">
          Your RSVP couldn’t be sent. Please check your connection and try again.
          {rsvp.formUrl ? (
            <>
              {" "}
              You can also answer on{" "}
              <a
                href={rsvp.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-crimson"
              >
                our Google Form
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}

function RequiredMark() {
  return (
    <span className="text-ruby" aria-hidden="true">
      *
    </span>
  );
}

/** The response as the couple will read it in Cloudinary. */
function toText(answer: Answer, attendees: string[]) {
  const { couple, date, rsvp } = wedding;
  return [
    `RSVP · ${couple.groom} & ${couple.bride} · ${date.display}`,
    "",
    rsvp.questions.attend,
    answer === "yes" ? rsvp.questions.yes : rsvp.questions.no,
    "",
    `${rsvp.questions.names}:`,
    ...attendees,
    "",
    `Sent ${sentAtFormat.format(new Date())}, Philippine time`,
    "",
  ].join("\n");
}

/** A readable file name for the Media Library, e.g. "juan-dela-cruz". */
function slugify(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  return slug || "guest";
}
