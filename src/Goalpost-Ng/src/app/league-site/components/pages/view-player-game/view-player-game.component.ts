import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiResponse, Player, Game, PlayerGame } from '@league-site/models';
import { PlayerPipe, GamePipe, GameInfoPipe } from '@league-site/pipes';
import { PlayerService, GameService } from '@league-site/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable, of, tap } from 'rxjs';

@Component({
    standalone: true,
    selector: 'view-player-game',
    templateUrl: './view-player-game.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, PlayerPipe, GamePipe, GameInfoPipe]
})
export class ViewPlayerGameComponent implements OnInit {
  #playerService = inject(PlayerService);
  #gameService = inject(GameService);
  #router = inject(Router);
  @Input() gameId!: number;
  @Input() playerId!: number;
  @Input() team!: number;
  trueTeam = this.team == 1;
  playerGames$ = new Observable<ApiResponse<PlayerGame[]>>();
  playerGame$ = new Observable<PlayerGame>();
  player$ = new Observable<ApiResponse<Player>>();
  game$ = new Observable<ApiResponse<Game>>();

  // rushYardage$ = new Observable<number | undefined>();
  // rushYardage = 0;

  ngOnInit(): void {
    this.playerGames$ = this.#gameService.searchPlayerGames({gameId: this.gameId, playerId: this.playerId}).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      if (response.result.length === 1) {
        if (response.result[0].isHome === this.trueTeam) {
          this.playerGame$ = of(response.result[0]);
        }
      } else if (response.result.length === 2) {
        if (response.result[0].isHome === this.trueTeam) {
          this.playerGame$ = of(response.result[0]);
        } else {
          this.playerGame$ = of(response.result[1]);
        }
      } else {
        return;
      }
    }));
    this.game$ = this.#gameService.getGame(this.gameId);
    this.player$ = this.#playerService.getPlayer(this.playerId);
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
