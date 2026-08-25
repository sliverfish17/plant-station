import { expect, test, type Locator } from '@playwright/test'

/**
 * Pixel fidelity against the artboards.
 *
 * "Matches the design at 390 / 1440 / 1920" is otherwise checked by eye, which
 * catches a heading that is obviously wrong and misses one that is 4px out. The
 * fluid scale is unit-tested at the token level; this asserts that the tokens
 * actually reach the elements the artboards measure.
 */

type Anchors = { readonly 390: number; readonly 1440: number; readonly 1920: number }

const HERO_H1: Anchors = { 390: 38, 1440: 62, 1920: 68 }
const SECTION_H2: Anchors = { 390: 30, 1440: 42, 1920: 46 }
const BODY: Anchors = { 390: 18, 1440: 19, 1920: 20 }
const SECTION_PADDING: Anchors = { 390: 56, 1440: 96, 1920: 104 }

function expectedFor(anchors: Anchors, width: number): number | null {
  if (width === 390) return anchors[390]
  if (width === 1440) return anchors[1440]
  if (width === 1920) return anchors[1920]
  return null
}

async function pixelValue(locator: Locator, property: string): Promise<number> {
  const raw = await locator.evaluate(
    (element, prop) => getComputedStyle(element).getPropertyValue(prop),
    property,
  )
  return Number.parseFloat(raw)
}

test.describe('artboard fidelity', () => {
  test('type and spacing land on the artboard values', async ({ page }, testInfo) => {
    const width = testInfo.project.use.viewport?.width
    const expectedH1 = width === undefined ? null : expectedFor(HERO_H1, width)

    test.skip(expectedH1 === null, 'Only the three artboard widths have measured anchors')

    await page.goto('/')

    const h1 = page.locator('h1')
    expect(await pixelValue(h1, 'font-size')).toBeCloseTo(expectedH1 ?? 0, 0)

    const sectionHeading = page.locator('#story-heading:visible')
    const expectedH2 = expectedFor(SECTION_H2, width ?? 0)
    expect(await pixelValue(sectionHeading, 'font-size')).toBeCloseTo(expectedH2 ?? 0, 0)

    const bodyParagraph = page.locator('#story p').first()
    const expectedBody = expectedFor(BODY, width ?? 0)
    expect(await pixelValue(bodyParagraph, 'font-size')).toBeCloseTo(expectedBody ?? 0, 0)

    const section = page.locator('#story')
    const expectedPadding = expectedFor(SECTION_PADDING, width ?? 0)
    expect(await pixelValue(section, 'padding-top')).toBeCloseTo(expectedPadding ?? 0, 0)
  })

  test('the content column caps where the artboards cap it', async ({ page }, testInfo) => {
    const width = testInfo.project.use.viewport?.width
    test.skip(width !== 1440 && width !== 1920, 'Content cap is only specified at 1440 and 1920')

    await page.goto('/')

    const column = page.locator('#story > div')
    const box = await column.boundingBox()
    expect(box?.width).toBeCloseTo(width === 1920 ? 1280 : 1140, 0)
  })

  test('body copy stays within a readable measure', async ({ page }) => {
    await page.goto('/')

    const paragraph = page.locator('#story p').first()
    const [box, fontSize] = await Promise.all([
      paragraph.boundingBox(),
      pixelValue(paragraph, 'font-size'),
    ])

    // ~68ch at the rendered size. A generous upper bound: the point is to catch
    // a paragraph that has escaped its measure entirely, not to police one word.
    expect(box?.width ?? 0).toBeLessThanOrEqual(fontSize * 0.55 * 72)
  })

  test('every interactive control clears the 48px tap-target floor', async ({ page }) => {
    await page.goto('/')

    const controls = page.locator(
      'a[href]:visible, button:visible, input:visible, textarea:visible',
    )
    const count = await controls.count()
    expect(count).toBeGreaterThan(0)

    const undersized: string[] = []

    for (let index = 0; index < count; index += 1) {
      const control = controls.nth(index)
      const [box, text] = await Promise.all([control.boundingBox(), control.innerText()])
      if (box === null) continue

      const exempt = await control.evaluate((element) => {
        // Inline links inside a paragraph inherit the line box; padding them to
        // 48px would wreck the paragraph they sit in.
        if (element.closest('p') !== null && getComputedStyle(element).display === 'inline') {
          return true
        }
        // The honeypot is deliberately unreachable — it is bot bait, not a target.
        return element.closest('[aria-hidden="true"]') !== null
      })
      if (exempt) continue

      if (box.height < 48) {
        const where = await control.evaluate((element) => {
          const tag = element.tagName.toLowerCase()
          const section = element.closest('[id]')?.id ?? element.closest('footer,header')?.tagName
          return `${tag} in ${String(section)}`
        })
        undersized.push(
          `${text.trim().slice(0, 40) || '(no text)'} [${where}] — ${Math.round(box.height)}px`,
        )
      }
    }

    expect(undersized).toEqual([])
  })

  test('the service bubble is a circle on desktop and a pill on mobile', async ({
    page,
  }, testInfo) => {
    const width = testInfo.project.use.viewport?.width ?? 0
    await page.goto('/')

    const bubbles = page.locator('#services li a:visible')
    const first = bubbles.first()
    const box = await first.boundingBox()

    if (width >= 1024) {
      // A circle: square, and 250px at 1440 rising to 270px at 1920.
      expect(box?.width).toBeCloseTo(box?.height ?? 0, 0)
      expect(box?.width).toBeCloseTo(width >= 1920 ? 270 : 250, 0)
    } else {
      // A pill row: much wider than tall, never a shrunken circle.
      expect(box?.width ?? 0).toBeGreaterThan((box?.height ?? 0) * 2)
    }
  })
})
