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
    <div
      class="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-md mx-auto"
    >
      <div class="p-8">
        <h2 class="text-center text-2xl font-bold mb-8 text-primary font-serif">
          Connectez-vous à votre compte
        </h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-primary mb-2"
            >
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 rounded-lg bg-primary/90 border-2 border-tertiary text-quinary placeholder-gray-500 focus:ring-2 focus:ring-quaternary focus:border-transparent transition-all"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-primary mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 rounded-lg bg-primary/90 border-2 border-tertiary text-quinary placeholder-gray-500 focus:ring-2 focus:ring-quaternary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            [disabled]="!loginForm.valid"
            class="w-full bg-tertiary text-primary py-3 px-4 rounded-lg font-medium hover:bg-quaternary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quaternary disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            Se connecter
          </button>
        </form>
      </div>
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
