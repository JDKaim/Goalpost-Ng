import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { Game } from 'src/app/league-site/models/dtos/game';
import { GameData } from 'src/app/league-site/models/dtos/game-data';
import { Player } from 'src/app/league-site/models/dtos/player';
import { PlayerGame } from 'src/app/league-site/models/dtos/player-game';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayerService } from 'src/app/league-site/services/player.service';

@Component({
  standalone: true,
  selector: 'view-game',
  templateUrl: './view-game.component.html',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    GamePipe,
    ProgressBarModule,
  ],
})
export class ViewGameComponent {
  #gameService = inject(GameService);
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  gameData$ = new Observable<ApiResponse<GameData>>();
  homeRoster$ = new Observable<ApiResponse<PlayerGame[]>>();
  homePlayers$ = new Observable<ApiResponse<Player[]>>();
  awayRoster$ = new Observable<ApiResponse<PlayerGame[]>>();
  players$ = new Observable<ApiResponse<Player[]>>();
  homePlayers = [];
  awayPlayers = [];
  homeTeamName = '';
  awayTeamName = '';
  errors = new Array<Message>();
  game$ = new Observable<ApiResponse<Game>>();
  // gameData$ = new Observable<ApiResponse<>>();

  ngOnInit(): void {
    this.players$ = this.#playerService.searchPlayers({});
    this.game$ = this.#gameService.getGame(this.id).pipe(
      tap((response) => {
        if (!response.result) {
          return;
        }
        this.homeTeamName = response.result.homeTeamName;
        this.awayTeamName = response.result.awayTeamName;
      })
    );
    this.homeRoster$ = this.#gameService.getRoster(this.id, this.homeTeamName);
    this.awayRoster$ = this.#gameService.getRoster(this.id, this.awayTeamName);

  }
}
