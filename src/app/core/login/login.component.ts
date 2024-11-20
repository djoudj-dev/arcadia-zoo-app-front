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

/**
 * Composant de connexion
 * Gère l'authentification des utilisateurs avec validation et feedback
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule, ToastComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  /** Formulaire de connexion */
  loginForm: FormGroup;

  /** Services injectés */
  private router = inject(Router);
  private inactivityService = inject(InactivityService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  /** Regex pour la validation de l'email */
  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor() {
    this.loginForm = this.initLoginForm();
  }

  /**
   * Initialise le composant et gère les messages de redirection
   */
  ngOnInit() {
    this.handleRedirectMessage();
  }

  /**
   * Initialise le formulaire avec les validations
   */
  private initLoginForm(): FormGroup {
    return this.fb.group({
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

  /**
   * Gère les messages de redirection dans l'URL
   */
  private handleRedirectMessage(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.toastService.showSuccess(params['message']);
        setTimeout(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
          });
        }, 3000);
      }
    });
  }

  /**
   * Gère la soumission du formulaire
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
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

  /**
   * Vérifie si un champ est invalide et retourne le message d'erreur approprié
   * @param field Nom du champ à vérifier
   * @returns Message d'erreur ou chaîne vide
   */
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
    }

    return '';
  }
}
