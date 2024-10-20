import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { USERS } from '../mocks/user-mock.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Utilisation de BehaviorSubject pour suivre l'utilisateur courant de manière réactive
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Charger l'utilisateur à partir du mock USERS s'il est présent
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Connexion : vérifier l'utilisateur depuis le mock USERS
  login(username: string, password: string): boolean {
    const user = USERS.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Utilisateur connecté:', user);
      return true;
    }
    return false;
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
