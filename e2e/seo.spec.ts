import { expect, test, type Page } from '@playwright/test'

/**
 * SEO is a first-class requirement here, not a polish pass — organic search is a
 * primary acquisition channel — so it is verified against the rendered HTML
 * rather than trusted to the metadata objects that produce it.
 *
 * These run once, at a single width: none of it varies by viewport.
 */

const ROUTES = [
  '/',
  '/services',
  '/services/consulting',
  '/favorite-plants',
  '/projects-blog',
  '/projects-blog/shade-border-reborn',
  '/projects-blog/what-to-plant-in-clay-soil',
  '/contact',
] as const

const MAX_DESCRIPTION = 155

type JsonLdGraph = { '@context': string; '@graph': { '@type': string | string[] }[] }

function isGraph(value: unknown): value is JsonLdGraph {
  return (
    typeof value === 'object' &&
    value !== null &&
    '@graph' in value &&
    Array.isArray(value['@graph'])
  )
}

async function readJsonLd(page: Page): Promise<JsonLdGraph[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()

  return blocks.map((block: string) => {
    const parsed: unknown = JSON.parse(block)
    if (!isGraph(parsed)) throw new Error('JSON-LD block has no @graph')
    return parsed
  })
}

/** None of this varies by viewport, so it runs at one width only. */
function onlyOnce(): void {
  // Playwright requires the first argument to be a destructuring pattern, even
  // when no fixture is used — hence the empty pattern (see eslint.config.mjs).
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'laptop-1440', 'Viewport-independent')
  })
}

function typesIn(graphs: JsonLdGraph[]): string[] {
  return graphs.flatMap((graph) =>
    graph['@graph'].flatMap((node) =>
      Array.isArray(node['@type']) ? node['@type'] : [node['@type']],
    ),
  )
}

test.describe('metadata', () => {
  onlyOnce()

  for (const route of ROUTES) {
    test(`${route} has a title, a capped description and a self-referencing canonical`, async ({
      page,
    }) => {
      await page.goto(route)

      const title = await page.title()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThanOrEqual(70)

      const description = await page.locator('meta[name="description"]').getAttribute('content')
      expect(description).not.toBeNull()
      expect((description ?? '').length).toBeLessThanOrEqual(MAX_DESCRIPTION)

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).not.toBeNull()
      expect(canonical ?? '').toMatch(/^https:\/\//)
      // The canonical must point at this page, not at the site root.
      const expectedPath = route === '/' ? '/' : route
      expect(new URL(canonical ?? '').pathname.replace(/\/$/, '')).toBe(
        expectedPath.replace(/\/$/, ''),
      )
    })

    test(`${route} points og:image at a card that actually exists`, async ({ page, request }) => {
      await page.goto(route)

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      expect(ogImage, 'every page needs a social card').not.toBeNull()

      // Fetch it: a hashed filename that 404s looks correct in the markup and
      // renders a blank card everywhere the link is shared.
      const url = new URL(ogImage ?? '')
      const response = await request.get(url.pathname + url.search)
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('image/')
    })
  }

  test('every page has exactly one h1 and no skipped heading levels', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route)

      const levels = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))))

      expect(
        levels.filter((level) => level === 1),
        `${route} h1 count`,
      ).toHaveLength(1)

      let previous = 1
      for (const level of levels) {
        expect(level - previous, `${route} skips a level before h${level}`).toBeLessThanOrEqual(1)
        previous = level
      }
    }
  })

  test('every page has the required landmarks', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route)
      await expect(page.locator('header')).toHaveCount(1)
      await expect(page.locator('main')).toHaveCount(1)
      await expect(page.locator('footer')).toHaveCount(1)
    }
  })
})

test.describe('structured data', () => {
  onlyOnce()

  test('the home page declares the business and the website', async ({ page }) => {
    await page.goto('/')
    const types = typesIn(await readJsonLd(page))

    expect(types).toContain('LocalBusiness')
    expect(types).toContain('ProfessionalService')
    expect(types).toContain('WebSite')
  })

  test('a service page declares a Service and a breadcrumb', async ({ page }) => {
    await page.goto('/services/soil-testing')
    const types = typesIn(await readJsonLd(page))

    expect(types).toContain('Service')
    expect(types).toContain('BreadcrumbList')
  })

  test('a blog post declares BlogPosting with an author and a date', async ({ page }) => {
    await page.goto('/projects-blog/what-to-plant-in-clay-soil')
    const graphs = await readJsonLd(page)
    const posting = graphs
      .flatMap((graph) => graph['@graph'])
      .find((node) => node['@type'] === 'BlogPosting')

    expect(posting).toBeDefined()
    expect(posting).toMatchObject({
      headline: expect.any(String),
      datePublished: expect.any(String),
      author: expect.objectContaining({ '@type': 'Person' }),
    })
  })

  test('emits no Review or AggregateRating until the testimonials are confirmed (D4)', async ({
    page,
  }) => {
    // Fabricated review markup is a site-wide manual-action risk, so this stays
    // absent until SITE.emitReviewSchema is deliberately turned on.
    for (const route of ['/', '/contact']) {
      await page.goto(route)
      const types = typesIn(await readJsonLd(page))
      expect(types).not.toContain('Review')
      expect(types).not.toContain('AggregateRating')
    }
  })

  test('never advertises a social profile it does not have (D2)', async ({ page }) => {
    await page.goto('/')
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(raw ?? '').not.toContain('sameAs')
  })
})

test.describe('crawlability', () => {
  onlyOnce()

  test('the sitemap lists every route, generated from the CMS', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)

    const xml = await response.text()
    for (const route of ROUTES) {
      expect(xml, `${route} missing from sitemap`).toContain(
        route === '/' ? '<loc>https://plant-station.com/</loc>' : `${route}</loc>`,
      )
    }

    // All six service pages, not just the index.
    for (const slug of [
      'consulting',
      'seasonal-planters',
      'soil-testing',
      'house-plants',
      'garden-design',
      'yard-maintenance',
    ]) {
      expect(xml, `${slug} missing from sitemap`).toContain(`/services/${slug}</loc>`)
    }
  })

  /**
   * robots.txt has two contracts and the right one depends on where the content
   * came from, so the test asks the same question the app does.
   *
   * A build running on seed content is a placeholder: invented testimonials
   * attributed to people who do not exist, a 555-01xx phone number, and a domain
   * that is not settled yet (D1). It stays out of the index entirely. A build
   * with Contentful credentials is the real site, where organic search is a
   * primary channel, so everything but the API routes is open.
   */
  const isIndexable =
    (Boolean(process.env.CONTENTFUL_SPACE_ID) && Boolean(process.env.CONTENTFUL_DELIVERY_TOKEN)) ||
    process.env.SITE_INDEXABLE === '1'

  test('robots.txt matches the content the site is actually serving', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)

    const text = await response.text()

    if (isIndexable) {
      expect(text).toContain('Allow: /')
      expect(text).toContain('Disallow: /api/')
      expect(text).toContain('Sitemap: https://plant-station.com/sitemap.xml')
      return
    }

    expect(text, 'placeholder content must be blocked outright').toContain('Disallow: /')
    // Nothing to advertise while the whole site is disallowed.
    expect(text).not.toContain('Sitemap:')
  })

  test('placeholder pages carry noindex, which is what keeps them out of results', async ({
    page,
  }) => {
    test.skip(isIndexable, 'the real site is meant to be indexed')

    // robots.txt only asks a crawler not to fetch; Google will still index a URL
    // it finds linked elsewhere. This is the directive that actually excludes it.
    await page.goto('/')
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })
})
