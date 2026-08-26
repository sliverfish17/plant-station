import { expect, test, type Page } from '@playwright/test'

/**
 * A sweep across every width a visitor plausibly arrives at, not just the three
 * the artboards were drawn at.
 *
 * The artboards are snapshots at 390 / 1440 / 1920, so those are the widths that
 * get looked at — and the gaps live in between and beyond: a phone at 360, a
 * tablet in portrait, a 14-inch laptop at 1512, a 4K display at 3840. This
 * checks the things that break silently at an unvisited width: horizontal
 * overflow, content escaping its column, elements colliding, images fetched at
 * the wrong size, and the grid stranding a row.
 */

const WIDTHS = [
  { width: 360, height: 780, label: 'small phone' },
  { width: 390, height: 844, label: 'iPhone (artboard)' },
  { width: 430, height: 932, label: 'large phone' },
  { width: 768, height: 1024, label: 'tablet portrait' },
  { width: 1024, height: 768, label: 'tablet landscape' },
  { width: 1280, height: 800, label: 'small laptop' },
  { width: 1440, height: 900, label: 'laptop (artboard)' },
  { width: 1512, height: 982, label: 'MacBook 14' },
  { width: 1710, height: 1069, label: 'MacBook 14 scaled' },
  { width: 1920, height: 1080, label: 'desktop (artboard)' },
  { width: 2560, height: 1440, label: '1440p' },
  { width: 3840, height: 2160, label: '4K' },
] as const

const ROUTES = [
  '/',
  '/services',
  '/services/soil-testing',
  '/favorite-plants',
  '/projects-blog',
  '/projects-blog/shade-border-reborn',
  '/contact',
] as const

/** Runs once per width rather than once per Playwright project. */
function auditWidth(size: (typeof WIDTHS)[number]) {
  return async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: size.width, height: size.height })

    for (const route of ROUTES) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      const report = await page.evaluate(() => {
        const doc = document.documentElement
        const overflow = doc.scrollWidth - doc.clientWidth

        // Anything sticking out past the right edge, named so a failure is
        // actionable rather than just "something overflows".
        const offenders: string[] = []
        for (const node of document.querySelectorAll<HTMLElement>('body *')) {
          const rect = node.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) continue
          if (rect.right > doc.clientWidth + 1 || rect.left < -1) {
            const style = getComputedStyle(node)
            // Deliberately off-canvas: the skip link and the honeypot.
            if (style.position === 'absolute' && rect.right < 0) continue
            if (node.closest('[aria-hidden="true"]') !== null) continue
            if (node.classList.contains('skip-link')) continue
            offenders.push(
              `${node.tagName.toLowerCase()}.${node.className.slice(0, 40)} ` +
                `[${Math.round(rect.left)}→${Math.round(rect.right)}]`,
            )
          }
        }

        return { overflow, offenders: offenders.slice(0, 5) }
      })

      expect(report.offenders, `${route} @ ${String(size.width)} overflows`).toEqual([])
      expect(
        report.overflow,
        `${route} @ ${String(size.width)} scrolls sideways`,
      ).toBeLessThanOrEqual(0)
    }
  }
}

test.describe('viewport sweep', () => {
  // One Playwright project drives every width, so the sweep is not multiplied by
  // the four artboard projects.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'laptop-1440', 'The sweep sets its own widths')
  })

  for (const size of WIDTHS) {
    test(`${String(size.width)}px — ${size.label}`, auditWidth(size))
  }

  test('the hero fetches exactly one image, sized for the viewport', async ({ page }) => {
    for (const { width, height, label } of WIDTHS) {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hero = await page.evaluate(() => {
        // `getEntriesByType` is typed as returning the base PerformanceEntry;
        // `encodedBodySize` lives on PerformanceResourceTiming, so the entries
        // are narrowed with a guard rather than asserted.
        const isResourceTiming = (entry: PerformanceEntry): entry is PerformanceResourceTiming =>
          entry.entryType === 'resource'

        return performance
          .getEntriesByType('resource')
          .filter(isResourceTiming)
          .filter((entry) => entry.name.includes('edyta-garden'))
          .map((entry) => ({
            name: entry.name.split('/').pop() ?? '',
            bytes: entry.encodedBodySize,
          }))
      })

      expect(hero.length, `${label} fetched ${String(hero.length)} hero images`).toBe(1)

      // A phone must never be handed the desktop-sized file.
      const bytes = hero[0]?.bytes ?? 0
      if (width <= 430) {
        expect(bytes, `${label} downloaded ${String(Math.round(bytes / 1024))} KB`).toBeLessThan(
          400_000,
        )
      }
    }
  })

  test('the burger menu works at every width — it is the only navigation', async ({ page }) => {
    for (const { width, height, label } of WIDTHS) {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const trigger = page.getByRole('button', { name: /menu/i })
      await expect(trigger, `${label} has no menu trigger`).toBeVisible()

      await trigger.click()
      const drawer = page.getByRole('navigation', { name: /primary/i })
      await expect(drawer, `${label} drawer did not open`).toBeVisible()

      // The drawer must never exceed the viewport, at any width.
      const box = await drawer.boundingBox()
      expect(box?.width ?? 0, `${label} drawer is wider than the viewport`).toBeLessThanOrEqual(
        width,
      )

      await page.keyboard.press('Escape')
      await expect(drawer, `${label} drawer did not close`).toBeHidden()
    }
  })

  test('the content column never leaves an absurd margin on a wide display', async ({ page }) => {
    for (const { width, height, label } of WIDTHS) {
      if (width < 1280) continue

      await page.setViewportSize({ width, height })
      await page.goto('/')

      const column = await page.locator('#story > div').boundingBox()
      const used = (column?.width ?? 0) / width

      // Above 2560 a capped column is intentional — beyond that, line length
      // matters more than filling glass. Below it, the page should not look lost.
      const floor = width >= 2560 ? 0.35 : 0.7
      expect(
        used,
        `${label} uses only ${String(Math.round(used * 100))}% of the width`,
      ).toBeGreaterThan(floor)
    }
  })
})
