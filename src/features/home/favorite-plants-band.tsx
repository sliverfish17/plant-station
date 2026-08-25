import Link from 'next/link'

import { Section } from '@/components/ui/section'
import { ROUTES } from '@/config/navigation'
import type { PlantEntry } from '@/lib/contentful/queries'
import { PlantGrid } from '@/features/plants/plant-grid'

/** The olive band on the home page: a handful of favourites and a way through
 * to all of them. Cards drop their shadow here — it is invisible on olive. */
export function FavoritePlantsBand({ plants }: { readonly plants: readonly PlantEntry[] }) {
  if (plants.length === 0) return null

  return (
    <Section tone="olive" id="plants" aria-labelledby="plants-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="plants-heading" className="text-h2 leading-heading text-pink-heading-dark">
            A few I keep coming back to
          </h2>
          <p className="mt-2 text-lead leading-normal text-on-dark-sand">
            Favorite plants for Michigan yards — tough, lovely, and forgiving.
          </p>
        </div>
        <Link
          href={ROUTES.plants}
          className="inline-flex min-h-control-sm items-center text-lead font-semibold whitespace-nowrap text-pink-on-dark"
        >
          See all my favorites <span aria-hidden="true">→</span>
        </Link>
      </div>

      <PlantGrid plants={plants} tone="cream" className="mt-8 lg:mt-10" />
    </Section>
  )
}
