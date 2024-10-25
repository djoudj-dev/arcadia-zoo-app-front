import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { InactivityService } from '../../core/services/inactivity.service'; // Ajouter InactivityService
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; // Variable pour afficher les erreurs
  private router = inject(Router); // Utilisation de inject() pour le Router
  private inactivityService = inject(InactivityService); // Injecter le service d'inactivité

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Soumission du formulaire de connexion
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Formulaire soumis avec succès:', this.loginForm.value);
          console.log("Rôle de l'utilisateur:", response); // Afficher le rôle de l'utilisateur
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

  // Méthode pour récupérer le message d'erreur d'un champ
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field} est requis.`;
    } else if (control?.hasError('email')) {
      return 'Veuillez fournir un email valide.';
    } else if (control?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    return '';
  }
}
