import { Player } from '../dtos/player';
import { PlayerGame } from '../dtos/player-game';

export class RosterPlayer {
  constructor(public playerGame: PlayerGame, public player: Player) {}
}
