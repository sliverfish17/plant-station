import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useFeedFilter, type FilterOption } from './use-feed-filter'

/**
 * The hook drives both listing pages, so it is tested against both shapes: a
 * discriminated union filtered by `__typename`, and plain objects filtered by
 * tag. If it needed to know anything about either, that would show up here.
 */

type Entry = { readonly __typename: 'Project' | 'BlogPost'; readonly id: string }

const FEED: readonly Entry[] = [
  { __typename: 'Project', id: 'p1' },
  { __typename: 'BlogPost', id: 'b1' },
  { __typename: 'Project', id: 'p2' },
  { __typename: 'BlogPost', id: 'b2' },
  { __typename: 'BlogPost', id: 'b3' },
]

const FEED_OPTIONS: readonly FilterOption<Entry>[] = [
  { id: 'all', label: 'All', matches: null },
  { id: 'projects', label: 'Projects', matches: (entry) => entry.__typename === 'Project' },
  { id: 'blog', label: 'Blog', matches: (entry) => entry.__typename === 'BlogPost' },
]

type Plant = { readonly name: string; readonly light: string; readonly native: boolean }

const PLANTS: readonly Plant[] = [
  { name: 'Coneflower', light: 'Full sun', native: true },
  { name: 'Ostrich Fern', light: 'Shade', native: true },
  { name: 'Bottlebrush Buckeye', light: 'Part shade', native: false },
]

const PLANT_OPTIONS: readonly FilterOption<Plant>[] = [
  { id: 'all', label: 'All', matches: null },
  { id: 'sun', label: 'Full sun', matches: (plant) => plant.light === 'Full sun' },
  { id: 'shade', label: 'Shade', matches: (plant) => plant.light.includes('hade') },
  { id: 'native', label: 'Michigan native', matches: (plant) => plant.native },
]

describe('useFeedFilter', () => {
  it('starts on the first option and shows everything', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS))

    expect(result.current.activeId).toBe('all')
    expect(result.current.visible).toHaveLength(5)
    expect(result.current.hasMore).toBe(false)
  })

  it('narrows a discriminated union by __typename', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS))

    act(() => {
      result.current.select('projects')
    })

    expect(result.current.visible.map((entry) => entry.id)).toEqual(['p1', 'p2'])
  })

  it('narrows plain objects by tag, driving the other listing page', () => {
    const { result } = renderHook(() => useFeedFilter(PLANTS, PLANT_OPTIONS))

    act(() => {
      result.current.select('shade')
    })
    expect(result.current.visible.map((plant) => plant.name)).toEqual([
      'Ostrich Fern',
      'Bottlebrush Buckeye',
    ])

    act(() => {
      result.current.select('native')
    })
    expect(result.current.visible.map((plant) => plant.name)).toEqual([
      'Coneflower',
      'Ostrich Fern',
    ])
  })

  it('returns to everything when All is selected again', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS))

    act(() => {
      result.current.select('blog')
    })
    expect(result.current.visible).toHaveLength(3)

    act(() => {
      result.current.select('all')
    })
    expect(result.current.visible).toHaveLength(5)
  })

  it('reveals a page at a time and reports when more remain', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS, { pageSize: 2 }))

    expect(result.current.visible.map((entry) => entry.id)).toEqual(['p1', 'b1'])
    expect(result.current.hasMore).toBe(true)

    act(() => {
      result.current.loadMore()
    })
    expect(result.current.visible).toHaveLength(4)
    expect(result.current.hasMore).toBe(true)

    act(() => {
      result.current.loadMore()
    })
    expect(result.current.visible).toHaveLength(5)
    expect(result.current.hasMore).toBe(false)
  })

  it('resets the reveal when the filter changes', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS, { pageSize: 2 }))

    act(() => {
      result.current.loadMore()
    })
    expect(result.current.visible).toHaveLength(4)

    // Otherwise the new result set would open at an arbitrary window.
    act(() => {
      result.current.select('blog')
    })
    expect(result.current.visible).toHaveLength(2)
    expect(result.current.hasMore).toBe(true)
  })

  it('reports no more results when a filter yields fewer than a page', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS, { pageSize: 4 }))

    act(() => {
      result.current.select('projects')
    })

    expect(result.current.visible).toHaveLength(2)
    expect(result.current.hasMore).toBe(false)
  })

  it('handles a filter that matches nothing', () => {
    const { result } = renderHook(() =>
      useFeedFilter(PLANTS, [
        ...PLANT_OPTIONS,
        { id: 'aquatic', label: 'Aquatic', matches: () => false },
      ]),
    )

    act(() => {
      result.current.select('aquatic')
    })

    expect(result.current.visible).toEqual([])
    expect(result.current.hasMore).toBe(false)
  })

  it('falls back to everything if an unknown filter id is selected', () => {
    const { result } = renderHook(() => useFeedFilter(FEED, FEED_OPTIONS))

    act(() => {
      result.current.select('nonexistent')
    })

    expect(result.current.visible).toHaveLength(5)
  })

  it('survives an empty collection', () => {
    const { result } = renderHook(() => useFeedFilter([], FEED_OPTIONS, { pageSize: 3 }))

    expect(result.current.visible).toEqual([])
    expect(result.current.hasMore).toBe(false)
  })
})
