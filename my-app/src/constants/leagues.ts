import type { League } from '../types';

export const LEAGUES: League = {
  'La Liga': 'PD',
  'Premier League': 'PL',
  'Eredivisie': 'DED',
  'Ligue 1': 'FL1',
  'Bundesliga': 'BL1',
  'Serie A': 'SA',
} as const;

export const SEASON_OPTIONS = ['2024', '2025'] as const;
