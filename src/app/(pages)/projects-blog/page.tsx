import type { Metadata } from 'next'

import { ROUTES } from '@/config/navigation'
import { FeedCard } from '@/features/feed/feed-card'
import { FilterableListing, type FilterDefinition } from '@/features/feed/filterable-listing'
import { getFeed, type FeedEntry } from '@/lib/contentful/queries'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

/** Title from artboard 3a, which specifies it exactly. */
export const metadata: Metadata = pageMetadata({
  title: 'Garden Projects & Blog',
  description:
    "Gardens I've worked on around Metro Detroit, and notes on what actually grows well in Michigan clay, shade, and winters.",
  path: ROUTES.feed,
})

/**
 * Projects & Blog — one grid, two entry types, newest first.
 *
 * The chips narrow by `__typename`, which is the same discriminator the card
 * dispatcher switches on, so a filter and a card can never disagree about what
 * an entry is.
 */

const PAGE_SIZE = 6

function idsOfType(feed: readonly FeedEntry[], type: FeedEntry['__typename']): readonly string[] {
  return feed.filter((entry) => entry.__typename === type).map((entry) => entry.sys.id)
}

function buildFilters(feed: readonly FeedEntry[]): readonly FilterDefinition[] {
  return [
    { id: 'all', label: 'All', matchingIds: null },
    { id: 'projects', label: 'Projects', matchingIds: idsOfType(feed, 'Project') },
    { id: 'blog', label: 'Blog', matchingIds: idsOfType(feed, 'BlogPost') },
  ]
}

export default async function ProjectsBlogPage() {
  const feed = await getFeed()

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Projects & Blog', path: ROUTES.feed },
          ]),
        ]}
      />

      <FilterableListing
        title="Projects & Blog"
        intro="Gardens I've worked on around Metro Detroit, and notes on what actually grows well here."
        tone="cream-alt"
        chipTone="on-cream"
        gridId="feed-grid"
        pageSize={PAGE_SIZE}
        itemNoun="entry"
        emptyMessage="Nothing here yet — check back soon."
        gridClassName="grid list-none grid-cols-1 items-stretch gap-5 p-0 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:gap-6"
        filters={buildFilters(feed)}
        items={feed.map((entry) => ({
          id: entry.sys.id,
          // Directly under the page h1, so these are h2 — an h3 would skip a level.
          node: <FeedCard key={entry.sys.id} entry={entry} headingLevel="h2" />,
        }))}
      />
    </>
  )
}
