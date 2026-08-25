/**
 * Values stamped at build time.
 *
 * The footer needs the current year, but reading the clock during render would
 * make every otherwise-static page dynamic under `cacheComponents`. `next.config.ts`
 * resolves it once at build instead, so a redeploy refreshes it.
 */
const parsed = Number.parseInt(process.env.NEXT_PUBLIC_BUILD_YEAR ?? '', 10)

export const BUILD_YEAR: number = Number.isFinite(parsed) ? parsed : 2026
