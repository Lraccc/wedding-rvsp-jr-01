"use client";

import { Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type Guest,
  GuestListError,
  type RsvpResponse,
  fetchResponses,
  toGuests,
} from "@/lib/guestList";
import { secondaryButtonClass } from "@/lib/ui";
import { toXlsx } from "@/lib/xlsx";
import { buttonClass } from "./ButtonLink";

type Problem = "locked" | "network";

/** The outcome of request number `request`. */
type Loaded =
  { request: number; responses: RsvpResponse[] } | { request: number; problem: Problem };

const shortDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  month: "short",
  day: "numeric",
});

const fullDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * The couple's list of who is coming, opened from their menu (see CoupleMenu). It is hidden,
 * not locked: anyone who finds /rsvp/guests can see it.
 */
export function GuestList() {
  const [request, setRequest] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchResponses().then(
      (responses) => {
        if (!cancelled) setLoaded({ request, responses });
      },
      (error) => {
        if (cancelled) return;
        setLoaded({ request, problem: error instanceof GuestListError ? error.reason : "network" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [request]);

  const reload = () => setRequest((count) => count + 1);
  const isLoading = loaded?.request !== request;

  // While refreshing, keep showing the last list.
  if (loaded && "responses" in loaded) {
    return <Guests responses={loaded.responses} isRefreshing={isLoading} onRefresh={reload} />;
  }

  if (loaded && "problem" in loaded && !isLoading) {
    return (
      <div className="text-center">
        <p role="alert" className="text-[0.95rem] leading-relaxed text-ruby">
          {loaded.problem === "locked"
            ? "The guest list isn’t switched on yet. In Cloudinary, untick Settings → Security → Restricted media types → Resource list."
            : "The guest list couldn’t be loaded. Please check your connection and try again."}
        </p>
        <button type="button" onClick={reload} className={buttonClass("crimson", "mt-6")}>
          <RefreshCw className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  return <Status>Opening the guest list…</Status>;
}

function Guests({
  responses,
  isRefreshing,
  onRefresh,
}: {
  responses: RsvpResponse[];
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const guests = toGuests(responses);
  const attending = guests.filter((guest) => guest.attending);
  const notAttending = guests.filter((guest) => !guest.attending);

  function downloadExcel() {
    const toRows = (list: Guest[]) =>
      list.map((guest, index) => [index + 1, guest.name, fullDate.format(guest.sentAt)]);
    const columns = [
      { header: "#", width: 6 },
      { header: "Name", width: 40 },
      { header: "RSVP sent (Philippine time)", width: 28 },
    ];
    const workbook = toXlsx([
      { name: "Attending", columns, rows: toRows(attending) },
      { name: "Not attending", columns, rows: toRows(notAttending) },
    ]);
    saveFile(workbook, `guest-list-${isoDate(new Date())}.xlsx`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <dl className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Attending" value={attending.length} />
        <Stat label="Can’t make it" value={notAttending.length} />
        <Stat label="RSVPs" value={responses.length} />
      </dl>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={downloadExcel}
          disabled={guests.length === 0}
          className={buttonClass("crimson", "disabled:opacity-50")}
        >
          <Download className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Download Excel
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={secondaryButtonClass}
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {guests.length === 0 ? (
        <Status>No RSVPs yet. They will appear here as guests respond.</Status>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <GuestGroup title="Attending" guests={attending} />
          <GuestGroup title="Can’t make it" guests={notAttending} />
        </div>
      )}

      <p className="mt-10 text-center text-[0.9rem] leading-relaxed text-rosewood">
        New RSVPs show up here within a minute. Someone who answered more than once is listed once,
        with their latest answer.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    // A label that wraps on phones still leaves the numbers in line.
    <div className="flex flex-col justify-between rounded-photo border border-gold/50 bg-paper px-2 py-4 shadow-card">
      <dt className="text-label tracking-label text-rosewood uppercase">{label}</dt>
      <dd className="mt-1 font-serif text-[2.25rem] leading-none text-crimson lining-nums">
        {value}
      </dd>
    </div>
  );
}

function GuestGroup({ title, guests }: { title: string; guests: Guest[] }) {
  return (
    <section aria-label={title}>
      <h2 className="border-b border-gold/40 pb-2 font-serif text-[1.5rem] text-crimson italic">
        {title} <span className="text-[1.1rem] text-rosewood not-italic">· {guests.length}</span>
      </h2>
      {guests.length === 0 ? (
        <p className="mt-3 text-[0.95rem] text-rosewood">No one yet.</p>
      ) : (
        <ol className="mt-1">
          {guests.map((guest, index) => (
            <li
              key={`${guest.name}-${index}`}
              className="flex items-baseline gap-3 border-b border-gold/20 py-2.5 text-[1rem] text-wine"
            >
              <span className="w-7 shrink-0 text-right text-[0.85rem] text-rosewood lining-nums">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1 break-words">{guest.name}</span>
              <span className="shrink-0 text-[0.8rem] text-rosewood">
                {shortDate.format(guest.sentAt)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Status({ children }: { children: string }) {
  return (
    <p className="mt-8 text-center text-[0.95rem] leading-relaxed text-rosewood" aria-live="polite">
      {children}
    </p>
  );
}

function saveFile(file: Blob, fileName: string) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Some browsers start the download a moment after the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Today in the Philippines, as YYYY-MM-DD. */
function isoDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(date);
}
