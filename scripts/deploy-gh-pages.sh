#!/usr/bin/env bash
#GitHub Pages

set -e

echo "🚀 starting to push to GitHub Pages..."

# push
# npm run build

# push to gh-pages branch
npx gh-pages -d . -b gh-pages --git git

echo "✅ pushed!"
