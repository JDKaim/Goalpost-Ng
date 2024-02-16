import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { Team } from 'src/app/league-site/models/team';
import { TeamPipe } from 'src/app/league-site/pipes/team.pipe';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
  standalone: true,
  selector: 'view-team',
  templateUrl: './view-team.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TeamPipe],
})
export class ViewTeamComponent implements OnInit {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
  team$ = new Observable<Team | undefined>();

  ngOnInit(): void {
    this.team$ = this.#leagueService.watchTeam$(this.id);
  }

  deleteTeam(): void {
    this.#leagueService.deleteTeam(this.id).subscribe({
      next: () => this.#router.navigate(['/'])
    });
  }
}
