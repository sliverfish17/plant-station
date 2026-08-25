import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { z } from 'zod'

import { IMAGE_SIZES } from '@/components/ui/aspect'
import { CmsImage } from '@/components/ui/cms-image'
import type { AssetFieldsFragment } from '@/lib/contentful/generated/graphql'

/**
 * Renders a Contentful rich-text body into the article column.
 *
 * Every node type gets an explicit renderer rather than inheriting from a prose
 * class: body copy on this site is 19px at 1.75 over a 68ch measure, and those
 * are accessibility decisions from the handoff, not typographic defaults to be
 * borrowed from a plugin.
 *
 * The `json` field arrives typed as `unknown` — Contentful's GraphQL `JSON`
 * scalar carries no shape — so it is guarded here rather than asserted.
 */

type AssetLink = { readonly sys: { readonly id: string } } & Partial<AssetFieldsFragment> & {
    readonly title?: string | null
    readonly description?: string | null
  }

type RichTextValue = {
  readonly json: unknown
  readonly links?: {
    readonly assets?: {
      readonly block?: readonly (AssetLink | null)[]
      readonly hyperlink?: readonly (AssetLink | null)[]
    }
  }
}

/**
 * A rich-text node's `data` is typed `any` by the renderer, so the id of a
 * linked entry is narrowed rather than asserted. Anything that does not match
 * yields `undefined`, and the node renders nothing instead of throwing on a
 * malformed link.
 */
const linkedTarget = z.object({ target: z.object({ sys: z.object({ id: z.string() }) }) })

function linkedAssetId(data: unknown): string | undefined {
  const parsed = linkedTarget.safeParse(data)
  return parsed.success ? parsed.data.target.sys.id : undefined
}

function isDocument(value: unknown): value is Document {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    value.nodeType === BLOCKS.DOCUMENT &&
    'content' in value &&
    Array.isArray(value.content)
  )
}

export function RichText({ value }: { readonly value: RichTextValue | null }) {
  if (value === null || !isDocument(value.json)) return null

  const blockAssets = new Map<string, AssetLink>()
  for (const asset of value.links?.assets?.block ?? []) {
    if (asset !== null) blockAssets.set(asset.sys.id, asset)
  }

  const hyperlinkAssets = new Map<string, AssetLink>()
  for (const asset of value.links?.assets?.hyperlink ?? []) {
    if (asset !== null) hyperlinkAssets.set(asset.sys.id, asset)
  }

  return (
    <>
      {documentToReactComponents(value.json, {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (_node, children: ReactNode) => (
            <p className="mt-4 max-w-measure text-body leading-loose first:mt-0">{children}</p>
          ),
          [BLOCKS.HEADING_2]: (_node, children: ReactNode) => (
            <h2 className="mt-9 text-h3 leading-heading">{children}</h2>
          ),
          [BLOCKS.HEADING_3]: (_node, children: ReactNode) => (
            <h3 className="mt-7 font-serif text-cta-heading leading-heading text-olive-700">
              {children}
            </h3>
          ),
          [BLOCKS.UL_LIST]: (_node, children: ReactNode) => (
            <ul className="mt-4 max-w-measure list-disc pl-6 text-body leading-loose marker:text-sage-500">
              {children}
            </ul>
          ),
          [BLOCKS.OL_LIST]: (_node, children: ReactNode) => (
            <ol className="mt-4 max-w-measure list-decimal pl-6 text-body leading-loose marker:text-sage-500">
              {children}
            </ol>
          ),
          [BLOCKS.LIST_ITEM]: (_node, children: ReactNode) => (
            // The renderer wraps each item's text in a paragraph; unwrapping the
            // margin here keeps list items tight instead of double-spaced.
            <li className="mt-1.5 [&>p]:mt-0">{children}</li>
          ),
          [BLOCKS.QUOTE]: (_node, children: ReactNode) => (
            <blockquote className="mt-6 max-w-measure border-l-4 border-sage-300 pl-5 font-serif text-quote leading-snug text-olive-700">
              {children}
            </blockquote>
          ),
          [BLOCKS.HR]: () => <hr className="mt-9 border-cream-line" />,
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const id = linkedAssetId(node.data)
            const asset = id === undefined ? undefined : blockAssets.get(id)
            if (asset?.url === undefined || asset.url === null) return null

            return (
              <figure className="mt-8">
                <CmsImage
                  asset={{
                    __typename: 'Asset',
                    sys: asset.sys,
                    url: asset.url,
                    width: asset.width ?? null,
                    height: asset.height ?? null,
                    contentType: asset.contentType ?? null,
                  }}
                  alt={asset.description ?? asset.title ?? ''}
                  ratio="3:2"
                  sizes={IMAGE_SIZES.detailPair}
                  slotLabel="Article image · 3:2"
                />
                {asset.title === null || asset.title === undefined ? null : (
                  <figcaption className="mt-2 text-caption leading-normal text-taupe">
                    {asset.title}
                  </figcaption>
                )}
              </figure>
            )
          },
          [INLINES.HYPERLINK]: (node, children: ReactNode) => {
            const href = z.string().catch('').parse(node.data.uri)
            const isExternal = href.startsWith('http')

            return (
              <Link
                href={href}
                className="font-semibold text-pink-700 underline underline-offset-2"
                {...(isExternal ? { rel: 'noopener', target: '_blank' } : {})}
              >
                {children}
              </Link>
            )
          },
          [INLINES.ASSET_HYPERLINK]: (node, children: ReactNode) => {
            const id = linkedAssetId(node.data)
            const asset = id === undefined ? undefined : hyperlinkAssets.get(id)
            if (asset?.url === undefined || asset.url === null) return <>{children}</>

            return (
              <a
                href={asset.url}
                className="font-semibold text-pink-700 underline underline-offset-2"
                rel="noopener"
              >
                {children}
              </a>
            )
          },
        },
      })}
    </>
  )
}
