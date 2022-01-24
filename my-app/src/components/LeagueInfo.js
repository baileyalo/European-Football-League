import React from 'react';
import Bundesliga from '../images/Bundesliga.png';
import Eredivisie from '../images/Eredivisie.png';
import LaLiga from '../images/LaLiga.png';
import Ligue1 from '../images/Ligue1.png';
import PremierLeague from '../images/PremierLeague.png';
import SerieA from '../images/SerieA.png';

const LeagueInfo = (props) => {
    let imgSrc;
    switch (props.leagueCaption) {

        case "Bundesliga":
            imgSrc = Bundesliga;
            break;

        case "Eredivisie":
            imgSrc = Eredivisie;
            break;

        case "Primera Division":
            imgSrc = LaLiga;
            break;

        case "Ligue 1":
            imgSrc = Ligue1;
            break;

        case "Premier League":
            imgSrc = PremierLeague;
            break;

        case "Serie A":
            imgSrc = SerieA;
            break;

        default:
            imgSrc = LaLiga;
            break;
    }

    return (
        <div className="league-info">
            <img src={imgSrc} alt="" />
        </div>
    );
};

export default LeagueInfo;