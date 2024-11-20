import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';

/**
 * Service de gestion des tokens
 * Gère le stockage, la récupération et la validation des tokens d'authentification
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /** Clé de stockage du token */
  private readonly TOKEN_KEY = 'token';

  /** Durée de validité du cookie en jours */
  private readonly COOKIE_DURATION = 1;

  /**
   * Récupère le token stocké
   * @returns string|null Token ou null si non trouvé
   */
  getToken(): string | null {
    return this.getCookie(this.TOKEN_KEY);
  }

  /**
   * Stocke un nouveau token
   * @param token Token à stocker
   */
  setToken(token: string): void {
    this.setCookie(this.TOKEN_KEY, token, this.COOKIE_DURATION);
  }

  /**
   * Supprime le token stocké
   */
  removeToken(): void {
    this.deleteCookie(this.TOKEN_KEY);
  }

  /**
   * Vérifie si le token est expiré
   * @returns boolean indiquant si le token est expiré
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const tokenPayload = this.decodeToken(token);
    if (!tokenPayload?.exp) return true;

    return tokenPayload.exp * 1000 <= Date.now();
  }

  /**
   * Décode le token JWT
   * @param token Token à décoder
   * @returns Token décodé ou null si invalide
   */
  private decodeToken(token: string): Token | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Crée un cookie avec une durée de vie
   * @param name Nom du cookie
   * @param value Valeur du cookie
   * @param days Durée de vie en jours
   */
  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; SameSite=Strict`;
  }

  /**
   * Récupère la valeur d'un cookie
   * @param name Nom du cookie
   * @returns string|null Valeur du cookie ou null si non trouvé
   */
  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  /**
   * Supprime un cookie
   * @param name Nom du cookie à supprimer
   */
  private deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }
}
