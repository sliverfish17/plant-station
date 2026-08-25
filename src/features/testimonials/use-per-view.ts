/*
 * Client-only by virtue of its importer, which carries the directive.
 */
import { useSyncExternalStore } from 'react'

/**
 * How many cards are in view, derived from the viewport.
 *
 * `useSyncExternalStore` rather than an effect: the server snapshot is the
 * mobile value, so the markup React hydrates against is the markup the server
 * sent, and the desktop value is applied in the same commit as hydration rather
 * than a frame later. An effect-based version flashes "1 of 5" before settling
 * on "1–3 of 5".
 *
 * Card widths are CSS-driven, so layout is correct before this resolves; only
 * the label and the end-clamping depend on it.
 */

const QUERIES = [
  { query: '(min-width: 1024px)', perView: 3 },
  { query: '(min-width: 768px)', perView: 2 },
] as const

const MOBILE_PER_VIEW = 1

function subscribe(onChange: () => void): () => void {
  const lists = QUERIES.map(({ query }) => window.matchMedia(query))
  for (const list of lists) list.addEventListener('change', onChange)
  return () => {
    for (const list of lists) list.removeEventListener('change', onChange)
  }
}

function getSnapshot(): number {
  for (const { query, perView } of QUERIES) {
    if (window.matchMedia(query).matches) return perView
  }
  return MOBILE_PER_VIEW
}

function getServerSnapshot(): number {
  return MOBILE_PER_VIEW
}

export function usePerView(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
