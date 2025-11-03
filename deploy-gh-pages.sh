#!/bin/bash
# Script to manually deploy to gh-pages
# This is a one-time fix until the GitHub Actions workflow runs on main

set -e

echo "Building the project..."
npm run build

echo "Deploying to gh-pages..."

# Save current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Checkout gh-pages
git fetch origin gh-pages:gh-pages 2>/dev/null || git checkout --orphan gh-pages
git checkout gh-pages

# Remove old files
rm -rf assets dist index.html

# Copy new build
cp dist/index.html .
cp -r dist/assets .

# Add .gitignore
echo "node_modules" > .gitignore

# Commit and push
git add -A
git commit -m "Deploy updated site from $CURRENT_BRANCH"
git push origin gh-pages

# Go back to original branch
git checkout $CURRENT_BRANCH

echo "Deployment complete! The site should update in a few minutes."
