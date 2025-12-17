import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignInService {

  private apiUrl = 'http://localhost:3000/login';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>(this.apiUrl, { email, password })
      .pipe(
        tap(res => {
          this.storageService.setToken(res.accessToken);
        })
      );
  }
}
