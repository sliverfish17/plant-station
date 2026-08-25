import { IMAGE_SIZES } from '@/components/ui/aspect'
import { CmsImage } from '@/components/ui/cms-image'
import type { ProjectEntry } from '@/lib/contentful/queries'

/**
 * The before/after media block on a project card.
 *
 * The before image is optional, and the two cases have to end up exactly the
 * same height or cards in a row stop lining up. A pair of 3:2 tiles in a
 * two-column grid is `(columnWidth) * 2 / 3` tall; an after-only tile must match
 * that, not its own 3:2.
 *
 * Rather than hard-code the resulting ratio (the design file notes it as ~3.05:1,
 * which is only true at one card width), the after-only case keeps the same
 * two-column grid and adds an invisible 3:2 sizer in the first column. The grid
 * row is then exactly as tall as a pair would have been, at any card width, and
 * the single image spans both columns and fills it.
 */

type ProjectMediaProps = {
  readonly project: ProjectEntry
  /** Card grids use small radii; the detail page uses the larger one. */
  readonly rounded?: 'image' | 'image-sm'
  readonly sizes?: { readonly pair: string; readonly single: string }
}

export function ProjectMedia({
  project,
  rounded = 'image-sm',
  sizes = { pair: IMAGE_SIZES.projectTile, single: IMAGE_SIZES.cardFull },
}: ProjectMediaProps) {
  const hasBefore = project.beforeImage !== null

  if (hasBefore) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <CmsImage
          asset={project.beforeImage}
          alt={project.beforeImageAltText ?? `${project.title} before the work began`}
          ratio="3:2"
          sizes={sizes.pair}
          slotLabel="Before · 3:2"
          rounded={rounded}
        />
        <CmsImage
          asset={project.afterImage}
          alt={project.afterImageAltText}
          ratio="3:2"
          sizes={sizes.pair}
          slotLabel="After · 3:2"
          rounded={rounded}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Sizer: reserves a pair's worth of row height, renders nothing. */}
      <div className="col-start-1 row-start-1 aspect-[3/2]" aria-hidden="true" />
      <div className="col-span-2 col-start-1 row-start-1">
        <CmsImage
          asset={project.afterImage}
          alt={project.afterImageAltText}
          ratio="fill"
          sizes={sizes.single}
          slotLabel="After only · 3:2 asset, centre crop"
          rounded={rounded}
        />
      </div>
    </div>
  )
}
