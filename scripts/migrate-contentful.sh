#!/usr/bin/env bash
# Create the content model in Contentful, then label it.
#
# Reads credentials from the environment so there is nothing to paste into the
# middle of a long command — a placeholder left in by accident is otherwise
# reported as "Cannot find module '.../...'", which looks nothing like the
# mistake it was.
#
#   export CONTENTFUL_SPACE_ID=xxxx
#   export CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxxx
#   npm run contentful:migrate
#
# Full output is kept per run, and on failure the error lines are pulled out of
# it rather than being left to scroll past.
set -uo pipefail

SPACE="${CONTENTFUL_SPACE_ID:-}"
TOKEN="${CONTENTFUL_MANAGEMENT_TOKEN:-}"
ENVIRONMENT="${CONTENTFUL_ENVIRONMENT:-master}"
LOG_DIR="${TMPDIR:-/tmp}/contentful-migration"

bold()  { printf '\033[1m%s\033[0m\n' "$1"; }
ok()    { printf '\033[32m✓\033[0m %s\n' "$1"; }
warn()  { printf '\033[33m!\033[0m %s\n' "$1"; }
fail()  { printf '\n\033[31m✗\033[0m %s\n\n' "$1"; exit 1; }

# ── credentials ──────────────────────────────────────────────────────────────
[ -n "$SPACE" ] || fail "CONTENTFUL_SPACE_ID is not set. Run:
    export CONTENTFUL_SPACE_ID=your-space-id
  The id is in the browser URL: app.contentful.com/spaces/THIS-PART/..."

[ -n "$TOKEN" ] || fail "CONTENTFUL_MANAGEMENT_TOKEN is not set. Run:
    export CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-...
  Settings → API keys → Content management tokens → Generate personal token."

case "$TOKEN" in
  CFPAT-*) ;;
  *) fail "That token does not start with CFPAT-, so it is not a management token.
  The Content Delivery token sits on the same screen and cannot create content types." ;;
esac

# ── does the space answer? ───────────────────────────────────────────────────
status=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "Authorization: Bearer $TOKEN" \
  "https://api.contentful.com/spaces/$SPACE/environments/$ENVIRONMENT")

case "$status" in
  200) ok "Reached space $SPACE (environment: $ENVIRONMENT)" ;;
  401) fail "Contentful rejected the token (401). Generate a fresh one." ;;
  404) fail "No environment \"$ENVIRONMENT\" in space \"$SPACE\" (404).
  Either the space id is wrong or the token belongs to another organisation.
  Run 'npm run contentful:check' to list the spaces this token can reach." ;;
  *)   fail "Unexpected response from Contentful (HTTP $status)." ;;
esac

# ── is the space already populated? ──────────────────────────────────────────
existing=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.contentful.com/spaces/$SPACE/environments/$ENVIRONMENT/content_types?limit=100" \
  | python3 -c "
import json, sys
try:
    print(' '.join(t['sys']['id'] for t in json.load(sys.stdin).get('items', [])))
except Exception:
    print('')
" 2>/dev/null)

if [ -n "$existing" ]; then
  warn "This space already has content types: $existing"
  printf '  Step 1 creates them from scratch and will fail if they exist.\n'
  printf '  If a previous run got part-way, delete them in the Contentful UI\n'
  printf '  (Content model → each type → Delete) and run this again.\n'
  printf '  If they are complete and only the labels are missing, run just step 2:\n'
  printf '    npx contentful-migration@latest --yes --space-id "$CONTENTFUL_SPACE_ID" \\\n'
  printf '      --environment-id "%s" --access-token "$CONTENTFUL_MANAGEMENT_TOKEN" \\\n' "$ENVIRONMENT"
  printf '      contentful/migrations/002-field-help-text.cjs\n\n'
  printf 'Continue anyway? [y/N] '
  read -r answer
  case "$answer" in [yY]*) ;; *) fail "Stopped." ;; esac
fi

mkdir -p "$LOG_DIR"

# ── run one migration file, reporting properly if it fails ───────────────────
run_migration() {
  local file="$1" label="$2" log="$LOG_DIR/$(basename "$file" .cjs).log"

  bold "$label"
  npx --yes contentful-migration@latest --yes \
    --space-id "$SPACE" \
    --environment-id "$ENVIRONMENT" \
    --access-token "$TOKEN" \
    "$file" > "$log" 2>&1
  local code=$?

  if [ $code -eq 0 ]; then
    ok "$label — done"
    return 0
  fi

  printf '\n\033[31m✗\033[0m %s failed (exit %s)\n\n' "$label" "$code"
  printf '  Lines mentioning an error:\n\n'
  grep -niE 'error|failed|unsuccessful|429|rate.?limit|forbidden|denied|already exists' "$log" \
    | grep -viE 'TimeoutNegativeWarning' | head -20 | sed 's/^/    /'
  printf '\n  Last 10 lines:\n\n'
  tail -10 "$log" | sed 's/^/    /'
  printf '\n  Full log: %s\n\n' "$log"
  exit 1
}

run_migration contentful/migrations/001-initial-content-model.cjs "Step 1 of 2 · content model"
run_migration contentful/migrations/002-field-help-text.cjs "Step 2 of 2 · field labels"

printf '\n'
ok "Content model created and labelled."
printf '\nNext: regenerate the types against the real schema — this is the step that\n'
printf 'catches any difference between the schema snapshot and your actual space:\n\n'
printf '  CONTENTFUL_SCHEMA_FROM_API=1 npm run codegen\n'
printf '  npm run typecheck\n\n'
