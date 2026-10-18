import React from 'react';
import { LeagueInfoProps } from '../types';
import { DEFAULT_LEAGUE_LOGO, LEAGUE_LOGOS } from '../constants/leagues';

const FALLBACK_CREST =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmM2Y0ZjYiLz4KPHBhdGggZD0iTTMyIDE2QzQzLjA0NTcgMTYgNTIgMjQuOTU0MyA1MiAzNlM0My4wNDU3IDU2IDMyIDU2UzEyIDQ3LjA0NTcgMTIgMzZTMjAuOTU0MyAxNiAzMiAxNloiIGZpbGw9IiMwMjg0YzciLz4KPHBhdGggZD0iTTMyIDI0QzM3LjUyMjggMjQgNDIgMjguNDc3MiA0MiAzNFMzNy41MjI4IDQ0IDMyIDQ0UzIyIDM5LjUyMjggMjIgMzRTMjYuNDc3MiAyNCAzMiAyNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';

const LeagueInfo: React.FC<LeagueInfoProps> = React.memo(({ leagueCaption, season = '2026' }) => {
  const year = parseInt(season, 10);
  const seasonLabel = Number.isNaN(year) ? season : `${season}-${String(year + 1).slice(-2)}`;

  return (
    <div className="league-info">
      <div className="league-logo">
        <img
          src={LEAGUE_LOGOS[leagueCaption] || DEFAULT_LEAGUE_LOGO}
          alt={`${leagueCaption} logo`}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_CREST;
          }}
        />
      </div>
      <h2 className="league-info-title">{leagueCaption}</h2>
      <p className="league-info-season">{seasonLabel} Season</p>
    </div>
  );
});
LeagueInfo.displayName = 'LeagueInfo';

export default LeagueInfo;
