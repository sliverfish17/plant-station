import type { TestimonialEntry } from '@/lib/contentful/queries'

/**
 * A quote card. The quote is set in the serif at 21–23px — larger than body
 * copy, because for this audience a testimonial is read, not skimmed.
 */
export function TestimonialCard({ testimonial }: { readonly testimonial: TestimonialEntry }) {
  return (
    <figure className="flex h-full flex-col rounded-card border border-cream-line bg-cream-page p-6 lg:p-8">
      <blockquote className="m-0 font-serif text-quote leading-snug text-espresso">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-auto pt-4 text-body-sm font-semibold text-pink-700">
        {testimonial.attribution} · {testimonial.town}
      </figcaption>
    </figure>
  )
}
