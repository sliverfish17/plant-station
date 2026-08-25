import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Leaves draft mode and returns to the published site. */
export async function GET(request: Request): Promise<never> {
  const draft = await draftMode()
  draft.disable()

  const path = new URL(request.url).searchParams.get('path')
  redirect(path !== null && path.startsWith('/') && !path.startsWith('//') ? path : '/')
}
