import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/ui/section'
import { ROUTES, serviceHref } from '@/config/navigation'
import { SITE, mailtoHref, telHref } from '@/config/site'
import { ServiceIcon } from '@/features/services/service-icon'
import { getServices } from '@/lib/contentful/queries'
import { breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

/**
 * The services index.
 *
 * The handoff listed individual service pages as an intentional omission and
 * pointed the bubbles at `/services#anchor`. That was overridden at kickoff:
 * anchors do not rank, and six pages each targeting its own query are the
 * highest-value organic lever on the project. This page is their hub — it exists
 * because the hero, header, footer and menu all link to `/services`, and because
 * a hub gives the six pages a shared internal-link source.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Garden Design & Plant Care Services in Metro Detroit',
  description:
    'Consulting, seasonal planters, soil testing, house plants, garden design and yard maintenance across Metro Detroit. Free 15-minute intro call.',
  path: ROUTES.services,
})

export default async function ServicesIndexPage() {
  const services = await getServices()

  return (
    <>
      <JsonLd
        nodes={[
          localBusinessJsonLd(services),
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Services', path: ROUTES.services },
          ]),
        ]}
      />

      <Section tone="cream-alt" pad="band-header" aria-labelledby="services-heading">
        <h1 id="services-heading" className="text-page-title leading-tight">
          How I can help
        </h1>
        <p className="mt-3 max-w-[60ch] text-lead leading-normal">
          From a single walk-through to a full garden plan — pick what fits. Every one of these
          starts with a free 15-minute call.
        </p>
        <p className="mt-3 text-body-sm leading-normal">
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
      </Section>

      <Section pad="band-listing">
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <li key={service.sys.id}>
              <Link
                href={serviceHref(service.slug)}
                className="group flex h-full flex-col rounded-card bg-ivory-card p-6 no-underline shadow-card transition-[transform,box-shadow,border-color] duration-(--duration-hover) hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none"
              >
                <span className="flex size-icon-badge items-center justify-center rounded-full border border-sage-300 bg-leaf-100 text-olive-700">
                  <ServiceIcon iconKey={service.iconKey} size={26} />
                </span>
                <h2 className="mt-4 font-serif text-card-title font-semibold text-olive-700">
                  {service.name}
                </h2>
                <p className="mt-2 text-body-sm leading-normal text-espresso">{service.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-body-sm font-semibold text-pink-700">
                  <span>Learn more</span>
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
