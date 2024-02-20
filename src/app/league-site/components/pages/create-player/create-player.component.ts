import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { LeagueService } from 'src/app/league-site/services/league-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'create-player',
  templateUrl: './create-player.component.html',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TooltipModule
  ],
})
export class CreatePlayerComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  form = this.#fb.group({
    id: this.#fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(4),
    ]),
    name: this.#fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  teams$ = this.#leagueService.watchTeams$();
  players$ = this.#leagueService.watchPlayers$();
  errors = new Array<Message>();

  createPlayerClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const player = this.form.value;
    this.errors = [];
    try {
      this.#leagueService
        .createPlayer({ id: player.id!, name: player.name! })
        .subscribe({
          // next: (team) => this.#router.navigate(['/', 'teams', team.id]),
        });
    } catch (e: any) {
      this.errors.push( { severity: 'error', summary: 'Error', detail: e.message });
    }
  }
}
