import { Section, type SectionTone } from '@/components/ui/section'
import type { ReactNode } from 'react'

/**
 * The banded page header the two listing pages share: h1, intro, and a row of
 * filter chips passed in as children.
 *
 * The chips are a slot rather than a prop because they are interactive and live
 * in a client component; the header itself stays a Server Component and never
 * learns what filtering means.
 */
export function PageHeader({
  title,
  intro,
  tone = 'cream-alt',
  children,
}: {
  readonly title: string
  readonly intro: string
  readonly tone?: SectionTone | undefined
  readonly children?: ReactNode
}) {
  const onOlive = tone === 'olive'

  return (
    <Section tone={tone} pad="band-header" aria-labelledby="page-heading">
      <h1
        id="page-heading"
        className={`text-page-title leading-tight ${onOlive ? 'text-pink-heading-dark' : ''}`}
      >
        {title}
      </h1>
      <p
        className={`mt-3 max-w-[60ch] text-lead leading-normal ${onOlive ? 'text-on-dark-sand' : ''}`}
      >
        {intro}
      </p>
      {children === undefined ? null : <div className="mt-7">{children}</div>}
    </Section>
  )
}
