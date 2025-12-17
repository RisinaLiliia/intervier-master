import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { StorageService } from '../../services/storage.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {

  user$!: Observable<{ firstName: string; lastName: string } | null>;

  constructor(
    private dialog: MatDialog,
    private storage: StorageService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.user$ = this.storage.getTokenObservable().pipe(
      map(token => {
        if (!token) return null;

        const decode: any = jwtDecode(token);

        return {
          firstName: decode.firstName,
          lastName: decode.lastName
        };
      })
    );
  }

  signOut() {
    this.storage.removeToken();
  }

  openSignInModal() {
    this.dialog.open(SignInModalComponent, { width: '400px' });
  }

  openSignUpModal() {
    this.dialog.open(SignUpModalComponent, { width: '400px' });
  }
}
