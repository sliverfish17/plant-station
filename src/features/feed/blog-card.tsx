import Link from 'next/link'

import { IMAGE_SIZES } from '@/components/ui/aspect'
import { Card, Eyebrow } from '@/components/ui/card'
import { CmsImage } from '@/components/ui/cms-image'
import { feedEntryHref } from '@/config/navigation'
import { formatMonthYear } from '@/lib/format'
import type { BlogPostEntry } from '@/lib/contentful/queries'

/**
 * A blog card. Its thumbnail sits in the same two-column media grid as a project
 * card's, with the same invisible sizer, so a post and a project standing side
 * by side in the shared feed have their titles on the same line.
 */
export function BlogCard({ post }: { readonly post: BlogPostEntry }) {
  return (
    <Card as="li">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-start-1 row-start-1 aspect-[3/2]" aria-hidden="true" />
        <div className="col-span-2 col-start-1 row-start-1">
          <CmsImage
            asset={post.thumbnail}
            alt={post.thumbnailAltText}
            ratio="fill"
            sizes={IMAGE_SIZES.cardFull}
            slotLabel="Blog thumbnail · 3:2 asset, centre crop"
            rounded="image-sm"
          />
        </div>
      </div>

      <Eyebrow tone="olive">
        Blog · <time dateTime={post.date}>{formatMonthYear(post.date)}</time>
      </Eyebrow>

      <h3 className="mt-1.5 font-serif text-card-title text-olive-700">{post.title}</h3>

      <p className="mt-1.5 text-body-sm leading-normal text-taupe">{post.excerpt}</p>

      <Link
        href={feedEntryHref(post.slug)}
        className="mt-auto inline-flex min-h-control-sm items-end pt-3 text-body-sm font-semibold text-pink-700"
      >
        Read <span aria-hidden="true">→</span>
      </Link>
    </Card>
  )
}
