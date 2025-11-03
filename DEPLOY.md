# Deploying to GitHub Pages

This document explains how to update the GitHub Pages site at https://bradleymatera.github.io/leaf-js/

## Automatic Deployment (Recommended)

Once this PR is merged to the `main` branch, GitHub Actions will automatically build and deploy the site. No manual steps are needed.

The workflow is configured in `.github/workflows/deploy.yml` and will:
1. Install dependencies
2. Build the project (`npm run build`)
3. Deploy the `dist` folder to the `gh-pages` branch

## Manual Deployment (If Needed)

If you need to deploy manually before merging to main, you can use the provided script:

```bash
./deploy-gh-pages.sh
```

Or deploy manually with these steps:

```bash
# 1. Build the project
npm run build

# 2. Checkout gh-pages branch
git checkout gh-pages

# 3. Copy built files
rm -rf assets index.html
cp dist/index.html .
cp -r dist/assets .

# 4. Commit and push
git add -A
git commit -m "Deploy updated site"
git push origin gh-pages

# 5. Return to your branch
git checkout main
```

## What Changed

The old GitHub Pages site had:
- Elaborate UI with shape selector
- Tailwind CSS styling
- Multiple shape options (triangle, square, pentagon, diamond, hexagon)

The new site has:
- Simple "test" heading
- Basic WebGPU triangle demo
- Minimal styling

This update ensures the deployed site matches the current source code in the repository.

## Configuration

The `vite.config.ts` is configured with `base: '/leaf-js/'` to ensure assets load correctly on GitHub Pages.
