import React from 'react';
import { RowProps } from '../types';

const Row: React.FC<RowProps> = ({
    position,
    crest,
    teamName,
    playedGames,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    points
}) => {

    const getPositionStyle = (pos: number): React.CSSProperties => {
        if (pos <= 4) return { color: '#16a34a', fontWeight: 'bold' }; // Champions League
        if (pos <= 6) return { color: '#2563eb', fontWeight: 'bold' }; // Europa League
        if (pos >= 18) return { color: '#dc2626', fontWeight: 'bold' }; // Relegation
        return { color: '#6b7280' };
    };

    const getGoalDifferenceStyle = (gd: number): React.CSSProperties => {
        if (gd > 0) return { color: '#16a34a', fontWeight: 'bold' };
        if (gd < 0) return { color: '#dc2626', fontWeight: 'bold' };
        return { color: '#6b7280', fontWeight: 'bold' };
    };

    return (
        <tr className="table-row">
            <td className="team-position" style={getPositionStyle(position)}>
                {position}
            </td>
            <td className="team-name">
                <div className="team-crest">
                    <img src={crest} alt={`${teamName} crest`} />
                </div>
                <span style={{ fontWeight: '500' }}>{teamName}</span>
            </td>
            <td style={{ textAlign: 'center' }}>{playedGames}</td>
            <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: '500' }}>{wins}</td>
            <td style={{ textAlign: 'center', color: '#eab308', fontWeight: '500' }}>{draws}</td>
            <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: '500' }}>{losses}</td>
            <td style={{ textAlign: 'center', fontWeight: '500' }}>{goalsFor}</td>
            <td style={{ textAlign: 'center', fontWeight: '500' }}>{goalsAgainst}</td>
            <td style={{ textAlign: 'center', ...getGoalDifferenceStyle(goalDifference) }}>
                {goalDifference > 0 ? '+' : ''}{goalDifference}
            </td>
            <td className="team-points">
                {points}
            </td>
        </tr>
    );
};

export default Row;