import { Section } from '@/components/ui/section'
import type { TestimonialEntry } from '@/lib/contentful/queries'

import { TestimonialSlider } from './testimonial-slider'

export function TestimonialsSection({
  testimonials,
}: {
  readonly testimonials: readonly TestimonialEntry[]
}) {
  if (testimonials.length === 0) return null

  return (
    <Section tone="cream-alt" aria-labelledby="kind-words-heading">
      <h2 id="kind-words-heading" className="text-h2 leading-heading text-pink-700 lg:text-center">
        Kind words
      </h2>
      <div className="mt-8 lg:mt-10">
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </Section>
  )
}
