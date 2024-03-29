import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { Player } from 'src/app/league-site/models/dtos/player';
import { PlayType } from 'src/app/league-site/models/play-type';
import { TurnoverType } from 'src/app/league-site/models/turnover-type';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayListComponent } from '../../controls/play-list/play-list.component';
import { PassPlayComponent } from '../../controls/plays/pass-play/pass-play.component';
import { RushPlayComponent } from '../../controls/plays/rush-play/rush-play.component';

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
    InputNumberModule,
    MessagesModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    GamePipe,
    SelectButtonModule,
    PassPlayComponent,
    RushPlayComponent,
    PlayListComponent
  ],
})
export class ScorekeeperComponent {
  #gameService = inject(GameService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  isHomePlay = false;
  form = this.#fb.group({
    playType: this.#fb.nonNullable.control<PlayType>('passing', [
      Validators.required,
    ]),
    down: this.#fb.nonNullable.control(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(4),
    ]),
    yardLine: this.#fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(40),
    ]),
    yardage: this.#fb.nonNullable.control(0, [Validators.required]),
    offensiveTeamId: this.#fb.nonNullable.control('', [Validators.required]),
    defensiveTeamId: this.#fb.nonNullable.control('', [Validators.required]),
    isCompletedPass: this.#fb.nonNullable.control(false, [Validators.required]),
    earnedFirstDown: this.#fb.nonNullable.control(false, [Validators.required]),
    isSack: this.#fb.nonNullable.control(false, [Validators.required]),
    passer: this.#fb.nonNullable.control('', [Validators.required]),
    rusher: this.#fb.nonNullable.control('', [Validators.required]),
    receiver: this.#fb.nonNullable.control('', [Validators.required]),
    flagPuller: this.#fb.nonNullable.control('', [Validators.required]),
    turnoverType: this.#fb.nonNullable.control<TurnoverType>('none'),
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

  turnoverTypes: Array<{ label: string; value: TurnoverType }> = [
    { label: 'No Turnover', value: 'none' },
    { label: 'Interception', value: 'interception' },
    { label: 'Fumble', value: 'fumble' },
  ];

  teams: Array<{ label: string; value: string }> = [
    { label: 'Away Team', value: 'away' },
    { label: 'Home Team', value: 'home' },
  ];

  gameData$ = this.#gameService.getGameData(this.id);
  offensiveTeamRoster$ = new Observable<Player[]>();
  defensiveTeamRoster$ = new Observable<Player[]>();
  errors = new Array<Message>();
  possibleDistances: Array<number> = [];

  constructor() {
    this.form.controls.playType.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (playType) => this.#updateForm(playType),
    });
    this.form.controls.yardage.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (yardage) => {
          this.form.controls.flagPuller.disable();
          if (this.form.controls.yardLine.value - yardage > 0) {
            this.form.controls.flagPuller.enable();
          }
        },
      });
    this.form.controls.yardLine.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (yardLine) => {
        this.possibleDistances = [];
        for (let i = 0 - (40 - yardLine); i <= yardLine; i++) {
          this.possibleDistances.push(i);
        }
      }
    })
    this.form.controls.turnoverType.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (turnoverType) => {
          this.form.controls.turnoverPlayer.disable();
          this.form.controls.flagPuller.enable();
          this.form.controls.yardage.enable();
          if (turnoverType === 'interception' || turnoverType === 'fumble') {
            this.form.controls.turnoverPlayer.enable();
            this.form.controls.flagPuller.disable();
            this.form.controls.yardage.disable();
          }
          if (this.form.controls.yardLine.value - this.form.controls.yardage.value > 0) {
            this.form.controls.flagPuller.disable();
          }
        },
      });
    this.#updateForm(this.form.controls.playType.value);
    this.form.controls.offensiveTeamId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (teamId) => {
          if (teamId === this.teams[1].value) {
            this.form.controls.defensiveTeamId.setValue(this.teams[0].value);
            this.isHomePlay = true;
          } else {
            this.form.controls.defensiveTeamId.setValue(this.teams[1].value);
            this.isHomePlay = false;
          }
        },
      });
  }

  #updateForm(playType: PlayType) {
    this.form.controls.isCompletedPass.disable();
    this.form.controls.flagPuller.disable();
    this.form.controls.passer.disable();
    this.form.controls.penalty.disable();
    this.form.controls.penaltyPlayer.disable();
    this.form.controls.penaltyYardage.disable();
    this.form.controls.receiver.disable();
    this.form.controls.rusher.disable();
    this.form.controls.turnoverPlayer.disable();
    switch (playType) {
      case 'one-point-pass':
      case 'two-point-pass':
      case 'passing':
        this.form.controls.passer.enable();
        this.form.controls.receiver.enable();
        this.form.controls.isCompletedPass.enable();
        break;
      case 'one-point-rush':
      case 'two-point-rush':
      case 'rushing':
        this.form.controls.rusher.enable();
        break;
      case 'punt':
        break;
      default:
        throw new Error(`Unknown play type: '${playType}'`);
    }
    if (this.form.controls.yardLine.value - this.form.controls.yardage.value > 0) {
      this.form.controls.flagPuller.enable();
    }
  }

  #updateGameData() {
    this.gameData$ = this.#gameService.getGameData(this.id).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      this.teams[0].label = response.result.game.awayTeamCode;
      this.teams[1].label = response.result.game.homeTeamCode;
    }));
  }

  createPlayClicked() {
    const formValue = this.form.getRawValue();
    const isHomePlay = this.isHomePlay;
    try {
      this.#gameService
        .addPlay(this.id, {
          ...formValue, isHomePlay
        })
        .subscribe({
          // next: (team) => this.#router.navigate(['/', 'teams', team.id]),
        });
    } catch (e: any) {
      this.errors.push({
        severity: 'error',
        summary: 'Error',
        detail: e.message,
      });
    }
  }

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
    console.log("Running GameData");
    this.#updateGameData();
    for (let i = 0; i <= 40; i++) {
      this.possibleDistances.push(i);
    }
  }
}
