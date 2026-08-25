import { SiteFooter } from '@/features/navigation/site-footer'
import { SiteHeader } from '@/features/navigation/site-header'

/**
 * The shell every page shares: sticky header with the burger drawer, the `main`
 * landmark the skip link targets, and the footer.
 *
 * Routes that want the slim footer render their own inside `main` rather than
 * receiving a prop here — the layout has no way to know which page it wraps, and
 * threading that through would mean a context or a route lookup for one boolean.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  )
}
