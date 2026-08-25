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
}: {
  readonly project: ProjectEntry
  readonly variant?: 'feed' | 'gallery' | undefined
}) {
  return (
    <Card as="li">
      <ProjectMedia project={project} />

      {variant === 'feed' ? <Eyebrow tone="pink">Project</Eyebrow> : null}

      <h3
        className={`font-serif text-card-title text-olive-700 ${variant === 'feed' ? 'mt-1.5' : 'mt-3'}`}
      >
        {project.title}
      </h3>

      <p className="mt-1.5 text-body-sm leading-normal text-taupe">
        {project.caption} {project.location}.
      </p>

      {variant === 'feed' ? (
        <Link
          href={feedEntryHref(project.slug)}
          className="mt-auto pt-3 text-body-sm font-semibold text-pink-700"
        >
          See this project <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </Card>
  )
}
