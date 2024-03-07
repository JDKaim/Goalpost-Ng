import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { map, tap } from 'rxjs';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { GameInfoPipe } from 'src/app/league-site/pipes/game-info.pipe';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { LeagueService } from 'src/app/league-site/services/league.service';

@Component({
  standalone: true,
  selector: 'schedule-page',
  templateUrl: './schedule.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, GamePipe, GameInfoPipe],
})
export class ScheduleComponent {
  #leagueService = inject(LeagueService);
  games$ = this.#leagueService.watchGames$().pipe(tap((games) => {
    games.sort((game, game2) => game.startTime - game2.startTime);
  }));


  constructor() {
  }
}
