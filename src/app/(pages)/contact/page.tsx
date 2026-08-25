import { ContactSection } from '@/features/contact/contact-section'

/**
 * TODO(D6): the artboards route every Contact link and CTA to the `#contact`
 * fragment, which exists only on the home page — so on the other nine routes
 * those links would jump nowhere. This page reuses the same band verbatim, so
 * the two stay in step; if a dedicated contact page turns out to be unwanted,
 * the fix is one entry in the navigation table.
 */
export default function ContactPage() {
  return <ContactSection headingLevel="h1" />
}
