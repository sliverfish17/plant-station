import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

import { contentSource } from '@/lib/env'

/**
 * Draft-mode entry point, used by Contentful's "Open preview" action.
 *
 * Contentful is configured with
 *   /api/preview?secret=<CONTENTFUL_PREVIEW_SECRET>&path=/projects-blog/{slug}
 *
 * Once draft mode is on, the read layer swaps the delivery token for the preview
 * token and Next bypasses the cached render, so unpublished edits appear without
 * the publish webhook having fired.
 */

/** Only same-origin paths, so the secret cannot be used to bounce a visitor off-site. */
function safeRedirectPath(raw: string | null): string {
  if (raw === null || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

export async function GET(request: Request): Promise<NextResponse> {
  if (contentSource.mode !== 'live' || contentSource.previewSecret === undefined) {
    return NextResponse.json({ error: 'Preview is not configured.' }, { status: 503 })
  }

  const url = new URL(request.url)
  if (url.searchParams.get('secret') !== contentSource.previewSecret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(safeRedirectPath(url.searchParams.get('path')))
}
