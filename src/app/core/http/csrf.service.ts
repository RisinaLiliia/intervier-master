import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  getCsrfToken(): string | null {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrfToken='))
      ?.split('=')[1] || null;
  }
}
