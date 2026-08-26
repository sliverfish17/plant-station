import Image from 'next/image'

import type { CmsAsset } from '@/lib/contentful/queries'
import { contentfulImageUrl, isContentfulAsset } from '@/lib/image-loader'

import { type BoxRatio, aspectClass } from './aspect'
import { ImageSlot } from './image-slot'

/**
 * A CMS image inside its fixed-ratio box.
 *
 * An asset link can be absent (an optional before-image) or present but empty
 * (an entry published before the photograph was taken). Both cases render the
 * placeholder at exactly the same dimensions, which is why neither can cause a
 * layout shift or a broken-image icon.
 *
 * `alt` is a required prop with no default, and the CMS marks alt text required
 * at the model level, so an image cannot reach this component undescribed.
 */

type CmsImageProps = {
  readonly asset: CmsAsset | null
  readonly alt: string
  readonly ratio: BoxRatio
  readonly sizes: string
  /** Slot label used when there is nothing to render yet. */
  readonly slotLabel: string
  readonly priority?: boolean | undefined
  readonly rounded?: keyof typeof ROUNDED_CLASS | undefined
  readonly className?: string | undefined
  /** Shifts the crop; the hero needs Edyta and the flower bed both in frame. */
  readonly objectPosition?: string | undefined
  readonly showSlotLabel?: boolean | undefined
}

const ROUNDED_CLASS = {
  image: 'rounded-image',
  'image-sm': 'rounded-image-sm',
  card: 'rounded-card',
  /** Full-bleed media — the hero runs edge to edge with no radius. */
  none: '',
} as const

/** A ~20px transform, used as the blur-up placeholder. Contentful assets only. */
function blurPlaceholder(url: string): string | undefined {
  if (!isContentfulAsset(url)) return undefined
  return contentfulImageUrl(url, { width: 20, quality: 20 })
}

export function CmsImage({
  asset,
  alt,
  ratio,
  sizes,
  slotLabel,
  priority = false,
  rounded = 'image',
  className,
  objectPosition,
  showSlotLabel = true,
}: CmsImageProps) {
  const url = asset?.url

  if (url === null || url === undefined) {
    return (
      <ImageSlot
        ratio={ratio}
        label={slotLabel}
        rounded={rounded}
        className={className}
        showLabel={showSlotLabel}
      />
    )
  }

  const blurDataURL = blurPlaceholder(url)

  // A custom loader can only hand back the URL it was given, so for anything
  // that is not a Contentful asset every srcset entry would be the same file —
  // a srcset that costs bytes to send and buys the browser nothing. Marking it
  // unoptimized states that plainly, and silences Next's warning about a loader
  // that ignores `width`.
  const unoptimized = !isContentfulAsset(url)

  return (
    <div
      className={`relative overflow-hidden ${aspectClass(ratio)} ${ROUNDED_CLASS[rounded]} w-full bg-leaf-200 ${className ?? ''}`}
    >
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        // The hero is the LCP element; everything else waits until it is near.
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        loading={priority ? 'eager' : 'lazy'}
        {...(blurDataURL === undefined ? {} : { placeholder: 'blur' as const, blurDataURL })}
        {...(objectPosition === undefined ? {} : { style: { objectPosition } })}
        className="object-cover"
      />
    </div>
  )
}
