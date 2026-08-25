import type { Metadata } from 'next'

import { CtaCard } from '@/components/ui/cta-card'
import { ROUTES } from '@/config/navigation'
import { FilterableListing, type FilterDefinition } from '@/features/feed/filterable-listing'
import { PlantCard } from '@/features/plants/plant-card'
import { getPlants, type PlantEntry } from '@/lib/contentful/queries'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

/** Title from artboard 3a, which specifies it exactly. */
export const metadata: Metadata = pageMetadata({
  title: 'Favorite Plants for Michigan Yards',
  description:
    'The plants I recommend again and again for Metro Detroit gardens — chosen for Michigan light, clay soil, and winters.',
  path: ROUTES.plants,
})

/**
 * Favorite Plants.
 *
 * Filter definitions are computed here, on the server, as sets of matching ids.
 * That keeps the predicates next to the data they describe — "Shade" covering
 * part shade too is a horticultural fact, not a UI concern — and means the
 * browser receives plain data rather than the plant model.
 */

const PAGE_SIZE = 8

function idsWhere(
  plants: readonly PlantEntry[],
  predicate: (plant: PlantEntry) => boolean,
): readonly string[] {
  return plants.filter(predicate).map((plant) => plant.sys.id)
}

function buildFilters(plants: readonly PlantEntry[]): readonly FilterDefinition[] {
  return [
    { id: 'all', label: 'All', matchingIds: null },
    {
      id: 'full-sun',
      label: 'Full sun',
      matchingIds: idsWhere(plants, (plant) => plant.lightTag === 'Full sun'),
    },
    {
      // Someone looking for a shady corner means part shade too.
      id: 'shade',
      label: 'Shade',
      matchingIds: idsWhere(plants, (plant) => plant.lightTag.includes('hade')),
    },
    {
      id: 'low-water',
      label: 'Low water',
      matchingIds: idsWhere(plants, (plant) => plant.waterTag.includes('ow water')),
    },
    {
      id: 'native',
      label: 'Michigan native',
      matchingIds: idsWhere(plants, (plant) => plant.isNative),
    },
  ]
}

export default async function FavoritePlantsPage() {
  const plants = await getPlants()

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Favorite Plants', path: ROUTES.plants },
          ]),
        ]}
      />

      <FilterableListing
        title="Favorite Plants"
        intro="The plants I recommend again and again — chosen for Michigan light, soil, and winters."
        tone="olive"
        chipTone="on-olive"
        gridId="plant-grid"
        pageSize={PAGE_SIZE}
        itemNoun="plant"
        emptyMessage="No plants match that filter yet."
        gridClassName="grid list-none grid-cols-2 items-stretch gap-3.5 p-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
        filters={buildFilters(plants)}
        items={plants.map((plant) => ({
          id: plant.sys.id,
          // Directly under the page h1, so these are h2 — an h3 would skip a level.
          node: <PlantCard key={plant.sys.id} plant={plant} headingLevel="h2" />,
        }))}
        footer={
          <CtaCard
            tone="cream"
            heading="Not sure what fits your yard?"
            body="A free 15-minute call is the easiest way to find out."
            label="Book a Consultation"
            href={ROUTES.contact}
          />
        }
      />
    </>
  )
}
