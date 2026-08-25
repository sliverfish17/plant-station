/**
 * Cache-tag vocabulary.
 *
 * Two kinds of tag, and the distinction matters for revalidation:
 *
 *   - **Entry tags** are the raw Contentful `sys.id`. The publish webhook only
 *     ever knows an id, so tagging by id is the only thing that can invalidate
 *     the exact pages an edit touched. Never tag by slug — a slug can be edited,
 *     and the webhook body reports the *new* slug while the cache still holds
 *     pages keyed by the old one.
 *
 *   - **Collection tags** cover the listings an entry appears in, so publishing
 *     a new plant refreshes the Favorite Plants grid even though no existing
 *     page carries that entry's id.
 */

export const CONTENT_TYPES = [
  'plant',
  'project',
  'blogPost',
  'testimonial',
  'service',
  'siteSettings',
] as const

export type ContentTypeId = (typeof CONTENT_TYPES)[number]

export function isContentTypeId(value: string): value is ContentTypeId {
  return CONTENT_TYPES.some((contentType) => contentType === value)
}

/** Tag for one entry, keyed by its immutable Contentful id. */
export function entryTag(sysId: string): string {
  return sysId
}

/** Tag for every listing that renders entries of a given type. */
export function collectionTag(contentType: ContentTypeId): string {
  return `${contentType}:collection`
}
