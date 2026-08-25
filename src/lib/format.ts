/**
 * Date formatting, fixed to en-US.
 *
 * The locale is pinned rather than taken from the request: these pages are
 * statically rendered and cached, so a request-derived locale would either force
 * dynamic rendering or — worse — bake one visitor's locale into everyone's page.
 */
const MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const LONG_DATE = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "May 2026" — the blog card and detail eyebrow. */
export function formatMonthYear(iso: string): string {
  return MONTH_YEAR.format(new Date(iso))
}

/** "15 June 2026" in US order — used where a full date is meaningful. */
export function formatLongDate(iso: string): string {
  return LONG_DATE.format(new Date(iso))
}

/** The `datetime` value for a `<time>` element: date only, no time component. */
export function toDateAttribute(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10)
}
