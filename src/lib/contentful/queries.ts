import { cacheLife, cacheTag } from 'next/cache'

import { contentSource } from '@/lib/env'

import { fetchContentful } from './client'
import {
  BlogPostBySlugDocument,
  BlogPostCollectionDocument,
  FeaturedPlantCollectionDocument,
  PlantCollectionDocument,
  ProjectBySlugDocument,
  ProjectCollectionDocument,
  ServiceBySlugDocument,
  ServiceCollectionDocument,
  SiteSettingsDocument,
  TestimonialCollectionDocument,
} from './generated/graphql'
import type {
  BlogPostDetailEntry,
  BlogPostEntry,
  FeedEntry,
  PlantEntry,
  ProjectDetailEntry,
  ProjectEntry,
  ServiceDetailEntry,
  ServiceEntry,
  SiteSettingsEntry,
  TestimonialEntry,
} from './entries'
import {
  parseBlogPostDetail,
  parseBlogPosts,
  parsePlants,
  parseProjectDetail,
  parseProjects,
  parseServiceDetail,
  parseServices,
  parseSiteSettings,
  parseTestimonials,
} from './entries'
import {
  seedBlogPostDetails,
  seedBlogPosts,
  seedPlants,
  seedProjectDetails,
  seedProjects,
  seedServiceDetails,
  seedServices,
  seedSiteSettings,
  seedTestimonials,
} from './seed'
import { sortFeedNewestFirst } from './feed'
import { collectionTag, entryTag } from './tags'

/**
 * The read layer.
 *
 * Every function here is a `"use cache"` boundary that owns its own tags and
 * lifetime: `cacheLife('max')` because nothing expires on a clock — a publish
 * webhook is the only thing that should ever invalidate a page — and one tag per
 * entry `sys.id` plus the collection tag, so an edit invalidates exactly the
 * pages that render it and nothing more.
 *
 * Until Contentful has credentials these return the seed content transcribed
 * from the design canvas. The seed is typed against the generated types, so the
 * switch to live content changes what the data is, never its shape.
 */

/**
 * The app's content types come from `entries.ts`, not from the generated
 * GraphQL types. Contentful reports every field as nullable regardless of what
 * the content model requires, so the generated types describe the wire format
 * rather than what a published entry actually contains; `entries.ts` is where
 * the two are reconciled.
 */
export type {
  BlogPostDetailEntry,
  BlogPostEntry,
  CmsAsset,
  FeedEntry,
  PlantEntry,
  ProjectDetailEntry,
  ProjectEntry,
  ServiceDetailEntry,
  ServiceEntry,
  SiteSettingsEntry,
  TestimonialEntry,
} from './entries'

// ── plants ────────────────────────────────────────────────────────────────────

export async function getPlants(): Promise<readonly PlantEntry[]> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('plant'))

  if (contentSource.mode !== 'live') return seedPlants

  const data = await fetchContentful(PlantCollectionDocument)
  const items = parsePlants(data.plantCollection?.items ?? [])
  for (const item of items) cacheTag(entryTag(item.sys.id))
  return items
}

export async function getFeaturedPlants(): Promise<readonly PlantEntry[]> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('plant'))

  if (contentSource.mode !== 'live') return seedPlants.filter((plant) => plant.featured)

  const data = await fetchContentful(FeaturedPlantCollectionDocument)
  const items = parsePlants(data.plantCollection?.items ?? [])
  for (const item of items) cacheTag(entryTag(item.sys.id))
  return items
}

// ── projects ──────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<readonly ProjectEntry[]> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('project'))

  if (contentSource.mode !== 'live') return seedProjects

  const data = await fetchContentful(ProjectCollectionDocument)
  const items = parseProjects(data.projectCollection?.items ?? [])
  for (const item of items) cacheTag(entryTag(item.sys.id))
  return items
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetailEntry | null> {
  'use cache'
  cacheLife('max')
  // Tagged by collection here and by sys.id below — never by slug, which can be
  // edited and would leave the old URL's cache entry unreachable.
  cacheTag(collectionTag('project'))

  if (contentSource.mode !== 'live') {
    return seedProjectDetails.find((project) => project.slug === slug) ?? null
  }

  const data = await fetchContentful(ProjectBySlugDocument, { slug })
  const entry = parseProjectDetail(data.projectCollection?.items[0])
  if (entry !== null) cacheTag(entryTag(entry.sys.id))
  return entry
}

// ── blog posts ────────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<readonly BlogPostEntry[]> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('blogPost'))

  if (contentSource.mode !== 'live') return seedBlogPosts

  const data = await fetchContentful(BlogPostCollectionDocument)
  const items = parseBlogPosts(data.blogPostCollection?.items ?? [])
  for (const item of items) cacheTag(entryTag(item.sys.id))
  return items
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetailEntry | null> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('blogPost'))

  if (contentSource.mode !== 'live') {
    return seedBlogPostDetails.find((post) => post.slug === slug) ?? null
  }

  const data = await fetchContentful(BlogPostBySlugDocument, { slug })
  const entry = parseBlogPostDetail(data.blogPostCollection?.items[0])
  if (entry !== null) cacheTag(entryTag(entry.sys.id))
  return entry
}

// ── the shared feed ───────────────────────────────────────────────────────────

/**
 * Projects and posts, newest first, in the single flow the Projects & Blog grid
 * renders. Sorting happens here so the page never has to know that the two
 * halves arrived from separate queries.
 */
export async function getFeed(): Promise<readonly FeedEntry[]> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()])
  return sortFeedNewestFirst(projects, posts)
}

// ── testimonials ──────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<readonly TestimonialEntry[]> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('testimonial'))

  if (contentSource.mode !== 'live') return seedTestimonials

  const data = await fetchContentful(TestimonialCollectionDocument)
  const items = parseTestimonials(data.testimonialCollection?.items ?? [])
  for (const item of items) cacheTag(entryTag(item.sys.id))
  return items
}

// ── services ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<readonly ServiceEntry[]> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('service'))

  if (contentSource.mode !== 'live') return seedServices

  const data = await fetchContentful(ServiceCollectionDocument)
  const items = parseServices(data.serviceCollection?.items ?? [])
  for (const item of items) cacheTag(entryTag(item.sys.id))
  return items
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetailEntry | null> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('service'))

  if (contentSource.mode !== 'live') {
    return seedServiceDetails.find((service) => service.slug === slug) ?? null
  }

  const data = await fetchContentful(ServiceBySlugDocument, { slug })
  const entry = parseServiceDetail(data.serviceCollection?.items[0])
  if (entry !== null) cacheTag(entryTag(entry.sys.id))
  return entry
}

// ── site settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsEntry> {
  'use cache'
  cacheLife('max')
  cacheTag(collectionTag('siteSettings'))

  if (contentSource.mode !== 'live') return seedSiteSettings

  const data = await fetchContentful(SiteSettingsDocument)
  const entry = parseSiteSettings(data.siteSettingsCollection?.items[0])

  // The shell cannot render without hero and portrait slots, so an empty or
  // unpublished settings entry falls back to the seed rather than throwing and
  // taking every page down with it.
  if (entry === null) return seedSiteSettings

  cacheTag(entryTag(entry.sys.id))
  return entry
}
