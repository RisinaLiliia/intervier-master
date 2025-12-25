import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthFacade {

  readonly user$ = this.storage.tokenChanges().pipe(
    map(token => token ? jwtDecode<User>(token) : null)
  );

  readonly isAuth$ = this.user$.pipe(
    map(user => !!user)
  );

  constructor(private storage: StorageService) {}

  logout() {
    this.storage.clear();
  }
}

