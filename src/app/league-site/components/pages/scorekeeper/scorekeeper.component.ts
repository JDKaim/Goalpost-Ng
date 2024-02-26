import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, combineLatest, map, takeUntil, tap } from 'rxjs';
import { mustBeDifferentValidator } from 'src/app/league-site/helpers/custom-validators';
import { Game } from 'src/app/league-site/models/game';
import { Play } from 'src/app/league-site/models/play';
import { PlayType } from 'src/app/league-site/models/play-type';
import { Player } from 'src/app/league-site/models/player';
import { TurnoverType } from 'src/app/league-site/models/turnover-type';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { LeagueService } from 'src/app/league-site/services/league-service';

@Component({
  standalone: true,
  selector: 'scorekeeper',
  templateUrl: './scorekeeper.component.html',
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
  ],
})
export class ScorekeeperComponent {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() id!: string;
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    type: this.#fb.nonNullable.control<PlayType>('passing', [
      Validators.required,
    ]),
    down: this.#fb.nonNullable.control(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(4),
    ]),
    distanceToGo: this.#fb.nonNullable.control(40, [
      Validators.required,
      Validators.min(1),
      Validators.max(40),
    ]),
    yardline: this.#fb.nonNullable.control(40, [
      Validators.required,
      Validators.min(1),
      Validators.max(40),
    ]),
    points: this.#fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(6),
    ]),
    yardage: this.#fb.nonNullable.control(0, [Validators.required]),
    offensiveTeamId: this.#fb.nonNullable.control('', [Validators.required]),
    defensiveTeamId: this.#fb.nonNullable.control('', [Validators.required]),
    completedPass: this.#fb.nonNullable.control(false, [Validators.required]),
    earnedFirstDown: this.#fb.nonNullable.control(false, [Validators.required]),
    sack: this.#fb.nonNullable.control(false, [Validators.required]),
    passer: this.#fb.nonNullable.control('', [Validators.required]),
    rusher: this.#fb.nonNullable.control('', [Validators.required]),
    receiver: this.#fb.nonNullable.control('', [Validators.required]),
    flagPuller: this.#fb.nonNullable.control('', [Validators.required]),
    turnoverType: this.#fb.nonNullable.control<TurnoverType>('interception', [
      Validators.required,
    ]),
    turnoverPlayer: this.#fb.nonNullable.control('', [Validators.required]),
    penalty: this.#fb.nonNullable.control('', [Validators.required]),
    penaltyPlayer: this.#fb.nonNullable.control('', [Validators.required]),
    penaltyYardage: this.#fb.nonNullable.control(0, [Validators.required]),
  });

  playTypes: Array<{ label: string; value: PlayType }> = [
    { label: 'Rushing', value: 'rushing' },
    { label: 'Passing', value: 'passing' },
    { label: 'Punt', value: 'punt' },
    { label: '1-PT Pass', value: 'one-point-pass' },
    { label: '2-PT Pass', value: 'two-point-pass' },
    { label: '1-PT Rush', value: 'one-point-rush' },
    { label: '2-PT Rush', value: 'two-point-rush' },
  ];

  teams$ = this.#leagueService.watchTeams$();
  players$ = this.#leagueService.watchPlayers$();
  plays$ = new Observable<Play[]>();
  homeRoster$ = new Observable<Player[]>();
  awayRoster$ = new Observable<Player[]>();
  errors = new Array<Message>();
  game$ = new Observable<Game | undefined>();

  ngOnInit(): void {
    // this.#leagueService.createPlay(this.id, {
    //   down: 1,
    //   distanceToGo: 10,
    //   yardLine: 25,
    //   yardage: 6,
    //   type: 'passing',
    //   offensiveTeamId: 'WASH',
    //   defensiveTeamId: 'ORE',
    //   completedPass: true,
    //   earnedFirstDown: false,
    //   points: 0,
    //   sack: false,
    //   passer: '009',
    //   receiver: '009',
    //   flagPuller: '010',
    // }).subscribe();
    this.homeRoster$ = this.#leagueService.watchRoster$(this.id, true);
    this.awayRoster$ = this.#leagueService.watchRoster$(this.id, false);
    this.plays$ = this.#leagueService.watchPlays$(this.id);
    this.game$ = this.#leagueService.watchGame$(this.id);
  }
}
