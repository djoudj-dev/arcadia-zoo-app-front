import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:3000/auth'; // URL du backend

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Connexion avec token
  // Connexion avec token
  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/login`, { email, password }) // Type de retour spécifié comme { user: User }
      .pipe(
        tap((response: { user: User }) => {
          const user = response.user; // Accès à l'objet utilisateur

          // Vérifie si le rôle est bien présent dans l'utilisateur
          console.log('Utilisateur connecté avec rôle:', user.role); // Afficher le rôle dans la console

          // Mettre à jour l'utilisateur et stocker le token
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', user.token || ''); // Stocker le token dans localStorage
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

  // Récupérer le token pour l'intercepteur ou autres requêtes
  getToken(): string | null {
    return localStorage.getItem('token'); // Récupérer le token depuis le localStorage
  }
}
