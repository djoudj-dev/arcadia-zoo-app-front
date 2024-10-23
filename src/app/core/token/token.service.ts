import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'token';

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Token récupéré depuis localStorage:', token); // Vérifiez ici si le token est bien récupéré
    return token;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
