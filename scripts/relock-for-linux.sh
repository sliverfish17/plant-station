#!/usr/bin/env bash
# Regenerate package-lock.json with the Linux entries CI needs.
#
# npm records platform-specific optional dependencies for the platform it runs
# on. Running `npm install` on macOS prunes the Linux-only ones — currently the
# @emnapi packages that @tailwindcss/oxide-wasm32-wasi needs — and `npm ci` then
# fails on the runner with "Missing: @emnapi/runtime from lock file" while
# working perfectly on the machine that produced the lockfile.
#
# Run this after any dependency change, and commit the result.
set -euo pipefail

command -v docker >/dev/null || { echo "Docker is required."; exit 1; }

docker run --rm --platform linux/amd64 \
  -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD":/app -w /app \
  node:22-bookworm-slim \
  npm install --package-lock-only --no-audit --no-fund

echo "package-lock.json regenerated for linux/amd64 — commit it."
