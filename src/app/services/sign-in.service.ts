import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignInService {

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>(
        'http://localhost:3000/login',
        { email, password }
      )
      .pipe(
        tap(res => this.storage.setToken(res.accessToken))
      );
  }
}

