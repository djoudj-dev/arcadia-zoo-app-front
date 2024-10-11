import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Remplacez cette logique par une vraie vérification d'authentification
    if (username === 'user@example.com' && password === 'password123') {
      localStorage.setItem('user', JSON.stringify({ username }));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
