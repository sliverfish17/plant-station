import { Button } from '@/components/ui/button'
import { CmsImage } from '@/components/ui/cms-image'
import { IMAGE_SIZES } from '@/components/ui/aspect'
import { Section } from '@/components/ui/section'
import { getFeaturedPlants, getSiteSettings } from '@/lib/contentful/queries'

/**
 * Phase 2 scaffold: exercises the shell, Section tones, CmsImage and ImageSlot.
 * The real home page is assembled in Phase 4.
 */
export default async function Home() {
  const [settings, plants] = await Promise.all([getSiteSettings(), getFeaturedPlants()])

  return (
    <>
      <Section tone="cream">
        <h1 className="text-hero leading-tight">Gardens that grow with you.</h1>
        <p className="mt-4 max-w-measure text-lead leading-relaxed">
          Michigan garden design, planting, and plant care, tailored to how you actually live.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/contact" size="lg">
            Book a Consultation
          </Button>
          <Button href="/services" variant="outline" size="lg">
            See My Services
          </Button>
        </div>
      </Section>

      <Section tone="cream-alt">
        <h2 className="text-h2 leading-heading">Shell check</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <CmsImage
            asset={settings.heroImageDesktop}
            alt={settings.heroImageDesktopAltText}
            ratio="16:9"
            sizes={IMAGE_SIZES.hero}
            slotLabel="Hero — Edyta in garden · 16:9"
            objectPosition="center 58%"
            priority
          />
          <CmsImage
            asset={settings.portrait}
            alt={settings.portraitAltText}
            ratio="4:5"
            sizes={IMAGE_SIZES.portrait}
            slotLabel="Portrait — Edyta · 4:5"
          />
        </div>
      </Section>

      <Section tone="olive">
        <h2 className="text-h2 leading-heading text-pink-heading-dark">
          A few I keep coming back to
        </h2>
        <p className="mt-2 text-lead text-on-dark-sand">
          {plants.length} featured plants from the seed content.
        </p>
      </Section>
    </>
  )
}
