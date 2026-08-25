import Link from 'next/link'

import { Section } from '@/components/ui/section'
import { ROUTES } from '@/config/navigation'
import { ProjectCard } from '@/features/feed/project-card'
import type { ProjectEntry } from '@/lib/contentful/queries'

/**
 * Recent projects. Three across at the large breakpoint, but an auto-fit track
 * rather than a fixed `1fr 1fr 1fr`: with two entries the design should show two
 * columns, not three with a hole in it.
 */
export function RecentProjects({ projects }: { readonly projects: readonly ProjectEntry[] }) {
  if (projects.length === 0) return null

  return (
    <Section aria-labelledby="projects-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="projects-heading" className="text-h2 leading-heading">
            Recent projects
          </h2>
          <p className="mt-2 text-lead leading-normal">
            A few before-and-afters from around Metro Detroit.
          </p>
        </div>
        <Link
          href={ROUTES.feed}
          className="inline-flex min-h-control-sm items-center text-lead font-semibold whitespace-nowrap text-pink-700"
        >
          See all projects &amp; blog <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className="mt-8 grid list-none grid-cols-1 items-stretch gap-6 p-0 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:mt-10">
        {projects.map((project) => (
          <ProjectCard key={project.sys.id} project={project} variant="gallery" />
        ))}
      </ul>
    </Section>
  )
}
