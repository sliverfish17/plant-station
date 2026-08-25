/**
 * Single source of truth for every business fact the site renders.
 *
 * Nothing else in the codebase may hardcode a brand name, phone number, email,
 * domain or service-area string. Resolving a parked decision (see
 * docs/DECISIONS.md) is therefore a one-file change.
 */

/** A municipality named individually in LocalBusiness `areaServed`. */
export type Municipality = {
  readonly name: string
  /** Michigan county, to disambiguate same-named places for schema consumers. */
  readonly county: string
}

/** A social profile emitted as schema `sameAs` and rendered in the footer. */
export type SocialProfile = {
  readonly label: string
  /** Two-letter badge shown in the footer circles. */
  readonly short: string
  readonly href: string
}

/** Where a phone/email pair has to appear, per the accessibility spec. */
export const CONTACT_SURFACES = [
  'header',
  'services-intro',
  'contact-band',
  'footer',
  'menu',
] as const

export type ContactSurface = (typeof CONTACT_SURFACES)[number]

/** TODO(D3): empty until the municipality list is confirmed. Populating this
 * makes the JSON-LD builder emit per-city `areaServed` entries automatically. */
const AREA_SERVED: readonly Municipality[] = []

/** TODO(D2): empty until real profile URLs exist — `sameAs` is omitted rather
 * than fabricated. */
const SOCIAL: readonly SocialProfile[] = []

export const SITE = {
  /** TODO(D1): brand name unconfirmed — the design itself splits header wordmark,
   * footer wordmark and copyright across three names. */
  brandName: 'Plant Station',
  /** The person behind the brand — schema `founder`, footer wordmark. */
  legalName: 'Edyta Phillips',
  /** TODO(D1): domain follows brandName; changing it after launch forfeits search authority. */
  domain: 'https://plant-station.com',

  /** TODO(D2): placeholder from the design mock — must be replaced before launch. */
  phone: '+12485550142',
  /** TODO(D2): placeholder — display form must match the Google Business Profile NAP. */
  phoneDisplay: '(248) 555-0142',
  /** TODO(D2): placeholder from the design mock — must be replaced before launch. */
  email: 'hello@edytaphillips.com',

  /** Single-region fallback shipped while the municipality list is open. */
  areaServedRegion: 'Metro Detroit, Michigan',
  areaServed: AREA_SERVED,

  /** Approximate centroid of the service region — LocalBusiness `geo`. */
  geo: { latitude: 42.4734, longitude: -83.2219 },

  tagline: 'Garden design and plant care, made for Michigan yards.',
  addressRegion: 'MI',
  addressCountry: 'US',
  locality: 'Metro Detroit',

  /** TODO(D1): copyright pairs the person with the trading name. */
  copyrightName: 'Edyta Phillips Gardening',
  foundingYear: 2016,

  /** TODO(D4): testimonials render, but Review/AggregateRating schema stays off
   * until the quotes are confirmed real and attributable. */
  emitReviewSchema: false,

  social: SOCIAL,

  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
  ],
} as const

/** `tel:` href built from the single canonical number. */
export const telHref = `tel:${SITE.phone}` as const
/** `mailto:` href built from the single canonical address. */
export const mailtoHref = `mailto:${SITE.email}` as const
