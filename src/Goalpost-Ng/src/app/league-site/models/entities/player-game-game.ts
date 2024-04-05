import { Game } from '../dtos/game';
import { PlayerGame } from '../dtos/player-game';

export class PlayerGameGame {
  constructor(public playerGame: PlayerGame, public game: Game) {

  }
}
