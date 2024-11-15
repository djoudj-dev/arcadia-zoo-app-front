import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InactivityService } from '../../core/services/inactivity.service'; // Ajouter InactivityService
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; // Variable pour afficher les erreurs
  private router = inject(Router); // Utilisation de inject() pour le Router
  private inactivityService = inject(InactivityService); // Injecter le service d'inactivité

  // Regex pour l'email et le mot de passe
  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // private readonly PASSWORD_PATTERN =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.EMAIL_PATTERN),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          // Validators.pattern(this.PASSWORD_PATTERN),
        ],
      ],
    });
  }

  // Soumission du formulaire de connexion
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.errorMessage = ''; // Réinitialiser le message d'erreur
          this.inactivityService.startMonitoring(); // Démarrer la surveillance d'inactivité après la connexion réussie
          this.router.navigate(['/dashboard']); // Rediriger après la connexion réussie
        },
        error: (error) => {
          this.errorMessage = 'Identifiants incorrects, veuillez réessayer.';
          console.error('Erreur lors de la connexion:', error);
        },
      });
    } else {
      this.errorMessage = 'Veuillez vérifier les informations fournies.';
    }
  }

  // Méthode améliorée pour obtenir les messages d'erreur
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
