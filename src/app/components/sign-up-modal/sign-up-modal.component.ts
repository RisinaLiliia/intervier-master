import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-sign-up-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthFacade);
  private readonly dialogRef = inject(MatDialogRef<SignUpModalComponent>);
  private readonly destroyRef = inject(DestroyRef);

  readonly signUpForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', Validators.required),
    firstName: this.fb.nonNullable.control('', Validators.required),
    lastName: this.fb.nonNullable.control('', Validators.required),
  });

  loading = false;
  errorMessage = '';

  get email() {
    return this.signUpForm.controls.email;
  }
  get password() {
    return this.signUpForm.controls.password;
  }
  get firstName() {
    return this.signUpForm.controls.firstName;
  }
  get lastName() {
    return this.signUpForm.controls.lastName;
  }

  onSubmit(): void {
    if (this.signUpForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    const payload = this.signUpForm.getRawValue();

    this.auth
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: err => {
          this.loading = false;
          this.errorMessage =
            err?.error?.message ?? 'Registration failed';
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
