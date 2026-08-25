import { expect, test, type Page } from '@playwright/test'

/**
 * The contact form.
 *
 * The no-JavaScript path is the one worth proving rather than claiming: the
 * `<form action>` *is* the Server Action, so a browser that never runs React
 * still posts and gets a rendered response. That only stays true by accident
 * unless something checks it, so a whole project below runs with JavaScript off.
 */

const CONTACT = '/contact'

async function fill(page: Page, values: Record<string, string>): Promise<void> {
  for (const [label, value] of Object.entries(values)) {
    await page.getByLabel(new RegExp(`^${label}`, 'i')).fill(value)
  }
}

test.describe('contact form', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'laptop-1440', 'Behaviour is viewport-independent')
  })

  test('labels every field and binds them to their inputs', async ({ page }) => {
    await page.goto(CONTACT)

    for (const label of ['Name', 'Email', 'Phone', 'Tell me about your space']) {
      const field = page.getByLabel(new RegExp(`^${label}`, 'i'))
      await expect(field).toBeVisible()
      // Bound by for/id, not by placeholder or proximity.
      await expect(field).toHaveAttribute('id', /.+/)
    }
  })

  test('marks the required field as required in its label, not by colour', async ({ page }) => {
    await page.goto(CONTACT)
    const nameLabel = page.locator('label', { hasText: 'Name' }).first()
    await expect(nameLabel).toContainText('required')
  })

  test('keeps inputs at least 52px tall', async ({ page }) => {
    await page.goto(CONTACT)

    for (const label of ['Name', 'Email', 'Phone']) {
      const box = await page.getByLabel(new RegExp(`^${label}`, 'i')).boundingBox()
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(52)
    }
  })

  test('hides the honeypot from people and from assistive technology', async ({ page }) => {
    await page.goto(CONTACT)

    const honeypot = page.locator('input[name="website"]')
    await expect(honeypot).toHaveCount(1)
    await expect(honeypot).not.toBeInViewport()
    // Inside an aria-hidden container and out of the tab order.
    await expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(await honeypot.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true)
  })

  test('reports a missing reply route as text, not as a colour', async ({ page }) => {
    await page.goto(CONTACT)

    await fill(page, { Name: 'Margaret K.' })
    await page.getByRole('button', { name: /send my request/i }).click()

    // Scoped to the form: Next's route announcer also carries role="alert".
    const alert = page.locator('form').getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText(/email address or a phone number/i)
  })

  test('keeps what was typed when it comes back with an error', async ({ page }) => {
    await page.goto(CONTACT)

    await fill(page, { Name: 'Margaret K.', 'Tell me about your space': 'Shady back border.' })
    await page.getByRole('button', { name: /send my request/i }).click()

    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByLabel(/^Name/i)).toHaveValue('Margaret K.')
    await expect(page.getByLabel(/^Tell me about your space/i)).toHaveValue('Shady back border.')
  })

  test('confirms a successful submission in words', async ({ page }) => {
    await page.goto(CONTACT)

    await fill(page, { Name: 'Margaret K.', Email: 'margaret@example.com' })
    await page.getByRole('button', { name: /send my request/i }).click()

    await expect(page.getByRole('status')).toContainText(/that.s sent/i)
  })

  test('offers the phone number and email beside the form', async ({ page }) => {
    await page.goto(CONTACT)

    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible()
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible()
  })
})

test.describe('contact form without JavaScript', () => {
  // The whole point: React never boots, so the plain form post is all there is.
  test.use({ javaScriptEnabled: false })

  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'laptop-1440', 'Behaviour is viewport-independent')
  })

  test('renders the form server-side', async ({ page }) => {
    await page.goto(CONTACT)

    await expect(page.getByLabel(/^Name/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send my request/i })).toBeVisible()
    // A real form post, not a click handler. React renders `action=""` — submit
    // to the current URL — plus the hidden field naming the Server Action, which
    // is exactly what a browser with no JavaScript needs to reach the server.
    const form = page.locator('form')
    await expect(form).toHaveAttribute('method', /post/i)
    await expect(form.locator('input[type="hidden"][name^="$ACTION"]')).not.toHaveCount(0)
  })

  test('submits and returns a rendered success state', async ({ page }) => {
    await page.goto(CONTACT)

    await page.getByLabel(/^Name/i).fill('Margaret K.')
    await page.getByLabel(/^Email/i).fill('margaret@example.com')
    await page.getByRole('button', { name: /send my request/i }).click()

    await expect(page.getByRole('status')).toContainText(/that.s sent/i, { timeout: 15_000 })
  })

  test('returns validation errors as rendered text', async ({ page }) => {
    await page.goto(CONTACT)

    await page.getByLabel(/^Name/i).fill('Margaret K.')
    await page.getByRole('button', { name: /send my request/i }).click()

    await expect(page.getByRole('alert')).toContainText(/email address or a phone number/i, {
      timeout: 15_000,
    })
  })
})
