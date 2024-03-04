import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
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
import { Observable, tap } from 'rxjs';
import { Team } from 'src/app/league-site/models/team';

@Component({
  standalone: true,
  selector: 'edit-team',
  templateUrl: './edit-team.component.html',
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
export class EditTeamComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
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
  errors = new Array<Message>();
  team$ = new Observable<Team | undefined>();

  ngOnInit(): void {
    this.team$ = this.#leagueService.watchTeam$(this.id).pipe(
      tap((team) => {
        if (!team) {
          return;
        }
        this.form.controls.id.setValue(team.id);
        this.form.controls.name.setValue(team.name);
      })
    );
  }

  editTeamClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const team = this.form.value;
    this.errors = [];
    try {
      this.#leagueService
        .editTeam(this.id, { id: team.id!, name: team.name! })
        .subscribe({
          next: (team) => this.#router.navigate(['/', 'teams', team.id]),
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
