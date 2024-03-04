import { PlayType } from "./play-type";
import { TurnoverType } from "./turnover-type";

export interface CreatePlay {
  offensiveTeamId: string;
  defensiveTeamId: string;
  type: PlayType;
  distanceToGo: number;
  yardLine: number;
  down: number;
  points: number;
  yardage: number;
  earnedFirstDown: boolean;
  completedPass: boolean;
  passer?: string;
  rusher?: string;
  receiver?: string;
  turnoverType?: TurnoverType;
  flagPuller?: string;
  turnoverPlayer?: string;
  penalty?: string;
  penaltyPlayer?: string;
  penaltyYardage?: number;
  sack: boolean;
}
