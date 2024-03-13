import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { Player } from 'src/app/league-site/models/dtos/player';
import { PlayerService } from 'src/app/league-site/services/player.service';

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
    TooltipModule,
  ],
})
export class CreatePlayerComponent {
  #playerService = inject(PlayerService);
  #router = inject(Router);
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

  createPlayerClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const player = this.form.value;
    this.errors = [];
    this.#playerService
      .createPlayer({
        name: player.name!,
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
          this.#router.navigate(['/', 'players', response.result.id]);
        },
      });
  }

  ngOnInit(): void {
    this.players$ = this.#playerService.searchPlayers({});
  }
}
