import Link from 'next/link'

import { Card, Eyebrow } from '@/components/ui/card'
import { feedEntryHref } from '@/config/navigation'
import type { ProjectEntry } from '@/lib/contentful/queries'

import { ProjectMedia } from './project-media'

/**
 * A project card. The home gallery renders it without the eyebrow and link
 * (artboards 1a–1c show title and caption only); the Projects & Blog grid adds
 * both. That difference is a `variant`, not two components, because everything
 * else — media, equal-height behaviour, caption composition — is identical.
 */
export function ProjectCard({
  project,
  variant = 'feed',
  headingLevel: Heading = 'h3',
}: {
  readonly project: ProjectEntry
  readonly variant?: 'feed' | 'gallery' | undefined
  /** `h2` on the listing page, where cards sit directly under the page `h1`. */
  readonly headingLevel?: 'h2' | 'h3' | undefined
}) {
  return (
    <Card as="li">
      <ProjectMedia project={project} />

      {variant === 'feed' ? <Eyebrow tone="pink">Project</Eyebrow> : null}

      <Heading
        className={`font-serif text-card-title text-olive-700 ${variant === 'feed' ? 'mt-1.5' : 'mt-3'}`}
      >
        {project.title}
      </Heading>

      <p className="mt-1.5 text-body-sm leading-normal text-taupe">
        {project.caption} {project.location}.
      </p>

      {variant === 'feed' ? (
        <Link
          href={feedEntryHref(project.slug)}
          className="mt-auto inline-flex min-h-control-sm items-end gap-1.5 pt-3 text-body-sm font-semibold text-pink-700"
        >
          <span>See this project</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </Card>
  )
}
