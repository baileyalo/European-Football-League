import type { StandingsResponse } from '../types';

/** Base URL for standings API. Same origin on Netlify; set REACT_APP_STANDINGS_API_URL for local dev (e.g. your deployed site URL). */
function getStandingsBaseUrl(): string {
  if (typeof process.env.REACT_APP_STANDINGS_API_URL === 'string' && process.env.REACT_APP_STANDINGS_API_URL) {
    return process.env.REACT_APP_STANDINGS_API_URL.replace(/\/$/, '');
  }
  return '';
}

export async function fetchStandings(
  leagueId: string,
  season: string
): Promise<{ data: StandingsResponse; error: null } | { data: null; error: string }> {
  const base = getStandingsBaseUrl();
  const url = `${base}/.netlify/functions/standings?leagueId=${encodeURIComponent(leagueId)}&season=${encodeURIComponent(season)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof body?.error === 'string' ? body.error : response.status === 500 ? 'Server configuration error' : `Request failed (${response.status})`;
      return { data: null, error: message };
    }

    const data = body as StandingsResponse;
    if (!data?.standings?.[0]?.table) {
      return { data: null, error: 'Invalid data structure received' };
    }

    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch';
    return { data: null, error: message };
  }
}
