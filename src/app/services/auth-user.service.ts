import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthUserService {
  constructor(private http: HttpClient) {}

  decode(token: string): User {
    return jwtDecode<User>(token);
  }

  getMe(id: number) {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }
}
