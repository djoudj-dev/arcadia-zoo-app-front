import { CommonModule } from '@angular/common';
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
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div
      class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md mx-auto border border-secondary/20"
    >
      <div class="p-8">
        <h2
          class="text-center text-3xl font-bold mb-8 text-tertiary font-serif"
        >
          Connectez-vous à votre compte
        </h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
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

          <div class="space-y-2">
            <label
              for="password"
              class="block text-sm font-medium text-tertiary/80"
            >
              Mot de passe
            </label>
            <div class="relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
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
            <a
              href="#"
              class="text-sm text-tertiary hover:text-quaternary transition-colors float-right"
              (click)="$event.preventDefault(); forgotPassword()"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <div class="flex items-center mt-4">
            <input
              type="checkbox"
              id="remember"
              formControlName="remember"
              class="w-4 h-4 text-tertiary border-secondary/30 rounded focus:ring-tertiary/30"
            />
            <label
              for="remember"
              class="ml-2 text-sm text-tertiary/80 cursor-pointer hover:text-tertiary transition-colors"
            >
              Se souvenir de moi
            </label>
          </div>

          <button
            type="submit"
            [disabled]="!loginForm.valid"
            class="w-full bg-tertiary text-white py-3.5 px-4 rounded-lg font-medium
            hover:bg-quaternary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quaternary
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
            shadow-lg hover:shadow-xl mt-6"
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
  @Output() forgotPasswordClick = new EventEmitter<void>();

  showPassword = false;
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(): void {
    this.forgotPasswordClick.emit();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, remember } = this.loginForm.value;

      if (remember) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }

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

  ngOnInit() {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        remember: true,
      });
    }
  }
}
