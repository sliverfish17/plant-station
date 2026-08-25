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
