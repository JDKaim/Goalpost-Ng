import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const authenticationService = inject(AuthenticationService);
  return authenticationService.isLoggedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'auth', 'login']);
};
