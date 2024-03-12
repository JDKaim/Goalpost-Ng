import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { Observable, combineLatest, map, takeUntil, tap } from 'rxjs';
import { mustBeDifferentValidator } from 'src/app/league-site/helpers/custom-validators';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { Game } from 'src/app/league-site/models/dtos/game';
import { Player } from 'src/app/league-site/models/player';
import { Status } from 'src/app/league-site/models/status';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { LeagueService } from 'src/app/league-site/services/league.service';

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

  homeRoster$ = new Observable<Player[]>();
  awayRoster$ = new Observable<Player[]>();
  errors = new Array<Message>();
  game$ = new Observable<ApiResponse<Game>>();

  ngOnInit(): void {
    this.game$ = this.#gameService.getGame(this.id).pipe(
      tap((response) => {
        if (!response.result) {
          return;
        }
        this.form.controls.awayTeamCode.setValue(response.result!.awayTeamCode);
        this.form.controls.homeTeamCode.setValue(response.result!.homeTeamCode);
        this.form.controls.awayTeamName.setValue(response.result!.awayTeamName);
        this.form.controls.homeTeamName.setValue(response.result!.homeTeamName);
        this.form.controls.awayScore.setValue(response.result!.awayScore);
        this.form.controls.homeScore.setValue(response.result!.homeScore);
        this.form.controls.location.setValue(response.result!.location);
        this.form.controls.startTime.setValue(
          new Date(response.result!.startTime)
        );
        this.form.controls.status.setValue(response.result!.status);
      })
    );
  }

  statuses: Array<{ label: string; value: Status }> = [
    { label: 'Future', value: 'Future' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Final', value: 'Final' },
    { label: 'Postponed', value: 'Postponed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

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

  // addPlayerClicked(id: string, homeTeam: boolean) {
  //   this.#leagueService
  //     .addPlayerToRoster(this.id, id, homeTeam, '')
  //     .subscribe();
  // }

  // removePlayerClicked(id: string, homeTeam: boolean) {
  //   this.#leagueService
  //     .removePlayerFromRoster(this.id, id, homeTeam)
  //     .subscribe();
  // }
}
