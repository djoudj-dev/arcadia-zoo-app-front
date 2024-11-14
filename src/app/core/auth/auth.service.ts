import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { User } from '../../features/dashboard/admin-dashboard/account-management/model/user.model';
import { AlertService } from '../alert/service/alert.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<User | null>(null); // Signal pour l'utilisateur actuel
  private apiUrl = `${environment.apiUrl}`; // URL de l'API d'authentification

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
    const token = this.tokenService.getToken();

    console.log('Utilisateur stocké récupéré:', storedUser);

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Utilisateur après parsing:', user);

        if (user && user.role) {
          this.currentUserSignal.set(user);
          console.log(
            'Utilisateur initialisé dans currentUserSignal:',
            this.currentUserSignal()
          );
        } else {
          console.warn(
            "Rôle manquant dans les données de l'utilisateur au démarrage"
          );
        }
      } catch (error) {
        console.error(
          'Erreur lors du parsing des données utilisateur :',
          error
        );
        localStorage.removeItem('user'); // Supprime les données utilisateur invalides du stockage local
        this.tokenService.removeToken(); // Supprime le token
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
      .post<{ user: User }>(`${this.apiUrl}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response: { user: User }) => {
          const user = response.user;
          console.log('Utilisateur reçu après connexion:', user);
          if (user.role && user.token) {
            this.currentUserSignal.set(user); // Met à jour le signal avec l'utilisateur connecté
            localStorage.setItem('user', JSON.stringify(user)); // Stocke l'utilisateur dans le stockage local
            this.tokenService.setToken(user.token); // Stocke le token
            this.alertService.setAlert(
              'Connexion réussie. Bienvenue!',
              'success'
            );
            console.log(
              'Utilisateur mis à jour dans AuthService:',
              this.currentUserSignal()
            );
          } else {
            console.error(
              "Rôle ou token manquant dans les données de l'utilisateur"
            );
          }
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          this.alertService.setAlert(
            'Erreur de connexion. Vérifiez vos identifiants.',
            'error'
          );
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
    const token = this.tokenService.getToken();
    return !!token; // Vérifie si le token existe
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles requis.
   * @param requiredRoles Les rôles requis à vérifier.
   * @returns Vrai si l'utilisateur a l'un des rôles requis, faux sinon.
   */
  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSignal();
    const userRole = user?.role?.name?.toLowerCase();
    console.log(
      "Rôle de l'utilisateur:",
      userRole,
      'Rôles requis:',
      requiredRoles.map((role) => role.toLowerCase())
    );
    return requiredRoles.some((role) => role.toLowerCase() === userRole);
  }
}
