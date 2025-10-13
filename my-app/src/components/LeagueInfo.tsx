import React from 'react';
import { LeagueInfoProps } from '../types';

const LeagueInfo: React.FC<LeagueInfoProps> = ({ leagueCaption, season = '2024' }) => {
    const getLeagueLogo = (leagueName: string): string => {
        const logoPath = (() => {
            switch (leagueName) {
                case "Bundesliga":
                    return '/Bundesliga.png';
                case "Eredivisie":
                    return '/Eredivisie.png';
                case "Primera Division":
                    return '/LaLiga.png';
                case "Ligue 1":
                    return '/Ligue1.png';
                case "Premier League":
                    return '/PremierLeague.png';
                case "Serie A":
                    return '/SerieA.png';
                default:
                    return '/LaLiga.png';
            }
        })();
        
        console.log(`Loading logo for ${leagueName}: ${logoPath}`);
        return logoPath;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div className="league-logo">
                <img 
                    src={getLeagueLogo(leagueCaption)} 
                    alt={`${leagueCaption} logo`}
                    onError={(e) => {
                        // Fallback to a generic football icon if image fails to load
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmM2Y0ZjYiLz4KPHBhdGggZD0iTTMyIDE2QzQzLjA0NTcgMTYgNTIgMjQuOTU0MyA1MiAzNlM0My4wNDU3IDU2IDMyIDU2UzEyIDQ3LjA0NTcgMTIgMzZTMjAuOTU0MyAxNiAzMiAxNloiIGZpbGw9IiMwMjg0YzciLz4KPHBhdGggZD0iTTMyIDI0QzM3LjUyMjggMjQgNDIgMjguNDc3MiA0MiAzNFMzNy41MjI4IDQ0IDMyIDQ0UzIyIDM5LjUyMjggMjIgMzRTMjYuNDc3MiAyNCAzMiAyNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
                    }}
                />
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{leagueCaption}</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{season}-{String(parseInt(season) + 1).slice(-2)} Season</p>
        </div>
    );
};

export default LeagueInfo;