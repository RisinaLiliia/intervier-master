import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthFacade } from './auth.facade';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthFacade,
    private router: Router
  ) {}

  canActivate() {
    return this.auth.isAuth$.pipe(
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/']);
        }
      }),
      map(isAuth => isAuth)
    );
  }
}
