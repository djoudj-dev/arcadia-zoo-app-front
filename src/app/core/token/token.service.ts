import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../auth/models/token.model';

/**
 * Service de gestion des tokens
 * Gère le stockage, la récupération et la validation des tokens d'authentification
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly STORAGE_PREFIX = 'app_secure_';
  private readonly TOKEN_KEY = `${this.STORAGE_PREFIX}token`;
  private readonly REFRESH_TOKEN_KEY = `${this.STORAGE_PREFIX}refresh_token`;

  /**
   * Récupère le token stocké
   * @returns string|null Token ou null si non trouvé
   */
  getToken(): string | null {
    return this.decryptToken(sessionStorage.getItem(this.TOKEN_KEY));
  }

  getRefreshToken(): string | null {
    return this.decryptToken(sessionStorage.getItem(this.REFRESH_TOKEN_KEY));
  }

  setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, this.encryptToken(accessToken));
    sessionStorage.setItem(
      this.REFRESH_TOKEN_KEY,
      this.encryptToken(refreshToken)
    );
  }

  removeTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Vérifie si le token est expiré
   * @returns boolean indiquant si le token est expiré
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload) return true;
      return payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  isTokenExpiringSoon(token: string, thresholdMinutes = 5): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload) return true;
      const expirationTime = payload.exp * 1000;
      const thresholdMs = thresholdMinutes * 60 * 1000;
      return expirationTime - Date.now() <= thresholdMs;
    } catch {
      return true;
    }
  }

  /**
   * Décode le token JWT
   * @param token Token à décoder
   * @returns Token décodé ou null si invalide
   */
  private decodeToken(token: string): Token | null {
    try {
      return jwtDecode<Token>(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * (Optionnel) Préparez une méthode de rafraîchissement du token
   */
  refreshToken(): void {
    // Implémentez ici une requête vers votre backend pour renouveler le token.
  }

  private decryptToken(encryptedToken: string | null): string | null {
    // Implémentation de la décryptage
    return encryptedToken;
  }

  private encryptToken(token: string): string {
    // Implémentation de l'encryptage
    return token;
  }
}
