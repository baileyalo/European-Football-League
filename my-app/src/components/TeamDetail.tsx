import React, { useMemo, useEffect, useRef } from 'react';
import type { TeamInfo, SquadPlayer } from '../types';

const POSITION_ORDER: Record<string, number> = {
  Goalkeeper: 0,
  Defence: 1,
  Midfield: 2,
  Offence: 3,
};

function groupSquad(squad: SquadPlayer[]): { position: string; players: SquadPlayer[] }[] {
  const byPosition: Record<string, SquadPlayer[]> = {};
  squad.forEach((p) => {
    const pos = p.position || 'Other';
    if (!byPosition[pos]) byPosition[pos] = [];
    byPosition[pos].push(p);
  });
  return Object.entries(byPosition)
    .sort(([a], [b]) => (POSITION_ORDER[a] ?? 99) - (POSITION_ORDER[b] ?? 99))
    .map(([position, players]) => ({
      position,
      players: players.sort((a, b) => a.shirtNumber - b.shirtNumber),
    }));
}

export interface TopScorer {
  name: string;
  goals: number;
}

interface TeamDetailProps {
  team: TeamInfo | null;
  loading: boolean;
  topScorer: TopScorer | null;
  onClose: () => void;
  onVisitWebsite: (url: string) => void;
}

const TeamDetail: React.FC<TeamDetailProps> = ({
  team,
  loading,
  topScorer,
  onClose,
  onVisitWebsite,
}) => {
  const squadGroups = useMemo(
    () => (team?.squad?.length ? groupSquad(team.squad) : []),
    [team?.squad]
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!team && !loading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [team, loading, onClose]);

  useEffect(() => {
    if (loading) {
      sheetRef.current?.focus();
    } else if (team) {
      closeButtonRef.current?.focus();
    }
  }, [loading, team]);

  if (!team && !loading) return null;

  return (
    <div className="team-detail-overlay" role="dialog" aria-modal="true" aria-labelledby="team-detail-title">
      <div className="team-detail-backdrop" onClick={onClose} aria-hidden />
      <div className="team-detail-sheet" ref={sheetRef} tabIndex={-1}>
        {loading ? (
          <div className="team-detail-loading">
            <div className="loading-spinner" aria-hidden />
            <span className="loading-text">Loading team…</span>
          </div>
        ) : team ? (
          <>
            <div className="team-detail-header">
              {team.crest && (
                <div className="team-detail-crest">
                  <img src={team.crest} alt="" />
                </div>
              )}
              <h2 id="team-detail-title" className="team-detail-title">{team.name}</h2>
            </div>

            <div className="team-detail-meta">
              {team.venue && (
                <p className="team-detail-row">
                  <span className="team-detail-label">Stadium</span>
                  <span className="team-detail-value">{team.venue}</span>
                </p>
              )}
              {team.coach?.name && (
                <p className="team-detail-row">
                  <span className="team-detail-label">Coach</span>
                  <span className="team-detail-value">{team.coach.name}</span>
                </p>
              )}
              {topScorer && (
                <p className="team-detail-row">
                  <span className="team-detail-label">Top scorer</span>
                  <span className="team-detail-value">{topScorer.name} ({topScorer.goals} goals)</span>
                </p>
              )}
            </div>

            {squadGroups.length > 0 && (
              <div className="team-detail-squad">
                <h3 className="team-detail-squad-title">Squad</h3>
                <div className="team-detail-squad-scroll">
                  {squadGroups.map(({ position, players }) => (
                    <div key={position} className="team-detail-squad-group">
                      <div className="team-detail-squad-position">{position}</div>
                      <ul className="team-detail-squad-list">
                        {players.map((player) => (
                          <li key={`${player.name}-${player.shirtNumber}`} className="team-detail-squad-item">
                            <span className="team-detail-squad-number">#{player.shirtNumber}</span>
                            <span className="team-detail-squad-name">{player.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="team-detail-actions">
              {team.website ? (
                <button
                  type="button"
                  className="team-detail-website-btn"
                  onClick={() => onVisitWebsite(team.website!)}
                >
                  Visit website
                </button>
              ) : (
                <p className="team-detail-no-website">No website available</p>
              )}
              <button
                type="button"
                className="team-detail-close-btn"
                onClick={onClose}
                ref={closeButtonRef}
              >
                Close
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TeamDetail;
