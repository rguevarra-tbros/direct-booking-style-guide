# direct-booking-style-guide

Brand guide for the Kasu direct booking portfolio (Kasu Resorts, Padel House, Pickle House, SET HOUSE, OURS), published as a static GitHub Pages site.

## Structure

- `index.html`: every guide page; the URL hash picks which one shows
- `js/brands.js`: all brand data (palettes, copy, status, asset paths), the single source of truth
- `js/app.js`: routing, brand switching, and rendering
- `css/styles.css`: shared styles that use semantic tokens only, plus scoped brand layers at the end
- `assets/logos/`: approved logo vectors (see its README for file names)

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish

Settings → Pages → Deploy from branch → `main` / root. There is no build step.
