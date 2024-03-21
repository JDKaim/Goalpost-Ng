import { Game } from "./game";
import { Play } from "./play";
import { PlayerGame } from "./player-game";

export interface GameData {
  game: Game;
  plays: Play[];
  awayRoster: PlayerGame[];
  homeRoster: PlayerGame[];
}
