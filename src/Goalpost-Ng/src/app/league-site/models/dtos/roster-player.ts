import { Player } from './player';
import { PlayerGame } from './player-game';

export class RosterPlayer {
  constructor(public playerGame: PlayerGame, public player: Player) {}
}
