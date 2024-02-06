import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
})
export class HomePageComponent {
  #leagueService = inject(LeagueService);
  league$ = this.#leagueService.watchLeague$();
  gameStats: GameStats;


  constructor() {
    const game: Game = {
      id: '001',
      homeTeamId: '01',
      awayTeamId: '02',
      homeRoster: [
        { id: 'jd', jersey: '21' },
        { id: 'tommy', jersey: '69' },
      ],
      awayRoster: [{ id: 'layla', jersey: '99' }],
      startTime: 0,
      location: 'Lumen Field',
      status: 'Finished',
      homeScore: 0,
      awayScore: 0,
      plays: [
        {
          id: '01',
          index: 0,
          down: 1,
          distanceToGo: 10,
          yardLine: 25,
          yardage: 6,
          type: 'passing',
          offensiveTeamId: '01',
          defensiveTeamId: '02',
          completedPass: true,
          earnedFirstDown: false,
          points: 0,
          sack: false,
          passer: 'jd',
          receiver: 'tommy',
          flagPuller: 'layla',
        },
      ],
    };

    this.gameStats = new GameStats(game);

    //   id: string;
    // homeTeamId: string;
    // awayTeamId: string;
    // homeRoster: Array<PlayerGame>;
    // awayRoster: Array<PlayerGame>;
    // startTime: number;
    // location: string;
    // status: string;
    // homeScore: number;
    // awayScore: number;
    // plays: Array<Play>;
  }
}
