import { SiteShell } from '@/components/layout/site-shell'

/** Every page other than home ends in the slim footer (artboards 2a–2d, 4a–4b). */
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell footer="slim">{children}</SiteShell>
}
