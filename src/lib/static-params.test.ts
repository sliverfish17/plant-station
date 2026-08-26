import { describe, expect, it } from 'vitest'

import { atLeastOneSlug } from './static-params'

describe('atLeastOneSlug', () => {
  it('passes a populated collection through unchanged', () => {
    const params = [{ slug: 'consulting' }, { slug: 'soil-testing' }]

    expect(atLeastOneSlug(params)).toEqual(params)
  })

  it('substitutes one slug when the collection is empty', () => {
    // Returning [] here is a hard error under Cache Components and takes the
    // whole route down with a 500, so an empty CMS must not produce one.
    expect(atLeastOneSlug([])).toHaveLength(1)
  })

  it('substitutes a slug that no real entry can claim by accident', () => {
    const [substitute] = atLeastOneSlug([])

    // It only has to miss; the page's own notFound() turns that into a 404.
    expect(substitute?.slug).toBe('no-entries')
  })
})
