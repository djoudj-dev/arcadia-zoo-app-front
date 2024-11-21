import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, interval, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../features/dashboard/admin-dashboard/account-management/model/user.model';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { TokenSecurityService } from '../../token/token-security.service';
import { TokenService } from '../../token/token.service';

/**
 * Service d'authentification
 * Gère l'authentification des utilisateurs, les sessions et les autorisations
 */
interface TokenResponse {
  accessToken: string;
}

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
  private readonly tokenSecurityService = inject(TokenSecurityService);

  /** Signal public pour l'utilisateur actuellement connecté */
  readonly currentUserSignal = signal<User | null>(null);

  /** Computed signals */
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role?.name);

  private readonly MAX_LOGIN_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes en millisecondes
  private readonly loginAttempts = new Map<
    string,
    { count: number; timestamp: number }
  >();

  constructor() {
    this.initializeCurrentUser();
    // Ne démarre la vérification que si l'utilisateur est authentifié
    if (this.isAuthenticated()) {
      interval(60000).subscribe(() => this.checkTokenExpiration());
    }
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
    if (this.isUserLockedOut(email)) {
      throw new Error(
        'Compte temporairement bloqué. Veuillez réessayer plus tard.'
      );
    }

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
      this.tokenSecurityService.setTokens(user.token, user.refreshToken || '');

      this.currentUserSignal.set(user);
      localStorage.setItem('user', JSON.stringify(user));

      const storedToken = this.tokenSecurityService.getToken();
      if (!storedToken) {
        console.error('Échec du stockage du token');
        this.toastService.showError('Erreur lors de la connexion');
        return;
      }

      this.toastService.showSuccess('Connexion réussie. Bienvenue!');
    } else {
      console.error('Données utilisateur invalides');
      this.toastService.showError('Données de connexion invalides');
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

  private isUserLockedOut(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;

    const lastAttemptTime = attempts.timestamp;
    const currentTime = Date.now();

    if (
      attempts.count >= this.MAX_LOGIN_ATTEMPTS &&
      currentTime - lastAttemptTime < this.LOCKOUT_DURATION
    ) {
      return true;
    }

    if (currentTime - lastAttemptTime >= this.LOCKOUT_DURATION) {
      this.loginAttempts.delete(email);
    }

    return false;
  }

  private incrementLoginAttempts(email: string): void {
    const attempts = this.loginAttempts.get(email) || {
      count: 0,
      timestamp: 0,
    };
    this.loginAttempts.set(email, {
      count: attempts.count + 1,
      timestamp: Date.now(),
    });
  }

  private checkTokenExpiration(): void {
    // Vérifie d'abord si l'utilisateur est connecté
    if (!this.isAuthenticated()) {
      return;
    }

    const token = this.tokenService.getToken();
    if (!token) return;

    if (this.tokenSecurityService.isTokenExpiringSoon(token)) {
      this.refreshToken().subscribe({
        error: (error) => {
          console.error('Erreur lors du rafraîchissement du token:', error);
          this.logout();
        },
      });
    }
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenSecurityService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token non trouvé'));
    }

    return this.http
      .post<TokenResponse>(`${this.apiUrl}/api/auth/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.accessToken);
        }),
        catchError((error) => {
          console.error('Erreur de rafraîchissement du token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Vérifie si l'utilisateur possède les rôles requis
   * @param requiredRoles Liste des rôles requis
   * @returns boolean
   */
  hasRequiredRoles(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.every((role) => userRoles.includes(role));
  }

  /**
   * Récupère les rôles de l'utilisateur depuis le token
   * @returns string[] Liste des rôles de l'utilisateur
   */
  private getUserRoles(): string[] {
    const token = this.tokenService.getToken();
    if (!token) return [];

    try {
      const decodedToken = this.tokenService.getDecodedToken(token);
      return decodedToken?.role ? [decodedToken.role] : [];
    } catch (error) {
      console.error('Erreur lors du décodage des rôles:', error);
      return [];
    }
  }
}
