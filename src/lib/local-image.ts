/**
 * The one photograph that ships from `public/` rather than from Contentful.
 *
 * A custom `next/image` loader cannot resize a local file — it can only hand
 * back the URL it was given — so the derivatives are generated ahead of time by
 * `npm run build:hero` and described here. This module is the only thing that
 * knows the naming convention, and it disappears along with the script once the
 * hero comes from the CMS.
 */

/** Must match `WIDTHS` in scripts/build-hero-derivatives.js. */
const WIDTHS = [640, 828, 1080, 1280, 1536] as const

const BASE = '/hero/edyta-garden'

/** The URL the seed content points at, and the only one this module answers to. */
export const LOCAL_HERO_SRC = '/hero-edyta-garden.jpeg'

export type LocalImageFormat = 'avif' | 'webp' | 'jpeg'

export function isLocalHero(src: string): boolean {
  return src === LOCAL_HERO_SRC || src.startsWith(BASE)
}

export function localHeroSrcSet(format: LocalImageFormat): string {
  return WIDTHS.map((width) => `${BASE}-${width}.${format} ${width}w`).join(', ')
}

/** The `<img src>` fallback: the widest JPEG, for anything that ignores srcset. */
export function localHeroFallback(): string {
  return `${BASE}-${WIDTHS[WIDTHS.length - 1]}.jpeg`
}
