import { FeedCard } from '@/features/feed/feed-card'
import { FilterableListing, type FilterDefinition } from '@/features/feed/filterable-listing'
import { getFeed, type FeedEntry } from '@/lib/contentful/queries'

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
        node: <FeedCard key={entry.sys.id} entry={entry} />,
      }))}
    />
  )
}
