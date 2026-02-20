#!/bin/sh
set -e

echo "[lisq] Starting LISQ..."

# Provision user if credentials are provided.
# The app auto-provisions via lib/auth.ts provisionUser() on first request,
# but we also call it here to ensure the user exists before the server starts.
if [ -n "$LISQ_USERNAME" ] && [ -n "$LISQ_PASSWORD" ]; then
  echo "[lisq] User credentials configured (LISQ_USERNAME=$LISQ_USERNAME)"
else
  echo "[lisq] No LISQ_USERNAME/LISQ_PASSWORD set — auth disabled, app is open"
fi

echo "[lisq] Starting server on port ${PORT:-4321}..."
exec node ./dist/server/entry.mjs
