/**
 * The six service glyphs from the design bundle, drawn as strokes on a 24px
 * grid. `iconKey` is a validated dropdown in Contentful, so an editor cannot
 * introduce a key with no icon — but an unknown key still falls back to the leaf
 * rather than rendering an empty circle.
 */

export const SERVICE_ICON_KEYS = [
  'consulting',
  'planters',
  'soil',
  'houseplants',
  'design',
  'maintenance',
] as const

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number]

export function isServiceIconKey(value: string): value is ServiceIconKey {
  return SERVICE_ICON_KEYS.some((key) => key === value)
}

const PATHS: Record<ServiceIconKey, React.ReactNode> = {
  consulting: (
    <>
      <circle cx="12" cy="11" r="7" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  planters: (
    <>
      <path d="M5 8H19L17 20H7Z" />
      <path d="M12 8V4" />
    </>
  ),
  soil: (
    <>
      <path d="M4 10H20" />
      <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="13" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  houseplants: (
    <>
      <path d="M12 13C9 10 9 6 12 3C15 6 15 10 12 13Z" />
      <path d="M8 16H16L15 21H9Z" />
    </>
  ),
  design: <path d="M12 3L21 12L12 21L3 12Z" />,
  maintenance: (
    <>
      <path d="M5 5L19 19" />
      <path d="M19 5L5 19" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
}

const FALLBACK = <path d="M12 2C6 8 6 15 12 22C18 15 18 2 12 2Z" fill="currentColor" />

export function ServiceIcon({
  iconKey,
  size = 28,
}: {
  readonly iconKey: string
  readonly size?: number | undefined
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
    >
      {isServiceIconKey(iconKey) ? PATHS[iconKey] : FALLBACK}
    </svg>
  )
}
