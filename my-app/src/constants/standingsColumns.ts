export interface StandingsColumn {
  key: string;
  label: string;
  title: string;
  className: string;
}

export const STANDINGS_COLUMNS: StandingsColumn[] = [
  { key: 'pos', label: '#', title: 'Position', className: 'col-pos' },
  { key: 'team', label: 'Team', title: 'Team', className: 'col-team' },
  { key: 'mp', label: 'MP', title: 'Matches played', className: 'col-stat' },
  { key: 'w', label: 'W', title: 'Wins', className: 'col-stat' },
  { key: 'd', label: 'D', title: 'Draws', className: 'col-stat' },
  { key: 'l', label: 'L', title: 'Losses', className: 'col-stat' },
  { key: 'gf', label: 'GF', title: 'Goals for', className: 'col-stat' },
  { key: 'ga', label: 'GA', title: 'Goals against', className: 'col-stat' },
  { key: 'gd', label: 'GD', title: 'Goal difference', className: 'col-stat' },
  { key: 'pts', label: 'PTS', title: 'Points', className: 'col-stat' },
];
