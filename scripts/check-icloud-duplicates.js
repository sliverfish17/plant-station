import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

/**
 * Fails if the working tree contains an iCloud Drive conflict copy.
 *
 * The project lives under ~/Documents, which iCloud syncs. When it cannot
 * reconcile two versions of a file it keeps both, naming the second "name 2" —
 * and Next renames rather than deletes anything it cannot remove, so a build
 * directory can fill with "app 2" and "chunks 3" until `rm -rf` hangs on it.
 *
 * The dangerous case is a duplicate under `src/app`: a copy of `page.tsx` in a
 * duplicated route group makes Next fail with "two parallel pages resolve to the
 * same path", which says nothing about iCloud and sends you looking at routing.
 * This check names the real cause in one line instead.
 *
 * `npm run icloud:shield` asks the file provider to leave build output alone,
 * which stops the duplicates being created in the first place.
 */

/**
 * `.git` is deliberately **not** skipped. iCloud renamed `HEAD`, `config` and
 * `description` to "HEAD 2" and friends, and without them git stops recognising
 * the directory as a repository at all — it silently walks up to the next one,
 * which here meant the whole home directory showed as ten thousand changes. The
 * one place a conflict copy does the most damage was the one place this did not
 * look.
 */
const SKIP = new Set(['node_modules', '.next', '.lighthouseci', 'playwright-report'])

/** Inside .git only the top level matters, and objects/ is enormous. */
const SHALLOW = new Set(['.git'])

/** "app 2", "chunks 3", "tsconfig 2.tsbuildinfo" — a space, digits, then end or extension. */
const CONFLICT = /\s\d+(\.[^.]+)?$/

async function findConflicts(directory, root) {
  const found = []

  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue

    const path = join(directory, entry.name)
    if (CONFLICT.test(entry.name)) found.push(relative(root, path))
    if (entry.isDirectory() && !SHALLOW.has(entry.name)) {
      found.push(...(await findConflicts(path, root)))
    } else if (entry.isDirectory()) {
      for (const inner of await readdir(path, { withFileTypes: true })) {
        if (CONFLICT.test(inner.name)) found.push(relative(root, join(path, inner.name)))
      }
    }
  }

  return found
}

const root = process.cwd()
const conflicts = await findConflicts(root, root)

if (conflicts.length > 0) {
  console.error('iCloud Drive conflict copies found:\n')
  for (const path of conflicts) console.error(`  ${path}`)
  console.error(
    '\nThese are duplicates iCloud made, not files anyone wrote.' +
      '\n\nBefore deleting one, check whether the *original* is still there: iCloud' +
      '\nrenames rather than copies, so "HEAD 2" can mean HEAD is gone. A missing' +
      '\n.git/HEAD makes git fall back to the next repository up the tree, which' +
      '\nlooks like thousands of unexpected changes rather than a broken repo.' +
      '\n\nA duplicate under src/app instead breaks the build with a routing error' +
      '\nthat never mentions iCloud.',
  )
  process.exit(1)
}

console.log('No iCloud conflict copies.')
