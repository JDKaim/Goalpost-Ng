import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiResponse, Player, Game, PlayerGame } from '@league-site/models';
import { PlayerPipe, GamePipe, GameInfoPipe } from '@league-site/pipes';
import { PlayerService, GameService } from '@league-site/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable, tap } from 'rxjs';

@Component({
    standalone: true,
    selector: 'view-player',
    templateUrl: './view-player.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, PlayerPipe, GamePipe, GameInfoPipe]
})
export class ViewPlayerComponent implements OnInit {
  #playerService = inject(PlayerService);
  #gameService = inject(GameService);
  #router = inject(Router);
  @Input() id!: number;
  player$ = new Observable<ApiResponse<Player>>();
  playerGames$ = new Observable<ApiResponse<PlayerGame[]>>();
  games$ = new Observable<ApiResponse<Game[]>>();

  // rushYardage$ = new Observable<number | undefined>();
  // rushYardage = 0;

  ngOnInit(): void {
    this.player$ = this.#playerService.getPlayer(this.id);
    this.playerGames$ = this.#playerService.getPlayerGamesForPlayer(this.id);
    this.games$ = this.#gameService.getGamesForPlayer(this.id);
    // this.games$ = this.#leagueService.watchGames$().pipe(map(games => games.filter(game => game.awayRoster.find((player) => player.id === this.id) || game.homeRoster.find((player) => player.id === this.id))));
    // this.rushYardage$ = this.games$.pipe((switchMap(games => games!.forEach((game) => {
    //   if (game.homeRoster.find((player) => player.id === this.id)) {
    //     return of(new GameStats(game!).homeTeamStats.playerStats.find((player) => player.id === this.id).rushingYardage);
    //   } else {
    //     return of(new GameStats(game!).awayTeamStats.playerStats.find((player) => player.id === this.id).rushingYardage);
    //   }
    // }))));
  }
}
