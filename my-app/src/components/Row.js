import React from 'react';

const Row = (props) => {
    return (
        <tr>
            <td className="Team-position">
                {props.position}
            </td>
            <td className="Team-name">
                <div className="crest">
                    <img src={props.crestURI} alt=""/>
                </div>
                <span>{props.teamName}</span>
            </td>
            <td>
                {props.playedGames}
            </td>
            <td>
                {props.wins}
            </td>
            <td>
                {props.draws}
            </td>
            <td>
                {props.losses}
            </td>
            <td>
                {props.goalsFor}
            </td>
            <td>
                {props.goalsAgainst}
            </td>
            <td>
                {props.goalDifference}
            </td>
            <td className="Team-points">
                {props.points}
            </td>
        </tr>
    );
};

export default Row;