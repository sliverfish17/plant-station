import { getBlogPostBySlug, getProjectBySlug } from '@/lib/contentful/queries'
import { formatMonthYear } from '@/lib/format'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Project or blog post'

/** Per-entry card. The eyebrow distinguishes a project from a post at a glance. */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const project = await getProjectBySlug(slug)
  if (project !== null) {
    return renderOgImage({
      eyebrow: `Project · ${project.location}`,
      title: project.title,
      description: project.caption,
    })
  }

  const post = await getBlogPostBySlug(slug)
  if (post !== null) {
    return renderOgImage({
      eyebrow: `Blog · ${formatMonthYear(post.date)}`,
      title: post.title,
      description: post.excerpt,
    })
  }

  return renderOgImage({ title: 'Projects & Blog' })
}
