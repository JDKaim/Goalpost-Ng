import { PlayType } from '../play-type';
import { Status } from '../status';
import { TurnoverType } from '../turnover-type';

export interface Play {
  id: number;
  index: number;
  isHomePlay: boolean;
  type: PlayType;
  yardLine: number;
  down: number;
  yardage: number;
  isCompletedPass: boolean;
  passerId?: number;
  rusherId?: number;
  receiverId?: number;
  turnoverType: TurnoverType;
  flagPullerId?: number;
  turnoverPlayerId?: number;
  isSack: boolean;
}
