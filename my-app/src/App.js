import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
import Button from "./components/Button";
import Row from "./components/Row";
import TableBody from "./components/TableBody";
import LeagueInfo from "./components/LeagueInfo";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagueName: "Premier League",
      rows: [],
      leagueId: "PL",
      leagues: {
        "La Liga": "PD",
        "Premier League": "PL",
        Eredivisie: "DED",
        "Ligue 1": "FL1",
        Bundesliga: "BL1",
        "Serie A": "SA",
      },
      buttons: [],
    };
    this.handleLeagueClick = this.handleLeagueClick.bind(this);
  }

  handleLeagueClick(e) {
    const newId = e.target.getAttribute("data-leagueid");
    this.setState(
      {
        leagueId: newId,
      },
      () => {
        this.fetchData();
      }
    );
  }

  fetchData() {
    const mysite = "http://localhost:3000"
    const Token = "b715fa41da9c4968ae82a1eafc5d5360",
      leagueId = this.state.leagueId,
      URL =
        "https://api.football-data.org/v4/competitions/" +
        leagueId +
        "/standings?season=2023";

    fetch(URL, {
      method: "GET",
      headers: {
        "X-Auth-Token": Token,
        "Access-Control-Allow-Origin": mysite,
        "Access-Control-Allow-Headers": "Accept, Content-Type",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const rows = [];
        responseJson.standings[0].table.map((item, index) => {
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
          const { crestUrl, name } = item.team;

          return rows.push(
            <Row
              key={index}
              position={position}
              crestURI={crestUrl}
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
        this.setState({
          leagueName: responseJson.competition.name,
          rows: rows,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.fetchData();
    for (let key in this.state.leagues) {
      this.state.buttons.push(
        <Button
          handleClick={this.handleLeagueClick}
          key={this.state.leagues[key]}
          leagueId={this.state.leagues[key]}
          text={key}
        />
      );
    }
  }

  render() {
    return (
      <div className="app">
        <h2> LEAGUE STANDING </h2>
        <Header>{this.state.buttons}</Header>
        <div className="container">
          <LeagueInfo leagueCaption={this.state.leagueName} />
          <TableBody>{this.state.rows}</TableBody>
        </div>
      </div>
    );
  }
}
export default App;
