import { Injectable } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { Observable, of } from 'rxjs';
import { Role } from '../../../core/models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // private http = inject(HttpClient);
  // private apiUrl = environment.apiUrl;

  // users = signal<User[]>([]);

  private localStorageKey = 'users';

  // Récupère tous les utilisateurs à partir de localStorage
  getAllUsers(): Observable<User[]> {
    const users = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    return of(users);
  }

  // Crée un nouvel utilisateur et l'ajoute dans localStorage
  createUser(user: User) {
    const users = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    user.id = users.length ? users[users.length - 1].id + 1 : 1; // Génère un nouvel id
    users.push(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
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
  deleteUser(id: number) {
    let users = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    users = users.filter((user: User) => user.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }
}
