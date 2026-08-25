import 'server-only'

import { turnstile } from '@/lib/env'

/**
 * Cloudflare Turnstile verification (D7).
 *
 * Turnstile needs JavaScript to mint a token, but the form is required to work
 * without JavaScript — so a missing token cannot be treated as failure. The
 * honeypot and the timing check are the JavaScript-free floor and always run;
 * Turnstile is an additional signal when the browser could produce one.
 *
 * If spam volume ever proves that insufficient, tightening this to "token
 * required" is a one-line change — and a trade-off for the client to make
 * knowingly, since it breaks the no-JavaScript path.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  if (turnstile.mode !== 'enabled') return true
  if (token === undefined) return true

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: turnstile.secretKey, response: token }),
    })

    if (!response.ok) return false

    const payload: unknown = await response.json()
    return typeof payload === 'object' && payload !== null && 'success' in payload
      ? payload.success === true
      : false
  } catch {
    // A Cloudflare outage must not swallow a real enquiry.
    return true
  }
}
