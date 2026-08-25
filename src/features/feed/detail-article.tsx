import Link from 'next/link'

import { IMAGE_SIZES } from '@/components/ui/aspect'
import { CmsImage } from '@/components/ui/cms-image'
import { CtaCard } from '@/components/ui/cta-card'
import { ROUTES } from '@/config/navigation'
import { formatMonthYear } from '@/lib/format'
import type { BlogPostDetailEntry, ProjectDetailEntry } from '@/lib/contentful/queries'

import { RichText } from './rich-text'

/**
 * One article template for both entry types, per artboards 4a and 4b.
 *
 * The column system is the part worth stating: title, body and CTA share an
 * 860px column, while the lead image is slightly wider at 1000px and shown as a
 * 2:1 centre crop of the 3:2 asset. That small overhang is what makes the image
 * read as a lead rather than as another paragraph.
 *
 * The two variants are a discriminated union, so the project-only before/after
 * pair and the post-only byline cannot appear on the wrong page.
 */

export type DetailEntry =
  | { readonly kind: 'project'; readonly entry: ProjectDetailEntry }
  | { readonly kind: 'post'; readonly entry: BlogPostDetailEntry }

const DEFAULT_CTA = {
  heading: 'Want something like this?',
  body: 'A free 15-minute call is the easiest way to start.',
  label: 'Book a Consultation',
} as const

export function DetailArticle({ detail }: { readonly detail: DetailEntry }) {
  const { entry } = detail

  const eyebrow =
    detail.kind === 'project'
      ? `Project · ${detail.entry.location}`
      : `Blog · ${formatMonthYear(detail.entry.date)}`

  const meta =
    detail.kind === 'project'
      ? (detail.entry.summary ?? `Completed ${formatMonthYear(detail.entry.date)}`)
      : `By ${detail.entry.author} · ${detail.entry.readingMinutes} min read`

  // A project may have a separate hero shot of the finished garden; most will
  // not, and the after image is the right stand-in when it is missing.
  const lead =
    detail.kind === 'project'
      ? {
          asset: detail.entry.leadImage ?? detail.entry.afterImage,
          alt:
            detail.entry.leadImage === null
              ? detail.entry.afterImageAltText
              : (detail.entry.leadImageAltText ?? detail.entry.afterImageAltText),
          caption:
            detail.entry.leadImage === null
              ? detail.entry.afterImageCaption
              : detail.entry.leadImageCaption,
        }
      : {
          asset: detail.entry.thumbnail,
          alt: detail.entry.thumbnailAltText,
          caption: detail.entry.thumbnailCaption,
        }

  return (
    <article className="pb-section">
      <div className="mx-auto w-full max-w-article px-gutter pt-detail-top">
        <Link
          href={ROUTES.feed}
          className="inline-flex min-h-control-sm items-center gap-1.5 text-body-sm font-semibold text-pink-700"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Projects &amp; Blog</span>
        </Link>

        <p
          className={`mt-5 text-eyebrow font-semibold tracking-eyebrow uppercase ${
            detail.kind === 'project' ? 'text-pink-700' : 'text-olive-700'
          }`}
        >
          {eyebrow}
        </p>

        <h1 className="mt-2 text-detail-title leading-heading">{entry.title}</h1>

        <p className="mt-3 text-lead leading-relaxed text-taupe">
          <time dateTime={entry.date}>{meta}</time>
        </p>
      </div>

      {/* The lead image overhangs the article column by 70px a side at 1440. */}
      <div className="mx-auto mt-8 w-full max-w-lead px-gutter">
        <CmsImage
          asset={lead.asset}
          alt={lead.alt}
          ratio="2:1"
          sizes={IMAGE_SIZES.lead}
          slotLabel="Lead image · 3:2 asset, 2:1 centre crop"
          rounded="card"
          priority
        />
        {lead.caption === null ? null : (
          <p className="mx-auto mt-2 max-w-[764px] text-center text-caption leading-normal text-taupe">
            {lead.caption}
          </p>
        )}
      </div>

      <div className="mx-auto mt-10 w-full max-w-article px-gutter">
        <RichText value={entry.body} />

        {detail.kind === 'project' && detail.entry.beforeImage !== null ? (
          <BeforeAndAfter project={detail.entry} />
        ) : null}
      </div>

      <div className="mx-auto mt-12 w-full max-w-article px-gutter">
        <CtaCard
          heading={entry.ctaHeading ?? DEFAULT_CTA.heading}
          body={entry.ctaBody ?? DEFAULT_CTA.body}
          label={entry.ctaLabel ?? DEFAULT_CTA.label}
          href={ROUTES.contact}
        />
      </div>
    </article>
  )
}

/** Project-only: the pair, with each image's own caption beneath it. */
function BeforeAndAfter({ project }: { readonly project: ProjectDetailEntry }) {
  return (
    <section aria-labelledby="before-after-heading" className="mt-9">
      <h2 id="before-after-heading" className="text-h3 leading-heading">
        Before &amp; after
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <figure className="m-0">
          <CmsImage
            asset={project.beforeImage}
            alt={project.beforeImageAltText ?? `${project.title} before the work began`}
            ratio="3:2"
            sizes={IMAGE_SIZES.detailPair}
            slotLabel="Before · 3:2"
          />
          {project.beforeImageCaption === null ? null : (
            <figcaption className="mt-1.5 text-caption leading-normal text-taupe">
              {project.beforeImageCaption}
            </figcaption>
          )}
        </figure>

        <figure className="m-0">
          <CmsImage
            asset={project.afterImage}
            alt={project.afterImageAltText}
            ratio="3:2"
            sizes={IMAGE_SIZES.detailPair}
            slotLabel="After · 3:2"
          />
          {project.afterImageCaption === null ? null : (
            <figcaption className="mt-1.5 text-caption leading-normal text-taupe">
              {project.afterImageCaption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}
