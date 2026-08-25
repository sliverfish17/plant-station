import { type ElementType, type ReactNode } from 'react'

/**
 * The full-bleed-background / capped-content-column pattern, owned once.
 *
 * Every band on the site is the same two boxes: a background that runs the whole
 * viewport width, and a content column capped at 1140px (1440) rising to 1280px
 * (1920) and centred inside it. Sections differ only in tone, so that is the
 * only knob — no per-section padding or width props to drift out of step.
 */

export type SectionTone = 'cream' | 'cream-alt' | 'olive'

const TONE_CLASS: Record<SectionTone, string> = {
  cream: 'bg-cream-page',
  // `on-dark` retargets the focus ring, which loses contrast against olive.
  'cream-alt': 'bg-cream-alt',
  olive: 'bg-olive-700 on-dark',
}

/**
 * Bands do not all share one vertical rhythm. The home page's sections use the
 * 56/96/104 scale; the listing pages use a tighter coloured header followed by a
 * grid band. Naming those cases keeps the padding in the token layer instead of
 * being overridden per-page with `!important`.
 */
export type SectionPadding = 'section' | 'band-header' | 'band-listing' | 'none'

const PADDING_CLASS: Record<SectionPadding, string> = {
  section: 'py-section',
  'band-header': 'pt-band-header-top pb-band-header-bottom',
  'band-listing': 'pt-band-listing-top pb-band-listing-bottom',
  none: '',
}

type SectionProps = {
  readonly tone?: SectionTone | undefined
  readonly pad?: SectionPadding | undefined
  readonly as?: ElementType | undefined
  readonly id?: string | undefined
  readonly className?: string | undefined
  /** Applied to the inner column, for grid or flow overrides. */
  readonly contentClassName?: string | undefined
  readonly children: ReactNode
  readonly 'aria-labelledby'?: string | undefined
}

export function Section({
  tone = 'cream',
  pad = 'section',
  as: Tag = 'section',
  id,
  className,
  contentClassName,
  children,
  'aria-labelledby': ariaLabelledBy,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`px-gutter ${PADDING_CLASS[pad]} ${TONE_CLASS[tone]} ${className ?? ''}`}
    >
      <div className={`mx-auto w-full max-w-content ${contentClassName ?? ''}`}>{children}</div>
    </Tag>
  )
}
