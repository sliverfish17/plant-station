import type { BlogPostEntry, FeedEntry, ProjectEntry } from './queries'

/**
 * The Projects & Blog grid renders projects and posts in one flow. Ordering is a
 * pure function so it can be tested without a Next render context, and so the
 * cached and preview read paths cannot drift apart on what "newest first" means.
 */
export function sortFeedNewestFirst(
  projects: readonly ProjectEntry[],
  posts: readonly BlogPostEntry[],
): readonly FeedEntry[] {
  return [...projects, ...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
