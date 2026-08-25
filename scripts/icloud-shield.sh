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

for dir in node_modules .next .lighthouseci playwright-report test-results; do
  [ -e "$dir" ] || continue
  xattr -w 'com.apple.fileprovider.ignore#P' 1 "$dir" 2>/dev/null \
    && echo "shielded  $dir" \
    || echo "skipped   $dir (xattr unavailable)"
done
