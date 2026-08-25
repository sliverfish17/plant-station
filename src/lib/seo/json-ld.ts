import { ROUTES, absoluteUrl, serviceHref } from '@/config/navigation'
import { SITE } from '@/config/site'
import type {
  BlogPostDetailEntry,
  ProjectDetailEntry,
  ServiceDetailEntry,
  ServiceEntry,
} from '@/lib/contentful/queries'

/**
 * Typed JSON-LD builders.
 *
 * Every value comes from `SITE` or from the CMS — nothing here restates a phone
 * number or a business name, so resolving D1 or D2 updates the structured data
 * without anyone remembering that it exists.
 *
 * What is *not* emitted matters as much as what is. `Review` and
 * `AggregateRating` stay off until the testimonials are confirmed real and
 * attributable (D4): fabricated review markup is a manual-action risk that
 * applies site-wide, not just to the offending page. `sameAs` is omitted rather
 * than pointed at placeholder profiles, and `areaServed` ships as one region
 * until the municipality list is confirmed (D3).
 */

/**
 * An index signature rather than `Record`: TypeScript refuses a recursive type
 * alias that resolves through a mapped type, and JSON-LD is recursive. The lint
 * rule that normally prefers `Record` recognises the cycle and stays quiet.
 */
type JsonLdObject = { readonly [key: string]: JsonLdValue | undefined }

/** A JSON-LD value: the shape `JSON.stringify` accepts, and nothing looser. */
export type JsonLdValue = string | number | boolean | null | readonly JsonLdValue[] | JsonLdObject

/**
 * `@type` may be an array: a solo practitioner is genuinely both a
 * `LocalBusiness` and a `ProfessionalService`, and declaring both on one node is
 * how schema.org expresses that.
 */
export type JsonLdNode = { readonly '@type': string | readonly string[] } & JsonLdObject

const ORGANIZATION_ID = absoluteUrl('/#business')
const WEBSITE_ID = absoluteUrl('/#website')

function person(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': absoluteUrl('/#founder'),
    name: SITE.legalName,
    jobTitle: 'Garden designer and plant consultant',
    knowsAbout: [
      'Garden design',
      'Michigan native plants',
      'Soil testing',
      'Seasonal container planting',
    ],
  }
}

function areaServed(): readonly JsonLdNode[] {
  // TODO(D3): one region until the municipality list is confirmed. Naming a city
  // Edyta does not serve is worse for local ranking than naming none.
  if (SITE.areaServed.length === 0) {
    return [{ '@type': 'AdministrativeArea', name: SITE.areaServedRegion }]
  }

  return SITE.areaServed.map((municipality) => ({
    '@type': 'City',
    name: municipality.name,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: `${municipality.county} County, Michigan`,
    },
  }))
}

function openingHours(): readonly JsonLdNode[] {
  return SITE.openingHours.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [...slot.days],
    opens: slot.opens,
    closes: slot.closes,
  }))
}

function offerCatalog(services: readonly ServiceEntry[]): JsonLdNode | undefined {
  if (services.length === 0) return undefined

  return {
    '@type': 'OfferCatalog',
    name: 'Garden design and plant care services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': absoluteUrl(serviceHref(service.slug)),
        name: service.name,
        description: service.summary,
      },
    })),
  }
}

/**
 * The site-wide business node. `LocalBusiness` and `ProfessionalService` both
 * apply — she is a local business *and* a professional service — and declaring
 * both types on one node is how schema.org expresses that, rather than emitting
 * two nodes that a crawler would have to reconcile.
 */
export function localBusinessJsonLd(services: readonly ServiceEntry[]): JsonLdNode {
  return {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ORGANIZATION_ID,
    // TODO(D1): brand name unconfirmed.
    name: SITE.brandName,
    legalName: SITE.legalName,
    description: SITE.tagline,
    url: absoluteUrl(ROUTES.home),
    // TODO(D2): placeholder contact details until confirmed.
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: '$$',
    founder: person(),
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.locality,
      addressRegion: SITE.addressRegion,
      addressCountry: SITE.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: areaServed(),
    openingHoursSpecification: openingHours(),
    hasOfferCatalog: offerCatalog(services),
    // TODO(D2): omitted rather than pointed at placeholder profiles.
    ...(SITE.social.length === 0 ? {} : { sameAs: SITE.social.map((profile) => profile.href) }),
    // TODO(D4): Review and AggregateRating stay off until the testimonials are
    // confirmed real and attributable.
  }
}

export function webSiteJsonLd(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl(ROUTES.home),
    name: SITE.brandName,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  }
}

export function serviceJsonLd(service: ServiceDetailEntry): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': absoluteUrl(serviceHref(service.slug)),
    name: service.name,
    description: service.metaDescription ?? service.summary,
    serviceType: service.name,
    url: absoluteUrl(serviceHref(service.slug)),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: areaServed(),
  }
}

export function blogPostingJsonLd(post: BlogPostDetailEntry, path: string): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    '@id': absoluteUrl(path),
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: person(),
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: 'en-US',
    ...(post.thumbnail.url === null
      ? {}
      : { image: imageObjectJsonLd(post.thumbnail.url, post.thumbnailAltText) }),
  }
}

/** Project pages describe a completed piece of work, not an article. */
export function projectJsonLd(project: ProjectDetailEntry, path: string): JsonLdNode {
  const images = [
    project.leadImage?.url === undefined || project.leadImage.url === null
      ? undefined
      : imageObjectJsonLd(project.leadImage.url, project.leadImageAltText ?? project.title),
    project.beforeImage?.url === undefined || project.beforeImage.url === null
      ? undefined
      : imageObjectJsonLd(
          project.beforeImage.url,
          project.beforeImageAltText ?? `${project.title} before`,
        ),
    project.afterImage.url === null
      ? undefined
      : imageObjectJsonLd(project.afterImage.url, project.afterImageAltText),
  ].filter((image): image is JsonLdNode => image !== undefined)

  return {
    '@type': 'CreativeWork',
    '@id': absoluteUrl(path),
    name: project.title,
    description: project.metaDescription ?? project.caption,
    dateCreated: project.date,
    creator: person(),
    locationCreated: { '@type': 'Place', name: project.location },
    url: absoluteUrl(path),
    ...(images.length === 0 ? {} : { image: images }),
  }
}

export function imageObjectJsonLd(url: string, caption: string): JsonLdNode {
  return {
    '@type': 'ImageObject',
    contentUrl: url.startsWith('http') ? url : absoluteUrl(url),
    caption,
  }
}

export type Breadcrumb = { readonly name: string; readonly path: string }

export function breadcrumbJsonLd(trail: readonly Breadcrumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}
