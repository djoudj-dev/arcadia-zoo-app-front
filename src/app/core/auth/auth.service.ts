import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  private apiUrl = `${environment}/auth`; // URL du backend avec /auth

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log(
        'Utilisateur chargé depuis le stockage local après redémarrage:',
        user
      ); // Log ajouté pour vérifier l'utilisateur
      if (user && user.role) {
        this.currentUserSubject.next(user); // Recharger l'utilisateur si le rôle est présent
      } else {
        console.warn("Rôle manquant dans les données de l'utilisateur");
      }
    }
  }

  // Connexion avec token
  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: { user: User }) => {
          console.log('Réponse de connexion complète:', response); // Log toute la réponse
          console.log('Rôle dans la réponse:', response.user?.role); // Vérifie si le rôle est bien défini
          const user = response.user;
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user)); // Stocker l'utilisateur dans localStorage
          localStorage.setItem('token', user.token || ''); // Stocker le token
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          return throwError(() => new Error('Identifiants incorrects'));
        })
      );
  }

  // Déconnexion
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Supprimer aussi le token
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Vérifier si l'utilisateur possède un des rôles requis
  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? requiredRoles.includes(user.role.name) : false; // Accéder à user.role.name
  }

  // Récupérer le token pour l'intercepteur ou autres requêtes
  getToken(): string | null {
    return localStorage.getItem('token'); // Récupérer le token depuis le localStorage
  }
}
