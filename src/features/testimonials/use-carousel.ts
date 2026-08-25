/*
 * Client-only by virtue of its importer, which carries the directive.
 */
import { useCallback, useMemo, useState } from 'react'

/**
 * A stepped carousel over a list, generic in the item type.
 *
 * It knows nothing about DOM structure, transforms or card widths — it owns an
 * index and the arithmetic around it, which is the part that is easy to get
 * wrong: clamping at both ends, keeping the index valid when `perView` changes
 * under it (a viewport resize), and producing the range label the design shows
 * next to the arrows ("1–3 of 5" on desktop, "1 of 5" on mobile).
 *
 * Stepping is one item at a time, per the design — not one page at a time.
 */

export type Carousel<T> = {
  readonly index: number
  readonly items: readonly T[]
  /** The items currently in view, for consumers that render a window. */
  readonly visible: readonly T[]
  readonly canPrev: boolean
  readonly canNext: boolean
  readonly prev: () => void
  readonly next: () => void
  readonly goTo: (index: number) => void
  /** "1–3 of 5", or "1 of 5" when a single item is in view. */
  readonly rangeLabel: string
  /** Highest valid index — never negative, even with fewer items than perView. */
  readonly maxIndex: number
}

export function useCarousel<T>(
  items: readonly T[],
  { perView }: { readonly perView: number },
): Carousel<T> {
  const [rawIndex, setRawIndex] = useState(0)

  const safePerView = Math.max(1, Math.floor(perView))
  const maxIndex = Math.max(0, items.length - safePerView)

  // Derived rather than stored: when perView grows on a resize, an index that
  // was valid for one card in view can overshoot the end for three. Clamping on
  // read means that correction needs no effect and cannot lag a render behind.
  const index = Math.min(rawIndex, maxIndex)

  const goTo = useCallback(
    (next: number) => {
      setRawIndex(Math.min(Math.max(0, next), maxIndex))
    },
    [maxIndex],
  )

  const prev = useCallback(() => {
    setRawIndex((current) => Math.max(0, Math.min(current, maxIndex) - 1))
  }, [maxIndex])

  const next = useCallback(() => {
    setRawIndex((current) => Math.min(maxIndex, Math.min(current, maxIndex) + 1))
  }, [maxIndex])

  const visible = useMemo(
    () => items.slice(index, index + safePerView),
    [items, index, safePerView],
  )

  const rangeLabel = useMemo(() => {
    if (items.length === 0) return '0 of 0'
    const first = index + 1
    const last = Math.min(index + safePerView, items.length)
    return first === last ? `${first} of ${items.length}` : `${first}–${last} of ${items.length}`
  }, [index, safePerView, items.length])

  return {
    index,
    items,
    visible,
    canPrev: index > 0,
    canNext: index < maxIndex,
    prev,
    next,
    goTo,
    rangeLabel,
    maxIndex,
  }
}
