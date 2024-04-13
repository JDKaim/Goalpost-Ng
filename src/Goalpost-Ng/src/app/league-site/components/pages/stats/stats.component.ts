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
import { Player } from '@league-site/models/dtos';
import { DefensiveStats } from '@league-site/models/entities/defensive-stats';
import { PassingStats } from '@league-site/models/entities/passing-stats';
import { RushingStats } from '@league-site/models/entities/rushing-stats';
import { ReceivingStats } from '@league-site/models/entities/receiving-stats';

@Component({
  standalone: true,
  selector: 'stats',
  templateUrl: './stats.component.html',
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
    TableModule,
    TooltipModule
  ],
})
export class StatsComponent {
  #gameService = inject(GameService);
  #playerService = inject(PlayerService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  gameData$ = new Observable<ApiResponse<GameData>>();
  players$ = new Observable<ApiResponse<Player[]>>();
  errors = new Array<Message>();
  passingStats = new Array<PassingStats>();
  rushingStats = new Array<RushingStats>();
  receivingStats = new Array<ReceivingStats>();
  defensiveStats = new Array<DefensiveStats>();
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
    this.players$ = this.#playerService.searchPlayers({}).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      if (!response.result.length) {
        return;
      }
      response.result.forEach((player) => {
        if (player.passingAttempts > 0) {
          this.passingStats.push(new PassingStats(player));
        }
        if (player.rushingAttempts > 0) {
          this.rushingStats.push(new RushingStats(player));
        }
        if (player.receivingTargets > 0) {
          this.receivingStats.push(new ReceivingStats(player));
        }
        this.defensiveStats.push(new DefensiveStats(player));
      });
    }));
  }
}
