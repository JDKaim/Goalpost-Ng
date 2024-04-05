import { Pipe, PipeTransform } from '@angular/core';
import { Game } from '../models/dtos/game';
import { PlayerGameGame } from '@league-site/models/entities/player-game-game';

@Pipe({
  standalone: true,
  name: 'gamewithteam'
})
export class GameWithTeamPipe implements PipeTransform {

  transform(playerGameGame: PlayerGameGame): string {
    if (playerGameGame.playerGame.isHome) {
      return `${playerGameGame.game.awayTeamCode.toLowerCase()} @ ${playerGameGame.game.homeTeamCode}`;
    }
    return `${playerGameGame.game.awayTeamCode} @ ${playerGameGame.game.homeTeamCode.toLowerCase()}`;
  }
}
