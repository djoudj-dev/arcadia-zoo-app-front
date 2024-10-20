import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Soumission du formulaire de connexion
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Vérification des identifiants via AuthService
      if (this.authService.login(username, password)) {
        console.log('Formulaire soumis avec succès:', this.loginForm.value);
        this.errorMessage = ''; // Réinitialiser le message d'erreur
        this.router.navigate(['/dashboard']); // Rediriger après la connexion réussie
      } else {
        this.errorMessage = 'Identifiants incorrects, veuillez réessayer.';
      }
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
