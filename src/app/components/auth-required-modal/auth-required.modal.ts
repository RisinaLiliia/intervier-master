import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';

@Component({
  selector: 'app-auth-required-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './auth-required-modal.component.html',
  styleUrls: ['./auth-required-modal.component.scss']
})
export class AuthRequiredModalComponent {

  constructor(private dialog: MatDialog) {}

  openSignIn(): void {
    this.dialog.open(SignInModalComponent, {
      width: '400px'
    });
  }

  openSignUp(): void {
    this.dialog.open(SignUpModalComponent, {
      width: '400px'
    });
  }
}
