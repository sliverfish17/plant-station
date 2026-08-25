'use client'

import { useMemo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { FilterChip, type FilterChipTone } from '@/components/ui/filter-chip'
import { PageHeader } from '@/components/ui/page-header'
import { Section, type SectionTone } from '@/components/ui/section'

import { useFeedFilter, type FilterOption } from './use-feed-filter'

/**
 * Client island 3 of 4: the filtered listing surface, shared by both listing
 * pages.
 *
 * It spans two bands — the chips sit inside the coloured page header and the
 * grid below it — so the whole surface is one component rather than two halves
 * trying to share state across a Server Component boundary. `Section` and
 * `PageHeader` are pure presentational components, so importing them here costs
 * a few hundred bytes and keeps the band pattern defined in exactly one place.
 *
 * The cards are rendered on the **server** and handed over as nodes. That is
 * what makes one island serve both pages: a predicate cannot cross the boundary,
 * but the set of ids each filter matches is plain data, and it can. The
 * consequence is that no card component ships to the browser at all.
 */

export type FilterableItem = {
  readonly id: string
  readonly node: ReactNode
}

export type FilterDefinition = {
  readonly id: string
  readonly label: string
  /** `null` means "everything"; otherwise the ids this filter matches. */
  readonly matchingIds: readonly string[] | null
}

type FilterableListingProps = {
  readonly title: string
  readonly intro: string
  readonly tone: SectionTone
  readonly chipTone: FilterChipTone
  readonly items: readonly FilterableItem[]
  readonly filters: readonly FilterDefinition[]
  readonly gridClassName: string
  /** Reveal step. Omit to show everything at once. */
  readonly pageSize?: number | undefined
  /** Singular noun for the live region: "plant", "entry". */
  readonly itemNoun: string
  readonly emptyMessage: string
  readonly gridId: string
  /** Rendered below the grid — the consultation CTA on Favorite Plants. */
  readonly footer?: ReactNode
}

export function FilterableListing({
  title,
  intro,
  tone,
  chipTone,
  items,
  filters,
  gridClassName,
  pageSize,
  itemNoun,
  emptyMessage,
  gridId,
  footer,
}: FilterableListingProps) {
  const options = useMemo<readonly FilterOption<FilterableItem>[]>(
    () =>
      filters.map((filter) => {
        if (filter.matchingIds === null) {
          return { id: filter.id, label: filter.label, matches: null }
        }
        // A Set, so filtering stays linear as the collection grows.
        const ids = new Set(filter.matchingIds)
        return { id: filter.id, label: filter.label, matches: (item) => ids.has(item.id) }
      }),
    [filters],
  )

  const { activeId, select, visible, matched, hasMore, loadMore } = useFeedFilter(items, options, {
    ...(pageSize === undefined ? {} : { pageSize }),
  })

  return (
    <>
      <PageHeader tone={tone} title={title} intro={intro}>
        <div className="flex flex-wrap gap-2.5">
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              tone={chipTone}
              isActive={filter.id === activeId}
              onSelect={() => {
                select(filter.id)
              }}
              controls={gridId}
            />
          ))}
        </div>
      </PageHeader>

      <Section pad="band-listing">
        <div id={gridId}>
          {/* Announced, so a filter that narrows to nothing is never silent. */}
          <p aria-live="polite" className="sr-only">
            {matched.length} {matched.length === 1 ? itemNoun : `${itemNoun}s`} shown
          </p>

          {visible.length === 0 ? (
            <p className="text-lead">{emptyMessage}</p>
          ) : (
            <ul className={gridClassName}>{visible.map((item) => item.node)}</ul>
          )}

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <Button type="button" variant="outline" size="md" onClick={loadMore}>
                Load more
              </Button>
            </div>
          ) : null}
        </div>

        {footer === undefined ? null : <div className="mt-12">{footer}</div>}
      </Section>
    </>
  )
}
