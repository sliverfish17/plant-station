import type { Metadata } from 'next'

import { ROUTES } from '@/config/navigation'
import { SITE } from '@/config/site'
import { ContactSection } from '@/features/contact/contact-section'
import { FavoritePlantsBand } from '@/features/home/favorite-plants-band'
import { Hero } from '@/features/home/hero'
import { MeetEdyta } from '@/features/home/meet-edyta'
import { RecentProjects } from '@/features/home/recent-projects'
import { ServicesSection } from '@/features/services/services-section'
import { TestimonialsSection } from '@/features/testimonials/testimonials-section'
import {
  getFeaturedPlants,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
} from '@/lib/contentful/queries'
import { localBusinessJsonLd, webSiteJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

/** Title from artboard 3a, which specifies it exactly. */
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Garden Design & Plant Care in Metro Detroit',
    description:
      'Michigan garden design, planting, and plant care, tailored to how you actually live. Serving Metro Detroit — free 15-minute intro call.',
    path: ROUTES.home,
  }),
  // The root layout's template appends the brand suffix to every other page;
  // home states the full artboard-3a title itself. TODO(D1): brand unconfirmed.
  title: { absolute: `Garden Design & Plant Care in Metro Detroit | ${SITE.brandName}` },
}

/** How many projects the home gallery shows before sending people to the feed. */
const GALLERY_LIMIT = 3

export default async function HomePage() {
  const [settings, services, plants, projects, testimonials] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getFeaturedPlants(),
    getProjects(),
    getTestimonials(),
  ])

  return (
    <>
      <JsonLd nodes={[localBusinessJsonLd(services), webSiteJsonLd()]} />

      <Hero settings={settings} />
      <MeetEdyta settings={settings} />
      <ServicesSection services={services} />
      <FavoritePlantsBand plants={plants} />
      <RecentProjects projects={projects.slice(0, GALLERY_LIMIT)} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </>
  )
}
