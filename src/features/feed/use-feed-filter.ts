'use client'

import { useCallback, useMemo, useState } from 'react'

/**
 * Client-side filtering plus "Load more", generic over the item type.
 *
 * One hook drives both listing pages: Projects & Blog filters a union by
 * `__typename`, Favorite Plants filters plants by tag. What they share is the
 * shape of the problem — a set of named filters, one active at a time, a
 * progressively revealed page of results — so the hook takes the *predicate* as
 * data and stays ignorant of what is being filtered.
 *
 * Filtering is client-side because the entire collection is already in the
 * cached payload; a round trip per chip would be slower and would break the
 * chips entirely without JavaScript. The unfiltered list is server-rendered, so
 * a no-JS visitor still sees every entry.
 */

export type FilterOption<T> = {
  readonly id: string
  readonly label: string
  /** `null` means "everything" — the All chip needs no predicate. */
  readonly matches: ((item: T) => boolean) | null
}

export type FeedFilter<T> = {
  readonly activeId: string
  readonly select: (id: string) => void
  /** Everything matching the active filter. */
  readonly matched: readonly T[]
  /** The slice currently rendered. */
  readonly visible: readonly T[]
  readonly hasMore: boolean
  readonly loadMore: () => void
  readonly options: readonly FilterOption<T>[]
}

export function useFeedFilter<T>(
  items: readonly T[],
  options: readonly FilterOption<T>[],
  { pageSize = Number.POSITIVE_INFINITY }: { readonly pageSize?: number } = {},
): FeedFilter<T> {
  const firstOption = options[0]
  const [activeId, setActiveId] = useState(firstOption?.id ?? 'all')
  const [page, setPage] = useState(1)

  const matched = useMemo(() => {
    const matches = options.find((option) => option.id === activeId)?.matches
    // No predicate means "All" — and an unknown id falls through to the same
    // place, so a stale filter can never blank the page.
    if (matches === undefined || matches === null) return items
    return items.filter(matches)
  }, [items, options, activeId])

  const select = useCallback((id: string) => {
    setActiveId(id)
    // Changing the filter starts a new result set, so the reveal resets with it.
    // Keeping the page count would show an arbitrary window of the new results.
    setPage(1)
  }, [])

  const loadMore = useCallback(() => {
    setPage((current) => current + 1)
  }, [])

  const limit = pageSize === Number.POSITIVE_INFINITY ? matched.length : pageSize * page
  const visible = useMemo(() => matched.slice(0, limit), [matched, limit])

  return {
    activeId,
    select,
    matched,
    visible,
    hasMore: visible.length < matched.length,
    loadMore,
    options,
  }
}
