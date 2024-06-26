import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/dtos/player';

@Pipe({
  standalone: true,
  name: 'player'
})
export class PlayerPipe implements PipeTransform {

  transform(player: Player): string {
    return `${player.name}`;
  }
}
