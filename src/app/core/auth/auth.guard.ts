import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from './auth.facade';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  return auth.isAuth$.pipe(
    take(1),
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
