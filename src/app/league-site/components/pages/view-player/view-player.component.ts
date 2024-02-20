import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { Player } from 'src/app/league-site/models/player';
import { Team } from 'src/app/league-site/models/team';
import { TeamPipe } from 'src/app/league-site/pipes/team.pipe';
import { PlayerPipe } from 'src/app/league-site/pipes/player.pipe';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
    standalone: true,
    selector: 'view-player',
    templateUrl: './view-player.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, TeamPipe, PlayerPipe]
})
export class ViewPlayerComponent implements OnInit {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
  team$ = new Observable<Team | undefined>();
  player$ = new Observable<Player | undefined>();

  ngOnInit(): void {
    this.player$ = this.#leagueService.watchPlayer$(this.id);
  }

  deletePlayer(): void {
    this.#leagueService.deletePlayer(this.id).subscribe({
      next: () => this.#router.navigate(['/'])
    });
  }
}
