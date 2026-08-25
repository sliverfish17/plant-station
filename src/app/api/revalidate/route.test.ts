import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The webhook is the only unauthenticated-by-default surface on the site, and
 * the only thing that can invalidate the cache. Both halves of that are tested
 * here: that it refuses anything without the shared secret, and that a valid
 * publish invalidates exactly the entry tag plus its collection tag.
 */

const SECRET = 'test-revalidate-secret'

const revalidateTag = vi.fn<(tag: string, profile: string) => void>()

vi.mock('next/cache', () => ({
  revalidateTag: (tag: string, profile: string) => {
    revalidateTag(tag, profile)
  },
}))

vi.mock('@/lib/env', () => ({
  contentSource: {
    mode: 'live',
    spaceId: 'space',
    environment: 'master',
    deliveryToken: 'token',
    previewToken: undefined,
    revalidateSecret: SECRET,
    previewSecret: undefined,
  },
}))

const { POST } = await import('./route')

function webhookRequest(body: unknown, secret?: string): Request {
  return new Request('https://plant-station.com/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret === undefined ? {} : { 'x-revalidate-secret': secret }),
    },
    body: JSON.stringify(body),
  })
}

const publishedPlant = {
  sys: {
    id: 'plant-black-eyed-susan',
    type: 'Entry',
    contentType: { sys: { id: 'plant' } },
  },
}

beforeEach(() => {
  revalidateTag.mockClear()
})

describe('POST /api/revalidate', () => {
  it('rejects a request with no secret header', async () => {
    const response = await POST(webhookRequest(publishedPlant))

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects a request with the wrong secret', async () => {
    const response = await POST(webhookRequest(publishedPlant, 'not-the-secret'))

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects a secret of the right length but wrong content', async () => {
    const sameLength = 'x'.repeat(SECRET.length)
    const response = await POST(webhookRequest(publishedPlant, sameLength))

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('revalidates the entry tag and its collection tag on a valid publish', async () => {
    const response = await POST(webhookRequest(publishedPlant, SECRET))

    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('plant-black-eyed-susan', 'max')
    expect(revalidateTag).toHaveBeenCalledWith('plant:collection', 'max')
    expect(revalidateTag).toHaveBeenCalledTimes(2)
  })

  it('revalidates the entry alone when the payload has no content type', async () => {
    // Asset publishes arrive without a contentType, and there is no asset
    // collection to invalidate — only the pages that embed that asset.
    const response = await POST(
      webhookRequest({ sys: { id: 'asset-hero-edyta-garden', type: 'Asset' } }, SECRET),
    )

    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith('asset-hero-edyta-garden', 'max')
  })

  it('ignores a content type the site does not render', async () => {
    const response = await POST(
      webhookRequest(
        { sys: { id: 'entry-1', type: 'Entry', contentType: { sys: { id: 'unknownType' } } } },
        SECRET,
      ),
    )

    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith('entry-1', 'max')
  })

  it('rejects a body that is not a Contentful webhook payload', async () => {
    const response = await POST(webhookRequest({ hello: 'world' }, SECRET))

    expect(response.status).toBe(400)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('reports which tags it revalidated', async () => {
    const response = await POST(webhookRequest(publishedPlant, SECRET))
    const body: unknown = await response.json()

    expect(body).toEqual({ revalidated: ['plant-black-eyed-susan', 'plant:collection'] })
  })
})
