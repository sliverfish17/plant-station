import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useDisclosure } from './use-disclosure'

/**
 * The drawer's keyboard contract, tested against the hook rather than the
 * component: Escape closes, focus enters the panel, Tab cycles inside it, and
 * focus returns to the trigger. None of that depends on what the drawer renders,
 * which is exactly why it lives in a hook and is verified here.
 */

type Fixture = {
  readonly panel: HTMLElement
  readonly trigger: HTMLButtonElement
  readonly links: readonly HTMLAnchorElement[]
}

function buildPanel(linkCount = 3): Fixture {
  const trigger = document.createElement('button')
  trigger.textContent = 'Menu'
  document.body.appendChild(trigger)

  const panel = document.createElement('nav')
  const links = Array.from({ length: linkCount }, (_, index) => {
    const link = document.createElement('a')
    link.href = `/link-${index}`
    link.textContent = `Link ${index}`
    panel.appendChild(link)
    return link
  })
  document.body.appendChild(panel)

  return { panel, trigger, links }
}

function pressKey(key: string, options: { shiftKey?: boolean } = {}): void {
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        shiftKey: options.shiftKey ?? false,
        bubbles: true,
        cancelable: true,
      }),
    )
  })
}

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('useDisclosure', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.isOpen).toBe(false)
  })

  it('opens, closes and toggles', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(true)
  })

  it('moves focus to the first focusable element in the panel on open', () => {
    const { panel, links } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })

    expect(document.activeElement).toBe(links[0])
  })

  it('closes on Escape', () => {
    const { panel } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    pressKey('Escape')
    expect(result.current.isOpen).toBe(false)
  })

  it('ignores Escape while closed', () => {
    const { result } = renderHook(() => useDisclosure())
    pressKey('Escape')
    expect(result.current.isOpen).toBe(false)
  })

  it('restores focus to the trigger when it closes', () => {
    const { panel, trigger } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.triggerRef.current = trigger
      result.current.open()
    })

    act(() => {
      result.current.close()
    })

    expect(document.activeElement).toBe(trigger)
  })

  it('wraps Tab from the last focusable element back to the first', () => {
    const { panel, links } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })

    const last = links[links.length - 1]
    act(() => {
      last?.focus()
    })

    pressKey('Tab')
    expect(document.activeElement).toBe(links[0])
  })

  it('wraps Shift+Tab from the first focusable element back to the last', () => {
    const { panel, links } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })

    act(() => {
      links[0]?.focus()
    })

    pressKey('Tab', { shiftKey: true })
    expect(document.activeElement).toBe(links[links.length - 1])
  })

  it('pulls focus back in when it has escaped the panel', () => {
    const { panel, links, trigger } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })

    // Focus outside the drawer — what a stray programmatic focus would do.
    act(() => {
      trigger.focus()
    })

    pressKey('Tab', { shiftKey: true })
    expect(document.activeElement).toBe(links[links.length - 1])
  })

  it('leaves Tab alone in the middle of the panel, so the browser cycles normally', () => {
    const { panel, links } = buildPanel()
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })

    act(() => {
      links[1]?.focus()
    })

    pressKey('Tab')
    // Untouched: jsdom does not move focus itself, so it stays put.
    expect(document.activeElement).toBe(links[1])
  })

  it('locks and restores page scroll', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.open()
    })
    expect(document.body.style.overflow).toBe('hidden')

    act(() => {
      result.current.close()
    })
    expect(document.body.style.overflow).toBe('')
  })

  it('cleans up the key listener when unmounted while open', () => {
    const { panel } = buildPanel()
    const { result, unmount } = renderHook(() => useDisclosure())

    act(() => {
      result.current.panelRef.current = panel
      result.current.open()
    })

    unmount()
    // No listener left behind to throw against a torn-down component.
    expect(() => {
      pressKey('Escape')
    }).not.toThrow()
    expect(document.body.style.overflow).toBe('')
  })
})
