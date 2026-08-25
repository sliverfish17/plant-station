import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Analytics, in one place.
 *
 * TODO(D12): Vercel Web Analytics is the default because it is cookieless and
 * needs no consent banner — which matters for an audience that will bounce off
 * one — and because the deploy target is Vercel. Swapping to GA4 or Plausible is
 * a change to this file only.
 *
 * Both components no-op outside a Vercel deployment, so local development and CI
 * send nothing and need no environment guard.
 */
export function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
