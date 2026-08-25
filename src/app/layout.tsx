import type { Metadata, Viewport } from 'next'

import { SITE } from '@/config/site'
import { SiteAnalytics } from '@/features/analytics/analytics'
import { fontVariables } from '@/lib/fonts'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: `Garden Design & Plant Care in Metro Detroit | ${SITE.brandName}`,
    template: `%s | ${SITE.brandName}`,
  },
  description:
    'Michigan garden design, planting, and plant care, tailored to how you actually live. Serving Metro Detroit — free 15-minute intro call.',
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  // TODO(D1): publisher name follows the brand decision.
  publisher: SITE.brandName,
  formatDetection: { telephone: true, email: true, address: false },
}

export const viewport: Viewport = {
  themeColor: '#fcf5e1',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={fontVariables}>
      <head>
        {/* Contentful's asset CDN serves every image; the handshake is worth pre-warming. */}
        <link rel="preconnect" href="https://images.ctfassets.net" crossOrigin="" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  )
}
