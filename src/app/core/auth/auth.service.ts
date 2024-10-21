import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Utilisation de BehaviorSubject pour suivre l'utilisateur courant de manière réactive
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:3000/auth'; // L'URL de votre API backend

  constructor(private http: HttpClient, private router: Router) {
    // Charger l'utilisateur à partir du localStorage s'il est présent
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Connexion : envoyer une requête au backend pour vérifier l'utilisateur
  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((user: User) => {
          // Si la connexion est réussie, mettre à jour le BehaviorSubject et stocker l'utilisateur
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Utilisateur connecté:', user);
        })
      );
  }

  // Déconnexion : suppression des données utilisateur
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
