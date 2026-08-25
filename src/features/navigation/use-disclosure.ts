/*
 * Client-only by virtue of its importer, which carries the directive.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Open/close state for a modal surface, with the four behaviours that make one
 * usable by keyboard: Escape closes, focus moves in on open, Tab is trapped
 * inside while open, and focus returns to the trigger on close.
 *
 * The hook knows nothing about what the panel contains — it is handed a ref and
 * works with whatever focusable elements are inside at the moment Tab is
 * pressed, which is what lets the drawer's contents change without the trap
 * needing to know.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export type Disclosure = {
  readonly isOpen: boolean
  readonly open: () => void
  readonly close: () => void
  readonly toggle: () => void
  readonly panelRef: React.RefObject<HTMLElement | null>
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>
}

/**
 * Skips elements that are present but not perceivable. `offsetParent` would be
 * the cheaper test, but it depends on layout — so it reports every element as
 * hidden in a test environment, which is exactly where the trap needs verifying.
 */
function isVisible(element: HTMLElement): boolean {
  if (element.hidden) return false
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (style === undefined) return true
  return style.display !== 'none' && style.visibility !== 'hidden'
}

function focusableWithin(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible)
}

export function useDisclosure(): Disclosure {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((current) => !current)
  }, [])

  // Move focus into the panel on open, and back to the trigger on close.
  useEffect(() => {
    if (!isOpen) return

    const panel = panelRef.current
    const previouslyFocused = document.activeElement
    const firstFocusable = panel === null ? undefined : focusableWithin(panel)[0]
    firstFocusable?.focus()

    return () => {
      // Returning focus to the trigger — rather than to the document — is what
      // keeps a keyboard user's place after the drawer closes.
      const trigger = triggerRef.current
      if (trigger !== null) {
        trigger.focus()
      } else if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (panel === null) return

      const focusable = focusableWithin(panel)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (first === undefined || last === undefined) return

      const active = document.activeElement

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, close])

  // The page behind a full-screen drawer must not scroll under it.
  useEffect(() => {
    if (!isOpen) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  return { isOpen, open, close, toggle, panelRef, triggerRef }
}
