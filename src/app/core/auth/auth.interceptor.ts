import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth-user.service';
import { AuthFacade } from './auth.facade';

let refreshInProgress = false;
let refreshQueue: ((success: boolean) => void)[] = [];

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const authFacade = inject(AuthFacade);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);

      const hasRefreshToken = document.cookie.includes('refreshToken=');
      if (!hasRefreshToken) {
        authFacade.logout();
        return throwError(() => err);
      }

      if (refreshInProgress) {
        return new Observable<HttpEvent<unknown>>(subscriber => {
          refreshQueue.push(success => {
            if (!success) return subscriber.error(err);
            next(req).subscribe({
              next: e => subscriber.next(e),
              error: e => subscriber.error(e),
              complete: () => subscriber.complete()
            });
          });
        });
      }

      refreshInProgress = true;

      return authService.refresh().pipe(
        switchMap(() => {
          refreshInProgress = false;
          refreshQueue.forEach(cb => cb(true));
          refreshQueue = [];
          return next(req);
        }),
        catchError(() => {
          refreshInProgress = false;
          refreshQueue.forEach(cb => cb(false));
          refreshQueue = [];
          authFacade.logout();
          return throwError(() => err);
        })
      );
    })
  );
};
