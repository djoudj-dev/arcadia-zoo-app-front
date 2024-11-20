import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { User } from '../../features/dashboard/admin-dashboard/account-management/model/user.model';
import { ToastService } from '../../shared/components/toast/services/toast.service';
import { TokenService } from '../token/token.service';

/**
 * Service d'authentification
 * Gère l'authentification des utilisateurs, les sessions et les autorisations
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** URL de base pour les endpoints d'authentification */
  private readonly apiUrl = `${environment.apiUrl}`;

  /** Services injectés */
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);

  /** Signal public pour l'utilisateur actuellement connecté */
  readonly currentUserSignal = signal<User | null>(null);

  /** Computed signals */
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role?.name);

  constructor() {
    this.initializeCurrentUser();
  }

  /**
   * Initialise l'utilisateur actuel à partir du stockage local
   * Vérifie la validité des données stockées
   */
  private initializeCurrentUser(): void {
    const storedUser = localStorage.getItem('user');
    const token = this.tokenService.getToken();

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.role) {
          this.currentUserSignal.set(user);
        } else {
          console.warn('Rôle manquant dans les données utilisateur');
          this.handleInvalidUserData();
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        this.handleInvalidUserData();
      }
    }
  }

  /**
   * Authentifie l'utilisateur avec les identifiants fournis
   * @param email Email de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns Observable<{user: User}> Données de l'utilisateur connecté
   */
  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => this.handleSuccessfulLogin(response.user)),
        catchError(this.handleLoginError.bind(this))
      );
  }

  /**
   * Déconnecte l'utilisateur et nettoie la session
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.toastService.showSuccess('Déconnexion réussie !', 2500);

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2500);
  }

  /**
   * Vérifie si l'utilisateur a les rôles requis
   * @param requiredRoles Rôles requis pour l'accès
   * @returns boolean indiquant si l'utilisateur a les droits
   */
  hasRole(requiredRoles: string[]): boolean {
    const userRole = this.userRole()?.toLowerCase();
    return requiredRoles.some((role) => role.toLowerCase() === userRole);
  }

  /**
   * Gère la connexion réussie
   * @param user Utilisateur authentifié
   */
  private handleSuccessfulLogin(user: User): void {
    if (user.role && user.token) {
      this.currentUserSignal.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.tokenService.setToken(user.token);
      this.toastService.showSuccess('Connexion réussie. Bienvenue!');
    } else {
      console.error('Données utilisateur invalides');
      throw new Error('Données utilisateur invalides');
    }
  }

  /**
   * Gère les erreurs de connexion
   * @param error Erreur HTTP reçue
   * @returns Observable<never> Observable d'erreur
   */
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur de connexion:', error);
    this.toastService.showError(
      'Erreur de connexion. Vérifiez vos identifiants.'
    );
    return throwError(() => new Error('Identifiants incorrects'));
  }

  /**
   * Nettoie les données utilisateur invalides
   */
  private handleInvalidUserData(): void {
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.currentUserSignal.set(null);
  }
}
