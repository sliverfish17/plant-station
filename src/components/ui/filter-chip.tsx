'use client'

/**
 * A filter chip. Interactive, so it is a real `<button>` with a 48px tap target
 * and `aria-pressed` — a styled `<div>` with a click handler would look
 * identical and be invisible to assistive technology.
 *
 * Two tones because the chips sit on two different grounds: cream on the
 * Projects & Blog header, olive on the Favorite Plants header, where an olive
 * outline would vanish.
 */

export type FilterChipTone = 'on-cream' | 'on-olive'

const TONE_CLASS: Record<FilterChipTone, { active: string; idle: string }> = {
  'on-cream': {
    active: 'bg-pink-600 border-pink-600 text-white',
    idle: 'bg-transparent border-sage-500 text-olive-700 hover:bg-leaf-100',
  },
  'on-olive': {
    active: 'bg-pink-100 border-pink-100 text-pink-700',
    idle: 'bg-transparent border-olive-600 text-on-dark-cream hover:bg-olive-600/40',
  },
}

export function FilterChip({
  label,
  isActive,
  onSelect,
  tone = 'on-cream',
  controls,
}: {
  readonly label: string
  readonly isActive: boolean
  readonly onSelect: () => void
  readonly tone?: FilterChipTone | undefined
  /** Id of the grid this chip filters, so the relationship is announced. */
  readonly controls?: string | undefined
}) {
  const palette = TONE_CLASS[tone]

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      aria-controls={controls}
      className={`min-h-chip cursor-pointer rounded-pill border-2 px-5 text-ui font-semibold transition-colors duration-(--duration-hover) ${
        isActive ? palette.active : palette.idle
      }`}
    >
      {label}
    </button>
  )
}
