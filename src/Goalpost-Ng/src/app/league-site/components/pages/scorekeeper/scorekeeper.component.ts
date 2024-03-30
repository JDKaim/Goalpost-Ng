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
import { Observable, of, tap } from 'rxjs';
import { Player } from 'src/app/league-site/models/dtos/player';
import { PlayType } from 'src/app/league-site/models/play-type';
import { TurnoverType } from 'src/app/league-site/models/turnover-type';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { GameService } from 'src/app/league-site/services/game.service';
import { PlayListComponent } from '../../controls/play-list/play-list.component';
import { PassPlayComponent } from '../../controls/plays/pass-play/pass-play.component';
import { RushPlayComponent } from '../../controls/plays/rush-play/rush-play.component';
import { RosterPlayer } from 'src/app/league-site/models/dtos/roster-player';

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
    type: this.#fb.nonNullable.control<PlayType>('Passing', [
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
    passerId: this.#fb.nonNullable.control(0, [Validators.required]),
    rusherId: this.#fb.nonNullable.control(0, [Validators.required]),
    receiverId: this.#fb.nonNullable.control(0, [Validators.required]),
    flagPullerId: this.#fb.nonNullable.control(0, [Validators.required]),
    turnoverType: this.#fb.nonNullable.control<TurnoverType>('none'),
    turnoverPlayerId: this.#fb.nonNullable.control(0, [Validators.required]),
    penalty: this.#fb.nonNullable.control('', [Validators.required]),
    penaltyPlayer: this.#fb.nonNullable.control('', [Validators.required]),
    penaltyYardage: this.#fb.nonNullable.control(0, [Validators.required]),
  });

  types: Array<{ label: string; value: PlayType }> = [
    { label: 'Rushing', value: 'Rushing' },
    { label: 'Passing', value: 'Passing' },
    { label: 'Punt', value: 'Punt' },
    { label: '1-PT Pass', value: 'OnePointPass' },
    { label: '2-PT Pass', value: 'TwoPointPass' },
    { label: '1-PT Rush', value: 'OnePointRush' },
    { label: '2-PT Rush', value: 'TwoPointRush' },
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
  offensiveTeamRoster$ = new Observable<RosterPlayer[]>();
  defensiveTeamRoster$ = new Observable<RosterPlayer[]>();
  errors = new Array<Message>();
  possibleDistances: Array<number> = [];

  constructor() {
    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (type) => this.#updateForm(type),
    });
    this.form.controls.yardage.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (yardage) => {
          this.form.controls.flagPullerId.disable();
          if (this.form.controls.yardLine.value - yardage > 0) {
            this.form.controls.flagPullerId.enable();
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
          this.form.controls.turnoverPlayerId.disable();
          this.form.controls.flagPullerId.enable();
          this.form.controls.yardage.enable();
          if (turnoverType === 'interception' || turnoverType === 'fumble') {
            this.form.controls.turnoverPlayerId.enable();
            this.form.controls.flagPullerId.disable();
            this.form.controls.yardage.disable();
          }
          if (this.form.controls.yardLine.value - this.form.controls.yardage.value > 0) {
            this.form.controls.flagPullerId.disable();
          }
        },
      });
    this.#updateForm(this.form.controls.type.value);
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

  #updateForm(type: PlayType) {
    this.form.controls.isCompletedPass.disable();
    this.form.controls.flagPullerId.disable();
    this.form.controls.passerId.disable();
    this.form.controls.penalty.disable();
    this.form.controls.penaltyPlayer.disable();
    this.form.controls.penaltyYardage.disable();
    this.form.controls.receiverId.disable();
    this.form.controls.rusherId.disable();
    this.form.controls.turnoverPlayerId.disable();
    switch (type) {
      case 'OnePointPass':
      case 'TwoPointPass':
      case 'Passing':
        this.form.controls.passerId.enable();
        this.form.controls.receiverId.enable();
        this.form.controls.isCompletedPass.enable();
        break;
      case 'OnePointRush':
      case 'TwoPointRush':
      case 'Rushing':
        this.form.controls.rusherId.enable();
        break;
      case 'Punt':
        break;
      default:
        throw new Error(`Unknown play type: '${type}'`);
    }
    if (this.form.controls.yardLine.value - this.form.controls.yardage.value > 0) {
      this.form.controls.flagPullerId.enable();
    }
  }

  #updateGameData() {
    this.gameData$ = this.#gameService.getGameData(this.id).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      this.teams[0].label = response.result.game.awayTeamCode;
      this.teams[1].label = response.result.game.homeTeamCode;
      if (this.form.controls.offensiveTeamId.value === response.result.game.awayTeamCode) {
        this.offensiveTeamRoster$ = of(response.result.awayRoster);
        this.defensiveTeamRoster$ = of(response.result.homeRoster);
      } else {
        this.offensiveTeamRoster$ = of(response.result.homeRoster);
        this.defensiveTeamRoster$ = of(response.result.awayRoster);
      }
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
    //   type: 'Passing',
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
    this.#updateGameData();
    for (let i = 0; i <= 40; i++) {
      this.possibleDistances.push(i);
    }
  }
}
