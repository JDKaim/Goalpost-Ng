import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayListComponent } from '@league-site/components/controls/play-list/play-list.component';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { GameData } from 'src/app/league-site/models/entities/game-data';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayerService } from 'src/app/league-site/services/player.service';

@Component({
  standalone: true,
  selector: 'view-game',
  templateUrl: './view-game.component.html',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    GamePipe,
    ProgressBarModule,
    PlayListComponent
  ],
})
export class ViewGameComponent {
  #gameService = inject(GameService);
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  gameData$ = new Observable<ApiResponse<GameData>>();
  errors = new Array<Message>();
  currentDown = 1;
  currentYardLine = 40;
  currentHomePossession = true;
  playDisplay: Array<string> = ['1st', '2nd', '3rd', '4th'];
  // gameData$ = new Observable<ApiResponse<>>();

  ngOnInit(): void {
    this.gameData$ = this.#gameService.getGameData(this.id).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      if (!response.result.plays.length) {
        return;
      }
      const lastPlay = response.result.plays[response.result.plays.length - 1];
      this.currentHomePossession = lastPlay.isHomePlay;
      if (lastPlay.down === 4) {
        this.currentDown = 1;
        this.currentYardLine = 40;
        this.currentHomePossession = !this.currentHomePossession;
      } else {
        if (lastPlay.turnoverType != 'None') {
          this.currentDown = 1;
          if (lastPlay.yardLine - lastPlay.yardage === 40) {
            this.currentYardLine = 40;
          } else {
            this.currentHomePossession = !this.currentHomePossession;
            this.currentYardLine = 40 - (lastPlay.yardLine - lastPlay.yardage);
          }
        } else if (lastPlay.yardLine - lastPlay.yardage === 0) {
          this.currentDown = 1;
          this.currentYardLine = 40;
          this.currentHomePossession = !this.currentHomePossession;
        } else {
          this.currentDown = lastPlay.down + 1;
          this.currentYardLine = lastPlay.yardLine - lastPlay.yardage;
        }
      }
    }));
  }

}
