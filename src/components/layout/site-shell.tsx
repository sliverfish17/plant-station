import type { ReactNode } from 'react'

import { SiteFooter } from '@/features/navigation/site-footer'
import { SiteHeader } from '@/features/navigation/site-header'

/**
 * The shell every route shares: sticky header with the burger drawer, the `main`
 * landmark the skip link targets, and a footer.
 *
 * The footer variant is a layout decision, not a page one — the artboards give
 * the home page the full three-column footer and every other page the slim row —
 * so it is chosen by the route group's layout rather than threaded through as a
 * prop each page has to remember to pass.
 */
export function SiteShell({
  footer,
  children,
}: {
  readonly footer: 'full' | 'slim'
  readonly children: ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter variant={footer} />
    </>
  )
}
