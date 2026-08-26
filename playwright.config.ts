import { defineConfig, devices } from '@playwright/test'

/**
 * Overridable so a test run never collides with a dev server someone has open.
 * Reusing port 3000 means Playwright silently tests whatever is already there —
 * including a dev server whose `.next` a concurrent build has invalidated, which
 * looks like React failing to hydrate rather than like the wrong target.
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000)
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // The three artboard widths, plus the 360px floor the brief calls out.
    {
      name: 'mobile-390',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'narrow-360',
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 780 } },
    },
    {
      name: 'laptop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'desktop-1920',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
  ],
  webServer: {
    // `next start` only — never `next build`. Playwright starting a build while
    // one is already running has both processes writing the same .next, and
    // Next renames rather than deletes what it cannot remove, so the directory
    // fills with "app 2", "chunks 3" duplicates until it is unusable.
    // Run `npm run build` yourself first (CI does, as its own step).
    command: `npm run start -- --port ${String(PORT)}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
