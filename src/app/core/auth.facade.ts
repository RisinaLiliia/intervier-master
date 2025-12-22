import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  readonly isAuth$ = this.storage.getTokenObservable().pipe(
    map(token => !!token)
  );

  constructor(private storage: StorageService) {}
}
