import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthResponse, MeResponse, RegisterDto } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `${this.api}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  register(data: RegisterDto) {
    return this.http.post<AuthResponse>(
      `${this.api}/register`,
      data,
      { withCredentials: true }
    );
  }

  me() {
    return this.http.get<MeResponse>(
      `${this.api}/me`,
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.post<void>(
      `${this.api}/logout`,
      {},
      { withCredentials: true }
    );
  }

  refresh() {
    return this.http.post<void>(
      `${this.api}/refresh`,
      {},
      { withCredentials: true }
    );
  }
}
