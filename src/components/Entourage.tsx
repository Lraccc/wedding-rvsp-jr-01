import { wedding, type EntourageGroup } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

/**
 * Lays the columns out row by row, so the nth names of each column (e.g. a sponsor couple)
 * stay on the same line even when one of them wraps on a narrow screen.
 */
function GroupGrid({ group }: { group: EntourageGroup }) {
  const { columns } = group;
  const rows = Math.max(...columns.map((column) => column.names.length));
  const hasHeadings = columns.some((column) => column.heading);

  return (
    <div
      className={cn("grid gap-x-3 gap-y-1.5 sm:gap-x-10", COLUMNS[columns.length] ?? COLUMNS[1])}
    >
      {hasHeadings
        ? columns.map((column, index) => (
            <p
              key={`heading-${index}`}
              className="mb-1 self-end font-serif text-lg leading-snug text-rosewood italic sm:text-xl"
            >
              {column.heading}
            </p>
          ))
        : null}
      {Array.from({ length: rows }, (_, row) =>
        columns.map((column, index) => (
          <p
            key={`${row}-${index}`}
            className="font-serif text-[1.02rem] leading-snug text-wine sm:text-[1.2rem]"
          >
            {column.names[row]}
          </p>
        )),
      )}
    </div>
  );
}

export function Entourage() {
  return (
    <section
      id="entourage"
      aria-labelledby="entourage-title"
      className="scroll-mt-nav px-5 py-section sm:px-6"
    >
      <SectionHeading id="entourage-title" eyebrow="The Wedding">
        Entourage
      </SectionHeading>

      <div className="mx-auto mt-14 max-w-3xl space-y-14">
        {wedding.entourage.map((group, groupIndex) => (
          <Reveal key={groupIndex} className="text-center">
            {group.title ? (
              <h3 className="mb-5 text-label-lg font-medium tracking-label text-crimson uppercase">
                {group.title}
              </h3>
            ) : null}
            <GroupGrid group={group} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
