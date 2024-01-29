import { Injectable } from '@angular/core';
import { ReplaySubject, interval, of, switchMap, take } from 'rxjs';
import { League } from '../models/league';

// NOTE: This service is overly complicated because of the way it's dealing with local data. If dealing with
// a proper database or backend service this would probablyend up a bit cleaner.

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private static LeagueStorageKey = 'student';

  #subject = new ReplaySubject<League>(1);

  #league: League = {
    teams: [{ name: 'Washington' }, { name: 'Oregon' }],
  };

  constructor() {
    this.#saveData(this.#league);
    this.#subject.next(this.#loadData());
    interval(5000).subscribe({
      next: () => {
        this.#league.teams.push({ name: 'Washington State' });
        this.#subject.next(this.#league);
      },
    });
  }

  watchLeague$() {
    return this.#subject.asObservable();
  }

  #saveData(league: League) {
    localStorage.setItem(
      LeagueService.LeagueStorageKey,
      JSON.stringify(league)
    );
  }

  #loadData() {
    let json = localStorage.getItem(LeagueService.LeagueStorageKey);
    if (!json) {
      this.#saveData(this.#league);
      json = JSON.stringify(this.#league);
    }

    return JSON.parse(json) as League;
  }
}
