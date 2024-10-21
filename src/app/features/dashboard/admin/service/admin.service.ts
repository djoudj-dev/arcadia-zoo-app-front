import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/admin'; // URL de votre API NestJS

  constructor(private http: HttpClient) {}

  // Récupère tous les utilisateurs depuis le backend
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Crée un nouvel utilisateur dans le backend
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Supprime un utilisateur par ID dans le backend
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupère les rôles
  getRoles(): Observable<Role[]> {
    // Vous pouvez également créer un endpoint backend pour récupérer les rôles
    const roles = [
      { id: 1, name: 'Employé' },
      { id: 2, name: 'Vétérinaire' },
    ];
    return of(roles);
  }
}
