import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'token';

  getToken(): string | null {
    const token = this.getCookie(this.tokenKey);
    return token || null; // Retourne null si le cookie n'existe pas
  }

  setToken(token: string): void {
    console.log('Token reçu et stocké:', token);
    this.setCookie(this.tokenKey, token, 1); // Expiration dans 1 jour
  }

  removeToken(): void {
    this.deleteCookie(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const tokenPayload = this.decodeToken(token);
    const expiry = tokenPayload ? tokenPayload.exp * 1000 : null;

    console.log('Expiration du token:', expiry, 'Heure actuelle:', Date.now());

    return !expiry || expiry <= Date.now();
  }

  private decodeToken(token: string): Token | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }
}
