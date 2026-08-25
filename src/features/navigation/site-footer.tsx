import Link from 'next/link'

import { LeafMark } from '@/components/ui/leaf-mark'
import { PRIMARY_NAV } from '@/config/navigation'
import { SITE, mailtoHref, telHref } from '@/config/site'
import { BUILD_YEAR } from '@/lib/build-info'

/**
 * Three columns on desktop, one on mobile.
 *
 * `variant="slim"` is what the listing and detail artboards use: wordmark, links
 * and phone on a single row, without the tagline, social circles or copyright
 * rule that the home page footer carries.
 */
export function SiteFooter({ variant = 'full' }: { readonly variant?: 'full' | 'slim' }) {
  if (variant === 'slim') {
    return (
      <footer className="on-dark bg-olive-900 px-gutter py-12">
        <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-6">
          <Wordmark />
          <FooterNav className="flex flex-wrap gap-6" />
          <a
            href={telHref}
            className="inline-flex min-h-control-sm items-center text-body-sm font-semibold text-near-white no-underline"
          >
            {SITE.phoneDisplay}
          </a>
        </div>
      </footer>
    )
  }

  return (
    <footer className="on-dark bg-olive-900 px-gutter pt-16 pb-12">
      <div className="mx-auto w-full max-w-content">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-14">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-[34ch] text-body-sm leading-normal text-on-dark-muted-alt">
              {SITE.tagline}
            </p>
          </div>

          <FooterNav className="flex flex-col" />

          <div className="flex flex-col">
            <a
              href={telHref}
              className="inline-flex min-h-control-sm items-center text-body-sm font-semibold text-near-white no-underline"
            >
              {SITE.phoneDisplay}
            </a>
            <a
              href={mailtoHref}
              className="inline-flex min-h-control-sm items-center text-body-sm text-on-dark-sand no-underline"
            >
              {SITE.email}
            </a>
            <span className="text-caption text-on-dark-muted-alt">{SITE.areaServedRegion}</span>

            {/* TODO(D2): social profiles have no URLs yet, so nothing is rendered
                rather than linking a placeholder that also feeds schema sameAs. */}
            {SITE.social.length > 0 ? (
              <ul className="mt-1.5 flex list-none gap-3 p-0">
                {SITE.social.map((profile) => (
                  <li key={profile.href}>
                    <a
                      href={profile.href}
                      aria-label={profile.label}
                      rel="me noopener"
                      target="_blank"
                      className="flex size-social items-center justify-center rounded-full border border-olive-600 text-caption font-semibold text-on-dark-sand no-underline"
                    >
                      <span aria-hidden="true">{profile.short}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <p className="mt-12 border-t border-olive-500 pt-6 text-caption text-on-dark-faint">
          {/* TODO(D1): copyright pairs the person with the trading name. The year
              is stamped at build time — reading the clock during render would
              make every cached page dynamic. */}
          © {BUILD_YEAR} {SITE.copyrightName} · {SITE.areaServedRegion}
        </p>
      </div>
    </footer>
  )
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <LeafMark size={20} className="text-on-dark-sand" />
      <span className="font-serif text-wordmark-footer font-semibold text-near-white">
        {/* TODO(D1): the footer wordmark is the person, not the brand. */}
        {SITE.legalName}
      </span>
    </div>
  )
}

function FooterNav({ className }: { readonly className: string }) {
  return (
    <nav aria-label="Footer">
      <ul className={`m-0 list-none p-0 ${className}`}>
        {PRIMARY_NAV.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-control-sm items-center text-body-sm font-semibold text-on-dark-cream no-underline hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
