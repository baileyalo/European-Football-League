# European Football League Standings

A React app that shows live standings for top European football leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Eredivisie). Built with Create React App and TypeScript.

## Features

- **Live standings** – View tables for multiple leagues and seasons
- **Visit team website** – Click “Website” next to a team to open their official site (fetched from Football Data API)
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
| `npm test -- --watchAll=false` | Run tests once (e.g. for CI) |
| `npm run build`| Production build in `build/`  |
| `npm run eject`| Eject from Create React App   |

## Project structure

```
src/
├── api/
│   └── footballApi.ts     # fetchStandings(), fetchTeam() (via Netlify functions)
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
│   ├── Row.tsx           # Standings table row (with Website button)
│   ├── TableBody.tsx     # Standings table wrapper
│   └── ThemeToggle.tsx
├── types/
│   └── index.ts          # API & component types
├── App.tsx
├── App.test.js           # App component tests
├── setupTests.js         # Jest setup (e.g. @testing-library/jest-dom)
├── index.css             # Global styles, CSS variables, theme
└── index.tsx
```

## Testing

Tests use **Jest** and **React Testing Library** (`@testing-library/react`, `@testing-library/user-event`). The `useTheme` and `useStandings` hooks and the `footballApi` module (`fetchStandings`, `fetchTeam`) are mocked so the app is tested without hitting the real API.

- **Setup:** `src/setupTests.js` imports `@testing-library/jest-dom` so matchers like `toBeInTheDocument()` and `toHaveTextContent()` are available.
- **Run tests:** From `my-app`, run `npm test` (watch mode) or `npm test -- --watchAll=false` for a single run (e.g. in CI).

### Test cases (`src/App.test.js`)

| Test | Description |
|------|-------------|
| Renders without crashing | App mounts and unmounts without errors (wrapped in `act()`). |
| Displays main title and subtitle | Main heading contains "Standings"; subtitle "Live standings from top European leagues" is present. |
| Shows loading state | When `useStandings` returns `isLoading: true`, "Loading standings..." is shown. |
| Shows error state with retry | When `useStandings` returns an `error`, error message and "Try Again" button are shown; clicking the button calls the retry handler. |
| Shows standings content when data is loaded | League name heading and team name from mock standings (e.g. "Team A") are displayed. |
| Renders league selection buttons | Premier League, La Liga, Bundesliga (and other league) buttons are present. |
| Renders season selection buttons | 2024 and 2025 season buttons are present. |
| Calls useStandings with initial league and season | Hook is invoked with default league id `'PL'` and current season string. |
| Displays Select Season heading | "Select Season" heading is rendered. |
| Website button per team and opens team website on click | Each team row has a "Website" button; clicking it calls `fetchTeam(teamId)` and opens the team website in a new tab (mocked in test). |

## Tech stack

- **React 19** with TypeScript
- **Create React App** (react-scripts)
- **Testing:** Jest, React Testing Library, @testing-library/jest-dom, @testing-library/user-event
- **CSS** – Custom properties for theming, no UI framework

## Deployment (Netlify)

1. Build with `npm run build`; Netlify will run this and publish the `build/` folder.
2. **Set environment variables in the Netlify dashboard** (Site → Environment variables):
   - `FOOTBALL_API_TOKEN` – Your [Football Data API](https://www.football-data.org/) token (required for standings).
   - `FOOTBALL_API_URL` – Optional; default is `https://api.football-data.org/v4`.

The app uses **Netlify serverless functions** to call the Football Data API:
- `netlify/functions/standings.js` – standings by league and season
- `netlify/functions/team.js` – team details (e.g. website) by team ID

The token is only used on the server, so CORS and “Failed to fetch” from the browser are avoided. See `DEPLOYMENT.md` and `netlify.toml` for more.

## Learn more

- [Create React App docs](https://facebook.github.io/create-react-app/docs/getting-started)
- [Football Data API](https://www.football-data.org/documentation/quickstart)
