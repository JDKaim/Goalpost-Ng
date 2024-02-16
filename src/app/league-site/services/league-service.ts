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

  watchTeams$() {
    return this.watchLeague$().pipe(map((league) => league.teams));
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
    };
    this.#saveData(this.#league);
  }

  #loadData() {
    const json = localStorage.getItem(LeagueService.LeagueStorageKey);
    try {
      return JSON.parse(json!) as League;
    } catch {
      this.resetLeague();
      return this.#league;
    }
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
}
