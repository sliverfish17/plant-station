import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { LeafMark } from '@/components/ui/leaf-mark'
import { ROUTES } from '@/config/navigation'
import { SITE, telHref } from '@/config/site'

import { MenuDrawer } from './menu-drawer'

/**
 * Sticky top bar. Server-rendered apart from the drawer, which is the only part
 * that needs state.
 *
 * The phone number is hidden below the large breakpoint — not removed. On a
 * phone the same number is one tap away inside the drawer, and the header has to
 * keep the wordmark, the CTA and the menu trigger all above 48px.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-line bg-cream-page">
      <div className="mx-auto flex w-full max-w-content items-center justify-between gap-2 px-header-x py-2.5">
        <Link
          href={ROUTES.home}
          className="flex min-h-control-sm items-center gap-2 no-underline"
          aria-label={`${SITE.brandName} — home`}
        >
          <LeafMark size={24} className="text-olive-700" />
          <span className="font-serif text-wordmark font-semibold text-olive-700">
            {/* TODO(D1): the header wordmark is the brand name; the footer uses the
                person's name, reproducing the split in the design itself. */}
            {SITE.brandName}
          </span>
        </Link>

        <div className="flex items-center gap-2 lg:gap-5">
          <a
            href={telHref}
            className="hidden min-h-control-sm items-center text-ui font-semibold text-pink-700 no-underline lg:inline-flex"
          >
            {SITE.phoneDisplay}
          </a>

          <Button href={ROUTES.contact} variant="secondary" size="sm">
            Get in Touch
          </Button>

          <MenuDrawer />
        </div>
      </div>
    </header>
  )
}
