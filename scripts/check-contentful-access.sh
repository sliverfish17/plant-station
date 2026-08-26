#!/usr/bin/env bash
# Verify a Contentful space ID and management token before running a migration.
#
# "The provided space does not exist or you do not have access" covers several
# different mistakes, and the migration tool cannot tell them apart. This can:
# it separates a bad token from a wrong space id from a token that is valid but
# belongs to a different organisation.
#
#   CONTENTFUL_SPACE_ID=xxx CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxx npm run contentful:check
#
# Nothing secret is printed.
set -uo pipefail

SPACE="${CONTENTFUL_SPACE_ID:-}"
TOKEN="${CONTENTFUL_MANAGEMENT_TOKEN:-}"

fail() { printf '\n\033[31m✗\033[0m %s\n' "$1"; exit 1; }
ok()   { printf '\033[32m✓\033[0m %s\n' "$1"; }

[ -n "$TOKEN" ] || fail "CONTENTFUL_MANAGEMENT_TOKEN is not set.
  Settings → API keys → Content management tokens → Generate personal token."

[ -n "$SPACE" ] || fail "CONTENTFUL_SPACE_ID is not set.
  Settings → General settings, or read it out of the browser URL:
  app.contentful.com/spaces/THIS-PART/..."

# A management token is a personal access token and always starts with CFPAT-.
# A Delivery token does not, and is the single most common thing to paste here.
case "$TOKEN" in
  CFPAT-*) ok "Token looks like a management token" ;;
  *) fail "That is not a management token — it does not start with CFPAT-.
  You have most likely pasted the Content Delivery token, which can read
  content but cannot create content types.
  Get the right one at: Settings → API keys → Content management tokens." ;;
esac

status=$(curl -s -o /tmp/contentful-check.json -w '%{http_code}' \
  -H "Authorization: Bearer $TOKEN" \
  "https://api.contentful.com/spaces/$SPACE")

case "$status" in
  200)
    name=$(python3 -c "import json;print(json.load(open('/tmp/contentful-check.json'))['name'])" 2>/dev/null || echo '?')
    ok "Token can reach space \"$name\" ($SPACE)"
    printf '\nReady. Run the migration:\n\n'
    printf '  npx contentful-migration@latest \\\n'
    printf '    --space-id %s \\\n' "$SPACE"
    printf '    --environment-id "${CONTENTFUL_ENVIRONMENT:-master}" \\\n'
    printf '    --access-token "$CONTENTFUL_MANAGEMENT_TOKEN" \\\n'
    printf '    contentful/migrations/001-initial-content-model.cjs\n\n'
    ;;
  401)
    fail "The token was rejected (401). It is expired, revoked, or mistyped.
  Generate a fresh one at: Settings → API keys → Content management tokens."
    ;;
  404)
    printf '\n\033[31m✗\033[0m Space "%s" is not visible to this token (404).\n' "$SPACE"
    printf '\n  Either the space id is wrong, or the token belongs to a different\n'
    printf '  organisation. Spaces this token *can* reach:\n\n'
    curl -s -H "Authorization: Bearer $TOKEN" 'https://api.contentful.com/spaces?limit=100' \
      | python3 -c "
import json, sys
try:
    items = json.load(sys.stdin).get('items', [])
except Exception:
    items = []
if not items:
    print('    (none — this token has no spaces, so it is probably from another account)')
for s in items:
    print(f\"    {s['sys']['id']}  {s['name']}\")
" 2>/dev/null || printf '    (could not list spaces)\n'
    printf '\n'
    exit 1
    ;;
  *)
    fail "Unexpected response from Contentful (HTTP $status)."
    ;;
esac
