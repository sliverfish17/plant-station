import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/config/navigation'

/**
 * Draft-mode and webhook routes are disallowed: they serve unpublished content
 * or expect a secret, and neither belongs in an index. Everything else is open —
 * organic search is a primary acquisition channel here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
