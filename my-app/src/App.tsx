import React, { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import Row from './components/Row';
import TableBody from './components/TableBody';
import LeagueInfo from './components/LeagueInfo';
import StandingsLegend from './components/StandingsLegend';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import TeamDetail from './components/TeamDetail';
import { useTheme } from './hooks/useTheme';
import { useStandings } from './hooks/useStandings';
import { fetchTeam, fetchScorers } from './api/footballApi';
import type { ScorerEntry, TeamInfo } from './types';
import { DEFAULT_SEASON, LEAGUES, SEASON_OPTIONS } from './constants/leagues';

const App: React.FC = () => {
  const [leagueId, setLeagueId] = React.useState('PL');
  const [season, setSeason] = React.useState(DEFAULT_SEASON);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [teamDetailLoading, setTeamDetailLoading] = useState(false);
  const [teamDetailError, setTeamDetailError] = useState<string | null>(null);
  const [scorersCache, setScorersCache] = useState<Record<string, ScorerEntry[]>>({});
  const { isDarkMode, toggleTheme } = useTheme();
  const { leagueName, standings, isLoading, error, retry } = useStandings(leagueId, season);

  const handleLeagueClick = useCallback((id: string) => {
    setLeagueId(id);
  }, []);

  const handleTeamNameClick = useCallback(async (teamId: number) => {
    setSelectedTeam(null);
    setTeamDetailError(null);
    setTeamDetailLoading(true);
    const result = await fetchTeam(teamId);
    setTeamDetailLoading(false);
    if (result.error) {
      setTeamDetailError(result.error);
      return;
    }
    if (result.data) setSelectedTeam(result.data);
  }, []);

  const handleCloseTeamDetail = useCallback(() => {
    setSelectedTeam(null);
    setTeamDetailError(null);
  }, []);

  const handleVisitWebsiteFromDetail = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Lock body scroll without shifting the visual viewport (keeps the modal centered on mobile)
  React.useEffect(() => {
    const open = selectedTeam !== null || teamDetailLoading || teamDetailError !== null;
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.overflow = 'hidden';
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    return () => {
      style.overflow = '';
      style.position = '';
      style.top = '';
      style.left = '';
      style.right = '';
      style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [selectedTeam, teamDetailLoading, teamDetailError]);

  // Load scorers for current league/season when team detail is open (for top scorer)
  React.useEffect(() => {
    if (!selectedTeam || !leagueId || !season) return;
    const key = `${leagueId}-${season}`;
    if (scorersCache[key]) return;
    fetchScorers(leagueId, season).then((res) => {
      if (res.data) setScorersCache((c) => ({ ...c, [key]: res.data! }));
    });
  }, [selectedTeam, leagueId, season, scorersCache]);

  const topScorerForSelected = useMemo(() => {
    if (!selectedTeam) return null;
    const key = `${leagueId}-${season}`;
    const list = scorersCache[key];
    if (!list?.length) return null;
    const entry = list.find((s) => s.team.id === selectedTeam.id);
    return entry ? { name: entry.player.name, goals: entry.goals } : null;
  }, [selectedTeam, leagueId, season, scorersCache]);

  const leagueButtons = useMemo(
    () =>
      Object.entries(LEAGUES).map(([name, id]: [string, string], index: number) => (
        <Button
          key={id}
          handleClick={handleLeagueClick}
          leagueId={id}
          text={name}
          isActive={leagueId === id}
          animationDelay={index}
        />
      )),
    [leagueId, handleLeagueClick]
  );

  const tableRows = useMemo(() => {
    if (!standings) return null;
    return standings.map((item) => (
      <Row
        key={item.team.id}
        position={item.position}
        crest={item.team.crest}
        teamName={item.team.name}
        teamId={item.team.id}
        onSelectTeam={handleTeamNameClick}
        playedGames={item.playedGames}
        wins={item.won}
        draws={item.draw}
        losses={item.lost}
        goalsFor={item.goalsFor}
        goalsAgainst={item.goalsAgainst}
        goalDifference={item.goalDifference}
        points={item.points}
      />
    ));
  }, [standings, handleTeamNameClick]);

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">⚠️ Error Loading Data</div>
          <p className="error-detail">{error}</p>
          <button type="button" onClick={retry} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root fade-in">
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      <div className="container">
        <div className="hero slide-in-left">
          <h1 className="title">{process.env.REACT_APP_APP_NAME || 'Football Standings'}</h1>
          <p className="subtitle">Live football standings</p>
        </div>

        <Header>
          <div className="season-section slide-in-right animate-delay-1">
            <h3 className="season-heading">Select Season</h3>
            <div className="season-buttons">
              {SEASON_OPTIONS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSeason(year)}
                  className={`season-button ${season === year ? 'active' : ''}`}
                  aria-pressed={season === year}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="scale-in animate-delay-2 league-buttons-wrap">{leagueButtons}</div>
        </Header>

        <div className="content">
          {isLoading ? (
            <div
              className="loading-wrap bounce-in"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="loading-spinner" aria-hidden />
              <span className="loading-text">Loading standings...</span>
            </div>
          ) : (
            <div className="standings-wrap fade-in animate-delay-3">
              <LeagueInfo leagueCaption={leagueName} season={season} />
              <StandingsLegend />
              {standings && standings.length > 0 ? (
                <TableBody>{tableRows}</TableBody>
              ) : (
                <p className="empty-standings" role="status">
                  No standings for this league and season.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <TeamDetail
        team={selectedTeam}
        loading={teamDetailLoading}
        error={teamDetailError}
        topScorer={topScorerForSelected}
        onClose={handleCloseTeamDetail}
        onVisitWebsite={handleVisitWebsiteFromDetail}
      />
    </div>
  );
};

export default App;
