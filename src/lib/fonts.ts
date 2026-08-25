import { Public_Sans, Source_Serif_4 } from 'next/font/google'

/**
 * Two families only, both self-hosted by next/font so there is no render-blocking
 * request to fonts.googleapis.com. `latin-ext` covers the Polish diacritics that
 * appear in the founder's name and in plant nomenclature.
 *
 * Both are variable fonts: the weight range is loaded once rather than as
 * separate 400/600 files, and italic ships too because Latin plant names on the
 * plant card are set in Public Sans italic.
 */

export const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-source-serif',
})

export const publicSans = Public_Sans({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-public-sans',
})

export const fontVariables = `${sourceSerif.variable} ${publicSans.variable}`
