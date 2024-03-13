import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { Player } from 'src/app/league-site/models/dtos/player';
import { Game } from 'src/app/league-site/models/game';
import { Team } from 'src/app/league-site/models/team';
import { PlayerPipe } from 'src/app/league-site/pipes/player.pipe';
import { TeamPipe } from 'src/app/league-site/pipes/team.pipe';
import { PlayerService } from 'src/app/league-site/services/player.service';
import { GameInfoPipe } from "../../../pipes/game-info.pipe";
import { GamePipe } from "../../../pipes/game.pipe";

@Component({
    standalone: true,
    selector: 'view-player',
    templateUrl: './view-player.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, TeamPipe, PlayerPipe, GamePipe, GameInfoPipe]
})
export class ViewPlayerComponent implements OnInit {
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  team$ = new Observable<Team | undefined>();
  games$ = new Observable<Game[] | undefined>();
  player$ = new Observable<ApiResponse<Player>>();
  // rushYardage$ = new Observable<number | undefined>();
  // rushYardage = 0;

  ngOnInit(): void {
    this.player$ = this.#playerService.getPlayer(this.id);
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
