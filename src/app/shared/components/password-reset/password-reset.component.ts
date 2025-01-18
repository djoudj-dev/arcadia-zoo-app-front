import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/services/auth.service';
import { ToastService } from '../toast/services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
  template: `
    <div
      class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md mx-auto border border-secondary/20"
    >
      <div class="p-8">
        <app-toast></app-toast>

        <h2
          class="text-center text-3xl font-bold mb-8 text-tertiary font-serif"
        >
          Réinitialisation du mot de passe
        </h2>

        @if (!codeRequested()) {
        <!-- Étape 1 : Demande du code -->
        <form
          [formGroup]="emailForm"
          (ngSubmit)="requestCode()"
          class="space-y-6"
        >
          <div class="space-y-2">
            <label
              for="email"
              class="block text-sm font-medium text-tertiary/80"
            >
              Adresse email
            </label>
            <div class="relative">
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 rounded-lg bg-white border-2 border-secondary/30 text-quinary placeholder-gray-400
                  focus:border-tertiary focus:ring-1 focus:ring-tertiary/30 transition-all duration-200"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <button
            type="submit"
            [disabled]="!emailForm.valid || isLoading()"
            class="w-full bg-tertiary text-white py-3.5 px-4 rounded-lg font-medium
              hover:bg-quaternary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quaternary
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              shadow-lg hover:shadow-xl"
          >
            {{ isLoading() ? 'Envoi en cours...' : 'Recevoir le code' }}
          </button>
        </form>
        } @else {
        <!-- Étape 2 : Réinitialisation avec le code -->
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label
              for="code"
              class="block text-sm font-medium text-tertiary/80"
            >
              Code de réinitialisation
            </label>
            <div class="relative">
              <input
                id="code"
                type="text"
                formControlName="code"
                class="w-full px-4 py-3 rounded-lg bg-white border-2 border-secondary/30 text-quinary placeholder-gray-400
                  focus:border-tertiary focus:ring-1 focus:ring-tertiary/30 transition-all duration-200"
                placeholder="Entrez le code reçu par email"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="newPassword"
              class="block text-sm font-medium text-tertiary/80"
            >
              Nouveau mot de passe
            </label>
            <div class="relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="newPassword"
                formControlName="newPassword"
                class="w-full px-4 py-3 rounded-lg bg-white border-2 border-secondary/30 text-quinary placeholder-gray-400
                  focus:border-tertiary focus:ring-1 focus:ring-tertiary/30 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary/60 hover:text-tertiary transition-colors"
              >
                <i
                  [class]="
                    showPassword ? 'fas fa-eye-slash fa-lg' : 'fas fa-eye fa-lg'
                  "
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="!resetForm.valid || isLoading()"
            class="w-full bg-tertiary text-white py-3.5 px-4 rounded-lg font-medium
              hover:bg-quaternary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quaternary
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              shadow-lg hover:shadow-xl"
          >
            {{
              isLoading()
                ? 'Réinitialisation...'
                : 'Réinitialiser le mot de passe'
            }}
          </button>
        </form>
        }
      </div>
    </div>
  `,
})
export class PasswordResetComponent {
  @Output() closeModal = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  showPassword = false;
  readonly codeRequested = signal(false);
  readonly isLoading = signal(false);

  emailForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
  });

  resetForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
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
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  requestCode(): void {
    if (this.emailForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      this.authService
        .initiatePasswordReset(this.emailForm.value.email!)
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              'Code envoyé avec succès. Veuillez vérifier votre email.'
            );
            this.codeRequested.set(true);
            this.isLoading.set(false);
          },
          error: (error) => {
            this.toastService.showError(
              error.message || "Erreur lors de l'envoi du code"
            );
            this.isLoading.set(false);
          },
        });
    }
  }

  onSubmit(): void {
    if (this.resetForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      this.authService
        .resetPassword(
          this.emailForm.value.email!,
          this.resetForm.value.code!,
          this.resetForm.value.newPassword!
        )
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              'Mot de passe réinitialisé avec succès'
            );
            this.resetForm.disable();
            this.closeModal.emit();
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.toastService.showError(
              error.message || 'Erreur lors de la réinitialisation'
            );
            this.isLoading.set(false);
          },
        });
    }
  }
}
