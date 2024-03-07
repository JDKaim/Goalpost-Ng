import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayStats } from 'src/app/league-site/models/play-stats';
import { LeagueService } from 'src/app/league-site/services/league.service';
import { PlayListItemComponent } from '../play-list-item/play-list-item.component';
import { ProgressBar, ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  standalone: true,
  selector: 'play-list',
  templateUrl: './play-list.component.html',
  imports: [CommonModule, PlayListItemComponent, ProgressBarModule, SkeletonModule],
})
export class PlayListComponent implements OnInit {
  #leagueService = inject(LeagueService);
  @Input() gameId!: string;
  playStats$ = new Observable<Array<PlayStats>>();

  ngOnInit(): void {
    this.playStats$ = this.#leagueService.watchPlayStats$(this.gameId);
  }
}
