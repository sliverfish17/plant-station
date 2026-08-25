import type { ReactNode } from 'react'

/**
 * The card shell: ivory ground, 16px radius, soft shadow, and — critically — a
 * flex column, so that a card's footer can be pushed to the bottom with
 * `mt-auto` and every card in a row ends up the same height whatever its copy
 * does. Cards on the olive band swap ivory for the page cream, per the design.
 *
 * Content is passed as children rather than through `title`/`caption`/`showLink`
 * props: the cards differ enough in structure that a shared prop list would be
 * a union of everything any card might need.
 */

export type CardTone = 'ivory' | 'cream'

const TONE_CLASS: Record<CardTone, string> = {
  ivory: 'bg-ivory-card shadow-card',
  // On the olive band the shadow is invisible, so the card carries none.
  cream: 'bg-cream-page',
}

type CardProps = {
  readonly tone?: CardTone | undefined
  readonly as?: 'div' | 'li' | 'article' | undefined
  readonly className?: string | undefined
  readonly children: ReactNode
}

export function Card({ tone = 'ivory', as: Tag = 'article', className, children }: CardProps) {
  return (
    <Tag
      className={`flex h-full flex-col rounded-card p-3.5 ${TONE_CLASS[tone]} ${className ?? ''}`}
    >
      {children}
    </Tag>
  )
}

/** Small uppercase label above a card title: "PROJECT", "BLOG · May 2026". */
export function Eyebrow({
  tone = 'pink',
  children,
}: {
  readonly tone?: 'pink' | 'olive' | undefined
  readonly children: ReactNode
}) {
  return (
    <p
      className={`mt-3 text-eyebrow font-semibold tracking-eyebrow uppercase ${
        tone === 'pink' ? 'text-pink-700' : 'text-olive-700'
      }`}
    >
      {children}
    </p>
  )
}
