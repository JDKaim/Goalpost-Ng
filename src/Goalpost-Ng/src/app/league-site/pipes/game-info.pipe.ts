import { Pipe, PipeTransform } from '@angular/core';
import { Game } from '../models/dtos/game';

@Pipe({
  standalone: true,
  name: 'gameinfo'
})
export class GameInfoPipe implements PipeTransform {

  transform(game: Game): string {
    return `@ ${game.location} @ ${new Date(game.startTime)}`;
  }
}
