import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/config/navigation'
import { contentSource } from '@/lib/env'

/**
 * Draft-mode and webhook routes are disallowed: they serve unpublished content
 * or expect a secret, and neither belongs in an index. Everything else is open —
 * organic search is a primary acquisition channel here.
 *
 * Unless the site is still running on seed content. A deployment in `fixtures`
 * mode is showing copy transcribed from the design file: invented testimonials
 * attributed to named people, a `555-01xx` phone number and an email address
 * that does not exist. Letting Google index that would attach the wrong
 * information to the business and spend the domain's first crawl budget on
 * pages that are about to be replaced — and search authority earned by the
 * wrong content is not transferable. Connecting Contentful lifts this by
 * itself; there is no flag to remember.
 */
export default function robots(): MetadataRoute.Robots {
  if (contentSource.mode === 'fixtures') {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
