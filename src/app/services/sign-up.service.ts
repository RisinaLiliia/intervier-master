import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { tap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {

  private apiUrl = 'http://localhost:3000/register';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  register(email: string, password: string, firstName: string, lastName: string) {
    return this.http
      .post<{ accessToken: string; user: any }>(this.apiUrl, { email, password })
      .pipe(
        switchMap(res => {
          const userId = res.user.id;
          const token = res.accessToken;

          return this.http.patch(
            `http://localhost:3000/users/${userId}`,
            { firstName, lastName },
            { headers: { Authorization: `Bearer ${token}` } }
          ).pipe(
            switchMap(() => {
              return this.http.post(
                `http://localhost:3000/initUserQuestions`,
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }),
            tap(() => this.storageService.setToken(token))
          );
        })
      );
  }
}


