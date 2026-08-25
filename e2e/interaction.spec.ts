import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * The two stateful surfaces, exercised the way a keyboard user meets them.
 *
 * The hooks underneath are unit-tested; what these add is the part unit tests
 * cannot see — that the wiring reaches the DOM, at every artboard width, with
 * the drawer's focus trap holding against a real browser's focus model.
 */

test.describe('burger menu', () => {
  test('opens at every breakpoint — it is the only navigation', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByRole('button', { name: /menu/i })
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()
  })

  test('closes on Escape and returns focus to the trigger', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByRole('button', { name: /menu/i })
    await trigger.click()
    await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: /primary/i })).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('closes with the Close button and returns focus to the trigger', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByRole('button', { name: /menu/i })
    await trigger.click()
    await page.getByRole('button', { name: /close/i }).click()

    await expect(page.getByRole('navigation', { name: /primary/i })).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('traps Tab inside the drawer', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /menu/i }).click()

    const drawer = page.getByRole('navigation', { name: /primary/i })

    // Tab all the way round and back; focus must never leave the drawer.
    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press('Tab')
      const inside = await drawer.evaluate((panel) => panel.contains(document.activeElement))
      expect(inside, `focus escaped the drawer after ${step + 1} tabs`).toBe(true)
    }
  })

  test('carries the phone and email, one of their five required places', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /menu/i }).click()

    const drawer = page.getByRole('navigation', { name: /primary/i })
    await expect(drawer.locator('a[href^="tel:"]')).toHaveCount(1)
    await expect(drawer.locator('a[href^="mailto:"]')).toHaveCount(1)
  })

  test('reports no axe violations while open', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /menu/i }).click()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('testimonial slider', () => {
  test('starts clamped at the beginning', async ({ page }) => {
    await page.goto('/')

    const previous = page.getByRole('button', { name: /previous quote/i })
    await expect(previous).toBeDisabled()
    await expect(page.getByRole('button', { name: /next quote/i })).toBeEnabled()
  })

  test('labels its position, and the label matches how many cards are shown', async ({
    page,
  }, testInfo) => {
    await page.goto('/')

    const counter = page.locator('[aria-live="polite"]', { hasText: /of 5/ })
    const width = testInfo.project.use.viewport?.width ?? 0

    // One card below the large breakpoint, three above — per the design.
    await expect(counter).toHaveText(width >= 1024 ? '1–3 of 5' : '1 of 5')
  })

  test('steps one card at a time and clamps at the end', async ({ page }, testInfo) => {
    await page.goto('/')

    const next = page.getByRole('button', { name: /next quote/i })
    const counter = page.locator('[aria-live="polite"]', { hasText: /of 5/ })

    await next.click()
    const width = testInfo.project.use.viewport?.width ?? 0
    await expect(counter).toHaveText(width >= 1024 ? '2–4 of 5' : '2 of 5')

    // Past the end: the arrow must disable rather than wrap.
    for (let step = 0; step < 6; step += 1) {
      if (await next.isEnabled()) await next.click()
    }
    await expect(next).toBeDisabled()
    await expect(counter).toHaveText(width >= 1024 ? '3–5 of 5' : '5 of 5')
  })

  test('never autoplays', async ({ page }, testInfo) => {
    await page.goto('/')

    const counter = page.locator('[aria-live="polite"]', { hasText: /of 5/ })
    const width = testInfo.project.use.viewport?.width ?? 0
    const settled = width >= 1024 ? '1–3 of 5' : '1 of 5'

    // Wait for the hydrated value before sampling. The server renders the
    // mobile snapshot ("1 of 5") and `usePerView` resolves to three on desktop
    // during hydration, so reading immediately captures the pre-hydration text
    // and any later comparison looks like movement that never happened.
    await expect(counter).toHaveText(settled)

    await page.waitForTimeout(2500)
    await expect(counter).toHaveText(settled)
  })

  test('keeps off-screen quotes out of the tab order', async ({ page }) => {
    await page.goto('/')

    const inert = page.locator('li[inert] blockquote')
    // With five quotes and at most three in view, something is always inert.
    expect(await inert.count()).toBeGreaterThan(0)
  })
})

test.describe('reduced motion', () => {
  // `page.emulateMedia` rather than `test.use({ reducedMotion })`: the project's
  // own `use` block wins over a file-level one, so the emulation silently never
  // applied and the test passed against a page that was still animating.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('actually applies the emulation', async ({ page }) => {
    await page.goto('/')
    const matches = await page.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    expect(matches, 'reduced-motion emulation is not reaching the page').toBe(true)
  })

  test('disables transitions', async ({ page }) => {
    await page.goto('/')

    const durations = await page.evaluate(() =>
      [...document.querySelectorAll('a, button, li')]
        .slice(0, 60)
        .map((node) => getComputedStyle(node).transitionDuration),
    )

    // The global rule collapses every transition to 0.01ms.
    for (const duration of durations) {
      expect(Number.parseFloat(duration)).toBeLessThan(0.001)
    }
  })

  test('still opens and closes the drawer', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /menu/i }).click()
    await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: /primary/i })).toBeHidden()
  })
})
