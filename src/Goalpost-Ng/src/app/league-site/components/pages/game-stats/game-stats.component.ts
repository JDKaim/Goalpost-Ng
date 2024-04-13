import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayListComponent } from '@league-site/components/controls/play-list/play-list.component';
import { Message } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabMenuModule } from 'primeng/tabmenu';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { GameData } from 'src/app/league-site/models/entities/game-data';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayerService } from 'src/app/league-site/services/player.service';
import { MenuItem } from 'primeng/api';
import { PassingGameStats } from '@league-site/models/entities/passing-game-stats';
import { TableModule } from 'primeng/table';
import { RushingGameStats } from '@league-site/models/entities/rushing-game-stats';
import { ReceivingGameStats } from '@league-site/models/entities/receiving-game-stats';
import { DefensiveGameStats } from '@league-site/models/entities/defensive-game-stats';

@Component({
  standalone: true,
  selector: 'game-stats',
  templateUrl: './game-stats.component.html',
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
    PlayListComponent,
    TabMenuModule,
    BadgeModule,
    TableModule
  ],
})
export class GameStatsComponent {
  #gameService = inject(GameService);
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  gameData$ = new Observable<ApiResponse<GameData>>();
  errors = new Array<Message>();
  passingGames = new Array<PassingGameStats>();
  rushingGames = new Array<RushingGameStats>();
  receivingGames = new Array<ReceivingGameStats>();
  defensiveGames = new Array<DefensiveGameStats>();
  currentDown = 1;
  currentYardLine = 40;
  currentHomePossession = true;
  playDisplay: Array<string> = ['1st', '2nd', '3rd', '4th'];
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Passing', icon: 'pi pi-fw pi-caret-up' },
      { label: 'Rushing', icon: 'pi pi-fw pi-caret-right' },
      { label: 'Receiving', icon: 'pi pi-fw pi-caret-down' },
      { label: 'Defense', icon: 'pi pi-fw pi-caret-left' }
    ];


    this.activeItem = this.items[0];
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
        } else if ((lastPlay.type === 'Passing' || lastPlay.type === 'OnePointPass' || lastPlay.type === 'TwoPointPass') && !lastPlay.isCompletedPass && !lastPlay.isSack && lastPlay.turnoverType === 'None') {
            this.currentDown = lastPlay.down + 1;
            this.currentYardLine = lastPlay.yardLine - lastPlay.yardage;
        } else if (lastPlay.yardLine - lastPlay.yardage === 0 || lastPlay.yardLine - lastPlay.yardage === 40) {
          this.currentDown = 1;
          this.currentYardLine = 40;
          this.currentHomePossession = !this.currentHomePossession;
        } else {
          this.currentDown = lastPlay.down + 1;
          this.currentYardLine = lastPlay.yardLine - lastPlay.yardage;
        }
      }
      response.result.awayRoster.forEach((player) => {
        if (player.playerGame.passingAttempts > 0) {
          this.passingGames.push(new PassingGameStats(player));
        }
        if (player.playerGame.rushingAttempts > 0) {
          this.rushingGames.push(new RushingGameStats(player));
        }
        if (player.playerGame.receivingTargets > 0) {
          this.receivingGames.push(new ReceivingGameStats(player));
        }
        this.defensiveGames.push(new DefensiveGameStats(player));
      })
      response.result.homeRoster.forEach((player) => {
        if (player.playerGame.passingAttempts > 0) {
          this.passingGames.push(new PassingGameStats(player));
        }
        if (player.playerGame.rushingAttempts > 0) {
          this.rushingGames.push(new RushingGameStats(player));
        }
        if (player.playerGame.receivingTargets > 0) {
          this.receivingGames.push(new ReceivingGameStats(player));
        }
        this.defensiveGames.push(new DefensiveGameStats(player));
      })
    }));
  }

}
