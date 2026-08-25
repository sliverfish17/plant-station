import type { JsonLdNode } from './json-ld'

/**
 * Emits one `@graph` script per page.
 *
 * A single graph rather than several loose scripts: nodes reference each other
 * by `@id` (a service points at the business, a post points at its author), and
 * a crawler resolves those references reliably only when the nodes arrive
 * together.
 *
 * The payload is built from typed data and serialised with `JSON.stringify`, so
 * there is no interpolation of untrusted strings into a script tag; `<` is
 * escaped defensively for the one case `stringify` does not cover — a `</script>`
 * sequence inside CMS copy.
 */
export function JsonLd({ nodes }: { readonly nodes: readonly JsonLdNode[] }) {
  const payload = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes,
  }).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      // Serialised JSON, not markup: the payload comes from JSON.stringify and
      // its one dangerous sequence, `<`, is escaped above.
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  )
}
