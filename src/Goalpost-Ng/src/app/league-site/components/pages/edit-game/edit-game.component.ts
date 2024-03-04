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
import { Game } from 'src/app/league-site/models/game';
import { Player } from 'src/app/league-site/models/player';
import { Status } from 'src/app/league-site/models/status';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { LeagueService } from 'src/app/league-site/services/league-service';

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
    GamePipe
  ],
})
export class EditGameComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
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
      status: this.#fb.nonNullable.control<Status>('future', [
        Validators.required,
      ]),
    },
    { validators: [mustBeDifferentValidator('awayTeam', 'homeTeam')] }
  );

  teams$ = this.#leagueService.watchTeams$();
  players$ = this.#leagueService.watchPlayers$();
  homeRoster$ = new Observable<Player[]>();
  awayRoster$ = new Observable<Player[]>();
  errors = new Array<Message>();
  game$ = new Observable<Game | undefined>();

  ngOnInit(): void {
    this.game$ = this.#leagueService.watchGame$(this.id).pipe(
      tap((game) => {
        if (!game) {
          return;
        }
        this.form.controls.startTime.setValue(new Date(game.startTime));
        this.form.controls.location.setValue(game.location);
        this.form.controls.status.setValue(game.status);
      })
    );
    this.homeRoster$ = this.#leagueService.watchRoster$(this.id, true);
    this.awayRoster$ = this.#leagueService.watchRoster$(this.id, false);
    this.players$ = combineLatest([
      this.homeRoster$,
      this.awayRoster$,
      this.#leagueService.watchPlayers$(),
    ]).pipe(
      map((responses) => {
        return responses[2].filter(
          (player) =>
            !responses[1].find((away) => away.id === player.id) &&
            !responses[0].find((home) => home.id === player.id)
        );
      })
    );
  }

  statuses: Array<{ label: string; value: Status }> = [
    { label: 'Future', value: 'future' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Final', value: 'final' },
    { label: 'Postponed', value: 'postponed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  editGameClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const game = this.form.value;
    this.errors = [];
    try {
      this.#leagueService
        .editGame(this.id, {
          startTime: game.startTime!.getTime(),
          location: game.location!,
          status: game.status!,
        })
        .subscribe({
          next: (team) => this.#router.navigate(['/', 'games', this.id]),
        });
    } catch (e: any) {
      this.errors.push({
        severity: 'error',
        summary: 'Error',
        detail: e.message,
      });
    }
  }

  deleteGameClicked() {
    this.#leagueService.deleteGame(this.id).subscribe({
      next: () => this.#router.navigate(['/'])
    });
  }

  addPlayerClicked(id: string, homeTeam: boolean) {
    this.#leagueService
      .addPlayerToRoster(this.id, id, homeTeam, '')
      .subscribe();
  }

  removePlayerClicked(id: string, homeTeam: boolean) {
    this.#leagueService
      .removePlayerFromRoster(this.id, id, homeTeam)
      .subscribe();
  }
}
