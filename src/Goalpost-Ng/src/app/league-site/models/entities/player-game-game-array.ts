import { Game } from '../dtos/game';
import { PlayerGame } from '../dtos/player-game';

export class PlayerGameGameArray {
  constructor(public playerGames: PlayerGame[], public games: Game[]) {

  }
}
