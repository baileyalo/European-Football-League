import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import Row from './components/Row';
import TableBody from './components/TableBody';
import LeagueInfo from './components/LeagueInfo';
import ThemeToggle from './components/ThemeToggleNew';
import Footer from './components/Footer';
import { StandingsResponse, League, Standing } from './types';

const App: React.FC = () => {
  const [leagueName, setLeagueName] = useState<string>('Premier League');
  const [rows, setRows] = useState<React.ReactElement[]>([]);
  const [leagueId, setLeagueId] = useState<string>('PL');
  const [season, setSeason] = useState<string>(process.env.REACT_APP_CURRENT_SEASON || '2024');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const leagues: League = {
    'La Liga': 'PD',
    'Premier League': 'PL',
    'Eredivisie': 'DED',
    'Ligue 1': 'FL1',
    'Bundesliga': 'BL1',
    'Serie A': 'SA',
  };

  const handleLeagueClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const newId = e.currentTarget.getAttribute('data-leagueid');
    if (newId) {
      setLeagueId(newId);
    }
  }, []);

  const handleSeasonChange = useCallback((newSeason: string) => {
    setSeason(newSeason);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Get configuration from environment variables
    const token = process.env.REACT_APP_FOOTBALL_API_TOKEN;
    const apiBaseUrl = process.env.REACT_APP_FOOTBALL_API_URL;
    
    if (!token || !apiBaseUrl) {
      setError('API configuration missing. Please check environment variables.');
      setIsLoading(false);
      return;
    }
    
    // Using multiple CORS proxy services for reliability
    const corsProxies = [
      process.env.REACT_APP_CORS_PROXY_1,
      process.env.REACT_APP_CORS_PROXY_2,
      process.env.REACT_APP_CORS_PROXY_3
    ].filter(Boolean); // Remove any undefined values
    
    const apiUrl = `${apiBaseUrl}/competitions/${leagueId}/standings?season=${season}`;
    
    let lastError: Error | null = null;
    
    // Try each proxy until one works
    for (const proxy of corsProxies) {
      try {
        const url = `${proxy}${encodeURIComponent(apiUrl)}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Auth-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('API access forbidden. Please check your API token.');
          } else if (response.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
          } else if (response.status === 404) {
            throw new Error('League data not found for the current season.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StandingsResponse = await response.json();
        
        console.log(data);
        // Check if we have valid standings data
        if (!data.standings || !data.standings[0] || !data.standings[0].table) {
          throw new Error('Invalid data structure received from API');
        }
        
        const newRows = data.standings[0].table.map((item: Standing, index: number) => {
        const {
          position,
          playedGames,
          won,
          draw,
          lost,
          goalsFor,
          goalsAgainst,
          goalDifference,
          points,
        } = item;
        const { crest, name } = item.team;
        return (
          <Row
            key={index}
            position={position}
            crest={crest}
            teamName={name}
            playedGames={playedGames}
            wins={won}
            draws={draw}
            losses={lost}
            goalsFor={goalsFor}
            goalsAgainst={goalsAgainst}
            goalDifference={goalDifference}
            points={points}
          />
        );
      });

        setLeagueName(data.competition.name);
        setRows(newRows);
        setIsLoading(false);
        return; // Success! Exit the function
        
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        console.warn(`Proxy ${proxy} failed:`, err);
        // Continue to next proxy
      }
    }
    
    // If all proxies failed, show error
    setError(lastError?.message || 'All CORS proxies failed. Please try again later.');
    setIsLoading(false);
  }, [leagueId, season]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const buttons = Object.entries(leagues).map(([name, id], index) => (
    <Button
      key={id}
      handleClick={handleLeagueClick}
      leagueId={id}
      text={name}
      isActive={leagueId === id}
      animationDelay={index}
    />
  ));

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">⚠️ Error Loading Data</div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={fetchData}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }} className="fade-in">
      {/* Theme toggle component */}
      <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="slide-in-left">
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            {process.env.REACT_APP_APP_NAME || 'European Football League'} Standings
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Live standings from top European leagues</p>
        </div>
        
        <Header>
          <div style={{ marginBottom: '1rem' }} className="slide-in-right animate-delay-1">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', textAlign: 'center' }}>
              Select Season
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '300px', margin: '0 auto' }}>
              {['2024', '2025'].map((year) => (
                <button
                  key={year}
                  onClick={() => handleSeasonChange(year)}
                  className="season-button"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: season === year ? '#0284c7' : '#f3f4f6',
                    color: season === year ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: season === year ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (season !== year) {
                      e.currentTarget.style.backgroundColor = '#e5e7eb';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (season !== year) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="scale-in animate-delay-2" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {buttons}
          </div>
        </Header>
        
        <div style={{ marginTop: '2rem' }}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }} className="bounce-in">
              <div className="loading-spinner"></div>
              <span style={{ marginLeft: '0.75rem', color: '#6b7280' }}>Loading standings...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in animate-delay-3">
              <LeagueInfo leagueCaption={leagueName} season={season} />
              <TableBody>{rows}</TableBody>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
