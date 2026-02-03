import type { StandingsResponse } from '../types';

const getConfig = () => {
  const token = process.env.REACT_APP_FOOTBALL_API_TOKEN;
  const apiBaseUrl = process.env.REACT_APP_FOOTBALL_API_URL;
  const corsProxies = [
    process.env.REACT_APP_CORS_PROXY_1,
    process.env.REACT_APP_CORS_PROXY_2,
    process.env.REACT_APP_CORS_PROXY_3,
  ].filter(Boolean) as string[];
  return { token, apiBaseUrl, corsProxies };
};

function getErrorMessage(status: number): string {
  if (status === 403) return 'API access forbidden. Please check your API token.';
  if (status === 429) return 'API rate limit exceeded. Please try again later.';
  if (status === 404) return 'League data not found for the current season.';
  return `HTTP error! status: ${status}`;
}

export async function fetchStandings(
  leagueId: string,
  season: string
): Promise<{ data: StandingsResponse; error: null } | { data: null; error: string }> {
  const { token, apiBaseUrl, corsProxies } = getConfig();

  if (!token || !apiBaseUrl) {
    return { data: null, error: 'API configuration missing. Please check environment variables.' };
  }

  const apiUrl = `${apiBaseUrl}/competitions/${leagueId}/standings?season=${season}`;
  let lastError: Error | null = null;

  for (const proxy of corsProxies) {
    try {
      const url = `${proxy}${encodeURIComponent(apiUrl)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Auth-Token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status));
      }

      const data: StandingsResponse = await response.json();

      if (!data.standings?.[0]?.table) {
        throw new Error('Invalid data structure received from API');
      }

      return { data, error: null };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown error');
    }
  }

  return {
    data: null,
    error: lastError?.message ?? 'All CORS proxies failed. Please try again later.',
  };
}
