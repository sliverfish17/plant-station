import type { ReactNode } from 'react'

/**
 * The non-interactive chips: plant light/water tags and the credential pills in
 * Meet Edyta. Interactive filter chips are a different component with a
 * different job — they are buttons, need a 48px tap target, and carry pressed
 * state — so they are not folded in here behind a variant.
 */

export type ChipTone = 'leaf' | 'pink' | 'credential'

const TONE_CLASS: Record<ChipTone, string> = {
  leaf: 'bg-leaf-100 text-olive-700 px-2.5 py-0.5 text-eyebrow',
  pink: 'bg-pink-100 text-pink-700 px-2.5 py-0.5 text-eyebrow',
  credential:
    'bg-pink-100 text-pink-700 border border-pink-300 min-h-chip-sm px-4 py-1.5 text-body-sm font-semibold',
}

export function Chip({
  tone = 'leaf',
  children,
}: {
  readonly tone?: ChipTone | undefined
  readonly children: ReactNode
}) {
  return (
    <span className={`inline-flex items-center rounded-pill ${TONE_CLASS[tone]}`}>{children}</span>
  )
}
