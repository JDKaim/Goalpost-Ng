import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { mustBeDifferentValidator } from 'src/app/league-site/helpers/custom-validators';
import { Status } from 'src/app/league-site/models/status';
import { GameService } from 'src/app/league-site/services/game.service';
import { LeagueService } from 'src/app/league-site/services/league.service';

@Component({
  standalone: true,
  selector: 'create-game',
  templateUrl: './create-game.component.html',
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
  ],
})
export class CreateGameComponent {
  #gameService = inject(GameService);
  #router = inject(Router);
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
    },
    {
      validators: [
        mustBeDifferentValidator('awayTeamCode', 'homeTeamCode'),
        mustBeDifferentValidator('awayTeamName', 'homeTeamName'),
      ],
    }
  );

  // teams$ = this.#leagueService.watchTeams$();
  // players$ = this.#leagueService.watchPlayers$();
  errors = new Array<Message>();

  statuses: Array<{ label: string; value: Status }> = [
    { label: 'Future', value: 'Future' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Final', value: 'Final' },
    { label: 'Postponed', value: 'Postponed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  createGameClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const game = this.form.value;
    this.errors = [];
    this.#gameService
      .createGame({
        homeTeamCode: game.homeTeamCode!,
        awayTeamCode: game.awayTeamCode!,
        homeTeamName: game.homeTeamName!,
        awayTeamName: game.awayTeamName!,
        startTime: game.startTime!.getTime(),
        location: game.location!,
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
}
