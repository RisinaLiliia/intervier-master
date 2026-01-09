import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AuthFacade } from '../../core/auth/auth.facade';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./user-panel.component.html`,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {
  private readonly auth = inject(AuthFacade);
  private readonly dialog = inject(MatDialog);

  readonly user$ = this.auth.user$;

  logout(): void {
    this.auth.logout();
  }

  openSignIn(): void {
    this.dialog.open(SignInModalComponent, { width: '400px' });
  }

  openSignUp(): void {
    this.dialog.open(SignUpModalComponent, { width: '400px' });
  }
}


