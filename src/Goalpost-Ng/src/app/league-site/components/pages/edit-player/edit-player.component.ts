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
import { Player } from 'src/app/league-site/models/dtos/player';
import { PlayerService } from 'src/app/league-site/services/player.service';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';

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
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);
  form = this.#fb.group({
    name: this.#fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  // teams$ = this.#leagueService.watchTeams$();
  players$ = new Observable<ApiResponse<Array<Player>>>();
  errors = new Array<Message>();
  // team$ = new Observable<Team | undefined>();
  player$ = new Observable<ApiResponse<Player>>();

  ngOnInit(): void {
    this.players$ = this.#playerService.searchPlayers({});
    this.player$ = this.#playerService.getPlayer(this.id).pipe(
      tap((response) => {
        if (!response.result) {
          return;
        }
        this.form.controls.name.setValue(response.result.name);
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
      this.#playerService
        .updatePlayer(this.id, { name: player.name! })
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

  deletePlayer(): void {
    this.#playerService.deletePlayer(this.id).subscribe({
      next: () => this.#router.navigate(['/'])
    });
  }
}
