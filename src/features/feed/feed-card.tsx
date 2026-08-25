import type { FeedEntry } from '@/lib/contentful/queries'

import { BlogCard } from './blog-card'
import { ProjectCard } from './project-card'

/**
 * The dispatcher for the shared Projects & Blog grid.
 *
 * `FeedEntry` is a union discriminated on `__typename`, and this switch is
 * exhaustive with no `default` branch. That is the point: adding a third entry
 * type to the feed becomes a compile error here — TypeScript narrows `entry` to
 * `never` after the two known cases, and returning it is rejected — rather than
 * a card that silently fails to render in production.
 */
export function FeedCard({
  entry,
  headingLevel,
}: {
  readonly entry: FeedEntry
  readonly headingLevel?: 'h2' | 'h3' | undefined
}) {
  switch (entry.__typename) {
    case 'Project':
      return <ProjectCard project={entry} headingLevel={headingLevel} />
    case 'BlogPost':
      return <BlogCard post={entry} headingLevel={headingLevel} />
  }
}
