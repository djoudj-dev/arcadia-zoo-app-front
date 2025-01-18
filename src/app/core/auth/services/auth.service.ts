import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'app/core/token/token.service';
import { Observable, interval, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { User } from '../../../features/dashboard/admin-dashboard/account-management/model/user.model';
import { ToastService } from '../../../shared/components/toast/services/toast.service';

/**
 * Service d'authentification pour gérer la session utilisateur
 */
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface ApiError {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly tokenService = inject(TokenService);

  private readonly authState = signal<{
    user: User | null;
    isAuthenticated: boolean;
    role: string | null;
  }>({ user: null, isAuthenticated: false, role: null });

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly userRole = computed(() => this.authState().role);

  constructor() {
    this.initializeCurrentUser();
    if (this.isAuthenticated()) {
      interval(60000).subscribe(() => this.checkTokenExpiration());
    }
  }

  /**
   * Initialise l'utilisateur connecté à partir du stockage local
   */
  private initializeCurrentUser(): void {
    const storedUser = localStorage.getItem('user');
    const token = this.tokenService.getToken();

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.authState.set({
          user: user,
          isAuthenticated: true,
          role: user.role?.name ?? null,
        });
      } catch {
        this.handleInvalidUserData();
      }
    }
  }

  /**
   * Authentifie un utilisateur
   */
  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.handleSuccessfulLogin(response.user);
        }),
        catchError((error) => this.handleLoginError(error))
      );
  }

  /**
   * Rafraîchit le token d'accès
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token non trouvé'));
    }

    return this.http
      .post<TokenResponse>(`${this.apiUrl}/api/auth/token/refresh`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.setTokens(
            response.accessToken,
            response.refreshToken
          );
        }),
        catchError((error) => {
          console.error('Erreur de rafraîchissement du token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.authState.set({ user: null, isAuthenticated: false, role: null });
    localStorage.removeItem('user');
    this.tokenService.removeTokens();
    this.toastService.showSuccess('Déconnexion réussie !', 2500);
    setTimeout(() => this.router.navigate(['/login']), 2500);
  }

  /**
   * Vérifie si un token doit être rafraîchi
   */
  private checkTokenExpiration(): void {
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isTokenExpiringSoon(token)) {
      this.refreshToken().subscribe();
    }
  }

  /**
   * Gère la connexion réussie
   */
  private handleSuccessfulLogin(user: User): void {
    if (user.role && user.token) {
      this.tokenService.setTokens(user.token, user.refreshToken ?? '');
      this.authState.set({
        user: user,
        isAuthenticated: true,
        role: user.role?.name,
      });
      localStorage.setItem('user', JSON.stringify(user));
      this.toastService.showSuccess('Connexion réussie. Bienvenue!');
    } else {
      throw new Error('Données utilisateur invalides');
    }
  }

  /**
   * Gère les erreurs de connexion
   */
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      (error.error as ApiError)?.message ||
      'Erreur de connexion. Vérifiez vos identifiants.';
    this.toastService.showError(errorMessage);
    return throwError(() => error);
  }

  /**
   * Nettoie les données utilisateur invalides
   */
  private handleInvalidUserData(): void {
    this.logout();
  }
}
