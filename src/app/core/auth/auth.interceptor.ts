import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '../auth/auth.facade';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const token = auth.getToken();

  if (!token) return next(req); 

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};

