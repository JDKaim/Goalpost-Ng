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
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  form = this.#fb.group(
    {
      id: this.#fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4),
      ]),
      startTime: this.#fb.nonNullable.control(new Date(), [
        Validators.required,
      ]),
      location: this.#fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      status: this.#fb.nonNullable.control<Status>('future', [
        Validators.required,
      ]),
      awayTeam: this.#fb.nonNullable.control('', [Validators.required]),
      homeTeam: this.#fb.nonNullable.control('', [Validators.required]),
    },
    { validators: [mustBeDifferentValidator('awayTeam', 'homeTeam')] }
  );

  teams$ = this.#leagueService.watchTeams$();
  players$ = this.#leagueService.watchPlayers$();
  errors = new Array<Message>();

  statuses: Array<{ label: string; value: Status }> = [
    { label: 'Future', value: 'future' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Final', value: 'final' },
    { label: 'Postponed', value: 'postponed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  createGameClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const game = this.form.value;
    this.errors = [];
    try {
      this.#leagueService
        .createGame({
          id: game.id!,
          homeTeamId: game.homeTeam!,
          awayTeamId: game.awayTeam!,
          homeRoster: [],
          awayRoster: [],
          startTime: game.startTime!.getTime(),
          location: game.location!,
          status: game.status!,
          homeScore: 0,
          awayScore: 0,
          plays: [],
        })
        .subscribe({
          next: (game) => this.#router.navigate(['/', 'games', game.id]),
        });
    } catch (e: any) {
      this.errors.push({
        severity: 'error',
        summary: 'Error',
        detail: e.message,
      });
    }
  }
}
