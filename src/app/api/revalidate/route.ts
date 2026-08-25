import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { collectionTag, entryTag, isContentTypeId } from '@/lib/contentful/tags'
import { contentSource } from '@/lib/env'

/**
 * Contentful publish webhook.
 *
 * Contentful tells us an entry id and a content type — never a URL — so
 * revalidation is driven off the entry tag (which every page rendering that
 * entry carries) plus the collection tag (which covers the listings the entry
 * newly appears in or has just left). That pair is exactly the set of pages an
 * edit can affect, and no more.
 *
 * A slug change is the case that makes id-tagging non-negotiable: the webhook
 * body carries the *new* slug, so a slug-keyed cache would leave the old URL
 * serving stale content forever.
 */

const HEADER = 'x-revalidate-secret'

const webhookBody = z.object({
  sys: z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    contentType: z.object({ sys: z.object({ id: z.string().min(1) }) }).optional(),
  }),
})

/** Constant-time comparison, so a wrong secret cannot be found byte by byte. */
function secretMatches(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false
  let mismatch = 0
  for (let index = 0; index < provided.length; index += 1) {
    mismatch |= provided.charCodeAt(index) ^ expected.charCodeAt(index)
  }
  return mismatch === 0
}

export async function POST(request: Request): Promise<NextResponse> {
  if (contentSource.mode !== 'live' || contentSource.revalidateSecret === undefined) {
    // Refusing rather than accepting-and-ignoring: an unconfigured endpoint that
    // returns 200 looks healthy in Contentful's webhook log while doing nothing.
    return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 })
  }

  const provided = request.headers.get(HEADER)
  if (provided === null || !secretMatches(provided, contentSource.revalidateSecret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const payload: unknown = await request.json().catch(() => null)
  const parsed = webhookBody.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Unrecognised webhook body.' }, { status: 400 })
  }

  const { sys } = parsed.data
  const revalidated: string[] = [entryTag(sys.id)]
  revalidateTag(entryTag(sys.id), 'max')

  const contentTypeId = sys.contentType?.sys.id
  if (contentTypeId !== undefined && isContentTypeId(contentTypeId)) {
    revalidateTag(collectionTag(contentTypeId), 'max')
    revalidated.push(collectionTag(contentTypeId))
  }

  return NextResponse.json({ revalidated })
}
