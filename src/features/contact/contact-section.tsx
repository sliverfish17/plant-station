import Script from 'next/script'

import { Section } from '@/components/ui/section'
import { SITE, mailtoHref, telHref } from '@/config/site'
import { turnstile } from '@/lib/env'

import { ContactForm } from './contact-form'

/**
 * The contact band: the form on the left, and the same details in large type on
 * the right.
 *
 * Both halves matter. For a 45–75 audience deciding whether to hire a solo
 * practitioner, a phone number they can read at arm's length is often the thing
 * they actually use — so it is set at 22–34px, not tucked under the form.
 */
export function ContactSection({ headingLevel = 'h2' }: { readonly headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel

  return (
    <Section
      tone="olive"
      id="contact"
      aria-labelledby="contact-heading"
      contentClassName="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-18 3xl:gap-22"
    >
      <div>
        <Heading
          id="contact-heading"
          className="text-h2-contact leading-heading text-pink-heading-dark"
        >
          Let&rsquo;s talk about your garden.
        </Heading>
        <p className="mt-3 text-lead leading-normal text-on-dark-sand">
          A free 15-minute call — no pressure, no obligation.
        </p>

        <div className="mt-8">
          <ContactForm
            {...(turnstile.mode === 'enabled' ? { turnstileSiteKey: turnstile.siteKey } : {})}
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3.5 lg:mt-0 lg:pt-19">
        <p className="text-body-sm font-semibold tracking-label text-pink-on-dark uppercase">
          Or reach me directly
        </p>
        <a
          href={telHref}
          className="inline-flex min-h-control-sm items-center font-serif text-phone-lg font-semibold text-near-white no-underline"
        >
          {SITE.phoneDisplay}
        </a>
        <a
          href={mailtoHref}
          className="inline-flex min-h-control-sm items-center text-lead font-semibold text-on-dark-cream no-underline"
        >
          {SITE.email}
        </a>
        <p className="mt-2 max-w-[36ch] text-body-sm leading-normal text-on-dark-sand">
          {/* TODO(D3): the municipality list is illustrative until confirmed; it is
              copy here, not schema, so it carries no ranking risk. */}
          I serve Metro Detroit — Royal Oak, Birmingham, Troy, Livonia, the Grosse Pointes, and
          nearby. If you&rsquo;re not sure, just ask.
        </p>
      </div>

      {turnstile.mode === 'enabled' ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
          async
          defer
        />
      ) : null}
    </Section>
  )
}
