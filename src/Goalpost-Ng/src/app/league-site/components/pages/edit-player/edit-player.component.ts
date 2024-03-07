import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { LeagueService } from 'src/app/league-site/services/league.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { Team } from 'src/app/league-site/models/team';
import { Player } from 'src/app/league-site/models/player';

@Component({
  standalone: true,
  selector: 'edit-player',
  templateUrl: './edit-player.component.html',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TooltipModule,
  ],
})
export class EditPlayerComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
  #fb = inject(FormBuilder);
  form = this.#fb.group({
    name: this.#fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  teams$ = this.#leagueService.watchTeams$();
  players$ = this.#leagueService.watchPlayers$();
  errors = new Array<Message>();
  team$ = new Observable<Team | undefined>();
  player$ = new Observable<Player | undefined>();

  ngOnInit(): void {
    this.player$ = this.#leagueService.watchPlayer$(this.id).pipe(
      tap((player) => {
        if (!player) {
          return;
        }
        this.form.controls.name.setValue(player.name);
      })
    );
  }

  editPlayerClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const player = this.form.value;
    this.errors = [];
    try {
      this.#leagueService
        .editPlayer(this.id, { id: this.id, name: player.name! })
        .subscribe({
          next: (team) => this.#router.navigate(['/', 'players', this.id]),
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
