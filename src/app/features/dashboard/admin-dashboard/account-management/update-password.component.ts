import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/services/auth.service';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AccountManagementService } from './service/account-management.service';

/**
 * Composant de mise à jour du mot de passe
 * Permet aux utilisateurs de modifier leur mot de passe
 * avec validation et feedback
 */
@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent, ToastComponent],
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  /** Formulaire de modification du mot de passe */
  passwordForm!: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountManagementService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialise le formulaire avec les validations
   */
  private initForm(): void {
    const formOptions: AbstractControlOptions = {
      validators: this.passwordMatchValidator,
      updateOn: 'blur',
    };

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      formOptions
    );
  }

  /**
   * Validateur personnalisé pour vérifier la correspondance des mots de passe
   * @param control AbstractControl à valider
   * @returns null si valide, objet d'erreur si invalide
   */
  private passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      return { mismatch: true };
    }
    return null;
  }

  /**
   * Gère la soumission du formulaire
   */
  onSubmit() {
    if (this.passwordForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.accountService
        .updatePassword(currentPassword, newPassword)
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              'Mot de passe modifié avec succès. Vous allez être déconnecté.'
            );
            this.passwordForm.disable();

            // Fermer le modal après 1 seconde
            setTimeout(() => {
              this.closeModal.emit();
            }, 1000);

            // Déconnexion et redirection après 3 secondes
            setTimeout(() => {
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
            this.isSubmitting.set(false);
            this.toastService.showError(
              error.error.message ||
                'Une erreur est survenue lors de la modification du mot de passe'
            );
            this.passwordForm.enable();
          },
          complete: () => {
            this.isSubmitting.set(false);
          },
        });
    } else {
      this.toastService.showError(
        'Veuillez corriger les erreurs du formulaire'
      );
    }
  }

  /**
   * Vérifie si un champ du formulaire est invalide
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}
