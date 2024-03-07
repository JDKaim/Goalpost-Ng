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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, combineLatest, map, take, takeUntil, tap } from 'rxjs';
import { mustBeDifferentValidator } from 'src/app/league-site/helpers/custom-validators';
import { Game } from 'src/app/league-site/models/game';
import { Play } from 'src/app/league-site/models/play';
import { PlayType } from 'src/app/league-site/models/play-type';
import { Player } from 'src/app/league-site/models/player';
import { TurnoverType } from 'src/app/league-site/models/turnover-type';
import { GamePipe } from 'src/app/league-site/pipes/game.pipe';
import { LeagueService } from 'src/app/league-site/services/league.service';
import { PassPlayComponent } from '../../controls/plays/pass-play/pass-play.component';
import { RushPlayComponent } from '../../controls/plays/rush-play/rush-play.component';
import { PlayListComponent } from '../../controls/play-list/play-list.component';

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
      Validators.min(0),
      Validators.max(40),
    ]),
    yardLine: this.#fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
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
    turnoverType: this.#fb.control<TurnoverType | 'none'>('none'),
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

  turnoverTypes: Array<{ label: string; value: TurnoverType | 'none' }> = [
    { label: 'No Turnover', value: 'none' },
    { label: 'Interception', value: 'interception' },
    { label: 'Fumble', value: 'fumble' },
  ];

  teams: Array<{ label: string; value: string }> = [
    { label: 'Away Team', value: '' },
    { label: 'Home Team', value: '' },
  ];

  teams$ = this.#leagueService.watchTeams$();
  players$ = this.#leagueService.watchPlayers$();
  plays$ = new Observable<Play[]>();
  homeRoster$ = new Observable<Player[]>();
  awayRoster$ = new Observable<Player[]>();
  offensiveTeamRoster$ = new Observable<Player[]>();
  defensiveTeamRoster$ = new Observable<Player[]>();
  errors = new Array<Message>();
  game$ = new Observable<Game | undefined>();
  possibleDistances: Array<number> = [];

  constructor() {
    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (playType) => this.#updateForm(playType),
    });
    this.form.controls.points.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (points) => {
          this.form.controls.flagPuller.disable();
          if (!points) {
            this.form.controls.flagPuller.enable();
          }
        },
      });
    this.form.controls.yardLine.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (yardLine) => {
        this.possibleDistances = [];
        for (let i = 0 - yardLine; i <= 40 - yardLine; i++) {
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
          if (this.form.controls.points.value !== 0) {
            this.form.controls.flagPuller.disable();
          }
        },
      });
    this.#updateForm(this.form.controls.type.value);
    this.form.controls.offensiveTeamId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (teamId) => {
          if (teamId === this.teams[1].value) {
            this.offensiveTeamRoster$ = this.homeRoster$;
            this.defensiveTeamRoster$ = this.awayRoster$;
            this.form.controls.defensiveTeamId.setValue(this.teams[0].value);
          } else {
            this.offensiveTeamRoster$ = this.awayRoster$;
            this.defensiveTeamRoster$ = this.homeRoster$;
            this.form.controls.defensiveTeamId.setValue(this.teams[1].value);
          }
        },
      });
    this.form.controls.points.setValue(0);
  }

  #updateForm(playType: PlayType) {
    this.form.controls.completedPass.disable();
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
        this.form.controls.completedPass.enable();
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
    if (this.form.controls.points.value === 0) {
      this.form.controls.flagPuller.enable();
    }
  }

  createPlayClicked() {
    const formValue = this.form.getRawValue();
    try {
      this.#leagueService
        .createPlay(this.id, {
          ...formValue,
          turnoverType:
            formValue.turnoverType != 'none'
              ? formValue.turnoverType!
              : undefined,
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
    this.homeRoster$ = this.#leagueService.watchRoster$(this.id, true);
    this.awayRoster$ = this.#leagueService.watchRoster$(this.id, false);
    this.plays$ = this.#leagueService.watchPlays$(this.id);
    this.game$ = this.#leagueService.watchGame$(this.id).pipe(
      tap((game) => {
        if (!game) {
          return;
        }
        this.teams[0].label = game.awayTeamId;
        this.teams[0].value = game.awayTeamId;
        this.teams[1].label = game.homeTeamId;
        this.teams[1].value = game.homeTeamId;
        if (!this.form.controls.offensiveTeamId.value) {
          this.form.controls.offensiveTeamId.setValue(game.homeTeamId);
        }
      })
    );
    for (let i = 0; i <= 40; i++) {
      this.possibleDistances.push(i);
    }
  }
}
