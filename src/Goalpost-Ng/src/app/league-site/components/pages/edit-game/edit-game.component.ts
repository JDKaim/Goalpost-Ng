import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { mustBeDifferentValidator } from 'src/app/league-site/helpers/custom-validators';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { GameData } from 'src/app/league-site/models/entities/game-data';
import { Status } from 'src/app/league-site/models/status';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayerService } from 'src/app/league-site/services/player.service';

@Component({
  standalone: true,
  selector: 'edit-game',
  templateUrl: './edit-game.component.html',
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
  ],
})
export class EditGameComponent {
  #gameService = inject(GameService);
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);
  form = this.#fb.group(
    {
      startTime: this.#fb.nonNullable.control(new Date(), [
        Validators.required,
      ]),
      location: this.#fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      status: this.#fb.nonNullable.control<Status>('Future', [
        Validators.required,
      ]),
      awayTeamCode: this.#fb.nonNullable.control('', [Validators.required]),
      homeTeamCode: this.#fb.nonNullable.control('', [Validators.required]),
      awayTeamName: this.#fb.nonNullable.control('', [Validators.required]),
      homeTeamName: this.#fb.nonNullable.control('', [Validators.required]),
      homeScore: this.#fb.nonNullable.control(0),
      awayScore: this.#fb.nonNullable.control(0),
    },
    {
      validators: [
        mustBeDifferentValidator('awayTeamCode', 'homeTeamCode'),
        mustBeDifferentValidator('awayTeamName', 'homeTeamName'),
      ],
    }
  );

  players$ = this.#playerService.searchPlayers({});
  errors = new Array<Message>();
  gameData$ = new Observable<ApiResponse<GameData>>();

  statuses: Array<{ label: string; value: Status }> = [
    { label: 'Future', value: 'Future' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Final', value: 'Final' },
    { label: 'Postponed', value: 'Postponed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  ngOnInit(): void {
    this.#updateGameData();
  }

  #updateGameData() {
    this.gameData$ = this.#gameService.getGameData(this.id).pipe(
      tap((response) => {
        if (!response.result) {
          return;
        }
        this.form.controls.awayTeamCode.setValue(
          response.result!.game.awayTeamCode
        );
        this.form.controls.homeTeamCode.setValue(
          response.result!.game.homeTeamCode
        );
        this.form.controls.awayTeamName.setValue(
          response.result!.game.awayTeamName
        );
        this.form.controls.homeTeamName.setValue(
          response.result!.game.homeTeamName
        );
        this.form.controls.awayScore.setValue(response.result!.game.awayScore);
        this.form.controls.homeScore.setValue(response.result!.game.homeScore);
        this.form.controls.location.setValue(response.result!.game.location);
        this.form.controls.startTime.setValue(
          new Date(response.result!.game.startTime)
        );
        this.form.controls.status.setValue(response.result!.game.status);
        this.players$ = this.#playerService.searchPlayers({}).pipe(
          tap((playerResponse) => {
            if (!playerResponse.result) {
              return;
            }
            playerResponse.result.filter(
              (player) =>
                !response.result!.homeRoster.find(
                  (homePlayer) => homePlayer.player.id === player.id
                ) ||
                !response.result!.awayRoster.find(
                  (awayPlayer) => awayPlayer.player.id === player.id
                )
            );
          })
        );
      })
    );
  }

  editGameClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const game = this.form.value;
    this.errors = [];
    this.#gameService
      .updateGame(this.id, {
        startTime: game.startTime!.getTime(),
        location: game.location!,
        status: game.status!,
        homeTeamCode: game.homeTeamCode!,
        awayTeamCode: game.awayTeamCode!,
        homeTeamName: game.homeTeamName!,
        awayTeamName: game.awayTeamName!,
        awayScore: game.awayScore,
        homeScore: game.homeScore,
      })
      .subscribe({
        next: (response) => {
          if (!response.result) {
            this.errors.push(
              ...response.errorMessages!.map(
                (errorMessage) =>
                  <Message>{
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                  }
              )
            );
            return;
          }
          this.#router.navigate(['/', 'games', response.result.id]);
        },
      });
  }

  deleteGameClicked() {
    this.#gameService.deleteGame(this.id).subscribe({
      next: () => this.#router.navigate(['/']),
    });
  }

  addPlayerClicked(id: number, homeTeam: boolean) {
    this.#gameService.addPlayerToRoster(this.id, homeTeam, id).subscribe({
      next: () => this.#updateGameData(),
    });
  }

  removePlayerClicked(id: number, homeTeam: boolean) {
    this.#gameService
      .removePlayerFromRoster(this.id, homeTeam, id)
      .subscribe({ next: () => this.#updateGameData() });
  }
}
