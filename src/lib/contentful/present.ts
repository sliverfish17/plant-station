/** Drops the nulls Contentful puts in `items` for entries it cannot resolve. */
export function present<T>(items: readonly (T | null)[]): T[] {
  return items.filter((item): item is T => item !== null)
}
