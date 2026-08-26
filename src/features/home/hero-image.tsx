import type { CSSProperties } from 'react'

import type { CmsAsset } from '@/lib/contentful/queries'
import { contentfulImageUrl, isContentfulAsset } from '@/lib/image-loader'
import { isLocalHero, localHeroFallback, localHeroSrcSet } from '@/lib/local-image'

/**
 * The hero's two crops, art-directed with `<picture>`.
 *
 * The obvious approach — two `next/image` elements, one hidden per breakpoint —
 * is wrong in a way that only shows up under measurement. Both stay in the DOM,
 * so the hidden one reports a rendered width of zero and Next warns that `sizes`
 * disagrees with it; both carry `priority`, so the browser is told to preload two
 * hero images; and once Contentful serves genuinely different URLs per crop that
 * becomes two full-size downloads on every visit, one of them never seen.
 *
 * `<picture>` is the primitive for this: the browser evaluates the media
 * conditions before fetching and requests exactly one file. Nothing from
 * `next/image` is given up, because the custom loader already bypasses Vercel's
 * optimizer — this builds the same transform URLs directly, and adds the format
 * negotiation `next/image` could not do through a custom loader.
 *
 * The breakpoint is fixed at `lg` (64rem) to match the `.hero-focus` utility in
 * globals.css, which swaps the crop's focal point at the same width.
 */

const DESKTOP_MEDIA = '(min-width: 64rem)'

/** Widths offered to Contentful. The top two exist for 4K and retina laptops. */
const CONTENTFUL_WIDTHS = [640, 828, 1080, 1280, 1536, 1920, 2560, 3840] as const

export type HeroCrop = {
  readonly asset: CmsAsset
  readonly alt: string
  /** `object-position` for this crop, so the subject stays in frame. */
  readonly focus: string
}

type HeroImageProps = {
  readonly mobile: HeroCrop
  readonly desktop: HeroCrop
}

function contentfulSrcSet(url: string, format: 'avif' | 'webp'): string {
  return CONTENTFUL_WIDTHS.map(
    (width) => `${contentfulImageUrl(url, { width, format })} ${width}w`,
  ).join(', ')
}

/** One `<source>` per format, best first — the browser takes the first it supports. */
function Sources({ url, media }: { readonly url: string; readonly media?: string | undefined }) {
  const mediaAttr = media === undefined ? {} : { media }

  if (isContentfulAsset(url)) {
    return (
      <>
        <source
          {...mediaAttr}
          type="image/avif"
          srcSet={contentfulSrcSet(url, 'avif')}
          sizes="100vw"
        />
        <source
          {...mediaAttr}
          type="image/webp"
          srcSet={contentfulSrcSet(url, 'webp')}
          sizes="100vw"
        />
      </>
    )
  }

  if (isLocalHero(url)) {
    return (
      <>
        <source {...mediaAttr} type="image/avif" srcSet={localHeroSrcSet('avif')} sizes="100vw" />
        <source {...mediaAttr} type="image/webp" srcSet={localHeroSrcSet('webp')} sizes="100vw" />
        <source {...mediaAttr} type="image/jpeg" srcSet={localHeroSrcSet('jpeg')} sizes="100vw" />
      </>
    )
  }

  return null
}

function fallbackSrc(url: string): string {
  if (isContentfulAsset(url)) return contentfulImageUrl(url, { width: 1536, format: 'jpg' })
  if (isLocalHero(url)) return localHeroFallback()
  return url
}

export function HeroImage({ mobile, desktop }: HeroImageProps) {
  const mobileUrl = mobile.asset.url
  const desktopUrl = desktop.asset.url

  // No photograph yet — the caller renders its placeholder slot instead.
  if (mobileUrl === null || desktopUrl === null) return null

  const focus: CSSProperties & Record<'--hero-focus-mobile' | '--hero-focus-desktop', string> = {
    '--hero-focus-mobile': mobile.focus,
    '--hero-focus-desktop': desktop.focus,
  }

  return (
    <picture>
      <Sources url={desktopUrl} media={DESKTOP_MEDIA} />
      <Sources url={mobileUrl} />
      <img
        src={fallbackSrc(mobileUrl)}
        // The alt text describes the photograph, which is the same picture at
        // both crops, so one description serves both sources.
        alt={mobile.alt}
        // The LCP element: fetched eagerly, ahead of everything else on the page.
        fetchPriority="high"
        decoding="async"
        className="hero-focus size-full object-cover"
        style={focus}
      />
    </picture>
  )
}
