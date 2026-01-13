import { HttpInterceptorFn } from '@angular/common/http';

export const CsrfInterceptor: HttpInterceptorFn = (req, next) => {
  const token = document.cookie
    .split('; ')
    .find(v => v.startsWith('csrfToken='))
    ?.split('=')[1];

  if (token && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    req = req.clone({
      setHeaders: { 'X-CSRF-Token': token },
      withCredentials: true, 
    });
  } else {
    req = req.clone({ withCredentials: true });
  }

  return next(req);
};



