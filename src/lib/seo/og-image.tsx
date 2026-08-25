import { ImageResponse } from 'next/og'

import { SITE } from '@/config/site'

/**
 * The shared Open Graph card.
 *
 * Rendered by Satori, which supports a deliberately small slice of CSS — no
 * custom properties, no `clamp()`, no shorthand `font`. That is why the values
 * here are literals rather than tokens: they are the same colours, restated in
 * the one place that cannot read the token layer. Keeping them in a single
 * module means there is exactly one such place.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

const CREAM = '#fcf5e1'
const OLIVE = '#515927'
const PINK = '#9d2c5b'
const ESPRESSO = '#3b3125'

export type OgImageInput = {
  /** Small pink label above the title: "Project · Royal Oak", "Service". */
  readonly eyebrow?: string | undefined
  readonly title: string
  readonly description?: string | undefined
}

export function renderOgImage({ eyebrow, title, description }: OgImageInput): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
        backgroundColor: CREAM,
        // A hairline of olive down the left edge, echoing the site's bands.
        borderLeft: `24px solid ${OLIVE}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow === undefined ? null : (
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: PINK,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
        )}

        <div style={{ display: 'flex', fontSize: 68, lineHeight: 1.1, color: OLIVE }}>{title}</div>

        {description === undefined ? null : (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.4,
              color: ESPRESSO,
              marginTop: 28,
              maxWidth: 900,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width="40" height="40" viewBox="0 0 24 24">
          <path d="M12 2C6 8 6 15 12 22C18 15 18 2 12 2Z" fill={OLIVE} />
        </svg>
        <div style={{ display: 'flex', fontSize: 32, color: OLIVE }}>
          {/* TODO(D1): brand name unconfirmed. */}
          {SITE.brandName}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: ESPRESSO, marginLeft: 'auto' }}>
          {SITE.areaServedRegion}
        </div>
      </div>
    </div>,
    OG_SIZE,
  )
}
