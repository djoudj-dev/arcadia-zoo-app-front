import { Injectable } from '@angular/core'; // Vérifiez bien cette importation
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
  /** Clé de stockage du token */
  private readonly TOKEN_KEY = 'access_token';

  /**
   * Récupère le token stocké
   * @returns string|null Token ou null si non trouvé
   */
  getToken(): string | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  getDecodedToken(token: string): Token | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return null;
    }
  }

  /**
   * Stocke un nouveau token
   * @param token Token à stocker
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('Token stocké avec succès');
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
    }
  }

  /**
   * Supprime le token stocké
   */
  removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      console.log('Token supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  }

  /**
   * Vérifie si le token est expiré
   * @returns boolean indiquant si le token est expiré
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      console.warn('Aucun token trouvé, considéré comme expiré.');
      return true;
    }

    const tokenPayload = this.decodeToken(token);
    if (!tokenPayload?.exp) {
      console.warn('Token invalide ou sans date d’expiration.');
      return true;
    }

    const isExpired = tokenPayload.exp * 1000 <= Date.now();
    if (isExpired) {
      console.warn('Token expiré.');
    }
    return isExpired;
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
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * (Optionnel) Préparez une méthode de rafraîchissement du token
   */
  refreshToken(): void {
    console.log('Préparez une logique pour rafraîchir le token.');
    // Implémentez ici une requête vers votre backend pour renouveler le token.
  }
}
