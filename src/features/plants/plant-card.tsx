import { IMAGE_SIZES } from '@/components/ui/aspect'
import { Card, type CardTone } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { CmsImage } from '@/components/ui/cms-image'
import type { PlantEntry } from '@/lib/contentful/queries'

/**
 * A plant, as it appears on the home band and the Favorite Plants grid.
 *
 * Two things the design is explicit about and the copy will test: the common
 * name has to survive wrapping to two lines, and the Latin name can be as long
 * as "Rudbeckia fulgida var. sullivantii 'Goldsturm'". The tags are therefore
 * pinned to the bottom with `mt-auto` so cards of different name lengths still
 * align their tag rows.
 */
export function PlantCard({
  plant,
  tone = 'ivory',
}: {
  readonly plant: PlantEntry
  readonly tone?: CardTone | undefined
}) {
  return (
    <Card tone={tone} as="li">
      <CmsImage
        asset={plant.photo}
        alt={plant.photoAltText}
        ratio="1:1"
        sizes={IMAGE_SIZES.plantCard}
        slotLabel="Plant card · 1:1"
        rounded="image"
      />

      <h3 className="mt-2 font-serif text-plant-title leading-heading text-olive-700">
        {plant.commonName}
      </h3>
      <p className="text-caption leading-snug text-taupe-mid italic">{plant.latinName}</p>

      <ul className="mt-auto flex list-none flex-wrap gap-1.5 p-0 pt-2.5">
        <li>
          <Chip tone="leaf">{plant.lightTag}</Chip>
        </li>
        <li>
          <Chip tone="pink">{plant.waterTag}</Chip>
        </li>
      </ul>
    </Card>
  )
}
