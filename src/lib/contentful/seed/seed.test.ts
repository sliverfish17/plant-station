import { describe, expect, it } from 'vitest'

import { sortFeedNewestFirst } from '../feed'
import { collectionTag, isContentTypeId } from '../tags'
import {
  seedBlogPostDetails,
  seedPlants,
  seedProjectDetails,
  seedServiceDetails,
  seedSiteSettings,
  seedTestimonials,
} from './index'

/**
 * The seed is the content every component is built and tested against until
 * Contentful is populated, so the invariants that the design depends on are
 * asserted here rather than discovered in a browser: unique slugs, alt text on
 * every image, and the specific edge cases the artboards call out.
 */

const REQUIRED_SERVICE_SLUGS = [
  'consulting',
  'seasonal-planters',
  'soil-testing',
  'house-plants',
  'garden-design',
  'yard-maintenance',
] as const

describe('seed content', () => {
  it('gives every plant photo slot alt text, even before a photo exists', () => {
    for (const plant of seedPlants) {
      expect(plant.photoAltText.trim().length).toBeGreaterThan(0)
    }
  })

  it('includes the longest realistic name pair the plant card must survive', () => {
    const longest = seedPlants.find((plant) => plant.commonName.startsWith('Black-Eyed Susan'))
    expect(longest?.latinName).toBe("Rudbeckia fulgida var. sullivantii 'Goldsturm'")
  })

  it('has enough featured plants to fill the home band and enough total for the grid', () => {
    // The home band is an auto-fit grid; the listing page needs to exercise wrap.
    expect(seedPlants.filter((plant) => plant.featured).length).toBeGreaterThanOrEqual(4)
    expect(seedPlants.length).toBeGreaterThanOrEqual(6)
  })

  it('includes a non-native plant so the Michigan native filter can exclude something', () => {
    expect(seedPlants.some((plant) => !plant.isNative)).toBe(true)
    expect(seedPlants.some((plant) => plant.isNative)).toBe(true)
  })

  it('covers every filter chip on the Favorite Plants page with at least one match', () => {
    expect(seedPlants.some((plant) => plant.lightTag === 'Full sun')).toBe(true)
    expect(seedPlants.some((plant) => plant.lightTag.includes('Shade'))).toBe(true)
    expect(seedPlants.some((plant) => plant.waterTag.includes('Low water'))).toBe(true)
    expect(seedPlants.some((plant) => plant.isNative)).toBe(true)
  })

  it('includes exactly one project with no before image', () => {
    // The acceptance list calls this case out: the after image then fills the
    // full card width at the same media height.
    const withoutBefore = seedProjectDetails.filter((project) => project.beforeImage === null)
    expect(withoutBefore).toHaveLength(1)
    expect(withoutBefore[0]?.slug).toBe('patio-pollinator-garden')
  })

  it('gives every project an after image with alt text', () => {
    for (const project of seedProjectDetails) {
      expect(project.afterImageAltText.trim().length).toBeGreaterThan(0)
    }
  })

  it('keeps slugs unique within each content type', () => {
    const uniqueCount = (slugs: readonly string[]): number => new Set(slugs).size

    const projectSlugs = seedProjectDetails.map((project) => project.slug)
    const postSlugs = seedBlogPostDetails.map((post) => post.slug)
    const serviceSlugs = seedServiceDetails.map((service) => service.slug)

    expect(uniqueCount(projectSlugs)).toBe(projectSlugs.length)
    expect(uniqueCount(postSlugs)).toBe(postSlugs.length)
    expect(uniqueCount(serviceSlugs)).toBe(serviceSlugs.length)
  })

  it('keeps entry ids unique across every type, because they are the cache tags', () => {
    const ids = [
      ...seedPlants,
      ...seedProjectDetails,
      ...seedBlogPostDetails,
      ...seedServiceDetails,
      ...seedTestimonials,
      seedSiteSettings,
    ].map((entry) => entry.sys.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses url-safe slugs', () => {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    for (const entry of [...seedProjectDetails, ...seedBlogPostDetails, ...seedServiceDetails]) {
      expect(entry.slug).toMatch(slugPattern)
    }
  })

  it('ships all six services named in the design, in display order', () => {
    expect(seedServiceDetails.map((service) => service.slug)).toEqual([...REQUIRED_SERVICE_SLUGS])

    const orders = seedServiceDetails.map((service) => service.order)
    expect([...orders].sort((a, b) => a - b)).toEqual(orders)
  })

  it('keeps every meta description within the 155-character limit', () => {
    const described = [...seedProjectDetails, ...seedBlogPostDetails, ...seedServiceDetails]
    for (const entry of described) {
      if (entry.metaDescription === null) continue
      expect(entry.metaDescription.length).toBeLessThanOrEqual(155)
    }
  })

  it('ships five testimonials, which is what the slider counter is designed around', () => {
    expect(seedTestimonials).toHaveLength(5)
    for (const testimonial of seedTestimonials) {
      expect(testimonial.quote.trim().length).toBeGreaterThan(0)
      expect(testimonial.attribution.trim().length).toBeGreaterThan(0)
      expect(testimonial.town.trim().length).toBeGreaterThan(0)
    }
  })

  it('has a real hero photograph and placeholder slots everywhere else', () => {
    expect(seedSiteSettings.heroImageDesktop?.url).not.toBeNull()
    expect(seedSiteSettings.heroImageMobile?.url).not.toBeNull()
    // No portrait has been shot yet — ImageSlot renders the placeholder.
    expect(seedSiteSettings.portrait?.url).toBeNull()
    expect(seedSiteSettings.portraitAltText.trim().length).toBeGreaterThan(0)
  })
})

describe('feed ordering', () => {
  it('interleaves projects and posts strictly newest first', () => {
    const feed = sortFeedNewestFirst(seedProjectDetails, seedBlogPostDetails)

    expect(feed).toHaveLength(seedProjectDetails.length + seedBlogPostDetails.length)

    const timestamps = feed.map((entry) => new Date(entry.date).getTime())
    expect([...timestamps].sort((a, b) => b - a)).toEqual(timestamps)
  })

  it('produces a mixed ordering rather than all projects then all posts', () => {
    const types = sortFeedNewestFirst(seedProjectDetails, seedBlogPostDetails).map(
      (entry) => entry.__typename,
    )
    const firstPost = types.indexOf('BlogPost')
    const lastProject = types.lastIndexOf('Project')

    expect(firstPost).toBeGreaterThanOrEqual(0)
    expect(lastProject).toBeGreaterThan(firstPost)
  })

  it('keeps every entry discriminated so the card dispatcher can switch exhaustively', () => {
    for (const entry of sortFeedNewestFirst(seedProjectDetails, seedBlogPostDetails)) {
      expect(['Project', 'BlogPost']).toContain(entry.__typename)
    }
  })
})

describe('cache tags', () => {
  it('recognises every content type the webhook can report', () => {
    expect(isContentTypeId('plant')).toBe(true)
    expect(isContentTypeId('blogPost')).toBe(true)
    expect(isContentTypeId('siteSettings')).toBe(true)
    expect(isContentTypeId('somethingElse')).toBe(false)
  })

  it('namespaces collection tags so they cannot collide with an entry id', () => {
    expect(collectionTag('plant')).toBe('plant:collection')
    // Contentful ids are alphanumeric, so a colon can never appear in one.
    expect(collectionTag('project')).toContain(':')
  })
})
