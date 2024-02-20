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

  watchTeams$() {
    return this.watchLeague$().pipe(map((league) => league.teams));
  }

  watchPlayers$() {
    return this.watchLeague$().pipe(map((league) => league.players));
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

  editPlayer(id: string, newPlayer: EditPlayer) {
    newPlayer.id = newPlayer.id.trim();
    newPlayer.name = newPlayer.name.trim();
    const player = this.#league.players.find((player) => player.id === id);
    if (!player) {
      throw new Error('Player being edited does not exist.');
    }
    if (
      player.name != newPlayer.name &&
      this.#league.players.some((curPlayer) => curPlayer.name === newPlayer.name)
    ) {
      throw new Error('Player name already exists.');
    }
    player.name = newPlayer.name;
    this.#subject.next(this.#league);
    return of(player);
  }

  deleteTeam(id: string) {
    this.#league.teams = this.#league.teams.filter((team) => team.id != id);
    this.#subject.next(this.#league);
    return of(true);
  }

  deletePlayer(id: string) {
    this.#league.players = this.#league.players.filter((player) => player.id != id);
    this.#subject.next(this.#league);
    return of(true);
  }
}
