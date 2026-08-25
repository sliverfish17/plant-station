import Image from 'next/image'

import type { AssetFieldsFragment } from '@/lib/contentful/generated/graphql'
import { contentfulImageUrl, isContentfulAsset } from '@/lib/image-loader'

import { type AspectRatio, aspectClass } from './aspect'
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
  readonly asset: AssetFieldsFragment | null
  readonly alt: string
  readonly ratio: AspectRatio
  readonly sizes: string
  /** Slot label used when there is nothing to render yet. */
  readonly slotLabel: string
  readonly priority?: boolean | undefined
  readonly rounded?: 'image' | 'image-sm' | 'card' | undefined
  readonly className?: string | undefined
  /** Shifts the crop; the hero needs Edyta and the flower bed both in frame. */
  readonly objectPosition?: string | undefined
  readonly showSlotLabel?: boolean | undefined
}

const ROUNDED_CLASS = {
  image: 'rounded-image',
  'image-sm': 'rounded-image-sm',
  card: 'rounded-card',
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
