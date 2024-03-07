import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable, map, switchMap } from 'rxjs';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { Player } from 'src/app/league-site/models/player';
import { Team } from 'src/app/league-site/models/team';
import { TeamPipe } from 'src/app/league-site/pipes/team.pipe';
import { PlayerPipe } from 'src/app/league-site/pipes/player.pipe';
import { LeagueService } from 'src/app/league-site/services/league.service';
import { GamePipe } from "../../../pipes/game.pipe";
import { GameInfoPipe } from "../../../pipes/game-info.pipe";

@Component({
    standalone: true,
    selector: 'view-player',
    templateUrl: './view-player.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, TeamPipe, PlayerPipe, GamePipe, GameInfoPipe]
})
export class ViewPlayerComponent implements OnInit {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
  team$ = new Observable<Team | undefined>();
  player$ = new Observable<Player | undefined>();
  games$ = new Observable<Game[] | undefined>();
  // rushYardage$ = new Observable<number | undefined>();
  // rushYardage = 0;

  ngOnInit(): void {
    this.player$ = this.#leagueService.watchPlayer$(this.id);
    this.games$ = this.#leagueService.watchGames$().pipe(map(games => games.filter(game => game.awayRoster.find((player) => player.id === this.id) || game.homeRoster.find((player) => player.id === this.id))));
    // this.rushYardage$ = this.games$.pipe((switchMap(games => games!.forEach((game) => {
    //   if (game.homeRoster.find((player) => player.id === this.id)) {
    //     return of(new GameStats(game!).homeTeamStats.playerStats.find((player) => player.id === this.id).rushingYardage);
    //   } else {
    //     return of(new GameStats(game!).awayTeamStats.playerStats.find((player) => player.id === this.id).rushingYardage);
    //   }
    // }))));
  }

  deletePlayer(): void {
    this.#leagueService.deletePlayer(this.id).subscribe({
      next: () => this.#router.navigate(['/'])
    });
  }
}
