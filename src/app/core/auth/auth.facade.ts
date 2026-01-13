import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './auth.models';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly userSubject = new BehaviorSubject<User | null>(null);

  readonly user$ = this.userSubject.asObservable();
  readonly isAuth$ = this.user$.pipe(map(Boolean));

  private initialized = false;

  constructor(private auth: AuthService) {}

  initSession(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (!document.cookie.includes('refreshToken=')) {
      this.userSubject.next(null);
      return;
    }

    this.auth.me().pipe(
      map(r => r.user),
      catchError(() => of(null)),
      tap(user => this.userSubject.next(user))
    ).subscribe();
  }

  login(email: string, password: string) {
    return this.auth.login(email, password).pipe(
      tap(r => this.userSubject.next(r.user))
    );
  }

  register(data: RegisterDto) {
    return this.auth.register(data).pipe(
      tap(r => this.userSubject.next(r.user))
    );
  }

  logout(): void {
    this.auth.logout().subscribe(() => this.userSubject.next(null));
  }
}
