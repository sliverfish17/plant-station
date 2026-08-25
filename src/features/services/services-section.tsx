import { Section } from '@/components/ui/section'
import { SITE, mailtoHref, telHref } from '@/config/site'
import type { ServiceEntry } from '@/lib/contentful/queries'

import { ServiceBubble, bubbleOffsetAt } from './service-bubble'

/**
 * "How I can help" — six services as pill rows on mobile and staggered circles
 * from the large breakpoint up.
 *
 * The phone and email in the intro are one of the five places the accessibility
 * spec requires them, and the most useful: someone reading this section is
 * deciding whether to get in touch.
 */
export function ServicesSection({ services }: { readonly services: readonly ServiceEntry[] }) {
  return (
    <Section tone="cream-alt" id="services" aria-labelledby="services-heading">
      <h2 id="services-heading" className="text-h2 leading-tight lg:text-center">
        How I can help
      </h2>
      <p className="mt-3 max-w-measure text-lead leading-normal lg:mx-auto lg:text-center">
        From a single walk-through to a full garden plan — pick what fits.
      </p>
      <p className="mt-2 text-body-sm leading-normal lg:text-center">
        Questions? Call{' '}
        <a href={telHref} className="font-semibold text-pink-700">
          {SITE.phoneDisplay}
        </a>{' '}
        or email{' '}
        <a href={mailtoHref} className="font-semibold text-pink-700">
          {SITE.email}
        </a>
        .
      </p>

      <ul className="mt-9 flex list-none flex-col gap-3.5 p-0 lg:mt-14 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center lg:gap-14">
        {services.map((service, position) => (
          <li key={service.sys.id}>
            <ServiceBubble service={service} offset={bubbleOffsetAt(position)} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
