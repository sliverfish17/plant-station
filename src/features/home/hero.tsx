import { IMAGE_SIZES } from '@/components/ui/aspect'
import { Button } from '@/components/ui/button'
import { CmsImage } from '@/components/ui/cms-image'
import { ROUTES } from '@/config/navigation'
import { SITE } from '@/config/site'
import type { SiteSettingsEntry } from '@/lib/contentful/queries'

/**
 * The hero.
 *
 * Two crops, not one letterboxed image: 4:5 on mobile and 16:9 from the large
 * breakpoint, each with its own crop focus so Edyta and the flower bed stay in
 * frame at both shapes. The source photograph is portrait, so a single 16:9 crop
 * scaled down would put her face off the top edge of a phone.
 *
 * The scrim is a gradient rather than a flat overlay, and it runs bottom-to-top
 * on mobile and left-to-right on desktop — following where the copy sits, so the
 * photograph stays visible everywhere the text is not.
 */
export function Hero({ settings }: { readonly settings: SiteSettingsEntry }) {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="lg:hidden">
        <CmsImage
          asset={settings.heroImageMobile}
          alt={settings.heroImageMobileAltText}
          ratio="4:5"
          sizes={IMAGE_SIZES.hero}
          slotLabel="Hero — Edyta in garden · 4:5"
          objectPosition="center 47%"
          rounded="none"
          priority
        />
      </div>
      <div className="hidden lg:block">
        <CmsImage
          asset={settings.heroImageDesktop}
          alt={settings.heroImageDesktopAltText}
          ratio="16:9"
          sizes={IMAGE_SIZES.hero}
          slotLabel="Hero — Edyta in garden · 16:9"
          objectPosition="center 58%"
          rounded="none"
          priority
        />
      </div>

      <div className="absolute inset-0 flex items-end bg-linear-to-t from-scrim/92 from-55% to-transparent lg:items-center lg:bg-linear-to-r lg:from-scrim/88 lg:via-scrim/55 lg:via-42% lg:to-transparent lg:to-68%">
        <div className="mx-auto w-full max-w-content px-gutter pb-8 lg:pb-0">
          <div className="max-w-[46ch]">
            <h1 id="hero-heading" className="text-hero leading-tight text-near-white">
              Gardens that grow with you.
            </h1>
            <p className="mt-3 max-w-[48ch] text-lead leading-relaxed text-on-dark-cream">
              Michigan garden design, planting, and plant care, tailored to how you actually live.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href={ROUTES.contact} size="lg" block className="sm:w-auto">
                Book a Consultation
              </Button>
              <Button
                href={ROUTES.services}
                variant="outline-on-dark"
                size="lg"
                block
                className="sm:w-auto"
              >
                See My Services
              </Button>
            </div>

            <p className="mt-4 text-caption leading-normal text-on-dark-sand">
              Serving {SITE.locality} &nbsp;•&nbsp; 10+ years &nbsp;•&nbsp; Free 15-minute intro
              call
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
