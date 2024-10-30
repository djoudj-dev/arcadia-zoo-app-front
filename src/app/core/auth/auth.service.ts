import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Signal pour stocker l'utilisateur actuellement connecté.
   */
  currentUserSignal = signal<User | null>(null);

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    // Charger l'utilisateur stocké dans localStorage au démarrage de l'application
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.role) {
        this.currentUserSignal.set(user);
      } else {
        console.warn("Rôle manquant dans les données de l'utilisateur");
      }
    }
  }

  /**
   * Authentifie l'utilisateur avec l'email et le mot de passe fournis.
   * Stocke les informations de l'utilisateur et le token en cas de succès.
   * @param email - L'email de l'utilisateur
   * @param password - Le mot de passe de l'utilisateur
   * @returns Un Observable contenant les données de l'utilisateur
   */
  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: { user: User }) => {
          const user = response.user;
          this.currentUserSignal.set(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.tokenService.setToken(user.token || '');
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          return throwError(() => new Error('Identifiants incorrects'));
        })
      );
  }

  /**
   * Déconnecte l'utilisateur, vide les informations d'utilisateur et redirige vers la page de connexion.
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  /**
   * Vérifie si un utilisateur est authentifié.
   * @returns True si un utilisateur est connecté, false sinon.
   */
  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  /**
   * Vérifie si l'utilisateur connecté possède l'un des rôles requis.
   * @param requiredRoles - Un tableau de rôles requis pour accéder à une ressource
   * @returns True si l'utilisateur a l'un des rôles requis, false sinon.
   */
  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? requiredRoles.includes(user.role.name) : false;
  }
}
