import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CtaCard } from '@/components/ui/cta-card'
import { Section } from '@/components/ui/section'
import { atLeastOneSlug } from '@/lib/static-params'
import { ROUTES, serviceHref } from '@/config/navigation'
import { SITE, mailtoHref, telHref } from '@/config/site'
import { RichText } from '@/features/feed/rich-text'
import { ServiceIcon } from '@/features/services/service-icon'
import { getServiceBySlug, getServices } from '@/lib/contentful/queries'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

/**
 * One shared template for all six service pages.
 *
 * Each targets its own query — "garden consulting metro detroit", "soil testing
 * michigan" — which is the whole point of building them as pages rather than
 * anchors. Title, description and `Service` schema all come from the CMS entry,
 * so a seventh service is a Contentful entry and nothing else.
 */

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const services = await getServices()
  return atLeastOneSlug(services.map((service) => ({ slug: service.slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Next 16: params is async.
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (service === null) return { title: 'Service not found' }

  return pageMetadata({
    title: service.metaTitle ?? `${service.name} in ${SITE.locality}`,
    description: service.metaDescription ?? service.summary,
    path: serviceHref(service.slug),
  })
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const [service, services] = await Promise.all([getServiceBySlug(slug), getServices()])

  if (service === null) notFound()

  const others = services.filter((candidate) => candidate.slug !== service.slug)

  return (
    <>
      <JsonLd
        nodes={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Services', path: ROUTES.services },
            { name: service.name, path: serviceHref(service.slug) },
          ]),
        ]}
      />

      {/* Header and body share the article column, so the heading, the intro and
          the prose beneath all line up on one left edge. */}
      <Section tone="cream-alt" pad="band-header" width="article" aria-labelledby="service-heading">
        <Link
          href={ROUTES.services}
          className="inline-flex min-h-control-sm items-center gap-1.5 text-body-sm font-semibold text-pink-700"
        >
          <span aria-hidden="true">←</span>
          <span>All services</span>
        </Link>

        <div className="mt-3 flex items-center gap-4">
          <span className="flex size-icon-badge shrink-0 items-center justify-center rounded-full border border-sage-300 bg-leaf-100 text-olive-700">
            <ServiceIcon iconKey={service.iconKey} size={28} />
          </span>
          <h1 id="service-heading" className="text-page-title leading-tight">
            {service.name}
          </h1>
        </div>

        <p className="mt-4 max-w-measure text-lead leading-relaxed">{service.intro}</p>

        <p className="mt-4 text-body-sm leading-normal">
          Call{' '}
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

      <Section pad="band-listing" width="article">
        <RichText value={service.body} />

        <div className="mt-12">
          <CtaCard
            heading={service.ctaHeading ?? 'Ready to start?'}
            body={service.ctaBody ?? 'A free 15-minute call is the easiest way to find out.'}
            label="Book a Consultation"
            href={ROUTES.contact}
          />
        </div>
      </Section>

      {others.length > 0 ? (
        <Section tone="cream-alt" width="article" aria-labelledby="other-services-heading">
          <h2 id="other-services-heading" className="text-h3 leading-heading">
            Other things I do
          </h2>
          <ul className="mt-5 flex list-none flex-wrap gap-3 p-0">
            {others.map((other) => (
              <li key={other.sys.id}>
                <Link
                  href={serviceHref(other.slug)}
                  className="inline-flex min-h-chip items-center gap-2 rounded-pill border-2 border-sage-500 bg-cream-page px-5 text-ui font-semibold text-olive-700 no-underline transition-colors duration-(--duration-hover) hover:border-pink-700 hover:bg-leaf-100"
                >
                  <ServiceIcon iconKey={other.iconKey} size={20} />
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}
