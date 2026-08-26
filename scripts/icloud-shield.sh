#!/usr/bin/env bash
# Ask macOS's file provider (iCloud Drive) to ignore build output.
#
# The project lives under ~/Documents, so iCloud syncs it. Build directories
# churn thousands of files, which is what produces conflict copies like "app 2"
# and "chunks 3" — and one of those under src/app breaks the Next build with a
# routing error that never mentions iCloud.
#
# Safe to re-run; safe to run on a machine without iCloud (the xattr is inert).
set -euo pipefail

# The directories are created if missing: `next build` deletes and recreates
# .next, which drops the attribute, so this has to run before each build rather
# than once per clone.
# Only long-lived directories. `.next` is deliberately absent: `next build`
# deletes and recreates it, and doing that inside a file-provider-ignored
# directory made the build hang at 0% CPU with nothing written. Keeping .next
# out of iCloud is handled by .gitignore plus check:icloud instead.
for dir in node_modules .lighthouseci playwright-report test-results; do
  mkdir -p "$dir"
  xattr -w 'com.apple.fileprovider.ignore#P' 1 "$dir" 2>/dev/null \
    && echo "shielded  $dir" \
    || echo "skipped   $dir (xattr unavailable — not macOS?)"
done
