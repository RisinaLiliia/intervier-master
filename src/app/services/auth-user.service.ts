import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

export interface MeResponse {
  user: User | null;
}

export interface AuthResponse {
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.api}/login`,
      { email, password },
      { withCredentials: true } 
    );
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.api}/register`,
      data,
      { withCredentials: true }
    );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(
      `${this.api}/me`,
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.api}/logout`,
      {},
      { withCredentials: true }
    );
  }

  refresh(): Observable<void> {
    return this.http.post<void>(
      `${this.api}/refresh`,
      {},
      { withCredentials: true }
    );
  }
}


