import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayStats } from 'src/app/league-site/models/play-stats';
import { LeagueService } from 'src/app/league-site/services/league.service';

@Component({
  standalone: true,
  selector: 'play-list-item',
  templateUrl: './play-list-item.component.html',
  imports: [CommonModule, RouterModule],
})
export class PlayListItemComponent {
  @Input() playStats!: PlayStats;
  playDisplay: Array<string> = ['1st', '2nd', '3rd', '4th'];
}
