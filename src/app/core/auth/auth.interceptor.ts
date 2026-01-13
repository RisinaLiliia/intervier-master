import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { AuthService } from '../../services/auth-user.service';
import { AuthFacade } from './auth.facade';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const authFacade = inject(AuthFacade);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return authService.refresh().pipe(
          switchMap(() => next(req)), 
          catchError(() => {
            authFacade.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};


