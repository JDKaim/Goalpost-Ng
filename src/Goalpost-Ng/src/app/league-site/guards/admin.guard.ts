import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const adminGuard = (next: ActivatedRouteSnapshot) => {
  const authenticationService = inject(AuthenticationService);
  return authenticationService.isAdminLoggedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'auth', 'login']);
};
