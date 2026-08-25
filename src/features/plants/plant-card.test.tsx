import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { PlantEntry } from '@/lib/contentful/queries'
import { seedPlants } from '@/lib/contentful/seed'

import { PlantCard } from './plant-card'
import { PlantGrid } from './plant-grid'

/**
 * The plant card's job is to survive its own content: a common name that wraps
 * to two lines, and a Latin name long enough to be its own paragraph. The grid's
 * job is to look right at any entry count from two upward.
 */

const LONGEST: PlantEntry = (() => {
  const plant = seedPlants.find((entry) => entry.commonName.startsWith('Black-Eyed Susan'))
  if (plant === undefined) throw new Error('Seed content is missing the longest-name plant')
  return plant
})()

describe('PlantCard', () => {
  it('renders the common name as a heading and the Latin name beneath it', () => {
    render(
      <ul>
        <PlantCard plant={LONGEST} />
      </ul>,
    )

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(LONGEST.commonName)
    expect(screen.getByText(LONGEST.latinName)).toBeInTheDocument()
  })

  it('handles the longest realistic name pair without truncating either', () => {
    render(
      <ul>
        <PlantCard plant={LONGEST} />
      </ul>,
    )

    const heading = screen.getByRole('heading', { level: 3 })
    const latin = screen.getByText(LONGEST.latinName)

    // No line-clamp, no truncate: the card grows instead of hiding the name.
    for (const element of [heading, latin]) {
      expect(element.className).not.toMatch(/truncate|line-clamp/)
    }
  })

  it('renders both tags, pinned to the bottom so rows align', () => {
    const { container } = render(
      <ul>
        <PlantCard plant={LONGEST} />
      </ul>,
    )

    const tags = screen.getAllByRole('listitem')
    expect(within(tags[0] ?? container).getByText(LONGEST.lightTag)).toBeInTheDocument()
    expect(screen.getByText(LONGEST.waterTag)).toBeInTheDocument()

    const tagList = container.querySelector('ul ul')
    expect(tagList?.className).toContain('mt-auto')
  })

  it('shows the placeholder slot while no photograph exists', () => {
    render(
      <ul>
        <PlantCard plant={LONGEST} />
      </ul>,
    )

    expect(screen.getByText('Plant card · 1:1')).toBeInTheDocument()
  })
})

describe('PlantGrid', () => {
  it.each([2, 3, 4, 6, 8])('renders %i entries without gaps in the flow', (count) => {
    render(<PlantGrid plants={seedPlants.slice(0, count)} />)

    // One list item per plant plus two tag items each.
    const cards = screen.getAllByRole('heading', { level: 3 })
    expect(cards).toHaveLength(count)
  })

  it('uses an auto-fit track rather than a fixed column count', () => {
    const { container } = render(<PlantGrid plants={seedPlants.slice(0, 2)} />)
    const grid = container.querySelector('ul')

    // A fixed four-column track would strand two entries in a row of gaps.
    expect(grid?.className).toContain('auto-fit')
  })
})
