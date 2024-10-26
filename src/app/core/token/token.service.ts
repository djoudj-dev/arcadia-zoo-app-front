import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'token';

  getToken(): string | null {
    const token = this.getCookie(this.tokenKey);
    console.log('Token récupéré:', token);
    return token;
  }

  setToken(token: string): void {
    this.setCookie(this.tokenKey, token, 1); // 1 day expiration
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

    if (expiry && expiry > Date.now()) {
      return false;
    }

    return true;
  }

  private decodeToken(token: string): Token | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      '; expires=' +
      expires +
      '; path=/';
  }

  private getCookie(name: string): string | null {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }
}
