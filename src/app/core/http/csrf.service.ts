import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private csrfSubject = new BehaviorSubject<string | null>(null);
  csrf$ = this.csrfSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchCsrfToken() {
    return this.http.get<{ csrfToken: string }>(`${environment.apiUrl}/auth/csrf`, { withCredentials: true })
      .subscribe({
        next: res => this.csrfSubject.next(res.csrfToken),
        error: err => console.error('CSRF fetch error', err)
      });
  }

  getToken(): string | null {
    return this.csrfSubject.getValue();
  }
}