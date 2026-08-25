/**
 * The single leaf path from the design bundle. It appears as the logo mark, the
 * drawer watermark, and the glyph inside empty image slots — one shape, three
 * jobs, so it is one component with a `tone` rather than three copies of a path.
 */

type LeafMarkProps = {
  readonly size: number
  /** Decorative by default; only the logo instance carries a label. */
  readonly label?: string | undefined
  readonly className?: string | undefined
}

export function LeafMark({ size, label, className }: LeafMarkProps) {
  const decorative = label === undefined

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={label}
      focusable="false"
    >
      <path d="M12 2C6 8 6 15 12 22C18 15 18 2 12 2Z" fill="currentColor" />
    </svg>
  )
}
