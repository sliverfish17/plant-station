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

const SKIP = new Set(['.git', 'node_modules', '.next', '.lighthouseci', 'playwright-report'])

/** "app 2", "chunks 3", "tsconfig 2.tsbuildinfo" — a space, digits, then end or extension. */
const CONFLICT = /\s\d+(\.[^.]+)?$/

async function findConflicts(directory, root) {
  const found = []

  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue

    const path = join(directory, entry.name)
    if (CONFLICT.test(entry.name)) found.push(relative(root, path))
    if (entry.isDirectory()) found.push(...(await findConflicts(path, root)))
  }

  return found
}

const root = process.cwd()
const conflicts = await findConflicts(root, root)

if (conflicts.length > 0) {
  console.error('iCloud Drive conflict copies found:\n')
  for (const path of conflicts) console.error(`  ${path}`)
  console.error(
    '\nThese are duplicates iCloud made, not files anyone wrote. Delete them.' +
      '\nA duplicate under src/app breaks the build with a routing error that does' +
      '\nnot mention iCloud. Run `npm run icloud:shield` to stop them recurring.',
  )
  process.exit(1)
}

console.log('No iCloud conflict copies.')
