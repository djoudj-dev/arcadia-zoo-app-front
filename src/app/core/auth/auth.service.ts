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
  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: User) => {
          // Mettre à jour l'utilisateur et stocker le token
          this.currentUserSubject.next(response);
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('token', response.token); // Stocker le token dans localStorage

          console.log('Utilisateur connecté:', response.username);
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
