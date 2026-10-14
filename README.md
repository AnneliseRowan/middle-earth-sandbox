# Middle-earth Sandbox 💍

A small Lord of the Rings–themed React app for practicing Pendo page and feature tagging.

**Live:** https://anneliserowan.github.io/middle-earth-sandbox/

## Pages

| Route         | What's there                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| `/`           | Hero CTAs, second-breakfast counter, book & random-chapter picker            |
| `/fellowship` | Recruit buttons for the nine walkers, race filter, random character spotlight |
| `/journey`    | Travel buttons from Bag End to Mount Doom, progress bar                      |
| `/council`    | Form with text input, selects, oath checkbox, validation, confirmation      |
| `/ring`       | "Put on the Ring" toggle, Mount Doom confirmation modal                      |

Every interactive element has a stable `id` (e.g. `#recruit-gandalf`, `#cast-ring-btn`) for clean feature tagging.

A quote banner on every page rotates every 15 seconds.

## Live data: The One API

Data comes from [The One API](https://the-one-api.dev). Books and chapters are fetched live from the browser (no key needed).

Quotes and characters need a free token, so they're fetched **at build time** by `scripts/fetch-lore.mjs` and baked into `public/lore.json`. The token never ships to the browser.

```bash
# local
ONE_API_KEY=your-token node scripts/fetch-lore.mjs

# deployed site (used by the GitHub Actions build)
gh secret set ONE_API_KEY
```

Without `lore.json` the site falls back to a built-in set of quotes and the Fellowship roster.

## Pendo

Set your API key at the top of `public/pendo.js`. Until it's set, the snippet skips loading Pendo.

## Develop

```bash
nvm use        # Node 22
npm install
npm run dev    # http://localhost:5173/middle-earth-sandbox/
```

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`. The build copies `index.html` to `404.html` so deep links like `/fellowship` survive a refresh.
