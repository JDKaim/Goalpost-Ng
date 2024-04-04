import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  #dataService = inject(DataService);

  private static BearerTokenKey = 'bearer-token';

  #bearerToken: string | null;
  
  get isLoggedIn() {
    return this.#bearerToken != null;
  }

  get isAdminLoggedIn() {
    if (this.#bearerToken == null) {
      return false;
    }
    const decoded = <any>jwtDecode(this.#bearerToken);
    if (!decoded.role) {
      return false;
    } else if (Array.isArray(decoded.role)) {
      return decoded.role.some((role: string) => role === "Administrator");
    } else {
      return decoded.role === "Administrator";
    }
  }

  constructor() {
    this.#bearerToken = localStorage.getItem(AuthenticationService.BearerTokenKey);
  }

  getBearerToken() {
    return `Bearer ${this.#bearerToken}`;
  }

  logOut() {
    this.#bearerToken = null;
    localStorage.removeItem(AuthenticationService.BearerTokenKey); 
  }

  logIn(email: string, password: string) {
    return this.#dataService.logIn(email, password).pipe(tap((response) => {
      if (!response.result) {
        return;
      }
      this.#bearerToken = response.result;
      localStorage.setItem(AuthenticationService.BearerTokenKey, this.#bearerToken);
    }));
  }
}
