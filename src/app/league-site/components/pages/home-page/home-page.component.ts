import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
})
export class HomePageComponent {
  #leagueService = inject(LeagueService);
  league$ = this.#leagueService.watchLeague$();
}
