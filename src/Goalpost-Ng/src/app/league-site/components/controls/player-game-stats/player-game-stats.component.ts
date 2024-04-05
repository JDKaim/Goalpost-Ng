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
  rushingPoints = 0;
  rushingYardagePerAttempt = 0;
  receptionPercentage = 0;
  receivingYardagePerAttempt = 0;
  receivingYardagePerCompletion = 0;
  receivingPoints = 0;
  defensivePoints = 0;
  
  ngOnInit(): void {
    this.completionPercentage = Math.round(100 * this.playerGame.passingCompletions / this.playerGame.passingAttempts);
    this.passingPoints = this.playerGame.passingTds * 6 + this.playerGame.passingTwoPointConversions * 2 + this.playerGame.passingOnePointConversions;
    this.passingYardagePerAttempt = Math.round(10 * this.playerGame.passingYardage / this.playerGame.passingAttempts) / 10;
    this.passingYardagePerCompletion = Math.round(10 * this.playerGame.passingYardage / this.playerGame.passingCompletions) / 10;
    this.rushingYardagePerAttempt = Math.round(10 * this.playerGame.rushingYardage / this.playerGame.rushingAttempts) / 10;
    this.rushingPoints = this.playerGame.rushingTds * 6 + this.playerGame.rushingTwoPointConversions * 2 + this.playerGame.rushingOnePointConversions;
    this.receptionPercentage = Math.round(100 * this.playerGame.receivingCompletions / this.playerGame.receivingTargets);
    this.receivingYardagePerAttempt = Math.round(10 * this.playerGame.receivingYardage / this.playerGame.receivingTargets) / 10;
    this.receivingYardagePerCompletion = Math.round(10 * this.playerGame.receivingYardage / this.playerGame.receivingCompletions) / 10;
    this.receivingPoints = this.playerGame.receivingTds * 6 + this.playerGame.receivingTwoPointConversions * 2 + this.playerGame.receivingOnePointConversions;
    this.defensivePoints = this.playerGame.defensiveTds * 6 + this.playerGame.defensiveTwoPointConversions * 2 + this.playerGame.defensiveOnePointConversions;
  }
}
