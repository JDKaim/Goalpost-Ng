import { Game } from "../dtos/game";
import { Play } from "../dtos/play";
import { RosterPlayer } from "./roster-player";

export class GameData {
  constructor(public game: Game, public plays: Play[], public awayRoster: RosterPlayer[], public homeRoster: RosterPlayer[]) {

  }
}
