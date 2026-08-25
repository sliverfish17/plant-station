import { draftMode } from 'next/headers'

import { fetchContentful } from './client'
import {
  BlogPostBySlugDocument,
  BlogPostCollectionDocument,
  PlantCollectionDocument,
  ProjectBySlugDocument,
  ProjectCollectionDocument,
  ServiceBySlugDocument,
  ServiceCollectionDocument,
  SiteSettingsDocument,
  TestimonialCollectionDocument,
} from './generated/graphql'
import { present } from './present'
import {
  getBlogPostBySlug,
  getBlogPosts,
  getFeaturedPlants,
  getPlants,
  getProjectBySlug,
  getProjects,
  getServiceBySlug,
  getServices,
  getSiteSettings,
  getTestimonials,
  type BlogPostDetailEntry,
  type BlogPostEntry,
  type FeedEntry,
  type PlantEntry,
  type ProjectDetailEntry,
  type ProjectEntry,
  type ServiceDetailEntry,
  type ServiceEntry,
  type SiteSettingsEntry,
  type TestimonialEntry,
} from './queries'
import { sortFeedNewestFirst } from './feed'
import { seedSiteSettings } from './seed'

/**
 * The facade pages read through.
 *
 * Preview is the one case that must *not* be cached: an editor checking an
 * unpublished draft needs the current state of the entry, not whatever the last
 * publish left in the cache. So draft mode bypasses the `"use cache"` layer
 * entirely and re-runs the same documents against the Preview API, rather than
 * trying to punch a hole in a cache that is deliberately keyed to publishes.
 *
 * Everyone else — which is everyone — gets the cached path untouched.
 */

async function isPreview(): Promise<boolean> {
  const draft = await draftMode()
  return draft.isEnabled
}

const preview = { preview: true } as const

export async function readPlants(): Promise<readonly PlantEntry[]> {
  if (!(await isPreview())) return getPlants()
  const data = await fetchContentful(PlantCollectionDocument, undefined, preview)
  return present(data.plantCollection?.items ?? [])
}

export async function readFeaturedPlants(): Promise<readonly PlantEntry[]> {
  if (!(await isPreview())) return getFeaturedPlants()
  const data = await fetchContentful(PlantCollectionDocument, undefined, preview)
  return present(data.plantCollection?.items ?? []).filter((plant) => plant.featured)
}

export async function readProjects(): Promise<readonly ProjectEntry[]> {
  if (!(await isPreview())) return getProjects()
  const data = await fetchContentful(ProjectCollectionDocument, undefined, preview)
  return present(data.projectCollection?.items ?? [])
}

export async function readBlogPosts(): Promise<readonly BlogPostEntry[]> {
  if (!(await isPreview())) return getBlogPosts()
  const data = await fetchContentful(BlogPostCollectionDocument, undefined, preview)
  return present(data.blogPostCollection?.items ?? [])
}

export async function readFeed(): Promise<readonly FeedEntry[]> {
  const [projects, posts] = await Promise.all([readProjects(), readBlogPosts()])
  return sortFeedNewestFirst(projects, posts)
}

export async function readProjectBySlug(slug: string): Promise<ProjectDetailEntry | null> {
  if (!(await isPreview())) return getProjectBySlug(slug)
  const data = await fetchContentful(ProjectBySlugDocument, { slug }, preview)
  return present(data.projectCollection?.items ?? [])[0] ?? null
}

export async function readBlogPostBySlug(slug: string): Promise<BlogPostDetailEntry | null> {
  if (!(await isPreview())) return getBlogPostBySlug(slug)
  const data = await fetchContentful(BlogPostBySlugDocument, { slug }, preview)
  return present(data.blogPostCollection?.items ?? [])[0] ?? null
}

export async function readTestimonials(): Promise<readonly TestimonialEntry[]> {
  if (!(await isPreview())) return getTestimonials()
  const data = await fetchContentful(TestimonialCollectionDocument, undefined, preview)
  return present(data.testimonialCollection?.items ?? [])
}

export async function readServices(): Promise<readonly ServiceEntry[]> {
  if (!(await isPreview())) return getServices()
  const data = await fetchContentful(ServiceCollectionDocument, undefined, preview)
  return present(data.serviceCollection?.items ?? [])
}

export async function readServiceBySlug(slug: string): Promise<ServiceDetailEntry | null> {
  if (!(await isPreview())) return getServiceBySlug(slug)
  const data = await fetchContentful(ServiceBySlugDocument, { slug }, preview)
  return present(data.serviceCollection?.items ?? [])[0] ?? null
}

export async function readSiteSettings(): Promise<SiteSettingsEntry> {
  if (!(await isPreview())) return getSiteSettings()
  const data = await fetchContentful(SiteSettingsDocument, undefined, preview)
  return present(data.siteSettingsCollection?.items ?? [])[0] ?? seedSiteSettings
}
