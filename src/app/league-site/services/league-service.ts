import { Injectable } from '@angular/core';
import {
  ReplaySubject,
  interval,
  map,
  of,
  subscribeOn,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { League } from '../models/league';
import { Team } from '../models/team';
import { CreateTeam } from '../models/create-team';
import { EditTeam } from '../models/edit-team';
import { CreatePlayer } from '../models/create-player';
import { EditPlayer } from '../models/edit-player';
import { CreateGame } from '../models/create-game';
import { EditGame } from '../models/edit-game';
import { PlayerGame } from '../models/player-game';
import { Player } from '../models/player';

// NOTE: This service is overly complicated because of the way it's dealing with local data. If dealing with
// a proper database or backend service this would probablyend up a bit cleaner.

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private static LeagueStorageKey = 'league';

  #subject = new ReplaySubject<League>(1);

  #league: League;

  constructor() {
    this.#league = this.#loadData();
    this.#subject.next(this.#league);
    this.watchLeague$().subscribe({ next: (league) => this.#saveData(league) });
    // interval(5000).subscribe({
    //   next: () => {
    //     this.#league.teams.push({ name: 'Washington State', id: '2' });
    //     this.#subject.next(this.#league);
    //   },
    // });
  }

  watchLeague$() {
    return this.#subject.asObservable();
  }

  watchTeam$(id: string) {
    return this.watchLeague$().pipe(
      map((league) => league.teams.find((team) => team.id === id))
    );
  }

  watchPlayer$(id: string) {
    return this.watchLeague$().pipe(
      map((league) => league.players.find((player) => player.id === id))
    );
  }

  watchGame$(id: string) {
    return this.watchLeague$().pipe(
      map((league) => league.games.find((game) => game.id === id))
    );
  }

  watchTeams$() {
    return this.watchLeague$().pipe(map((league) => league.teams));
  }

  watchPlayers$() {
    return this.watchLeague$().pipe(map((league) => league.players));
  }

  watchGames$() {
    return this.watchLeague$().pipe(map((league) => league.games));
  }

  #saveData(league: League) {
    localStorage.setItem(
      LeagueService.LeagueStorageKey,
      JSON.stringify(league)
    );
  }

  resetLeague() {
    this.#league = {
      teams: [
        { name: 'Washington', id: 'WASH' },
        { name: 'Oregon', id: 'ORE' },
      ],
      players: [
        { name: 'Michael Penix, Jr.', id: '009' },
        { name: 'Bo Nix', id: '010' },
      ],
      games: [],
    };
    this.#saveData(this.#league);
  }

  #loadData() {
    const json = localStorage.getItem(LeagueService.LeagueStorageKey);
    try {
      this.#league = JSON.parse(json!) as League;
      if (this.#league) {
        return this.#league;
      }
    } catch {}
    this.resetLeague();
    return this.#league;
  }

  createTeam(team: CreateTeam) {
    team.id = team.id.trim();
    team.name = team.name.trim();
    if (!team.id || !team.name) {
      throw new Error('Team must have ID and name.');
    }
    if (this.#league.teams.find((curTeam) => curTeam.name === team.name)) {
      throw new Error('Team name already exists.');
    }
    if (this.#league.teams.find((curTeam) => curTeam.id === team.id)) {
      throw new Error('Team ID already exists.');
    }
    this.#league.teams.push({ ...team });
    this.#subject.next(this.#league);
    return of(team);
  }

  editTeam(id: string, newTeam: EditTeam) {
    newTeam.id = newTeam.id.trim();
    newTeam.name = newTeam.name.trim();
    const team = this.#league.teams.find((team) => team.id === id);
    if (!team) {
      throw new Error('Team being edited does not exist.');
    }
    if (
      team.name != newTeam.name &&
      this.#league.teams.some((curTeam) => curTeam.name === newTeam.name)
    ) {
      throw new Error('Team name already exists.');
    }
    if (
      team.id != newTeam.id &&
      this.#league.teams.some((curTeam) => curTeam.id === newTeam.id)
    ) {
      throw new Error('Team ID already exists.');
    }
    team.id = newTeam.id;
    team.name = newTeam.name;
    this.#subject.next(this.#league);
    return of(team);
  }

  deleteTeam(id: string) {
    this.#league.teams = this.#league.teams.filter((team) => team.id != id);
    this.#subject.next(this.#league);
    return of(true);
  }

  createPlayer(player: CreatePlayer) {
    player.id = player.id.trim();
    player.name = player.name.trim();
    if (!player.id || !player.name) {
      throw new Error('Player must have ID and name.');
    }
    if (
      this.#league.players.find((curPlayer) => curPlayer.name === player.name)
    ) {
      throw new Error('Player name already exists.');
    }
    if (this.#league.players.find((curPlayer) => curPlayer.id === player.id)) {
      throw new Error('Player ID already exists.');
    }
    this.#league.players.push({ ...player });
    this.#subject.next(this.#league);
    return of(player);
  }

  editPlayer(id: string, newPlayer: EditPlayer) {
    newPlayer.id = newPlayer.id.trim();
    newPlayer.name = newPlayer.name.trim();
    const player = this.#league.players.find((player) => player.id === id);
    if (!player) {
      throw new Error('Player being edited does not exist.');
    }
    if (
      player.name != newPlayer.name &&
      this.#league.players.some(
        (curPlayer) => curPlayer.name === newPlayer.name
      )
    ) {
      throw new Error('Player name already exists.');
    }
    player.name = newPlayer.name;
    this.#subject.next(this.#league);
    return of(player);
  }

  deletePlayer(id: string) {
    this.#league.players = this.#league.players.filter(
      (player) => player.id != id
    );
    this.#subject.next(this.#league);
    return of(true);
  }

  createGame(game: CreateGame) {
    if (this.#league.games.find((leagueGame) => leagueGame.id === game.id)) {
      throw new Error('Game ID already exists.');
    }
    const homeTeam = this.#league.teams.find(
      (team) => team.id === game.homeTeamId
    );
    if (!homeTeam) {
      throw new Error('Home Team in game does not exist.');
    }
    const awayTeam = this.#league.teams.find(
      (team) => team.id === game.awayTeamId
    );
    if (!awayTeam) {
      throw new Error('Away Team in game does not exist.');
    }
    this.#league.games.push(game);
    this.#subject.next(this.#league);
    return of(game);
  }

  editGame(id: string, editGame: EditGame) {
    return this.watchGame$(id).pipe(take(1), switchMap((game) => {
      if (!game) {
        return of(null);
      }
      game.location = editGame.location;
      game.startTime = editGame.startTime;
      game.status = editGame.status;
      this.#subject.next(this.#league);
      return of(game);
    }))
  }

  addPlayerToRoster(
    gameId: string,
    playerId: string,
    isHomeRoster: boolean,
    jersey: string
  ) {
    return this.watchGame$(gameId).pipe(
      take(1),
      switchMap((game) => {
        if (!game) {
          return of(false);
        }
        if (game.awayRoster.find((player) => player.id === playerId)) {
          return of(false);
        }
        if (game.homeRoster.find((player) => player.id === playerId)) {
          return of(false);
        }
        return this.watchPlayer$(playerId).pipe(
          take(1),
          switchMap((player) => {
            if (!player) {
              return of(false);
            }
            if (isHomeRoster) {
              game.homeRoster.push({ id: playerId, jersey });
            } else {
              game.awayRoster.push({ id: playerId, jersey });
            }
            this.#subject.next(this.#league);
            return of(true);
          })
        );
      })
    );
  }

  removePlayerFromRoster(
    gameId: string,
    playerId: string,
    isHomeRoster: boolean
  ) {
    return this.watchGame$(gameId).pipe(
      take(1),
      switchMap((game) => {
        if (!game) {
          return of(false);
        }
        if (isHomeRoster) {
          const player = game.homeRoster.find(
            (rosterPlayer) => rosterPlayer.id === playerId
          );
          if (!player) {
            return of(false);
          }
          game.homeRoster = game.homeRoster.filter(
            (rosterPlayer) => rosterPlayer.id != player.id
          );
          this.#subject.next(this.#league);
          return of(true);
        }
        const player = game.awayRoster.find(
          (rosterPlayer) => rosterPlayer.id === playerId
        );
        if (!player) {
          return of(false);
        }
        game.awayRoster = game.awayRoster.filter(
          (rosterPlayer) => rosterPlayer.id != player.id
        );
        this.#subject.next(this.#league);
        return of(true);
      })
    );
  }

  watchRoster$(id: string, homeTeam: boolean) {
    return this.watchGame$(id).pipe(switchMap((game) => {
      if (!game) {
        return of(new Array<Player>());
      }
      if (homeTeam) {
        return of(game.homeRoster.map((playerGame) => this.#league.players.find(player => player.id === playerGame.id)!));
      }
      return of(game.awayRoster.map((playerGame) => this.#league.players.find(player => player.id === playerGame.id)!));
    }))
  }
}
