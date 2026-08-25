import { IMAGE_SIZES } from '@/components/ui/aspect'
import { Chip } from '@/components/ui/chip'
import { CmsImage } from '@/components/ui/cms-image'
import { Section } from '@/components/ui/section'
import type { SiteSettingsEntry } from '@/lib/contentful/queries'

/**
 * Meet Edyta.
 *
 * There is deliberately no "read the full story" link: the design removed that
 * page, and a link to nowhere is worse than no link. The three paragraphs are
 * the whole story.
 *
 * The portrait is masked to an organic blob rather than a circle — a hand-drawn
 * shape for a hand-drawn trade.
 */

const CREDENTIALS = [
  '10+ years in Michigan gardens',
  '120+ gardens designed',
  'Michigan-native plant specialist',
] as const

export function MeetEdyta({ settings }: { readonly settings: SiteSettingsEntry }) {
  return (
    <Section
      id="story"
      aria-labelledby="story-heading"
      contentClassName="lg:grid lg:grid-cols-[440px_1fr] lg:items-center lg:gap-x-18 3xl:grid-cols-[480px_1fr] 3xl:gap-x-22"
    >
      {/* One heading, placed by the grid rather than duplicated per breakpoint:
          a second copy hidden at one width would leave `aria-labelledby`
          pointing at an element nobody can see. Mobile takes DOM order — heading,
          portrait, prose — which is the artboard 1a sequence. */}
      <h2 id="story-heading" className="text-h2 leading-heading lg:col-start-2 lg:row-start-1">
        Meet Edyta
      </h2>

      <div className="mx-auto mt-5 w-[78%] overflow-hidden rounded-blob lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:w-full">
        <CmsImage
          asset={settings.portrait}
          alt={settings.portraitAltText}
          ratio="4:5"
          sizes={IMAGE_SIZES.portrait}
          slotLabel="Portrait — Edyta · 4:5"
          rounded="none"
        />
      </div>

      <div className="mt-5 lg:col-start-2 lg:row-start-2 lg:mt-5">
        <p className="max-w-measure text-body leading-relaxed">
          I&rsquo;ve spent more than a decade designing and tending gardens across Metro Detroit —
          through our late frosts, clay soil, and glorious long Junes.
        </p>
        <p className="mt-4 max-w-measure text-body leading-relaxed">
          I lean toward plantings that are beautiful and genuinely low-maintenance, with Michigan
          natives doing a lot of the quiet work.
        </p>
        <p className="mt-4 max-w-measure text-body leading-relaxed">
          And I work alongside you, not over you — it&rsquo;s your garden, after all.
        </p>

        <ul className="mt-6 flex list-none flex-wrap gap-3 p-0">
          {CREDENTIALS.map((credential) => (
            <li key={credential}>
              <Chip tone="credential">{credential}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
