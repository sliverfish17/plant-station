import { SITE } from './site'

/**
 * The link table. Header, footer and burger menu all read from here, so a route
 * cannot exist in one navigation surface and be missing from another.
 *
 * TODO(D6): "Contact" and every "Book a Consultation" CTA resolve to `/contact`.
 * The artboards target the `#contact` fragment, which only exists on the home
 * page — as designed, those CTAs would jump nowhere on the other nine routes.
 * If a dedicated contact page is unwanted, point `contact` at `/#contact` here
 * and nothing else changes.
 */

export const ROUTES = {
  home: '/',
  /** The Meet Edyta band on the home page. There is no separate story page by design. */
  story: '/#story',
  services: '/services',
  plants: '/favorite-plants',
  feed: '/projects-blog',
  contact: '/contact',
} as const

export type RouteKey = keyof typeof ROUTES

export type NavLink = {
  readonly label: string
  readonly href: string
  /** Contact is the one link set in accent pink in the burger menu. */
  readonly accent?: true
}

/** Order is taken from the burger menu and footer artboards, which agree. */
export const PRIMARY_NAV: readonly NavLink[] = [
  { label: 'Story', href: ROUTES.story },
  { label: 'Services', href: ROUTES.services },
  { label: 'Favorite Plants', href: ROUTES.plants },
  { label: 'Contact', href: ROUTES.contact, accent: true },
  { label: 'Projects & Blog', href: ROUTES.feed },
]

export function serviceHref(slug: string): string {
  return `${ROUTES.services}/${slug}`
}

export function feedEntryHref(slug: string): string {
  return `${ROUTES.feed}/${slug}`
}

/** Absolute URL for canonicals, sitemap entries and JSON-LD. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.domain).toString()
}
