import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<User | null>(null);

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.role) {
        this.currentUserSignal.set(user);
      } else {
        console.warn("Rôle manquant dans les données de l'utilisateur");
      }
    }
  }

  login(email: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: { user: User }) => {
          const user = response.user;
          this.currentUserSignal.set(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.tokenService.setToken(user.token || '');
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          return throwError(() => new Error('Identifiants incorrects'));
        })
      );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? requiredRoles.includes(user.role.name) : false;
  }
}
