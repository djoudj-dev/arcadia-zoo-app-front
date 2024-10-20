import { Injectable } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { Observable, of } from 'rxjs';
import { Role } from '../../../../core/models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private localStorageKey = 'users';
  private usersCache: User[] = [];

  constructor() {
    // Charger les utilisateurs au démarrage pour réduire les lectures répétées de localStorage
    this.usersCache = this.getAllUsers();
  }

  // Récupère tous les utilisateurs depuis le cache, initialement rempli depuis localStorage
  getAllUsers(): User[] {
    return this.usersCache;
  }

  // Crée un nouvel utilisateur et le stocke dans localStorage
  createUser(user: User): void {
    user.id = this.usersCache.length
      ? this.usersCache[this.usersCache.length - 1].id + 1
      : 1;
    this.usersCache.push(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.usersCache));
  }

  // Récupère les rôles (simples pour le moment)
  getRoles(): Observable<Role[]> {
    const roles = [
      { id: 1, name: 'Employé' },
      { id: 2, name: 'Vétérinaire' },
    ];
    return of(roles);
  }

  // Supprime un utilisateur par id
  deleteUser(id: number): void {
    this.usersCache = this.usersCache.filter((user) => user.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.usersCache));
  }
}
