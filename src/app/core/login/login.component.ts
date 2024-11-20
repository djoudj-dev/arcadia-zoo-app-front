import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InactivityService } from '../../core/services/inactivity.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ToastService } from '../../shared/components/toast/services/toast.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule, ToastComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  message: string = '';
  private router = inject(Router);
  private inactivityService = inject(InactivityService);
  private toastService = inject(ToastService);

  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.EMAIL_PATTERN),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    // Récupérer le message des queryParams s'il existe
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.message = params['message'];
        // Faire disparaître le message après 3 secondes
        setTimeout(() => {
          this.message = '';
          // Mettre à jour l'URL sans le paramètre message
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
          });
        }, 3000);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.errorMessage = '';
          this.inactivityService.startMonitoring();

          this.toastService.showSuccess(
            'Connexion réussie ! Redirection en cours...',
            500
          );

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        },
        error: (error) => {
          console.error('Erreur lors de la connexion:', error);
          this.toastService.showError(
            'Identifiants incorrects, veuillez réessayer.'
          );
        },
      });
    } else {
      this.toastService.showError(
        'Veuillez vérifier les informations fournies.'
      );
    }
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control) return '';

    if (field === 'email') {
      if (control.hasError('required')) {
        return "L'email est requis";
      }
      if (control.hasError('email') || control.hasError('pattern')) {
        return 'Veuillez entrer une adresse email valide (exemple: nom@domaine.com)';
      }
    }

    if (field === 'password') {
      if (control.hasError('required')) {
        return 'Le mot de passe est requis';
      }
      if (control.hasError('minlength')) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (control.hasError('pattern')) {
        return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial';
      }
    }

    return '';
  }
}
