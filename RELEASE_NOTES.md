# Release notes

## 1.0.1 — 18 October 2026

First public release of Football Standings.

### Standings

- Live tables for the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, and Eredivisie.
- Seasons 2024, 2025, and 2026. The app opens on 2026.
- Color key for Champions League, Europa League, and relegation places.
- Empty leagues show a clear message instead of a blank table.

### Team details

- Tap a team name to open stadium, coach, squad, and that team’s top scorer.
- Visit the club website from the sheet. Teams with no site show “No website available.”
- A failed team lookup stays in the sheet. Escape closes it, and the page does not scroll behind it.

### Phones and tablets

- Layout fits iPhone, Android phones, and tablets, including landscape and the home-indicator safe area.
- League choices stay large enough to tap. Position and team name stay visible while the rest of the table scrolls.
- Team details are a small centered card on a phone and a wider card on a tablet.

### App

- The app is named Football Standings.
- Light and dark theme, with the choice remembered.
- Local `npm start` loads standings through the dev server, so the browser is not blocked by cross-origin requests.
- Tests run on every push to `main` and on every pull request into `main`.
