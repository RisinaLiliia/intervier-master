import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { AuthService, User } from '../../services/auth-user.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();
  readonly isAuth$ = this.user$.pipe(tap(user => !!user));

  private accessToken: string | null = null;
  private hasTriedRefresh = false; 

  constructor(private authService: AuthService) {}

  initSession() {
    if (this.hasTriedRefresh) return;
    this.hasTriedRefresh = true;

    const token = this.getRefreshTokenCookie();
    if (!token) return;

    this.authService.refresh().pipe(
      catchError(() => of(null))
    ).subscribe(result => {
      if (result?.accessToken) {
        this.accessToken = result.accessToken;
        this.loadUser();
      } else {
        this.clearSession();
      }
    });
  }

  private loadUser() {
    this.authService.me().pipe(
      catchError(() => of(null))
    ).subscribe(user => this.userSubject.next(user));
  }

  login(email: string, password: string) {
    return this.authService.login(email, password).pipe(
      tap(result => {
        this.accessToken = result.accessToken;
        this.userSubject.next(result.user);
      })
    );
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.authService.register(data).pipe(
      tap(result => {
        this.accessToken = result.accessToken;
        this.userSubject.next(result.user);
      })
    );
  }

  logout() {
    this.authService.logout().subscribe(() => this.clearSession());
  }

  private clearSession() {
    this.accessToken = null;
    this.userSubject.next(null);
  }

  getToken() {
    return this.accessToken;
  }

  private getRefreshTokenCookie(): string | null {
    const match = document.cookie.match(/refreshToken=([^;]+)/);
    return match ? match[1] : null;
  }
}


