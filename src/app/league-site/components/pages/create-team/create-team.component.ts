import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
  standalone: true,
  selector: 'create-team',
  templateUrl: './create-team.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, ReactiveFormsModule, InputTextModule],
})
export class CreateTeamComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  form = this.#fb.group({
    id: this.#fb.nonNullable.control("", [Validators.required, Validators.minLength(2), Validators.maxLength(3)]),
    name: this.#fb.nonNullable.control("", [Validators.required, Validators.minLength(5), Validators.maxLength(25)])
  });
  createTeam() {
    if (!this.form.valid) {
      throw new Error("Form is not valid.");
    }
    const team = this.form.value;
    this.#leagueService.createTeam({id: team.id!, name: team.name!}).subscribe({
      next: (team) => this.#router.navigate(['/', 'teams', team.id])      
    });
  }
}
