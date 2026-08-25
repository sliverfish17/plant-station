import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCarousel } from './use-carousel'

/**
 * The arithmetic the slider depends on: clamping at both ends, staying valid
 * when `perView` changes under it on a resize, and producing the exact range
 * label the design shows next to the arrows.
 */

const FIVE = ['a', 'b', 'c', 'd', 'e'] as const

describe('useCarousel', () => {
  it('starts at the beginning with the previous arrow disabled', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 3 }))

    expect(result.current.index).toBe(0)
    expect(result.current.canPrev).toBe(false)
    expect(result.current.canNext).toBe(true)
  })

  it('steps one item at a time, not one page', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 3 }))

    act(() => {
      result.current.next()
    })
    expect(result.current.index).toBe(1)
    expect(result.current.visible).toEqual(['b', 'c', 'd'])
  })

  it('clamps at the end rather than wrapping', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 3 }))

    act(() => {
      result.current.next()
      result.current.next()
      result.current.next()
      result.current.next()
    })

    expect(result.current.index).toBe(2) // 5 items − 3 in view
    expect(result.current.canNext).toBe(false)
    expect(result.current.visible).toEqual(['c', 'd', 'e'])
  })

  it('clamps at the start rather than wrapping', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 1 }))

    act(() => {
      result.current.prev()
      result.current.prev()
    })

    expect(result.current.index).toBe(0)
    expect(result.current.canPrev).toBe(false)
  })

  it('labels a multi-card view as a range', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 3 }))
    expect(result.current.rangeLabel).toBe('1–3 of 5')

    act(() => {
      result.current.next()
    })
    expect(result.current.rangeLabel).toBe('2–4 of 5')
  })

  it('labels a single-card view without a range', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 1 }))
    expect(result.current.rangeLabel).toBe('1 of 5')

    act(() => {
      result.current.next()
    })
    expect(result.current.rangeLabel).toBe('2 of 5')
  })

  it('pulls the index back into range when perView grows on a resize', () => {
    // Mobile: one card in view, scrolled to the last quote.
    const { result, rerender } = renderHook(
      ({ perView }: { perView: number }) => useCarousel(FIVE, { perView }),
      { initialProps: { perView: 1 } },
    )

    act(() => {
      result.current.goTo(4)
    })
    expect(result.current.index).toBe(4)

    // Rotate to landscape: three in view, so index 4 would show an empty track.
    rerender({ perView: 3 })

    expect(result.current.index).toBe(2)
    expect(result.current.rangeLabel).toBe('3–5 of 5')
    expect(result.current.canNext).toBe(false)
  })

  it('disables both arrows when everything already fits', () => {
    const { result } = renderHook(() => useCarousel(['a', 'b'], { perView: 3 }))

    expect(result.current.maxIndex).toBe(0)
    expect(result.current.canPrev).toBe(false)
    expect(result.current.canNext).toBe(false)
    expect(result.current.rangeLabel).toBe('1–2 of 2')
  })

  it('survives an empty list', () => {
    const { result } = renderHook(() => useCarousel([], { perView: 3 }))

    expect(result.current.index).toBe(0)
    expect(result.current.maxIndex).toBe(0)
    expect(result.current.visible).toEqual([])
    expect(result.current.rangeLabel).toBe('0 of 0')
  })

  it('treats a nonsensical perView as one', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 0 }))

    expect(result.current.visible).toEqual(['a'])
    expect(result.current.maxIndex).toBe(4)
  })

  it('clamps goTo to the valid range', () => {
    const { result } = renderHook(() => useCarousel(FIVE, { perView: 3 }))

    act(() => {
      result.current.goTo(99)
    })
    expect(result.current.index).toBe(2)

    act(() => {
      result.current.goTo(-5)
    })
    expect(result.current.index).toBe(0)
  })
})
