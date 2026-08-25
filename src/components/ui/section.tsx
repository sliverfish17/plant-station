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

type SectionProps = {
  readonly tone?: SectionTone | undefined
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
      className={`px-gutter py-section ${TONE_CLASS[tone]} ${className ?? ''}`}
    >
      <div className={`mx-auto w-full max-w-content ${contentClassName ?? ''}`}>{children}</div>
    </Tag>
  )
}
