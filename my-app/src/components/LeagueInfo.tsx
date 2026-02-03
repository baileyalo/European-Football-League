import React from 'react';
import { LeagueInfoProps } from '../types';

const LeagueInfo: React.FC<LeagueInfoProps> = React.memo(({ leagueCaption, season = '2024' }) => {
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
        return logoPath;
    };

    return (
        <div className="league-info">
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
            <h2 className="league-info-title">{leagueCaption}</h2>
            <p className="league-info-season">{season}-{String(parseInt(season, 10) + 1).slice(-2)} Season</p>
        </div>
    );
});
LeagueInfo.displayName = 'LeagueInfo';

export default LeagueInfo;