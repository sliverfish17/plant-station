import type { Metadata } from 'next'

import { absoluteUrl } from '@/config/navigation'
import { SITE } from '@/config/site'

/**
 * Metadata helpers.
 *
 * Every page gets a canonical, and every canonical is built from `SITE.domain`
 * (D1) rather than written out — so changing the domain cannot leave a page
 * pointing at the old one.
 *
 * Descriptions are capped at 155 characters, the length beyond which Google
 * truncates. The cap is enforced here rather than trusted to whoever writes the
 * copy, and it trims at a word boundary.
 */

const MAX_DESCRIPTION = 155

export function clampDescription(text: string): string {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= MAX_DESCRIPTION) return collapsed

  const cut = collapsed.slice(0, MAX_DESCRIPTION - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}…`
}

export type PageMetadataInput = {
  /** Without the brand suffix — the template in the root layout adds it. */
  readonly title: string
  readonly description: string
  readonly path: string
  readonly type?: 'website' | 'article'
  readonly publishedTime?: string
}

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const clamped = clampDescription(description)

  return {
    title,
    description: clamped,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.brandName}`,
      description: clamped,
      url,
      siteName: SITE.brandName,
      locale: 'en_US',
      type,
      // `images` is deliberately absent: Next resolves it from the nearest
      // `opengraph-image` file, and that URL carries a content hash. Writing one
      // here would override the real route with a guess that 404s.
      ...(publishedTime === undefined ? {} : { publishedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE.brandName}`,
      description: clamped,
    },
  }
}
