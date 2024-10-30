// src/app/core/auth/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';
import { TokenService } from '../token/token.service';
import { AlertService } from '../alert/service/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<User | null>(null); // Signal pour l'utilisateur actuel
  private apiUrl = `${environment.apiUrl}/auth`; // URL de l'API d'authentification

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private alertService: AlertService // Injection du service d'alerte
  ) {
    this.initializeCurrentUser(); // Initialisation de l'utilisateur actuel
  }

  /**
   * Initialise l'utilisateur actuel à partir du stockage local.
   */
  private initializeCurrentUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.role) {
          this.currentUserSignal.set(user); // Met à jour le signal avec l'utilisateur
        } else {
          console.warn("Rôle manquant dans les données de l'utilisateur");
        }
      } catch (error) {
        console.error(
          'Erreur lors du parsing des données utilisateur :',
          error
        );
      }
    }
  }

  /**
   * Authentifie l'utilisateur avec les identifiants fournis.
   * @param email L'adresse email de l'utilisateur.
   * @param password Le mot de passe de l'utilisateur.
   * @returns Un observable contenant l'utilisateur authentifié.
   */
  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: { user: User }) => {
          const user = response.user;
          this.currentUserSignal.set(user); // Met à jour le signal avec l'utilisateur connecté
          localStorage.setItem('user', JSON.stringify(user)); // Stocke l'utilisateur dans le stockage local
          this.tokenService.setToken(user.token || ''); // Définit le token
          this.alertService.setAlert(
            'Connexion réussie. Bienvenue!',
            'success'
          ); // Affiche un message de succès
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          this.alertService.setAlert(
            'Erreur de connexion. Vérifiez vos identifiants.',
            'error'
          ); // Affiche un message d'erreur
          return throwError(() => new Error('Identifiants incorrects'));
        })
      );
  }

  /**
   * Déconnecte l'utilisateur actuel.
   */
  logout(): void {
    this.currentUserSignal.set(null); // Réinitialise le signal de l'utilisateur
    localStorage.removeItem('user'); // Supprime l'utilisateur du stockage local
    this.tokenService.removeToken(); // Supprime le token
    this.alertService.setAlert('Déconnexion réussie.', 'info'); // Affiche un message d'information
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

  /**
   * Vérifie si l'utilisateur est authentifié.
   * @returns Vrai si l'utilisateur est authentifié, faux sinon.
   */
  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null; // Vérifie si le signal de l'utilisateur est non nul
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles requis.
   * @param requiredRoles Les rôles requis à vérifier.
   * @returns Vrai si l'utilisateur a l'un des rôles requis, faux sinon.
   */
  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? requiredRoles.includes(user.role.name) : false; // Vérifie si l'utilisateur a l'un des rôles requis
  }
}
