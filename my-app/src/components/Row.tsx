import React from 'react';
import { RowProps } from '../types';

const Row: React.FC<RowProps> = React.memo(({
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

    const positionClass =
        position <= 4 ? 'pos-cl' : position <= 6 ? 'pos-el' : position >= 18 ? 'pos-relegation' : 'pos-mid';
    const gdClass = goalDifference > 0 ? 'gd-positive' : goalDifference < 0 ? 'gd-negative' : 'gd-zero';

    return (
        <tr className="table-row">
            <td className={`team-position ${positionClass}`}>
                {position}
            </td>
            <td className="team-name">
                <div className="team-crest">
                    <img src={crest} alt={`${teamName} crest`} />
                </div>
                <span className="team-name-text">{teamName}</span>
            </td>
            <td className="cell-center">{playedGames}</td>
            <td className="cell-center stat-wins">{wins}</td>
            <td className="cell-center stat-draws">{draws}</td>
            <td className="cell-center stat-losses">{losses}</td>
            <td className="cell-center">{goalsFor}</td>
            <td className="cell-center">{goalsAgainst}</td>
            <td className={`cell-center ${gdClass}`}>
                {goalDifference > 0 ? '+' : ''}{goalDifference}
            </td>
            <td className="team-points">
                {points}
            </td>
        </tr>
    );
});
Row.displayName = 'Row';

export default Row;