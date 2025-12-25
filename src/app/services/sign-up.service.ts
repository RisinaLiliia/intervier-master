import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignUpService {

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return this.http
      .post<{ accessToken: string; user: any }>(
        'http://localhost:3000/register',
        { email, password }
      )
      .pipe(
        switchMap(res => {
          this.storage.setToken(res.accessToken);

          return this.http.patch(
            `http://localhost:3000/users/${res.user.id}`,
            { firstName, lastName }
          );
        })
      );
  }
}
