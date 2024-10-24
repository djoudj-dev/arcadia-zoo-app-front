import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService // Injecter le TokenService
  ) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.role) {
        this.currentUserSubject.next(user);
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
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.tokenService.setToken(user.token || ''); // Utiliser le TokenService pour stocker le token
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          return throwError(() => new Error('Identifiants incorrects'));
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.tokenService.removeToken(); // Supprimer le token via le TokenService
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? requiredRoles.includes(user.role.name) : false;
  }
}
