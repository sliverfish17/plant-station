/**
 * next/image loader that talks to Contentful's Images API directly.
 *
 * Routing through Vercel's optimizer would mean a second fetch, a second cache
 * and a second bill for transforms Contentful already performs at the edge — so
 * `next.config.ts` sets `loader: 'custom'` and points here instead.
 *
 * Non-Contentful sources (the local hero fallback, anything under /public) pass
 * through untouched: they are already the right bytes.
 */

const CONTENTFUL_ASSET_HOST = 'images.ctfassets.net'

/** Quality values allowlisted in `next.config.ts` → `images.qualities`. */
const DEFAULT_QUALITY = 75

export type ImageLoaderArgs = {
  src: string
  width: number
  quality?: number | undefined
}

export function isContentfulAsset(src: string): boolean {
  return src.includes(CONTENTFUL_ASSET_HOST)
}

/**
 * Builds a Contentful transform URL. Exported separately from the default
 * loader so `blurDataURL` generation and OG-image rendering can reuse it
 * without pretending to be next/image.
 */
export type ContentfulTransform = {
  width: number
  quality?: number
  height?: number
  fit?: 'fill' | 'pad' | 'crop' | 'thumb' | 'scale'
  /** Defaults to AVIF; `<picture>` sources ask for one format each. */
  format?: 'avif' | 'webp' | 'jpg' | 'png'
}

export function contentfulImageUrl(
  src: string,
  { width, quality = DEFAULT_QUALITY, height, fit, format = 'avif' }: ContentfulTransform,
): string {
  const url = new URL(src, 'https:')
  url.searchParams.set('w', String(Math.round(width)))
  if (height !== undefined) url.searchParams.set('h', String(Math.round(height)))
  if (fit !== undefined) url.searchParams.set('fit', fit)
  url.searchParams.set('fm', format)
  url.searchParams.set('q', String(quality))
  return url.toString()
}

export default function contentfulLoader({ src, width, quality }: ImageLoaderArgs): string {
  if (!isContentfulAsset(src)) return src
  return contentfulImageUrl(src, { width, quality: quality ?? DEFAULT_QUALITY })
}
