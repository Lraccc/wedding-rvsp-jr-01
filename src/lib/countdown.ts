const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole calendar days from the local date of `from` until a YYYY-MM-DD date. */
export function daysUntil(isoDate: string, from: Date) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target - today) / DAY_MS);
}

/** Calls `onDayChange` just after every local midnight. Returns an unsubscribe function. */
export function subscribeToMidnight(onDayChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;

  const schedule = () => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    timer = setTimeout(
      () => {
        onDayChange();
        schedule();
      },
      nextMidnight.getTime() - now.getTime() + 1000,
    );
  };

  schedule();
  return () => clearTimeout(timer);
}
