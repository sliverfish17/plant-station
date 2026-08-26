/**
 * A slug that deliberately matches no entry, used to keep a route alive when its
 * collection is empty.
 *
 * Under Cache Components, `generateStaticParams` returning an empty array is a
 * hard error: Next uses the first result to validate at build time that the
 * route makes no uncached dynamic access, so it reads "no params" as a
 * misconfiguration rather than as "there is nothing to publish yet". The whole
 * route then fails with a 500 — every project *and* post page at once.
 *
 * But an empty collection is a perfectly ordinary state. It is what a brand-new
 * space looks like before the first entry is written, what a revoked token or a
 * Contentful outage looks like, and what happens the day the last blog post is
 * deleted. None of those should turn "/projects-blog/anything" into a server
 * error, so this prerenders a single slug that no entry can be found for and
 * lets the page fall through to its own `notFound()`. The visitor gets an
 * ordinary 404, which is the truth: that page does not exist.
 */
const NO_ENTRIES_SLUG = 'no-entries'

export function atLeastOneSlug(params: readonly { slug: string }[]): { slug: string }[] {
  return params.length > 0 ? [...params] : [{ slug: NO_ENTRIES_SLUG }]
}
