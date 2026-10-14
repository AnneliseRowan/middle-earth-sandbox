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

Quotes and characters come from [The One API](https://the-one-api.dev). Books and chapters work without a key; quotes and characters need a free token.

```bash
# local
echo "VITE_ONE_API_KEY=your-token" > .env

# deployed site
gh secret set VITE_ONE_API_KEY
```

Without a token the site falls back to a built-in set of quotes and the Fellowship roster. Responses are cached in `sessionStorage` to stay under the 100 requests / 10 minutes rate limit.

## Pendo

Set your API key at the top of `public/pendo.js`. Until it's set, the snippet skips loading Pendo.

## Develop

```bash
nvm use        # Node 22
npm install
npm run dev    # http://localhost:5173/middle-earth-sandbox/
```

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`. The build copies `index.html` to `404.html` so deep links like `/fellowship` survive a refresh.
