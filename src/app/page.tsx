import { getFeaturedPlants, getFeed, getServices, getTestimonials } from '@/lib/contentful/queries'
import { contentSource } from '@/lib/env'

/**
 * Phase 1 scaffold. The real home page arrives in Phase 4 — this exists so the
 * cached read layer is exercised by a real build rather than only by tests.
 */
export default async function Home() {
  const [plants, feed, services, testimonials] = await Promise.all([
    getFeaturedPlants(),
    getFeed(),
    getServices(),
    getTestimonials(),
  ])

  return (
    <main id="main" className="mx-auto max-w-(--container-article) p-(--spacing-gutter)">
      <h1 className="text-(length:--text-hero)">Plant Station</h1>
      <p className="text-(length:--text-lead)">
        Content source: <strong>{contentSource.mode}</strong>
      </p>
      <ul className="text-(length:--text-body)">
        <li>{plants.length} featured plants</li>
        <li>{feed.length} feed entries</li>
        <li>{services.length} services</li>
        <li>{testimonials.length} testimonials</li>
      </ul>
    </main>
  )
}
