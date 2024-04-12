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
  selector: 'player-game-stats',
  templateUrl: './player-game-stats.component.html',
  imports: [
    CommonModule,
    PlayListItemComponent,
    ProgressBarModule,
    SkeletonModule,
  ],
})
export class PlayerGameStatsComponent implements OnInit{
  @Input() playerGame!: PlayerGame;
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
    this.collegePasserRating = this.playerGame.passingAttempts ? ((8.4 * this.playerGame.passingYardage) + (330 * this.playerGame.passingTds) + (100 * this.playerGame.passingCompletions) - (200 * this.playerGame.passingInterceptions)) / (this.playerGame.passingAttempts) : 0;
    this.completionPercentage = this.playerGame.passingAttempts ? this.playerGame.passingCompletions / this.playerGame.passingAttempts : 0;
    this.passingPoints = this.playerGame.passingTds * 6 + this.playerGame.passingTwoPointConversions * 2 + this.playerGame.passingOnePointConversions;
    this.passingYardagePerAttempt = this.playerGame.passingAttempts ? this.playerGame.passingYardage / this.playerGame.passingAttempts : 0;
    this.passingYardagePerCompletion = this.playerGame.passingCompletions ? this.playerGame.passingYardage / this.playerGame.passingCompletions : 0;
    this.passingTouchdownsPerAttempt = this.playerGame.passingAttempts ? this.playerGame.passingTds / this.playerGame.passingAttempts : 0;
    this.passingInterceptionsPerAttempt = this.playerGame.passingAttempts ? this.playerGame.passingInterceptions / this.playerGame.passingAttempts : 0;
    this.nflPasserRating = (Math.max(0, Math.min(((this.completionPercentage - 0.3) * 5), 2.375)) + Math.max(0, Math.min(((this.passingYardagePerAttempt - 3) * 0.25), 2.375)) + Math.max(0, Math.min((this.passingTouchdownsPerAttempt * 20), 2.375)) + Math.max(0, (2.375 - (this.passingInterceptionsPerAttempt * 25)))) * 100 / 6;
    this.rushingYardagePerAttempt = this.playerGame.rushingAttempts ? this.playerGame.rushingYardage / this.playerGame.rushingAttempts : 0;
    this.rushingPoints = this.playerGame.rushingTds * 6 + this.playerGame.rushingTwoPointConversions * 2 + this.playerGame.rushingOnePointConversions;
    this.receptionPercentage = this.playerGame.receivingTargets ? this.playerGame.receivingCompletions / this.playerGame.receivingTargets : 0;
    this.receivingYardagePerAttempt = this.playerGame.receivingTargets ? this.playerGame.receivingYardage / this.playerGame.receivingTargets : 0;
    this.receivingYardagePerCompletion = this.playerGame.receivingCompletions ? this.playerGame.receivingYardage / this.playerGame.receivingCompletions : 0;
    this.receivingPoints = this.playerGame.receivingTds * 6 + this.playerGame.receivingTwoPointConversions * 2 + this.playerGame.receivingOnePointConversions;
    this.defensivePoints = this.playerGame.defensiveTds * 6 + this.playerGame.defensiveTwoPointConversions * 2 + this.playerGame.defensiveOnePointConversions;
  }
}
