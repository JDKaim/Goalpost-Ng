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
  passingTouchdownsPerAttempt = 0;
  passingInterceptionsPerAttempt = 0;
  rushingPoints = 0;
  rushingYardagePerAttempt = 0;
  receptionPercentage = 0;
  receivingYardagePerAttempt = 0;
  receivingYardagePerCompletion = 0;
  receivingPoints = 0;
  defensivePoints = 0;
  collegePasserRating = 0;
  nflPasserRating = 0;

  
  ngOnInit(): void {
    this.collegePasserRating = this.player.passingAttempts ? ((8.4 * this.player.passingYardage) + (330 * this.player.passingTds) + (100 * this.player.passingCompletions) - (200 * this.player.passingInterceptions)) / (this.player.passingAttempts) : 0;
    this.completionPercentage = this.player.passingAttempts ? this.player.passingCompletions / this.player.passingAttempts : 0;
    this.passingPoints = this.player.passingTds * 6 + this.player.passingTwoPointConversions * 2 + this.player.passingOnePointConversions;
    this.passingYardagePerAttempt = this.player.passingAttempts ? this.player.passingYardage / this.player.passingAttempts : 0;
    this.passingYardagePerCompletion = this.player.passingCompletions ? this.player.passingYardage / this.player.passingCompletions : 0;
    this.passingTouchdownsPerAttempt = this.player.passingAttempts ? this.player.passingTds / this.player.passingAttempts : 0;
    this.passingInterceptionsPerAttempt = this.player.passingAttempts ? this.player.passingInterceptions / this.player.passingAttempts : 0;
    this.nflPasserRating = (Math.max(0, Math.min(((this.completionPercentage - 0.3) * 5), 2.375)) + Math.max(0, Math.min(((this.passingYardagePerAttempt - 3) * 0.25), 2.375)) + Math.max(0, Math.min((this.passingTouchdownsPerAttempt * 20), 2.375)) + Math.max(0, (2.375 - (this.passingInterceptionsPerAttempt * 25)))) * 100 / 6;
    this.rushingYardagePerAttempt = this.player.rushingAttempts ? this.player.rushingYardage / this.player.rushingAttempts : 0;
    this.rushingPoints = this.player.rushingTds * 6 + this.player.rushingTwoPointConversions * 2 + this.player.rushingOnePointConversions;
    this.receptionPercentage = this.player.receivingTargets ? this.player.receivingCompletions / this.player.receivingTargets : 0;
    this.receivingYardagePerAttempt = this.player.receivingTargets ? this.player.receivingYardage / this.player.receivingTargets : 0;
    this.receivingYardagePerCompletion = this.player.receivingCompletions ? this.player.receivingYardage / this.player.receivingCompletions : 0;
    this.receivingPoints = this.player.receivingTds * 6 + this.player.receivingTwoPointConversions * 2 + this.player.receivingOnePointConversions;
    this.defensivePoints = this.player.defensiveTds * 6 + this.player.defensiveTwoPointConversions * 2 + this.player.defensiveOnePointConversions;
  }
}
