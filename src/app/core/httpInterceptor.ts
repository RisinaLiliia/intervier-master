import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';

export const CsrfInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrfToken='))
    ?.split('=')[1];

  if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    req = req.clone({
      setHeaders: {
        'X-CSRF-Token': csrfToken
      }
    });
  }

  return next(req);
};


