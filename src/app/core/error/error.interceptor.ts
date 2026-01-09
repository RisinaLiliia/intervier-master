import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(err => {
      snackBar.open(
        err?.error?.message ?? 'Unexpected error',
        'Close',
        { duration: 4000 }
      );
      return throwError(() => err);
    })
  );
};

