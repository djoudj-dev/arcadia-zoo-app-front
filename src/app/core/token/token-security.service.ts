import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenSecurityService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly jwtHelper = new JwtHelperService();
  private readonly tokenBlacklist = new Set<string>();

  constructor() {}

  setTokens(accessToken: string, refreshToken: string): void {
    // Stockage sécurisé dans sessionStorage au lieu de localStorage
    sessionStorage.setItem(this.TOKEN_KEY, accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeTokens(): void {
    const currentToken = this.getToken();
    if (currentToken) {
      this.tokenBlacklist.add(currentToken);
    }
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenValid(token: string): boolean {
    if (!token || this.tokenBlacklist.has(token)) {
      return false;
    }
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  isTokenExpiringSoon(token: string): boolean {
    try {
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      if (!expirationDate) return true;

      // Vérifie si le token expire dans moins de 5 minutes
      const fiveMinutes = 5 * 60 * 1000;
      return expirationDate.getTime() - Date.now() < fiveMinutes;
    } catch {
      return true;
    }
  }
}
