import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { AuthService } from '../../services/auth-user.service';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();
  readonly isAuth$ = this.user$.pipe(map(user => !!user));

  private hasTriedInit = false;

  constructor(private authService: AuthService) {}

  initSession(): void {
    if (this.hasTriedInit) return;
    this.hasTriedInit = true;
    this.authService.me().pipe(
      catchError(() => of({ user: null })),
      tap(result => this.userSubject.next(result.user ?? null))
    ).subscribe();
  }

  login(email: string, password: string) {
    return this.authService.login(email, password).pipe(
      tap(result => {
        this.userSubject.next(result.user);
        this.initSession(); 
      })
    );
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.authService.register(data).pipe(
      tap(result => this.userSubject.next(result.user))
    );
  }

  logout() {
    this.authService.logout().subscribe(() => this.clearSession());
  }

  private clearSession() {
    this.userSubject.next(null);
  }
}
