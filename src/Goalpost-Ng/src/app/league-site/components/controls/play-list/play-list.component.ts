import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, map } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { SuccessApiResponse } from 'src/app/league-site/models/api/success-api-response';
import { GameData } from 'src/app/league-site/models/entities/game-data';
import { PlayDisplay } from 'src/app/league-site/models/entities/play-display';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayListItemComponent } from '../play-list-item/play-list-item.component';

@Component({
  standalone: true,
  selector: 'play-list',
  templateUrl: './play-list.component.html',
  imports: [
    CommonModule,
    PlayListItemComponent,
    ProgressBarModule,
    SkeletonModule,
  ],
})
export class PlayListComponent implements OnInit {
  #gameService = inject(GameService);
  @Input({ required: true }) gameId!: number;
  @Input() canDelete = false;
  gameData$ = new Observable<ApiResponse<GameData>>();
  plays$ = new Observable<ApiResponse<PlayDisplay[]>>();

  ngOnInit(): void {
    this.plays$ = this.#gameService.getGameData(this.gameId).pipe(
      map((response) => {
        if (!response.result) {
          return response as any as ApiResponse<PlayDisplay[]>;
        }
        return new SuccessApiResponse(
          response.result.plays.map((play) => {
            if (play.isHomePlay) {
              return new PlayDisplay(
                play,
                response.result!.game.awayTeamName,
                response.result!.game.awayTeamCode,
                response.result!.game.homeTeamName,
                response.result!.game.homeTeamCode,
                response.result!.homeRoster,
                response.result!.awayRoster
              );
            } else {
              return new PlayDisplay(
                play,
                response.result!.game.awayTeamName,
                response.result!.game.awayTeamCode,
                response.result!.game.homeTeamName,
                response.result!.game.homeTeamCode,
                response.result!.awayRoster,
                response.result!.homeRoster
              );
            }
          })
        );
      })
    );
  }
}
