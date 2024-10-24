import { Injectable } from '@angular/core';

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
    // Implémenter une logique pour vérifier l'expiration en fonction de ton token (JWT, etc.)
    // Par exemple, extraire la date d'expiration du token si c'est un JWT
    return false;
  }
}
