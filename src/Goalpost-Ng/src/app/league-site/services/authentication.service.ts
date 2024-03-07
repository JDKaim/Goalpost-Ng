import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  #dataService = inject(DataService);

  private static BearerTokenKey = 'bearer-token';

  #bearerToken: string | null;

  constructor() {
    this.#bearerToken = localStorage.getItem(AuthenticationService.BearerTokenKey);
  }

  getBearerToken() {
    return `Bearer ${this.#bearerToken}`;
  }

  logIn(email: string, password: string) {
    return this.#dataService.logIn(email, password).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      this.#bearerToken = response.result;
    }));
  }
}
