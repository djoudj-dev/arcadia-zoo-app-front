import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AccountManagementService } from './service/account-management.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent {
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountManagementService,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.accountService
        .updatePassword(currentPassword, newPassword)
        .subscribe({
          next: () => {
            this.successMessage = 'Mot de passe modifié avec succès';
            this.errorMessage = '';
            this.passwordForm.reset();

            setTimeout(() => {
              this.successMessage = '';
              this.authService.logout();
              this.router.navigate(['/login'], {
                queryParams: {
                  message:
                    'Mot de passe modifié avec succès. Veuillez vous reconnecter.',
                },
              });
            }, 3000);
          },
          error: (error) => {
            this.errorMessage =
              error.error.message || 'Une erreur est survenue';
            this.successMessage = '';
          },
        });
    }
  }
}
