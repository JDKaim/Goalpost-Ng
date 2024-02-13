import { Injectable } from '@angular/core';
import { ReplaySubject, interval, map, of, subscribeOn, switchMap, take, tap } from 'rxjs';
import { League } from '../models/league';
import { Team } from '../models/team';

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
    if (!this.#league) {
      this.#resetLeague();
    }
    this.#subject.next(this.#league);
    this.watchLeague$().subscribe({next: (league) => this.#saveData(league)});
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
    return this.watchLeague$().pipe(map(league => league.teams.find((team) => team.id === id)));
  }

  #saveData(league: League) {
    localStorage.setItem(
      LeagueService.LeagueStorageKey,
      JSON.stringify(league)
    );
  }

  #resetLeague() {
    this.#saveData({teams: [{ name: 'Washington', id: '0' }, { name: 'Oregon', id: '1' }]});
    this.#league = this.#loadData();
  }

  #loadData() {
    let json = localStorage.getItem(LeagueService.LeagueStorageKey);
    if (!json) {
      this.#saveData(this.#league);
      json = JSON.stringify(this.#league);
    }

    return JSON.parse(json) as League;
  }

  createTeam(team: Team) {
    if (!team.id || !team.name) {
      throw new Error("Team must have ID and name.");
    }
    if (this.#league.teams.find(curTeam => curTeam.id === team.id || curTeam.name === team.name)) {
      throw new Error("Team already exists.");
    }
    this.#league.teams.push({...team});
    this.#subject.next(this.#league);
    return of(team);
  }
}
