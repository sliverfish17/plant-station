import { Button } from '@/components/ui/button'
import { ImageSlot } from '@/components/ui/image-slot'
import { ROUTES } from '@/config/navigation'
import { SITE } from '@/config/site'
import type { SiteSettingsEntry } from '@/lib/contentful/queries'

import { HeroImage } from './hero-image'

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
  // Built as one object rather than a `hasPhoto` boolean so that narrowing both
  // assets to non-null happens where they are read. An asset link is null
  // whenever the photo has not been uploaded — or has been uploaded but not
  // published — and the hero falls back to the reserved slot either way.
  const mobile = settings.heroImageMobile
  const desktop = settings.heroImageDesktop

  const crops =
    mobile?.url === undefined ||
    mobile.url === null ||
    desktop?.url === undefined ||
    desktop.url === null
      ? null
      : {
          mobile: {
            asset: mobile,
            alt: settings.heroImageMobileAltText,
            // The source photograph is portrait; these keep Edyta and the
            // flower bed in frame at each crop, per the artboards.
            focus: 'center 47%',
          },
          desktop: {
            asset: desktop,
            alt: settings.heroImageDesktopAltText,
            focus: 'center 58%',
          },
        }

  return (
    <section aria-labelledby="hero-heading" className="relative">
      {/* One fixed-ratio box per breakpoint so the space is reserved before any
          image data arrives; the <picture> inside fetches exactly one file. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-leaf-200 lg:aspect-[16/9]">
        {crops !== null ? (
          <HeroImage mobile={crops.mobile} desktop={crops.desktop} />
        ) : (
          <ImageSlot
            ratio="fill"
            label="Hero — Edyta in garden · 16:9 desktop, 4:5 mobile"
            rounded="none"
          />
        )}
      </div>

      <div className="absolute inset-0 flex items-end bg-linear-to-t from-scrim/92 from-55% to-scrim/0 to-100% lg:items-center lg:bg-linear-to-r lg:from-scrim/88 lg:from-0% lg:via-scrim/55 lg:via-42% lg:to-scrim/0 lg:to-68%">
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
