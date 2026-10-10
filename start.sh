#!/bin/sh
set -eu
cd "$(dirname "$0")"
command -v node >/dev/null 2>&1 || { echo "Install Node.js 22 or newer."; exit 1; }
[ -f .env ] || cp .env.example .env
[ -d node_modules ] || npm ci --ignore-scripts
echo "Open http://localhost:3000 after the server starts."
echo "Configure a NEW SMTP_PASSWORD in .env to enable email submissions."
npm start
