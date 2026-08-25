import { contentSource } from '@/lib/env'

import type { TypedDocumentString } from './generated/graphql'

/**
 * A single `fetch` against Contentful's GraphQL Content Delivery API.
 *
 * The generated operations are `TypedDocumentString`s — plain strings that carry
 * their result and variable types — so there is no GraphQL client in the bundle
 * and no runtime schema parsing. Caching is deliberately *not* configured here:
 * every caller sits inside a `"use cache"` function that owns its own tags and
 * lifetime, and a fetch-level cache underneath that would only add a second,
 * invisible expiry to reason about.
 */

export class ContentfulError extends Error {
  override readonly name = 'ContentfulError'

  constructor(
    message: string,
    readonly detail: { readonly operation: string; readonly status?: number },
  ) {
    super(message)
  }
}

type GraphQLResponse<TResult> = {
  data?: TResult
  errors?: readonly { message: string }[]
}

function isGraphQLResponse<TResult>(value: unknown): value is GraphQLResponse<TResult> {
  return typeof value === 'object' && value !== null
}

export type FetchOptions = {
  /** Draft mode reads unpublished entries through the Preview API. */
  readonly preview?: boolean
}

/**
 * True when `T` has at least one non-optional key. Operations whose variables are
 * all optional (a plain collection query) may omit the argument entirely, while
 * `ProjectBySlug` still cannot be called without a slug.
 */
type HasRequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K
}[keyof T] extends never
  ? false
  : true

type FetchArgs<TVariables> =
  HasRequiredKeys<TVariables> extends true
    ? [variables: TVariables, options?: FetchOptions]
    : [variables?: TVariables, options?: FetchOptions]

export async function fetchContentful<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  ...[variables, options]: FetchArgs<TVariables>
): Promise<TResult> {
  if (contentSource.mode !== 'live') {
    throw new ContentfulError(
      `Contentful is not configured (${contentSource.reason}). Callers must fall back to seed content.`,
      { operation: operationNameOf(document) },
    )
  }

  const preview = options?.preview ?? false
  const token = preview ? contentSource.previewToken : contentSource.deliveryToken

  if (token === undefined) {
    throw new ContentfulError('Preview requested but CONTENTFUL_PREVIEW_TOKEN is not set.', {
      operation: operationNameOf(document),
    })
  }

  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${contentSource.spaceId}/environments/${contentSource.environment}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: document.toString(),
      variables: { ...variables, preview },
    }),
  })

  if (!response.ok) {
    throw new ContentfulError(`Contentful responded ${response.status}`, {
      operation: operationNameOf(document),
      status: response.status,
    })
  }

  const payload: unknown = await response.json()

  if (!isGraphQLResponse<TResult>(payload)) {
    throw new ContentfulError('Contentful returned a non-object response', {
      operation: operationNameOf(document),
    })
  }

  if (payload.errors && payload.errors.length > 0) {
    const messages = payload.errors.map((error) => error.message).join('; ')
    throw new ContentfulError(messages, { operation: operationNameOf(document) })
  }

  if (payload.data === undefined) {
    throw new ContentfulError('Contentful returned no data', {
      operation: operationNameOf(document),
    })
  }

  return payload.data
}

/** Best-effort operation name, for error messages only. */
function operationNameOf(document: { toString(): string }): string {
  const match = /(?:query|mutation)\s+(\w+)/.exec(document.toString())
  return match?.[1] ?? 'anonymous'
}
