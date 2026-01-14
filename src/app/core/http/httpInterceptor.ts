import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfService } from './csrf.service';

export const CsrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfService);
  const token = csrfService.getToken();

  if (token && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    req = req.clone({
      setHeaders: { 'x-csrf-token': token },
      withCredentials: true,
    });
  } else {
    req = req.clone({ withCredentials: true });
  }

  return next(req);
};