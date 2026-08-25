import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ROUTES, feedEntryHref } from '@/config/navigation'
import { DetailArticle, type DetailEntry } from '@/features/feed/detail-article'
import {
  getBlogPostBySlug,
  getBlogPosts,
  getProjectBySlug,
  getProjects,
} from '@/lib/contentful/queries'
import { blogPostingJsonLd, breadcrumbJsonLd, projectJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/lib/seo/json-ld-script'
import { pageMetadata } from '@/lib/seo/metadata'

/**
 * The shared detail route. Projects and posts live in one URL space because the
 * listing that leads here is one grid — splitting them into /projects and /blog
 * would mean a card's link depended on which kind it was.
 *
 * A slug can only belong to one type, so the lookup tries project first and
 * falls through to post. Both queries are cached, so the miss costs nothing.
 */

type PageProps = { params: Promise<{ slug: string }> }

async function findEntry(slug: string): Promise<DetailEntry | null> {
  const project = await getProjectBySlug(slug)
  if (project !== null) return { kind: 'project', entry: project }

  const post = await getBlogPostBySlug(slug)
  if (post !== null) return { kind: 'post', entry: post }

  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Next 16: params is async.
  const { slug } = await params
  const detail = await findEntry(slug)

  if (detail === null) return { title: 'Not found' }

  const path = feedEntryHref(slug)

  if (detail.kind === 'project') {
    return pageMetadata({
      title: `${detail.entry.title} — ${detail.entry.location}`,
      description: detail.entry.metaDescription ?? detail.entry.caption,
      path,
      type: 'article',
      publishedTime: detail.entry.date,
    })
  }

  return pageMetadata({
    title: detail.entry.title,
    description: detail.entry.metaDescription ?? detail.entry.excerpt,
    path,
    type: 'article',
    publishedTime: detail.entry.date,
  })
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()])
  return [...projects, ...posts].map((entry) => ({ slug: entry.slug }))
}

export default async function FeedEntryPage({ params }: PageProps) {
  const { slug } = await params
  const detail = await findEntry(slug)

  if (detail === null) notFound()

  const path = feedEntryHref(slug)
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: ROUTES.home },
    { name: 'Projects & Blog', path: ROUTES.feed },
    { name: detail.entry.title, path },
  ])

  return (
    <>
      <JsonLd
        nodes={[
          detail.kind === 'project'
            ? projectJsonLd(detail.entry, path)
            : blogPostingJsonLd(detail.entry, path),
          breadcrumb,
        ]}
      />
      <DetailArticle detail={detail} />
    </>
  )
}
