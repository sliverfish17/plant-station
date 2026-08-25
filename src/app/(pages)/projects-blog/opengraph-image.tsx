import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Projects & Blog'

/**
 * Per-page card. Next's image files apply to their own segment and do not
 * cascade to children, so a page without one of these ships no social card at
 * all — which looks fine in the markup and blank everywhere the link is shared.
 */
export default function OpengraphImage() {
  return renderOgImage({
    title: 'Garden Projects & Blog',
    description: 'Gardens around Metro Detroit, and notes on what actually grows well here.',
  })
}
