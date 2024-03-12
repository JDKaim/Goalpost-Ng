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
import { ProgressBar, ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/league-site/models/api/api-response';
import { Game } from 'src/app/league-site/models/dtos/game';
import { Player } from 'src/app/league-site/models/player';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';

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
    ProgressBarModule
  ],
})
export class ViewGameComponent {
  #gameService = inject(GameService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  players$ = new Observable<Player[]>();
  homeRoster$ = new Observable<Player[]>();
  awayRoster$ = new Observable<Player[]>();
  errors = new Array<Message>();
  game$ = new Observable<ApiResponse<Game>>();

  ngOnInit(): void {
    this.game$ = this.#gameService.getGame(this.id);
  }
}
