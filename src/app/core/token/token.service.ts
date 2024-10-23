import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'token'; // Clé pour stocker le token dans localStorage

  // Récupérer le token JWT du localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Stocker le token JWT dans le localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Supprimer le token JWT du localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
