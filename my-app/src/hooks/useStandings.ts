import { useState, useEffect, useCallback } from 'react';
import type { Standing } from '../types';
import { fetchStandings } from '../api/footballApi';

export function useStandings(leagueId: string, season: string) {
  const [leagueName, setLeagueName] = useState('');
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchStandings(leagueId, season);
      if (result.error) {
        setError(result.error);
        setStandings(null);
      } else {
        setLeagueName(result.data!.competition.name);
        setStandings(result.data!.standings[0].table);
      }
    } finally {
      setIsLoading(false);
    }
  }, [leagueId, season]);

  useEffect(() => {
    load();
  }, [load]);

  return { leagueName, standings, isLoading, error, retry: load };
}
