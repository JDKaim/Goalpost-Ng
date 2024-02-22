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
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { LeagueService } from 'src/app/league-site/services/league-service';

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
    GamePipe
  ],
})
export class ViewGameComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
  #fb = inject(FormBuilder);

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
}
