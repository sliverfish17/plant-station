import { describe, expect, it } from 'vitest'

import { SITE, mailtoHref, telHref } from './site'

/**
 * `SITE` is the only place a phone number, email or brand name may live, and
 * every one of those values is a parked decision (D1–D4). These tests guard the
 * invariants that stay true whatever the answers turn out to be — so that
 * swapping in the real contact details cannot silently produce a malformed
 * `tel:` link or a display number that disagrees with the dialable one.
 */

describe('SITE', () => {
  it('stores the phone number in E.164 form', () => {
    expect(SITE.phone).toMatch(/^\+1\d{10}$/)
  })

  it('keeps the display number and the dialable number in agreement', () => {
    const displayDigits = SITE.phoneDisplay.replace(/\D/g, '')
    expect(SITE.phone).toBe(`+1${displayDigits}`)
  })

  it('exposes a well-formed email address', () => {
    expect(SITE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('builds tel: and mailto: hrefs from the canonical values', () => {
    expect(telHref).toBe(`tel:${SITE.phone}`)
    expect(mailtoHref).toBe(`mailto:${SITE.email}`)
  })

  it('exposes an absolute https domain suitable for metadataBase', () => {
    const url = new URL(SITE.domain)
    expect(url.protocol).toBe('https:')
    expect(url.pathname).toBe('/')
  })

  it('places the service-region centroid inside Michigan', () => {
    expect(SITE.geo.latitude).toBeGreaterThan(41.6)
    expect(SITE.geo.latitude).toBeLessThan(48.4)
    expect(SITE.geo.longitude).toBeGreaterThan(-90.5)
    expect(SITE.geo.longitude).toBeLessThan(-82.1)
  })

  it('keeps review schema off until the testimonials are confirmed (D4)', () => {
    // Flipping this without confirming attribution risks a manual action.
    expect(SITE.emitReviewSchema).toBe(false)
  })
})
