import { SiteShell } from '@/components/layout/site-shell'

/** The home page carries the full three-column footer (artboards 1a–1c). */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell footer="full">{children}</SiteShell>
}
