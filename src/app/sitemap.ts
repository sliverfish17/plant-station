import type { MetadataRoute } from 'next'

import { ROUTES, absoluteUrl, feedEntryHref, serviceHref } from '@/config/navigation'
import { getBlogPosts, getProjects, getServices } from '@/lib/contentful/queries'

/**
 * The sitemap, generated from Contentful rather than hand-listed.
 *
 * A static list is the file that silently goes stale: a post published on
 * Tuesday is absent until someone remembers. Building it from the same cached
 * queries the pages use means the sitemap and the site cannot disagree, and the
 * publish webhook refreshes both together.
 *
 * `lastModified` comes from the entry's own date, not from the build clock —
 * otherwise every deploy would claim every page had changed.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, services] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getServices(),
  ])

  const newestFeedDate = [...projects, ...posts]
    .map((entry) => entry.date)
    .sort()
    .at(-1)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.home), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl(ROUTES.services), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl(ROUTES.plants), changeFrequency: 'monthly', priority: 0.8 },
    {
      url: absoluteUrl(ROUTES.feed),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(newestFeedDate === undefined ? {} : { lastModified: new Date(newestFeedDate) }),
    },
    { url: absoluteUrl(ROUTES.contact), changeFrequency: 'yearly', priority: 0.7 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(serviceHref(service.slug)),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const feedPages: MetadataRoute.Sitemap = [...projects, ...posts].map((entry) => ({
    url: absoluteUrl(feedEntryHref(entry.slug)),
    lastModified: new Date(entry.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...servicePages, ...feedPages]
}
