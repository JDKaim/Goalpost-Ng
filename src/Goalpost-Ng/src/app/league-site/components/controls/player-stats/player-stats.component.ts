import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { Play } from 'src/app/league-site/models/dtos/play';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayListItemComponent } from '../play-list-item/play-list-item.component';
import { GameData } from 'src/app/league-site/models/entities/game-data';
import { PlayDisplay } from 'src/app/league-site/models/entities/play-display';
import { SuccessApiResponse } from 'src/app/league-site/models/api/success-api-response';
import { Player, PlayerGame } from '@league-site/models';

@Component({
  standalone: true,
  selector: 'player-stats',
  templateUrl: './player-stats.component.html',
  imports: [
    CommonModule,
    PlayListItemComponent,
    ProgressBarModule,
    SkeletonModule,
  ],
})
export class PlayerStatsComponent implements OnInit{
  @Input() player!: Player;
  completionPercentage = 0;
  passingPoints = 0;
  passingYardagePerAttempt = 0;
  passingYardagePerCompletion = 0;
  rushingPoints = 0;
  rushingYardagePerAttempt = 0;
  receptionPercentage = 0;
  receivingYardagePerAttempt = 0;
  receivingYardagePerCompletion = 0;
  receivingPoints = 0;
  defensivePoints = 0;
  
  ngOnInit(): void {
    this.completionPercentage = Math.round(100 * this.player.passingCompletions / this.player.passingAttempts);
    this.passingPoints = this.player.passingTds * 6 + this.player.passingTwoPointConversions * 2 + this.player.passingOnePointConversions;
    this.passingYardagePerAttempt = Math.round(10 * this.player.passingYardage / this.player.passingAttempts) / 10;
    this.passingYardagePerCompletion = Math.round(10 * this.player.passingYardage / this.player.passingCompletions) / 10;
    this.rushingYardagePerAttempt = Math.round(10 * this.player.rushingYardage / this.player.rushingAttempts) / 10;
    this.rushingPoints = this.player.rushingTds * 6 + this.player.rushingTwoPointConversions * 2 + this.player.rushingOnePointConversions;
    this.receptionPercentage = Math.round(100 * this.player.receivingCompletions / this.player.receivingTargets);
    this.receivingYardagePerAttempt = Math.round(10 * this.player.receivingYardage / this.player.receivingTargets) / 10;
    this.receivingYardagePerCompletion = Math.round(10 * this.player.receivingYardage / this.player.receivingCompletions) / 10;
    this.receivingPoints = this.player.receivingTds * 6 + this.player.receivingTwoPointConversions * 2 + this.player.receivingOnePointConversions;
    this.defensivePoints = this.player.defensiveTds * 6 + this.player.defensiveTwoPointConversions * 2 + this.player.defensiveOnePointConversions;
  }
}
