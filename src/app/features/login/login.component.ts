import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { InactivityService } from '../../core/services/inactivity.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ToastService } from '../../shared/components/toast/services/toast.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';

/**
 * Interface définissant la structure des erreurs du formulaire
 * Chaque champ contient un tableau de messages d'erreur
 */
interface FormErrors {
  email: string[];
  password: string[];
}

/**
 * Composant de connexion
 * Gère l'authentification des utilisateurs avec validation et feedback
 * Utilise les signaux pour la gestion d'état réactive
 * Implémente OnInit et OnDestroy pour la gestion du cycle de vie
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule, ToastComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  /** Expression régulière pour la validation de l'email */
  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /** Subject pour gérer la destruction propre des souscriptions */
  private readonly destroy$ = new Subject<void>();

  /** Injection des services nécessaires */
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly inactivityService = inject(InactivityService);
  private readonly toastService = inject(ToastService);

  /** Signaux pour la gestion d'état réactive */
  readonly isLoading = signal(false);
  readonly formErrors = signal<FormErrors>({ email: [], password: [] });

  /** Formulaire de connexion initialisé avec les validations */
  readonly loginForm: FormGroup = this.initLoginForm();

  /** Signal calculé pour la validité du formulaire */
  readonly isFormValid = computed(
    () => this.loginForm.valid && !this.isLoading()
  );

  /**
   * Initialise le composant
   * Configure les messages de redirection et la validation du formulaire
   */
  ngOnInit(): void {
    this.handleRedirectMessage();
    this.setupFormValidation();
  }

  /**
   * Nettoie les souscriptions lors de la destruction du composant
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le formulaire avec les validations requises
   * @returns FormGroup configuré avec les validations
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
   * Configure la validation en temps réel du formulaire
   * Met à jour les erreurs à chaque changement
   */
  private setupFormValidation(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateFormErrors());
  }

  /**
   * Met à jour les erreurs du formulaire
   * Vérifie chaque champ et collecte les messages d'erreur
   */
  private updateFormErrors(): void {
    const errors: FormErrors = { email: [], password: [] };

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    // Validation de l'email
    if (emailControl?.errors && emailControl.touched) {
      if (emailControl.errors['required'])
        errors.email.push("L'email est requis");
      if (emailControl.errors['email'] || emailControl.errors['pattern']) {
        errors.email.push("Format d'email invalide");
      }
    }

    // Validation du mot de passe
    if (passwordControl?.errors && passwordControl.touched) {
      if (passwordControl.errors['required'])
        errors.password.push('Le mot de passe est requis');
      if (passwordControl.errors['minlength']) {
        errors.password.push(
          'Le mot de passe doit contenir au moins 8 caractères'
        );
      }
    }

    this.formErrors.set(errors);
  }

  /**
   * Gère les messages de redirection dans l'URL
   * Affiche les messages temporairement et nettoie l'URL
   */
  private handleRedirectMessage(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['message']) {
          this.toastService.showSuccess(params['message']);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
          });
        }
      });
  }

  /**
   * Gère la soumission du formulaire
   * Vérifie la validité, authentifie l'utilisateur et gère les erreurs
   */
  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      this.authService
        .login(email, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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
            this.isLoading.set(false);
          },
        });
    } else {
      this.updateFormErrors();
      this.toastService.showError(
        'Veuillez corriger les erreurs du formulaire'
      );
    }
  }

  /**
   * Récupère les messages d'erreur pour un champ donné
   * @param field Nom du champ
   * @returns Tableau des messages d'erreur pour ce champ
   */
  getErrorMessage(field: string): string[] {
    return this.formErrors()[field as keyof FormErrors] || [];
  }
}
