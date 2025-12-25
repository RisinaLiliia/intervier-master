import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'accessToken';

  private token$ = new BehaviorSubject<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token$.next(token);
  }

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.token$.next(null);
  }

  getToken(): string | null {
    return this.token$.value;
  }

  tokenChanges(): Observable<string | null> {
    return this.token$.asObservable();
  }
}
