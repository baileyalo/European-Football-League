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

   Copy the example env file and add your API token and optional settings:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set at least:

   - `REACT_APP_FOOTBALL_API_TOKEN` – Your [Football Data API](https://www.football-data.org/) token
   - `REACT_APP_FOOTBALL_API_URL` – Usually `https://api.football-data.org/v4`
   - One or more CORS proxy URLs (`REACT_APP_CORS_PROXY_1`, etc.) if the API is called from the browser

   See `.env.example` for all options (app name, season, proxies).

3. **Run the app**

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000).

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

## Deployment

The app is a static SPA. Build with `npm run build` and serve the `build/` folder. See `DEPLOYMENT.md` and `netlify.toml` for Netlify.

## Learn more

- [Create React App docs](https://facebook.github.io/create-react-app/docs/getting-started)
- [Football Data API](https://www.football-data.org/documentation/quickstart)
