# direct-booking-style-guide

Brand guide for the Kasu direct booking portfolio (Kasu Resorts, Padel House, Pickle House, SET HOUSE, OURS), published as a static GitHub Pages site.

## Structure

- `index.html`: every guide page; the URL hash picks which one shows
- `js/brands.js`: all brand data (palettes, copy, status, asset paths), the single source of truth
- `js/app.js`: routing, brand switching, and rendering
- `css/styles.css`: shared styles that use semantic tokens only, plus scoped brand layers at the end
- `assets/logos/`: approved logo vectors (see its README for file names)
- `tests/`: data checks for `js/brands.js` (Node's built-in test runner)
- `.github/workflows/ci-cd.yml`: lint, test, and deploy

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Checks

```bash
npm ci
npm run check
```

`npm run check` runs html-validate, Stylelint, ESLint, and the brand data tests in `tests/`. CI runs the same checks on every pull request.

## Publish

`.github/workflows/ci-cd.yml` deploys to GitHub Pages on every push to `main` once checks pass. One-time setup: Settings → Pages → Source → **GitHub Actions**.
