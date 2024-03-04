import { Play } from "./play";
import { PlayerGame } from "./player-game";
import { Status } from "./status";
import { TeamStats } from "./team-stats";

export interface EditGame {
  startTime: number;
  location: string;
  status: Status;
}
