import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthFacade } from '../../core/auth/auth.facade';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {

  user$ = this.auth.user$;

  constructor(
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {}

  logout() {
    this.auth.logout();
  }

  openSignInModal() {
    this.dialog.open(SignInModalComponent, { width: '400px' });
  }

  openSignUpModal() {
    this.dialog.open(SignUpModalComponent, { width: '400px' });
  }
}
