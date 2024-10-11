import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { users } from '../mocks/user-mock.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null || localStorage.getItem('user') !== null;
  }

  hasRole(roleName: string): boolean {
    const user =
      this.currentUser || JSON.parse(localStorage.getItem('user') || '{}');
    return user.role && user.role.name === roleName;
  }
}
