import type { League } from '../types';

export const LEAGUES: League = {
  'La Liga': 'PD',
  'Premier League': 'PL',
  Eredivisie: 'DED',
  'Ligue 1': 'FL1',
  Bundesliga: 'BL1',
  'Serie A': 'SA',
} as const;

export const SEASON_OPTIONS = ['2024', '2025', '2026'] as const;

export const DEFAULT_SEASON: (typeof SEASON_OPTIONS)[number] = '2026';

/** Logos keyed by the competition name returned by the Football Data API. */
export const LEAGUE_LOGOS: Record<string, string> = {
  Bundesliga: '/Bundesliga.png',
  Eredivisie: '/Eredivisie.png',
  'Primera Division': '/LaLiga.png',
  'Ligue 1': '/Ligue1.png',
  'Premier League': '/PremierLeague.png',
  'Serie A': '/SerieA.png',
};

export const DEFAULT_LEAGUE_LOGO = '/LaLiga.png';
