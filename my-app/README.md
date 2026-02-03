# European Football League Standings

A React app that shows live standings for top European football leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Eredivisie). Built with Create React App and TypeScript.

## Features

- **Live standings** – View tables for multiple leagues and seasons
- **Dark / light theme** – Toggle with system preference support and persistence
- **Responsive layout** – Works on mobile and desktop
- **Performance** – Memoized components, data-driven rendering, CSS variables for theming

## Prerequisites

- Node.js (v16+)
- A [Football Data API](https://www.football-data.org/) token (free tier available)

## Setup

1. **Clone and install**

   ```bash
   cd my-app
   npm install
   ```

2. **Configure environment**

   - **Local dev with Netlify** (recommended): run `netlify dev` so the app and the standings proxy function run together. Set `FOOTBALL_API_TOKEN` and optionally `FOOTBALL_API_URL` in a `.env` file (see `.env.example`).
   - **Local dev with `npm start` only**: create `.env` and set `REACT_APP_STANDINGS_API_URL` to your deployed site (e.g. `https://euleague.netlify.app`) so the app calls that site’s function. No token in the client.

3. **Run the app**

   ```bash
   npm start
   ```

   Or use Netlify CLI for full local parity:

   ```bash
   netlify dev
   ```

   Open [http://localhost:3000](http://localhost:3000) (or the URL shown by `netlify dev`).

## Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm start`    | Run dev server at :3000       |
| `npm test`     | Run tests (watch mode)        |
| `npm run build`| Production build in `build/`  |
| `npm run eject`| Eject from Create React App   |

## Project structure

```
src/
├── api/
│   └── footballApi.ts     # API config & fetchStandings()
├── constants/
│   └── leagues.ts        # LEAGUES map, SEASON_OPTIONS
├── hooks/
│   ├── useStandings.ts   # Standings data, loading, error, retry
│   └── useTheme.ts       # Theme state & localStorage
├── components/
│   ├── Button.tsx        # League selector button
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LeagueInfo.tsx    # League logo & title
│   ├── Row.tsx           # Standings table row
│   ├── TableBody.tsx     # Standings table wrapper
│   └── ThemeToggle.tsx
├── types/
│   └── index.ts          # API & component types
├── App.tsx
├── index.css             # Global styles, CSS variables, theme
└── index.tsx
```

## Tech stack

- **React 19** with TypeScript
- **Create React App** (react-scripts)
- **CSS** – Custom properties for theming, no UI framework

## Deployment (Netlify)

1. Build with `npm run build`; Netlify will run this and publish the `build/` folder.
2. **Set environment variables in the Netlify dashboard** (Site → Environment variables):
   - `FOOTBALL_API_TOKEN` – Your [Football Data API](https://www.football-data.org/) token (required for standings).
   - `FOOTBALL_API_URL` – Optional; default is `https://api.football-data.org/v4`.

The app uses a **Netlify serverless function** (`netlify/functions/standings.js`) to call the Football Data API. The token is only used on the server, so CORS and “Failed to fetch” from the browser are avoided. See `DEPLOYMENT.md` and `netlify.toml` for more.

## Learn more

- [Create React App docs](https://facebook.github.io/create-react-app/docs/getting-started)
- [Football Data API](https://www.football-data.org/documentation/quickstart)
