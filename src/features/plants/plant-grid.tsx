import type { PlantEntry } from '@/lib/contentful/queries'

import { PlantCard } from './plant-card'
import type { CardTone } from '@/components/ui/card'

/**
 * Two columns on mobile, auto-fitting from there.
 *
 * `auto-fit` with a minimum column width rather than a fixed count: the design
 * calls for the grid to look right with anything from two entries to six, and a
 * fixed four-column track leaves two lonely cards stranded in a row of gaps.
 */
export function PlantGrid({
  plants,
  tone,
  className,
}: {
  readonly plants: readonly PlantEntry[]
  readonly tone?: CardTone | undefined
  readonly className?: string | undefined
}) {
  return (
    <ul
      className={`grid list-none grid-cols-2 items-stretch gap-3.5 p-0 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-5 ${className ?? ''}`}
    >
      {plants.map((plant) => (
        <PlantCard key={plant.sys.id} plant={plant} tone={tone} />
      ))}
    </ul>
  )
}
