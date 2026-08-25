import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Baseline guarantees that must hold on every route at every artboard width.
 *
 * The full suite arrives in Phase 6 — these exist so the accessibility and
 * landmark floor is enforced from the first page onwards rather than audited at
 * the end, when violations are expensive to unpick.
 */

test.describe('every page', () => {
  test('renders exactly one h1', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('exposes a main landmark that the skip link targets', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main#main')).toBeVisible()

    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toHaveAttribute('href', '#main')
  })

  test('reveals the skip link on keyboard focus only', async ({ page }) => {
    await page.goto('/')
    const skipLink = page.getByRole('link', { name: /skip to main content/i })

    // Off-canvas until focused: translated out of view, never display:none,
    // so it stays in the accessibility tree and in the tab order.
    const hiddenOffset = await skipLink.evaluate(
      (element) => element.getBoundingClientRect().bottom,
    )
    expect(hiddenOffset).toBeLessThanOrEqual(0)

    await page.keyboard.press('Tab')
    await expect(skipLink).toBeFocused()

    const focusedOffset = await skipLink.evaluate((element) => element.getBoundingClientRect().top)
    expect(focusedOffset).toBeGreaterThanOrEqual(0)
  })

  test('never scrolls horizontally', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('reports no axe violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('the revalidation webhook', () => {
  test('refuses an unauthenticated request', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      data: { sys: { id: 'plant-black-eyed-susan', type: 'Entry' } },
      failOnStatusCode: false,
    })

    // 401 when a secret is configured, 503 when it is not — never 200, which
    // would mean an unauthenticated caller could flush the cache.
    expect([401, 503]).toContain(response.status())
  })
})
