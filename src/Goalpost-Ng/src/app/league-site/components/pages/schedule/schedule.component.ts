import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GameInfoPipe } from 'src/app/league-site/pipes/game-info.pipe';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';

@Component({
  standalone: true,
  selector: 'schedule-page',
  templateUrl: './schedule.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, GamePipe, GameInfoPipe],
})
export class ScheduleComponent {
  #gameService = inject(GameService);
  games$ = this.#gameService.searchGames({});


  constructor() {
  }
}
