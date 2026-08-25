import { notFound } from 'next/navigation'

import { DetailArticle, type DetailEntry } from '@/features/feed/detail-article'
import {
  getBlogPostBySlug,
  getBlogPosts,
  getProjectBySlug,
  getProjects,
} from '@/lib/contentful/queries'

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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()])
  return [...projects, ...posts].map((entry) => ({ slug: entry.slug }))
}

export default async function FeedEntryPage({ params }: PageProps) {
  // Next 16: params is async.
  const { slug } = await params
  const detail = await findEntry(slug)

  if (detail === null) notFound()

  return <DetailArticle detail={detail} />
}
