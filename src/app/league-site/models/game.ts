import { Play } from "./play";
import { PlayerGame } from "./player-game";
import { TeamStats } from "./team-stats";

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeRoster: Array<PlayerGame>;
  awayRoster: Array<PlayerGame>;
  startTime: number;
  location: string;
  status: string;
  homeScore: number;
  awayScore: number;
  plays: Array<Play>;
}
