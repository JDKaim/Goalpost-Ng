import { Status } from '../status';

export interface CreateGame {
  homeTeamCode?: string;
  awayTeamCode?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  startTime?: number;
  location?: string;
}
