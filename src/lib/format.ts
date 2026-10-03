const TIME_ZONE = "Europe/Zurich";

/** Formats a date as dd.mm.yyyy in Swiss time. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

/** Formats a date range, collapsing to a single date when start equals end. */
export function formatDateRange(from: Date, to: Date | null): string {
  if (!to || from.getTime() === to.getTime()) return formatDate(from);
  return `${formatDate(from)} – ${formatDate(to)}`;
}

/** Formats an integer amount of cents as a CHF amount, e.g. 8000 -> "CHF 80.00". */
export function formatChf(cents: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(cents / 100);
}

/**
 * Parses a user-entered CHF amount into integer cents.
 *
 * Accepts "80", "80.50", "80,50" and a leading "CHF".
 *
 * @returns The amount in cents, or null when the input is not a valid
 *   non-negative amount.
 */
export function parseChfToCents(input: string): number | null {
  const cleaned = input.replace(/chf/gi, "").replace(/'/g, "").trim().replace(",", ".");
  if (cleaned === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100);
}

/**
 * Parses a date-only form value ("yyyy-mm-dd") into a Date anchored at noon
 * UTC, so the calendar date is stable regardless of the viewer's time zone.
 */
export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a Date as a date-only input value ("yyyy-mm-dd") in Swiss time. */
export function toDateInputValue(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIME_ZONE,
  }).format(date);
  return parts;
}
