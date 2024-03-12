import { Status } from "../status";

export interface Game {
  id: number;
  homeTeamCode: string;
  awayTeamCode: string;
  homeTeamName: string;
  awayTeamName: string;
  startTime: number;
  location: string;
  status: Status;
  homeScore: number;
  awayScore: number;
}
