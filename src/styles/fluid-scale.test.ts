import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * The fluid type and spacing scale is the one place where a transcription slip
 * is invisible in review and obvious to a visitor: a wrong coefficient still
 * renders, just at the wrong size. These tests evaluate the actual `clamp()`
 * expressions from theme.css at each artboard width and compare them to the
 * values measured off the design canvas.
 */

const THEME_CSS = readFileSync(join(import.meta.dirname, 'theme.css'), 'utf8')

// ── A minimal evaluator for the CSS length expressions used in theme.css ─────

type Token = { kind: 'num'; value: number; unit: 'px' | 'vw' | '' } | { kind: 'sym'; value: string }

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  const pattern = /(\d*\.?\d+)(px|vw)?|([(),+\-*/])|\s+|([a-z]+)/y
  let match: RegExpExecArray | null
  // A sticky regex resets lastIndex to 0 when it finally fails, so the consumed
  // offset has to be tracked separately to detect unparsed trailing input.
  let consumed = 0

  while ((match = pattern.exec(input)) !== null) {
    consumed = pattern.lastIndex
    const [, numeric, unit, symbol, word] = match
    if (numeric !== undefined) {
      tokens.push({
        kind: 'num',
        value: Number(numeric),
        unit: unit === 'px' || unit === 'vw' ? unit : '',
      })
    } else if (symbol !== undefined) {
      tokens.push({ kind: 'sym', value: symbol })
    } else if (word !== undefined) {
      tokens.push({ kind: 'sym', value: word })
    }
  }
  if (consumed !== input.length) {
    throw new Error(`Unparsed CSS length input at ${consumed}: ${input}`)
  }
  return tokens
}

/** Evaluates a tokenized length expression to pixels at a given viewport width. */
function evaluate(tokens: Token[], viewportPx: number): number {
  let cursor = 0

  /** The symbol at the cursor, or undefined if the cursor is past the end or on a number. */
  const peekSymbol = (): string | undefined => {
    const token = tokens[cursor]
    return token?.kind === 'sym' ? token.value : undefined
  }

  const consume = (expected?: string): Token => {
    const token = tokens[cursor]
    if (token === undefined) throw new Error('Unexpected end of CSS length expression')
    if (expected !== undefined && (token.kind !== 'sym' || token.value !== expected)) {
      throw new Error(`Expected "${expected}" in CSS length expression`)
    }
    cursor += 1
    return token
  }

  const parseArguments = (): number[] => {
    consume('(')
    const values: number[] = [parseSum()]
    while (peekSymbol() === ',') {
      consume(',')
      values.push(parseSum())
    }
    consume(')')
    return values
  }

  function parsePrimary(): number {
    const token = consume()

    if (token.kind === 'num') {
      return token.unit === 'vw' ? (token.value / 100) * viewportPx : token.value
    }

    switch (token.value) {
      case '(': {
        const value = parseSum()
        consume(')')
        return value
      }
      case '-':
        return -parsePrimary()
      case 'calc': {
        consume('(')
        const value = parseSum()
        consume(')')
        return value
      }
      case 'min':
        return Math.min(...parseArguments())
      case 'max':
        return Math.max(...parseArguments())
      case 'clamp': {
        const [low, preferred, high] = parseArguments()
        if (low === undefined || preferred === undefined || high === undefined) {
          throw new Error('clamp() needs three arguments')
        }
        return Math.min(Math.max(preferred, low), high)
      }
      default:
        throw new Error(`Unsupported function in CSS length expression: ${token.value}`)
    }
  }

  function parseProduct(): number {
    let left = parsePrimary()
    for (let operator = peekSymbol(); operator !== undefined; operator = peekSymbol()) {
      if (operator !== '*' && operator !== '/') break
      consume(operator)
      const right = parsePrimary()
      left = operator === '*' ? left * right : left / right
    }
    return left
  }

  function parseSum(): number {
    let left = parseProduct()
    for (let operator = peekSymbol(); operator !== undefined; operator = peekSymbol()) {
      if (operator !== '+' && operator !== '-') break
      consume(operator)
      const right = parseProduct()
      left = operator === '+' ? left + right : left - right
    }
    return left
  }

  const result = parseSum()
  if (cursor !== tokens.length) throw new Error('Trailing tokens in CSS length expression')
  return result
}

function tokenValueAt(customProperty: string, viewportPx: number): number {
  const pattern = new RegExp(`${customProperty}:\\s*([^;]+);`)
  const match = pattern.exec(THEME_CSS)
  if (match === null) throw new Error(`Token ${customProperty} is not defined in theme.css`)
  const expression = match[1]
  if (expression === undefined) throw new Error(`Token ${customProperty} has no value`)
  return evaluate(tokenize(expression), viewportPx)
}

// ── The anchors, read off the artboards ─────────────────────────────────────

/** [token, value @390, value @1440, value @1920] */
const ANCHORS: readonly (readonly [string, number, number, number])[] = [
  ['--text-hero', 38, 62, 68],
  ['--text-page-title', 36, 52, 52],
  ['--text-detail-title', 32, 48, 48],
  ['--text-h2', 30, 42, 46],
  ['--text-h2-contact', 32, 44, 48],
  ['--text-h3', 24, 30, 30],
  ['--text-cta-heading', 22, 26, 26],
  ['--text-card-title', 19, 21, 21],
  ['--text-plant-title', 17, 20, 20],
  ['--text-quote', 21, 22, 23],
  ['--text-phone-lg', 22, 32, 34],
  ['--text-menu-link', 36, 34, 34],
  ['--text-wordmark', 16, 22, 22],
  ['--text-wordmark-footer', 20, 22, 22],
  ['--text-lead', 18, 20, 20],
  ['--text-body', 18, 19, 20],
  ['--text-body-sm', 16, 17, 17],
  ['--text-ui', 14, 17, 17],
  ['--text-caption', 15, 16, 16],
  ['--text-eyebrow', 12, 13, 13],
  ['--spacing-section', 56, 96, 104],
  ['--spacing-gutter', 24, 48, 48],
  ['--spacing-header-x', 12, 48, 48],
  ['--container-content', 1140, 1140, 1280],
]

describe('fluid scale', () => {
  describe.each(ANCHORS)('%s', (token, at390, at1440, at1920) => {
    it('matches the 390px artboard', () => {
      expect(tokenValueAt(token, 390)).toBeCloseTo(at390, 2)
    })

    it('matches the 1440px artboard', () => {
      expect(tokenValueAt(token, 1440)).toBeCloseTo(at1440, 2)
    })

    it('matches the 1920px artboard', () => {
      expect(tokenValueAt(token, 1920)).toBeCloseTo(at1920, 2)
    })
  })

  it('never drops below the mobile anchor down to the 360px floor', () => {
    for (const [token, at390] of ANCHORS) {
      if (token === '--container-content') continue // a max-width, not a rendered size
      expect(tokenValueAt(token, 360)).toBeCloseTo(at390, 2)
    }
  })

  it('holds body copy at or above the 18px mobile / 19px desktop accessibility floor', () => {
    // The coefficients in theme.css are written to six decimals, so an anchor
    // can land a sub-micron below its target. Rounding to a hundredth of a pixel
    // compares what actually renders rather than the decimal residue.
    const rendered = (width: number): number =>
      Math.round(tokenValueAt('--text-body', width) * 100) / 100

    expect(rendered(360)).toBeGreaterThanOrEqual(18)
    expect(rendered(1024)).toBeGreaterThanOrEqual(18)
    expect(rendered(1440)).toBeGreaterThanOrEqual(19)
    expect(rendered(1920)).toBeGreaterThanOrEqual(19)
  })

  it('is monotonic between 360 and 1920 for every growing step', () => {
    // --text-menu-link deliberately shrinks with width; everything else grows.
    const growing = ANCHORS.filter(([token]) => token !== '--text-menu-link')

    for (const [token] of growing) {
      let previous = tokenValueAt(token, 360)
      for (let width = 370; width <= 1920; width += 10) {
        const current = tokenValueAt(token, width)
        expect(current).toBeGreaterThanOrEqual(previous - 0.001)
        previous = current
      }
    }
  })
})
