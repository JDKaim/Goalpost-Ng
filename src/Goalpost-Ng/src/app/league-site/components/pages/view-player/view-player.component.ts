import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayerStatsComponent } from '@league-site/components/controls/player-stats/player-stats.component';
import { ApiResponse, Game, Player } from '@league-site/models';
import { PlayerGameGame } from '@league-site/models/entities/player-game-game';
import { PlayerGameGameArray } from '@league-site/models/entities/player-game-game-array';
import { GameInfoPipe, GamePipe, PlayerPipe } from '@league-site/pipes';
import { GameWithTeamPipe } from '@league-site/pipes/game-with-team.pipe';
import { GameService, PlayerService } from '@league-site/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Observable, of, tap } from 'rxjs';

@Component({
    standalone: true,
    selector: 'view-player',
    templateUrl: './view-player.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, PlayerPipe, GamePipe, GameInfoPipe, SelectButtonModule, ReactiveFormsModule, PlayerStatsComponent, GameWithTeamPipe]
})
export class ViewPlayerComponent implements OnInit {
  #playerService = inject(PlayerService);
  #fb = inject(FormBuilder);
  views: Array<{ label: string; value: string }> = [
    { label: 'Schedule', value: 'schedule' },
    { label: 'Stats', value: 'stats' },
  ];
  #gameService = inject(GameService);
  #router = inject(Router);
  @Input() id!: number;
  player$ = new Observable<ApiResponse<Player>>();
  playerGameGameArray$ = new Observable<ApiResponse<PlayerGameGameArray>>();
  playerGameGames$ = new Observable<Array<PlayerGameGame>>();
  games$ = new Observable<ApiResponse<Game[]>>();
  form = this.#fb.group({
    view: this.#fb.nonNullable.control<string>('schedule', [
      Validators.required,
    ]),
  });

  // rushYardage$ = new Observable<number | undefined>();
  // rushYardage = 0;

  ngOnInit(): void {
    this.player$ = this.#playerService.getPlayer(this.id);
    this.playerGameGameArray$ = this.#gameService.getGamesAndPlayerGamesForPlayer(this.id).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      this.playerGameGames$ = of(response.result.playerGames.map((playerGame) => {
        return new PlayerGameGame(playerGame, response.result!.games.find((game) => game.id === playerGame.gameId)!);
      }));
    }));
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
