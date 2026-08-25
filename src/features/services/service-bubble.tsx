import Link from 'next/link'

import { serviceHref } from '@/config/navigation'
import type { ServiceEntry } from '@/lib/contentful/queries'

import { ServiceIcon } from './service-icon'

/**
 * A service, in the two shapes the design gives it.
 *
 * Desktop is a 250–270px circle in a staggered row; mobile is a compact pill
 * with a 56px icon badge — **not** a shrunken circle. A circle small enough to
 * fit a 390px column cannot hold a two-line name and a one-line description at
 * a readable size, which is why the design changes the shape rather than the
 * scale, and why this renders two different structures rather than one with
 * responsive padding.
 *
 * Both are a single link, so the whole thing is one tap target and one tab stop.
 */

type ServiceBubbleProps = {
  readonly service: ServiceEntry
  /** Vertical offset of the desktop circle, in pixels, per artboards 1b/1c. */
  readonly offset: number
}

const SHARED_LINK =
  'group no-underline transition-[transform,box-shadow,background-color,border-color] duration-(--duration-hover) motion-reduce:transition-none'

export function ServiceBubble({ service, offset }: ServiceBubbleProps) {
  return (
    <>
      {/* Mobile: pill row */}
      <Link
        href={serviceHref(service.slug)}
        className={`${SHARED_LINK} flex min-h-16 items-center gap-4 rounded-pill border-2 border-sage-500 bg-leaf-100 py-3.5 pr-5 pl-3.5 hover:border-pink-700 active:bg-pink-100 lg:hidden`}
      >
        <span className="flex size-icon-badge shrink-0 items-center justify-center rounded-full border border-sage-300 bg-cream-page text-olive-700">
          <ServiceIcon iconKey={service.iconKey} size={26} />
        </span>
        <span>
          <span className="block font-serif text-plant-title font-semibold text-olive-700">
            {service.name}
          </span>
          <span className="block text-body-sm leading-snug text-espresso">{service.summary}</span>
        </span>
      </Link>

      {/* Desktop: circle. The stagger is a design rhythm, so it is presentational
          and applied with an inline offset rather than six utility classes. */}
      <Link
        href={serviceHref(service.slug)}
        style={{ marginBlockStart: `${offset}px` }}
        className={`${SHARED_LINK} hidden size-bubble flex-col items-center justify-center gap-1.5 rounded-full border-2 border-sage-500 bg-leaf-100 p-7 text-center hover:-translate-y-1.5 hover:border-[3px] hover:border-pink-700 hover:bg-cream-page hover:shadow-lift active:bg-pink-100 lg:flex`}
      >
        <span className="text-olive-700">
          <ServiceIcon iconKey={service.iconKey} size={28} />
        </span>
        <span className="font-serif text-card-title font-semibold text-olive-700">
          {service.name}
        </span>
        <span className="text-body-sm leading-snug text-espresso">{service.summary}</span>
        {/* Revealed on hover and on keyboard focus — a hover-only affordance
            would be invisible to anyone navigating by keyboard. */}
        <span className="text-caption font-semibold text-pink-700 opacity-0 transition-opacity duration-(--duration-hover) group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          Learn more <span aria-hidden="true">→</span>
        </span>
      </Link>
    </>
  )
}

/** Stagger offsets, read off artboard 1b. Applied by position, not by service. */
export const BUBBLE_OFFSETS = [0, 40, 12, 28, 0, 36] as const

export function bubbleOffsetAt(position: number): number {
  return BUBBLE_OFFSETS[position % BUBBLE_OFFSETS.length] ?? 0
}
