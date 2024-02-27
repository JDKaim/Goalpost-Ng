import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable, combineLatest, map, switchMap, take } from 'rxjs';
import { Game } from 'src/app/league-site/models/game';
import { GameStats } from 'src/app/league-site/models/game-stats';
import { Player } from 'src/app/league-site/models/player';
import { Team } from 'src/app/league-site/models/team';
import { TeamPipe } from 'src/app/league-site/pipes/team.pipe';
import { PlayerPipe } from 'src/app/league-site/pipes/player.pipe';
import { LeagueService } from 'src/app/league-site/services/league-service';
import { Play } from 'src/app/league-site/models/play';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'rush-play',
  templateUrl: './rush-play.component.html',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TeamPipe,
    PlayerPipe,
  ],
})
export class RushPlayComponent implements OnInit {
  #leagueService = inject(LeagueService);
  #router = inject(Router);
  @Input() play!: Play;
  offensiveTeam$ = new Observable<Team | undefined>();
  defensiveTeam$ = new Observable<Team | undefined>();
  rushPlayer$ = new Observable<Player | undefined>();
  flagPuller$ = new Observable<Player | undefined>();
  turnoverPlayer$ = new Observable<Player | undefined>();
  combined$ = new Observable<{
    offensiveTeam: Team;
    defensiveTeam: Team;
    rushPlayer: Player;
    flagPuller: Player | undefined;
    turnoverPlayer: Player | undefined;
  }>();

  playDisplay: Array<string> = ['1st', '2nd', '3rd', '4th'];

  ngOnInit(): void {
    this.rushPlayer$ = this.#leagueService
      .watchPlayer$(this.play.rusher!)
      .pipe(take(1));
    this.offensiveTeam$ = this.#leagueService
      .watchTeam$(this.play.offensiveTeamId)
      .pipe(take(1));
    this.defensiveTeam$ = this.#leagueService
      .watchTeam$(this.play.defensiveTeamId)
      .pipe(take(1));
    if (this.play.turnoverType) {
      this.turnoverPlayer$ = this.#leagueService
        .watchPlayer$(this.play.turnoverPlayer!)
        .pipe(take(1));
      this.combined$ = combineLatest([
        this.offensiveTeam$,
        this.defensiveTeam$,
        this.rushPlayer$,
        this.turnoverPlayer$,
      ]).pipe(
        map((results) => {
          return {
            offensiveTeam: results[0]!,
            defensiveTeam: results[1]!,
            rushPlayer: results[2]!,
            flagPuller: undefined,
            turnoverPlayer: results[3],
          };
        })
      );
    } else {
      if (this.play.points) {
        this.combined$ = combineLatest([
          this.offensiveTeam$,
          this.defensiveTeam$,
          this.rushPlayer$,
        ]).pipe(
          map((results) => {
            return {
              offensiveTeam: results[0]!,
              defensiveTeam: results[1]!,
              rushPlayer: results[2]!,
              flagPuller: undefined,
              turnoverPlayer: undefined,
            };
          })
        );
      } else {
        this.flagPuller$ = this.#leagueService
          .watchPlayer$(this.play.flagPuller!)
          .pipe(take(1));
        this.combined$ = combineLatest([
          this.offensiveTeam$,
          this.defensiveTeam$,
          this.rushPlayer$,
          this.flagPuller$,
        ]).pipe(
          map((results) => {
            return {
              offensiveTeam: results[0]!,
              defensiveTeam: results[1]!,
              rushPlayer: results[2]!,
              flagPuller: results[3],
              turnoverPlayer: undefined,
            };
          })
        );
      }
    }
  }
}
