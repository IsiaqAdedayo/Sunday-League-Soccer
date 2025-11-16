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
  status: "scheduled" | "live" | "finished";
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
  position: "GK" | "DEF" | "MID" | "FWD";
}

export interface Booking {
  id: string;
  playerId: string;
  playerName: string;
  team: string;
  type: "yellow" | "red";
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

export interface Comment {
  id: string;
  mediaId: string;
  userName: string;
  userEmail?: string;
  text: string;
  createdAt: any;
}

// Update Media interface to include commentCount
export interface Media {
  id: string;
  type: "photo" | "video";
  title: string;
  description?: string;
  category: "match-action" | "team-photos" | "behind-scenes" | "top-moments";
  matchday?: number;
  teams?: string[];
  url: string;
  thumbnail?: string;
  thumbnailSmall?: string; // Small thumbnail (200px)
  thumbnailMedium?: string; // Medium thumbnail (500px)
  duration?: number;
  views: number;
  likes: number;
  commentCount: number; // Add this
  uploadedAt: any;
  uploadedBy: string;
}
