import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { users } from '../mocks/user-mock.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {
    // Initialisation depuis le localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Connexion : vérifier l'utilisateur et stocker dans le localStorage
  login(username: string, password: string): boolean {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  // Déconnexion : suppression des données utilisateur
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Vérifier le rôle de l'utilisateur
  hasRole(roleName: string): boolean {
    return this.currentUser?.role?.name === roleName;
  }
}
