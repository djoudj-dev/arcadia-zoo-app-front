import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {
    // Charger l'utilisateur à partir du localStorage s'il est présent
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Connexion : vérifier l'utilisateur et stocker dans le localStorage
  login(username: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );
    if (user) {
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Utilisateur connecté:', this.currentUser); // Ajoutez cette ligne pour vérifier
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

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(roleName: string): boolean {
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté.');
      return false;
    }

    const userRoles = this.currentUser.role;

    // Si le rôle est un tableau d'objets
    if (Array.isArray(userRoles)) {
      return userRoles.some(
        (role: Role) => role.name.toLowerCase() === roleName.toLowerCase()
      );
    }

    return false;
  }
}
