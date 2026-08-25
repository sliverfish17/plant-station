/**
 * The ratio table from the handoff. Every image on the site sits in a box with a
 * fixed aspect ratio, which is what makes cumulative layout shift structurally
 * impossible rather than merely unlikely — the space is reserved before a byte
 * of image data arrives.
 */

export const ASPECT_RATIOS = {
  /** Hero, desktop. */
  '16:9': 'aspect-[16/9]',
  /** Hero on mobile, and the Meet Edyta portrait. */
  '4:5': 'aspect-[4/5]',
  /** Plant photographs. */
  '1:1': 'aspect-square',
  /** Project before/after tiles and blog thumbnails. */
  '3:2': 'aspect-[3/2]',
  /** Detail-page lead image — a centre crop of the 3:2 asset. */
  '2:1': 'aspect-[2/1]',
} as const

export type AspectRatio = keyof typeof ASPECT_RATIOS

/**
 * `'fill'` means "take the height the grid row already has".
 *
 * The project card needs it: an after-only project renders one full-width tile
 * whose height must match what a before/after *pair* would have been, so that
 * every card in a row lines up. That height comes from an invisible sizer in the
 * grid, not from a ratio on the image itself.
 */
export type BoxRatio = AspectRatio | 'fill'

export function aspectClass(ratio: BoxRatio): string {
  return ratio === 'fill' ? 'h-full' : ASPECT_RATIOS[ratio]
}

/**
 * `sizes` per grid, so the browser never downloads a 1440px-wide file to paint a
 * 264px card. Each value describes the *rendered* width at each breakpoint, and
 * is derived from the artboards: content column 1140px at 1440, 1280px at 1920,
 * minus gaps, divided by the column count.
 */
export const IMAGE_SIZES = {
  /** Full-bleed hero. */
  hero: '100vw',
  /** Meet Edyta portrait: 78% of a 390 viewport, then a fixed 440/480 column. */
  portrait: '(min-width: 1920px) 480px, (min-width: 1440px) 440px, 78vw',
  /** Favorite Plants: 4 columns at 1440, 2 on mobile. */
  plantCard: '(min-width: 1440px) 264px, (min-width: 768px) 33vw, 45vw',
  /** One tile of a before/after pair — half a card, minus the 8px gap. */
  projectTile: '(min-width: 1440px) 164px, (min-width: 768px) 22vw, 45vw',
  /** A full-width card image: blog thumbnail, or an after-only project. */
  cardFull: '(min-width: 1440px) 336px, (min-width: 768px) 45vw, 92vw',
  /** Detail-page lead image, capped at the 1000px lead column. */
  lead: '(min-width: 1000px) 1000px, 100vw',
  /** The before/after pair inside the detail article column (860px, two up). */
  detailPair: '(min-width: 860px) 422px, 92vw',
} as const

export type ImageSizesKey = keyof typeof IMAGE_SIZES
