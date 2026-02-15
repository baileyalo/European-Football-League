import React, { useCallback, useMemo } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import Row from './components/Row';
import TableBody from './components/TableBody';
import LeagueInfo from './components/LeagueInfo';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { useStandings } from './hooks/useStandings';
import { fetchTeam } from './api/footballApi';
import { LEAGUES, SEASON_OPTIONS } from './constants/leagues';

const App: React.FC = () => {
  const [leagueId, setLeagueId] = React.useState('PL');
  const [season, setSeason] = React.useState(process.env.REACT_APP_CURRENT_SEASON || '2024');
  const { isDarkMode, toggleTheme } = useTheme();
  const { leagueName, standings, isLoading, error, retry } = useStandings(leagueId, season);

  const handleLeagueClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute('data-leagueid');
    if (id) setLeagueId(id);
  }, []);

  const handleVisitTeamWebsite = useCallback(async (teamId: number) => {
    const result = await fetchTeam(teamId);
    if (result.error) {
      alert(result.error);
      return;
    }
    if (result.data?.website) {
      window.open(result.data.website, '_blank', 'noopener,noreferrer');
    } else {
      alert('No website available for this team.');
    }
  }, []);

  const leagueButtons = useMemo(
    () =>
      Object.entries(LEAGUES).map(([name, id], index) => (
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
        onVisitWebsite={handleVisitTeamWebsite}
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
  }, [standings, handleVisitTeamWebsite]);

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
          <h1 className="title">
            {process.env.REACT_APP_APP_NAME || 'European Football League'} Standings
          </h1>
          <p className="subtitle">Live standings from top European leagues</p>
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
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="scale-in animate-delay-2 league-buttons-wrap">
            {leagueButtons}
          </div>
        </Header>

        <div className="content">
          {isLoading ? (
            <div className="loading-wrap bounce-in">
              <div className="loading-spinner" aria-hidden />
              <span className="loading-text">Loading standings...</span>
            </div>
          ) : (
            <div className="standings-wrap fade-in animate-delay-3">
              <LeagueInfo leagueCaption={leagueName} season={season} />
              <TableBody>{tableRows}</TableBody>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
