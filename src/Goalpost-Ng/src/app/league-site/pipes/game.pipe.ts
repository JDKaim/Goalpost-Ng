import { Pipe, PipeTransform } from '@angular/core';
import { Team } from '../models/team';
import { Game } from '../models/dtos/game';

@Pipe({
  standalone: true,
  name: 'game'
})
export class GamePipe implements PipeTransform {

  transform(game: Game): string {
    return `${game.awayTeamCode} @ ${game.homeTeamCode}`;
  }
}
