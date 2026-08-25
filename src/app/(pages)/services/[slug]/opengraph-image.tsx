import { SITE } from '@/config/site'
import { getServiceBySlug } from '@/lib/contentful/queries'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Service'

/** Per-service card, so a shared link names the service rather than the site. */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (service === null) {
    return renderOgImage({ title: 'Services', description: SITE.tagline })
  }

  return renderOgImage({
    eyebrow: `Service · ${SITE.locality}`,
    title: service.name,
    description: service.summary,
  })
}
