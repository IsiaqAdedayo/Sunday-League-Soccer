export interface Team {
  id: string;
  name: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  matchday: number;
  status: 'scheduled' | 'live' | 'finished';
}

export interface Player {
  id: string;
  name: string;
  team: string;
  goals: number;
  assists: number;
  cleanSheets?: number;
  yellowCards: number;
  redCards: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
}

export interface Booking {
  id: string;
  playerId: string;
  playerName: string;
  team: string;
  type: 'yellow' | 'red';
  fixtureId: string;
  paid: boolean;
  amount: number;
}

export interface TournamentSettings {
  adminPassword: string;
  tournamentName: string;
  seasonYear: string;
  currentMatchday: number;
}
