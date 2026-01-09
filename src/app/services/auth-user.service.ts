import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ user: User; accessToken: string }>(
      `${this.api}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http.post<{ user: User; accessToken: string }>(
      `${this.api}/register`,
      data,
      { withCredentials: true }
    );
  }

  refresh() {
    return this.http.post<{ accessToken: string }>(
      `${this.api}/refresh`,
      {},
      { withCredentials: true }
    );
  }

  me() {
    return this.http.get<User>(`${this.api}/me`, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${this.api}/logout`, {}, { withCredentials: true });
  }
}
