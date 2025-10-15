// API Response Types
export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Standing {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface StandingsResponse {
  competition: Competition;
  standings: Array<{
    stage: string;
    type: string;
    group: string | null;
    table: Standing[];
  }>;
}

// Component Props Types
export interface ButtonProps {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  leagueId: string;
  text: string;
  isActive?: boolean;
  animationDelay?: number;
}

export interface RowProps {
  position: number;
  crest: string;
  teamName: string;
  playedGames: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface LeagueInfoProps {
  leagueCaption: string;
  season?: string;
}

export interface HeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

// App State Types
export interface League {
  [key: string]: string;
}

export interface AppState {
  leagueName: string;
  rows: React.ReactElement[];
  leagueId: string;
  leagues: League;
  buttons: React.ReactElement[];
}
