import { Button } from '@/components/ui/button'

/**
 * The tinted card that closes a listing or detail page. Two tones: cream on the
 * Favorite Plants page, pink on detail pages, per the artboards.
 */
export function CtaCard({
  heading,
  body,
  label,
  href,
  tone = 'pink',
}: {
  readonly heading: string
  readonly body: string
  readonly label: string
  readonly href: string
  readonly tone?: 'pink' | 'cream' | undefined
}) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-card p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:p-9 ${
        tone === 'pink' ? 'bg-pink-100' : 'bg-cream-alt'
      }`}
    >
      <div>
        <p
          className={`font-serif text-cta-heading font-semibold ${
            tone === 'pink' ? 'text-pink-700' : 'text-olive-700'
          }`}
        >
          {heading}
        </p>
        <p className="mt-1.5 text-body leading-normal text-espresso">{body}</p>
      </div>
      <Button href={href} size="md" className="w-full sm:w-auto">
        {label}
      </Button>
    </div>
  )
}
