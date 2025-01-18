import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="w-full max-w-md mx-auto p-6">
      <h2 class="text-center text-xl font-semibold mb-6 text-gray-900">
        Connectez-vous à votre compte
      </h2>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          [disabled]="!loginForm.valid"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          Se connecter
        </button>
      </form>
    </div>
  `,
})
export class LoginFormComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.loginSuccess.emit();
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
        },
      });
    }
  }
}
