import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { seedBlogPosts, seedProjects } from '@/lib/contentful/seed'
import type { ProjectEntry } from '@/lib/contentful/queries'

import { FeedCard } from './feed-card'
import { ProjectCard } from './project-card'

/**
 * The card cases the acceptance list names: a project with a before image, a
 * project without one, and the dispatcher choosing correctly between the two
 * entry types that share the grid.
 */

function projectWithBefore(): ProjectEntry {
  const project = seedProjects.find((entry) => entry.beforeImage !== null)
  if (project === undefined) throw new Error('Seed content has no project with a before image')
  return project
}

function projectWithoutBefore(): ProjectEntry {
  const project = seedProjects.find((entry) => entry.beforeImage === null)
  if (project === undefined) throw new Error('Seed content has no after-only project')
  return project
}

describe('ProjectCard', () => {
  it('renders both tiles when a before image exists', () => {
    render(
      <ul>
        <ProjectCard project={projectWithBefore()} />
      </ul>,
    )

    expect(screen.getByText(/^Before ·/)).toBeInTheDocument()
    expect(screen.getByText(/^After ·/)).toBeInTheDocument()
  })

  it('renders a single full-width tile when the before image is absent', () => {
    render(
      <ul>
        <ProjectCard project={projectWithoutBefore()} />
      </ul>,
    )

    expect(screen.queryByText(/^Before ·/)).not.toBeInTheDocument()
    expect(screen.getByText(/^After only ·/)).toBeInTheDocument()
  })

  it('reserves the same media height either way, so cards in a row align', () => {
    const withBefore = render(
      <ul>
        <ProjectCard project={projectWithBefore()} />
      </ul>,
    )
    const pairGrid = withBefore.container.querySelector('.grid-cols-2')
    expect(pairGrid).not.toBeNull()

    withBefore.unmount()

    const withoutBefore = render(
      <ul>
        <ProjectCard project={projectWithoutBefore()} />
      </ul>,
    )
    const singleGrid = withoutBefore.container.querySelector('.grid-cols-2')

    // Same two-column grid; the after-only case keeps a 3:2 sizer in column one
    // so the row height matches a pair rather than the single image's own ratio.
    expect(singleGrid).not.toBeNull()
    expect(singleGrid?.querySelector('[aria-hidden="true"].aspect-\\[3\\/2\\]')).not.toBeNull()
  })

  it('composes the caption with the location, as the design shows it', () => {
    const project = projectWithoutBefore()
    render(
      <ul>
        <ProjectCard project={project} />
      </ul>,
    )

    expect(screen.getByText(`${project.caption} ${project.location}.`)).toBeInTheDocument()
  })

  it('omits the eyebrow and link in the home gallery variant', () => {
    render(
      <ul>
        <ProjectCard project={projectWithBefore()} variant="gallery" />
      </ul>,
    )

    expect(screen.queryByText('Project')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})

describe('FeedCard', () => {
  it('renders a project entry as a project card', () => {
    const project = projectWithBefore()
    render(
      <ul>
        <FeedCard entry={project} />
      </ul>,
    )

    const item = screen.getByRole('listitem')
    expect(within(item).getByText('Project')).toBeInTheDocument()
    expect(within(item).getByRole('heading', { level: 3 })).toHaveTextContent(project.title)
    expect(within(item).getByRole('link')).toHaveAttribute('href', `/projects-blog/${project.slug}`)
  })

  it('renders a blog entry as a blog card', () => {
    const post = seedBlogPosts[0]
    if (post === undefined) throw new Error('Seed content has no blog posts')

    render(
      <ul>
        <FeedCard entry={post} />
      </ul>,
    )

    const item = screen.getByRole('listitem')
    expect(within(item).getByText(/^Blog ·/)).toBeInTheDocument()
    expect(within(item).getByRole('heading', { level: 3 })).toHaveTextContent(post.title)
    expect(within(item).getByRole('link')).toHaveAttribute('href', `/projects-blog/${post.slug}`)
  })

  it('marks up the post date as a machine-readable time', () => {
    const post = seedBlogPosts[0]
    if (post === undefined) throw new Error('Seed content has no blog posts')

    const { container } = render(
      <ul>
        <FeedCard entry={post} />
      </ul>,
    )

    expect(container.querySelector('time')).toHaveAttribute('datetime', post.date)
  })
})
