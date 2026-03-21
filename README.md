# World Conquest

Static browser game prototype with a small, dependency-free app structure.

## Run locally

Serve the repo root with any static file server:

```bash
npx serve .
```

Then open the local address in your browser, for example `http://localhost:3000`.

## Layout

- `index.html` contains the page shell and script loading order.
- `css/app.css` contains the application styles.
- `js/data/` holds static datasets.
- `js/core/` holds shared configuration and cross-layer rules.
- `js/systems/` holds game rules, state, AI, and simulation logic.
- `js/presentation/` holds Leaflet and DOM rendering logic.
- `js/app/` holds bootstrap code and the cross-layer controller.

## Runtime dependency flow

`data -> core -> systems -> presentation -> app`

This repo still runs as ordered browser globals rather than ES modules or a bundler. Keep the script order in `index.html` aligned with that dependency flow.

Shared gameplay rules that affect both the engine and UI should live in `js/core/` so there is one source of truth for costs, durations, labels, and similar constants.

## External runtime dependencies

- Leaflet from `unpkg.com`
- World map tiles from Carto
- GeoJSON country borders from GitHub raw URLs
