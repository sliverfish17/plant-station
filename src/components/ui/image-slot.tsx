import { type BoxRatio, aspectClass } from './aspect'
import { LeafMark } from './leaf-mark'

/**
 * The placeholder that stands in until Contentful has a photograph.
 *
 * It occupies exactly the box the real image will occupy, so swapping a
 * placeholder for a photo shifts nothing. The slot label names what belongs
 * there and at what ratio, which is what makes an empty grid legible to whoever
 * is filling the CMS rather than just visibly unfinished.
 */

type ImageSlotProps = {
  readonly ratio: BoxRatio
  /** The full caption, e.g. "Portrait — Edyta · 4:5". Composed by the caller,
   * because the design's slot captions describe the crop as well as the ratio. */
  readonly label: string
  readonly rounded?: 'image' | 'image-sm' | 'card' | undefined
  readonly className?: string | undefined
  /** Suppresses the caption where the design shows a bare tinted block. */
  readonly showLabel?: boolean | undefined
}

const ROUNDED_CLASS = {
  image: 'rounded-image',
  'image-sm': 'rounded-image-sm',
  card: 'rounded-card',
} as const

export function ImageSlot({
  ratio,
  label,
  rounded = 'image',
  className,
  showLabel = true,
}: ImageSlotProps) {
  return (
    <div
      className={`flex ${aspectClass(ratio)} ${ROUNDED_CLASS[rounded]} w-full flex-col items-center justify-center gap-2 bg-leaf-200 p-3 text-center ${className ?? ''}`}
    >
      <LeafMark size={44} className="text-olive-700 opacity-15" />
      {showLabel ? (
        <span className="text-caption leading-snug text-taupe-dark">{label}</span>
      ) : null}
    </div>
  )
}
