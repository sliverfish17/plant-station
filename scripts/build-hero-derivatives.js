import { mkdir, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'

import sharp from 'sharp'

/**
 * Generates responsive derivatives of the one real photograph.
 *
 * Contentful's Images API does this per-request for every CMS asset, but the
 * hero ships from `public/` until the space is populated — and a custom
 * `next/image` loader cannot resize a local file. Without this, the hero's
 * srcset is eight identical entries and a phone downloads the full 1.2 MB
 * original, which for an audience on phones in a garden is the single worst
 * thing on the page.
 *
 * Run: `npm run build:hero`. Delete this script and its output once the hero
 * comes from Contentful.
 */

const SOURCE = 'design/assets/hero-edyta-garden.jpeg'
const OUT_DIR = 'public/hero'
const BASENAME = 'edyta-garden'

/** Matches the widths the srcset advertises in src/lib/local-image.ts. */
const WIDTHS = [640, 828, 1080, 1280, 1536]

/** AVIF first, then WebP, then JPEG — the order `<source>` elements declare. */
const FORMATS = [
  { ext: 'avif', encode: (pipeline) => pipeline.avif({ quality: 50, effort: 6 }) },
  { ext: 'webp', encode: (pipeline) => pipeline.webp({ quality: 72 }) },
  { ext: 'jpeg', encode: (pipeline) => pipeline.jpeg({ quality: 76, mozjpeg: true }) },
]

await mkdir(OUT_DIR, { recursive: true })

// Regenerate from scratch so a removed width cannot leave a stale file behind.
for (const existing of await readdir(OUT_DIR)) {
  if (existing.startsWith(BASENAME)) await unlink(join(OUT_DIR, existing))
}

const results = []

for (const width of WIDTHS) {
  for (const { ext, encode } of FORMATS) {
    const out = join(OUT_DIR, `${BASENAME}-${width}.${ext}`)
    const info = await encode(sharp(SOURCE).resize({ width })).toFile(out)
    results.push({ file: `${BASENAME}-${width}.${ext}`, kb: Math.round(info.size / 1024) })
  }
}

const widest = results.filter((r) => r.file.includes(`-${WIDTHS.at(-1)}.`))
console.log(`Wrote ${results.length} files to ${OUT_DIR}/`)
for (const { file, kb } of results) console.log(`  ${file.padEnd(28)} ${String(kb).padStart(5)} KB`)
console.log(
  `\nSmallest AVIF: ${results.find((r) => r.file.endsWith('-640.avif'))?.kb} KB` +
    ` · largest: ${Math.max(...widest.map((r) => r.kb))} KB (was 1185 KB for every device)`,
)
