import { Play } from "./play";
import { PlayerGame } from "./player-game";
import { Status } from "./status";
import { TeamStats } from "./team-stats";

export interface CreateGame {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeRoster: Array<PlayerGame>;
  awayRoster: Array<PlayerGame>;
  startTime: number;
  location: string;
  status: Status;
  homeScore: number;
  awayScore: number;
  plays: Array<Play>;
}
