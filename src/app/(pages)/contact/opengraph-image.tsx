import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Contact'

/**
 * Per-page card. Next's image files apply to their own segment and do not
 * cascade to children, so a page without one of these ships no social card at
 * all — which looks fine in the markup and blank everywhere the link is shared.
 */
export default function OpengraphImage() {
  return renderOgImage({
    title: "Let's talk about your garden.",
    description: 'A free 15-minute call — no pressure, no obligation.',
  })
}
