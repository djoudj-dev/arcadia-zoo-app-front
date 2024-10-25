import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true; // Si pas de token, considéré comme expiré

    // Décoder le token JWT pour vérifier la date d'expiration
    const tokenPayload = this.decodeToken(token);
    const expiry = tokenPayload ? tokenPayload.exp * 1000 : null; // L'expiration est en secondes, donc on convertit en millisecondes

    if (expiry && expiry > Date.now()) {
      return false; // Le token n'est pas expiré
    }

    return true; // Le token est expiré
  }

  // Fonction pour décoder le token JWT
  private decodeToken(token: string): Token | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }
}
