import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
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
  // gameData$ = new Observable<ApiResponse<>>();

  ngOnInit(): void {
    this.gameData$ = this.#gameService.getGameData(this.id);
  }
}
