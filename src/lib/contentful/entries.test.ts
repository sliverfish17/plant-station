import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

import {
  parseBlogPosts,
  parsePlants,
  parseProjectDetail,
  parseProjects,
  parseServices,
  parseSiteSettings,
} from './entries'

/**
 * The parse boundary is the only thing standing between Contentful's
 * everything-is-nullable GraphQL response and components that assume a required
 * field is present. What matters is the line it draws: a missing *required
 * field* means a broken entry and it is dropped, while a missing *asset link*
 * is an ordinary state — the photo has not been uploaded yet — and must not be.
 *
 * Raw fixtures are written the way the CDA actually answers, with every field
 * nullable, so these exercise the real input rather than a tidied-up version.
 */

const asset = {
  url: 'https://images.ctfassets.net/x/photo.jpg',
  width: 1200,
  height: 800,
  contentType: 'image/jpeg',
  sys: { id: 'asset-1' },
}

function rawPlant(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Plant' as const,
    sys: { id: 'plant-1' },
    commonName: 'Black-Eyed Susan',
    latinName: 'Rudbeckia fulgida',
    lightTag: 'Full sun',
    waterTag: 'Low water',
    isNative: true,
    featured: true,
    order: 10,
    photo: asset,
    photoAltText: 'Golden black-eyed Susans in full flower.',
    photoCaption: null,
    ...overrides,
  }
}

function rawProject(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Project' as const,
    sys: { id: 'project-1' },
    title: 'Shade border, reborn',
    slug: 'shade-border-reborn',
    caption: 'A dry, root-filled strip under two maples.',
    location: 'Royal Oak',
    date: '2026-06-15T00:00:00.000Z',
    beforeImage: null,
    beforeImageAltText: null,
    beforeImageCaption: null,
    afterImage: asset,
    afterImageAltText: 'Layered ferns and hostas in the same corner.',
    afterImageCaption: null,
    ...overrides,
  }
}

let warn: MockInstance<typeof console.warn>

beforeEach(() => {
  // Silenced rather than left to print: several of these deliberately feed the
  // parser broken entries, and the warnings are the assertion, not noise.
  warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
})

afterEach(() => {
  warn.mockRestore()
})

describe('required fields', () => {
  it('accepts a complete entry and hands back non-nullable fields', () => {
    const [plant] = parsePlants([rawPlant()])

    expect(plant).toBeDefined()
    // The point of the whole layer: these read without a null check.
    expect(plant?.commonName.length).toBeGreaterThan(0)
    expect(plant?.photoAltText.length).toBeGreaterThan(0)
    expect(plant?.lightTag).toBe('Full sun')
    expect(plant?.isNative).toBe(true)
  })

  it('drops an entry whose required field is null', () => {
    expect(parsePlants([rawPlant({ commonName: null })])).toHaveLength(0)
  })

  it('drops an entry whose required text is empty, not just null', () => {
    // Contentful stores '' for a field that was filled in and then cleared, and
    // an empty heading is as broken on the page as a missing one.
    expect(parsePlants([rawPlant({ commonName: '' })])).toHaveLength(0)
  })

  it('names the entry and the failing field so the entry can be found', () => {
    parsePlants([rawPlant({ sys: { id: 'plant-broken' }, photoAltText: null })])

    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]?.[0])
    expect(message).toContain('plant-broken')
    expect(message).toContain('photoAltText')
  })

  it('keeps the rest of the collection when one entry is broken', () => {
    const parsed = parsePlants([
      rawPlant({ sys: { id: 'good-1' } }),
      rawPlant({ sys: { id: 'bad' }, latinName: null }),
      rawPlant({ sys: { id: 'good-2' } }),
    ])

    // One unpublishable entry must not take the page down with it.
    expect(parsed.map((plant) => plant.sys.id)).toEqual(['good-1', 'good-2'])
  })

  it('drops the nulls Contentful puts in items for unresolvable entries', () => {
    expect(parsePlants([null, rawPlant(), null])).toHaveLength(1)
  })
})

describe('asset links', () => {
  it('keeps an entry whose photo has not been uploaded', () => {
    // A published entry can link an unpublished asset, and CmsImage renders its
    // placeholder for exactly this. Dropping the plant instead would be wrong.
    const [plant] = parsePlants([rawPlant({ photo: null })])

    expect(plant?.photo).toBeNull()
    expect(plant?.commonName).toBe('Black-Eyed Susan')
  })

  it('keeps an asset that exists but has not finished processing', () => {
    const [plant] = parsePlants([
      rawPlant({ photo: { ...asset, url: null, width: null, height: null, contentType: null } }),
    ])

    expect(plant?.photo?.url).toBeNull()
  })
})

describe('slugs and dates', () => {
  it('rejects a slug that would produce a broken URL', () => {
    expect(parseProjects([rawProject({ slug: 'Shade Border' })])).toHaveLength(0)
  })

  it('accepts a well-formed slug', () => {
    expect(parseProjects([rawProject()])).toHaveLength(1)
  })

  it('rejects a date that would render as "Invalid Date"', () => {
    // sitemap.ts and the card meta both feed this straight to `new Date()`.
    expect(parseProjects([rawProject({ date: 'summer' })])).toHaveLength(0)
  })

  it('accepts a date-only value, which is what a Date field without a time returns', () => {
    const [project] = parseProjects([rawProject({ date: '2026-06-15' })])

    expect(Number.isNaN(Date.parse(project?.date ?? ''))).toBe(false)
  })
})

describe('detail entries', () => {
  const body = {
    json: { nodeType: 'document', data: {}, content: [] },
    links: { assets: { block: [], hyperlink: [] } },
  }

  it('re-attaches the rich-text body untouched', () => {
    const parsed = parseProjectDetail({
      ...rawProject(),
      summary: null,
      metaDescription: null,
      leadImage: null,
      leadImageAltText: null,
      leadImageCaption: null,
      ctaHeading: null,
      ctaBody: null,
      ctaLabel: null,
      // The schema strips unknown keys; the body is merged back in afterwards,
      // so it has to survive that round trip by identity.
      body,
    })

    expect(parsed?.body).toBe(body)
    expect(parsed?.title).toBe('Shade border, reborn')
  })

  it('returns null when the entry is missing entirely', () => {
    expect(parseProjectDetail(undefined)).toBeNull()
    expect(parseSiteSettings(undefined)).toBeNull()
  })
})

describe('other content types', () => {
  it('requires a reading time on a blog post', () => {
    const raw = {
      __typename: 'BlogPost' as const,
      sys: { id: 'post-1' },
      title: 'What to plant in clay soil',
      slug: 'what-to-plant-in-clay-soil',
      excerpt: 'Clay is not a problem to fix.',
      date: '2026-05-02T00:00:00.000Z',
      author: 'Edyta Phillips',
      readingMinutes: 4,
      thumbnail: asset,
      thumbnailAltText: 'A handful of damp grey clay soil.',
      thumbnailCaption: null,
    }

    const withoutReadingTime = { ...raw, readingMinutes: null }

    expect(parseBlogPosts([raw])).toHaveLength(1)
    expect(parseBlogPosts([withoutReadingTime])).toHaveLength(0)
  })

  it('requires an icon on a service, since the circle cannot render without one', () => {
    const raw = {
      __typename: 'Service' as const,
      sys: { id: 'service-1' },
      name: 'Soil Testing',
      slug: 'soil-testing',
      summary: 'Find out what your soil actually needs.',
      iconKey: 'soil',
      order: 30,
    }

    const withoutIcon = { ...raw, iconKey: null }

    expect(parseServices([raw])).toHaveLength(1)
    expect(parseServices([withoutIcon])).toHaveLength(0)
  })
})
