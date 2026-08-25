import type { Metadata } from 'next'

import { ROUTES } from '@/config/navigation'
import { SITE } from '@/config/site'
import { ContactSection } from '@/features/contact/contact-section'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  // Kept under 70 characters including the brand suffix the template appends,
  // which is roughly where Google truncates a title in results.
  title: `Contact — Garden Design in ${SITE.locality}`,
  description:
    'Book a free 15-minute call about your garden. Serving Metro Detroit — Royal Oak, Birmingham, Troy, Livonia, the Grosse Pointes and nearby.',
  path: ROUTES.contact,
})

/**
 * TODO(D6): the artboards route every Contact link and CTA to the `#contact`
 * fragment, which exists only on the home page — so on the other nine routes
 * those links would jump nowhere. This page reuses the same band verbatim, so
 * the two stay in step; if a dedicated contact page turns out to be unwanted,
 * the fix is one entry in the navigation table.
 */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Contact', path: ROUTES.contact },
          ]),
        ]}
      />
      <ContactSection headingLevel="h1" />
    </>
  )
}
