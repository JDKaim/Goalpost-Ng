import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { Team } from 'src/app/league-site/models/team';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
  standalone: true,
  selector: 'view-team',
  templateUrl: './view-team.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
})
export class ViewTeamComponent implements OnInit {
  #leagueService = inject(LeagueService);
  @Input() id!: string;
  team$ = new Observable<Team | undefined>();

  ngOnInit(): void {
    this.team$ = this.#leagueService.watchTeam$(this.id);
  }
}