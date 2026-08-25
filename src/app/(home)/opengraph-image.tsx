import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Garden design and plant care in Metro Detroit'

/**
 * The home page's card.
 *
 * Next associates an `opengraph-image` file with the page it sits beside, and it
 * does **not** cascade to other segments — a route group is enough to break the
 * association. So every page that should have a social card carries its own
 * file, and a page without one ships no card at all: correct-looking markup, and
 * a blank preview everywhere the link is shared.
 */

export default function OpengraphImage() {
  return renderOgImage({
    title: 'Gardens that grow with you.',
    description: 'Michigan garden design, planting, and plant care, tailored to how you live.',
  })
}
