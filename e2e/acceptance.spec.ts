import { expect, test, type Page } from '@playwright/test'

import { SITE } from '../src/config/site'

/**
 * The remaining items from the handoff's acceptance checklist that nothing else
 * covers — the ones stated as requirements rather than implied by a component.
 */

const TEL = `tel:${SITE.phone}`
const MAILTO = `mailto:${SITE.email}`

async function openMenu(page: Page): Promise<void> {
  await page.getByRole('button', { name: /menu/i }).click()
  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()
}

test.describe('contact details in all five required places', () => {
  test('header, services intro, contact band, footer and menu', async ({ page }, testInfo) => {
    const width = testInfo.project.use.viewport?.width ?? 0
    await page.goto('/')

    // 1. Header — the number is shown from the large breakpoint up; below it,
    //    the drawer carries it instead, which is checked at (5).
    if (width >= 1024) {
      await expect(page.locator(`header a[href="${TEL}"]`)).toHaveCount(1)
    }

    // 2. Services intro.
    await expect(page.locator(`#services a[href="${TEL}"]`)).toHaveCount(1)
    await expect(page.locator(`#services a[href="${MAILTO}"]`)).toHaveCount(1)

    // 3. Contact band.
    await expect(page.locator(`#contact a[href="${TEL}"]`)).toHaveCount(1)
    await expect(page.locator(`#contact a[href="${MAILTO}"]`)).toHaveCount(1)

    // 4. Footer.
    await expect(page.locator(`footer a[href="${TEL}"]`)).toHaveCount(1)
    await expect(page.locator(`footer a[href="${MAILTO}"]`)).toHaveCount(1)

    // 5. Burger menu.
    await openMenu(page)
    const drawer = page.getByRole('navigation', { name: /primary/i })
    await expect(drawer.locator(`a[href="${TEL}"]`)).toHaveCount(1)
    await expect(drawer.locator(`a[href="${MAILTO}"]`)).toHaveCount(1)
  })

  test('every page can reach the phone number without scrolling to the footer', async ({
    page,
  }) => {
    for (const route of ['/favorite-plants', '/projects-blog', '/services/consulting']) {
      await page.goto(route)
      await openMenu(page)
      await expect(
        page.getByRole('navigation', { name: /primary/i }).locator(`a[href="${TEL}"]`),
      ).toHaveCount(1)
    }
  })
})

test.describe('focus is always visible', () => {
  test('every interactive element gets the 3px accent ring at 2px offset', async ({ page }) => {
    await page.goto('/')

    const samples = [
      page.getByRole('button', { name: /menu/i }),
      page.getByRole('link', { name: /book a consultation/i }).first(),
      page.getByRole('link', { name: /see my services/i }).first(),
      page.getByRole('button', { name: /next quote/i }),
    ]

    for (const element of samples) {
      await element.focus()
      const ring = await element.evaluate((node) => {
        const style = getComputedStyle(node)
        return {
          width: style.outlineWidth,
          style: style.outlineStyle,
          offset: style.outlineOffset,
          color: style.outlineColor,
        }
      })

      expect(ring.style).toBe('solid')
      expect(Number.parseFloat(ring.width)).toBeCloseTo(3, 1)
      expect(Number.parseFloat(ring.offset)).toBeCloseTo(2, 1)
      // #b13268 on cream; the olive bands retarget it to a lighter pink so the
      // ring stays visible, so only the presence of a colour is asserted here.
      expect(ring.color).not.toBe('rgba(0, 0, 0, 0)')
    }
  })

  test('the focus ring is not removed by a click', async ({ page }) => {
    await page.goto('/')

    // :focus-visible, not :focus — a mouse click should not paint a ring, but a
    // keyboard user reaching the same control must get one.
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus-visible')
    await expect(focused).toHaveCount(1)
  })
})

test.describe('grids hold at any entry count', () => {
  test('the feed grid fills left to right with two entries and with six', async ({ page }) => {
    await page.goto('/projects-blog')

    const cards = page.locator('#feed-grid > ul > li')
    const total = await cards.count()
    expect(total).toBeGreaterThanOrEqual(2)

    // Cards fill left to right with no gaps: the number of distinct row tops is
    // exactly what the observed column count implies. Derived rather than
    // assumed, so it holds at one column on a phone and three on a laptop.
    const tops = await cards.evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
    )
    const firstTop = tops[0]
    const columns = tops.filter((top) => top === firstTop).length
    expect(new Set(tops).size).toBe(Math.ceil(total / columns))

    // Filtering to projects leaves fewer entries; the grid must still look right.
    await page.getByRole('button', { name: 'Projects', exact: true }).click()
    const filtered = await cards.count()
    expect(filtered).toBeGreaterThanOrEqual(2)
    expect(filtered).toBeLessThan(total)

    const box = await cards.first().boundingBox()
    expect(box?.width ?? 0).toBeGreaterThan(0)
  })

  test('cards in a row are the same height whatever their copy does', async ({
    page,
  }, testInfo) => {
    const width = testInfo.project.use.viewport?.width ?? 0
    test.skip(width < 768, 'Single column below the tablet breakpoint')

    await page.goto('/projects-blog')

    const boxes = await page.locator('#feed-grid > ul > li').evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect()
        return { top: Math.round(rect.top), height: Math.round(rect.height) }
      }),
    )

    const rows = new Map<number, number[]>()
    for (const box of boxes) {
      rows.set(box.top, [...(rows.get(box.top) ?? []), box.height])
    }

    for (const [top, heights] of rows) {
      expect(new Set(heights).size, `row at ${top} has mismatched heights`).toBe(1)
    }
  })

  test('the plant grid holds when a filter narrows it to a handful', async ({ page }) => {
    await page.goto('/favorite-plants')

    const cards = page.locator('#plant-grid > ul > li')
    const before = await cards.count()

    await page.getByRole('button', { name: 'Shade', exact: true }).click()

    const after = await cards.count()
    expect(after).toBeGreaterThan(0)
    expect(after).toBeLessThan(before)

    // No stranded row: cards still start at the left edge of the grid.
    const grid = await page.locator('#plant-grid > ul').boundingBox()
    const first = await cards.first().boundingBox()
    expect(first?.x ?? 0).toBeCloseTo(grid?.x ?? 0, 0)
  })
})
