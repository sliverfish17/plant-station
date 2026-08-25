'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { LeafMark } from '@/components/ui/leaf-mark'
import { PRIMARY_NAV } from '@/config/navigation'
import { SITE, mailtoHref, telHref } from '@/config/site'

import { useDisclosure } from './use-disclosure'

/**
 * Client island 1 of 4: the burger drawer.
 *
 * The burger is used at every breakpoint — a deliberate choice in the design, so
 * that the same navigation is in the same place whether someone is on a phone in
 * the garden or a laptop indoors. Desktop gets a 420px right drawer over a dimmed
 * page; mobile gets the full screen.
 *
 * All of the keyboard behaviour lives in `useDisclosure`, which is tested on its
 * own. What remains here is markup.
 */

const PANEL_ID = 'primary-menu'

export function MenuDrawer() {
  const { isOpen, open, close, panelRef, triggerRef } = useDisclosure()
  const pathname = usePathname()

  // A link inside the drawer navigates without unmounting it, so the drawer has
  // to close itself when the route changes.
  useEffect(() => {
    close()
  }, [pathname, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        className="inline-flex min-h-control-sm cursor-pointer items-center gap-2 rounded-pill border-2 border-olive-700 px-control-x-sm text-ui font-semibold text-olive-700 transition-colors duration-(--duration-hover) hover:bg-leaf-100"
      >
        <span className="flex flex-col gap-1" aria-hidden="true">
          <span className="block h-0.5 w-4 bg-olive-700 sm:w-5" />
          <span className="block h-0.5 w-4 bg-olive-700 sm:w-5" />
          <span className="block h-0.5 w-4 bg-olive-700 sm:w-5" />
        </span>
        Menu
      </button>

      {/* Rendered only when open: an always-mounted panel would put every menu
          link in the tab order of every page. */}
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          {/* A mouse affordance only. Keyboard users already have Escape and the
              Close button, and giving this a role would put a second "Close"
              control in the accessibility tree for no gain. */}
          <div onClick={close} className="absolute inset-0 bg-olive-900/45" />

          <nav
            id={PANEL_ID}
            ref={panelRef}
            aria-label="Primary"
            className="absolute inset-y-0 right-0 flex w-full max-w-drawer flex-col overflow-y-auto bg-cream-page px-gutter py-6 shadow-drawer motion-safe:animate-[drawer-in_240ms_ease-out]"
          >
            <LeafMark
              size={240}
              className="pointer-events-none absolute -right-16 bottom-28 text-olive-700 opacity-[0.06]"
            />

            <div className="relative flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 lg:hidden">
                <LeafMark size={20} className="text-olive-700" />
                <span className="font-serif text-wordmark font-semibold text-olive-700">
                  {SITE.brandName}
                </span>
              </span>

              <button
                type="button"
                onClick={close}
                className="ml-auto inline-flex min-h-control-sm cursor-pointer items-center gap-2 rounded-pill border-2 border-olive-700 px-control-x-sm text-ui font-semibold text-olive-700 transition-colors duration-(--duration-hover) hover:bg-leaf-100"
              >
                <span aria-hidden="true">✕</span> Close
              </button>
            </div>

            <ul className="relative mt-9 flex list-none flex-col gap-6 p-0">
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`font-serif text-menu-link font-semibold no-underline ${
                      link.accent === true ? 'text-pink-700' : 'text-olive-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="relative mt-auto flex flex-col gap-2 border-t border-cream-line pt-6">
              <a href={telHref} className="text-phone-lg font-semibold text-pink-700 no-underline">
                {SITE.phoneDisplay}
              </a>
              <a href={mailtoHref} className="text-body-sm text-pink-700 no-underline">
                {SITE.email}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
