'use client'

import type { TestimonialEntry } from '@/lib/contentful/queries'

import { TestimonialCard } from './testimonial-card'
import { useCarousel } from './use-carousel'
import { usePerView } from './use-per-view'

/**
 * Client island 2 of 4: the testimonial slider.
 *
 * Deliberately unfashionable, per the design and the audience: no autoplay, no
 * drag requirement, no dots. Two 52px arrow buttons and a position counter, both
 * of which work with a mouse, a finger, or the keyboard. The arrows disable at
 * the ends rather than wrapping, so nobody loses their place.
 *
 * The track is rendered in full and translated, rather than rendering only the
 * visible window: swapping the DOM under a screen reader mid-navigation is
 * disorienting, and five quote cards cost nothing to keep mounted.
 */

const GAP_REM = 1.5

export function TestimonialSlider({
  testimonials,
}: {
  readonly testimonials: readonly TestimonialEntry[]
}) {
  const perView = usePerView()
  const { index, canPrev, canNext, prev, next, rangeLabel } = useCarousel(testimonials, {
    perView,
  })

  if (testimonials.length === 0) return null

  // One card plus one gap per step. Expressed in the same units the track uses,
  // so the transform and the layout cannot disagree at any viewport width.
  const step = `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView} + ${GAP_REM}rem)`

  return (
    <div>
      <div className="overflow-hidden">
        <ul
          className="m-0 flex list-none gap-6 p-0 transition-transform duration-(--duration-slide) ease-(--ease-slide) motion-reduce:transition-none"
          style={{ transform: `translateX(calc(${index} * -${step}))` }}
        >
          {testimonials.map((testimonial, position) => (
            <li
              key={testimonial.sys.id}
              className="shrink-0"
              style={{ width: `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView})` }}
              // Cards scrolled out of view stay in the DOM but are removed from
              // the tab order, so Tab never lands on something invisible.
              inert={position < index || position >= index + perView}
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center gap-4 lg:justify-center">
        <button
          type="button"
          onClick={prev}
          disabled={!canPrev}
          aria-label={perView === 1 ? 'Previous quote' : 'Previous quotes'}
          className="flex size-slider-button cursor-pointer items-center justify-center rounded-full border-2 border-pink-700 bg-transparent text-xl font-semibold text-pink-700 transition-colors duration-(--duration-hover) hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">←</span>
        </button>

        {/* Announced on change so the position is available without sight of the
            track; polite, so it never interrupts. */}
        <p aria-live="polite" className="text-body-sm font-semibold text-taupe">
          {rangeLabel}
        </p>

        <button
          type="button"
          onClick={next}
          disabled={!canNext}
          aria-label={perView === 1 ? 'Next quote' : 'Next quotes'}
          className="flex size-slider-button cursor-pointer items-center justify-center rounded-full border-2 border-pink-700 bg-transparent text-xl font-semibold text-pink-700 transition-colors duration-(--duration-hover) hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
